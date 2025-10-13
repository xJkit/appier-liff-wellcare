import dayjs from 'dayjs'
import { faker } from '@faker-js/faker'

/**
  const couponExample = {
    coupons: [
      {
        type: '1',
        code: '1639999',
        description: '現折1400元-臥床亞培(液體)新客卷折1400',
        minAmount: 3855,
        maxAmount: 99999999,
        discount: 1400,
        startTime: 1659283200000, // 2022-08-01
        endTime: 1688140799999, // 2023-06-30
        redeemed: false,
      },
    ],
  }
**/

// get coupon status
/**
 * 0: redeemable 可兌換
 * 1: redeemed 已兌換
 * 2: expired 已過期
 */
export default function makeCoupons({ length = 1, status = 0 }) {
  return Array.from(
    {
      length,
    },
    () => ({
      type: `${faker.number.int({ min: 1, max: 3 })}`,
      code: faker.string.numeric({ length: 7 }),
      description: faker.lorem.words({ min: 3, max: 10 }),
      minAmount: faker.number.int({ min: 1, max: 100 }),
      maxAmount: faker.number.int({ min: 101, max: 9999999 }),
      discount: faker.number.int({ min: 9, max: 9999 }),
      startTime: dayjs(
        faker.date.between({
          from: '2023-07-01T00:00:00.000Z',
          to: '2025-07-01T00:00:00.000Z',
        })
      ).valueOf(),
      endTime: dayjs(
        faker.date.between({
          from: '2023-07-01T00:00:00.000Z',
          to: '2025-07-01T00:00:00.000Z',
        })
      ).valueOf(),
      redeemed: status === 0 ? true : false,
    })
  )
}

export const MOCK_COUPONS = {
  EMPTY_STATES: [0, 1, 2].map((status) => makeCoupons({ length: 0, status })),
  NORMAL_STATES: [0, 1, 2].map((status) => {
    if (status === 0) return makeCoupons({ length: 8, status })
    if (status === 1) return makeCoupons({ length: 3, status })
    return makeCoupons({ length: 100, status })
  }),
}
