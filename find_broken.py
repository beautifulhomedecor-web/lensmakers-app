import re, sys
sys.stdout.reconfigure(encoding='utf-8')

def find_broken(fp):
    txt = open(fp, encoding='utf-8', errors='ignore').read()
    lines = txt.splitlines()
    legit_short = {'#FFF','#fff','#000','#eee','#ccc','#999','#666','#333','#111','#aaa','#bbb','#ddd','#EEE','#CCC'}
    results = []
    for i, line in enumerate(lines):
        broken = re.findall(r'#[A-Fa-f0-9]{1,5}(?=[^A-Fa-f0-9])', line)
        bad = [b for b in broken if b not in legit_short and len(b) < 4]
        if bad:
            results.append((i+1, bad, line.strip()[:120]))
    return results

for fp in ['src/components/Header.js', 'src/screens/CartScreen.js', 'src/screens/TryOnScreen.js']:
    print('=== ' + fp + ' ===')
    for lineno, bad, line in find_broken(fp):
        print(f'  Line {lineno}: bad={bad}')
        print(f'    {line[:100]}')
    print()
