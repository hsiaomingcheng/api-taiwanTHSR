# api-taiwanTHSR
台灣高鐵API練習

### 本次練習目標
1.製作能看到各車站的基本資料。
2.製作票價表：所有票價、選擇的起訖站票價、各車廂票價。
3.製作時刻表：單一條件搜尋或交叉搜尋日期、起訖站、車次代碼，並顯示票價。

### 製作想法
預計製作三個頁面分別是基本資料、票價表、時刻表，因此我打算使用三個閉包來放置個頁面的code，方便以後維護或新增，然後匯聚至一個閉包做統整與執行。

### 製作上遇到的問題
1.條件篩選
以往都是將API資料取回再直接做顯示，這是第一次製作多條件的顯示，把資料拿回來後要再根據條件做篩選。

2.該使用哪隻API
面對眾多的API我該如何選擇，以及在考慮到我的多條件，我應該要使用哪些資料。

### 心得
本次的製作，儘管已經在開始前有先構思過一番設計結構，但在製作中還是有遇到API要在統整處再帶入，還是放在各頁閉包的掙扎。

以及本次的條件搜尋，並非完全像台灣高鐵官網的需選擇起訖站、日期、時間才能搜尋。
而是把日期設為必填，有日期+起訖站、日期+車次、日期+起訖站+車次的搜尋選擇。