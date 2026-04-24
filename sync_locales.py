import json
import os

# This script ensures all supported locales have the same keys as en.json
languages = ['hi', 'mr', 'ta', 'te', 'kn', 'gu', 'bn']

try:
    with open('locales/en.json', 'r', encoding='utf-8') as f:
        en_data = json.load(f)
        
    for lang in languages:
        path = f'locales/{lang}.json'
        if not os.path.exists(path):
            print(f"File {path} does not exist, skipping.")
            continue
            
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        updated = False
        for key in en_data:
            if key not in data:
                # Use the English value as placeholder
                data[key] = en_data[key]
                updated = True
                
        if updated:
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"Updated {lang}.json with missing keys from en.json")
        else:
            print(f"{lang}.json is already in sync.")

except Exception as e:
    print(f"Error syncing locales: {e}")
