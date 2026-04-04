# Self-Check System - 系统自查机制
# 每周日凌晨2点执行，覆盖所有核心计划

## 自查清单

### 1. 核心配置文件检查
```bash
# 检查所有.md文件大小
Get-ChildItem *.md | Format-Table Name, Length
# 要求：所有文件 < 10KB
```

### 2. Cron任务完整性检查
必须存在的定时任务：
- [ ] 工作区备份（每12小时）ID: 6d14a319
- [ ] 每日学习计划（每天08:00）ID: 8fefaa16
- [ ] 每日成长总结（每天21:00）ID: 0c8db5cd
- [ ] QMD索引重建（每5分钟）ID: 5cb21d9d

### 3. Git状态检查
- [ ] 所有commit已推送
- [ ] 无pending commit
- [ ] 工作区干净

### 4. 自我进化系统检查
- [ ] self-improving/memory.md 有内容
- [ ] self-improving/corrections.md 有记录
- [ ] self-improving/heartbeat-state.md 更新时间

### 5. 记忆文件检查
- [ ] MEMORY.md ≤10KB
- [ ] 今日memory/YYYY-MM-DD.md 存在
- [ ] LEARNINGS.md 已更新

### 6. LEARNINGS.md 教训检查
- [ ] 最近3天内有记录
- [ ] 无重复错误
- [ ] 有预防措施

### 7. Token省流检查
- [ ] 无全量加载历史记录
- [ ] memory_search 每次≤5条
- [ ] 配置文件精简无冗余

### 8. 启动流程检查
- [ ] BOOTSTRAP.md 存在且完整
- [ ] 启动时读取所有8个文件

## 执行频率
- 每周日凌晨2点（周日cron）
- 每次Git push后自检

## 失败处理
- 任何检查失败 → 记录到 heartbeat-state.md
- 严重问题 → 立即告知用户
