(function () {

  function apply(context, template) {
    console.log("C10번 시작");
    let statusTemplateCheckC10, statusPcPopCheckC10, statusMoPopCheckC10;

    function fnStartC10(context, template) {

      function fnInitC10(context, template) {
        console.log("C10_TEST_01");
        // 로그인 여부
        if (sessionStorage.getItem("log") !== "true") return;
        // if(SalesforceInteractions.cashDom("#email").val() === "") return;
        // if(SalesforceInteractions.cashDom("#golfzonNo").val() === "") return;
        /* 템플릿 체크 */
        if (SalesforceInteractions.cashDom("#evg-new-template-c8").length > 0) {
          return false;
        } else {
          statusTemplateCheckC10 = 1;
        }

        if (SalesforceInteractions.cashDom('#evg-new-template-c10').length > 0) return;
        if (SalesforceInteractions.cashDom('#evg-new-template-c12').length > 0) return;
        if (context.attributes.attributes.couponLength === undefined || context.attributes.attributes.couponLength === null || context.attributes.attributes.couponLength.value === "N" || context.attributes.attributes.couponLength.value === null) return;
        if (context.attributes.attributes.couponName === undefined || context.attributes.attributes.couponName === null || context.attributes.attributes.couponName.value === "N" || context.attributes.attributes.couponName.value === null) return;

        const isPc = window.innerWidth > 1080;
        const popSelector = isPc ? "#divpop" : "#evtPop";
        const popNode = document.querySelector(popSelector);
        const isVisible = isPc ? "visible" : "block";

        if (popNode) {
          if (popNode.style.visibility === isVisible || popNode.style.display === isVisible) {
            return false
          } else {
            statusMoPopCheckC10 = 1;
            statusPcPopCheckC10 = 1;
          }
        } else {
          statusMoPopCheckC10 = 1;
          statusPcPopCheckC10 = 1;
        }

        // 오늘 하루 보지 않기 확인
        // const clickDate = fnGetCookie("connectNowC10");
        // if (clickDate !== undefined) return;

        //피로도 확인
        let currentDate = new Date();
        if (currentDate < new Date(localStorage.getItem("c10DayEnd"))) return;
        console.log("C10_TEST_02");
        return { statusTemplateCheckC10, statusPcPopCheckC10, statusMoPopCheckC10 }
      }

      function fnInsertC10(context, template) {
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

      function fnNowDateC10() {

        //피로도 설정
        let saveDate = new Date();
        let endDate = new Date(saveDate.getFullYear(), saveDate.getMonth(), saveDate.getDate(), 23, 59, 59);
        localStorage.setItem("c10DayEnd", endDate);

        // 들어온 날짜 구하기
        const now = new Date();
        // 다음 날 00시 구하기
        const nextDay = new Date(now);
        nextDay.setHours(24, 0, 0, 0); // 다음 날 00:00으로 설정
        // 접속한 시간 저장
        document.cookie = `connectNowC10=${now}; expires=${nextDay}`;

      }

      function fnPopHideC10() {
        if (window.innerWidth > 1080) {
          setTimeout(() => {
            SalesforceInteractions.cashDom("#evg-new-template-c10.pc_push_popup_c10").hide();
          }, 7000)
        } else {
          setTimeout(() => {
            SalesforceInteractions.cashDom("#evg-new-template-c10.mo_push_popup_c10").hide();
          }, 7000)
        }
      }

      function fnClickLanding() {

        document.querySelector("#evg-new-template-c10 > a").addEventListener("click", (e) => {

          sessionStorage.setItem("c10_landing", true);

        })

      }

      function fnApiInnerC10(context, template) {

        const c10CouponName = context.attributes.attributes.couponName.value;
        const c10CouponLength = parseInt(Number(context.attributes.attributes.couponLength.value));

        console.log(c10CouponLength);

        if (c10CouponLength === 1) {
          SalesforceInteractions.cashDom(".push_text").text(c10CouponName + "쿠폰이 있으니 사용하세요.");
        } else {
          SalesforceInteractions.cashDom(".coupon_name").text(c10CouponName);
          SalesforceInteractions.cashDom(".coupon_length").text(c10CouponLength - 1);
        }

      }

      const initC10Result = fnInitC10(context, template); // 결과를 변수에 저장
      console.log(initC10Result);
      if (initC10Result === undefined || initC10Result === false) return;
      if (initC10Result.statusTemplateCheckC10 !== 1 && initC10Result.statusMoPopCheckC10 !== 1) return;
      if (initC10Result.statusTemplateCheckC10 !== 1 && initC10Result.statusPcPopCheckC10 !== 1) return;

      fnInsertC10(context, template);
      fnApiInnerC10(context, template);
      fnPopHideC10();
      fnNowDateC10();
      fnClickLanding();

    }
    // const isIphone = /iphone|ipad/i.test(navigator.userAgent);

    const setupObserver = () => {
      const targetNode = document.querySelector('body');
      const config = { childList: true, subtree: true };
      const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.id === 'evg-new-template-c9') {
              addClickListener(node, ".contents_inner_info_image_button", 1600);
              addClickListener(node, ".contents_inner_info_title_today_btn", 1600);
            } else if (node.id === 'evg-new-template-c8') {
              addClickListener(node, ".contents_inner_button_right_btn", 1600);
              addClickListener(node, ".contents_inner_button_left_btn", 1600);
            }
          });
        });
      });
      observer.observe(targetNode, config);
    };

    const addClickListener = (parentNode, selector, delay) => {
      const element = parentNode.querySelector(selector);
      if (element) {
        element.addEventListener("click", () => {
          setTimeout(() => {
            fnStartC10(context, template)
          }, delay)
          // setTimeout(() => fnStartC10(context, template), delay);
        });
      }
    };

    const initializeEventListeners = (context, template) => {
      // 기본 시작 함수 호출
      fnStartC10(context, template);

      // 셀렉터와 지연 시간 매핑 배열 정의
      const eventMappings = [
        ["#evg-new-template-c9 .contents_inner_info_image_button", 1600],
        ["#evg-new-template-c9 .contents_inner_info_title_today_btn", 1600],
        [".leftB .close_btn", 1600],
        ["#evtPop .btn1 button, #evtPop .btn2 button", 1600],
        [".contents_inner_button_right_btn, .contents_inner_button_left_btn", 1600]
      ];

      // 각 셀렉터에 이벤트 리스너 설정
      eventMappings.forEach(([selector, delay]) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((btn) => {
          if (btn) {
            btn.addEventListener("click", () => {
              setTimeout(() => fnStartC10(context, template), delay);
            });
          }
        });
      });
    };

    setupObserver();
    SalesforceInteractions.DisplayUtils.pageInactive(1200).then((ele) => {
      setTimeout(() => {
        initializeEventListeners(context, template);
      }, 200);
    });

  }


  function reset(context, template) {

    Evergage.cashDom("#evg-new-template-c10").remove();
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

