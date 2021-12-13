import { promises as fs } from 'fs';
import path from 'path';

import { PUBLIC_PATH } from './paths';
import images from '../seeds/images.json';
import {convertImage} from './converters/convert_image';

const EXTENSION = "jpg";

async function main() {
    const remapped = await Promise.all(images.map(async (s) => {
        const filePath = path.resolve(PUBLIC_PATH, `./images-original/${s.id}.${EXTENSION}`);
        console.log(filePath);
        const data = await fs.readFile(filePath);
        console.log(data);
        const converted = await convertImage(data, {extension: EXTENSION, height:600, width:600});
        console.log(converted);
        const filePathDest = path.resolve(PUBLIC_PATH, `./images/${s.id}.${EXTENSION}`);
        await fs.writeFile(filePathDest, converted);
        return s;
    }));
    console.log(remapped);
}

main().catch(console.error);
