import cx from 'classnames'
import Spinner from '~/components/Spinner'

export default function Button({
  onClick = () => {},
  children = 'Untitled Button',
  full = false,
  type = 'button',
  disabled = false,
  loading = false,
  loadingLabel = '',
  hollow = false,
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cx(
        'inline-flex justify-center items-center bg-theme text-white text-base rounded-lg shadow-theme-btn h-12',
        {
          'w-full': full,
          'opacity-20': disabled || loading,
          '!text-theme bg-transparent !shadow-none border border-theme': hollow,
        },
        className
      )}
      {...props}>
      {loading ? loadingLabel : children}
      {loading && <Spinner />}
    </button>
  )
}
