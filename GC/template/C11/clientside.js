(function () {

  function apply(context, template) {
    console.log("C11번 시작");

    const htmlArr = template(context).split("</br>");
    const device = window.innerWidth > 1080 ? "PC" : "mobile";
    const deviceIndex = { "PC": 0, "mobile": 1 }[device];

    function fnInitC11(context, template) {
      // if (SalesforceInteractions.cashDom("#email").val() === "") return;
      if (SalesforceInteractions.cashDom("#golfzonNo").val() === "") return;
      console.log("C11_TEST_01");
      console.log(context.attributes.attributes.favGolf.value);
      if (context.attributes.attributes.favGolf.value === "" || context.attributes.attributes.favGolf.value === "N" || context.attributes.attributes.favGolf.value === undefined || context.attributes.attributes.favGolf.value === null) return;
      return true;
    }

    function fnInsertC11(context, template) {
      if (device === "PC") {
        SalesforceInteractions.cashDom(".reserve .reserve_top").after(htmlArr[deviceIndex]);
      } else {
        SalesforceInteractions.cashDom(".reserve #content .calendar").after(htmlArr[deviceIndex]);
      }
    }

    function fnApiInsertC11(deviceCheck = device, gcNum = 1) {
      fetch(`https://www.golfzoncounty.com/member_api/mingreenfeelist?gc_no=${gcNum}&chnl=w`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          console.log(deviceCheck);

          const golfZoneName = data.entitys[0].golfclub_name;
          const golfZoneHashTag = data.entitys[0].hash;
          const golfZoneUrl = deviceCheck === "PC" ? data.entitys[0].reserve_url : replaceWWWwithM(data.entitys[0].reserve_url);
          console.log(golfZoneUrl);
          const golfZoneHash = golfZoneHashTag.split(",");
          let hashArr = [];
          golfZoneHash.forEach((node, idx) => {
            const hashTag = "#" + node
            hashArr.push(hashTag);
          })

          function replaceWWWwithM(url) {
            if (url.includes("www.")) {
              return url.replace("www.", "m.");
            } else {
              console.warn("URL에 'www.'가 포함되어 있지 않습니다.");
              return url;
            }
          }

          const hash = hashArr.join(" ");

          SalesforceInteractions.cashDom(".favorites_contents_info_hashtag_wrap").text(hash);
          SalesforceInteractions.cashDom(".favorites_contents_info_name").text(golfZoneName);
          SalesforceInteractions.cashDom(".favorites_contents_info_randing_ttime")[0].attributes.href.value = golfZoneUrl;

        })
    }

    function fnStartC11(context, template) {

      const gcNum = context.attributes.attributes.favGolf.value

      const initC11 = fnInitC11(context, template);
      console.log(initC11);
      if (initC11 !== true) return;
      fnInsertC11(context, template);
      if (device === "PC") {
        fnApiInsertC11(device, gcNum)
      } else if (device === "mobile") {
        fnApiInsertC11(device, gcNum)
      }

    }

    return new Promise((resolve, reject) => {

      setTimeout(() => {

        const { userGroup, triggerOptions, triggerOptionsNumber } = context || {};
        if (userGroup !== "Control") {

          fnStartC11(context, template);

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

