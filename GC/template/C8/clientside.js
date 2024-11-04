(function () {

  function apply(context, template) {
    console.log("C8번 시작");

    // 유저 그룹 확인
    let { userGroup, triggerOptions, triggerOptionsNumber } = context || {};
    // 기기 값에 따른 Handlebar 나누기
    const htmlArr = template(context).split("</br>");
    const device = window.innerWidth >= 1280 ? "PC" : window.innerWidth >= 768 ? "Tablet" : "Mobile";
    const deviceIndex = { "PC": 0, "Tablet": 1, "Mobile": 2 }[device];
    let clickCheck;
    // 캠페인 초기화
    function fnInitC8(context, template) {
      console.log("C8_TEST_1");
      //이메일주소 여부 확인
      // if (SalesforceInteractions.cashDom("#email").val() === "") return;
      //골프존 회원번호 여부 확인
      if (SalesforceInteractions.cashDom("#golfzonNo").val() === "") return;
      //우선 순위 캠페인 여부 확인
      if (SalesforceInteractions.cashDom("#evg-new-template-c9").length > 0) return;
      //중복 노출 여부 확인
      if (SalesforceInteractions.cashDom("#evg-new-template-c8").length > 0) return;
      // 오늘 하루 보지 않기 확인
      const clickDate = fnGetCookie("clickNow");
      // if (clickDate !== undefined) return;
      // PC팝업
      const divpop = document.querySelector("#divpop");
      // 모바일 팝업
      const evtPop = document.querySelector("#evtPop");
      //기기, 팝업 확인 후 노출
      if (deviceIndex === 0) {
        return divpop && divpop.style.visibility === "hidden" ? true : false;
      } else if (deviceIndex === 1 || deviceIndex === 2) {
        return evtPop && evtPop.style.display === "block" ? false : true;
      }
      return true

    }

    // 핸들바 삽입
    function fnInsertC8(context, template) {
      console.log("C8_TEST_3");
      if (deviceIndex === 0 && navigator.userAgent.indexOf("iPad") <= -1) {
        SalesforceInteractions.cashDom("body").append(htmlArr[deviceIndex]);
      } else if (deviceIndex !== 0 && navigator.userAgent.indexOf("iPhone") > -1) {
        SalesforceInteractions.cashDom("#wrap #content").append(htmlArr[deviceIndex]);
      } else {
        SalesforceInteractions.cashDom("body").append(htmlArr[deviceIndex]);
      }


      SalesforceInteractions.mcis.sendStat({
        campaignStats: [{
          control: false,
          experienceId: context.experience,
          stat: "Impression"
        }]
      });

    }
    // 쿠키 가져오기
    function fnGetCookie(name) {
      let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    // 닫기, 오늘 하루 보지 않기 버튼 클릭
    function fnRemoveC8(context, template) {
      console.log("C8_TEST_3");

      function fnNowDate(connect) {

        // 들어온 날짜 구하기
        const now = new Date();
        // 쿠키 저장
        const nextDay = new Date(now);
        nextDay.setHours(24, 0, 0, 0); // 다음 날 00:00으로 설정

        // 클릭한 시간 저장 & 클릭한 다음 날까지 유효기간
        document.cookie = `clickNow=${now}; expires=${nextDay}`;

      }

      const wrap = SalesforceInteractions.cashDom("#evg-new-template-c8");
      const btn = document.querySelectorAll(".contents_inner_button_left_btn, .contents_inner_button_right_btn");
      btn.forEach((node, idx) => {
        node.addEventListener("click", (e) => {
          if (e.target.classList.contains("contents_inner_button_left_btn")) {
            fnNowDate();
          }
          wrap.remove();
        })
      });
    }

    // 팝업창 닫기
    function fnSetCloseC8(context, template) {
      const closeButtonSelector = window.innerWidth > 1080 ? "a.close_btn" : "button.close, button.today";
      document.querySelectorAll(closeButtonSelector).forEach((btn) => {
        btn.addEventListener("click", () => {
          console.log("C8_TEST_닫기클릭");
          setTimeout(() => {
            fnStartC8(context, template)
          }, 1000)
        });
      });
    }

    // 전체 기능
    function fnStartC8(context, template) {
      fnSetCloseC8(context, template);
      const initResult = fnInitC8(context, template); // 결과를 변수에 저장
      console.log(initResult);
      if (initResult === undefined || initResult === false) return; // 저장한 결과로 조건 검사
      fnInsertC8(context, template);
      fnRemoveC8(context, template);



    }



    return new Promise((resolve, reject) => {
      const isIphoneOrIpad = /iphone|ipad/i.test(navigator.userAgent);
      const init = (context, template) => {
        fnStartC8(context, template);
        // resolve(true);
      };
      isIphoneOrIpad ? setTimeout(init(context, template), 200) : window.addEventListener("load", () => setTimeout(init(context, template), 200));

    });

  }

  function reset(context, template) {

    /** Remove the template from the DOM to reset the template. */
    Evergage.cashDom("#evg-new-template-c8").remove();
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

