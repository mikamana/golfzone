(function () {

  function apply(context, template) {
    const { userGroup, triggerOptions, triggerOptionsNumber } = context || {};
    let statusTemplateCheckC10 = 0;
    let statusPcPopCheckC10 = 0;
    let statusMoPopCheckC10 = 0;

    function fnInitC10(context, template) {
      if (SalesforceInteractions.cashDom("#email").val() === "") return;
      if (SalesforceInteractions.cashDom("#golfzonNo").val() === "") return;
      if (SalesforceInteractions.cashDom('#evg-new-template-c12').length > 0) return;
      if (context.attributes.attributes.couponName.value === "") return;
      /* 템플릿 체크 */
      if (SalesforceInteractions.cashDom("#evg-new-template-c8").length > 0) {
        return false;
      } else {
        statusTemplateCheckC10 = 1;
      }
      if (window.innerWidth > 1080) {
        /* PC 팝업창 체크 */
        if (document.querySelector("#divpop") !== null) {
          if (document.querySelector("#divpop").style.visibility === "visible") {
            return false;
          } else if (document.querySelector("#divpop").style.visibility === "hidden") {
            statusPcPopCheckC10 = 1;
          } else {
            statusPcPopCheckC10 = 1;
          }

        } else if (document.querySelector("#divpop") === null) {
          statusPcPopCheckC10 = 1;
        }

        return { statusTemplateCheckC10, statusPcPopCheckC10 }
      } else {
        /* MO 팝업창 체크 */
        if (document.querySelector("#evtPop") !== null) {
          if (document.querySelector("#evtPop").style.display === "block") {
            return false;
          } else if (document.querySelector("#evtPop").style.display === "none") {
            statusMoPopCheckC10 = 1;
          } else {
            statusMoPopCheckC10 = 1;
          }
        } else if (document.querySelector("#evtPop") === null) {
          statusMoPopCheckC10 = 1;
        }
        return { statusTemplateCheckC10, statusMoPopCheckC10 };
      }
    }

    function fnInsertC10(context, template) {
      const htmlArr = template(context).split("</br>");
      const device = window.innerWidth > 1080 ? "PC" : "mobile";
      const deviceIndex = { "PC": 0, "mobile": 1 }[device];
      SalesforceInteractions.cashDom("body").prepend(htmlArr[deviceIndex]);

      SalesforceInteractions.sendEvent({
        interaction: {
          name: "[시나리오] C10 - 쿠폰 보유 대상 보유한 쿠폰 안내 실행"
        }
      })
      SalesforceInteractions.sendEvent({
        interaction: {
          name: "[TEST] C10 - 쿠폰 보유 대상 보유한 쿠폰 안내 실행"
        }
      })

    }

    function fnPopHideC10() {
      if (window.innerWidth > 1080) {
        setTimeout(() => {
          SalesforceInteractions.cashDom("#evg-new-template-c10.pc_push_popup").hide();
        }, 5000)
      } else {
        setTimeout(() => {
          SalesforceInteractions.cashDom("#evg-new-template-c10.mo_push_popup").hide();
        }, 5000)
      }
    }

    function fnApiInnerC10() {
      const c10CouponName = context.attributes.attributes.couponName.value;
      const c10CouponLength = parseInt(Number(context.attributes.attributes.couponLength.value));

      SalesforceInteractions.cashDom(".coupon_name").text(c10CouponName);
      SalesforceInteractions.cashDom(".coupon_length").text(c10CouponLength);

    }

    function fnStartC10(context, template) {
      fnInitC10(context, template);
      if (fnInitC10(context, template) === undefined || !fnInitC10(context, template)) return;
      const result = fnInitC10(context, template);
      if (result.statusTemplateCheckC10 !== 1 && result.statusMoPopCheckC10 !== 1) return;
      if (result.statusTemplateCheckC10 !== 1 && result.statusPcPopCheckC10 !== 1) return;
      fnInsertC10(context, template);
      fnApiInnerC10();
      fnPopHideC10();
    }

    return new Promise((resolve, reject) => {
      window.addEventListener("load", (e) => {
        const targetNode = document.querySelector('body');
        const config = { childList: true, subtree: true };
        const observer = new MutationObserver((mutationsList, observer) => {
          // 감지된 모든 변화를 순회하며 처리
          for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
              if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                  // 여기서 추가된 자식 요소를 사용할 수 있음
                  // 예: 추가된 노드의 텍스트를 변경하거나 속성을 조작할 수 있음
                  if (node.id === 'evg-new-template-c9') { // 특정 id 값을 가진 노드인지 확인
                    node.querySelector(".contents_inner_info_image_button").addEventListener("click", (e) => {
                      setTimeout(() => {
                        fnStartC10(context, template);
                      }, 1220);
                    })
                    node.querySelector(".contents_inner_info_title_today_btn").addEventListener("click", (e) => {
                      setTimeout(() => {
                        fnStartC10(context, template);
                      }, 1220);
                    })
                  } else if (node.id === 'evg-new-template-c8') {
                    node.querySelector(".contents_inner_button_right_btn").addEventListener("click", (e) => {
                      setTimeout(() => {
                        fnStartC10(context, template);
                      }, 1220);
                    });
                    node.querySelector(".contents_inner_button_left_btn").addEventListener("click", (e) => {
                      setTimeout(() => {
                        fnStartC10(context, template);
                      }, 1220);
                    });
                  }

                });
              }
            }
          }
        });

        // MutationObserver 생성 및 설정
        observer.observe(targetNode, config);

        setTimeout(() => {
          if (userGroup !== "Control") {
            fnStartC10(context, template);

            if (SalesforceInteractions.cashDom("#evg-new-template-c9")[0] !== null) {
              const popBtn = SalesforceInteractions.cashDom(".contents_inner_info_image_button");
              SalesforceInteractions.listener("click", ".contents_inner_info_image_button", (e) => {
                setTimeout(() => {
                  fnStart(context, template);
                }, 1220);
              })

              SalesforceInteractions.listener("click", ".contents_inner_info_title_today_btn", (e) => {
                setTimeout(() => {
                  fnStart(context, template);
                }, 1220);
              })
            }

            if (document.querySelector(".leftB .close_btn") !== null) {
              const popBtn = document.querySelector("#divpop .leftB .close_btn");
              popBtn.addEventListener("click", (e) => {
                setTimeout(() => {
                  fnStartC10(context, template);
                }, 1220);
              })
            }
            if (document.querySelector("#evtPop .btn2 button") !== null) {
              const popBtn = document.querySelectorAll("#evtPop .btn1 button, #evtPop .btn2 button");
              popBtn.forEach((btn, idx) => {
                btn.addEventListener("click", (e) => {
                  setTimeout(() => {
                    fnStartC10(context, template);
                  }, 1220);
                })
              })
            }
            if (document.querySelector(".contents_inner_button_right_btn") !== null) {
              const closeBtnC10 = document.querySelectorAll(".contents_inner_button_right_btn, .contents_inner_button_left_btn");
              closeBtnC10.forEach((btn, idx) => {
                btn.addEventListener("click", (e) => {
                  setTimeout(() => {
                    fnStartC10(context, template);
                  }, 1220)
                });
              })
            }
            /* let segID;
            context.attributes.segmentMembership.forEach((item, index) => {
                const segId = item.segmentId; //segid
                if(segId == "nmIwY") segID = segId;
            })
                if(segID == "nmIwY") return; */
          }
          resolve(true);
        }, 550);
      });
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

