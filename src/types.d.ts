export interface LineUserProfile {
  displayName: string;
  pictureUrl: string;
  statusMessage: string;
  userId: string;
}
export interface ApiResponse {
  code: string;
  message: string;
}
export interface MemberState {
  code: string;
  message: string;
}

export interface MemberCard extends MemberState {
  data?: {
    memberNumber: string; // 會員卡號
    name: string; // 會員姓名
    mobilePhone: string; // 手機,
    birthday: string;
    bonus: string; // 紅利點數
    redeemedPoints: string; // 已兌點數
    remainingPoints: string; // 剩餘點數
    birthDayCredits: string; // 生日禮金
  }
}

export interface OTPSendInfo {
  memberNumber: string;
  mobilePhone: string;
}

export interface OTPSendResult extends MemberState { }

export interface OTPVerifyInfo {
  memberNumber: string;
  mobilePhone: string;
  otpCode: string;
}

export interface OTPVerifyResult extends MemberState { }

export interface Coupon {
  type: string;
  code: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  discount: number;
  startTime: number;
  endTime: number;
  redeemed: bool;
}

export interface CouponResponse {
  coupons: Coupon[]
}