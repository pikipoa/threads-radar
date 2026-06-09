"use client";

import { useState } from "react";

type Anomaly = {
  type: "🔥" | "⚠️" | "🏆" | "💀";
  title: string;
  desc: string;
  metric: string;
};

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Anomaly[] | null>(null);

  const runAnalysis = () => {
    setLoading(true);
    setResult(null);

    // ダミー解析（後でAPI接続に置き換え）
    setTimeout(() => {
      setResult([
        {
          type: "🔥",
          title: "急浮上",
          desc: "『古着屋さんへ行ってきた』",
          metric: "過去平均 1,200 → 8,400 views（7倍）",
        },
        {
          type: "⚠️",
          title: "急失速",
          desc: "直近3投稿の平均が低下",
          metric: "過去平均の22%まで低下",
        },
        {
          type: "🏆",
          title: "安定",
          desc: "エンゲージメント安定",
          metric: "12投稿連続で平均以上",
        },
        {
          type: "💀",
          title: "停滞",
          desc: "投稿が止まっています",
          metric: "最終投稿から18日経過",
        },
      ]);

      setLoading(false);
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-6">

        {/* ヘッダー */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Threads Radar
          </h1>
          <p className="text-zinc-400 text-sm">
            あなたのThreadsに起きている「異変」を可視化します
          </p>
        </div>

        {/* ボタン */}
        <div className="flex justify-center">
          <button
            onClick={runAnalysis}
            className="px-6 py-3 rounded-xl bg-white text-black font-medium hover:bg-zinc-200 transition"
          >
            異変を解析する
          </button>
        </div>

        {/* ローディング */}
        {loading && (
          <div className="text-center text-zinc-400 animate-pulse">
            異変をスキャン中...
          </div>
        )}

        {/* 結果 */}
        {result && (
          <div className="space-y-4">
            <p className="text-zinc-400 text-sm text-center">
              今日の異変　{result.length}件検出
            </p>

            {result.map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2"
              >
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <span>{item.type}</span>
                  <span>{item.title}</span>
                </div>

                <p className="text-zinc-300 text-sm">{item.desc}</p>

                <p className="text-zinc-500 text-xs">{item.metric}</p>
              </div>
            ))}
          </div>
        )}

        {/* フッター */}
        <div className="text-center text-xs text-zinc-600 pt-6">
          v0.1 MVP — anomaly detection system
        </div>
      </div>
    </main>
  );
}
