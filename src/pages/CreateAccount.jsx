import { useForm } from 'react-hook-form'
import {
  useSearchParams,
  Navigate,
  useSubmit,
  useActionData,
  redirect,
} from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { ApiError, getErrorMessage } from '../config/errorMsg'
import WellcareLogo from '../assets/wellcare_logo.png'
import Button from '../components/Button'
import Form, {
  PhoneInput,
  PhoneAreaSelect,
  PhoneInputNumber,
  PolicyCheckInput,
} from '../components/Form'
import API from '../services/api'

dayjs.extend(customParseFormat)

// Format birthday input to YYYY-MM-DD
const formatBirthday = (value) => {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, '')

  // Apply formatting
  if (numbers.length <= 4) {
    return numbers
  } else if (numbers.length <= 6) {
    return `${numbers.slice(0, 4)}-${numbers.slice(4)}`
  } else {
    return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(
      6,
      8
    )}`
  }
}

export const registerAndSendOtpActionWithQuery =
  (queryClient) =>
  async ({ request }) => {
    const formData = await request.formData()
    const formattedData = {
      name: formData.get('name'),
      birthday: formData.get('birthday'),
      countryCode: formData.get('countryCode'),
      phoneNumber: formData.get('phoneNumber').replace(/\s/g, ''),
      isTermAgreed: formData.get('isTermAgreed'),
    }

    const errors = {}

    // 姓名驗證
    if (!formattedData.name || formattedData.name.trim() === '') {
      errors.name = '請輸入姓名'
    }

    // 生日驗證
    const birthdayRule = /^\d{4}-\d{2}-\d{2}$/
    if (!birthdayRule.test(formattedData.birthday)) {
      errors.birthday = '格式錯誤'
    } else {
      // 驗證是否為合法日期且在今日以前
      const birthdayDate = dayjs(formattedData.birthday, 'YYYY-MM-DD', true)
      if (!birthdayDate.isValid()) {
        errors.birthday = '日期不合法'
      } else if (birthdayDate.isAfter(dayjs(), 'day')) {
        errors.birthday = '生日必須在今日之前'
      }
    }

    // 電話號碼格式驗證
    const taiwanPhoneRule = /^[0][9]\d{8}$/
    if (!taiwanPhoneRule.test(formattedData.phoneNumber)) {
      errors.phoneNumber = '格式錯誤'
    }

    // 如果有錯誤，返回錯誤訊息
    if (Object.keys(errors).length) {
      return errors
    }

    // 準備 API 資料
    const api = new API()
    const registrationData = {
      name: formattedData.name,
      birthday: formattedData.birthday,
      mobilePhone: formattedData.phoneNumber.replace(
        /[0]/,
        formattedData.countryCode
      ),
    }

    // 呼叫註冊 API
    const result = await api
      .registerMember(registrationData)
      .catch((apiError) => {
        const { code } = apiError
        errors.code = code
        errors.message = getErrorMessage('memberCheckError', code)
        errors.apiError = apiError
      })

    // 如果註冊 API 有錯誤
    if (errors.code) {
      // 某些錯誤留在當前頁面顯示
      if (errors.code === 'A101' || errors.code === 'A103') {
        return errors
      }
      // 其他錯誤拋出到錯誤頁面
      throw new ApiError(errors.apiError, 'memberCheckError')
    }

    // 註冊成功，準備發送 OTP
    if (result.code === '7') {
      const otpData = {
        memberNumber: result.memberNumber,
        mobilePhone: registrationData.mobilePhone,
      }

      // 發送 OTP
      await api.sendOTP(otpData).catch((apiError) => {
        const { code } = apiError
        errors.code = code
        errors.message = getErrorMessage('otpCheckError', code)
        errors.apiError = apiError
      })

      // 如果發送 OTP 有錯誤
      if (errors.code) {
        // 某些錯誤留在當前頁面顯示
        if (
          errors.code === 'A101' ||
          errors.code === 'A102' ||
          errors.code === '3'
        ) {
          return errors
        }
        // 其他錯誤拋出到錯誤頁面
        throw new ApiError(errors.apiError, 'otpCheckError')
      }

      // OTP 發送成功，存入快取並導向驗證碼頁面
      queryClient.setQueryData(['useOtpPhoneMember'], otpData)

      // 保存表單初始值到快取
      queryClient.setQueryData(['useCreateAccountFormData'], {
        name: formattedData.name,
        birthday: formattedData.birthday,
        phoneNumber: formattedData.phoneNumber,
        countryCode: formattedData.countryCode,
      })

      return redirect('/verification_code?from=create_account')
    }

    return errors
  }

export default function CreateAccount() {
  const queryClient = useQueryClient()

  // 從快取載入表單初始值
  const cachedFormData = queryClient.getQueryData(['useCreateAccountFormData'])

  const { handleSubmit, register, watch, setValue } = useForm({
    defaultValues: cachedFormData || {
      name: '',
      birthday: '',
      phoneNumber: '',
      countryCode: '+886',
      isTermAgreed: false,
    },
  })
  const submit = useSubmit()
  const errors = useActionData()

  const handleBirthdayChange = (e) => {
    const formatted = formatBirthday(e.target.value)
    setValue('birthday', formatted)
  }

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
        <label className="block mb-10">
          <div className="text-lg text-content-high font-medium mb-2">姓名</div>
          <input
            type="text"
            className="form-input block w-full border-0 border-b border-gray-200 focus:ring-0 focus:border-theme pb-1 px-2 placeholder:text-content-low placeholder:text-lg text-[26px] font-semibold placeholder:font-normal"
            placeholder="輸入您的姓名"
            {...register('name')}
          />
          {errors?.name && (
            <span className="block mt-1 text-semantic-red text-base font-medium leading-5">
              {errors.name}
            </span>
          )}
        </label>
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
        <label className="block mb-10">
          <div className="text-lg text-content-high font-medium mb-2">生日</div>
          <input
            type="text"
            placeholder="YYYY-MM-DD"
            maxLength={10}
            className="form-input block w-full border-0 border-b border-gray-200 focus:ring-0 focus:border-theme pb-1 px-2 placeholder:text-content-low placeholder:text-lg text-[26px] font-semibold placeholder:font-normal font-number tracking-wide leading-7"
            {...register('birthday')}
            onChange={handleBirthdayChange}
          />
          {errors?.birthday && (
            <span className="block mt-1 text-semantic-red text-base font-medium leading-5">
              {errors.birthday}
            </span>
          )}
        </label>

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
              !watch('name') ||
              !watch('birthday') ||
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
