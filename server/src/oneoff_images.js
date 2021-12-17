import { promises as fs } from 'fs';
import path from 'path';

import { PUBLIC_PATH } from './paths';
import images from '../seeds/images.json';
import {convertImage} from './converters/convert_image';

const EXTENSION = "jpg";

async function main() {
    const remapped = await Promise.all(images.map(async (s) => {
        const filePath = path.resolve(PUBLIC_PATH, `./images-original/${s.id}.${EXTENSION}`);
        const data = await fs.readFile(filePath);
        const converted1 = await convertImage(data, {extension: EXTENSION, height:380, width:600});
        const filePathDest1 = path.resolve(PUBLIC_PATH, `./images/${s.id}.${EXTENSION}`);
        await fs.writeFile(filePathDest1, converted1);
        const converted2 = await convertImage(data, {extension: EXTENSION, height:220, width:360});
        const filePathDest2 = path.resolve(PUBLIC_PATH, `./images/${s.id}_small.${EXTENSION}`);
        await fs.writeFile(filePathDest2, converted2);
        return s;
    }));
    console.log(remapped);
}

main().catch(console.error);
