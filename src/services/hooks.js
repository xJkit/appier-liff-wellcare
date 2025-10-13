import liff from '@line/liff'
import API from './api'
import { useQuery } from '@tanstack/react-query'

/**
 * Get User Profile from LINE API
 * @typedef {import('../types').LineUserProfile} LineUserProfile
 * @returns {{ data: LineUserProfile, isLoading: Boolean }}
 */
export const useLineUserProfile = () =>
  useQuery({
    queryKey: ['useLineUserProfile'],
    queryFn: liff.getProfile,
  })

/**
 * Get User Profile from LINE API
 * @typedef {import('../types').MemberState} MemberState
 * @returns {{ data: MemberState }}
 */
export const useMemberState = (query = '') => {
  const api = new API()
  return useQuery({
    queryKey: ['useMemberState', query],
    queryFn: () => api.getMemberState(query),
  })
}

/**
 * Get User Member Card Information
 * @typedef {import('../types').MemberCard} MemberCard
 * @returns {{ data: MemberCard }}
 */
export const useMemberCardInfo = (query) => {
  const api = new API()
  return useQuery({
    queryKey: ['useMemberCardInfo', query],
    queryFn: () => api.getMemberCard(query),
  })
}

/**
 * Get Coupon List
 * @typedef {import('../types').CouponResponse} CouponResponse
 * @returns {{ data: CouponResponse, isLoading: Boolean}}
 */
export const useCouponList = ({ status = 0, length = '' }) => {
  const api = new API()
  return useQuery({
    queryKey: ['useCouponList', status, length],
    queryFn: () => api.getMCouponList(status, length),
  })
}
