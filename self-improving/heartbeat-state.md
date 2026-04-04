# self-improving/heartbeat-state.md

## Heartbeat State
Last heartbeat run: 2026-04-04T13:35:12+08:00

## QMD Index Status
- Last QMD rebuild: 2026-04-04T13:35:12+08:00 ✅
- Status: ✅ Running normally - 用 `node <qmd.js>` 绕过 bunx shim 问题
- Note: bunx shim 依赖 /bin/sh，Windows 不兼容；已找到正确调用方式

## Maintenance Log
- 2026-04-04: 创建self-improving目录结构
- 2026-04-04: 补录10条历史corrections
- 2026-04-04: 设置memory.md (HOT)含确认模式
- 2026-04-04: 注册5个cron任务
- 2026-04-04: 创建每周系统自查cron
- 2026-04-04: 创建会话compaction检查机制
- 2026-04-04: Git push成功（28335a0）

## Pending Reviews
- [ ] Verify daily learning cron executes at 08:00
- [ ] Verify daily summary cron executes at 21:00
- [ ] Review corrections.md for 3x pattern promotion

## Patterns to Watch
- "汇报必须验证" - used 2x, needs 1 more to promote to HOT
- "cron创建后检查nextRunAtMs" - used 1x, track usage

## 2026-04-04 深度回顾补救

### 未执行的计划（已补救）
| 计划 | 原状态 | 现状态 |
|-----|--------|---------|
| QMD每5分钟自动索引 | ❌ 从未实现 | ✅ cron每5分钟 |
| 每日精简记忆 | ❌ 从未执行 | ✅ 纳入每日总结 |
| 每周深度清理 | ❌ 从未执行 | ✅ cron每周日02:00 |
| 启动流程8步 | ❌ 从未运行 | ✅ BOOTSTRAP.md |
| 自我进化系统 | ❌ 今天才初始化 | ✅ 已建立 |
| 记忆同步脚本 | ❌ 从未实现 | ✅ 依赖git push |
| **会话Compaction** | ❌ 从未实现 | ✅ **今天新增** |
| **模式自动提升(3x)** | ❌ 从未实现 | ✅ **今天新增** |

### 当前cron任务（5个）
| ID | 任务 | 频率 | nextRun |
|----|------|------|---------|
| 6d14a319 | 工作区备份 | 每12h | ~12h后 |
| 8fefaa16 | 每日学习计划 | 每天08:00 | 明天08:00 |
| 0c8db5cd | 每日成长总结 | 每天21:00 | 今天21:00 |
| 5cb21b9d | QMD索引重建 | 每5min | ~5min后 |
| af76b388 | 每周系统自查 | 周日02:00 | 周日02:00 |

### 新增机制（2026-04-04）
1. **会话Compaction触发**：每日总结检查对话长度，>50条提醒compaction
2. **模式自动提升**：corrections.md中同一pattern出现3x → 自动提升到memory.md (HOT)
3. **Git pending自动重试**：备份任务中增加push失败重试
4. **每周自查8项清单**：配置文件/token/cron/Git/记忆/进化/会话/错误

## 2026-04-04 根因总结（自查反思）
1. plan写在文档≠自动执行，必须同时注册cron
2. skill装了≠功能有了，必须初始化目录结构
3. 错误必须立即记录，不能等用户提醒
4. 每次任务结束必须输出错误教训
5. Git push失败必须立即重试，不能等用户发现
