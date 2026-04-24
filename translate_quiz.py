import json
import os
from deep_translator import GoogleTranslator
import time

# List of languages to fix
LANGS = ['hi', 'mr', 'ta', 'te', 'kn', 'gu', 'bn']
LOCALES_DIR = 'locales'
EN_PATH = os.path.join(LOCALES_DIR, 'en.json')

# Quiz keys prefix
QUIZ_KEYS = [f"q{i}_{suffix}" for i in range(1, 51) for suffix in ["q", "a1", "a2", "a3"]]
# Correct answers (should be COPIED exactly)
CORRECT_KEYS = [f"q{i}_c" for i in range(1, 51)]

def translate_quiz_for_lang(target_lang):
    print(f"Translating quiz for {target_lang}...")
    with open(EN_PATH, 'r', encoding='utf-8') as f:
        en_data = json.load(f)
    
    target_path = os.path.join(LOCALES_DIR, f'{target_lang}.json')
    if os.path.exists(target_path):
        with open(target_path, 'r', encoding='utf-8') as f:
            target_data = json.load(f)
    else:
        target_data = {}

    translator = GoogleTranslator(source='en', target=target_lang)
    
    # 1. Copy correct answers literally
    for key in CORRECT_KEYS:
        if key in en_data and (key not in target_data or target_data[key] != en_data[key]):
            target_data[key] = en_data[key]

    # 2. Filter keys to translate (only if strictly English in target)
    keys_to_translate = [k for k in QUIZ_KEYS if k in en_data and (k not in target_data or target_data[k] == en_data[k])]
    
    if not keys_to_translate:
        print(f"  All keys translated for {target_lang}.")
        return

    print(f"  Batch translating {len(keys_to_translate)} strings...")
    
    batch_size = 5 # Smaller batch for higher reliability
    for i in range(0, len(keys_to_translate), batch_size):
        batch_keys = keys_to_translate[i:i + batch_size]
        batch_texts = [en_data[k] for k in batch_keys]
        
        # Join with a unique delimiter that shouldn't be in the text
        joined_text = " [SEP] ".join(batch_texts)
        
        try:
            print(f"  Batch {i//batch_size + 1}: translating {len(batch_keys)} strings...")
            translated_joined = translator.translate(joined_text)
            
            if not translated_joined:
                print(f"  Error: translator returned empty for batch.")
                continue
                
            translated_texts = [t.strip() for t in translated_joined.split("[SEP]")]
            
            # If the lengths don't match exactly, fallback to individual translation
            if len(translated_texts) != len(batch_keys):
                print(f"  Warning: Batch mismatch ({len(translated_texts)} vs {len(batch_keys)}). Fallback.")
                for k, text in zip(batch_keys, batch_texts):
                    target_data[k] = translator.translate(text)
                    time.sleep(0.4)
            else:
                for k, trans in zip(batch_keys, translated_texts):
                    target_data[k] = trans
            
            time.sleep(0.8) # Safety gap between batches
        except Exception as e:
            print(f"  Error in batch {i}: {e}. Retrying individually...")
            for k in batch_keys:
                try:
                    target_data[k] = translator.translate(en_data[k])
                    time.sleep(0.4)
                except:
                    pass
    
    with open(target_path, 'w', encoding='utf-8') as f:
        json.dump(target_data, f, ensure_ascii=False, indent=2)
    print(f"Done with {target_lang}")

if __name__ == "__main__":
    for lang in LANGS:
        translate_quiz_for_lang(lang)
    print("All quiz translations completed!")
