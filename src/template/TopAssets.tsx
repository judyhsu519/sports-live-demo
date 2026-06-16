// 上方主視覺區（1920×720）。沿用版型 C：沒素材時顯示佔位框。
import React from "react";
import { Img, useCurrentFrame } from "remotion";
import { fontFamily } from "./font";
import type { AdMedia } from "./types";

export const TopAssets: React.FC<{
  assets: AdMedia[];
  totalFrames: number;
}> = ({ assets, totalFrames }) => {
  const frame = useCurrentFrame();

  if (assets.length === 0) {
    const idx = Math.min(2, Math.floor(frame / (totalFrames / 3)));
    return (
      <div
        style={{
          height: "100%",
          background: "#241f47",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily,
          position: "relative",
        }}
      >
        <div
          style={{
            width: "92%",
            height: "80%",
            border: "3px dashed rgba(255,255,255,0.4)",
            borderRadius: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          <div style={{ fontSize: 42, fontWeight: 700 }}>客戶主視覺 ／ 影片（1920 × 720）</div>
          <div style={{ fontSize: 28 }}>素材 {idx + 1} / 3（每張 20 秒，最多輪播 3 個）</div>
        </div>
        <div style={{ position: "absolute", bottom: 20, display: "flex", gap: 10 }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                height: 12,
                width: i === idx ? 30 : 12,
                borderRadius: 6,
                background: i === idx ? "#FFE08A" : "rgba(255,255,255,0.35)",
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  const idx = Math.min(assets.length - 1, Math.floor(frame / (totalFrames / assets.length)));
  const a = assets[idx];
  return (
    <div style={{ height: "100%", background: "#000" }}>
      <Img src={a.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
};
