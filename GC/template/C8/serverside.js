export class NewTemplate implements CampaignTemplateComponent {

  @title("지역")
  area: string;

  @title("타이틀 - 위")
  titleTop: string = "신규 가입 시";

  @title("타이틀 - 아래")
  titleBottom: string = "1만원 즉시 할인";

  @title("서브타이틀")
  subTitle: string = "자세히보기";

  @title("이미지 URL")
  imageUrl: string = "https://image.mkt.golfzoncounty.com/lib/fe3211747364047a741773/m/1/28c527a0-332b-47c0-a5b2-f43a7426bedf.png";

  @title("랜딩URL_PC")
  randingUrlPC: string = "https://www.golfzoncounty.com/myround/coupon";

  @title("랜딩URL_MO")
  randingUrlMO: string = "https://m.golfzoncounty.com/myround/coupon";



  run(context: CampaignComponentContext) {
    return {};
  }

}

