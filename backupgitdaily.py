#v2: git initがない場合は作成するようにした。 2024/08/23

import os
import subprocess
from datetime import datetime
import tkinter as tk
from tkinter import simpledialog

# Git リポジトリのパス
#repo_path = r"D:\Yuki\Dropbox\AI\AI_arts\automatic_pictupdateproject"
#このファイルのあるディレクトリを指定
repo_path = os.path.dirname(os.path.abspath(__file__))

# 作業ディレクトリを変更
os.chdir(repo_path)
log_file_path = os.path.join(repo_path, "git_commit_log.txt")
#fileがない場合は作成
if not os.path.exists(log_file_path):
    with open(log_file_path, "w") as log_file:
        pass

error_log_file_path = os.path.join(repo_path, "git_commit_error_log.txt")
#fileがない場合は作成
if not os.path.exists(error_log_file_path):
    with open(error_log_file_path, "w") as error_log:
        pass

# Gitリポジトリが初期化されているか確認
if not os.path.exists(os.path.join(repo_path, '.git')):
    try:
        # git initを実行
        subprocess.run(["git", "init"], check=True)
        print("Gitリポジトリを初期化しました。")
        
        # ログファイルに記録
        with open(log_file_path, "a") as log_file:
            log_file.write(f"Gitリポジトリを初期化しました at {datetime.now()}\n")
    except subprocess.CalledProcessError as e:
        print(f"Gitリポジトリの初期化中にエラーが発生しました: {e}")
        # エラーログの記録
        with open(error_log_file_path, "a") as error_log:
            error_log.write(f"Gitリポジトリの初期化中にエラーが発生しました at {datetime.now()}: {e}\n")
        exit(1)  # エラーが発生した場合はスクリプトを終了

try:
    # 変更をステージングエリアに追加
    subprocess.run(["git", "add", "."], check=True)

    # ユーザーからの入力を取得
    root = tk.Tk()
    root.withdraw()  # メインウィンドウを非表示にする
    user_comment = simpledialog.askstring("コミットメッセージ", "コミットメッセージを入力してください：")

    # コミットメッセージを生成（ユーザーの入力と日付を含む）
    commit_message = f"{user_comment} - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"

    # コミットを実行
    subprocess.run(["git", "commit", "-m", commit_message], check=True)

    print("Commit successful")

    # 必要に応じてプッシュを追加
    subprocess.run(["git", "push", "origin", "main"], check=True)

    print("push success!")


    # ログファイルに記録（オプション）
    
    with open(log_file_path, "a") as log_file:
        log_file.write(f"Commit executed at {datetime.now()}\n")

except subprocess.CalledProcessError as e:
    print(f"An error occurred: {e}")
    # エラーログの記録
    with open(error_log_file_path, "a") as error_log:
        error_log.write(f"Error occurred at {datetime.now()}: {e}\n")