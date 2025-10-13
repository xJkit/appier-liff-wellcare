import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools' // only exist in dev mode
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Root from './Root'
// page components
import Home from './pages/Home'
import LinkedSuccess from './pages/LinkedSuccess'
import AccountLinking, { sendOtpActionWithQuery } from './pages/AccountLinking'
import MemberInfo from './pages/MemberInfo'
import VerificationCode, {
  verificationLoaderWithQuery,
  verificationAction,
} from './pages/VerificationCode'
import MyCoupons, {
  CouponList,
  CouponDetail,
  couponDetailLoaderWithQuery,
} from './pages/MyCoupons'
import ErrorPage from './pages/ErrorTemplate'

const IS_DEV = import.meta.env.DEV
const queryClient = new QueryClient()
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: IS_DEV ? <Home /> : <Navigate to="account_linking" replace />,
      },
      {
        path: 'account_linking',
        element: <AccountLinking />,
        action: sendOtpActionWithQuery(queryClient),
        errorElement: <ErrorPage />,
      },
      {
        path: 'verification_code',
        element: <VerificationCode />,
        loader: verificationLoaderWithQuery(queryClient),
        action: verificationAction,
        errorElement: <ErrorPage />,
      },
      {
        path: 'link_success',
        element: <LinkedSuccess />,
      },

      {
        path: 'member_card',
        element: <MemberInfo />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'my_coupons',
        element: <MyCoupons />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: 'redeemable',
            element: <CouponList tab="redeemable" />,
          },
          {
            path: 'redeemed',
            element: <CouponList tab="redeemed" />,
          },
          {
            path: 'expired',
            element: <CouponList tab="expired" />,
          },
          {
            path: '*',
            element: <Navigate to="redeemable" replace />,
          },
        ],
      },
      {
        path: 'detail/:couponType/:code',
        element: <CouponDetail />,
        loader: couponDetailLoaderWithQuery(queryClient),
      },
    ],
  },
])

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
