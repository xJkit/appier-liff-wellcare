export default function numberWithCommas(x) {
  if (!['number', 'string'].includes(typeof x)) {
    return ''
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
