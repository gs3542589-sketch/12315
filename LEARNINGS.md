# LEARNINGS.md - 错误教训记录

## 记录规则
- 每次错误后立即记录
- 包含：错误现象、根因、解决方案
- 避免重复踩坑

---

## 2026-04-05

### 1. QMD CLI 依赖 /bin/sh 导致 Windows 下报错
- **现象**：`qmd --version` 报错 `/bin/sh not found`
- **根因**：qmd 的 npm wrapper 脚本（qmd.cmd/ps1）调用了不存在的 `/bin/sh`
- **解决**：替换 `C:\Users\Administrator\AppData\Roaming\npm\qmd*` 所有文件，直接调用 `qmd-wrapper.js`
- **状态**：✅ 已修复

### 2. LiteLLM 部署后模型调用失败
- **现象**：`litellm_params` 缺少 `custom_llm_provider: openly`
- **根因**：自定义 API base 需要显式指定 provider
- **解决**：添加 `custom_llm_provider: openai` 到 litellm_params
- **状态**：✅ 已修复

### 3. VPS SSH 连接失败（密码认证被拒绝）
- **现象**：多次密码 `pcqlJSDM0956` 认证失败
- **根因**：SSH 端口不是实例 ID，而是标准端口 22
- **解决**：端口用 22，用户名用 root
- **状态**：✅ 已修复
