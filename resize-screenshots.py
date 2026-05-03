#!/usr/bin/env python3
"""Create iOS App Store screenshots at required 1284x2778."""

from PIL import Image
import os

def upscale_to_app_store():
    input_dir = './screenshots/simulator'
    output_dir = './screenshots/framed'
    
    files = ['login', 'home', 'groups', 'channels', 'animes', 'more', 'settings']
    
    target_size = (1284, 2778)  # iPhone 16 Pro Max
    
    for name in files:
        input_path = f'{input_dir}/{name}.png'
        if os.path.exists(input_path):
            img = Image.open(input_path)
            
            # Create new image with black background
            img_new = Image.new('RGB', target_size, 'black')
            
            # Center the screenshot
            x = (target_size[0] - img.width) // 2
            y = (target_size[1] - img.height) // 2
            
            img_new.paste(img, (x, y))
            
            output_path = f'{output_dir}/{name}-ios.png'
            img_new.save(output_path, 'PNG', quality=100)
            print(f'{name}: {img.size} -> {target_size}')

if __name__ == '__main__':
    upscale_to_app_store()