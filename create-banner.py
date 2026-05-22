#!/usr/bin/env python3
"""Create minimal clean Android banner (1024x500)"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_banner():
    width, height = 1024, 500
    
    img = Image.new('RGB', (width, height), '#000000')
    draw = ImageDraw.Draw(img)
    
    try:
        font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 120)
    except:
        font = ImageFont.load_default()
    
    # Simple text
    draw.text((512, 180), 'Groupify', fill='white', anchor='mm', font=font)
    draw.ellipse([490, 260, 534, 304], fill='#39d08a')
    
    os.makedirs('./screenshots', exist_ok=True)
    img.save('./screenshots/banner-android.png')
    print('Created: ./screenshots/banner-android.png')

if __name__ == '__main__':
    create_banner()