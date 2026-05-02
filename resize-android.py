#!/usr/bin/env python3
"""Create Android Play Store screenshots at 1080x2400."""

from PIL import Image
import os

def resize_android():
    input_dir = './screenshots/android'
    output_dir = './screenshots/framed-android'
    
    files = ['login', 'home', 'groups', 'channels', 'animes', 'more', 'settings']
    
    target_size = (1080, 2400)  # Android standard
    
    for name in files:
        input_path = f'{input_dir}/{name}.png'
        if os.path.exists(input_path):
            img = Image.open(input_path)
            
            if img.size != target_size:
                img_resized = img.resize(target_size, Image.LANCZOS)
                output_path = f'{output_dir}/{name}-android.png'
                img_resized.save(output_path, 'PNG', quality=100)
                print(f'{name}: {img.size} -> {target_size}')
            else:
                output_path = f'{output_dir}/{name}-android.png'
                img.save(output_path, 'PNG', quality=100)
                print(f'{name}: {img.size} (unchanged)')

if __name__ == '__main__':
    resize_android()