import coupon from '../assets/coupon.jpg'
import discount from '../assets/discount.jpg'
import gift from '../assets/gift.jpg'
import couponMini from '../assets/coupon_mini.jpg'
import discountMini from '../assets/discount_mini.jpg'
import giftMini from '../assets/gift_mini.jpg'

export default function Voucher({
  type = 'discount',
  isMini = false,
  ...props
}) {
  const typeName = isMini ? `${type}Mini` : type
  return (
    <img
      src={
        { coupon, discount, gift, couponMini, discountMini, giftMini }[typeName]
      }
      alt={`${type} voucher`}
      {...props}
    />
  )
}
