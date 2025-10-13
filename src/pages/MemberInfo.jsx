import MemberCard from '../components/MemberCard'
import Button from '../components/Button'
import BarCode from '../components/BarCode'
import PageSpinner from '../components/PageSpinner'
import numberWithCommas from '../helpers/numberWithCommas'
import memberPageBgSvg from '../assets/member_page_bg.svg'
import { useLineUserProfile, useMemberCardInfo } from '../services/hooks'
import { ErrorBoundary } from 'react-error-boundary'
import { ApiError } from '../config/errorMsg'
import { useSearchParams, Link } from 'react-router-dom'

export default function Page() {
  const { data: lineProfile, isLoading: isLoadingLineUserProfile } =
    useLineUserProfile()

  const [searchParams] = useSearchParams()
  const {
    data: memberCardInfo,
    isLoading: isLoadingMemberCardInfo,
    error: memberCardInfoError,
  } = useMemberCardInfo(searchParams.get('mock_state'))

  if (memberCardInfoError)
    throw new ApiError(memberCardInfoError, 'unexpectedError')
  if (isLoadingMemberCardInfo || isLoadingLineUserProfile) {
    return <PageSpinner />
  }
  return (
    <MemberCardInfo
      username={memberCardInfo.data.name}
      point={memberCardInfo.data.remainingPoints}
      credit={memberCardInfo.data.birthDayCredits}
      cardNumber={memberCardInfo.data.memberNumber}
      avatarImageUrl={lineProfile.pictureUrl}
    />
  )
}

export function MemberCardInfo({
  username = '',
  point = 0,
  credit = 0,
  cardNumber = '',
  avatarImageUrl = '',
}) {
  return (
    <div
      className="relative h-screen overflow-auto py-7 px-[16px] sm:px-[30px] bg-no-repeat bg-top-center bg-[length:100%]"
      style={{ backgroundImage: `url(${memberPageBgSvg})` }}>
      <div className="text-content-high font-medium text-xl mb-2.5 leading-7">
        我的會員卡
      </div>
      <MemberCard
        username={username}
        point={point}
        className="mb-8"
        avatarImageUrl={avatarImageUrl}
      />
      <div className="text-center text-base text-content-high text-base font-medium leading-5 mb-4">
        會員卡號
      </div>
      <div className="divide-y divide-border-general">
        <div className="w-full mb-4">
          <ErrorBoundary
            fallback={
              <div className="text-xl text-red-600 text-center">
                會員卡號或條碼載入失敗
              </div>
            }>
            <BarCode code={cardNumber} className="mb-1" />
          </ErrorBoundary>
          <div className="text-black text-center text-lg font-light font-number tracking-wide">
            {cardNumber}
          </div>
        </div>
        <div className="pt-5">
          <div className="text-center text-content-high font-medium text-base leading-5 mb-4">
            生日禮金
          </div>
          <div className="flex flex-row-gap-x-0 5 items-end justify-center mb-4">
            <span className="text-theme-credit text-[40px] font-semibold leading-8 font-number tracking-normal">
              {numberWithCommas(credit)}
            </span>
            <div className="text-content-high text-base font-medium leading-5">
              元
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-3 pt-9">
          <Link to={import.meta.env.VITE_WELLCARE_OFFICIAL_WEBSITE}>
            <Button hollow full>
              維康線上購物 🛒
            </Button>
          </Link>
          <Link to={import.meta.env.VITE_WELLCARE_ONLINE_STORE}>
            <Button hollow full>
              全台門市據點 📍
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
