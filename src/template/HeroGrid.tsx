// 版型 C 下方卡片牆（1920×360）。複製自 asiad-dooh 的版型 C（含分頁、動效、亞運賽事標籤）。
// 這裡是獨立副本，餵 MLB 資料；不影響 asiad-dooh 的原版。
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { ScheduleItem } from "./types";
import { fontFamily } from "./font";

const PER_PAGE = 4;

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export const HeroGrid: React.FC<{
  items: ScheduleItem[];
  bannerText: string;
  updatedAt: string;
  totalFrames: number;
}> = ({ items, bannerText, updatedAt, totalFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 排序：進行中 → 即將開打 → 已結束；同組內再按時間。讓看板更有「現在進行式」感。
  const order: Record<string, number> = { in: 0, pre: 1, post: 2 };
  const sorted = [...items].sort((a, b) => {
    const d = (order[a.state] ?? 9) - (order[b.state] ?? 9);
    return d !== 0 ? d : a.time.localeCompare(b.time);
  });
  const pages = sorted.length ? chunk(sorted, PER_PAGE) : [];
  const pageCount = pages.length;
  const framesPerPage = pageCount > 0 ? totalFrames / pageCount : totalFrames;
  const pageIdx = pageCount > 1 ? Math.min(pageCount - 1, Math.floor(frame / framesPerPage)) : 0;
  const cards = pages[pageIdx] ?? [];
  const localFrame = frame - pageIdx * framesPerPage;

  const bannerEnter = spring({ frame, fps, config: { damping: 200 } });
  const bannerY = interpolate(bannerEnter, [0, 1], [-20, 0]);
  const bannerOpacity = interpolate(bannerEnter, [0, 1], [0, 1]);

  const sweepPeriod = fps * 10;
  const sweepProgress = (frame % sweepPeriod) / sweepPeriod;
  const sweepLeft = interpolate(sweepProgress, [0, 1], [-30, 130]);

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        height: "100%",
        background: "#1b2050",
        fontFamily,
        color: "#fff",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${sweepLeft}%`,
          width: "22%",
          background:
            "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.09) 50%, transparent 100%)",
          transform: "skewX(-12deg)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 金色標題帶 + 「亞運賽事」標籤（置中） */}
        <div
          style={{
            height: 64,
            background: "linear-gradient(180deg, #cda253 0%, #b8893f 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `translateY(${bannerY}px)`,
            opacity: bannerOpacity,
          }}
        >
          <span
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "#FFE08A",
              background: "#1b2050",
              borderRadius: 8,
              padding: "5px 16px",
              marginRight: 28,
            }}
          >
            MLB
          </span>
          <span style={{ fontSize: 42, fontWeight: 900, color: "#fff", letterSpacing: 4 }}>
            {bannerText}
          </span>
        </div>

        {/* 卡片牆 */}
        {cards.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            今日暫無賽事資料
          </div>
        ) : (
          <div style={{ flex: 1, minHeight: 0, display: "flex", gap: 18, padding: "12px 40px 4px" }}>
            {cards.map((it, i) => (
              <HeroCard key={`${pageIdx}-${i}`} item={it} index={i} localFrame={localFrame} />
            ))}
          </div>
        )}

        {/* 頁尾 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 40px 12px",
            fontSize: 18,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          <span>最後更新時間：{updatedAt}</span>
          {pageCount > 1 ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {Array.from({ length: pageCount }).map((_, i) => (
                <span
                  key={i}
                  style={{
                    height: 9,
                    width: i === pageIdx ? 24 : 9,
                    borderRadius: 5,
                    background: i === pageIdx ? "#FFD24D" : "rgba(255,255,255,0.35)",
                  }}
                />
              ))}
            </div>
          ) : null}
          <span>資料來源：ESPN</span>
        </div>
      </div>
    </div>
  );
};

const HeroCard: React.FC<{ item: ScheduleItem; index: number; localFrame: number }> = ({
  item,
  index,
  localFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: localFrame - 6 - index * 5, fps, config: { damping: 200 } });
  const entranceY = interpolate(enter, [0, 1], [40, 0]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  const cycle = fps * 6.5;
  const activeDur = fps * 2.8;
  const t = frame % cycle;
  const envelope = t < activeDur ? Math.sin((Math.PI * t) / activeDur) : 0;
  const bobPeriod = fps * 1.4;
  const bob = 8 * envelope * Math.sin(((2 * Math.PI) / bobPeriod) * t - index * (Math.PI / 2));
  const y = entranceY + bob;

  // 進行中：紅框＋發光，比分前加閃爍紅點
  const live = item.state === "in";
  const pulse = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 2)); // ~1 秒一閃

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        transform: `translateY(${y}px)`,
        opacity,
        background: live ? "#1a1130" : "#0e1330",
        border: live ? "2px solid #ff5a5f" : "1px solid rgba(255,255,255,0.08)",
        boxShadow: live ? "0 0 18px rgba(255,90,95,0.45)" : "none",
        borderRadius: 12,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 34,
          fontWeight: 700,
          paddingBottom: 8,
          borderBottom: "1px solid rgba(255,255,255,0.18)",
          width: "78%",
        }}
      >
        {item.sport}
      </div>

      <div
        style={{
          fontSize: 42,
          fontWeight: 900,
          color: "#FFD24D",
          lineHeight: 1.1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "100%",
        }}
      >
        {item.athletes}
      </div>

      <div style={{ fontSize: 40, fontWeight: 900 }}>{item.time}</div>

      {live ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontSize: 24,
            fontWeight: 700,
            color: "#ff7a7e",
            whiteSpace: "nowrap",
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <span style={{ color: "#ff3b3f", opacity: pulse, fontSize: 18 }}>●</span>
          {item.event}
        </div>
      ) : (
        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.85)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
          }}
        >
          {item.event}
        </div>
      )}
    </div>
  );
};
