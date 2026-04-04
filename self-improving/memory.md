# self-improving/memory.md - HOT storage (≤100 lines)
# Always loaded, confirmed patterns and preferences

## Confirmed Patterns (repeated 3x+)

### 汇报验证规则
- 每次汇报必须验证操作结果
- 标注✅已验证/⚠️未验证
- 禁止推测性汇报
- 来源：AGENTS.md, LEARNINGS.md

### 错误立即记录
- 错误发生后立即记录到LEARNINGS.md
- 每次任务结束必须反思错误
- 汇报结构必须包含错误教训
- 来源：用户批评2026-04-04

### Git推送规则
- 每次commit后立即推送
- 失败时标记pending，稍后自动重试
- 网络不稳定时先commit，推送失败继续重试
- 来源：GitHub网络超时教训

### 定时任务必须验证
- cron任务创建后检查nextRunAtMs确认生效
- 计划写在文档≠自动执行，必须注册cron
- 来源：每日计划从未执行的教训

### 技能使用前必须读取
- 收到任务先检查相关技能
- 读取SKILL.md再执行
- 宁可慢一点，也要先学习再输出
- 来源：视频提示词质量差的教训

## Confirmed Preferences

### 用户偏好
- 回复简洁、结构化、分点清晰
- Markdown、列表、表格格式
- 记忆只记高价值、可复用、防踩坑信息

### 用户禁止
- 禁止记忆臃肿、全量加载
- 禁止重复写入低噪音入库
- 禁止推测性汇报（必须验证）

## Pending Patterns (need 3x to promote)
- none yet
