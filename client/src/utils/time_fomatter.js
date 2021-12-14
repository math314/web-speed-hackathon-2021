/**
 * @param {string} isoTimeString
 * @returns {string}
 */
function formatJapaneseTime(isoTimeString) {
    const date = new Date(isoTimeString);
    return `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日`;
}

export {formatJapaneseTime};