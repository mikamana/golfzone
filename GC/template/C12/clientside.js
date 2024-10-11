(function () {

  function apply(context, template) {
    console.log("테스트중이다.");
    const htmlArr = template(context).split("</br>");
    const device = window.innerWidth > 1080 ? "PC" : "mobile";
    const deviceIndex = { "PC": 0, "mobile": 1 }[device];

    const c12GcNum = context.attributes.attributes.recentGcNum.value;



    SalesforceInteractions.cashDom("#header").prepend(htmlArr[deviceIndex]);
    if (window.innerWidth > 1080) {
      fetch(`https://www.golfzoncounty.com/member_api/mingreenfeelist?gc_no=${c12GcNum}&chnl=w`)
        .then((res) => res.json())
        .then((data) => {
          const golfZoneApi = data.entitys

          if (context.attributes.attributes.name.value !== null || context.attributes.attributes.name.value !== undefined) {
            SalesforceInteractions.cashDom(".text_name").text(context.attributes.attributes.name.value);
          }
          SalesforceInteractions.cashDom(".text_area").text(golfZoneApi[0].golfclub_name);
        });
    } else {
      fetch(`https://www.golfzoncounty.com/member_api/mingreenfeelist?gc_no=${c12GcNum}&chnl=w`)
        .then((res) => res.json())
        .then((data) => {
          const golfZoneApi = data.entitys

          if (context.attributes.attributes.name.value !== null || context.attributes.attributes.name.value !== undefined) {
            SalesforceInteractions.cashDom(".text_name").text(context.attributes.attributes.name.value);
          }
          SalesforceInteractions.cashDom(".text_area").text(golfZoneApi[0].golfclub_name);
        });
    }


    if (window.innerWidth > 1080) {
      setTimeout(() => {
        SalesforceInteractions.cashDom(".pc_push_popup").hide();
      }, 5000)
    } else {
      setTimeout(() => {
        SalesforceInteractions.cashDom(".mo_push_popup").hide();
      }, 5000)
    }

  }

  function reset(context, template) {

    /** Remove the template from the DOM to reset the template. */
    Evergage.cashDom("#evg-new-template_c12").remove();
  }

  function control(context) {

    /**
     * Add Evergage data attributes to elements you wish to track in the control experience.
     *
     * Visit the Campaign Stats Tracking documentation to learn more:
     * https://developer.salesforce.com/docs/marketing/personalization/guide/campaign-stats-tracking.html
     */
    const contentZoneSelector = Evergage.getContentZoneSelector(context.contentZone);
    return Evergage.DisplayUtils
      .pageElementLoaded(contentZoneSelector)
      .then((element) => {
        Evergage.cashDom(element).attr({
          "data-evg-campaign-id": context.campaign,
          "data-evg-experience-id": context.experience,
          "data-evg-user-group": context.userGroup
        });
      });
  }

  registerTemplate({
    apply: apply,
    reset: reset,
    control: control
  });

})();

