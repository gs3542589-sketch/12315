# self-improving/corrections.md - Last 50 corrections log

## 2026-04-04

### 自我总结缺失
- USER: "你犯了什么错误 为什么没总结，我强调的是 犯过的错误不要犯，重复的错误不要发生！"
- CONTEXT: 汇报工作时只说成果，没有主动总结错误
- LESSON: 每次任务结束必须输出错误教训，不能只有成果汇报
- LOGGED: 2026-04-04

### 定时任务从未配置
- USER: "为什么我们之前设置的每日成长，总结 ，学习计划 没有落实呢？"
- CONTEXT: HEARTBEAT.md是空的，BOOTSTRAP.md不存在，计划写了但没执行
- LESSON: 计划写在文档≠自动执行，必须同时注册cron任务
- LOGGED: 2026-04-04

### Git推送失败未及时处理
- CONTEXT: 3个commit推送GitHub失败，网络超时
- ROOT CAUSE: 没有自动重试机制，靠人工发现
- LESSON: 推送失败应立即重试，失败时标记pending继续重试
- LOGGED: 2026-04-04

### 汇报未验证
- CONTEXT: 用户指出汇报未验证就标记完成
- LESSON: 每项必须标注✅已验证/⚠️未验证
- LOGGED: 2026-04-02

## 2026-04-03

### 视频提示词质量差
- USER: 指出提示词缺少关键要素
- CONTEXT: 直接写提示词，没有先读seedance-shot-design技能
- LESSON: 收到任务→先读技能→按规范执行
- LOGGED: 2026-04-03

### 数据查询不准确
- CONTEXT: 搜索结果被拦截，无法获取最新数据
- LESSON: 数据必须交叉验证2+来源，标注时间戳
- LOGGED: 2026-04-03

## 2026-04-02

### 云端备份失败
- CONTEXT: HTTP 500/400，云服务暂时不可用
- LESSON: 先完成本地git，云端可异步
- LOGGED: 2026-04-03
