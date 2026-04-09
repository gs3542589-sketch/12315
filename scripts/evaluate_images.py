"""
Image evaluation using GPT-4o Vision via Yunwu API
"""
import requests
import json
import base64
import sys
import os
from PIL import Image

CONFIG_PATH = os.path.join(os.path.dirname(__file__), 'yunwu_config.json')

def load_config():
    with open(CONFIG_PATH, 'r') as f:
        return json.load(f)

def compress_image(img_path, max_size_kb=200):
    """Compress image to under max_size_kb"""
    img = Image.open(img_path)
    # Resize to max 1024px wide
    if img.width > 1024:
        ratio = 1024 / img.width
        img = img.resize((1024, int(img.height * ratio)), Image.LANCZOS)
    
    output_path = img_path.replace('.png', '_eval.jpg')
    quality = 85
    while quality > 20:
        img.save(output_path, 'JPEG', quality=quality)
        size_kb = os.path.getsize(output_path) / 1024
        if size_kb <= max_size_kb:
            return output_path
        quality -= 10
    
    # Further resize if still too big
    if os.path.getsize(output_path) / 1024 > max_size_kb:
        img = img.resize((768, int(img.height * 768 / img.width)), Image.LANCZOS)
        img.save(output_path, 'JPEG', quality=70)
    return output_path

def evaluate_image(img_path, criteria="角色设定集评估"):
    config = load_config()
    
    # Compress
    compressed = compress_image(img_path)
    with open(compressed, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
    
    headers = {
        'Authorization': f'Bearer {config["api_key"]}',
        'Content-Type': 'application/json'
    }
    
    prompt = f"""你是一位专业的AIGC图像评审专家。请对这张图片进行5维度评分（每项10分，满分50分）：

评分维度：
1. 角色一致性：多面板间角色面部/体型是否一致
2. 布局质量：面板排列是否工整、专业
3. 写实程度：是否真实照片级、有无AI/动漫感
4. 细节质量：皮肤质感、光影、分辨率等
5. 整体氛围：是否符合专业角色设定集标准

请先简述图片内容，然后按5维度打分，最后给出总分和改进建议。
输出格式：
【图片描述】xxx
【评分】
- 角色一致性: x/10
- 布局质量: x/10
- 写实程度: x/10
- 细节质量: x/10
- 整体氛围: x/10
【总分】x/50
【改进建议】xxx"""

    payload = {
        'model': 'gpt-4o-mini',
        'messages': [
            {'role': 'user', 'content': [
                {'type': 'text', 'text': prompt},
                {'type': 'image_url', 'image_url': {'url': f'data:image/jpeg;base64,{b64}'}}
            ]}
        ],
        'max_tokens': 1000
    }
    
    session = requests.Session()
    session.trust_env = False
    
    resp = session.post(f'{config["base_url"]}/chat/completions',
                        headers=headers, json=payload, timeout=60)
    
    if resp.status_code != 200:
        print(f'Error: {resp.status_code}')
        print(resp.text[:500])
        return None
    
    data = resp.json()
    return data['choices'][0]['message']['content']

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python evaluate_images.py <image_path> [label]")
        sys.exit(1)
    
    img_path = sys.argv[1]
    label = sys.argv[2] if len(sys.argv) > 2 else os.path.basename(img_path)
    
    print(f"\n{'='*60}")
    print(f"评估: {label}")
    print(f"{'='*60}")
    
    result = evaluate_image(img_path)
    if result:
        print(result)
    else:
        print("评估失败")
