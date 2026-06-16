// 版型 C 影片（MLB 實驗版）。上 2/3 客戶素材；下 1/3 MLB 卡片牆。整支 60 秒循環。
// 與 asiad-dooh 原版差別：資料改由 props 傳入（App 從 data.json 載入後傳進來），
// 而不是讀 asiad-dooh 的共用資料層 → 完全獨立。
import React from "react";
import { AbsoluteFill } from "remotion";
import type { AdMedia, ScheduleItem } from "./types";
import { fontFamily } from "./font";
import { TopAssets } from "./TopAssets";
import { HeroGrid } from "./HeroGrid";

export const ASIAD_FPS = 30;
export const TOTAL_FRAMES = ASIAD_FPS * 60; // 60 秒

const TOP_HEIGHT = 720;
const BOTTOM_HEIGHT = 360;

export interface HeroVideoProps {
  asset1Url?: string;
  asset2Url?: string;
  asset3Url?: string;
  bannerText?: string;
  schedule?: ScheduleItem[];
  updatedAt?: string;
}

export const HeroVideo: React.FC<HeroVideoProps> = ({
  asset1Url,
  asset2Url,
  asset3Url,
  bannerText,
  schedule,
  updatedAt,
}) => {
  const assets: AdMedia[] = [asset1Url, asset2Url, asset3Url]
    .filter((u): u is string => !!u && u.length > 0)
    .map((url) => ({ url, kind: "image" }));

  return (
    <AbsoluteFill
      style={{ fontFamily, background: "#1f2547", display: "flex", flexDirection: "column" }}
    >
      <div style={{ height: TOP_HEIGHT, position: "relative" }}>
        <TopAssets assets={assets} totalFrames={TOTAL_FRAMES} />
      </div>
      <div style={{ height: BOTTOM_HEIGHT }}>
        <HeroGrid
          items={schedule ?? []}
          bannerText={bannerText ?? "今日大聯盟賽事 一起看球！"}
          updatedAt={updatedAt ?? ""}
          totalFrames={TOTAL_FRAMES}
        />
      </div>
    </AbsoluteFill>
  );
};
