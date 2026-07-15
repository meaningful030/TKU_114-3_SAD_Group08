# 證據 02：介面與可存取性靜態檢查

## 實際結果

```text
HTML_REQUIRED_IDS=PASS
ACCESSIBILITY_STATIC=PASS
```

## 檢查項目

- `applicationForm`、`ownerStatusCard`、`pendingBody`、`reviewPanel`、`approveButton`、`returnButton` 均存在。
- 攤位名稱、作品類型、其他作品類型、email、備註、審核意見共 6 個輸入均有對應 label。
- 動態狀態使用至少 3 個 `aria-live` 區域。
- 所有動作使用原生 button；CSS 有明確 `:focus-visible` 樣式。
- 正式 email 政策需要登入才能驗證；本原型只有角色切換，因此不把畫面位置當成正式權限測試。

## 限制

此為結構檢查，不取代真人在 Chrome／Edge 的視覺與 Tab 鍵複核。
