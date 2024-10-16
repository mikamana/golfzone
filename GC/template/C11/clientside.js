(function () {

  function apply(context, template) {
    const { userGroup, triggerOptions, triggerOptionsNumber } = context || {};
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (userGroup !== "Control") {
          if (SalesforceInteractions.cashDom("#email").val() === "") return;
          if (SalesforceInteractions.cashDom("#golfzonNo").val() === "") return;
          if (context.attributes.attributes.favGolf.value === "" || context.attributes.attributes.favGolf.value === undefined || context.attributes.attributes.favGolf.value === null) return;

          const htmlArr = template(context).split("</br>");

          const device = window.innerWidth > 1080 ? "PC" : "mobile";
          const deviceIndex = { "PC": 0, "mobile": 1 }[device];

          if (device === "PC") {
            SalesforceInteractions.cashDom(".reserve .reserve_top").after(htmlArr[deviceIndex]);
          } else {
            SalesforceInteractions.cashDom(".reserve #content .calendar").after(htmlArr[deviceIndex]);
          }


          if (context.attributes.attributes.favGolf.value !== "") {
            const gcFavNum = context.attributes.attributes.favGolf.value
            if (window.innerWidth > 1080) {
              fetch(`https://www.golfzoncounty.com/member_api/mingreenfeelist?gc_no=${gcFavNum}&chnl=w`)
                .then((res) => res.json())
                .then((data) => {



                  const golfZoneName = data.entitys[0].golfclub_name;
                  const golfZoneHashTag = data.entitys[0].hash;
                  const golfZoneUrl = data.entitys[0].reserve_url;
                  const golfZoneHash = golfZoneHashTag.split(",");
                  let hashArr = [];

                  golfZoneHash.forEach((node, idx) => {
                    const hashTag = "#" + node
                    hashArr.push(hashTag);

                  })

                  const hash = hashArr.join(" ");
                  SalesforceInteractions.cashDom(".favorites_contents_info_hashtag_wrap").text(hash);
                  SalesforceInteractions.cashDom(".favorites_contents_info_name").text(golfZoneName);
                  SalesforceInteractions.cashDom(".favorites_contents_info_randing")[0].attributes.href.value = golfZoneUrl;
                  SalesforceInteractions.cashDom(".favorites_contents_info_randing_ttime")[0].attributes.href.value = golfZoneUrl;
                })
            } else {
              fetch(`https://www.golfzoncounty.com/member_api/mingreenfeelist?gc_no=${gcFavNum}&chnl=w`)
                .then((res) => res.json())
                .then((data) => {

                  const golfZoneName = data.entitys[0].golfclub_name;
                  const golfZoneHashTag = data.entitys[0].hash;
                  const golfZoneUrl = data.entitys[0].reserve_url;

                  function replaceWWWwithM(url) {
                    if (url.includes("www.")) {
                      return url.replace("www.", "m.");
                    } else {
                      console.warn("URL에 'www.'가 포함되어 있지 않습니다.");
                      return url;
                    }
                  }
                  const mobileUrl = replaceWWWwithM(golfZoneUrl);
                  console.log(mobileUrl);
                  SalesforceInteractions.cashDom(".c11_mo_banner_wrap .favorites_contents_info_randing_ttime")[0].attributes.href.value = mobileUrl;

                  const golfZoneHash = golfZoneHashTag.split(",");
                  let hashArr = [];
                  golfZoneHash.forEach((node, idx) => {
                    const hashTag = "#" + node
                    hashArr.push(hashTag);
                  })
                  const hash = hashArr.join(" ");
                  SalesforceInteractions.cashDom(".c11_mo_banner_wrap .favorites_contents_info_hashtag_wrap").text(hash);
                  SalesforceInteractions.cashDom(".c11_mo_banner_wrap .favorites_contents_info_name").text(golfZoneName);

                  console.log(golfZoneUrl);




                })
            }
          }

        }
        resolve(true);
      }, 500);
    })


  }

  function reset(context, template) {

    /** Remove the template from the DOM to reset the template. */
    Evergage.cashDom("#evg-new-template-c11").remove();
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

