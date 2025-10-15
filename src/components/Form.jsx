import { forwardRef, useState } from 'react'
import cx from 'classnames'
import { PatternFormat } from 'react-number-format'
import { usePinInput } from 'react-pin-input-hook'
import selectCaretSvg from '../assets/select_caret.svg'

function Form(
  { children, onSubmit = () => {}, className = '', ...props },
  ref
) {
  return (
    <form
      ref={ref}
      onSubmit={onSubmit}
      className={cx('flex flex-col', className)}
      {...props}>
      {children}
    </form>
  )
}

export const CardInput = forwardRef(
  (
    {
      label = '會員卡號',
      placeholder = '輸入您的會員卡號',
      invalid = false,
      invalidMessage = '格式錯誤',
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <label className={cx('block relative font-number', className)}>
        <div className="text-lg-text-content-high font-medium">{label}</div>
        <input
          ref={ref}
          className={cx(
            'form-input block w-full border-0 border-b focus:ring-0 pb-1 px-2 placeholder:text-content-low placeholder:text-lg text-[26px] font-semibold placeholder:font-normal border-gray-200 focus:border-theme  leading-7 tracking-wide',
            {
              'border-semantic-red focus:border-semantic-red': invalid,
            }
          )}
          type="text"
          maxLength={10}
          placeholder={placeholder}
          {...props}
        />
        {invalid && (
          <span className="absolute -bottom-6 left-0 text-semantic-red text-base font-medium leading-5">
            {invalidMessage}
          </span>
        )}
      </label>
    )
  }
)

export const PhoneAreaSelect = forwardRef(
  ({ className = '', ...props }, ref) => (
    <select
      {...props}
      ref={ref}
      defaultValue="+886"
      className={cx(
        'form-input block w-[120px] border-0 border-b border-gray-200 focus:ring-0 focus:border-theme pb-1 px-2 placeholder:text-content-low placeholder:text-lg text-[26px] font-semibold placeholder:font-normal shrink-0 appearance-none bg-no-repeat bg-auto leading-7 tracking-wide font-number',
        className
      )}
      style={{
        backgroundImage: `url(${selectCaretSvg})`,
      }}>
      <option value="+886">+886</option>
    </select>
  )
)

export const PhoneInputNumber = forwardRef(
  (
    {
      className = '',
      invalid = false,
      invalidMessage = '',
      placeholder = '輸入您的電話號碼',
      ...props
    },
    ref
  ) => (
    <div className="relative">
      <PatternFormat
        {...props}
        getInputRef={ref}
        format="#### ### ###"
        type="text"
        placeholder={placeholder}
        className={cx(
          'form-input block w-full h-[41px] border-0 border-b border-gray-200 focus:ring-0 focus:border-theme py-1 px-2 placeholder:text-content-low placeholder:text-lg text-[26px] font-semibold placeholder:font-normal tracking-wide leading-7 font-number',
          className,
          {
            'border-semantic-red focus:border-semantic-red': invalid,
          }
        )}
      />
      {invalid && (
        <span className="absolute -bottom-6 left-0 inline-block text-semantic-red text-base font-medium leading-5">
          {invalidMessage}
        </span>
      )}
    </div>
  )
)

export const PhoneInput = forwardRef(
  (
    {
      label = '手機號碼',
      SelectElement = <select></select>,
      InputElement = <input />,
      className = '',
    },
    ref
  ) => {
    return (
      <label ref={ref} className={cx('block', className)}>
        <div className="text-lg-text-content-high font-medium">{label}</div>
        <div className="flex gap-x-4 items-center">
          {SelectElement}
          {InputElement}
        </div>
      </label>
    )
  }
)

export const PolicyCheckInput = forwardRef(
  ({ label = '詳閱上述說明，並同意授權個資', ...props }, ref) => {
    return (
      <label className="inline-flex gap-x-4 items-center ">
        <input
          ref={ref}
          type="checkbox"
          className="form-checkbox rounded-full checked:bg-theme focus:checked:bg-theme checked:hover:bg-theme focus:ring-border-general"
          defaultChecked={false}
          {...props}
        />
        <div className="text-content-med text-left">{label}</div>
      </label>
    )
  }
)

export const PinInput = ({
  onChange = console.log,
  values = [],
  invalid = false,
  invalidMessage = '',
}) => {
  const { fields } = usePinInput({
    autoFocus: true,
    placeholder: '',
    onChange,
    values,
  })

  return (
    <div className="relative inline-flex flex-row gap-x-2">
      {fields.map((fieldProps, index) => (
        <input
          key={index}
          type="number"
          className={cx(
            'w-9 p-0 text-center form-input border-0 border-b border-theme focus:ring-0 text-4xl font-semibold focus:border-theme font-number tracking-wide leading-7',
            {
              '!border-semantic-red focus:border-semantic-red': invalid,
            }
          )}
          {...fieldProps}
        />
      ))}
      {invalid && (
        <span className="text-left absolute top-[43px] left-0 inline-block text-semantic-red text-base font-medium leading-5">
          {invalidMessage}
        </span>
      )}
    </div>
  )
}

export default forwardRef(Form)
