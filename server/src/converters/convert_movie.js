import { ffmpeg } from '../ffmpeg';

/**
 * 先頭 5 秒のみ、正方形にくり抜かれた無音動画を作成します
 * @param {Buffer} buffer
 * @returns {Promise<Uint8Array>}
 */
async function convertMovie(buffer) {
  const size = 574;
  const cropOptions = `crop='min(iw,ih)':'min(iw,ih)',scale=${size}:${size}`;

  const exportFile = `export.mp4`;


  const args = ['-i', 'file',
  '-movflags', 'faststart', '-pix_fmt', 'yuv420p',
   '-vf', cropOptions, '-an', exportFile];
   console.log(args.join(' '));

  if (ffmpeg.isLoaded() === false) {
    await ffmpeg.load();
  }

  ffmpeg.FS('writeFile', 'file', new Uint8Array(buffer));

  await ffmpeg.run(...args);

  return ffmpeg.FS('readFile', exportFile);
}

export { convertMovie };
