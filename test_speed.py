import urllib.request
import time
import os

BASE_URL = "http://localhost:3000"
PUBLIC_DIR = r"C:\Users\user\Documents\mapa-salento-2026\salento-mapa-turistico\dist"

# Get all HTML files
pages = []
for root, dirs, files in os.walk(PUBLIC_DIR):
    for f in files:
        if f.endswith('.html'):
            rel_path = os.path.relpath(os.path.join(root, f), PUBLIC_DIR)
            url = rel_path.replace('\\', '/').replace('index.html', '')
            if url == '':
                url = '/'
            elif not url.startswith('/'):
                url = '/' + url
            pages.append(url)

print("=" * 60)
print("ANÁLISIS DE VELOCIDAD - SALENTO A LA MANO")
print("=" * 60)
print()

results = []
for page in sorted(pages):
    url = f"{BASE_URL}{page}"
    try:
        start = time.time()
        response = urllib.request.urlopen(url, timeout=10)
        data = response.read()
        load_time = time.time() - start
        
        size_kb = len(data) / 1024
        results.append({
            'page': page,
            'time': load_time,
            'size_kb': size_kb,
            'status': 'OK'
        })
        
        # Color based on load time
        if load_time < 0.5:
            color = '\033[92m'  # Green
        elif load_time < 1.0:
            color = '\033[93m'  # Yellow
        else:
            color = '\033[91m'  # Red
        
        print(f"{color}{load_time:.3f}s | {size_kb:.1f}KB | {page}\033[0m")
        
    except Exception as e:
        results.append({
            'page': page,
            'time': 0,
            'size_kb': 0,
            'status': f'ERROR: {str(e)[:50]}'
        })
        print(f"\033[91mERROR | {page}: {str(e)[:50]}\033[0m")

# Summary
print()
print("=" * 60)
print("RESUMEN")
print("=" * 60)

if results:
    avg_time = sum(r['time'] for r in results) / len(results)
    total_size = sum(r['size_kb'] for r in results)
    slow_pages = [r for r in results if r['time'] > 1.0]
    fast_pages = [r for r in results if r['time'] < 0.5]
    
    print(f"Total páginas: {len(results)}")
    print(f"Tamaño total: {total_size:.1f} KB ({total_size/1024:.2f} MB)")
    print(f"Tiempo promedio: {avg_time:.3f}s")
    print(f"Rápidas (<0.5s): {len(fast_pages)}")
    print(f"Normales (0.5-1s): {len(results) - len(fast_pages) - len(slow_pages)}")
    print(f"Lentas (>1s): {len(slow_pages)}")
    
    if slow_pages:
        print()
        print("PÁGINAS LENTAS (>1s):")
        for r in sorted(slow_pages, key=lambda x: x['time'], reverse=True):
            print(f"  {r['time']:.3f}s - {r['page']}")
