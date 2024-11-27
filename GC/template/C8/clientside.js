(function () {

  function apply(context, template) {
    console.log("C8번 시작");

    // 기기 값에 따른 Handlebar 나누기
    const htmlArr = template(context).split("</br>");
    const device = window.innerWidth >= 1280 ? "PC" : window.innerWidth >= 768 ? "Tablet" : "Mobile";
    const deviceIndex = { "PC": 0, "Tablet": 1, "Mobile": 2 }[device];
    // let clickCheck;

    // 전체 기능
    function fnStartC8(context, template, delay = 500) {

      // 캠페인 초기화
      function fnInitC8(context, template) {
        return new Promise((resolve, reject) => {
          // 로그인 여부
          if (sessionStorage.getItem("log") !== "true") return;
          //이메일주소 여부 확인
          if (SalesforceInteractions.cashDom("#email").val() === "") return;
          // 골프존 회원번호 여부 확인
          if (SalesforceInteractions.cashDom("#golfzonNo").val() === "") return;
          //중복 노출 여부 확인


          if (context.attributes.attributes.JoinbookingBool30Days.value === "N" || context.attributes.attributes.JoinbookingBool30Days.value === "undefined") return;
          if (SalesforceInteractions.cashDom("#evg-new-template-c8").length > 0) return;
          //우선 순위 캠페인 여부 확인
          if (SalesforceInteractions.cashDom("#evg-new-template-c9").length > 0) return;
          // 피로도 확인 쿠키
          // const clickDate = fnGetCookie("clickNow");
          // if (clickDate !== undefined) return;
          // 피로도 확인 로컬스토리지
          let currentDate = new Date();
          if (currentDate < new Date(localStorage.getItem("C8DayEnd"))) return;
          setTimeout(() => {
            // PC팝업
            const divpop = document.querySelector("#divpop");
            // 모바일 팝업
            const evtPop = document.querySelector("#evtPop");
            //기기, 팝업 확인 후 노출
            if (deviceIndex === 0) {
              // return divpop && divpop.style.visibility === "hidden" ? true : false;
              if (divpop && divpop.style.visibility === "hidden") {
                resolve(true);
                return true;
              } else {
                reject(false);
                return false;
              }
            } else if (deviceIndex === 1 || deviceIndex === 2) {
              if (evtPop && evtPop.style.display === "block") {
                reject(false);
                return false;
              } else {
                resolve(true);
                return true;
              }
            }
          }, 300);

        })
      }

      // 핸들바 삽입
      function fnInsertC8(context, template) {

        if (deviceIndex === 0 && navigator.userAgent.indexOf("iPad") <= -1) {
          SalesforceInteractions.cashDom("body").append(htmlArr[deviceIndex]);
        } else if (deviceIndex !== 0 && navigator.userAgent.indexOf("iPhone") > -1) {
          SalesforceInteractions.cashDom("#wrap #content").append(htmlArr[deviceIndex]);
        } else {
          SalesforceInteractions.cashDom("body").append(htmlArr[deviceIndex]);
        }
        setTimeout(() => {
          SalesforceInteractions.cashDom("div.c8_mo_modal_popup_wrap > div.modal_popup").addClass("active");
        }, 50)

        SalesforceInteractions.mcis.sendStat({
          campaignStats: [{
            control: false,
            experienceId: context.experience,
            stat: "Impression"
          }]
        });

      }

      function fnClickLandingC8() {

        document.querySelector("#evg-new-template-c8 a.contents_inner_info_subtitle").addEventListener("click", (e) => {
          sessionStorage.setItem("c8_landing", true);
        })

      }

      // 닫기, 오늘 하루 보지 않기 버튼 클릭
      function fnRemoveC8(context, template) {

        function fnNowDate(connect) {

          //피로도 설정
          let saveDate = new Date();
          let endDate = new Date(saveDate.getFullYear(), saveDate.getMonth(), saveDate.getDate(), 23, 59, 59);
          localStorage.setItem("C8DayEnd", endDate);

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

      SalesforceInteractions.DisplayUtils.pageInactive(delay).then((ele) => {
        fnInitC8(context, template)
          .then((result) => {
            if (result === undefined || result === false) return; // 저장한 결과로 조건 검사
            fnInsertC8(context, template);
            fnRemoveC8(context, template);
            fnClickLandingC8();
          })
      });

    }

    // 팝업창 닫기
    function fnSetCloseC8(context, template, delay) {
      const closeButtonSelector = window.innerWidth > 1080 ? "a.close_btn" : "button.close, button.today";
      document.querySelectorAll(closeButtonSelector).forEach((btn) => {
        btn.addEventListener("click", () => {

          // setTimeout(() => {
          fnStartC8(context, template, delay);
          // }, 1000);

        });
      });
    }

    // const isIphoneOrIpad = /iphone|ipad/i.test(navigator.userAgent);

    function init(context, template, delay) {

      fnStartC8(context, template, delay);
      fnSetCloseC8(context, template, delay);

    }

    if (window.innerWidth <= 768) {
      init(context, template, 200);
    } else {
      init(context, template, 200);
    }
    // isIphoneOrIpad ? setTimeout(init(context, template), 200) : window.addEventListener("load", () => setTimeout(init(context, template), 200));

  }

  function reset(context, template) {

    /** Remove the template from the DOM to reset the template. */
    Evergage.cashDom("#evg-new-template-c8").remove();
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

