import os
import shutil
import subprocess

# 証明書ファイルのパスを直接指定
ssl_key_path = '/etc/letsencrypt/live/parivateapps3333.site/privkey.pem'
ssl_cert_path = '/etc/letsencrypt/live/parivateapps3333.site/fullchain.pem'

# HTTPSフォルダのパスを設定
https_folder = os.path.join(os.path.dirname(__file__), 'HTTPS')

# HTTPSフォルダが存在しない場合は作成
if not os.path.exists(https_folder):
    os.makedirs(https_folder)

# 証明書ファイルをコピー
shutil.copy(ssl_key_path, os.path.join(https_folder, 'privkey.pem'))
shutil.copy(ssl_cert_path, os.path.join(https_folder, 'fullchain.pem'))

# 権限を修正（600に設定）
subprocess.run(['chmod', '600', os.path.join(https_folder, 'privkey.pem')])
subprocess.run(['chmod', '600', os.path.join(https_folder, 'fullchain.pem')])

# .envファイルのパスを設定
env_file_path = os.path.join(os.path.dirname(__file__), '.env')

# .envファイルの内容を確認し、必要に応じて更新
if os.path.exists(env_file_path):
    with open(env_file_path, 'r') as f:
        env_contents = f.read()
    
    new_env_contents = env_contents.replace(
        'SSL_KEY_PATH=/etc/letsencrypt/live/parivateapps3333.site/privkey.pem',
        f'SSL_KEY_PATH={os.path.join(https_folder, "privkey.pem")}'
    ).replace(
        'SSL_CERT_PATH=/etc/letsencrypt/live/parivateapps3333.site/fullchain.pem',
        f'SSL_CERT_PATH={os.path.join(https_folder, "fullchain.pem")}'
    )
    
    if new_env_contents != env_contents:
        with open(env_file_path, 'w') as f:
            f.write(new_env_contents)
        print('.envファイルが更新されました。')
    else:
        print('.envファイルは既に最新の状態です。')
else:
    print('.envファイルが見つかりません。')

print('SSL証明書ファイルがコピーされ、権限が修正されました。')