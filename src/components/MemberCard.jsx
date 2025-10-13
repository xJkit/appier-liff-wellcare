import cx from 'classnames'
import logoTitleSvg from '~/assets/logo_title.jpg'
import avatarDefaultJpg from '../assets/avatar_default.jpg'
import memberCardBgJpg from '../assets/member_card_bg.jpeg'
import numberWithCommas from '../helpers/numberWithCommas'

export default function MemberCard({
  className = '',
  username = '???',
  point = 0,
  avatarImageUrl = avatarDefaultJpg,
  ...props
}) {
  return (
    <div
      className={cx(
        'relative w-full h-auto aspect-[316/170] rounded-[10px] bg-theme p-4 pl-14 bg-center bg-[length:100%] overflow-hidden bg-no-repeat mb-8',
        className
      )}
      style={{
        backgroundImage: `url(${memberCardBgJpg})`,
        boxShadow: '0px 6px 20px 0px #00994480',
      }}
      {...props}>
      <div className="flex flex-row w-full justify-between">
        <img
          src={avatarImageUrl}
          alt="大頭照"
          className="w-[62px] sm:w-[73px] aspect-square object-cover rounded-full border-2 border-white"
        />
        <img
          src={logoTitleSvg}
          alt="維康醫療 LOGO"
          className="h-[22px] sm:h-[32px] md:h-[40px]"
        />
      </div>
      <div className="relative h-[40%] w-full grid grid-cols-2 grid-rows-2 gap-x-2 text-white font-medium drop-shadow-[0_4px_4px_rgba(0,0,0,0.12)]">
        <div className="text-xs leading-5 self-center">會員名稱</div>
        <div className="text-xs leading-5 self-center">可用點數</div>
        <div className="text-xl leading-7 truncate self-center">{username}</div>
        <div className="text-xl leading-7 flex items-center">
          <div className="truncate text-2xl leading-8 tracking-normal font-number font-semibold">
            {numberWithCommas(point)}
          </div>
          <span className="text-base font-normal ml-1">點</span>
        </div>
      </div>
    </div>
  )
}
