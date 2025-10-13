import CouponDetail, { couponDetailLoaderWithQuery } from './CouponDetail'
import CouponList from './CouponList'
import { Outlet, NavLink, useSearchParams, useLocation } from 'react-router-dom'
import cx from 'classnames'
import { ApiError } from '../../config/errorMsg'

import { useCouponList } from '~/services/hooks'
import redeemedActive from '../../assets/redeemed_active.svg'
import redeemedInactive from '../../assets/redeemed_inactive.svg'
import redeemableActive from '../../assets/redeemable_active.svg'
import redeemableInactive from '../../assets/redeemable_inactive.svg'
import expiredActive from '../../assets/expired_active.svg'
import expiredInactive from '../../assets/expired_inactive.svg'

export { CouponList, CouponDetail, couponDetailLoaderWithQuery }

const renderActiveClassNameLink = ({ isActive }) =>
  cx('flex flex-col items-center gap-y-2 w-[100px] pb-2 border-b-2 group', {
    'border-theme active': isActive,
    'border-white': !isActive,
  })

function NavBar() {
  const location = useLocation()
  return (
    <div className="flex flex-row justify-between items-center bg-white rounded-tr-[20px] rounded-tl-[20px] pt-2 px-3">
      <NavLink
        to={{ pathname: 'redeemable', search: location.search }}
        className={renderActiveClassNameLink}>
        <img
          src={redeemableActive}
          className="w-8 h-8 hidden group-[.active]:block"
        />
        <img
          src={redeemableInactive}
          className="w-8 h-8 block group-[.active]:hidden"
        />
        <div className="text-base leading-5 text-content-high">可兌換</div>
      </NavLink>
      <NavLink
        to={{ pathname: 'redeemed', search: location.search }}
        className={renderActiveClassNameLink}>
        <img
          src={redeemedActive}
          className="w-8 h-8 hidden group-[.active]:block"
        />
        <img
          src={redeemedInactive}
          className="w-8 h-8 block group-[.active]:hidden"
        />
        <div className="text-base leading-5 text-content-high">已兌換</div>
      </NavLink>
      <NavLink
        to={{ pathname: 'expired', search: location.search }}
        className={renderActiveClassNameLink}>
        <img
          src={expiredActive}
          className="w-8 h-8 hidden group-[.active]:block"
        />
        <img
          src={expiredInactive}
          className="w-8 h-8 block group-[.active]:hidden"
        />
        <div className="text-base leading-5 text-content-high">已過期</div>
      </NavLink>
    </div>
  )
}

export default function MyCoupons() {
  const [searchParams] = useSearchParams()
  const redeemable = useCouponList({
    status: 0,
    length: searchParams.get('length'),
  })
  const redeemed = useCouponList({
    status: 1,
    length: searchParams.get('length'),
  })
  const expired = useCouponList({
    status: 2,
    length: searchParams.get('length'),
  })

  const error = redeemable?.error || redeemed?.error || expired?.error
  if (error) {
    throw new ApiError(error, 'couponError')
  }

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #0FB85A 0%, #0D994B 100%)',
      }}>
      <div className="text-xl leading-7 font-medium text-center py-4 text-white">
        我的優惠券
      </div>
      <div className="flex flex-col divide-y divide-border-divider">
        <NavBar />
        <div className="bg-white">
          <Outlet context={{ redeemable, redeemed, expired }} />
        </div>
      </div>
    </div>
  )
}
