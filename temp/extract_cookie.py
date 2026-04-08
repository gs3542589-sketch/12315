import sqlite3
import os

cookie_path = r'C:\Users\Administrator\AppData\Roaming\douyin\Network\Cookies'
print('Cookie文件大小:', os.path.getsize(cookie_path), 'bytes')

try:
    conn = sqlite3.connect(cookie_path)
    cursor = conn.cursor()
    
    # 列出所有表
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()
    print('表:', tables)
    
    # 读取cookies
    cursor.execute("SELECT host, name, value FROM cookies WHERE name IN ('ttwid', 'sessionid', 'sid_ut', 'sid_tt', 'sid_guest', 'passport_csrf_token')")
    cookies = cursor.fetchall()
    print('\n关键Cookie:')
    for c in cookies:
        val = str(c[2])
        print(f'  {c[0]}: {c[1]}={val[:80]}...' if len(val) > 80 else f'  {c[0]}: {c[1]}={val}')
    
    conn.close()
except Exception as e:
    print('Error:', e)
