import * as MusicMetadata from 'music-metadata';
import { ffmpeg } from '../ffmpeg';
import * as _ from 'lodash';
// import { promises as fs } from 'fs';

async function getWavePeaks(data) {
  if (ffmpeg.isLoaded() === false) {
    await ffmpeg.load();
  }

  let channels = [];
  for(let i = 0; i < 2; i++) {
    const mp3FileName = `input.mp3`;
    const rawFileName = `filename_${i}.raw`;
    // await fs.writeFile(mp3FileName, data);

    ffmpeg.FS('writeFile', mp3FileName, new Uint8Array(data));
    const args = ['-i', mp3FileName,
    '-map_channel', `0.0.${i}`, '-f', 's16le',
     '-vn', rawFileName];
    // console.log('ffmpeg ' + args.join(' '));
    await ffmpeg.run(...args);
    const rawUint8Data = await ffmpeg.FS('readFile', rawFileName);
  
    // await fs.writeFile(rawFileName, buffer);
    // console.log(`generated ${rawFileName}`)

    let vals = new Int16Array(rawUint8Data.buffer, 0, rawUint8Data.length / 2);

    const absed = _.map(vals, Math.abs);
    const peaks = _.map(_.chunk(absed, Math.ceil(absed.length / 100)), _.mean);
    for (let j = 0; j < peaks.length; j++) peaks[j] /= 32768.0;
    channels.push(peaks);
  }

  const peaks = _.map(_.zip(channels[0], channels[1]), _.mean);
  const max = _.max(peaks);
  for(let i = 0; i < peaks.length; i++) peaks[i] /= max;

  return peaks;
}

/**
 *
 * @typedef {object} SoundMetadata
 * @property {string} [artist]
 * @property {string} [title]
 * @property {string} [misc]
 */

/**
 * @param {Buffer} data
 * @returns {Promise<SoundMetadata>}
 */
async function extractMetadataFromSound(data) {
  try {
    const metadata = await MusicMetadata.parseBuffer(data);
    const misc = await getWavePeaks(data);
    return {
      artist: metadata.common.artist,
      title: metadata.common.title,
      misc: JSON.stringify(misc),
    };
  } catch (_err) {
    console.log(_err);
    return {
      artist: undefined,
      title: undefined,
      misc: "{}",
    };
  }
}

export { extractMetadataFromSound };
