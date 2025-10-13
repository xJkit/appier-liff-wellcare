/**
 *
 * @param {number} ms - ms to delay
 * @returns {Promise<void>}
 */
export default async function delay(ms = 0) {
  return await new Promise((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}
