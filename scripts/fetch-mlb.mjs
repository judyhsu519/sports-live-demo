// 抓 ESPN 公開 MLB 賽事看板 → 轉成版型 C 的 ScheduleItem 形狀 → 寫到 public/data.json。
// 免金鑰。之後 GitHub Actions 會定時跑這支，data.json 一更新，網頁就顯示最新賽事。
import { writeFile, mkdir } from "node:fs/promises";

const ESPN = "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard";
const MAX_GAMES = 12; // 最多顯示 12 場（= 3 頁，每頁 4 格）

// MLB 30 隊中文名（依 ESPN 球隊縮寫對照；查無就用英文短名）
const ZH = {
  BAL: "金鶯", BOS: "紅襪", NYY: "洋基", TB: "光芒", TOR: "藍鳥",
  CHW: "白襪", CWS: "白襪", CLE: "守護者", DET: "老虎", KC: "皇家", MIN: "雙城",
  HOU: "太空人", LAA: "天使", OAK: "運動家", ATH: "運動家", SEA: "水手", TEX: "遊騎兵",
  ATL: "勇士", MIA: "馬林魚", NYM: "大都會", PHI: "費城人", WSH: "國民", WAS: "國民",
  CHC: "小熊", CIN: "紅人", MIL: "釀酒人", PIT: "海盜", STL: "紅雀",
  ARI: "響尾蛇", COL: "落磯", LAD: "道奇", SD: "教士", SDP: "教士", SF: "巨人", SFG: "巨人",
};

function zhName(team) {
  const ab = (team.abbreviation || "").toUpperCase();
  return ZH[ab] || team.shortDisplayName || team.displayName || ab || "—";
}

// ISO(UTC) → 台灣時間字串
function twTime(iso) {
  return new Date(iso).toLocaleTimeString("en-GB", {
    timeZone: "Asia/Taipei",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
function twNow() {
  const d = new Date();
  const date = d.toLocaleDateString("en-CA", { timeZone: "Asia/Taipei" }).replace(/-/g, "/");
  const time = twTime(d.toISOString());
  return `${date} ${time}`;
}

const res = await fetch(ESPN);
if (!res.ok) throw new Error(`ESPN 回應 ${res.status}`);
const json = await res.json();
const events = json.events || [];

const schedule = events.slice(0, MAX_GAMES).map((e) => {
  const comp = e.competitions?.[0] || {};
  const cs = comp.competitors || [];
  const home = cs.find((c) => c.homeAway === "home") || cs[0] || {};
  const away = cs.find((c) => c.homeAway === "away") || cs[1] || {};
  const state = e.status?.type?.state; // pre / in / post
  const hs = home.score ?? "";
  const as = away.score ?? "";

  let detail;
  if (state === "post") detail = `對 ${zhName(away.team || {})}　終場 ${hs}:${as}`;
  else if (state === "in") detail = `對 ${zhName(away.team || {})}　進行中 ${hs}:${as}`;
  else detail = `對 ${zhName(away.team || {})}`;

  return {
    time: twTime(e.date),
    sport: "MLB",
    athletes: zhName(home.team || {}), // 主隊當「主角」放最大那行
    event: detail,
  };
});

const out = { updatedAt: twNow(), schedule };

await mkdir("public", { recursive: true });
await writeFile("public/data.json", JSON.stringify(out, null, 2), "utf8");
console.log(`已寫入 public/data.json：${schedule.length} 場，更新時間 ${out.updatedAt}`);
