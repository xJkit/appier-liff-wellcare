export const TermsSection = ({ title, content }) => {
  return (
    <div className="flex flex-col gap-y-1">
      <div className="text-content-high font-medium leading-5">{title}</div>
      <div className="text-content-med font-normal leading-6">{content}</div>
    </div>
  )
}

export const TermsConditionDetail = () => {
  return (
    <ol className="list-decimal pl-6">
      <li>本券在全台維康醫療用品實體門市均可使用。</li>
      <li>本券請在指定使用日期內使用，逾期恕不延期及換發。</li>
      <li>本券一張僅限使用一次，部份行銷活動恕不合併使用。</li>
      <li>本券不得抵扣藥品、兌換現金、也不找零、抵扣運費。</li>
      <li>本券為贈品，係屬無償取得，不可適用商品（服務）禮券記載之規範。</li>
      <li>若誤觸下方按「已兌換鈕」導致折價券失效，則恕不補發。</li>
      <li>
        維康醫療用品保有最終修改、變更、活動解釋及取消本活動之權利，若有相關異動將會公告於網站，
        恕不另行通知。
      </li>
    </ol>
  )
}
