(function () {
  function apply(context, template) {
    console.log("C12번 시작");
    let statusTemplateCheck, statusPcPopCheck, statusMoPopCheck;

    function fnInit(context, template) {
      console.log("C12_TEST_1");
      console.log(context.attributes.attributes.memberName.value);
      // if (SalesforceInteractions.cashDom("#email").val() === "") return;
      if (SalesforceInteractions.cashDom("#golfzonNo").val() === "") return;
      if (context.attributes.attributes.recentGcNum === undefined || context.attributes.attributes.recentGcNum === null || context.attributes.attributes.recentGcNum.value === "N") return;
      if (context.attributes.attributes.memberName === undefined || context.attributes.attributes.memberName === null || context.attributes.attributes.memberName.value === "N") return;
      // if (context.attributes.attributes.recentGcDate === undefined || context.attributes.attributes.recentGcDate === null || context.attributes.attributes.recentGcDate.value === "N") return;
      /* 템플릿 체크 */
      if (SalesforceInteractions.cashDom("#evg-new-template-c8").length > 0) return;
      if (SalesforceInteractions.cashDom("#evg-new-template-c9").length > 0 &&
        document.querySelector("#evg-new-template-c9 > .modal_popup").style.display !== "none") {
        return false;
      } else {
        statusTemplateCheck = 1;
      }
      if (SalesforceInteractions.cashDom("#evg-new-template-c12").length > 0) return;

      const isPc = window.innerWidth > 1080;
      const popSelector = isPc ? ".evtPop" : "#evtPop";
      const popNode = document.querySelector(popSelector);
      const isVisible = isPc ? "visible" : "block";
      /* 팝업창 체크 */
      if (popNode) {
        if (popNode.style.visibility === isVisible || popNode.style.display === isVisible) {
          return false
        } else {
          statusMoPopCheck = 1;
          statusPcPopCheck = 1;
        }
      } else {
        statusMoPopCheck = 1;
        statusPcPopCheck = 1;
      }

      // 오늘 하루 보지 않기 확인
      const clickDate = fnGetCookie("connectNowC12");
      // if (clickDate !== undefined) return;

      return { statusTemplateCheck, statusPcPopCheck, statusMoPopCheck }

    }

    function fnInsert(context, template) {
      const htmlArr = template(context).split("</br>");
      const device = window.innerWidth > 1080 ? "PC" : "mobile";
      const deviceIndex = { "PC": 0, "mobile": 1 }[device];
      SalesforceInteractions.cashDom("body").prepend(htmlArr[deviceIndex]);
      SalesforceInteractions.mcis.sendStat({
        campaignStats: [{
          control: false,
          experienceId: context.experience,
          stat: "Impression"
        }]
      });
    }

    function fnNowDateC12() {

      // 들어온 날짜 구하기
      const now = new Date();
      // 다음 날 00시 구하기
      const nextDay = new Date(now);
      nextDay.setHours(24, 0, 0, 0); // 다음 날 00:00으로 설정
      // 접속한 시간 저장
      document.cookie = `connectNowC12=${now}; expires=${nextDay}`;

    }

    // 쿠키 가져오기
    function fnGetCookie(name) {
      let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    function fnPopHide() {
      if (window.innerWidth > 1080) {
        setTimeout(() => {
          SalesforceInteractions.cashDom("#evg-new-template-c12.pc_push_popup_c12").hide();
        }, 7000)
      } else {
        setTimeout(() => {
          SalesforceInteractions.cashDom("#evg-new-template-c12.mo_push_popup_c12").hide();
        }, 7000)
      }
    }

    function fnApiInsert(context, template) {

      const c12GcDate = context.attributes.attributes.recentGcDate.value;
      const c12GcNum = context.attributes.attributes.recentGcNum.value;

      SalesforceInteractions.cashDom(".text_name").text(context.attributes.attributes.memberName.value);



      fetch(`https://www.golfzoncounty.com/member_api/mingreenfeelist?gc_no=${c12GcNum}&chnl=w`)
        .then((res) => res.json())
        .then((data) => {
          const golfZoneApi = data.entitys
          const golfzoneUrl = window.innerWidth > 1080 ? golfZoneApi[0].reserve_url : replaceWWWwithM(golfZoneApi[0].reserve_url);
          const urlObj = new URL(golfzoneUrl); // URL 객체 생성

          // 날짜를 새 값으로 설정합니다.
          const newDate = c12GcDate !== undefined ? c12GcDate : formattedDate;
          urlObj.searchParams.set("select_date", newDate);

          SalesforceInteractions.cashDom(".text_area").text(golfZoneApi[0].golfclub_name);
          SalesforceInteractions.cashDom(".push_popup")[0].attributes.href.value = urlObj;

          function replaceWWWwithM(url) {
            if (url.includes("www.")) {
              return url.replace("www.", "m.");
            } else {
              console.warn("URL에 'www.'가 포함되어 있지 않습니다.");
              return url;
            }
          }
        });
    }



    function fnStart(context, template) {
      const today = new Date();
      const formattedDate = today.getFullYear().toString() +
        String(today.getMonth() + 1).padStart(2, '0') +
        String(today.getDate()).padStart(2, '0');

      SalesforceInteractions.sendEvent({
        user: {
          attributes: {
            recentGcDate: formattedDate
          }
        }
      });
      const result = fnInit(context, template);
      if (result === undefined || result === false) return;
      if (result.statusTemplateCheck !== 1 && result.statusPcPopCheck !== 1) return;
      if (result.statusTemplateCheck !== 1 && result.statusMoPopCheck !== 1) return;
      fnInsert(context, template);
      fnPopHide();
      fnApiInsert(context, template);
      fnNowDateC12();
    }

    return new Promise((resolve) => {
      const { userGroup } = context || {};
      const mobileType = navigator.userAgent.toLowerCase();
      const isIphone = mobileType.includes('iphone');
      const targetNode = document.querySelector('body');
      const config = { childList: true, subtree: true };

      const addClickListener = (selector, delay = 1005) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) =>
          element.addEventListener("click", () => setTimeout(() => fnStart(context, template), delay))
        );
      };

      const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
              if (node.id === 'evg-new-template-c9') {
                addClickListener("#evg-new-template-c9 .contents_inner_info_image_button", 200);
                addClickListener("#evg-new-template-c9 .contents_inner_info_title_today_btn", 200);
              } else if (node.id === 'evg-new-template-c8') {
                addClickListener(".contents_inner_button_right_btn", 200);
                addClickListener(".contents_inner_button_left_btn", 200);
              }
            });
          }
        });
      });

      observer.observe(targetNode, config);

      const initialize = () => {
        if (userGroup !== "Control") {
          fnStart(context, template);
          addClickListener(".contents_inner_info_image_button");
          addClickListener(".contents_inner_info_title_today_btn");
          addClickListener(".leftB .close_btn");
          addClickListener("#evtPop .btn1 button, #evtPop .btn2 button");
          addClickListener(".contents_inner_button_right_btn, .contents_inner_button_left_btn");
        }
        resolve(true);
      };

      if (isIphone) {
        setTimeout(initialize, 500);
      } else {
        window.addEventListener("load", () => setTimeout(initialize, 500));
      }
    });
  }

  function reset(context, template) {

    /** Remove the template from the DOM to reset the template. */
    Evergage.cashDom("#evg-new-template-c12").remove();
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

