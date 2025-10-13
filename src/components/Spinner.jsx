import loadingSvg from '~/assets/loading.svg'

export default function Spinner(props) {
  return <img className="animate-spin" src={loadingSvg} {...props} />
}
