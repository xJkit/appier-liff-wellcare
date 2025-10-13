import Voucher from '../components/Voucher'

export default {
  title: '代金券',
  component: Voucher,
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
}

export const 折價券 = {
  args: {
    type: 'discount',
    isMini: false,
  },
}

export const 優惠券 = {
  args: {
    type: 'coupon',
    isMini: false,
  },
}

export const 贈禮券 = {
  args: {
    type: 'gift',
    isMini: false,
  },
}
