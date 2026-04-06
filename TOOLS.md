# TOOLS.md - 工具执行硬规则与路由
## 记忆工具规则
1. memory_search：每次最多召回5条片段，单条≤700字符
2. memory_get：仅精确读取目标内容，不全文加载
3. qmd update：每小时自动重建索引，每日深度优化
4. memory_sync：新增记忆自动同步多文件，执行Memory Sync Protocol

## 记忆写入路由
- 高价值长期规则 → MEMORY.md + 同步多文件
- 临时/日常信息 → 仅写入当日Daily日志，不进核心
- 过期/无效记忆 → 自动归档到历史日志，清理核心文件
- 系统规则变更 → 同步AGENTS.md + git提交版本

## 工具调用边界
- 严格按用户指令调用工具，不擅自触发
- 工具执行结果优先精简，避免冗余输出
- 异常情况自动记录日志，不影响主对话

## 已安装技能
- remind-me-2-1-0, summarize-pro, openclaw-agent-browser
- openclaw-auto-updater, free-ride, api-gateway
- xiucheng-self-improving-agent