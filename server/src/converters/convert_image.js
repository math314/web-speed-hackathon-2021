import sharp from 'sharp';

/**
 * @param {Buffer} buffer
 * @param {object} options
 * @param {number} [options.extension]
 * @param {number} [options.height]
 * @param {number} [options.width]
 * @returns {Promise<Uint8Array>}
 */
async function convertImage(buffer, options) {
  const image = sharp(buffer);
  const metadata = await image.metadata();
  if (metadata.height > metadata.width) {
    options.height = null;
  } else {
    options.width = null;
  }
  return image.resize({
    fit: 'inside',
    height: options.height,
    width: options.width,
  })
  .toFormat(options.extension ?? 'jpeg')
  .toBuffer();
}

export { convertImage };
