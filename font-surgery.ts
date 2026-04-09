import * as opentype from 'opentype.js';
import * as fs from 'fs-extra';
import path from 'path';

const BASE_FONT_URL = 'https://github.com/lxgw/LxgwWenkaiTC/releases/latest/download/LXGWWenkaiTC-Regular.ttf';
const PUNCT_FONT_URL = 'https://github.com/fontworks-fonts/Klee/raw/master/fonts/ttf/KleeOne-Regular.ttf';

const OUTPUT_FILENAME = 'Klee-Custom-Regular.ttf';
const FONT_NAME = 'Klee-Custom';

// Unicode characters to replace
const PUNCTUATION_CHARS = [
    '，', '。', '！', '？', '：', '；', 
    '「', '」', '『', '』', 
    '（', '）', '【', '】', 
    '《', '》', '〈', '〉', 
    '—', '…', '～'
];

async function downloadFont(url: string, dest: string) {
    console.log(`Downloading ${url}...`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to download ${url}: ${response.statusText}`);
    const buffer = await response.arrayBuffer();
    await fs.outputFile(dest, Buffer.from(buffer));
    console.log(`Saved to ${dest}`);
}

async function run() {
    const baseDest = 'base.ttf';
    const punctDest = 'punct.ttf';

    try {
        // 1. Download fonts
        await downloadFont(BASE_FONT_URL, baseDest);
        await downloadFont(PUNCT_FONT_URL, punctDest);

        // 2. Load fonts
        console.log('Loading fonts...');
        const baseFont = opentype.loadSync(baseDest);
        const punctFont = opentype.loadSync(punctDest);

        console.log('Performing font surgery...');

        // Create a new font based on the base font
        // opentype.js doesn't have a direct "clone" for fonts that preserves everything perfectly,
        // but we can modify the baseFont object in place or create a new one.
        // Modifying in place is easier for keeping all other glyphs.

        for (const char of PUNCTUATION_CHARS) {
            const unicode = char.charCodeAt(0);
            const punctGlyph = punctFont.charToGlyph(char);
            
            if (punctGlyph) {
                // Find the glyph index in the base font for this unicode
                const baseGlyphIndex = baseFont.charToGlyphIndex(char);
                
                if (baseGlyphIndex > 0) {
                    console.log(`Replacing ${char} (U+${unicode.toString(16).toUpperCase()})`);
                    
                    // In opentype.js, we can replace the glyph at the specific index
                    // However, we need to be careful about metrics (advanceWidth, etc.)
                    
                    // Create a new glyph object for the base font using punctGlyph's data
                    const newGlyph = new opentype.Glyph({
                        name: punctGlyph.name,
                        unicode: unicode,
                        advanceWidth: punctGlyph.advanceWidth,
                        path: punctGlyph.path
                    });

                    // Replace the glyph in the base font's glyphs list
                    (baseFont.glyphs as any).glyphs[baseGlyphIndex] = newGlyph;
                } else {
                    console.warn(`Character ${char} not found in base font.`);
                }
            } else {
                console.warn(`Character ${char} not found in punctuation source font.`);
            }
        }

        // 3. Update font metadata
        console.log(`Renaming font to ${FONT_NAME}...`);
        baseFont.names.fontFamily.en = FONT_NAME;
        baseFont.names.fullName.en = FONT_NAME;
        baseFont.names.postScriptName.en = FONT_NAME.replace(/\s+/g, '-');

        // 4. Save the new font
        console.log(`Saving to ${OUTPUT_FILENAME}...`);
        const outBuffer = baseFont.toBuffer();
        await fs.outputFile(OUTPUT_FILENAME, Buffer.from(outBuffer));

        console.log('Success! Font generated.');

    } catch (error) {
        console.error('Error during font surgery:', error);
    } finally {
        // Cleanup
        // await fs.remove(baseDest);
        // await fs.remove(punctDest);
    }
}

run();
