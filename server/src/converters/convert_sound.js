import { ffmpeg } from '../ffmpeg';

/**
 * @param {Buffer} buffer
 * @param {object} options
 * @param {number} [options.extension]
 * @returns {Promise<Uint8Array>}
 */
async function convertSound(buffer, options) {
  const exportFile = `export.${options.extension ?? 'mp3'}`;

  if (ffmpeg.isLoaded() === false) {
    await ffmpeg.load();
  }

  ffmpeg.FS('writeFile', 'file', new Uint8Array(buffer));

  await ffmpeg.run(...['-i', 'file', '-vn', exportFile]);

  return ffmpeg.FS('readFile', exportFile);
}

async function getWavePeaks(filename) {
  if (ffmpeg.isLoaded() === false) {
    await ffmpeg.load();
  }

  let channels = [];
  for(let i = 0; i < 2; i++) {
    const rawFileName = `filename_${i}.raw`;
    await ffmpeg.run(...['-i', filename, '-vn', rawFileName]);
    const rawUint8Data = await ffmpeg.FS('readFile', rawFileName);
    const buffer = Buffer.from(rawUint8Data);
    vals = [];
    for(let idx = 0; idx < rawUint8Data.length / 2; idx++) {
      vals.push(data.read(i * 2));
    }
    const absed = _.map(vals, Math.abs);
    const peaks = _.map(_.chunk(data, Math.ceil(data.length / 100)), _.mean);
    for (let j = 0; j < peaks.length; j++) peaks[i] /= 32768;
    channels.push(peaks);
  }

  const peaks = _.map(_.zip(channels[0], channels[1]), _.mean);
  const max = _.max(peaks);


  return {peaks, max};
}

export { convertSound };
