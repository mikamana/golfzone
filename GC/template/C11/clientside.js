(function () {

  function apply(context, template) {
    const htmlArr = template(context).split("</br>");

    const device = window.innerWidth > 1080 ? "PC" : "mobile";
    const deviceIndex = { "PC": 0, "mobile": 1 }[device];

    setTimeout(() => {
      if (device === "PC") {
        SalesforceInteractions.cashDom(".reserve .reserve_top").after(htmlArr[deviceIndex]);
      } else {
        SalesforceInteractions.cashDom(".reserve #content .calendar").after(htmlArr[deviceIndex]);
      }
    }, 1000);



    /* 선호골프장 번호 받아서 아래 패치에 적용 후 data에 있는 값들 innerHTML로 적용시키기 */

    // const gcFavNum = context.attributes.attributes.favGolf.value


    // fetch(`https://www.golfzoncounty.com/member_api/mingreenfeelist?gc_no=${gcFavNum}&chnl=w`)
    // .then((res)=> res.json())
    // .then((data)=>{

    //     console.log(data);

    // })

  }

  function reset(context, template) {

    /** Remove the template from the DOM to reset the template. */
    Evergage.cashDom("#evg-new-template").remove();
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

