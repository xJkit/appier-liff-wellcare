import liff from '@line/liff'
import { useEffect } from 'react';
import { Link } from 'react-router-dom'

export default function Home() {
  console.log("MODE: ", import.meta.env.MODE)
  useEffect(() => {
    liff.getProfile().then(console.log)
  }, [])
  return (
    <>
      <h1 className="mb-4">Remove this page after GM</h1>
      <div className="flex flex-col gap-2">
        <Link className="text-theme underline" to="account_linking">
          Account Linking 未綁定(default)
        </Link>
        <Link className="text-theme underline" to="account_linking?mock_member_state=1">
          Account Linking 已綁定
        </Link>
        <Link className="text-theme underline" to="account_linking?mock_member_state=401">
          Account Linking (Invalid Token 401)
        </Link>
        <Link className="text-theme underline" to="member_card">
          Member Card
        </Link>
        <Link className="text-theme underline" to="member_card?mock_state=zero">
          Member Card (空白狀態)
        </Link>
        <Link className="text-theme underline" to="member_card?mock_state=max">
          Member Card (極限狀態)
        </Link>
        <Link className="text-theme underline" to="member_card?mock_state=A201">
          Member Card A201
        </Link>
        <Link className="text-theme underline" to="member_card?mock_state=A202">
          Member Card A202
        </Link>
        <Link className="text-theme underline" to="member_card?mock_state=A203">
          Member Card A203
        </Link>
        <Link className="text-theme underline" to="member_card?mock_state=A204">
          Member Card A204
        </Link>
        <Link className="text-theme underline" to="member_card?mock_state=401">
          Member Card 401
        </Link>
        <Link className="text-theme underline" to="my_coupons/redeemable">
          我的優惠券(正常+極限狀態)
        </Link>
        <Link className="text-theme underline" to="my_coupons/redeemable?length=0">
          我的優惠券(空白狀態)
        </Link>
        <Link className="text-theme underline" to="my_coupons/redeemable?length=A301">
          我的優惠券(錯誤狀態，代碼：A301)
        </Link>
        <Link className="text-theme underline" to="my_coupons/redeemable?length=A302">
          我的優惠券(錯誤狀態，代碼：A302)
        </Link>
        <Link className="text-theme underline" to="my_coupons/redeemable?length=A303">
          我的優惠券(錯誤狀態，代碼：A303)
        </Link>
        <Link className="text-theme underline" to="my_coupons/redeemable?length=A304">
          我的優惠券(錯誤狀態，代碼：A304)
        </Link>
        <Link className="text-theme underline" to="my_coupons/redeemable?length=500">
          我的優惠券(錯誤狀態，代碼：500)
        </Link>
      </div>
    </>
  )
}
