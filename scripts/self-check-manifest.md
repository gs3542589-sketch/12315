# Self-Check System - 系统自查机制
# 每周日凌晨2点执行，覆盖所有核心计划

## 自查清单（8项）

### 1. 配置文件 Token 检查
- 要求：所有 .md 配置文件 < 10KB
- 超限 → 立即精简归档

### 2. Cron 任务完整性（5个）
- [ ] 工作区备份（每12小时）ID: 6d14a319
- [ ] 每日学习计划（每天08:00）ID: 8fefaa16
- [ ] 每日成长总结（每天21:00）ID: 0c8db5cd
- [ ] QMD索引重建（每5分钟）ID: 5cb21b9d
- [ ] 每周系统自查（周日02:00）ID: af76b388

### 3. Git 同步状态
- 无 pending commit
- 工作区干净
- origin/main 与本地一致

### 4. 记忆文件检查
- MEMORY.md ≤10KB
- 今日 memory/YYYY-MM-DD.md 存在
- LEARNINGS.md 最近3天有更新

### 5. 自我进化系统检查
- corrections.md 有新条目？
- 有无 3x 重复模式需要提升到 memory.md？
- heartbeat-state.md 更新时间

### 6. 会话状态检查
- 当前对话长度是否过长？（>50条）
- 是否需要触发 compaction？

### 7. Token 使用检查
- QMD 检索每次 ≤5 条
- 无全量加载历史记录
- 配置文件无冗余

### 8. 错误重复检查
- LEARNINGS.md 有无重复错误？
- 预防措施是否到位？

## 执行频率
- 每周日凌晨2:00（cron自动执行）
- 每次Git push后自检（人工触发）

## 失败处理
- ⚠️ 任何检查失败 → 记录到 heartbeat-state.md
- 🔴 严重问题（配置文件超限/Git pending） → 立即修复
- 📊 输出结构化报告

## 自查报告格式
```
✅ 通过项：X/8
⚠️ 警告项：X/8
🔴 失败项：X/8
[失败项详情]
[待处理行动项]
```
