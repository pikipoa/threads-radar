"use client";

import { useState, useEffect } from "react";

const DEMO = {
  username: "furugi_dungeon",
  generatedAt: "2026.06.10",
  summary: { surging: 3, fading: 1, steady: 2, dormant: 1 },
  highlight: { text: "古着屋行ってきた", multiplier: 7.2, avgViews: 1200, thisViews: 8640 },
  accountType: { label: "情緒バグ型", sub: "急浮上と急失速が混在しています", danger: "投稿の68%は伸びる直前で止まっています" },
  anomalyScore: 84,
  percentile: 12,
  stats: { upside: "+240%", stability: "-60%" },
};

function generateCopyText(d: typeof DEMO) {
  return "Threadsレーダーで診断したら「" + d.accountType.label + "」だった。\n\n伸びる投稿と沈む投稿の差が激しいらしい。\n\nthreads-radar.vercel.app";
}

const LOADING_STEPS = [
  "過去投稿を解析中...",
  "異常パターンを検出...",
  "アカウントタイプを推定...",
  "スキャン完了",
];

const shell: React.CSSProperties = {
  minHeight: "100vh", background: "#09090b", display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center", padding: "24px",
  fontFamily: "Inter, system-ui, sans-serif",
};
const cardBase: React.CSSProperties = {
  width: "380px", background: "linear-gradient(160deg, #18181b 0%, #0f0f11 100%)",
  borderRadius: "20px", padding: "24px", border: "1px solid #27272a",
  boxShadow: "0 30px 80px rgba(0,0,0,0.7)", position: "relative", overflow: "hidden",
};
function primaryBtn(bg: string): React.CSSProperties {
  return {
    width: "100%", padding: "14px", background: bg, color: "#fff", border: "none",
    borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer",
    letterSpacing: "0.02em", display: "block",
  };
}
const ghostBtn: React.CSSProperties = {
  width: "100%", padding: "12px", background: "transparent", color: "#52525b",
  border: "1px solid #27272a", borderRadius: "10px", fontSize: "13px",
  cursor: "pointer", display: "block",
};

export default function ThreadsRadar() {
  const [phase, setPhase] = useState("input");
  const [loadingStep, setLoadingStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [pulse, setPulse] = useState(true);
  const d = DEMO;

  function handleDiagnose() { setPhase("loading"); setLoadingStep(0); }

  useEffect(function () {
    if (phase !== "loading") return;
    if (loadingStep < LOADING_STEPS.length - 1) {
      const t = setTimeout(function () {
        setPulse(false);
        setTimeout(function () {
          setLoadingStep(function (s) { return s + 1; });
          setPulse(true);
        }, 150);
      }, 800);
      return function () { clearTimeout(t); };
    } else {
      const t2 = setTimeout(function () { setPhase("reveal"); }, 1000);
      return function () { clearTimeout(t2); };
    }
  }, [phase, loadingStep]);

  function handleCopy() {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(generateCopyText(d));
      }
    } catch (e) {}
    setCopied(true);
    setTimeout(function () { setCopied(false); }, 2500);
  }

  // ── 入力画面 ──
  if (phase === "input") {
    return (
      <div style={shell}>
        <div style={cardBase}>
          <div style={{ textAlign: "center", padding: "8px 0 24px" }}>
            <div style={{ fontSize: "11px", fontWeight: "800", color: "#52525b", letterSpacing: "0.15em", marginBottom: "20px" }}>THREADS RADAR</div>
            <p style={{ fontSize: "22px", fontWeight: "900", color: "#fff", lineHeight: 1.3, marginBottom: "8px" }}>あなたのThreadsの<br />異変を発見します。</p>
            <p style={{ fontSize: "12px", color: "#52525b", marginBottom: "32px" }}>ログインするだけ。トークン入力不要。</p>
            <button onClick={handleDiagnose} style={primaryBtn("#ef4444")}>Threadsでログインして診断する</button>
            <button onClick={handleDiagnose} style={{ ...ghostBtn, marginTop: "10px" }}>デモを試す</button>
          </div>
        </div>
      </div>
    );
  }

  // ── ローディング画面 ──
  if (phase === "loading") {
    return (
      <div style={shell}>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes pulseIn { 0% { opacity: 0.3; } 100% { opacity: 1; } }
        `}</style>
        <div style={cardBase}>
          <div style={{ padding: "40px 0", textAlign: "center" }}>
            <div style={{ fontSize: "11px", fontWeight: "800", color: "#52525b", letterSpacing: "0.15em", marginBottom: "32px" }}>THREADS RADAR</div>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", border: "3px solid #27272a", borderTop: "3px solid #ef4444", margin: "0 auto 28px", animation: "spin 0.8s linear infinite" }} />
            <div style={{ display: "inline-flex", flexDirection: "column", gap: "14px", alignItems: "flex-start" }}>
              {LOADING_STEPS.map(function (step, i) {
                const isActive = i === loadingStep;
                const isDone = i < loadingStep;
                return (
                  <div key={i} style={{
                    fontSize: "13px",
                    color: isDone ? "#3f3f46" : isActive ? "#fff" : "#27272a",
                    fontWeight: isActive ? "700" : "400",
                    display: "flex", alignItems: "center", gap: "10px",
                    animation: isActive && pulse ? "pulseIn 0.3s ease" : "none",
                    transition: "color 0.3s",
                  }}>
                    <span style={{
                      fontSize: "11px",
                      color: isDone ? "#3f3f46" : isActive ? "#ef4444" : "#27272a",
                    }}>
                      {isDone ? "✓" : isActive ? "▶" : "○"}
                    </span>
                    {step}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── 宣告画面 ──
  if (phase === "reveal") {
    return (
      <div style={shell}>
        <div style={cardBase}>
          <div style={{ padding: "40px 16px 32px", textAlign: "center" }}>
            <div style={{ fontSize: "11px", fontWeight: "800", color: "#52525b", letterSpacing: "0.15em", marginBottom: "28px" }}>THREADS RADAR</div>
            <div style={{ fontSize: "11px", color: "#ef4444", letterSpacing: "0.12em", fontWeight: "700", marginBottom: "12px" }}>
              異常パターンを検出
            </div>
            <div style={{ fontSize: "13px", color: "#71717a", marginBottom: "16px" }}>@{d.username}</div>
            <div style={{ fontSize: "32px", fontWeight: "900", color: "#fff", lineHeight: 1.2, marginBottom: "20px", letterSpacing: "-0.02em" }}>
              {d.accountType.label}
            </div>
            <div style={{
              display: "inline-block",
              fontSize: "11px", fontWeight: "700",
              color: "#f87171",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "6px",
              padding: "5px 12px",
              marginBottom: "32px",
              letterSpacing: "0.06em",
            }}>
              異常度ランキング 上位{d.percentile}%
            </div>
            <button onClick={function () { setPhase("result"); }} style={primaryBtn("#ef4444")}>
              ▶ 異常レポートを見る
            </button>
            <div style={{ marginTop: "12px", fontSize: "10px", color: "#3f3f46" }}>
              ↑ この画面をスクショしてシェアするのもあり
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── 結果カード画面 ──
  const stat = [
    { e: "🔥", l: "急浮上", v: d.summary.surging, c: "#f97316" },
    { e: "⚠️", l: "急失速", v: d.summary.fading, c: "#eab308" },
    { e: "🏆", l: "安定", v: d.summary.steady, c: "#22c55e" },
    { e: "💀", l: "停滞", v: d.summary.dormant, c: "#52525b" },
  ];

  return (
    <div style={shell}>
      <div style={cardBase}>
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "240px", height: "240px", background: "radial-gradient(circle, rgba(239,68,68,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <div style={{ fontSize: "11px", fontWeight: "800", color: "#52525b", letterSpacing: "0.15em" }}>THREADS RADAR</div>
          <div style={{ fontSize: "10px", color: "#3f3f46" }}>{d.generatedAt}</div>
        </div>

        <div style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #1f1f23" }}>
          <div style={{ fontSize: "10px", color: "#ef4444", letterSpacing: "0.12em", fontWeight: "700", marginBottom: "8px" }}>異常パターン検出 / @{d.username}</div>
          <div style={{ fontSize: "24px", fontWeight: "900", color: "#fff", lineHeight: 1.2, marginBottom: "6px" }}>{d.accountType.label}</div>
          <div style={{ fontSize: "12px", color: "#71717a", marginBottom: "10px" }}>{d.accountType.sub}</div>
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", padding: "10px 12px", fontSize: "12px", color: "#fca5a5", lineHeight: 1.5 }}>
            ⚠️ {d.accountType.danger}
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "14px", textAlign: "center", border: "1px solid #27272a" }}>
            <div style={{ fontSize: "9px", color: "#52525b", letterSpacing: "0.1em", marginBottom: "4px" }}>異常スコア</div>
            <div style={{ fontSize: "34px", fontWeight: "900", color: "#ef4444", lineHeight: 1 }}>{d.anomalyScore}</div>
            <div style={{ fontSize: "9px", color: "#52525b", marginTop: "4px" }}>/ 100</div>
            <div style={{ marginTop: "8px", fontSize: "10px", color: "#f87171", background: "rgba(239,68,68,0.1)", borderRadius: "4px", padding: "3px 6px" }}>上位 {d.percentile}%</div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ flex: 1, background: "rgba(249,115,22,0.06)", borderRadius: "10px", padding: "10px 12px", border: "1px solid rgba(249,115,22,0.15)" }}>
              <div style={{ fontSize: "9px", color: "#71717a", marginBottom: "2px" }}>爆発力</div>
              <div style={{ fontSize: "20px", fontWeight: "900", color: "#f97316" }}>{d.stats.upside}</div>
            </div>
            <div style={{ flex: 1, background: "rgba(239,68,68,0.06)", borderRadius: "10px", padding: "10px 12px", border: "1px solid rgba(239,68,68,0.15)" }}>
              <div style={{ fontSize: "9px", color: "#71717a", marginBottom: "2px" }}>安定性</div>
              <div style={{ fontSize: "20px", fontWeight: "900", color: "#ef4444" }}>{d.stats.stability}</div>
            </div>
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "12px", padding: "14px", marginBottom: "14px", border: "1px solid #27272a" }}>
          <div style={{ fontSize: "9px", color: "#52525b", letterSpacing: "0.1em", marginBottom: "8px" }}>アルゴリズムに&quot;読まれた&quot;投稿</div>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#e4e4e7", marginBottom: "10px" }}>「{d.highlight.text}」</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "5px" }}>
              <span style={{ fontSize: "28px", fontWeight: "900", color: "#f97316", lineHeight: 1 }}>{d.highlight.multiplier}x</span>
              <span style={{ fontSize: "10px", color: "#71717a" }}>の異常値</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "10px", color: "#52525b" }}>平均 {d.highlight.avgViews.toLocaleString()} views</div>
              <div style={{ fontSize: "10px", color: "#f97316" }}>この投稿 {d.highlight.thisViews.toLocaleString()} views</div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "6px", marginBottom: "16px" }}>
          {stat.map(function (s) {
            return (
              <div key={s.l} style={{ textAlign: "center", padding: "8px 4px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid " + s.c + "22" }}>
                <div style={{ fontSize: "14px" }}>{s.e}</div>
                <div style={{ fontSize: "16px", fontWeight: "900", color: s.c, lineHeight: 1.1 }}>{s.v}</div>
                <div style={{ fontSize: "8px", color: "#52525b", marginTop: "2px" }}>{s.l}</div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "9px", color: "#27272a", letterSpacing: "0.08em" }}>threads-radar.vercel.app</span>
          <div style={{ display: "flex", gap: "3px" }}>
            {["#f97316", "#eab308", "#22c55e", "#ef4444"].map(function (c, i) {
              return <div key={i} style={{ width: "4px", height: "4px", borderRadius: "50%", background: c, opacity: 0.5 }} />;
            })}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "16px", width: "380px" }}>
        <button onClick={handleCopy} style={primaryBtn(copied ? "#22c55e" : "#ef4444")}>
          {copied ? "✓ コピーしました" : "📋 投稿文をコピーしてシェア"}
        </button>
        <div style={{ marginTop: "10px", padding: "12px 14px", background: "#111113", borderRadius: "10px", border: "1px solid #27272a", fontSize: "12px", color: "#52525b", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
          {generateCopyText(d)}
        </div>
      </div>
    </div>
  );
}
