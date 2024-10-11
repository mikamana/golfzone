export class NewTemplate implements CampaignTemplateComponent {

  @title("지역")
  area: string;

  @title("타이틀 - 위")
  titleTop: string;

  @title("타이틀 - 아래")
  titleBottom: string;

  @title("서브타이틀")
  subTitle: string;

  @title("이미지 URL")
  imageUrl: string = "https://image.mkt.golfzoncounty.com/lib/fe3211747364047a741773/m/1/a46ad3e2-06d7-4dce-b136-10c84ca7aac8.png";

  @title("랜딩URL_PC")
  randingUrlPC: string = "https://image.mkt.golfzoncounty.com/lib/fe3211747364047a741773/m/1/a46ad3e2-06d7-4dce-b136-10c84ca7aac8.png";

  @title("랜딩URL_MO")
  randingUrlMO: string = "https://image.mkt.golfzoncounty.com/lib/fe3211747364047a741773/m/1/a46ad3e2-06d7-4dce-b136-10c84ca7aac8.png";



  run(context: CampaignComponentContext) {
    return {};
  }

}

