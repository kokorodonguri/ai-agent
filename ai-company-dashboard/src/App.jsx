import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Bot,
  CheckCircle2,
  Clock,
  Code2,
  GitPullRequest,
  Megaphone,
  PauseCircle,
  PlayCircle,
  RefreshCw,
  Search,
  Shield,
  Terminal,
  UserCog,
  XCircle,
  Zap,
  DollarSign,
  Cpu,
  TrendingUp,
  Percent,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Static agent configurations
const initialAgents = [
  {
    id: "ceo",
    name: "AI CEO",
    icon: UserCog,
    status: "running",
    role: "方針決定・KPI管理",
    task: "今週の開発優先度および売上目標の再調整中",
    risk: "low",
    lastRun: "2分前",
    successRate: 96,
  },
  {
    id: "cto",
    name: "AI CTO",
    icon: Code2,
    status: "running",
    role: "設計・コードレビュー",
    task: "認証モジュールのPR #18 設計及びセキュリティレビュー中",
    risk: "low",
    lastRun: "5分前",
    successRate: 92,
  },
  {
    id: "engineer",
    name: "Engineer-01",
    icon: Terminal,
    status: "running",
    role: "実装・テスト・修正",
    task: "メッセージUIおよびTailwindCSSのレイアウト崩れ修正中",
    risk: "medium",
    lastRun: "1分前",
    successRate: 88,
  },
  {
    id: "designer",
    name: "Designer-01",
    icon: Bot,
    status: "idle",
    role: "UI/UX・LP改善",
    task: "ダッシュボード用新アセットの生成タスク待機中",
    risk: "low",
    lastRun: "28分前",
    successRate: 90,
  },
  {
    id: "marketing",
    name: "Marketing-01",
    icon: Megaphone,
    status: "running",
    role: "X投稿・宣伝文・SEO",
    task: "AI-Only Companyサービス開始に伴う告知文案の推敲中",
    risk: "low",
    lastRun: "7分前",
    successRate: 84,
  },
  {
    id: "devops",
    name: "DevOps-01",
    icon: Activity,
    status: "warning",
    role: "監視・デプロイ補助",
    task: "AWS Lambda応答速度の軽微な遅延を検知、経路変更を試行中",
    risk: "high",
    lastRun: "30秒前",
    successRate: 81,
  },
  {
    id: "security",
    name: "Security-01",
    icon: Shield,
    status: "running",
    role: "権限監査・異常検知",
    task: "クラウドインフラにおけるIAM権限ポリシーの監査ログ巡回中",
    risk: "medium",
    lastRun: "4分前",
    successRate: 94,
  },
];

const initialApprovals = [
  {
    title: "mainブランチへのPR #18 マージ",
    owner: "AI CTO",
    level: "High",
    reason: "ユーザー認証機能の書き換えを含むため人間承認が必要",
  },
  {
    title: "X(旧Twitter)への広報投稿",
    owner: "Marketing-01",
    level: "Medium",
    reason: "外部公開用のアナウンス文面であるため最終チェックを推奨",
  },
  {
    title: "Staging環境への自動デプロイ",
    owner: "DevOps-01",
    level: "Medium",
    reason: "スキーママイグレーションを伴うため整合性チェックを推奨",
  },
];

const initialLogs = [
  { type: "success", text: "Engineer-01 が lint チェックおよびテストを通過しました", time: "1分前" },
  { type: "warning", text: "DevOps-01 が API レイテンシの上昇(250ms)を検知しました", time: "3分前" },
  { type: "success", text: "Security-01 が不審なIPからのログイン試行をブロックしました", time: "8分前" },
  { type: "info", text: "AI CEO が本日の重要KPI(目標アクティブユーザー)を設定しました", time: "12分前" },
  { type: "error", text: "Designer-01 のDALL-E 3画像生成APIリクエストがタイムアウトしました", time: "22分前" },
];

function StatusBadge({ status }) {
  const label = {
    running: "稼働中",
    idle: "待機中",
    warning: "警告",
    stopped: "停止中",
  }[status];

  const cls = {
    running: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    idle: "border-slate-500/30 bg-slate-500/10 text-slate-400",
    warning: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    stopped: "border-rose-500/30 bg-rose-500/10 text-rose-400",
  }[status];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide ${cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status === "running" ? "bg-emerald-400 animate-pulse" : status === "warning" ? "bg-amber-400 animate-pulse" : status === "stopped" ? "bg-rose-400" : "bg-slate-400"}`} />
      {label}
    </span>
  );
}

function RiskBadge({ risk }) {
  const label = { low: "低", medium: "中", high: "高" }[risk];
  const cls = {
    low: "text-emerald-400 bg-emerald-500/5 border-emerald-500/20",
    medium: "text-amber-400 bg-amber-500/5 border-amber-500/20",
    high: "text-rose-400 bg-rose-500/5 border-rose-500/20",
  }[risk];
  return <span className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${cls}`}>リスク: {label}</span>;
}

function LogIcon({ type }) {
  if (type === "success") return <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />;
  if (type === "warning") return <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0" />;
  if (type === "error") return <XCircle className="h-4 w-4 text-rose-400 flex-shrink-0" />;
  return <Clock className="h-4 w-4 text-sky-400 flex-shrink-0" />;
}

export default function App() {
  const [query, setQuery] = useState("");
  const [emergencyStop, setEmergencyStop] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [approvalsList, setApprovalsList] = useState(initialApprovals);
  const [logsList, setLogsList] = useState(initialLogs);

  // Dynamic values calculated from current states
  const runningCount = emergencyStop ? 0 : initialAgents.filter((a) => a.status === "running").length;
  const warningCount = emergencyStop ? 0 : initialAgents.filter((a) => a.status === "warning").length;
  const averageSuccess = Math.round(
    initialAgents.reduce((sum, agent) => sum + agent.successRate, 0) / initialAgents.length,
  );

  // Interactive functions
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLogsList((prev) => [
        {
          type: "info",
          text: "システム更新：すべてのAIエージェントのヘルスチェックを完了しました",
          time: "現在",
        },
        ...prev.slice(0, 4),
      ]);
    }, 600);
  };

  const handleApprove = (title, owner) => {
    setApprovalsList((prev) => prev.filter((item) => item.title !== title));
    setLogsList((prev) => [
      {
        type: "success",
        text: `管理者(Human-in-the-loop)が承認しました: "${title}" (申請者: ${owner})`,
        time: "現在",
      },
      ...prev,
    ]);
  };

  const handleReject = (title, owner) => {
    setApprovalsList((prev) => prev.filter((item) => item.title !== title));
    setLogsList((prev) => [
      {
        type: "error",
        text: `管理者(Human-in-the-loop)が拒否しました: "${title}" (申請者: ${owner})`,
        time: "現在",
      },
      ...prev,
    ]);
  };

  const filteredAgents = useMemo(() => {
    return initialAgents.filter((agent) => {
      const target = `${agent.name} ${agent.role} ${agent.task}`.toLowerCase();
      return target.includes(query.toLowerCase());
    });
  }, [query]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100 selection:bg-sky-500/30 selection:text-white">
      {/* Background Decorative Ambient Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-sky-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute top-1/3 right-10 -z-10 h-[600px] w-[600px] rounded-full bg-indigo-500/5 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-10 left-10 -z-10 h-[450px] w-[450px] rounded-full bg-purple-500/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Top Header Card */}
        <header className="mb-8 rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
                <Zap className="h-4 w-4 animate-pulse" />
                Cloud Agent Operations Center
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                AI-Only Company OS
              </h1>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-3xl">
                クラウドAIエージェントの稼働監視、意思決定の人間承認（Human-in-the-loop）、
                リソースコスト、および実行ログを統合した次世代型ガバナンスダッシュボード。
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading}
                className="group border-white/10 hover:border-sky-500/40"
              >
                <RefreshCw className={`mr-2 h-4 w-4 text-slate-300 transition-transform duration-500 group-hover:rotate-180 ${isLoading ? "animate-spin text-sky-400" : ""}`} />
                {isLoading ? "更新中..." : "データを更新"}
              </Button>
              <Button
                variant={emergencyStop ? "default" : "destructive"}
                onClick={() => {
                  setEmergencyStop((v) => !v);
                  setLogsList((prev) => [
                    {
                      type: emergencyStop ? "success" : "error",
                      text: emergencyStop ? "緊急停止モードが解除され、AI社員の自律タスクが再開されました" : "人間管理者によって【緊急停止】が発令されました。全AI社員を強制ロックします",
                      time: "現在",
                    },
                    ...prev,
                  ]);
                }}
                className={`flex items-center gap-2 px-5 font-semibold ${emergencyStop ? "bg-emerald-500 hover:bg-emerald-600 text-white" : ""}`}
              >
                {emergencyStop ? (
                  <>
                    <PlayCircle className="h-5 w-5" />
                    <span>運用再開 (Resume)</span>
                  </>
                ) : (
                  <>
                    <PauseCircle className="h-5 w-5" />
                    <span>緊急停止 (KILL SWITCH)</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Emergency Stop Banner Overlay */}
        <AnimatePresence>
          {emergencyStop && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="mb-8 overflow-hidden"
            >
              <div className="rounded-3xl border border-rose-500/30 bg-rose-950/20 p-5 backdrop-blur-md">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-rose-500/10 p-2.5 text-rose-400">
                    <AlertTriangle className="h-6 w-6 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-rose-300">
                      緊急停止措置発令中 — システムはセーフモードです
                    </h3>
                    <p className="mt-1 text-sm text-slate-300 leading-relaxed">
                      現在、すべてのAIエージェントの書き込み、PRマージ、告知送信、外部API経由のデプロイアクションを一時凍結しています。
                      システムは読み取り専用およびログ同期モードに切り替わっており、人間管理者の承認または再開指示があるまで自律動作は行われません。
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top KPI Cards Grid */}
        <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card className="hover:border-white/15 transition-all">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">稼働中AI</p>
                <div className="rounded-xl bg-emerald-500/10 p-1.5 text-emerald-400">
                  <Cpu className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-4xl font-extrabold tracking-tight text-white">
                {runningCount} <span className="text-sm font-normal text-slate-400">/ {initialAgents.length}</span>
              </p>
            </CardContent>
          </Card>
          <Card className="hover:border-white/15 transition-all">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">未解決の警告</p>
                <div className="rounded-xl bg-amber-500/10 p-1.5 text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-4xl font-extrabold tracking-tight text-white">{warningCount}</p>
            </CardContent>
          </Card>
          <Card className="hover:border-white/15 transition-all">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">承認待ちタスク</p>
                <div className="rounded-xl bg-sky-500/10 p-1.5 text-sky-400">
                  <GitPullRequest className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-4xl font-extrabold tracking-tight text-white">{approvalsList.length}</p>
            </CardContent>
          </Card>
          <Card className="hover:border-white/15 transition-all">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">平均成功率</p>
                <div className="rounded-xl bg-purple-500/10 p-1.5 text-purple-400">
                  <Percent className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-4xl font-extrabold tracking-tight text-white">
                {averageSuccess}<span className="text-2xl font-bold text-slate-400">%</span>
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Main Dashboard Layout */}
        <main className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Left Column: AI Agents List (Grid Area) */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-sky-400" />
                  AI社員エージェント一覧
                </h2>
                <p className="text-xs text-slate-400 mt-1">クラウド上で稼働する各AI職種の自律処理状況</p>
              </div>

              {/* Advanced Search Input */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="エージェント名、役割、タスクで検索..."
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.02] py-2 pl-9 pr-4 text-xs text-slate-100 outline-none placeholder:text-slate-500 transition-all focus:border-sky-500/40 focus:bg-white/[0.04]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredAgents.map((agent, index) => {
                const IconComponent = agent.icon;
                const status = emergencyStop ? "stopped" : agent.status;

                return (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="h-full border-white/10 bg-white/[0.02] hover:border-sky-500/30 hover:bg-white/[0.04] transition-all duration-300">
                      <CardContent className="p-5">
                        
                        {/* Agent Avatar and Header */}
                        <div className="mb-4 flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-2.5 text-slate-200">
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-bold text-white text-sm tracking-wide">{agent.name}</h3>
                              <p className="text-xs text-slate-400">{agent.role}</p>
                            </div>
                          </div>
                          <StatusBadge status={status} />
                        </div>

                        {/* Current Task Description */}
                        <p className="mb-4 min-h-[52px] rounded-xl bg-slate-950/60 p-3 text-xs leading-relaxed text-slate-300 border border-white/5">
                          {status === "stopped" ? "緊急停止命令により全自動タスクがロックされています。" : agent.task}
                        </p>

                        {/* Last Run & Risk Level */}
                        <div className="mb-4 flex items-center justify-between text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            最終実行: {agent.lastRun}
                          </span>
                          <RiskBadge risk={agent.risk} />
                        </div>

                        {/* Success Rate Progress Bar */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-slate-400">実行タスク成功率</span>
                            <span className="text-slate-200">{agent.successRate}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-slate-800 border border-white/5">
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ${agent.successRate >= 90 ? "bg-gradient-to-r from-sky-500 to-emerald-400" : agent.successRate >= 80 ? "bg-gradient-to-r from-sky-500 to-amber-400" : "bg-gradient-to-r from-sky-500 to-rose-400"}`}
                              style={{ width: `${agent.successRate}%` }}
                            />
                          </div>
                        </div>

                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
              {filteredAgents.length === 0 && (
                <div className="col-span-2 text-center py-12 rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
                  <p className="text-sm text-slate-500">条件に一致するAIエージェントが見つかりません。</p>
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Sidebar Operations (Cost, Providers, Approvals, Log) */}
          <aside className="space-y-6">
            
            {/* Cost Management Card */}
            <Card className="border-white/10 bg-white/[0.02] shadow-xl">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                  <DollarSign className="h-5 w-5 text-emerald-400" />
                  クラウドコスト管理
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">API利用およびクラウド計算量コスト</CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400">今月の利用金額 (Spent)</span>
                  <span className="text-sm text-slate-400">予算上限: $2,000.00</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white">$684.50</span>
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp className="h-3 w-3" />
                    34.2% 消費
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden border border-white/5">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-sky-400 rounded-full" style={{ width: "34.2%" }} />
                  </div>
                </div>

                {/* Detailed breakdown */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="rounded-xl bg-slate-900/60 p-2.5 border border-white/5">
                    <p className="text-slate-400">1日平均料金</p>
                    <p className="mt-1 font-bold text-white">$22.82</p>
                  </div>
                  <div className="rounded-xl bg-slate-900/60 p-2.5 border border-white/5">
                    <p className="text-slate-400">コスト効率</p>
                    <p className="mt-1 font-bold text-emerald-400">94.2% (優)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Agent Provider Connectivity & Cost Card */}
            <Card className="border-white/10 bg-white/[0.02] shadow-xl">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                  <Activity className="h-5 w-5 text-sky-400" />
                  Agent Providers Status
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">提携中クラウドLLM API接続状況</CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-3.5">
                {[
                  { name: "OpenAI", status: "Active", latency: "112ms", spent: "$312.40", dotColor: "bg-emerald-400" },
                  { name: "Anthropic", status: "Active", latency: "145ms", spent: "$224.10", dotColor: "bg-emerald-400" },
                  { name: "Google Cloud", status: "Active", latency: "98ms", spent: "$128.00", dotColor: "bg-emerald-400" },
                  { name: "GitHub Copilot / Codex", status: "Active", latency: "65ms", spent: "$20.00", dotColor: "bg-emerald-400" }
                ].map((prov) => (
                  <div key={prov.name} className="flex items-center justify-between rounded-xl bg-slate-900/40 p-3 border border-white/5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${prov.dotColor}`} />
                        <span className="text-xs font-bold text-slate-200">{prov.name}</span>
                      </div>
                      <p className="mt-1 text-[10px] text-slate-400">今月消費: {prov.spent}</p>
                    </div>
                    <div className="text-right">
                      <span className="rounded bg-sky-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-sky-400 border border-sky-500/20">
                        {prov.latency}
                      </span>
                      <p className="mt-1 text-[10px] text-slate-500">API 正常</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Pending Approvals (Human-in-the-loop) */}
            <Card className="border-white/10 bg-white/[0.02] shadow-xl">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                  <GitPullRequest className="h-5 w-5 text-indigo-400" />
                  人間承認待ち (Human-in-the-loop)
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  AI社員からのデプロイ・マージ・投稿実行要求
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {approvalsList.map((item) => (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                        animate={{ opacity: 1, height: "auto", scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 space-y-3 shadow-inner">
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="text-xs font-bold text-white leading-normal">{item.title}</h4>
                            <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${item.level === "High" ? "bg-rose-500/15 text-rose-400 border border-rose-500/20" : "bg-amber-500/15 text-amber-400 border border-amber-500/20"}`}>
                              {item.level}
                            </span>
                          </div>

                          <div className="text-[11px] space-y-1 text-slate-400">
                            <p>申請元: <span className="text-slate-200 font-semibold">{item.owner}</span></p>
                            <p className="italic text-slate-500 bg-white/[0.01] p-1.5 rounded-lg border border-white/5">{item.reason}</p>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(item.title, item.owner)}
                              className="h-8 flex-1 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
                            >
                              承認 (Approve)
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleReject(item.title, item.owner)}
                              className="h-8 flex-1 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:bg-rose-500/30 font-bold"
                            >
                              却下 (Reject)
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {approvalsList.length === 0 && (
                    <div className="text-center py-6 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                      <p className="text-xs text-slate-500">保留中の承認待ちタスクはありません。</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Live Actions Audit Logs */}
            <Card className="border-white/10 bg-white/[0.02] shadow-xl">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                  <Activity className="h-5 w-5 text-sky-400 animate-pulse" />
                  アクション監査ログ
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  クラウドエージェント動作のリアルタイム集計
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                  <AnimatePresence initial={false}>
                    {logsList.map((log, idx) => (
                      <motion.div
                        key={`${log.time}-${log.text}-${idx}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-3 rounded-xl bg-slate-900/60 p-3 border border-white/5"
                      >
                        <div className="mt-0.5">
                          <LogIcon type={log.type} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-300 leading-normal break-all">{log.text}</p>
                          <p className="mt-1 text-[9px] text-slate-500">{log.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

          </aside>
        </main>

        {/* Footer info */}
        <footer className="mt-16 text-center border-t border-white/10 pt-8">
          <p className="text-xs text-slate-500">
            &copy; 2026 Cloud Agent Lab. Cloud Governance Node Active.
          </p>
        </footer>

      </div>
    </div>
  );
}
