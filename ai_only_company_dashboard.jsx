import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const agents = [
  {
    id: "ceo",
    name: "AI CEO",
    icon: UserCog,
    status: "running",
    role: "方針決定・KPI管理",
    task: "今週の開発優先度を整理中",
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
    task: "PR #18 の設計レビュー中",
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
    task: "DM一覧UIを実装中",
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
    task: "待機中",
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
    task: "テストユーザー募集文を作成中",
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
    task: "API応答遅延を検知",
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
    task: "管理者権限変更ログを監査中",
    risk: "medium",
    lastRun: "4分前",
    successRate: 94,
  },
];

const approvals = [
  {
    title: "mainブランチへのPR #18 マージ",
    owner: "AI CTO",
    level: "High",
    reason: "認証周りの変更を含むため人間承認が必要",
  },
  {
    title: "Xへの告知投稿",
    owner: "Marketing-01",
    level: "Medium",
    reason: "外部公開される文章のため確認推奨",
  },
  {
    title: "staging環境への自動デプロイ",
    owner: "DevOps-01",
    level: "Medium",
    reason: "本番ではないがサービス停止リスクあり",
  },
];

const logs = [
  { type: "success", text: "Engineer-01 が lint を通過しました", time: "1分前" },
  { type: "warning", text: "DevOps-01 が API レイテンシ上昇を検知しました", time: "3分前" },
  { type: "success", text: "Security-01 が権限変更ログを確認しました", time: "8分前" },
  { type: "info", text: "AI CEO が今日のKPIを更新しました", time: "12分前" },
  { type: "error", text: "Designer-01 の画像生成タスクが失敗しました", time: "22分前" },
];

function StatusBadge({ status }) {
  const label = {
    running: "稼働中",
    idle: "待機中",
    warning: "警告",
    stopped: "停止中",
  }[status];

  const cls = {
    running: "border-emerald-400/40 bg-emerald-500/10 text-emerald-300",
    idle: "border-slate-400/30 bg-slate-500/10 text-slate-300",
    warning: "border-amber-400/40 bg-amber-500/10 text-amber-300",
    stopped: "border-red-400/40 bg-red-500/10 text-red-300",
  }[status];

  return <span className={`rounded-full border px-2.5 py-1 text-xs ${cls}`}>{label}</span>;
}

function RiskBadge({ risk }) {
  const label = { low: "低", medium: "中", high: "高" }[risk];
  const cls = {
    low: "text-emerald-300",
    medium: "text-amber-300",
    high: "text-red-300",
  }[risk];
  return <span className={`text-xs font-medium ${cls}`}>Risk: {label}</span>;
}

function LogIcon({ type }) {
  if (type === "success") return <CheckCircle2 className="h-4 w-4 text-emerald-300" />;
  if (type === "warning") return <AlertTriangle className="h-4 w-4 text-amber-300" />;
  if (type === "error") return <XCircle className="h-4 w-4 text-red-300" />;
  return <Clock className="h-4 w-4 text-sky-300" />;
}

export default function AIOnlyCompanyDashboard() {
  const [query, setQuery] = useState("");
  const [emergencyStop, setEmergencyStop] = useState(false);

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const target = `${agent.name} ${agent.role} ${agent.task}`.toLowerCase();
      return target.includes(query.toLowerCase());
    });
  }, [query]);

  const runningCount = agents.filter((a) => a.status === "running").length;
  const warningCount = agents.filter((a) => a.status === "warning").length;
  const averageSuccess = Math.round(
    agents.reduce((sum, agent) => sum + agent.successRate, 0) / agents.length,
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/20 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
              <Zap className="h-4 w-4" />
              AI-Only Company OS / Cloud Agent Lab
            </div>
            <h1 className="text-2xl font-bold tracking-tight md:text-4xl">AI社員管理ダッシュボード</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              クラウドAIエージェントの稼働状況、承認待ち、本番リスク、ログを1画面で監視します。
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button className="rounded-2xl bg-white text-slate-950 hover:bg-slate-200">
              <RefreshCw className="mr-2 h-4 w-4" />
              更新
            </Button>
            <Button
              onClick={() => setEmergencyStop((v) => !v)}
              className={`rounded-2xl ${
                emergencyStop ? "bg-emerald-500 hover:bg-emerald-600" : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {emergencyStop ? <PlayCircle className="mr-2 h-4 w-4" /> : <PauseCircle className="mr-2 h-4 w-4" />}
              {emergencyStop ? "再開" : "緊急停止"}
            </Button>
          </div>
        </header>

        {emergencyStop && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-3xl border border-red-400/40 bg-red-500/10 p-4 text-red-100"
          >
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="h-5 w-5" />
              全クラウドAIエージェントの自動実行を停止中
            </div>
            <p className="mt-1 text-sm text-red-100/80">読み取り・ログ閲覧のみ許可。PR作成、投稿、デプロイ、外部送信は停止します。</p>
          </motion.div>
        )}

        <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="rounded-3xl border-white/10 bg-white/[0.04] text-slate-100">
            <CardContent className="p-5">
              <p className="text-sm text-slate-400">稼働中AI</p>
              <p className="mt-2 text-3xl font-bold">{runningCount}</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-white/10 bg-white/[0.04] text-slate-100">
            <CardContent className="p-5">
              <p className="text-sm text-slate-400">警告</p>
              <p className="mt-2 text-3xl font-bold">{warningCount}</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-white/10 bg-white/[0.04] text-slate-100">
            <CardContent className="p-5">
              <p className="text-sm text-slate-400">承認待ち</p>
              <p className="mt-2 text-3xl font-bold">{approvals.length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-white/10 bg-white/[0.04] text-slate-100">
            <CardContent className="p-5">
              <p className="text-sm text-slate-400">平均成功率</p>
              <p className="mt-2 text-3xl font-bold">{averageSuccess}%</p>
            </CardContent>
          </Card>
        </section>

        <main className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl font-semibold">AIエージェント</h2>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="AIエージェント・タスクを検索"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-2 pl-9 pr-3 text-sm outline-none placeholder:text-slate-500 focus:border-sky-400/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredAgents.map((agent, index) => {
                const Icon = agent.icon;
                return (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <Card className="rounded-3xl border-white/10 bg-white/[0.04] text-slate-100 transition hover:border-sky-400/40 hover:bg-white/[0.06]">
                      <CardContent className="p-5">
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="rounded-2xl border border-white/10 bg-slate-900 p-3">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{agent.name}</h3>
                              <p className="text-xs text-slate-400">{agent.role}</p>
                            </div>
                          </div>
                          <StatusBadge status={emergencyStop ? "stopped" : agent.status} />
                        </div>

                        <p className="mb-4 rounded-2xl bg-black/20 p-3 text-sm text-slate-300">{emergencyStop ? "緊急停止により待機中" : agent.task}</p>

                        <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
                          <span>最終実行: {agent.lastRun}</span>
                          <RiskBadge risk={agent.risk} />
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                          <div className="h-full rounded-full bg-slate-200" style={{ width: `${agent.successRate}%` }} />
                        </div>
                        <p className="mt-2 text-xs text-slate-400">成功率 {agent.successRate}%</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </section>

          <aside className="space-y-6">
            <Card className="rounded-3xl border-white/10 bg-white/[0.04] text-slate-100">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <GitPullRequest className="h-5 w-5" />
                  <h2 className="text-xl font-semibold">承認待ち</h2>
                </div>
                <div className="space-y-3">
                  {approvals.map((item) => (
                    <div key={item.title} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <p className="text-sm font-medium">{item.title}</p>
                        <span className="rounded-full bg-white/10 px-2 py-1 text-xs">{item.level}</span>
                      </div>
                      <p className="text-xs text-slate-400">担当: {item.owner}</p>
                      <p className="mt-1 text-xs text-slate-400">{item.reason}</p>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" className="h-8 rounded-xl bg-emerald-500 text-xs hover:bg-emerald-600">承認</Button>
                        <Button size="sm" className="h-8 rounded-xl bg-red-500 text-xs hover:bg-red-600">拒否</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-white/10 bg-white/[0.04] text-slate-100">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  <h2 className="text-xl font-semibold">アクションログ</h2>
                </div>
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div key={`${log.time}-${log.text}`} className="flex gap-3 rounded-2xl bg-black/20 p-3">
                      <LogIcon type={log.type} />
                      <div>
                        <p className="text-sm text-slate-300">{log.text}</p>
                        <p className="mt-1 text-xs text-slate-500">{log.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </main>
      </div>
    </div>
  );
}
