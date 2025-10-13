import dayjs from 'dayjs'
import { useLoaderData, Link, useNavigate } from 'react-router-dom'

import { TermsSection, TermsConditionDetail } from './Terms'
import numberWithCommas from '../../helpers/numberWithCommas'
import Button from '../../components/Button'
import BarCode from '../../components/BarCode'
import Voucher from '../../components/Voucher'
import termsHeaderBg from '../../assets/terms_header_bg.svg'
import termsContentBg from '../../assets/terms_content_bg.svg'

export const couponDetailLoaderWithQuery =
  (queryClient) =>
  ({ params }) => {
    const { couponType, code } = params
    const couponStatus =
      { redeemable: 0, redeemed: 1, expired: 2 }[couponType] || 0
    // { coupons: [] | undefined }
    const couponResponse = queryClient.getQueryData([
      'useCouponList',
      couponStatus,
      null,
    ])

    if (!couponResponse) {
      throw new Error('Directly access coupon page is not allowed.')
    }
    const coupon = couponResponse.coupons?.find(
      (coupon) => coupon?.code === code
    )
    if (!coupon) {
      throw new Error('No coupon available.')
    }
    return { coupon, couponStatus }
  }

const voucherTypeMap = {
  1: {
    name: 'coupon',
    title: '優惠券',
  },
  2: {
    name: 'gift',
    title: '贈品券',
  },
  3: {
    name: 'discount',
    title: '折價券',
  },
}

export default function CouponDetail() {
  const navigate = useNavigate()
  const { coupon, couponStatus } = useLoaderData()
  return (
    <div className="relative h-screen overflow-auto py-7 px-[16px] sm:px-[30px] bg-[#F5FFEE]">
      <div className="pt-[60px] text-center">
        <div
          className="w-[220px] h-[220px] inline-block rounded-lg overflow-hidden mb-4 relative"
          style={{
            boxShadow: '0px 7px 12px 0px rgba(0, 0, 0, 0.05)',
          }}>
          <Voucher type={voucherTypeMap[coupon.type].name} />
          {couponStatus !== 0 && (
            <div
              className="absolute inset-0 z-10 flex flex-col justify-center items-center"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <div className="inline p-3 text-4xl text-white border-white rounded-full border-4 origin-center -rotate-[10deg] leading-[48px]">
                {{ 1: '已兌換', 2: '已過期' }[couponStatus] || ''}
              </div>
            </div>
          )}
        </div>
        <div className="text-content-med text-lg leading-6 mb-4">
          {voucherTypeMap[coupon.type].title}
        </div>
        <div className="text-content-high text-2xl leading-8 font-bold mb-7">
          {coupon.description}
        </div>
        <div className="bg-white mb-4 p-2 shadow-sm">
          <BarCode code={coupon.code} className="h-[92px]" />
        </div>
        <div className="text-lg leading-6 text-content-serial mb-10">
          序號：{coupon.code}
        </div>
        <Link to="/my_coupons">
          <Button
            hollow
            full
            className="border-2 !rounded-[30px]"
            onClick={() => navigate(-1)}>
            回獎項清單
          </Button>
        </Link>
      </div>
      <div className="pt-4">
        <div
          className="relative z-10 w-[320px] leading-[60px] text-center mx-auto font-semibold text-base leading-7 text-content-terms_title bg-no-repeat bg-cover"
          style={{
            backgroundImage: `url(${termsHeaderBg})`,
          }}>
          【活動說明及使用條款】
        </div>
        <div
          style={{ backgroundImage: `url(${termsContentBg})` }}
          className="flex flex-col gap-y-3 bg-no-repeat bg-cover relative -top-[18px] px-6 py-8 border-white rounded-[14px] border-2 shadow-lg">
          <TermsSection
            title="使用起始日"
            content={dayjs(coupon.startTime).format('MM/DD/YYYY')}
          />
          <TermsSection
            title="使用結束日"
            content={dayjs(coupon.endTime).format('MM/DD/YYYY')}
          />
          <TermsSection
            title="優惠券需滿消費金額"
            content={`${numberWithCommas(coupon.minAmount)}元`}
          />
          <TermsSection
            title="使用說明"
            content={`消費滿 $${numberWithCommas(
              coupon.minAmount
            )} 元折價 $${numberWithCommas(
              renderDiscountNum(coupon.discount)
            )}元`}
          />
          <TermsSection
            title="使用方式及注意事項"
            content={<TermsConditionDetail />}
          />
        </div>
      </div>
    </div>
  )
}

const renderDiscountNum = (num = 0) => {
  if (typeof num !== 'number') {
    return 0
  }
  if (num >= 0) {
    return num
  }
  // num < 0
  return num * -1
}
