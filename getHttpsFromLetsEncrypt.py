import subprocess
import sys

def install_certbot():
    try:
        subprocess.run(["sudo", "apt", "update"], check=True)
        subprocess.run(["sudo", "apt", "install", "-y", "certbot"], check=True)
        print("Certbotのインストールが完了しました。")
    except subprocess.CalledProcessError:
        print("Certbotのインストールに失敗しました。")
        sys.exit(1)

def get_certificate(domain):
    try:
        subprocess.run(["sudo", "certbot", "certonly", "--standalone", "-d", domain], check=True)
        print(f"{domain}のSSL証明書の取得が完了しました。")
    except subprocess.CalledProcessError:
        print(f"{domain}のSSL証明書の取得に失敗しました。")
        sys.exit(1)

def main():
    print("Let's EncryptからSSL証明書を取得します。")
    
    install_certbot()
    
    domain = input("証明書を取得するドメイン名を入力してください: ")
    get_certificate(domain)
    
    print("証明書の取得プロセスが完了しました。")
    print("証明書は /etc/letsencrypt/live/ ディレクトリに保存されています。")

if __name__ == "__main__":
    main()