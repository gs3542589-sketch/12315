"""
Yunwu API Image Generator
Usage: python yunwu_image.py "prompt" [output_file]
"""
import requests
import json
import base64
import sys
import os
from PIL import Image

CONFIG_PATH = os.path.join(os.path.dirname(__file__), 'yunwu_config.json')
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'output', 'images')

def load_config():
    with open(CONFIG_PATH, 'r') as f:
        return json.load(f)

def generate_image(prompt, output_path=None, size='1024x1024', n=1):
    config = load_config()
    
    session = requests.Session()
    session.trust_env = False
    
    headers = {
        'Authorization': f'Bearer {config["api_key"]}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        'model': config.get('image_model', 'gpt-image-1.5-all'),
        'prompt': prompt,
        'n': n,
        'size': size
    }
    
    print('Generating image...')
    print(f'Prompt: {prompt[:50]}...') if len(prompt) > 50 else print(f'Prompt: {prompt}')
    
    resp = session.post(f'{config["base_url"]}/images/generations', 
                        headers=headers, json=payload, timeout=120)
    
    if resp.status_code != 200:
        print(f'Error: {resp.status_code}')
        print(resp.text)
        return None
    
    data = resp.json()
    
    # Create output directory
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    results = []
    for i, img_data in enumerate(data['data']):
        if 'b64_json' in img_data:
            image_bytes = base64.b64decode(img_data['b64_json'])
        elif 'url' in img_data:
            # 下载URL图片
            img_resp = requests.get(img_data['url'])
            image_bytes = img_resp.content
        else:
            continue
        
        if output_path:
            out_file = output_path
        else:
            # Auto-generate filename
            import time
            timestamp = int(time.time())
            safe_prompt = ''.join(c for c in prompt[:20] if c.isalnum() or c in ' _-').strip()
            out_file = os.path.join(OUTPUT_DIR, f'img_{timestamp}_{safe_prompt}.png')
        
        with open(out_file, 'wb') as f:
            f.write(image_bytes)
        
        # 验证图片
        img = Image.open(out_file)
        print(f'[OK] Saved: {out_file} ({img.size})')
        results.append(out_file)
    
    return results

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    
    prompt = sys.argv[1]
    output = sys.argv[2] if len(sys.argv) > 2 else None
    
    results = generate_image(prompt, output)
    if results:
        print(f'[DONE] Generated {len(results)} image(s)')
