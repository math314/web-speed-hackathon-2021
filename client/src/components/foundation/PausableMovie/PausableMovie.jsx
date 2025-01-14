import classNames from 'classnames';
import React from 'react';

import { useFetch } from '../../../hooks/use_fetch';
import { fetchBinary } from '../../../utils/fetchers';
import { AspectRatioBox } from '../AspectRatioBox';
import { FontAwesomeIcon } from '../FontAwesomeIcon';

async function waitForNextAnimationFrame() {
  new Promise((resolve, reject) => {
    window.requestAnimationFrame(() => resolve());
  });
}

/**
 * @typedef {object} Props
 * @property {string} src
 */

/**
 * クリックすると再生・一時停止を切り替えます。
 * @type {React.VFC<Props>}
 */
const PausableMovie = ({ src }) => {
  /** @type {React.RefObject<HTMLVideoElement>} */
  const videoRef = React.useRef(null);

  // 視覚効果 off のとき GIF を自動再生しない
  const startWithPlaying =
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [isPlaying, setIsPlaying] = React.useState(startWithPlaying);
  const handleClick = React.useCallback(() => {
    if(videoRef.current?.paused) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
    setIsPlaying(!videoRef.current?.paused);
  }, []);

  return (
    <AspectRatioBox aspectHeight={1} aspectWidth={1}>
      <button className="group relative block w-full h-full" onClick={handleClick} type="button">
        <video loop muted ref={videoRef} autoPlay={isPlaying} >
          <source src={src} type="video/mp4" />
        </video>
        <div
          className={classNames(
            'absolute left-1/2 top-1/2 flex items-center justify-center w-16 h-16 text-white text-3xl bg-black bg-opacity-50 rounded-full transform -translate-x-1/2 -translate-y-1/2',
            {
              'opacity-0 group-hover:opacity-100': isPlaying,
            },
          )}
        >
          <FontAwesomeIcon iconType={isPlaying ? 'pause' : 'play'} styleType="solid" />
        </div>
      </button>
    </AspectRatioBox>
  );
};

export { PausableMovie };
