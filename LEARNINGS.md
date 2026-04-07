# LEARNINGS.md - 错误教训记录

## 记录规则
- 每次错误后立即记录
- 包含：错误现象、根因、解决方案
- 避免重复踩坑

---

## 2026-04-06

### 1. QMD query/vsearch 向量搜索挂起
- **现象**：`qmd query` 执行时永远停在 "Gathering information" 状态
- **尝试**：下载3个模型文件到缓存，尝试GPU disable/cuda/vulkan各种模式，清除重装node-llama-cpp
- **根因**：node-llama-cpp 3.18.1 在加载 reranker/generate 模型时挂起，CUDA 12.8兼容性或底层ggml库问题
- **临时解决**：使用 `qmd search` 替代（BM25纯文本搜索，功能完整）
- **状态**：⚠️ 向量搜索未修复，BM25搜索正常

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

---

## 2026-04-07

### 1. Seedance 文档合并优于删除
- **现象**：用户有7个零散Seedance文档，分散不便查阅
- **做法**：合并7个文件为1个`seedance-ultimate-dictionary.md`（约13040字，10个Part）
- **教训**：文档合并比删除更安全——保留全部内容消除重复，合并前先确认无独立价值再删原文件
- **状态**：✅ 已固化为此后文档整理的标准流程

### 2. 文档整理后同步更新记忆文件
- **现象**：文档已合并删除，但记忆文件未及时更新状态
- **教训**：任何文件操作（新建/删除/重命名）后，应立即更新相关记忆条目（含MEMORY.md和当日日志）
- **状态**：✅ 已执行
