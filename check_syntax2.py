import os, re

ROOT = r'c:\Users\NEW\OneDrive\Desktop\lensmakers-web'
files_to_check = []
for dirpath, dirs, files in os.walk(ROOT):
    dirs[:] = [d for d in dirs if d not in ['.agents','node_modules','.git','assets']]
    for fname in files:
        if fname.endswith('.js'):
            files_to_check.append(os.path.join(dirpath, fname))

issues = []
for fp in files_to_check:
    try:
        txt = open(fp, encoding='utf-8', errors='ignore').read()
        rel = os.path.relpath(fp, ROOT)
        if '##' in txt:
            issues.append('DOUBLE-HASH: ' + rel)
        # Check for encoding corruption marker
        if '\ufffd' in txt:
            issues.append('ENCODING CORRUPTION: ' + rel)
        # Check for clearly broken hex values (less than 6 hex digits before non-hex)
        broken = re.findall(r'#[A-Fa-f0-9]{1,5}(?=[^A-Fa-f0-9])', txt)
        legit_short = {'#FFF','#fff','#000','#eee','#ccc','#999','#666','#333','#111','#aaa','#bbb','#ddd'}
        bad = [b for b in broken if b not in legit_short and len(b) < 4]
        if bad:
            issues.append('BROKEN HEX in ' + rel + ': ' + str(bad[:3]))
    except Exception as e:
        issues.append('READ ERROR ' + fp + ': ' + str(e))

if issues:
    print('ISSUES FOUND:')
    for i in issues:
        print('  ' + i)
else:
    print('All JS files look clean - no obvious syntax breaks')
print('Checked ' + str(len(files_to_check)) + ' files')
