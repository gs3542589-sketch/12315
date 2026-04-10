#!/usr/bin/env python3
"""
Tavily Search Script - 网络搜索工具
使用 Tavily API 进行网络搜索

环境变量:
    TAVILY_API_KEY - Tavily API 密钥

用法:
    python tavily_search.py --query "搜索关键词" [--max-results 5] [--search-depth basic|advanced]
"""

import os
import sys
import json
import argparse
import urllib.request
import urllib.error

def tavily_search(query: str, max_results: int = 5, search_depth: str = "basic") -> dict:
    """
    使用 Tavily API 进行搜索
    
    Args:
        query: 搜索关键词
        max_results: 最大结果数 (1-10)
        search_depth: 搜索深度 "basic" 或 "advanced"
    
    Returns:
        搜索结果字典
    """
    api_key = os.environ.get("TAVILY_API_KEY")
    if not api_key:
        return {"error": "TAVILY_API_KEY 环境变量未设置"}
    
    url = "https://api.tavily.com/search"
    
    payload = {
        "api_key": api_key,
        "query": query,
        "max_results": max_results,
        "search_depth": search_depth,
        "include_answer": True,
        "include_raw_content": False
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers=headers,
            method="POST"
        )
        
        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read().decode("utf-8"))
            return result
            
    except urllib.error.HTTPError as e:
        return {"error": f"HTTP错误: {e.code} - {e.reason}"}
    except urllib.error.URLError as e:
        return {"error": f"网络错误: {e.reason}"}
    except Exception as e:
        return {"error": f"未知错误: {str(e)}"}


def format_results(results: dict) -> str:
    """格式化搜索结果为可读文本"""
    if "error" in results:
        return f"❌ 搜索失败: {results['error']}"
    
    output = []
    
    # 添加回答（如果有）
    if results.get("answer"):
        output.append(f"## 📝 摘要\n{results['answer']}\n")
    
    # 添加搜索结果
    if results.get("results"):
        output.append("## 🔍 搜索结果\n")
        for i, item in enumerate(results["results"], 1):
            output.append(f"### {i}. {item.get('title', '无标题')}")
            output.append(f"**URL**: {item.get('url', 'N/A')}")
            output.append(f"**内容**: {item.get('content', '无内容')[:500]}...")
            output.append("")
    
    return "\n".join(output)


def main():
    parser = argparse.ArgumentParser(description="Tavily 网络搜索工具")
    parser.add_argument("--query", "-q", required=True, help="搜索关键词")
    parser.add_argument("--max-results", "-n", type=int, default=5, help="最大结果数 (默认: 5)")
    parser.add_argument("--search-depth", "-d", choices=["basic", "advanced"], default="basic", help="搜索深度")
    parser.add_argument("--json", "-j", action="store_true", help="输出JSON格式")
    
    args = parser.parse_args()
    
    results = tavily_search(args.query, args.max_results, args.search_depth)
    
    if args.json:
        print(json.dumps(results, ensure_ascii=False, indent=2))
    else:
        print(format_results(results))


if __name__ == "__main__":
    main()
