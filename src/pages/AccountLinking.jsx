import { useForm } from 'react-hook-form'
import {
  useSearchParams,
  Navigate,
  useSubmit,
  useActionData,
  redirect,
} from 'react-router-dom'
import { ApiError, getErrorMessage } from '../config/errorMsg'
import WellcareLogo from '../assets/wellcare_logo.png'
import Button from '../components/Button'
import PageSpinner from '../components/PageSpinner'
import Form, {
  CardInput,
  PhoneInput,
  PhoneAreaSelect,
  PhoneInputNumber,
  PolicyCheckInput,
} from '../components/Form'
import { useMemberState } from '../services/hooks'
import API from '../services/api'

export const sendOtpActionWithQuery =
  (queryClient) =>
  async ({ request }) => {
    const formData = await request.formData()
    const formattedData = {
      cardNumber: formData.get('cardNumber'),
      countryCode: formData.get('countryCode'),
      isTermAgreed: formData.get('isTermAgreed'),
      phoneNumber: formData.get('phoneNumber').replace(/\s/g, ''),
    }

    const errors = {}
    // 會員卡號： 8 位或 10 位數字
    const cardNumberRule = /^\d{8}$|^\d{10}$/
    if (!cardNumberRule.test(formattedData.cardNumber)) {
      errors.cardNumber = '格式錯誤'
    }
    // 電話號碼格式認證
    const taiwanPhoneRule = /^[0][9]\d{8}$/
    if (!taiwanPhoneRule.test(formattedData.phoneNumber)) {
      errors.phoneNumber = '格式錯誤'
    }

    // return data if we have errors
    if (Object.keys(errors).length) {
      return errors
    }

    // 通過認證，打 API
    const api = new API()
    const preparedData = {
      memberNumber: formattedData.cardNumber,
      mobilePhone: formattedData.phoneNumber.replace(
        /[0]/,
        formattedData.countryCode
      ),
    }

    await api.sendOTP(preparedData).catch((apiError) => {
      const { code } = apiError
      errors.code = code
      errors.message = getErrorMessage('otpCheckError', code)
      errors.apiError = apiError
    })
    // Status Code other than 200:
    // Check the server form erros. If yes, stay here; if no, redirect to error page.
    if (errors.code) {
      if (
        errors.code === 'A101' ||
        errors.code === 'A102' ||
        errors.code === '3'
      ) {
        return errors
      }
      throw new ApiError(errors.apiError, 'otpCheckError')
    }

    // server is ok. ready to the next page
    // save data to the cache:
    // 1. [Cache] OTP phone number
    // 2. [Cache] Member Card.
    queryClient.setQueryData(['useOtpPhoneMember'], preparedData)
    return redirect('/verification_code')
  }

export default function Page() {
  const [searchParams] = useSearchParams()
  const { data, isLoading, error } = useMemberState(
    searchParams.get('mock_member_state')
  )
  // 頁面載入狀態
  if (isLoading) return <PageSpinner />

  // 錯誤狀態
  if (error) throw new ApiError(error, 'memberStateError')

  // 已綁定
  if (data.code === '1') {
    return <Navigate to="/link_success" replace />
  }
  const cardNumber = searchParams.get('card_number')
  // 未綁定
  return <AccountLinking cardNumber={cardNumber} />
}

function AccountLinking({ cardNumber = '' }) {
  const { handleSubmit, register, watch } = useForm({
    defaultValues: {
      cardNumber: cardNumber,
      phoneNumber: '',
      countryCode: '+886',
      isTermAgreed: false,
    },
  })
  const submit = useSubmit()
  const errors = useActionData()

  return (
    <div className="p-6 pt-10">
      <div className="text-center mb-10">
        <img
          src={WellcareLogo}
          width={80}
          height={80}
          className="inline-block"
        />
        <div className="text-lg text-content-med mt-[10px]">維康醫療用品</div>
      </div>
      <Form onSubmit={handleSubmit((data) => submit(data, { method: 'post' }))}>
        <CardInput
          label="會員卡號"
          className="mb-10"
          invalid={errors?.cardNumber}
          invalidMessage={errors?.cardNumber}
          {...register('cardNumber')}
        />
        <PhoneInput
          label="手機號碼"
          className="mb-[52px]"
          SelectElement={<PhoneAreaSelect {...register('countryCode')} />}
          InputElement={
            <PhoneInputNumber
              {...register('phoneNumber')}
              placeholder="輸入您的電話號碼"
              invalid={errors?.phoneNumber}
              invalidMessage={errors?.phoneNumber}
            />
          }
        />
        <div>
          <div className="font-medium text-content-high text-2xl text-center mb-3">
            綁定說明
          </div>
          <div className="flex flex-col gap-y-4 rounded-lg text-content-med bg-neutral-100 p-4 leading-5 mb-5">
            <div>
              1.
              若會員資料不齊全（手機）無法完成綁定，請洽詢門市完成會員資料，即可順利完成會員綁定。
            </div>
            <div>2. 若忘記會員卡號或遺失會員卡，請洽詢實體門市。</div>
          </div>
          <div className="px-8 mb-[34px] text-center">
            <PolicyCheckInput {...register('isTermAgreed')} />
          </div>
          <Button
            full
            type="submit"
            disabled={
              !watch('isTermAgreed') ||
              !watch('cardNumber') ||
              !watch('phoneNumber') ||
              errors?.code === '3' // 寄送超過 5 次
            }>
            發送驗證碼
          </Button>
          <div className="text-semantic-red text-base leading-5 font-medium pt-2">
            {errors?.message}
          </div>
        </div>
      </Form>
    </div>
  )
}
