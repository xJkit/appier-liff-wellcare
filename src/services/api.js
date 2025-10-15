import liff from '@line/liff'

export default class API {
  constructor() {
    this.endpoint = import.meta.env.VITE_MOCK
      ? ''
      : `${import.meta.env.VITE_SERVER_PROTOCOL}://${
          import.meta.env.VITE_SERVER_HOSTNAME
        }${import.meta.env.VITE_SERVER_API_ROOT_PATH}`
    this.headers = {
      Authorization: `Bearer ${liff.getIDToken()}`,
      'Content-Type': 'application/json',
    }
  }

  /**
   * HTTP Get Request
   * @param {string} url - endpoint for http get request
   * @returns {Promise<*>}
   */
  GET = async (url) => {
    const response = await fetch(`${this.endpoint}${url}`, {
      headers: this.headers,
      method: 'GET',
    })

    if (!response.ok) {
      throw await response.json() // { code, message }
    }
    return response.json()
  }

  /**
   * HTTP Post Request
   * @param {string} url - endpoint for http post request
   * @param {object} body - post body for post request
   * @returns {Promise<*>}
   */
  POST = async (url, body = {}) => {
    const response = await fetch(`${this.endpoint}${url}`, {
      headers: this.headers,
      method: 'POST',
      body: JSON.stringify(body),
    })
    if (!response.ok) {
      throw await response.json() // { code, message }
    }
    return response.json()
  }

  /**
   * Get the current member state
   * @typedef {import('../types').MemberState} MemberState
   * @returns {Promise<MemberState>}
   */
  getMemberState = (query) => {
    return this.GET(`/member/state?mock_member_state=${query}`)
  }

  /**
   * Get the member detail information
   * @typedef {import('../types').MemberCard} MemberCard
   * @returns {Promise<MemberCard>}
   */
  getMemberCard = (query) => {
    return this.GET(`/member/card?mock_state=${query}`)
  }

  /**
   * Send OTP
   * @typedef {import('../types').OTPSendInfo} OTPSendInfo
   * @typedef {import('../types').OTPSendResult} OTPSendResult
   * @param {string} query - OTP query string
   * @param {OTPSendInfo} body - OTP Request Body
   * @returns {Promise<OTPSendResult>}
   */
  sendOTP = (
    body = {
      memberNumber: '', // ex: 123890
      mobilePhone: '', // ex: +886966333222
    }
  ) => {
    return this.POST(`/otp/send`, body)
  }

  /**
   * Verify OTP
   * @typedef {import('../types').OTPVerifyInfo} OTPVerifyInfo
   * @typedef {import('../types').OTPVerifyResult} OTPVerifyResult
   * @param {OTPVerifyInfo} body - OTP Request Body
   * @returns {Promise<OTPVerifyResult>}
   */
  verifyOTP = (
    body = {
      memberNumber: '', // ex: 123890
      mobilePhone: '', // ex: +886966333222
      otpCode: '', // ex: 000000
    }
  ) => {
    return this.POST('/otp/verify', body)
  }

  /**
   * Get the coupon list
   * @param {number} status - coupon status for redeemable/redeemed/expired
   * @typedef {import('../types').CouponResponse} CouponResponse
   * @returns {Promise<CouponResponse>}
   */
  getMCouponList = (status = 0, length = '') => {
    /**
     * 0: redeemable 可兌換
     * 1: redeemed 已兌換
     * 2: expired 已過期
     */
    return this.GET(`/coupon/list?status=${status}&length=${length}`)
  }

  /**
   * Register a new member
   * @typedef {import('../types').MemberRegisterInfo} MemberRegisterInfo
   * @typedef {import('../types').MemberRegisterResult} MemberRegisterResult
   * @param {MemberRegisterInfo} body - Member registration data
   * @returns {Promise<MemberRegisterResult>}
   */
  registerMember = (
    body = {
      birthday: '', // ex: 1991-04-12
      mobilePhone: '', // ex: +886966333222
      name: '', // ex: 姓名
    }
  ) => {
    return this.POST('/member/register', body)
  }
}
