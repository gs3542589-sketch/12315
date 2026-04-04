# BOOTSTRAP.md - 启动引导脚本

## 启动检查清单
每次 agent 启动时执行以下检查：

### 1. 检查今日待办
- [ ] 读取 `memory/YYYY-MM-DD.md` 了解今日上下文
- [ ] 检查是否有未完成的 cron 任务

### 2. 检查定时任务状态
运行 `cron list` 确认以下任务存在且 enabled：
- [ ] 工作区备份（每12小时）
- [ ] 每日成长总结（每天 21:00）
- [ ] 每日学习计划（每天 08:00）

### 3. 检查 LEARNINGS.md
- [ ] 昨天是否有未记录的错误？
- [ ] 是否有重复错误需要预防？

### 4. 检查 Git 推送状态
- [ ] 是否有 pending commit 未推送？
- [ ] 本地与远程是否同步？

### 5. 启动提示词
启动完成后，输出：
```
✅ 启动检查完成
- 待办：X项
- 错误教训：X条待处理
- Git状态：同步/待推送
```

## 每日定时任务配置

### 任务1：每日学习计划（每天 08:00）
```json
{
  "name": "每日学习计划",
  "schedule": {"kind":"cron","expr":"0 8 * * *","tz":"Asia/Shanghai"},
  "payload": {"kind":"agentTurn","message":"直接输出以下提醒内容，禁止调用message工具：执行每日学习计划：1) 读取MEMORY.md核心记忆 2) 读取LEARNINGS.md最新教训 3) 列出今日重点任务 4) 制定学习目标 5) 输出今日工作计划"},
  "sessionTarget": "isolated"
}
```

### 任务2：每日成长总结（每天 21:00）
```json
{
  "name": "每日成长总结",
  "schedule": {"kind":"cron","expr":"0 21 * * *","tz":"Asia/Shanghai"},
  "payload": {"kind":"agentTurn","message":"直接输出以下提醒内容，禁止调用message工具：执行每日成长总结：1) 回顾今天完成的工作和错误教训 2) 检查LEARNINGS.md是否已更新 3) 记录今日1-3个错误/教训到LEARNINGS.md 4) 更新MEMORY.md（如有必要）5) 备份git 6) 输出今日总结报告"},
  "sessionTarget": "isolated"
}
```
