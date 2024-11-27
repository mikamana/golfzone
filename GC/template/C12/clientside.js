(function () {
  function apply(context, template) {
    console.log("C12번 시작");

    // 함수 정의
    const initialize = (context, template) => {
      console.log("C12_initialize 실행");
      // let  statusPcPopCheck, statusMoPopCheck;
      let statusTemplateCheck, statusPcPopCheck, statusMoPopCheck;
      function fnStart(context, template) {
        console.log("C12_fnStart 실행");
        function fnInit(context, template) {
          const referrer = document.referrer;
          // 로그인 여부
          if (sessionStorage.getItem("log") !== "true") return;
          // if (SalesforceInteractions.cashDom("#email").val() === "") return;
          if (SalesforceInteractions.cashDom("#golfzonNo").val() === "") return;
          if (referrer.includes("/reserve/main") !== true) return;
          if (context.attributes.attributes.recentGcName === undefined || context.attributes.attributes.recentGcName === null || context.attributes.attributes.recentGcName.value === "N" || context.attributes.attributes.recentGcName.value === "undefined") return;
          if (context.attributes.attributes.recentGcNum === undefined || context.attributes.attributes.recentGcNum === null || context.attributes.attributes.recentGcNum.value === "N" || context.attributes.attributes.recentGcNum.value === "undefined") return;
          if (context.attributes.attributes.memberName === undefined || context.attributes.attributes.memberName === null || context.attributes.attributes.memberName.value === "N") return;
          if (context.attributes.attributes.recentGcDate === undefined || context.attributes.attributes.recentGcDate === null || context.attributes.attributes.recentGcDate.value === "N") return;
          /* 템플릿 체크 */
          if (SalesforceInteractions.cashDom("#evg-new-template-c8").length > 0) {
            return false
          } else {
            statusTemplateCheck = 1;
          }
          if (SalesforceInteractions.cashDom("#evg-new-template-c9").length > 0 &&
            document.querySelector("#evg-new-template-c9 > .modal_popup").style.display !== "none") {
            return false;
          } else {
            statusTemplateCheck = 1;
          }
          if (SalesforceInteractions.cashDom("#evg-new-template-c12").length > 0) return;
          if (window.location.href.includes("https://www.golfzoncounty.com/reserve/reserveConfirm") || window.location.href.includes("https://www.golfzoncounty.com/reserve/reserveComplete")
            || window.location.href.includes("https://m.golfzoncounty.com/reserve/reserveConfirm") || window.location.href.includes("https://m.golfzoncounty.com/reserve/reserveComplete")
          ) return;
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
          // 피로도 확인 - 로컬 스토리지
          let currentDate = new Date();
          if (currentDate < new Date(localStorage.getItem("c12DayEnd"))) return;
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

        function fnClickLandingC12() {

          document.querySelector("#evg-new-template-c12 a.push_popup").addEventListener("click", (e) => {
            sessionStorage.setItem("c12_landing", true);

          })

        }

        function fnNowDateC12() {

          //피로도 설정
          let saveDate = new Date();
          let endDate = new Date(saveDate.getFullYear(), saveDate.getMonth(), saveDate.getDate(), 23, 59, 59);
          localStorage.setItem("c12DayEnd", endDate);

          // 들어온 날짜 구하기
          const now = new Date();
          // 다음 날 00시 구하기
          const nextDay = new Date(now);
          nextDay.setHours(24, 0, 0, 0); // 다음 날 00:00으로 설정
          // 접속한 시간 저장
          document.cookie = `connectNowC12=${now}; expires=${nextDay}`;

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

          fetch(`https://www.golfzoncounty.com/member_api/mingreenfeelist?gc_no=${c12GcNum}&chnl=w`)
            .then((res) => res.json())
            .then((data) => {
              if (Object.keys(data).length <= 0) {
                return false;
              } else {
                fnInsert(context, template);
                fnPopHide();
                fnNowDateC12();
                fnClickLandingC12();
                SalesforceInteractions.cashDom(".text_name").text(context.attributes.attributes.memberName.value);
                const golfZoneApi = data.entitys
                console.log(golfZoneApi);
                const golfzoneUrl = window.innerWidth > 1080 ? golfZoneApi[0].reserve_url : replaceWWWwithM(golfZoneApi[0].reserve_url);
                const urlObj = new URL(golfzoneUrl); // URL 객체 생성

                // 날짜를 새 값으로 설정합니다.
                const newDate = c12GcDate !== undefined ? c12GcDate : formattedDate;
                console.log(newDate);
                urlObj.searchParams.set("select_date", c12GcDate);

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
              }
            });
        }

        const initResult = fnInit(context, template);
        if (initResult === undefined) return;
        if (initResult.statusTemplateCheck !== 1 && initResult.statusPcPopCheck !== 1) return;
        if (initResult.statusTemplateCheck !== 1 && initResult.statusMoPopCheck !== 1) return;
        fnApiInsert(context, template);

        return initResult;

      }

      SalesforceInteractions.DisplayUtils.pageInactive(1000).then((ele) => {
        setTimeout(() => {
          fnStart(context, template);
        }, 200);
      })

      // const fnResult = fnStart(context, template)
      // 첫 로딩 때 팝업창이 없으면
      /* if(fnStart(context, template) !== undefined){
          SalesforceInteractions.DisplayUtils.pageInactive(1000).then((ele) => {
              setTimeout(() => {
                  fnStart(context, template);
              }, 200);
          })
      }else{
          SalesforceInteractions.DisplayUtils.pageInactive(900).then((ele) => {
              setTimeout(() => {
                  console.log("C12_로드 후 1.1초 경과");
                  fnStart(context, template);
              }, 200);
          });
      } */



      // 클릭 시 fnStart 실행
      const addClickListener = (selector, delay = 1005) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          element.addEventListener("click", () => {
            setTimeout(() => {
              console.log("C12_클릭완료");
              fnStart(context, template)
            }, delay);
          });
        })
      };

      addClickListener(".contents_inner_info_image_button", 1200);
      addClickListener(".contents_inner_info_title_today_btn", 1200);
      addClickListener(".leftB .close_btn", 1200);
      addClickListener("#evtPop .btn1 button, #evtPop .btn2 button", 1200);
      addClickListener(".contents_inner_button_right_btn, .contents_inner_button_left_btn", 1200);

      const setObserver = () => {

        const targetNode = document.querySelector('body');
        const config = { childList: true, subtree: true };

        const observer = new MutationObserver((mutationsList) => {
          mutationsList.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
              mutation.addedNodes.forEach((node) => {
                if (node.id === 'evg-new-template-c9') {
                  addClickListener("#evg-new-template-c9 .contents_inner_info_image_button", 1000);
                  addClickListener("#evg-new-template-c9 .contents_inner_info_title_today_btn", 1000);
                } else if (node.id === 'evg-new-template-c8') {
                  addClickListener(".contents_inner_button_right_btn", 1000);
                  addClickListener(".contents_inner_button_left_btn", 1000);
                }
              });
            }
          });
        });

        observer.observe(targetNode, config);

      }
      setObserver();
    };

    // 최초 initialize 실행
    initialize(context, template);

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

