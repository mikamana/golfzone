export class NewTemplate implements CampaignTemplateComponent {

  @title("Example Field")
  header: string;

  run(context: CampaignComponentContext) {
    return {
      attributes: context.user
    };
  }

}

