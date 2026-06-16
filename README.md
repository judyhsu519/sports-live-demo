# sports-live-demo — MLB 今日賽事看板（版型 C 實驗版）

一個獨立小實驗：免費運動 API（ESPN MLB）→ 版型 C 卡片牆 → 會自動定期更新、可分享的網頁。

- **與 asiad-dooh 專案完全分開**，純屬個人實驗。
- 資料：ESPN 公開 MLB 賽事看板（免金鑰）。
- 畫面：複製自 asiad-dooh 的「版型 C」（卡片牆 + 分頁 + 動效），改餵 MLB 資料。
- 自動更新：GitHub Actions 每小時抓最新資料、重新部署到 GitHub Pages。

## 本機開發

```bash
npm install
npm run fetch   # 抓最新 MLB 資料 → public/data.json
npm run dev     # 本機預覽 http://localhost:5173
```

## 部署

推上 main 或每小時排程時，GitHub Actions 會自動 `fetch → build → deploy` 到 GitHub Pages。
