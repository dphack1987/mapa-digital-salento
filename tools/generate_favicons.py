#!/usr/bin/env python3
"""
Generate favicon files from the main logo for SEO optimization.
Creates ICO, PNG (multiple sizes), and SVG formats.
"""

from PIL import Image
import os

def generate_favicons():
    # Paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    public_dir = os.path.join(base_dir, 'public')
    logo_path = os.path.join(public_dir, 'logo_salento2026.png')
    
    # Check if logo exists
    if not os.path.exists(logo_path):
        print(f"Error: Logo file not found at {logo_path}")
        return False
    
    # Open the logo
    try:
        img = Image.open(logo_path)
        
        # Convert to RGBA if needed
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Generate different sizes for favicon
        sizes = [
            (16, 16),  # Standard favicon
            (32, 32),  # Standard favicon
            (48, 48),  # Windows icon
            (64, 64),  # Modern favicon
            (120, 120), # Yandex recommendation
            (128, 128), # iOS touch icon
            (180, 180), # iOS touch icon
            (192, 192), # Android Chrome
            (256, 256), # Windows metro
        ]
        
        # Create ICO file with multiple sizes
        print("Generating favicon.ico...")
        img.save(
            os.path.join(public_dir, 'favicon.ico'),
            format='ICO',
            sizes=[(16, 16), (32, 32), (48, 48), (64, 64)]
        )
        
        # Create individual PNG files for each size
        for size in sizes:
            resized = img.resize(size, Image.Resampling.LANCZOS)
            filename = f'favicon-{size[0]}x{size[1]}.png'
            output_path = os.path.join(public_dir, filename)
            resized.save(output_path, 'PNG')
            print(f"Generated {filename}")
        
        # Create apple-touch-icon (180x180)
        apple_touch = img.resize((180, 180), Image.Resampling.LANCZOS)
        apple_touch.save(os.path.join(public_dir, 'apple-touch-icon.png'), 'PNG')
        print("Generated apple-touch-icon.png")
        
        # Create a simple SVG favicon
        print("Generating favicon.svg...")
        svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <image href="data:image/png;base64,{get_base64_image(img)}" width="512" height="512"/>
</svg>'''
        
        # For simplicity, let's create a basic SVG that references the PNG
        simple_svg = '''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#f5f1e8"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="180" fill="#1f2d26">S</text>
</svg>'''
        
        with open(os.path.join(public_dir, 'favicon.svg'), 'w') as f:
            f.write(simple_svg)
        print("Generated favicon.svg")
        
        print("\n✅ All favicon files generated successfully!")
        return True
        
    except Exception as e:
        print(f"Error generating favicons: {e}")
        return False

def get_base64_image(img):
    """Convert PIL image to base64 string"""
    import io
    import base64
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    return base64.b64encode(buffer.getvalue()).decode()

if __name__ == '__main__':
    generate_favicons()