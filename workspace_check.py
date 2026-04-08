"""
Workspace Health Check - 启动时检查关键文件完整性
检查：MEMORY.md、API Keys、关键脚本、最近修改的文件
"""
import os, json

WORKSPACE = r'C:\Users\Administrator\.qclaw\workspace-agent-1f90a168'
CRITICAL_FILES = [
    'MEMORY.md',
    'SOUL.md',
    'USER.md',
    'AGENTS.md',
    'scripts/yunwu_config.json',
]
CRITICAL_KEYS = [
    'TAVILY_API_KEY',
    'YUNWU_IMAGE_KEY',
    'YUNWU_VISION_KEY',
]

def check_files():
    print("=== 文件完整性检查 ===")
    missing = []
    for f in CRITICAL_FILES:
        path = os.path.join(WORKSPACE, f)
        if os.path.exists(path):
            size = os.path.getsize(path)
            print(f"  OK: {f} ({size} bytes)")
        else:
            print(f"  MISSING: {f}")
            missing.append(f)
    return missing

def check_api_keys():
    print("\n=== API Keys 检查 ===")
    env_path = os.path.expanduser('~/.openclaw/.env')
    missing_keys = []
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            content = f.read()
        for key in CRITICAL_KEYS:
            if key in content:
                # Check if value is not empty
                for line in content.split('\n'):
                    if line.startswith(key + '=') and '='.join(line.split('=')[1:]).strip():
                        print(f"  OK: {key}")
                        break
                else:
                    print(f"  EMPTY: {key}")
                    missing_keys.append(key)
            else:
                print(f"  MISSING: {key}")
                missing_keys.append(key)
    else:
        print(f"  .env file not found at {env_path}")
        missing_keys = CRITICAL_KEYS[:]
    return missing_keys

def check_recent_files():
    print("\n=== 最近修改的文件 ===")
    workspace = WORKSPACE
    files = []
    for f in os.listdir(workspace):
        fp = os.path.join(workspace, f)
        if os.path.isfile(fp):
            mtime = os.path.getmtime(fp)
            files.append((mtime, f))
    files.sort(reverse=True)
    for mtime, name in files[:10]:
        import datetime
        dt = datetime.datetime.fromtimestamp(mtime)
        print(f"  {dt.strftime('%m-%d %H:%M')}: {name}")

def check_git_status():
    print("\n=== Git 状态检查 ===")
    import subprocess
    try:
        result = subprocess.run(['git', '-C', WORKSPACE, 'status', '--porcelain'],
                               capture_output=True, timeout=10)
        if result.stdout.strip():
            print("  有未提交的改动:")
            for line in result.stdout.strip().split('\n'):
                print(f"    {line}")
        else:
            print("  工作区干净，无待提交改动")
    except Exception as e:
        print(f"  Git检查失败: {e}")

def main():
    print("=" * 50)
    print("工作区健康检查")
    print("=" * 50)
    
    missing_files = check_files()
    missing_keys = check_api_keys()
    check_recent_files()
    check_git_status()
    
    print("\n" + "=" * 50)
    if missing_files:
        print(f"WARNING: {len(missing_files)} 个关键文件缺失")
    if missing_keys:
        print(f"WARNING: {len(missing_keys)} 个 API Key 缺失或为空")
    if not missing_files and not missing_keys:
        print("ALL CHECKS PASSED - 工作区状态良好")
    print("=" * 50)

if __name__ == '__main__':
    main()
