(function () {
  function apply(context, template) {
    const { userGroup, triggerOptions, triggerOptionsNumber } = context || {};
    console.log("C12번 실행");
    let statusTemplateCheck = 0;
    let statusPcPopCheck = 0;
    let statusMoPopCheck = 0;
    function fnInit() {
      if (SalesforceInteractions.cashDom("#email").val() === "") return;
      if (SalesforceInteractions.cashDom("#golfzonNo").val() === "") return;
      if (SalesforceInteractions.cashDom("#evg-new-template-c12").length > 0) return;
      if (SalesforceInteractions.cashDom("#evg-new-template-c8").length > 0) return;

      if (window.innerWidth > 1080) {
        /* 템플릿 체크 */
        if (document.querySelector("#evg-new-template-c9") !== null) {
          if (document.querySelector("#evg-new-template-c9 > .modal_popup").style.display === "none") {
            statusTemplateCheck = 1;
          } else {
            return false;
          }
        } else {
          statusTemplateCheck = 1;
        }
        /* PC 팝업창 체크 */
        if (document.querySelector("#divpop") !== null) {
          if (document.querySelector("#divpop").style.visibility === "visible") {
            return false;
          } else {
            statusPcPopCheck = 1;
          }
        } else if (document.querySelector("#divpop") === null) {
          statusPcPopCheck = 1;
        }


        return { statusTemplateCheck, statusPcPopCheck }



        /* if(document.querySelector("#divpop") !== null){
            if(document.querySelector("#divpop").style.visibility === "visible"){
                return false;
            }else if(SalesforceInteractions.cashDom("#evg-new-template-c8").length > 0 && document.querySelector("#divpop").style.visibility === "hidden"){
                return false;
            }else if(SalesforceInteractions.cashDom("#evg-new-template-c8").length <= 0 && document.querySelector("#divpop").style.visibility === "hidden" && (document.querySelector("#evg-new-template-c9 > .modal_popup").style.display === "none") ){
                statusNum = 2;
            }else if(document.querySelector("#evg-new-template-c8") === null && document.querySelector("#divpop").style.visibility === "hidden" && (document.querySelector("#evg-new-template-c9 > .modal_popup").style.display === "none")){
                statusNum = 2;
            }else if(document.querySelector("#evg-new-template-c9") === null){
                statusNum = 2;
            }else if(SalesforceInteractions.cashDom("#evg-new-template-c9").length > 0 && SalesforceInteractions.cashDom("#evg-new-template-c9 > .modal_popup")[0].style.display === "block"){
                return false;
            }else if(SalesforceInteractions.cashDom("#evg-new-template-c9").length <= 0 || SalesforceInteractions.cashDom("#evg-new-template-c9 > .modal_popup")[0].style.display === "none"){
                statusNum = 2;
            }
        }else{
            if(document.querySelector("#evg-new-template-c9") === null){
                statusNum = 2;
            }else if(SalesforceInteractions.cashDom("#evg-new-template-c9 > .modal_popup")[0].style.display === "block" || SalesforceInteractions.cashDom("#evg-new-template-c9 > .modal_popup")[0].style.display === ""){
                return false;
            }else if(SalesforceInteractions.cashDom("#evg-new-template-c9").length <= 0 || SalesforceInteractions.cashDom("#evg-new-template-c9 > .modal_popup")[0].style.display === "none"){
                statusNum = 2;
            }else{
                statusNum = 2;
            }
        } */
      } else {

        /* 템플릿 체크 */

        if (SalesforceInteractions.cashDom("#evg-new-template-c8").length > 0) return;
        if (document.querySelector("#evg-new-template-c9") !== null) {
          if (document.querySelector("#evg-new-template-c9 > .mo_modal_popup").style.display === "none") {
            statusTemplateCheck = 1;
          } else {
            return false;
          }
        } else {
          statusTemplateCheck = 1;
        }

        /* 모바일 팝업창 체크 */
        if (document.querySelector("#evtPop") !== null) {
          if (document.querySelector("#evtPop").style.display === "block") {
            return false;
          } else if (document.querySelector("#evtPop").style.display === "none" || document.querySelector("#evtPop").style.display === "") {
            statusMoPopCheck = 1;
          } else {
            statusMoPopCheck = 1;
          }
        } else if (document.querySelector("#evtPop") === null) {
          console.log("dt" + statusMoPopCheck);
          statusMoPopCheck = 1;
        } else {
          console.log("dat" + statusMoPopCheck);
        }

        return { statusTemplateCheck, statusMoPopCheck };
        /* if(document.querySelector("#evtPop") !== null){
            if(document.querySelector("#evtPop").style.display === "block"){
                return false;
            }else if(SalesforceInteractions.cashDom("#evg-new-template-c8").length > 0 && document.querySelector("#evtPop").style.display === "none"){
                return false;
            }else if(SalesforceInteractions.cashDom("#evg-new-template-c8").length <= 0 && document.querySelector("#evtPop").style.display === "none" && (document.querySelector("#evg-new-template-c9 > .mo_modal_popup").style.display === "none")){
                statusNum = 2;
            }else if(document.querySelector("#evg-new-template-c8") === null && document.querySelector("#evtPop").style.display === "none" && (document.querySelector("#evg-new-template-c9 > .mo_modal_popup").style.display === "none")){
                statusNum = 2;
            }else if(document.querySelector("#evg-new-template-c9") === null){
                statusNum = 2;
            }else if(SalesforceInteractions.cashDom("#evg-new-template-c9").length <= 0 || document.querySelector("#evg-new-template-c9 > .mo_modal_popup")[0].style.display === "none"){
                statusNum = 2;
            }
        }else{
            if(document.querySelector("#evg-new-template-c9") === null){
                statusNum = 2;
            }else if(SalesforceInteractions.cashDom("#evg-new-template-c9 > .mo_modal_popup")[0].style.display === "block" || SalesforceInteractions.cashDom("#evg-new-template-c9 > .mo_modal_popup")[0].style.display === ""){
                return false;
            }else if(SalesforceInteractions.cashDom("#evg-new-template-c9 > .mo_modal_popup")[0].style.display === "none"){
                statusNum = 2;
            }else{
                statusNum = 2;
            }
        } */
      }
      // if(statusNum === 0) return;
      // return true;
    }

    function fnInsert(context, template) {
      const htmlArr = template(context).split("</br>");
      const device = window.innerWidth > 1080 ? "PC" : "mobile";
      const deviceIndex = { "PC": 0, "mobile": 1 }[device];
      SalesforceInteractions.cashDom("body").prepend(htmlArr[deviceIndex]);
      SalesforceInteractions.sendEvent({
        interaction: {
          name: "[시나리오] C12 - 예약 페이지 이탈 고객에게 해당 골프장 프로모션 실행"
        }
      })
      SalesforceInteractions.sendEvent({
        interaction: {
          name: "[TEST] C12 - 예약 페이지 이탈 고객에게 해당 골프장 프로모션 실행"
        }
      })
    }

    function fnPopHide() {
      if (window.innerWidth > 1080) {
        setTimeout(() => {
          SalesforceInteractions.cashDom("#evg-new-template-c12.pc_push_popup").hide();
        }, 5000)
      } else {
        setTimeout(() => {
          SalesforceInteractions.cashDom("#evg-new-template-c12.mo_push_popup").hide();
        }, 5000)
      }
    }

    function fnApiInner() {

      const c12GcNum = context.attributes.attributes.recentGcNum.value;

      if (window.innerWidth > 1080) {
        fetch(`https://www.golfzoncounty.com/member_api/mingreenfeelist?gc_no=${c12GcNum}&chnl=w`)
          .then((res) => res.json())
          .then((data) => {
            const golfZoneApi = data.entitys
            if (context.attributes.attributes.name.value !== null || context.attributes.attributes.name.value !== undefined) {
              SalesforceInteractions.cashDom(".text_name").text(context.attributes.attributes.name.value);
            }
            SalesforceInteractions.cashDom(".text_area").text(golfZoneApi[0].golfclub_name);
            SalesforceInteractions.cashDom(".push_popup")[0].attributes.href.value = golfZoneApi[0].reserve_url;
          });
      } else {
        fetch(`https://www.golfzoncounty.com/member_api/mingreenfeelist?gc_no=${c12GcNum}&chnl=w`)
          .then((res) => res.json())
          .then((data) => {
            const golfZoneApi = data.entitys
            if (context.attributes.attributes.name.value !== null || context.attributes.attributes.name.value !== undefined) {
              SalesforceInteractions.cashDom(".text_name").text(context.attributes.attributes.name.value);
            }
            const urlLinkAll = golfZoneApi[0].reserve_url;

            function replaceWWWwithM(url) {
              if (url.includes("www.")) {
                return url.replace("www.", "m.");
              } else {
                console.warn("URL에 'www.'가 포함되어 있지 않습니다.");
                return url;
              }
            }
            const mobileUrl = replaceWWWwithM(urlLinkAll);

            SalesforceInteractions.cashDom(".text_area").text(golfZoneApi[0].golfclub_name);
            SalesforceInteractions.cashDom(".push_popup")[0].attributes.href.value = mobileUrl;
          });
      }
    }

    function fnStart(context, template) {
      fnInit();
      if (fnInit() === undefined || fnInit() === false) return;
      const result = fnInit();
      console.log(result);
      if (result.statusTemplateCheck !== 1 && result.statusPcPopCheck !== 1) return;
      if (result.statusTemplateCheck !== 1 && result.statusMoPopCheck !== 1) return;

      fnInsert(context, template);
      fnPopHide();
      fnApiInner();
    }

    return new Promise((resolve, reject) => {
      window.addEventListener("load", () => {
        console.log("로드완료");
        const targetNode = document.querySelector('body');
        const config = { childList: true, subtree: true };
        const observer = new MutationObserver((mutationsList, observer) => {
          // 감지된 모든 변화를 순회하며 처리
          console.log("자식노드가 추가됨");
          for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
              if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                  // 여기서 추가된 자식 요소를 사용할 수 있음
                  // 예: 추가된 노드의 텍스트를 변경하거나 속성을 조작할 수 있음
                  if (node.id === 'evg-new-template-c9') { // 특정 id 값을 가진 노드인지 확인
                    node.querySelector(".contents_inner_info_image_button").addEventListener("click", (e) => {
                      setTimeout(() => {
                        fnStart(context, template);
                      }, 1200);
                    })
                    node.querySelector(".contents_inner_info_title_today_btn").addEventListener("click", (e) => {
                      setTimeout(() => {
                        fnStart(context, template);
                      }, 1200);
                    })
                  } else if (node.id === 'evg-new-template-c8') {
                    node.querySelector(".contents_inner_button_right_btn").addEventListener("click", (e) => {
                      setTimeout(() => {
                        console.log("왼쪽버튼클릭");
                        fnStart(context, template);
                      }, 800);
                    });
                    node.querySelector(".contents_inner_button_left_btn").addEventListener("click", (e) => {
                      setTimeout(() => {
                        console.log("오른쪽쪽버튼클릭");
                        fnStart(context, template);
                      }, 800);
                    });
                  }
                });
              }
            }
          }
        });
        console.log(observer.observe(targetNode, config));
        // MutationObserver 생성 및 설정
        observer.observe(targetNode, config);

        setTimeout(() => {
          if (userGroup !== "Control") {
            fnStart(context, template);

            if (SalesforceInteractions.cashDom("#evg-new-template-c9")[0] !== null) {
              const popBtn = SalesforceInteractions.cashDom(".contents_inner_info_image_button");
              SalesforceInteractions.listener("click", ".contents_inner_info_image_button", (e) => {
                setTimeout(() => {
                  fnStart(context, template);
                }, 1200);
              })

              SalesforceInteractions.listener("click", ".contents_inner_info_title_today_btn", (e) => {
                setTimeout(() => {
                  fnStart(context, template);
                }, 1200);
              })
            }

            if (document.querySelector(".leftB .close_btn") !== null) {
              const popBtn = document.querySelector("#divpop .leftB .close_btn");
              popBtn.addEventListener("click", (e) => {
                setTimeout(() => {
                  fnStart(context, template);
                }, 1200);
              })
            }

            if (document.querySelector("#evtPop .btn2 button") !== null) {
              const popBtn = document.querySelectorAll("#evtPop .btn1 button, #evtPop .btn2 button");
              popBtn.forEach((btn, idx) => {
                btn.addEventListener("click", (e) => {
                  console.log("buton");

                  setTimeout(() => {
                    fnStart(context, template);
                  }, 1200);
                })
              })
            }
            if (document.querySelector(".contents_inner_button_right_btn") !== null) {
              const closeBtn = document.querySelectorAll(" .contents_inner_button_right_btn, .contents_inner_button_left_btn");
              closeBtn.forEach((btn, idx) => {
                btn.addEventListener("click", (e) => {
                  setTimeout(() => {
                    fnStart(context, template);
                  }, 1200)
                });
              })
            }
          }
          resolve(true);
        }, 500)
      });
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

