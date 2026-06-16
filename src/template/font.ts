// 中文字型（思源黑體 TC）。沿用 asiad-dooh 的做法，weight 對齊 CSS 用到的字重。
import { loadFont } from "@remotion/google-fonts/NotoSansTC";

export const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "900"],
});
