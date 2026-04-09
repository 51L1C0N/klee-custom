import os
import requests
import traceback
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen

# Configuration
# 使用 raw.githubusercontent.com 獲取更穩定的直接下載
BASE_FONT_URL = 'https://raw.githubusercontent.com/lxgw/LxgwWenkaiTC/main/fonts/ttf/LXGWWenkaiTC-Regular.ttf'
PUNCT_FONT_URL = 'https://raw.githubusercontent.com/fontworks-fonts/Klee/master/fonts/ttf/KleeOne-Regular.ttf'
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
    print(f"正在下載: {url}")
    try:
        r = requests.get(url, allow_redirects=True, timeout=30)
        r.raise_for_status()
        with open(dest, 'wb') as f:
            f.write(r.content)
        print(f"已保存至: {dest} ({len(r.content)} bytes)")
    except Exception as e:
        print(f"下載失敗: {url}")
        raise e

def merge_fonts():
    base_path = 'base.ttf'
    punct_path = 'punct.ttf'

    try:
        download_file(BASE_FONT_URL, base_path)
        download_file(PUNCT_FONT_URL, punct_path)

        print("正在加載字體文件...")
        base_font = TTFont(base_path)
        punct_font = TTFont(punct_path)

        base_upm = base_font['head'].unitsPerEm
        punct_upm = punct_font['head'].unitsPerEm
        scale_factor = base_upm / punct_upm
        
        print(f"UPM 比例: Base({base_upm}) / Punct({punct_upm}) = {scale_factor}")

        base_cmap = base_font['cmap'].getBestCmap()
        punct_cmap = punct_font['cmap'].getBestCmap()

        print("開始執行字形手術...")
        replaced_count = 0
        
        base_glyph_set = base_font.getGlyphSet()
        punct_glyph_set = punct_font.getGlyphSet()

        for code in PUNCTUATION_CHARS:
            if code in punct_cmap and code in base_cmap:
                punct_glyph_name = punct_cmap[code]
                base_glyph_name = base_cmap[code]
                
                # 提取源字形
                recording_pen = RecordingPen()
                punct_glyph_set[punct_glyph_name].draw(recording_pen)
                
                # 創建變換筆（處理縮放）
                tt_pen = TTGlyphPen(base_glyph_set)
                transform_pen = TransformPen(tt_pen, (scale_factor, 0, 0, scale_factor, 0, 0))
                recording_pen.replay(transform_pen)
                
                # 替換字形數據
                base_font['glyf'][base_glyph_name] = tt_pen.getGlyph()
                
                # 更新水平度量 (Advance Width)
                base_font['hmtx'][base_glyph_name] = (
                    int(punct_font['hmtx'][punct_glyph_name][0] * scale_factor),
                    int(punct_font['hmtx'][punct_glyph_name][1] * scale_factor)
                )
                
                print(f"成功替換: U+{code:04X} ({chr(code)})")
                replaced_count += 1
            else:
                print(f"跳過: U+{code:04X} (在其中一個字體中未找到)")

        # 更新字體名稱表
        print(f"正在將字體名稱更新為: {NEW_NAME}")
        name_table = base_font['name']
        for name_record in name_table.names:
            # 1: Family, 3: Unique ID, 4: Full Name, 6: Postscript Name
            if name_record.nameID in [1, 3, 4, 6]:
                if name_record.nameID == 6:
                    new_val = NEW_NAME.replace(" ", "-")
                else:
                    new_val = NEW_NAME
                name_record.string = new_val.encode(name_record.getEncoding())

        print(f"正在保存最終文件: {OUTPUT_FILENAME}")
        base_font.save(OUTPUT_FILENAME)
        print(f"完成！共替換 {replaced_count} 個標點符號。")

    except Exception as e:
        print("\n--- 錯誤詳情 ---")
        traceback.print_exc()
        exit(1)

if __name__ == "__main__":
    merge_fonts()
