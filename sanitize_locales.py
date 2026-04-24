import json
import os
import re

def sanitize_locales():
    locales_dir = "locales"
    master_file = os.path.join(locales_dir, "en.json")
    
    with open(master_file, 'r', encoding='utf-8') as f:
        master_data = json.load(f)
    
    master_keys = set(master_data.keys())
    
    # Files to process
    files = [f for f in os.listdir(locales_dir) if f.endswith(".json")]
    
    # Regex to identify "bad" auto-generated keys that contain HTML
    # We also explicitly target the range 1-10 for major sections
    bad_prefixes = ["checker_auto_", "index_auto_", "dashboard_auto_", "learn_auto_", "report_auto_", "quiz_auto_", "login_auto_", "examples_auto_"]
    
    for filename in files:
        filepath = os.path.join(locales_dir, filename)
        print(f"Processing {filename}...")
        
        with open(filepath, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
            except Exception as e:
                print(f"Error loading {filename}: {e}")
                continue
        
        cleaned_data = {}
        
        # 1. Transfer valid keys
        for key, value in data.items():
            # Skip if value contains HTML tags
            if isinstance(value, str) and ("<" in value or ">" in value):
                continue
            
            # Skip if it's an auto-key in the 1-10 range (mostly nav debris)
            is_bad_auto = False
            for prefix in bad_prefixes:
                if key.startswith(prefix):
                    try:
                        num = int(key.replace(prefix, ""))
                        if num <= 10:
                            is_bad_auto = True
                            break
                    except:
                        pass
            if is_bad_auto:
                continue
                
            cleaned_data[key] = value
            
        # 2. Sync with master (ensure all en.json keys exist)
        for key in master_keys:
            if key not in cleaned_data:
                cleaned_data[key] = master_data[key]
        
        # 3. Specific cleanups for the sync script error from previous turn (if any)
        # (e.g. key: value where key == value and they are long sentences - wait that's fine for now)
        
        # Sort and save
        sorted_data = dict(sorted(cleaned_data.items()))
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(sorted_data, f, ensure_ascii=False, indent=2)

    print("Sanitization complete.")

if __name__ == "__main__":
    sanitize_locales()
