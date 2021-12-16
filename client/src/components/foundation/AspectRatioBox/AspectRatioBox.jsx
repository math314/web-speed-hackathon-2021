import React from 'react';

/**
 * @typedef {object} Props
 * @property {number} aspectHeight
 * @property {number} aspectWidth
 * @property {React.ReactNode} children
 */

/**
 * 親要素の横幅を基準にして、指定したアスペクト比のブロック要素を作ります
 * @type {React.VFC<Props>}
 */
const AspectRatioBox = ({ aspectHeight, aspectWidth, children }) => {
  /** @type {React.RefObject<HTMLDivElement>} */

  const ratio = aspectHeight / aspectWidth;
  return (
    <div className="relative w-full" style={{ paddingTop: `${ratio * 100}%` }}>
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  );
};

export { AspectRatioBox };
