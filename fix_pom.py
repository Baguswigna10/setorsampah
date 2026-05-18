from pathlib import Path

path = Path('pom.xml')
text = path.read_text(encoding='utf-8')
replacements = {
    '<java.version>25</java.version>': '<java.version>21</java.version>',
    '<version>3.11.0</version>': '<version>3.14.1</version>',
    '<release>25</release>': '<release>${java.version}</release>',
    '<version>1.18.30</version>': '<version>1.18.34</version>',
}
for old, new in replacements.items():
    if old not in text:
        raise RuntimeError(f'Missing pattern: {old}')
    text = text.replace(old, new)
path.write_text(text, encoding='utf-8')
print('pom updated')
