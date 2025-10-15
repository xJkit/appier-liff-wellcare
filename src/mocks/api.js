import delay from '../helpers/delay'
import { rest } from 'msw'
import { MOCK_COUPONS } from './makeCoupons'

export const getMemberState = rest.get('/member/state', (req, res, ctx) => {
  const authHeader = req.headers.get('Authorization')
  console.table({ Token: authHeader })

  // mock scenarios
  const MOCK_MEMBER_STATE = req.url.searchParams.get('mock_member_state')
  const meta = {
    code: '0',
    message: 'unBound',
  }
  switch (MOCK_MEMBER_STATE) {
    case '1':
      meta.code = MOCK_MEMBER_STATE
      meta.message = 'Bound'
      return res(ctx.status(200), ctx.json(meta))
    case '401':
      console.log('Unauthorized')
      meta.code = MOCK_MEMBER_STATE
      meta.message = 'Line token Unauthorized'
      return res(ctx.status(401), ctx.json(meta))
    default:
      return res(ctx.status(200), ctx.json(meta))
  }
})

export const getMemberCard = rest.get('/member/card', (req, res, ctx) => {
  const authHeader = req.headers.get('Authorization')
  console.table({ Token: authHeader })

  const MOCK_STATE = req.url.searchParams.get('mock_state')
  const meta = {
    code: 200,
    message: 'success',
  }
  const data = {
    memberNumber: '5478054780', //會員卡號
    name: '阿皮爾', //會員姓名 (一般卡面最多6個字元)
    mobilePhone: '0988777666', //手機
    birthday: '1989/06/04', //生日
    bonus: '123452', //紅利點數
    redeemedPoints: '1231', // 已兌點數
    remainingPoints: '54780', // 剩餘點數 (欄位最大7位數字)
    birthDayCredits: '200', // 生日禮金 (欄位最大位9位數字, 一般最大是只有200元)
  }

  switch (MOCK_STATE) {
    case 'A201':
      meta.code = MOCK_STATE
      meta.message = 'Failed to get member data.'
      return res(ctx.status(404), ctx.json(meta))
    case 'A202':
      meta.code = MOCK_STATE
      meta.message = 'Bad request.'
      return res(ctx.status(400), ctx.json(meta))
    case 'A203':
      meta.code = MOCK_STATE
      meta.message = 'Invaliad member data.'
      return res(ctx.status(404), ctx.json(meta))
    case 'A204':
      meta.code = MOCK_STATE
      meta.message = 'Member data: insufficient member data.'
      return res(ctx.status(400), ctx.json(meta))
    case '401':
      meta.code = MOCK_STATE
      meta.message = 'Line token Unauthorized'
      return res(ctx.status(401), ctx.json(meta))
    // 資料檢驗
    case 'zero': // 空白狀態
      return res(ctx.status(meta.code), ctx.json({ ...meta, data: {} }))
    case 'max': // 極限狀態
      data.name = '阿皮爾我最大'
      data.remainingPoints = '7654321'
      data.birthDayCredits = '987654321'
      return res(ctx.status(meta.code), ctx.json({ ...meta, data }))
    default: // 正常狀態
      return res(ctx.status(meta.code), ctx.json({ ...meta, data }))
  }
})

export const postRegisterMember = rest.post(
  '/member/register',
  async (req, res, ctx) => {
    const token = req.headers.get('Authorization')
    const body = await req.json()
    console.table({ token, body })

    const { name, birthday, mobilePhone } = body

    let MOCK_STATE

    const meta = {
      code: '7',
      message: 'register success',
      memberNumber: '12345678', // 模擬生成的會員卡號
    }

    // 根據輸入值模擬不同錯誤情境
    if (name === 'error101') {
      MOCK_STATE = 'A101'
    } else if (mobilePhone === '+886900000000') {
      MOCK_STATE = 'A103'
    }

    await delay(1500) // 模擬註冊時間

    switch (MOCK_STATE) {
      case 'A101':
        meta.code = MOCK_STATE
        meta.message = 'Member data: member not exist.'
        delete meta.memberNumber
        return res(ctx.status(400), ctx.json(meta))
      case 'A103':
        meta.code = MOCK_STATE
        meta.message = 'Bad request'
        delete meta.memberNumber
        return res(ctx.status(400), ctx.json(meta))
      case '401':
        meta.code = MOCK_STATE
        meta.message = 'Line token Unauthorized'
        delete meta.memberNumber
        return res(ctx.status(401), ctx.json(meta))
      default:
        return res(ctx.status(200), ctx.json(meta))
    }
  }
)

export const postOtpSend = rest.post('/otp/send', async (req, res, ctx) => {
  const token = req.headers.get('Authorization')
  const body = await req.json()
  console.table({ token, body })

  const { memberNumber, mobilePhone } = body

  let MOCK_STATE

  const meta = {
    code: '2',
    message: 'success',
  }

  if (memberNumber === '00000000') {
    MOCK_STATE = 'A101'
  } else if (mobilePhone === '+886911111111') {
    MOCK_STATE = 'A102'
  } else if (memberNumber === '55555555') {
    MOCK_STATE = '3'
  }

  switch (MOCK_STATE) {
    case '3':
      meta.code = MOCK_STATE
      meta.message = 'over send otp code rate limit'
      return res(ctx.status(429), ctx.json(meta))
    case 'A101':
      meta.code = MOCK_STATE
      meta.message = 'Member data: member not exist.'
      return res(ctx.status(400), ctx.json(meta))
    case 'A102':
      meta.code = MOCK_STATE
      meta.message = 'Member data: mobile phone not match.'
      return res(ctx.status(400), ctx.json(meta))
    case 'A103':
      meta.code = MOCK_STATE
      meta.message = 'Bad request'
      return res(ctx.status(400), ctx.json(meta))
    case 'A104':
      meta.code = MOCK_STATE
      meta.message = 'Undefined Error'
      return res(ctx.status(500), ctx.json(meta))
    case 'A105':
      meta.code = MOCK_STATE
      meta.message = 'Member data: insufficient member data'
      return res(ctx.status(400), ctx.json(meta))
    case '401':
      meta.code = MOCK_STATE
      meta.message = 'Line token Unauthorized'
      return res(ctx.status(401), ctx.json(meta))
    default:
      return res(ctx.status(200), ctx.json(meta))
  }
})

export const postOtpVerify = rest.post('/otp/verify', async (req, res, ctx) => {
  const token = req.headers.get('Authorization')
  const body = await req.json()
  console.table({ token, body })

  const { memberNumber, mobilePhone, otpCode } = body

  let MOCK_STATE = {
    111111: 'A101',
    222222: 'A102',
    333333: 'A103',
    444444: 'A104',
    555555: 'A105',
    666666: '4',
    777777: '5',
    888888: '6',
    999999: '401',
  }[otpCode]

  const meta = {
    code: '1',
    message: 'Bound',
  }

  await delay(3000) // 模擬認證時間 3 sec

  switch (MOCK_STATE) {
    case '4':
      meta.code = MOCK_STATE
      meta.message = 'over verify rate limit.'
      return res(ctx.status(429), ctx.json(meta))
    case 'A101':
      meta.code = MOCK_STATE
      meta.message = 'Member data: member not exist.'
      return res(ctx.status(400), ctx.json(meta))
    case 'A102':
      meta.code = MOCK_STATE
      meta.message = 'Member data: mobile phone not match.'
      return res(ctx.status(400), ctx.json(meta))
    case 'A103':
      meta.code = MOCK_STATE
      meta.message = 'Bad request'
      return res(ctx.status(400), ctx.json(meta))
    case 'A104':
      meta.code = MOCK_STATE
      meta.message = 'Undefined Error'
      return res(ctx.status(500), ctx.json(meta))
    case 'A105':
      meta.code = MOCK_STATE
      meta.message = 'Member data: insufficient member data'
      return res(ctx.status(400), ctx.json(meta))
    case '5':
      meta.code = MOCK_STATE
      meta.message = 'otp code expired'
      return res(ctx.status(400), ctx.json(meta))
    case '6':
      meta.code = MOCK_STATE
      meta.message = 'otp code not matched'
      return res(ctx.status(400), ctx.json(meta))
    case '401':
      meta.code = MOCK_STATE
      meta.message = 'Line token Unauthorized'
      return res(ctx.status(401), ctx.json(meta))
    default:
      return res(ctx.status(200), ctx.json(meta))
  }
})

export const getCouponList = rest.get('/coupon/list', async (req, res, ctx) => {
  const authHeader = req.headers.get('Authorization')
  console.table({ Token: authHeader })

  // get coupon status
  /**
   * 0: redeemable 可兌換
   * 1: redeemed 已兌換
   * 2: expired 已過期
   */
  const status = req.url.searchParams.get('status')
  const length = req.url.searchParams.get('length')
  // mock scenarios
  const meta = {
    code: '0',
    message: 'success',
  }

  const couponData = {
    coupons: MOCK_COUPONS.NORMAL_STATES[status],
  }

  if (length === '0') {
    couponData.coupons = MOCK_COUPONS.EMPTY_STATES[status]
  }

  if (['A301', 'A302', 'A303', 'A304'].includes(length)) {
    meta.code = length
    meta.message = ''
    return res(ctx.status(400), ctx.json(meta))
  }

  if (length === '500') {
    meta.code = '500'
    meta.message = ''
    return res(ctx.status(500), ctx.json(meta))
  }

  await delay(3000)

  switch (status) {
    case '0':
    case '1':
    case '2':
      return res(ctx.status(200), ctx.json(couponData))
    default:
      meta.code = '500'
      meta.message = 'Internal Server Error'
      return res(ctx.status(500), ctx.json(meta))
  }
})
