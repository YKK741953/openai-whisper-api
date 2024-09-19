import subprocess
import logging

def renew_certificates():
    try:
        # 証明書の更新ロジック
        subprocess.run(['certbot', 'renew'], check=True)

        # 証明書更新後に copy_ssl_certs.py を sudo で実行
        subprocess.run(['sudo', 'python3', 'openai-whisper-api/copy_ssl_certs.py'], check=True)
    except subprocess.CalledProcessError as e:
        logging.error('証明書の更新に失敗しました: %s', e.stderr.decode())

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    renew_certificates()