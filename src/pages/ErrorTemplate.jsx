import { useRouteError, Link, useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../config/errorMsg'
import errorSvg from '../assets/error.svg'
import Button from '../components/Button'
import { ApiError } from '../config/errorMsg'
import liff from '@line/liff'

export default function Page() {
  const error = useRouteError()
  console.error('[Error] ', error)
  if (error instanceof ApiError) {
    console.error('[ApiError] ', error.code, error.type)
    return <ErrorTemplate code={error.code} type={error.type} />
  }
  return <ErrorTemplate code={'500'} type="unexpectedError" />
}

export function ErrorTemplate({ code = '500', type = 'unexpectedError' }) {
  const message = {}
  const errorMsg = getErrorMessage(type, code)
  const navigate = useNavigate()

  message.title = errorMsg
  if (Array.isArray(errorMsg)) {
    message.title = errorMsg[0]
    message.message = errorMsg[1]
  }
  return (
    <div
      className="pt-[112px] p-6 h-screen"
      style={{ backgroundColor: '#EEEEEE' }}>
      <img className="block mx-auto w-[128px] h-[128px] mb-6" src={errorSvg} />
      <div className="text-content-high font-bold text-2xl leading-8 text-center mb-3">
        {message.title}
      </div>
      {message.message && (
        <div className="text-content-med font-normal text-lg leading-6 text-center mb-14">
          {message.message}
        </div>
      )}
      <div className="flex flex-col gap-y-3">
        <Button full onClick={() => navigate(0)}>
          重新驗證
        </Button>
        <Button full hollow onClick={liff.closeWindow}>
          回到聊天室
        </Button>
      </div>
      <div className="absolute bottom-4 left-0 right-0 text-center text-content-med font-normal text-base">
        錯誤代碼：{code}
      </div>
    </div>
  )
}
