import { rest } from 'msw'
import * as API from './api'

export const handlers = [
  // Mock member state check
  API.getMemberState,

  // Handles a GET /user request
  API.getMemberCard,
  // Handles a OTP send from user
  API.postOtpSend,
  API.postOtpVerify,
  // Handles a OTP verification
  API.getCouponList,
]
