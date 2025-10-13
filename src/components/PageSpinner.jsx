import animatedSpinner from '~/assets/animated_spinner.svg'

export default function Spinner(props) {
  return (
    <div className="fixed inset-0">
      <img className="inline-block absolute top-1/4 left-2/4 -translate-x-2/4" src={animatedSpinner} {...props} />
    </div>
  )
}
