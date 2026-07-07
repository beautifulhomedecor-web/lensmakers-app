import os, re

ROOT = r'c:\Users\NEW\OneDrive\Desktop\lensmakers-web'
old_colors = ['#FF4D8D','#C2185B','#7C4DFF','#8B4FFF','#0F1535','#1B1F4A']
total = 0
found = []

for dirpath, dirs, files in os.walk(ROOT):
    dirs[:] = [d for d in dirs if d not in ['.agents','node_modules','.git','assets']]
    for fname in files:
        ext = os.path.splitext(fname)[1]
        if ext not in ('.css', '.js', '.html'):
            continue
        fp = os.path.join(dirpath, fname)
        try:
            txt = open(fp, encoding='utf-8', errors='ignore').read()
            for c in old_colors:
                n = len(re.findall(re.escape(c), txt, re.IGNORECASE))
                if n:
                    found.append(f'{n}x {c} in {os.path.relpath(fp, ROOT)}')
                    total += n
        except Exception as e:
            print(f'ERROR: {fp}: {e}')

if found:
    for f in found:
        print(f)
    print(f'--- REMAINING OLD COLORS: {total} ---')
else:
    print('SUCCESS: Zero old colors found anywhere in the project!')
