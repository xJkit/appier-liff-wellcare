import { useState, useEffect } from 'react'
import Button from '../components/Button'
import { useForm, Controller } from 'react-hook-form'
import {
  useActionData,
  json,
  useLoaderData,
  useSubmit,
  useNavigation,
  redirect,
  Link,
} from 'react-router-dom'
import { PinInput } from '../components/Form'
import checkSvg from '../assets/check.svg'
import API from '../services/api'
import { getErrorMessage, ApiError } from '../config/errorMsg'
import _random from 'lodash.random'

const DEFAULT_SMS_CODE_PERIOD_SEC = 60

export const verificationLoaderWithQuery = (queryClient) => () => {
  const phoneMember = queryClient.getQueryData(['useOtpPhoneMember'])
  if (!phoneMember) throw new Error('You cheat!')
  return json(phoneMember, { status: 200 })
}

export const verificationAction = async ({ request }) => {
  const formData = await request.formData()
  const formattedData = {
    otpCode: formData.get('pin'),
    memberNumber: formData.get('memberNumber'),
    mobilePhone: formData.get('mobilePhone'),
  }
  let errors = {}
  const api = new API()
  await api.verifyOTP(formattedData).catch((apiError) => {
    errors.code = apiError.code
    errors.message = getErrorMessage('otpCheckError', apiError.code)
    errors.apiError = apiError
  })
  if (Object.keys(errors).length !== 0) {
    return errors
  }

  // Server is ok. redirect to success page
  return redirect('/link_success')
}

export default function VerificationCode() {
  const phoneMember = useLoaderData()
  const submit = useSubmit()
  const navigation = useNavigation()
  const { memberNumber = '', mobilePhone = '' } = phoneMember

  const actionErrors = useActionData() // previous page submission
  const [timerSec, setTimerSec] = useState(DEFAULT_SMS_CODE_PERIOD_SEC)
  const [isCodeReset, setIsCodeReset] = useState(false)
  const { watch, control, handleSubmit, reset } = useForm({
    defaultValues: { pin: ['', '', '', '', '', ''] },
  })

  const onCodeReset = () => {
    if (isCodeReset) return // prevent from multi-clicks
    setIsCodeReset(true)
    reset()
    setTimeout(() => {
      setIsCodeReset(false)
      setTimerSec(DEFAULT_SMS_CODE_PERIOD_SEC)
    }, 1000)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSec((prevSec) => (prevSec > 0 ? prevSec - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <form
      onSubmit={handleSubmit((data) =>
        submit(
          { pin: data.pin.join(''), memberNumber, mobilePhone },
          { method: 'post' }
        )
      )}
      className="px-6 py-8">
      <div className="text-content-high text-2xl font-bold leading-8 mb-4">
        請輸入簡訊認證碼
      </div>
      <div className="text-sm leading-5">
        <div className="">簡訊驗證碼已傳送到 {mobilePhone}</div>
        <Link
          to={`../account_linking?card_number=${memberNumber}`}
          className="text-theme">
          使用另外一支手機
        </Link>
      </div>
      <div className="pt-6 pb-10 text-center">
        <Controller
          control={control}
          name="pin"
          render={({ field: { onChange, value } }) => (
            <PinInput
              invalid={actionErrors}
              invalidMessage={actionErrors?.message}
              onChange={onChange}
              values={value}
            />
          )}
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <Button
          type="submit"
          disabled={
            watch('pin').filter(Boolean).length !== 6 ||
            actionErrors?.code === '4' // over verify rate limit
          }
          loading={navigation.state === 'submitting'}
          loadingLabel="驗證中...">
          驗證
        </Button>
        <Button
          type="button"
          className="gap-x-2.5"
          onClick={onCodeReset}
          hollow
          disabled={timerSec !== 0 || actionErrors?.code === '4'} // over verify rate limit
        >
          {isCodeReset ? (
            <>
              <img src={checkSvg} /> 重新寄送成功
            </>
          ) : (
            <>重新寄送 {timerSec === 0 ? '' : `(${timerSec})`}</>
          )}
        </Button>
      </div>
    </form>
  )
}
