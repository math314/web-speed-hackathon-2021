import _ from 'lodash';
import React from 'react';

// async function waitForNextAnimationFrame() {
//   new Promise((resolve, reject) => {
//     window.requestAnimationFrame(() => resolve());
//   });
// }

/**
 * @param {ArrayBuffer} data
 * @returns {Promise<{ max: number, peaks: number[] }}
 */
async function calculate(data) {
  // await waitForNextAnimationFrame();
  const audioCtx = new AudioContext();

  // 音声をデコードする
  /** @type {AudioBuffer} */
  const buffer = await new Promise((resolve, reject) => {
    audioCtx.decodeAudioData(data.slice(0), resolve, reject);
  });
  // 左の音声データの絶対値を取る
  // console.log(buffer.getChannelData(0));
  const leftData = _.map(buffer.getChannelData(0), Math.abs);
  // console.log(buffer.getChannelData(1));
  // 右の音声データの絶対値を取る
  const rightData = _.map(buffer.getChannelData(1), Math.abs);

  // 左右の音声データの平均を取る
  const calcPeaks = (data) => {
    const chunks = _.chunk(data, Math.ceil(data.length / 100));
    return _.map(chunks, _.mean);
  };
  const leftPeaks = calcPeaks(leftData);
  const rightPeaks = calcPeaks(rightData);

  const peaks = _.map(_.zip(leftPeaks, rightPeaks), _.mean);
  const max = _.max(peaks);

  return { max, peaks };
}

/**
 * @typedef {object} Props
 * @property {ArrayBuffer} soundData
 */

/**
 * @type {React.VFC<Props>}
 */
const SoundWaveSVG = ({ soundData }) => {
  const uniqueIdRef = React.useRef(Math.random().toString(16));
  const [{ max, peaks }, setPeaks] = React.useState({ max: 0, peaks: [] });

  React.useEffect(() => {
    calculate(soundData).then(({ max, peaks }) => {
      setPeaks({ max, peaks });
    });
  }, [soundData]);

  return (
    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 1">
      {peaks.map((peak, idx) => {
        const ratio = peak / max;
        return (
          <rect key={`${uniqueIdRef.current}#${idx}`} fill="#2563EB" height={ratio} width="1" x={idx} y={1 - ratio} />
        );
      })}
    </svg>
  );
};

export { SoundWaveSVG };
