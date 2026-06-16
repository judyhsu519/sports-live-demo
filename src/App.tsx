import React, { useEffect, useState } from "react";
import { Player } from "@remotion/player";
import { HeroVideo, TOTAL_FRAMES, ASIAD_FPS } from "./template/HeroVideo";
import type { BoardData } from "./template/types";

export const App: React.FC = () => {
  const [data, setData] = useState<BoardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 加 ?t= 時間戳避免瀏覽器快取舊資料，確保看到最新一次抓的內容
    fetch(`./data.json?t=${Date.now()}`)
      .then((r) => r.json())
      .then((d: BoardData) => setData(d))
      .catch((e) => setError(String(e)));
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d1024",
        color: "#fff",
        fontFamily: "system-ui, -apple-system, 'Noto Sans TC', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 16px",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>
        ⚾ MLB 今日賽事看板
      </h1>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", margin: "0 0 16px" }}>
        版型 C 實驗版 · 資料來源 ESPN · 會自動定期更新
        {data?.updatedAt ? ` · 最後更新 ${data.updatedAt}` : ""}
      </p>

      <div style={{ width: "min(100%, 1100px)", aspectRatio: "16 / 9" }}>
        {error ? (
          <div style={{ padding: 40 }}>讀取資料失敗：{error}</div>
        ) : !data ? (
          <div style={{ padding: 40 }}>載入中…</div>
        ) : (
          <Player
            component={HeroVideo}
            inputProps={{ schedule: data.schedule, updatedAt: data.updatedAt }}
            durationInFrames={TOTAL_FRAMES}
            compositionWidth={1920}
            compositionHeight={1080}
            fps={ASIAD_FPS}
            style={{ width: "100%", height: "100%", borderRadius: 12, overflow: "hidden" }}
            controls
            loop
            autoPlay
          />
        )}
      </div>
    </div>
  );
};
