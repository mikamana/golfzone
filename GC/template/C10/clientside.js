(function () {

  function apply(context, template) {

    console.log(context.attributes.segmentMembership);
    context.attributes.segmentMembership.forEach((item, index) => {
      const segId = item.segmentId //segid
      if (segId == "nmIwY") {
        return
      }
    })





    const htmlArr = template(context).split("</br>");
    const device = window.innerWidth > 1080 ? "PC" : "mobile";
    const deviceIndex = { "PC": 0, "mobile": 1 }[device];

    SalesforceInteractions.cashDom("#header").prepend(htmlArr[deviceIndex]);

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

    Evergage.cashDom("#evg-new-template").remove();
  }

  function control(context) {

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

