import os
import shutil
import subprocess
import logging
from dotenv import load_dotenv

# ログの設定
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def load_environment():
    """.envファイルを読み込む"""
    load_dotenv()
    ssl_key_path = os.getenv('ORIGINAL_SSL_KEY_PATH')
    ssl_cert_path = os.getenv('ORIGINAL_SSL_CERT_PATH')
    
    if not ssl_key_path or not ssl_cert_path:
        logging.error('環境変数 ORIGINAL_SSL_KEY_PATH または ORIGINAL_SSL_CERT_PATH が設定されていません。')
        exit(1)
    
    return ssl_key_path, ssl_cert_path

def create_https_folder(folder_path):
    """HTTPSフォルダを作成する"""
    try:
        os.makedirs(folder_path, exist_ok=True)
        logging.info(f'HTTPSフォルダを作成または既存のフォルダを使用: {folder_path}')
    except Exception as e:
        logging.error(f'HTTPSフォルダの作成に失敗しました: {e}')
        exit(1)

def copy_certificates(src_key, src_cert, dest_folder):
    """証明書ファイルをコピーする"""
    try:
        shutil.copy(src_key, os.path.join(dest_folder, 'privkey.pem'))
        shutil.copy(src_cert, os.path.join(dest_folder, 'fullchain.pem'))
        logging.info('証明書ファイルをコピーしました。')
    except Exception as e:
        logging.error(f'証明書ファイルのコピーに失敗しました: {e}')
        exit(1)

def set_permissions(dest_folder):
    """証明書ファイルの権限を修正する"""
    try:
        subprocess.run(['chmod', '600', os.path.join(dest_folder, 'privkey.pem')], check=True)
        subprocess.run(['chmod', '600', os.path.join(dest_folder, 'fullchain.pem')], check=True)
        logging.info('証明書ファイルの権限を修正しました。')
    except subprocess.CalledProcessError as e:
        logging.error(f'権限の修正に失敗しました: {e}')
        exit(1)

def update_env_file(env_path, new_key_path, new_cert_path):
    """.envファイルを更新する"""
    try:
        with open(env_path, 'r') as f:
            env_contents = f.read()
        
        new_env_contents = env_contents.replace(
            os.getenv('ORIGINAL_SSL_KEY_PATH'),
            f'SSL_KEY_PATH={new_key_path}'
        ).replace(
            os.getenv('ORIGINAL_SSL_CERT_PATH'),
            f'SSL_CERT_PATH={new_cert_path}'
        )
        
        if new_env_contents != env_contents:
            with open(env_path, 'w') as f:
                f.write(new_env_contents)
            logging.info('.envファイルが更新されました。')
        else:
            logging.info('.envファイルは既に最新の状態です。')
    except Exception as e:
        logging.error(f'.envファイルの更新中にエラーが発生しました: {e}')
        exit(1)

def main():
    ssl_key_path, ssl_cert_path = load_environment()
    https_folder = os.path.join(os.path.dirname(__file__), 'HTTPS')
    create_https_folder(https_folder)
    copy_certificates(ssl_key_path, ssl_cert_path, https_folder)
    set_permissions(https_folder)
    
    env_file_path = os.path.join(os.path.dirname(__file__), '.env')
    if os.path.exists(env_file_path):
        update_env_file(
            env_file_path,
            os.path.join(https_folder, 'privkey.pem'),
            os.path.join(https_folder, 'fullchain.pem')
        )
    else:
        logging.warning('.envファイルが見つかりません。')

    logging.info('SSL証明書ファイルがコピーされ、権限が修正されました。')

if __name__ == "__main__":
    main()