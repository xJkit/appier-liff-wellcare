import dayjs from 'dayjs'
import { useOutletContext, useNavigate } from 'react-router-dom'
import longDashSvg from '../../assets/long_dash.svg'
import Spinner from '../../components/PageSpinner'
import Voucher from '../../components/Voucher'
import Button from '../../components/Button'

// map type code to name
// type 1 優惠券 2 贈品券 3 折價券
const typeCodeToName = {
  1: { en: 'coupon', zh_TW: '優惠券' },
  2: { en: 'gift', zh_TW: '贈品券' },
  3: { en: 'discount', zh_TW: '折價券' },
}
const CouponItem = ({
  type = 1,
  description = '未知優惠',
  endDate = 946659661,
  code = '',
  tab = '',
}) => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-row gap-x-3 py-3 py-5">
      <div className="w-[60px] h-[60px] border overflow-hidden border-border-voucher rounded-lg">
        <Voucher isMini type={typeCodeToName[type]?.en} />
      </div>
      <div className="flex flex-col flex-1">
        <div className="text-base leading-5 text-content-med mb-1 ">
          {typeCodeToName[type]?.zh_TW}
        </div>
        <div className="text-lg leading-6 text-content-high mb-3.5">
          {description}
        </div>
        <div className="flex flex-row gap-x-1 items-center">
          <div className="text-content-high py-0.5 px-2 rounded bg-[#f0f0f0]">
            使用結束日
          </div>
          <div className="text-content-tertiary text-sm leading-6">
            {dayjs(endDate).format('MM/DD/YYYY')}
          </div>
        </div>
      </div>
      <div className="w-[80px]">
        <Button
          full
          className="rounded-[40px] h-8"
          onClick={() => navigate(`/detail/${tab}/${code}`)}>
          查看
        </Button>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <div className="flex flex-row gap-x-3 bg-white justify-center py-10">
      <img src={longDashSvg} />
      <div className="text-content-low text-base leading-5">以上為所有獎項</div>
      <img src={longDashSvg} />
    </div>
  )
}

export default function CouponList({ tab = '', ...props }) {
  const queryContext = useOutletContext()
  if (queryContext[tab]?.isLoading) return <Spinner />

  return (
    <div className="divide-y px-3">
      {queryContext[tab]?.data?.coupons.map((coupon) => (
        <CouponItem
          key={coupon.code}
          code={coupon.code}
          tab={tab}
          type={coupon.type}
          description={coupon.description}
          endDate={coupon.endTime}
        />
      ))}
      <Footer />
    </div>
  )
}
