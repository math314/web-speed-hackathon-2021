import { promises as fs } from 'fs';
import path from 'path';

import { PUBLIC_PATH } from './paths';
import movies from '../seeds/movies.json';
import {convertMovie} from './converters/convert_movie';

const EXTENSION = "gif";

async function main() {
    for(const s of movies) {
        const filePath = path.resolve(PUBLIC_PATH, `./movies-original/${s.id}.${EXTENSION}`);
        console.log(filePath);
        const data = await fs.readFile(filePath);
        // console.log(data);
        const converted = await convertMovie(data);
        // console.log(converted);
        const filePathDest = path.resolve(PUBLIC_PATH, `./movies/${s.id}.mp4`);
        await fs.writeFile(filePathDest, converted);
        console.log(`${s} processing finished`);
    }
}

main().catch(console.error);
