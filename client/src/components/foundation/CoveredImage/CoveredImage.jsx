import React from 'react';

import { getImagePath } from '../../../utils/get_path';

/**
 * @typedef {object} Props
 * @property {string} alt
 * @property {string} id
 */

/**
 * アスペクト比を維持したまま、要素のコンテンツボックス全体を埋めるように画像を拡大縮小します
 * @type {React.VFC<Props>}
 */
const CoveredImage = ({ alt, id }) => {
  const {src, smallSrc} = getImagePath(id);
  const useSrc = window.innerWidth <= 400 ? smallSrc : src;
  return (
    <div className="relative w-full h-full overflow-hidden">
        <img alt={alt} className="images" src={useSrc} />
      {/* <picture>
        <img alt={alt} className="images" src={smallSrc} />
        <img alt={alt} className="images" src={src} media="(min-width: 400px)" />
      </picture> */}
    </div>
  );
};

export { CoveredImage };
