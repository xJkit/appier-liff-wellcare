/**
 * ApiError Class
 * @property {String} type
 * @property {String} code
 * @property {String} message
 */
export class ApiError extends Error {
  /**
   * @typedef {import("../types").ApiResponse} ApiResponse
   * @param {ApiResponse} errorResponse - json data from api response
   * @param {String} type - the key type for the error config map
   */
  constructor(errorResponse, type) {
    super(
      `Api response error. [Code] ${errorResponse.code}, [Msg] ${errorResponse.message}`
    )
    this.type = type
    this.code = errorResponse.code
    this.message = errorResponse.message
  }
}

export const ERROR_MAP = {
  memberStateError: {
    401: 'Line token Unauthorized',
    500: ['發生未知錯誤', '請聯絡管理員'],
  },
  otpCheckError: {
    A101: '您所輸入的手機號碼尚未註冊會員。',
    A102: '您所輸入的手機號碼或會員卡號有誤，請重新輸入。',
    A103: '資料異常，請確認您輸入的資訊正確。',
    A104: '網路連線異常，請稍後再試',
    A105: '請至門市補齊帳戶資訊，再進行綁定。',
    3: '寄送超過 5 次，請 24 小時之後再嘗試',
    4: '錯誤超過五次，請 24 小時之後再嘗試',
    5: '驗證碼已過期',
    6: '驗證碼錯誤',
    500: ['發生未知錯誤', '請聯絡管理員'],
  },
  memberCheckError: {
    101: '您所輸入的手機號碼尚未註冊會員。',
    102: '您所輸入的手機號碼或會員卡號有誤，請重新輸入。',
    103: '資料異常，請確認您輸入的資訊正確。',
    104: '網路連線異常，請稍後再試',
    105: '請至門市補齊帳戶資訊，再進行綁定。',
    500: ['發生未知錯誤', '請聯絡管理員'],
  },
  couponError: {
    A301: ['網路連線異常', '請確認網路連線的狀態後再次嘗試'], // BB 無法取得會員資料
    A302: ['網路連線異常', '請確認網路連線的狀態後再次嘗試'], // 請求格式錯誤
    A303: ['資料異常', '請確認您輸入的資訊是否正確'], // 會員資料比對失敗
    A304: ['資料異常', '請確認您輸入的資訊是否正確'], // 缺漏資訊會員
    500: ['發生未知錯誤', '請聯絡管理員'],
  },
  unexpectedError: {
    A201: ['網路連線異常', '請確認網路連線的狀態後再次嘗試'], // BB 無法取得會員資料
    A202: ['網路連線異常', '請確認網路連線的狀態後再次嘗試'], // 請求格式錯誤
    A203: ['資料異常', '請確認您輸入的資訊是否正確'], // 會員資料比對失敗
    A204: ['資料異常', '請確認您輸入的資訊是否正確'], // 缺漏資訊會員
    500: ['發生未知錯誤', '請聯絡管理員'],
  },
}
/**
 *
 * @param {string} errorKey error type name as a map key
 * @param {number} code
 * @returns {string|string[]}
 */
export function getErrorMessage(errorKey = 'unexpectedError', code = '500') {
  return ERROR_MAP[errorKey][code] || ERROR_MAP[errorKey]['500']
}
