import sqlite3
import json
import os
import shutil

cookie_path = r'C:\Users\Administrator\AppData\Local\Microsoft\Edge\User\Default\Network\Cookies'

if not os.path.exists(cookie_path):
    print('Cookie file not found')
    exit(1)

# Copy to temp location to avoid lock
temp_path = r'C:\Users\Administrator\cookies_temp.db'
shutil.copy2(cookie_path, temp_path)

conn = sqlite3.connect(temp_path)
cursor = conn.cursor()

cursor.execute("SELECT host_key, name, value, path, expires_utc, is_secure FROM cookies WHERE host_key LIKE '%linux.do%'")
rows = cursor.fetchall()

print(f'Found {len(rows)} cookies for linux.do')
print()

cookies = []
for host, name, value, path, expires, secure in rows:
    display_value = value[:80] if value and len(value) > 80 else value
    print(f'{name}: {display_value}')
    cookies.append({
        'host': host,
        'name': name,
        'value': value,
        'path': path
    })

# Save to JSON
with open(r'C:\Users\Administrator\linuxdo-cookies-edge.json', 'w') as f:
    json.dump(cookies, f, indent=2)
print(f'\nSaved {len(cookies)} cookies to linuxdo-cookies-edge.json')

conn.close()
os.remove(temp_path)
