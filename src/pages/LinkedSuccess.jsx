import liff from '@line/liff'
import linkedSuccessSvg from '../assets/linked_success.svg'
import Button from '../components/Button'

export default function LinkedSuccess() {
  return (
    <div className="pt-[112px] p-6">
      <img
        className="block mx-auto w-[128px] h-[128px] mb-4"
        src={linkedSuccessSvg}
      />
      <div className="text-content-med font-semibold text-xl leading-7 text-center mb-8">
        您的帳號已經成功綁定
      </div>
      <Button full onClick={liff.closeWindow}>
        回到聊天室
      </Button>
    </div>
  )
}
