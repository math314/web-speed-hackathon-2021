import { promises as fs } from 'fs';
import path from 'path';

import { extractMetadataFromSound } from './utils/extract_metadata_from_sound';
import { PUBLIC_PATH } from './paths';
import sounds from '../seeds/sounds.json';

const EXTENSION = "mp3";

async function main() {
    const mapped = [];
    for(const s of sounds) {
        const filePath = path.resolve(PUBLIC_PATH, `./sounds/${s.id}.${EXTENSION}`);
        const data = await fs.readFile(filePath);
        const extracted = await extractMetadataFromSound(data);
        mapped.push({...s, misc: extracted.misc});
    }
    console.log(mapped);
}

main().catch(console.error);
