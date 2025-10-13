import { MemberCardInfo } from '../pages/MemberInfo'

export default {
  title: '我的會員卡',
  component: MemberCardInfo,
  // tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
}

export const 我的會員卡_空白狀態 = {
  args: {
    username: '',
    point: 0,
    credit: 0,
    cardNumber: '',
  },
}

export const 我的會員卡_正常 = {
  args: {
    username: '王志強',
    point: 654321,
    credit: 123456,
    cardNumber: '1234567890',
  },
}

export const 我的會員卡_極限狀態 = {
  args: {
    username: '王志強強強強強強強強',
    point: 999999999999,
    credit: 99999999999,
    cardNumber: '1234567890',
  },
}
