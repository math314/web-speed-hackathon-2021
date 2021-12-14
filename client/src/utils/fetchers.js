/**
 * @param {string} url
 * @returns {Promise<ArrayBuffer>}
 */
async function fetchBinary(url) {
  const result = await fetch(url);
  return result.arrayBuffer();
}

/**
 * @template T
 * @param {string} url
 * @returns {Promise<T>}
 */
 async function fetchJSON(url) {
  const result = await fetch(url);
  if (!result.ok) return null;
  return result.json();
}


/**
 * @template T
 * @param {string} url
 * @param {File} file
 * @returns {Promise<T>}
 */
async function sendFile(url, file) {
  const result = await fetch(url, {
    method: 'POST',
    body: file,
    headers: new Headers({
      'Content-Type': 'application/octet-stream',
    }),
  });
  return result.json();
}

/**
 * @template T
 * @param {string} url
 * @param {object} data
 * @returns {Promise<T>}
 */
async function sendJSON(url, data) {
  const result = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return result.json();
}

export { fetchBinary, fetchJSON, sendFile, sendJSON };
