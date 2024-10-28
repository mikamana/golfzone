(function () {

  function apply(context, template) {
    console.log("C8번 시작");
    //유저 그룹 확인
    const { userGroup, triggerOptions, triggerOptionsNumber } = context || {};
    //기기 값에 따른 Handlebar 나누기
    const htmlArr = template(context).split("</br>");
    const device = window.innerWidth >= 1280 ? "PC" : window.innerWidth >= 768 ? "Tablet" : "Mobile";
    const deviceIndex = { "PC": 0, "Tablet": 1, "Mobile": 2 }[device];
    //캠페인 초기화
    function fnInitC8(context, template) {
      console.log("C8_TEST_1");
      //이메일주소 여부 확인
      if (SalesforceInteractions.cashDom("#email").val() === "") return;
      //골프존 회원번호 여부 확인
      if (SalesforceInteractions.cashDom("#golfzonNo").val() === "") return;
      //우선 순위 캠페인 여부 확인
      if (SalesforceInteractions.cashDom("#evg-new-template-c9").length > 0) return;
      //중복 노출 여부 확인
      if (SalesforceInteractions.cashDom("#evg-new-template-c8").length > 0) return;
      //기기 확인 후 
      if (deviceIndex === 0) {
        if (document.querySelector("#divpop") !== null && document.querySelector("#divpop").style.visibility === "visible") {
          return false
        } else {
          return true
        }
      } else if (deviceIndex === 1 || deviceIndex === 2) {
        if (document.querySelector("#evtPop") !== null) {
          if (document.querySelector("#evtPop").style.display === "block") {
            console.log("C8_TEST_1_2");
            return false;
          } else {
            return true;
          }
        }
      }
    }

    function fnInsertC8(context, template) {
      if (deviceIndex === 0 && navigator.userAgent.indexOf("iPad") <= -1) {
        SalesforceInteractions.cashDom("body").append(htmlArr[deviceIndex]);
      } else {
        SalesforceInteractions.cashDom("#wrap #content").append(htmlArr[deviceIndex]);
      }

      SalesforceInteractions.sendEvent({
        interaction: {
          name: "[시나리오] C8 - 신규 가입 고객 대상 예약 유도 실행"
        }
      })

    }

    function fnRemoveC8(context, template) {
      console.log("C8_TEST_3");
      const wrap = SalesforceInteractions.cashDom("#evg-new-template-c8");
      const btn = document.querySelectorAll(".contents_inner_button_left_btn, .contents_inner_button_right_btn");
      btn.forEach((node, idx) => {
        node.addEventListener("click", (e) => {
          console.log(e.target.classList.value);
          if (e.target.classList.value === "contents_inner_button_left_btn") {
            SalesforceInteractions.sendEvent({
              interaction: {
                name: "[시나리오] C8 - 오늘 하루 보지 않기 클릭"
              }
            })
          }
          wrap.remove();
        })
      });
    }

    function fnStartC8(context, template) {
      const initResult = fnInitC8(context, template); // 결과를 변수에 저장
      if (initResult === undefined || initResult === false) return; // 저장한 결과로 조건 검사
      fnInsertC8(context, template);
      fnRemoveC8(context, template);
    }
    return new Promise((resolve, reject) => {
      const mobileType = navigator.userAgent.toLowerCase();

      if (mobileType.indexOf('iphone') > -1 || mobileType.indexOf('iPad') > -1) {
        setTimeout(() => {
          console.log("아이폰, 아이패드 접속");
          if (userGroup !== "Control") {
            fnStartC8(context.template);

            if (window.innerWidth > 1080) {
              document.querySelector("a.close_btn").addEventListener("click", (e) => {
                setTimeout(() => {
                  fnStartC8(context.template);
                }, 1000);
              })

            } else {
              document.querySelector("button.close").addEventListener("click", (e) => {
                setTimeout(() => {
                  fnStartC8(context.template);
                }, 1000);
              })
              document.querySelector("button.today").addEventListener("click", (e) => {
                setTimeout(() => {
                  fnStartC8(context.template);
                }, 1500);
              })

            }
          }
          // resolve(true);
        }, 1000);
      }
      window.addEventListener("load", (e) => {
        setTimeout(() => {
          if (userGroup !== "Control") {
            fnStartC8(context.template);

            if (window.innerWidth > 1080) {
              document.querySelector("a.close_btn").addEventListener("click", (e) => {
                setTimeout(() => {
                  console.log("C8_TEST_닫기클릭");
                  fnStartC8(context.template);
                }, 1000);
              })

            } else {
              document.querySelector("button.close").addEventListener("click", (e) => {
                setTimeout(() => {
                  console.log("C8_TEST_닫기클릭");
                  fnStartC8(context.template);
                }, 1000);
              })
              document.querySelector("button.today").addEventListener("click", (e) => {
                console.log("C8_TEST_오늘하루클릭");
                setTimeout(() => {
                  fnStartC8(context.template);
                }, 1000);
              })

            }
          }
        }, 200);
        resolve(true);
      })
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

