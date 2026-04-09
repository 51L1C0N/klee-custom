import os
import requests
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.ttGlyphPen import TTGlyphPen

# Configuration
BASE_FONT_URL = 'https://github.com/lxgw/LxgwWenkaiTC/releases/latest/download/LXGWWenkaiTC-Regular.ttf'
PUNCT_FONT_URL = 'https://github.com/fontworks-fonts/Klee/raw/master/fonts/ttf/KleeOne-Regular.ttf'
OUTPUT_FILENAME = 'Klee-Custom-Regular.ttf'
NEW_NAME = 'Klee-Custom'

# Unicode characters to replace (Punctuation)
PUNCTUATION_CHARS = [
    0xFF0C, 0x3002, 0xFF01, 0xFF1F, 0xFF1A, 0xFF1B, # ，。！？：；
    0x300C, 0x300D, 0x300E, 0x300F,                 # 「」『』
    0xFF08, 0xFF09, 0x3010, 0x3011,                 # （）【】
    0x300A, 0x300B, 0x3008, 0x3009,                 # 《》〈〉
    0x2014, 0x2026, 0xFF5E                          # —…～
]

def download_file(url, dest):
    print(f"Downloading {url}...")
    r = requests.get(url, allow_redirects=True)
    with open(dest, 'wb') as f:
        f.write(r.content)
    print(f"Saved to {dest}")

def merge_fonts():
    base_path = 'base.ttf'
    punct_path = 'punct.ttf'

    download_file(BASE_FONT_URL, base_path)
    download_file(PUNCT_FONT_URL, punct_path)

    print("Loading fonts...")
    base_font = TTFont(base_path)
    punct_font = TTFont(punct_path)

    base_cmap = base_font['cmap'].getBestCmap()
    punct_cmap = punct_font['cmap'].getBestCmap()

    print("Performing font surgery...")
    for code in PUNCTUATION_CHARS:
        if code in punct_cmap and code in base_cmap:
            punct_glyph_name = punct_cmap[code]
            base_glyph_name = base_cmap[code]
            
            print(f"Replacing glyph for U+{code:04X} ({chr(code)})")
            
            # Extract glyph from punct font
            punct_glyph_set = punct_font.getGlyphSet()
            base_glyph_set = base_font.getGlyphSet()
            
            # Use RecordingPen to copy the glyph contours
            pen = RecordingPen()
            punct_glyph_set[punct_glyph_name].draw(pen)
            
            # Create a new glyph in the base font using the recorded contours
            new_pen = TTGlyphPen(base_glyph_set)
            pen.replay(new_pen)
            
            # Update the glyph in the 'glyf' table
            base_font['glyf'][base_glyph_name] = new_pen.getGlyph()
            
            # Update horizontal metrics (advance width)
            base_font['hmtx'][base_glyph_name] = punct_font['hmtx'][punct_glyph_name]

    # Update font names
    print(f"Updating font names to {NEW_NAME}...")
    for name_record in base_font['name'].names:
        if name_record.nameID in [1, 4, 6]: # Family, Full Name, Postscript Name
            name_str = name_record.toUnicode()
            if name_record.nameID == 1:
                new_val = NEW_NAME
            elif name_record.nameID == 4:
                new_val = NEW_NAME
            elif name_record.nameID == 6:
                new_val = NEW_NAME.replace(" ", "-")
            
            name_record.string = new_val.encode(name_record.getEncoding())

    print(f"Saving to {OUTPUT_FILENAME}...")
    base_font.save(OUTPUT_FILENAME)
    print("Done!")

if __name__ == "__main__":
    merge_fonts()
