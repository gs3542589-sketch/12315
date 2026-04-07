QMD索引重建状态 - 时间: 2026-04-07 19:32 (Asia/Shanghai)
- Git状态: M memory/2026-04-07.md, untracked temp/
- QMD更新: ✅ 完成 - 索引了53个文件，但embed崩溃
- Embed问题: ❌ 崩溃(code 1) - node-llama-cpp加载embeddinggemma-300M-Q8_0.gguf后CPU推理静默崩溃
- 诊断结果:
  - QMD CLI正常 (ls/status/update可用)
  - 模型文件有效 (GGUF magic验证通过, 313MB)
  - node-llama-cpp依赖链: @tobilu/qmd@2.0.1 -> node-llama-cpp@3.18.1 -> llama.cpp
  - 崩溃发生在模型加载后推理前，无错误输出
  - qmd status显示"CPU: 0 math cores"，CPU检测可能失败(疑似VM环境)
- QMD CLI路径: C:\Users\Administrator\.bun\install\cache\@tobilu\qmd@2.0.1@@registry.npmmirror.com@@@1\dist\cli\qmd.js
- 模型缓存: C:\Users\Administrator\.cache\qmd\models\
- GitHub推送: ⚠️ 网络中断，commit已保存本地
- 下次建议: 
  1. 检查GPU支持或安装CUDA驱动启用GPU加速
  2. 考虑切换到纯CPU轻量embedding方案
  3. 网络恢复后git push