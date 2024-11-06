(function () {

  function apply(context, template) {
    console.log("C11번 시작");

    const htmlArr = template(context).split("</br>");
    const device = window.innerWidth > 1080 ? "PC" : "mobile";
    const deviceIndex = { "PC": 0, "mobile": 1 }[device];

    function fnInitC11(context, template) {
      // 로그인 여부
      if (sessionStorage.getItem("log") !== "true") return;
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

      // 골프장을 예약할 수 있는 정보가 없음, 예약할 수 없는 골프장을 제외시킨 후(파악해야함)
      // 1. 다른 골프장을 추천하도록 할 것
      // 2. 추천 자체를 못하도록 할 것
      // 3. DC에서 골프장명 받은 후 태그에 적용
      // 4. 오늘 날짜로 설정 후 url에 적용
      // 5. 골프장번호 url에 적용

      const fnC11ApiResult = fetch(`https://www.golfzoncounty.com/member_api/mingreenfeelist?gc_no=${gcNum}&chnl=w`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data === undefined) {

            return false;

          } else {

            const golfZoneName = data.entitys[0].golfclub_name;
            const golfZoneHashTag = data.entitys[0].hash;
            const golfZoneUrl = deviceCheck === "PC" ? data.entitys[0].reserve_url : replaceWWWwithM(data.entitys[0].reserve_url);
            const golfZoneHash = golfZoneHashTag.split(",");
            let hashArr = [];
            golfZoneHash.forEach((node, idx) => {
              const hashTag = "#" + node
              hashArr.push(hashTag);
            })
            const hash = hashArr.join(" ");
            SalesforceInteractions.cashDom(".favorites_contents_info_hashtag_wrap").text(hash);
            SalesforceInteractions.cashDom(".favorites_contents_info_name").text(golfZoneName);
            SalesforceInteractions.cashDom(".favorites_contents_info_randing_ttime")[0].attributes.href.value = golfZoneUrl;
            return true
          }

          function replaceWWWwithM(url) {
            if (url.includes("www.")) {
              return url.replace("www.", "m.");
            } else {
              console.warn("URL에 'www.'가 포함되어 있지 않습니다.");
              return url;
            }
          }


        });

      return fnC11ApiResult;




    }

    function fnStartC11(context, template) {

      const initC11 = fnInitC11(context, template);
      console.log(initC11);
      if (initC11 !== true) return;
      const gcNum = context.attributes.attributes.favGolf.value
      let fnApiResultC11;
      if (device === "PC") {
        fnApiResultC11 = fnApiInsertC11(device, gcNum)

      } else if (device === "mobile") {
        fnApiResultC11 = fnApiInsertC11(device, gcNum)

      }

      if (fnApiResultC11 === false) return;
      fnInsertC11(context, template);


    }

    return new Promise((resolve, reject) => {

      setTimeout(() => {

        const { userGroup, triggerOptions, triggerOptionsNumber } = context || {};
        if (userGroup !== "Control") {

          fnStartC11(context, template);

        }
        resolve(true);
      }, 50);
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

