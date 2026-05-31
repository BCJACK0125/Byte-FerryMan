# 資料擺渡人 / Byte Ferryman

[中文](#zh) | [English](#en) | [日本語](#ja)

---

## <a id="zh"></a>中文

**資料擺渡人 / Byte Ferryman** 是一個個人專用、無伺服器的檔案與文字擺渡系統。前端使用 GitHub Pages，資料中繼透過 GitHub Issues，後端由 GitHub Actions 使用 Gmail SMTP 將內容寄回指定信箱，並在完成後清除 Issue 內容。

### 特色
- 前端零密鑰：頁面不含任何 Token 或 API Key。
- 內文 Base64 包裝：降低內網 DPI 對關鍵字的側錄風險。
- 支援拖放附件：使用 GitHub Issue 原生上傳（.zip/.pdf/圖片）。
- 擺渡完成後清痕：Issue 內容覆寫為固定字樣並自動關閉。
- 僅限 Repo Owner 觸發：安全限制明確。

### 快速開始（Fork 使用）
1. 點擊 GitHub 右上角 **Fork** 到自己的帳號。
2. 進入你的 Repo，修改 `index.html`：
   - `REPO_OWNER` 改成你的 GitHub 帳號。
   - `REPO_NAME` 改成你的 Repo 名稱。
3. 啟用 GitHub Pages：
   - Settings → Pages → Source: Deploy from a branch
   - Branch: `main` / `/(root)` → Save
4. 設定 Secrets：Settings → Secrets and variables → Actions → New repository secret
   - `EMAIL_USERNAME`：你的 Gmail 帳號
   - `EMAIL_PASSWORD`：Gmail App Password（建議啟用 2FA 後產生）
   - `EMAIL_TO`（可選）：收件者信箱，未填則寄回 `EMAIL_USERNAME`
5. 開啟 Pages 網址，填好主旨與內文，點 **啟航**。
6. 在新開啟的 Issue 頁面拖放附件 → Submit。

### 郵件寄送與目的地
- 透過 Gmail SMTP（`smtp.gmail.com:465`）寄出。
- 預設收件人為 `EMAIL_USERNAME`，若填 `EMAIL_TO` 則寄往 `EMAIL_TO`。

### 小提醒
- Issue 內容會在寄送成功後被覆寫並關閉。
- 想要這個專案被更多人看見，歡迎幫我按個星星 ⭐

---

## <a id="en"></a>English

**Byte Ferryman** is a personal, serverless ferry for text and files. The front-end runs on GitHub Pages, data transits through GitHub Issues, and GitHub Actions sends everything back via Gmail SMTP, then wipes the Issue content.

### Highlights
- Zero secrets in the front-end.
- Base64-wrapped content to reduce DPI keyword exposure.
- Native GitHub Issue drag-and-drop uploads (.zip/.pdf/images).
- Post-delivery wipe + auto-close.
- Restricted to repository owner only.

### Quick Start (Fork and Use)
1. Click **Fork** on GitHub to your own account.
2. Edit `index.html`:
   - Set `REPO_OWNER` to your GitHub username.
   - Set `REPO_NAME` to your repo name.
3. Enable GitHub Pages:
   - Settings → Pages → Source: Deploy from a branch
   - Branch: `main` / `/(root)` → Save
4. Add Secrets: Settings → Secrets and variables → Actions → New repository secret
   - `EMAIL_USERNAME`: your Gmail address
   - `EMAIL_PASSWORD`: Gmail App Password (enable 2FA first)
   - `EMAIL_TO` (optional): recipient address; defaults to `EMAIL_USERNAME`
5. Open the Pages URL, fill subject/body, click **Launch**.
6. On the Issue page, drag files in → Submit.

### Mail Destination
- Uses Gmail SMTP (`smtp.gmail.com:465`).
- Default recipient is `EMAIL_USERNAME` unless `EMAIL_TO` is provided.

### Note
- The Issue body is wiped and closed after delivery.
- If this helps, please give the repo a star ⭐

---

## <a id="ja"></a>日本語

**資料擺渡人 / Byte Ferryman** は、個人専用のサーバーレスな文字・ファイル搬送システムです。フロントは GitHub Pages、仲介は GitHub Issues、GitHub Actions が Gmail SMTP で送信し、完了後に Issue を消去します。

### 特長
- フロントに秘密鍵なし。
- Base64 包装で DPI のキーワード検知を軽減。
- Issue のドラッグ&ドロップで添付可能（.zip/.pdf/画像）。
- 送信後に内容を消去してクローズ。
- Repo Owner のみ実行。

### 使い方（Fork して利用）
1. GitHub の **Fork** で自分のアカウントにコピー。
2. `index.html` を編集：
   - `REPO_OWNER` を自分のユーザー名に。
   - `REPO_NAME` を自分のリポジトリ名に。
3. GitHub Pages を有効化：
   - Settings → Pages → Source: Deploy from a branch
   - Branch: `main` / `/(root)` → Save
4. Secrets を追加：Settings → Secrets and variables → Actions → New repository secret
   - `EMAIL_USERNAME`：Gmail アドレス
   - `EMAIL_PASSWORD`：Gmail App Password（2FA 推奨）
   - `EMAIL_TO`（任意）：宛先。未設定なら `EMAIL_USERNAME`
5. Pages を開いて主旨/本文入力 → **啟航**。
6. Issue 画面でファイルをドラッグ → Submit。

### 送信先
- Gmail SMTP（`smtp.gmail.com:465`）で送信。
- 宛先は `EMAIL_TO` があればそこ、なければ `EMAIL_USERNAME`。

### ひとこと
- 送信後、Issue は消去・クローズされます。
- 気に入ったらスターを付けてくれると嬉しいです ⭐
