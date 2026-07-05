import os, re, sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
src_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src')

tag_pattern = re.compile(r'^\s*<([a-zA-Z]+)\s*$')
errors_found = 0

for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.js'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            
            for idx in range(len(lines) - 1):
                line1 = lines[idx].strip()
                line2 = lines[idx+1].strip()
                
                m1 = tag_pattern.match(line1)
                m2 = tag_pattern.match(line2)
                if m1 and m2 and m1.group(1) == m2.group(1):
                    print(f"[{file}:{idx+1}] Duplicated tag '<{m1.group(1)}>' detected!")
                    errors_found += 1

if errors_found == 0:
    print("ALL 100% CLEAN! Zero duplicated JSX tags detected across all JS files!")
