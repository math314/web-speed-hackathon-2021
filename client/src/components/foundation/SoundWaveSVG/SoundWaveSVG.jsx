import React from 'react';

/**
 * @typedef {object} Props
 * @property {string} misc
 */

/**
 * @type {React.VFC<Props>}
 */
const SoundWaveSVG = ({ misc }) => {
  const uniqueIdRef = React.useRef(Math.random().toString(16));
  const peaks = JSON.parse(misc);

  return (
    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 1">
      {peaks.map((peak, idx) => {
        const ratio = peak;
        return (
          <rect key={`${uniqueIdRef.current}#${idx}`} fill="#2563EB" height={ratio} width="1" x={idx} y={1 - ratio} />
        );
      })}
    </svg>
  );
};

export { SoundWaveSVG };
