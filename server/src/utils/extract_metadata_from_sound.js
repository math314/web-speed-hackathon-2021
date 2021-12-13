import * as MusicMetadata from 'music-metadata';
import createBuffer from 'audio-buffer-from';
import toArrayBuffer from 'to-array-buffer';
import AV from 'av';
import 'mp3';
import * as _ from 'lodash';

async function decodeToBuffer(buffer) {
    buffer = Buffer.from(toArrayBuffer(buffer))
  return new Promise((resolve, reject) => {

    let asset = AV.Asset.fromBuffer(buffer)

    asset.on('error', err => {
      reject(err)
    })

    asset.decodeToBuffer((buffer) => {
      let data = createBuffer(buffer, {
        channels: asset.format.channelsPerFrame,
        sampleRate: asset.format.sampleRate
      })
      resolve(data)
    })
  })
}


async function calculateAudioContext(data) {
  // 音声をデコードする
  /** @type {AudioBuffer} */
  // const buffer = await new Promise((resolve, reject) => {
  //   console.log("ready to decode");
  //   audioCtx.decodeAudioData(data.slice(0), resolve, reject);
  // });

  const buffer = await decodeToBuffer(data);

  // 左の音声データの絶対値を取る
  const leftData = _.map(buffer.getChannelData(0), Math.abs);
  // 右の音声データの絶対値を取る
  const rightData = _.map(buffer.getChannelData(1), Math.abs);

  // 左右の音声データの平均を取る
  const normalized = _.map(_.zip(leftData, rightData), _.mean);
  // 100 個の chunk に分ける
  const chunks = _.chunk(normalized, Math.ceil(normalized.length / 100));
  // chunk ごとに平均を取る
  const peaks = _.map(chunks, _.mean);
  // chunk の平均の中から最大値を取る
  const max = _.max(peaks);

  return { max, peaks };
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
    const misc = await calculateAudioContext(data);
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
