// 版型 C 卡片需要的資料形狀（精簡版，沿用 asiad-dooh 的 ScheduleItem 概念）。
// 任何資料來源（MLB、之後換別的）都先轉成這個形狀，版型就不用改。
export interface ScheduleItem {
  time: string; // 顯示用時間，如「09:40」（台灣時間）
  sport: string; // 運動／聯盟，如「MLB」
  event: string; // 細項，如「對 馬林魚　終場 7:0」
  athletes: string; // 主角（這裡放主隊名），卡片最大、黃色那行
}

export interface BoardData {
  updatedAt: string; // 最後更新時間，如「2026/06/16 11:30」
  schedule: ScheduleItem[];
}

export interface AdMedia {
  url: string;
  kind: "image" | "video";
}
