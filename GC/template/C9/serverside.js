export class NewTemplate implements CampaignTemplateComponent {

  @title("타이틀 - 위")
  titleTop: string;

  @title("타이틀 - 중간")
  titleMiddle: string;

  @title("타이틀 - 아래")
  titleBottom: string;

  @title("이미지 URL")
  imageUrl: string = "https://image.mkt.golfzoncounty.com/lib/fe3211747364047a741773/m/1/a46ad3e2-06d7-4dce-b136-10c84ca7aac8.png";

  run(context: CampaignComponentContext) {
    return {
      attributes: context.user
    };
  }

}

