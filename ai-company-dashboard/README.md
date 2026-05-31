# AI-Only Company OS / Cloud Agent Lab 管理ダッシュボード

「AI-Only Company OS / Cloud Agent Lab」のクラウドAIエージェントの統制、コスト管理、およびHuman-in-the-loop意思決定承認を行うための管理ダッシュボードです。

## 💡 主な機能

1. **AI社員エージェントリアルタイム監視**
   - AI CEO, AI CTO, Engineer, Designer, Marketing, DevOps, Security などのクラウドエージェントの状態（稼働中、待機中、警告、停止中）と現在の担当タスク、最終実行時刻、実行タスクの成功率をひと目で把握。
   - 検索フィルター欄により、特定のエージェントやタスクを即座に絞り込み可能。

2. **緊急停止ボタン (KILL SWITCH)**
   - ダッシュボード上部の緊急停止ボタンを押すことで、すべてのAIエージェントにロック指令が伝播し、セーフモードに切り替わります（書き込み・デプロイ・外部API送信が一時凍結されます）。

3. **人間承認待ち (Human-in-the-loop)**
   - AIエージェントが本番環境や外部メディアに影響を与える行動（PRマージ、Xへの投稿、デプロイなど）を起こす際、人間管理者の最終承認を待つゲートウェイ。
   - **承認(Approve)** または **却下(Reject)** を選ぶと、その結果がダッシュボードの監査ログに即座にフィードバックされ、承認リストからスマートにフェードアウトします。

4. **クラウドコスト管理 & APIステータス**
   - OpenAI, Anthropic, Google Cloud, GitHub Copilot/Codex のAPI疎通状況と応答レイテンシ、今月の消費状況を集計。
   - 月間予算枠に対する現在の消費状況、コスト効率、1日の平均稼働費用を視覚化。

5. **アクション監査ログ**
   - AIエージェントの活動イベント履歴を時系列に収集・表示。エラー、警告、情報、人間によるアクション可否ログが一覧で流れます。

---

## 🛠️ 技術スタック

- **Core**: React 19 (JavaScript / JSX)
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS v4 + モダンなグラスモフィズムダークテーマ
- **Animations**: Framer Motion 12 (承認の取り消し・ログ更新などのスムーズな遷移)
- **Icons**: Lucide React 1.17

---

## 📂 ディレクトリ構成

```text
ai-company-dashboard/
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── card.jsx      # 軽量モック Card コンポーネント (shadcn/ui風)
│   │       └── button.jsx    # 軽量モック Button コンポーネント (shadcn/ui風)
│   ├── App.jsx               # ダッシュボード本体および各種ステート管理
│   ├── index.css             # Tailwind CSS v4 読み込みおよびベースグローバルスタイル
│   └── main.jsx              # エントリーポイント
├── vite.config.js            # パスエイリアス (@/*) 解決用 Vite 設定
└── jsconfig.json             # エディタ用パス解決設定
```

---

## 🚀 起動・ビルド手順

### 1. 依存パッケージのインストール
プロジェクトディレクトリに移動し、パッケージをインストールします。（既にインストール済みの場合は不要です）
```bash
cd ai-company-dashboard
npm install
```

### 2. ローカル開発サーバーの起動 (Vite)
WindowsのPowerShellでスクリプトの実行ポリシー制限（`ENOENT` または `PSSecurityException`）が発生する場合は、以下のいずれかの方法で起動してください。

**Command Prompt (cmd) を使用する場合（推奨）:**
```cmd
cmd /c npm run dev
```

**PowerShell でポリシーを一時バイパスする場合:**
```powershell
powershell -ExecutionPolicy Bypass -Command "npm run dev"
```

起動後、ブラウザで以下のアドレスにアクセスします。
- **URL**: [http://localhost:5173/](http://localhost:5173/)

### 3. 本番用ビルドの検証
ビルド成果物の生成および静的解析チェックを行います。
```cmd
cmd /c npm run build
```
成果物は `dist/` ディレクトリ配下に自動出力されます。
