import asyncio
import json
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        # Connect to system Edge with user data dir
        browser = await p.chromium.launch_persistent_context(
            user_data_dir="C:\\Users\\Administrator\\AppData\\Local\\Microsoft\\Edge\\User Data",
            no_viewport=True
        )
        
        # Navigate to linux.do
        page = browser.pages[0] if browser.pages else await browser.new_page()
        await page.goto("https://linux.do", wait_until="domcontentloaded")
        await asyncio.sleep(3)
        
        # Get cookies
        cookies = await context.cookies(["https://linux.do"])
        
        # Also get localStorage/token
        storage = await page.evaluate("""() => {
            const result = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                result[key] = localStorage.getItem(key);
            }
            return result;
        }""")
        
        print("=== linux.do Cookies ===")
        for c in cookies:
            print(f"{c['name']}: {c['value'][:50]}...")
        
        print("\n=== localStorage ===")
        for k, v in storage.items():
            if 'token' in k.lower() or 'session' in k.lower() or 'user' in k.lower() or 'auth' in k.lower():
                print(f"{k}: {str(v)[:100]}")
        
        await browser.close()

asyncio.run(main())
