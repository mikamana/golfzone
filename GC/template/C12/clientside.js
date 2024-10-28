(function () {
  function apply(context, template) {
    console.log("C12번 시작");
    const { userGroup, triggerOptions, triggerOptionsNumber } = context || {};
    let statusTemplateCheck = 0;
    let statusPcPopCheck = 0;
    let statusMoPopCheck = 0;
    function fnInit(context, template) {
      console.log("C12_TEST_1");
      if (SalesforceInteractions.cashDom("#email").val() === "") return;
      if (SalesforceInteractions.cashDom("#golfzonNo").val() === "") return;
      if (SalesforceInteractions.cashDom("#evg-new-template-c12").length > 0) return;
      if (SalesforceInteractions.cashDom("#evg-new-template-c8").length > 0) return;
      if (context.attributes.attributes.recentGcNum === undefined || context.attributes.attributes.recentGcNum === null) return;
      if (context.attributes.attributes.memberName === undefined || context.attributes.attributes.memberName === null) return;
      if (window.innerWidth > 1080) {
        console.log("C12_TEST_2");
        /* 템플릿 체크 */
        if (SalesforceInteractions.cashDom("#evg-new-template-c9").length > 0) {
          if (document.querySelector("#evg-new-template-c9 > .modal_popup").style.display === "none") {
            statusTemplateCheck = 1;
          } else {
            console.log("C12_TEST_3");
            return false;
          }
        } else {
          statusTemplateCheck = 1;
        }
        /* PC 팝업창 체크 */
        if (document.querySelector(".evtPop") !== null) {
          if (document.querySelector(".evtPop").style.visibility === "visible") {
            return false;
          } else {
            statusPcPopCheck = 1;
          }
        } else if (document.querySelector(".evtPop") === null) {
          statusPcPopCheck = 1;
        }


        return { statusTemplateCheck, statusPcPopCheck }
      } else if (window.innerWidth > 768) {
        /* 템플릿 체크 */
        if (SalesforceInteractions.cashDom("#evg-new-template-c8").length > 0) return;
        if (SalesforceInteractions.cashDom("#evg-new-template-c9").length > 0) {
          if (document.querySelector("#evg-new-template-c9 .modal_popup").style.display === "none") {
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
          statusMoPopCheck = 1;
        } else {
        }

        return { statusTemplateCheck, statusMoPopCheck };
      } else {
        /* 템플릿 체크 */
        if (SalesforceInteractions.cashDom("#evg-new-template-c8").length > 0) return;
        if (SalesforceInteractions.cashDom("#evg-new-template-c9").length > 0) {
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
          statusMoPopCheck = 1;
        } else {
        }

        return { statusTemplateCheck, statusMoPopCheck };

      }

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
    }

    function fnPopHide() {
      if (window.innerWidth > 1080) {
        setTimeout(() => {
          SalesforceInteractions.cashDom("#evg-new-template-c12.pc_push_popup").hide();
        }, 7000)
      } else {
        setTimeout(() => {
          SalesforceInteractions.cashDom("#evg-new-template-c12.mo_push_popup").hide();
        }, 7000)
      }
    }

    function fnApiInner(context, template) {
      if (context.attributes.attributes.recentGcNum !== undefined) {
        const c12GcDate = context.attributes.attributes.recentGcDate.value;
        const c12GcNum = context.attributes.attributes.recentGcNum.value;
        const today = new Date();
        const formattedDate = today.getFullYear().toString() +
          String(today.getMonth() + 1).padStart(2, '0') +
          String(today.getDate()).padStart(2, '0');
        if (window.innerWidth > 1080) {
          fetch(`https://www.golfzoncounty.com/member_api/mingreenfeelist?gc_no=${c12GcNum}&chnl=w`)
            .then((res) => res.json())
            .then((data) => {
              const golfZoneApi = data.entitys
              if (context.attributes.attributes.memberName.value !== null || context.attributes.attributes.memberName.value !== undefined) {
                SalesforceInteractions.cashDom(".text_name").text(context.attributes.attributes.memberName.value);
              }
              const golfzoneUrl = golfZoneApi[0].reserve_url;
              const urlObj = new URL(golfzoneUrl); // URL 객체 생성




              // 날짜를 새 값으로 설정합니다.
              const newDate = c12GcDate !== undefined ? c12GcDate : formattedDate;
              urlObj.searchParams.set("select_date", newDate);

              SalesforceInteractions.cashDom(".text_area").text(golfZoneApi[0].golfclub_name);
              SalesforceInteractions.cashDom(".push_popup")[0].attributes.href.value = urlObj;
            });
        } else {
          fetch(`https://www.golfzoncounty.com/member_api/mingreenfeelist?gc_no=${c12GcNum}&chnl=w`)
            .then((res) => res.json())
            .then((data) => {
              const golfZoneApi = data.entitys
              if (context.attributes.attributes.memberName.value !== null || context.attributes.attributes.memberName.value !== undefined) {

                SalesforceInteractions.cashDom(".text_name").text(context.attributes.attributes.memberName.value);
              }
              const golfzoneUrl = golfZoneApi[0].reserve_url;

              function replaceWWWwithM(url) {
                if (url.includes("www.")) {
                  return url.replace("www.", "m.");
                } else {
                  console.warn("URL에 'www.'가 포함되어 있지 않습니다.");
                  return url;
                }
              }

              const mobileUrl = replaceWWWwithM(golfzoneUrl);

              const urlObj = new URL(mobileUrl); // URL 객체 생성

              // 날짜를 새 값으로 설정합니다.
              const newDate = c12GcDate !== undefined ? c12GcDate : formattedDate; // 예: 2024년 12월 25일
              urlObj.searchParams.set("select_date", newDate);

              SalesforceInteractions.cashDom(".text_area").text(golfZoneApi[0].golfclub_name);
              SalesforceInteractions.cashDom(".push_popup")[0].attributes.href.value = urlObj;
            });
        }
      }

    }

    function fnStart(context, template) {
      const result = fnInit(context, template);
      if (result === undefined || result === false) return;
      if (result.statusTemplateCheck !== 1 && result.statusPcPopCheck !== 1) return;
      if (result.statusTemplateCheck !== 1 && result.statusMoPopCheck !== 1) return;
      fnInsert(context, template);
      fnPopHide();
      fnApiInner(context, template);
    }

    return new Promise((resolve, reject) => {

      /* 아이폰 작동 */
      const mobileType = navigator.userAgent.toLowerCase();
      if (mobileType.indexOf('iphone') > -1) {
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
                        fnStart(context, template);
                      }, 90);
                    })
                    node.querySelector(".contents_inner_info_title_today_btn").addEventListener("click", (e) => {
                      setTimeout(() => {
                        fnStart(context, template);
                      }, 90);
                    })
                  } else if (node.id === 'evg-new-template-c8') {
                    node.querySelector(".contents_inner_button_right_btn").addEventListener("click", (e) => {
                      setTimeout(() => {
                        fnStart(context, template);
                      }, 90);
                    });
                    node.querySelector(".contents_inner_button_left_btn").addEventListener("click", (e) => {
                      setTimeout(() => {
                        fnStart(context, template);
                      }, 90);
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
            fnStart(context, template);

            if (SalesforceInteractions.cashDom("#evg-new-template-c9")[0] !== null) {
              const popBtn = SalesforceInteractions.cashDom(".contents_inner_info_image_button");
              SalesforceInteractions.listener("click", ".contents_inner_info_image_button", (e) => {
                setTimeout(() => {
                  fnStart(context, template);
                }, 1005);
              })

              SalesforceInteractions.listener("click", ".contents_inner_info_title_today_btn", (e) => {
                setTimeout(() => {
                  fnStart(context, template);
                }, 1005);
              })
            }

            if (document.querySelector(".leftB .close_btn") !== null) {
              const popBtn = document.querySelector("#divpop .leftB .close_btn");
              popBtn.addEventListener("click", (e) => {
                setTimeout(() => {
                  fnStart(context, template);
                }, 1005);
              })
            }

            if (document.querySelector("#evtPop .btn2 button") !== null) {
              const popBtn = document.querySelectorAll("#evtPop .btn1 button, #evtPop .btn2 button");
              popBtn.forEach((btn, idx) => {
                btn.addEventListener("click", (e) => {

                  setTimeout(() => {
                    fnStart(context, template);
                  }, 1005);
                })
              })
            }
            if (document.querySelector(".contents_inner_button_right_btn") !== null) {
              const closeBtn = document.querySelectorAll(" .contents_inner_button_right_btn, .contents_inner_button_left_btn");
              closeBtn.forEach((btn, idx) => {
                btn.addEventListener("click", (e) => {
                  setTimeout(() => {
                    fnStart(context, template);
                  }, 1005)
                });
              })
            }
          }
          resolve(true);
        }, 500)
      }
      window.addEventListener("load", () => {
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
                        fnStart(context, template);
                      }, 90);
                    })
                    node.querySelector(".contents_inner_info_title_today_btn").addEventListener("click", (e) => {
                      setTimeout(() => {
                        fnStart(context, template);
                      }, 90);
                    })
                  } else if (node.id === 'evg-new-template-c8') {
                    node.querySelector(".contents_inner_button_right_btn").addEventListener("click", (e) => {
                      setTimeout(() => {
                        fnStart(context, template);
                      }, 90);
                    });
                    node.querySelector(".contents_inner_button_left_btn").addEventListener("click", (e) => {
                      setTimeout(() => {
                        fnStart(context, template);
                      }, 90);
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
                }, 1005);
              })
            }

            if (document.querySelector(".leftB .close_btn") !== null) {
              const popBtn = document.querySelector("#divpop .leftB .close_btn");
              popBtn.addEventListener("click", (e) => {
                setTimeout(() => {
                  fnStart(context, template);
                }, 1005);
              })
            }

            if (document.querySelector("#evtPop .btn2 button") !== null) {
              const popBtn = document.querySelectorAll("#evtPop .btn1 button, #evtPop .btn2 button");
              popBtn.forEach((btn, idx) => {
                btn.addEventListener("click", (e) => {

                  setTimeout(() => {
                    fnStart(context, template);
                  }, 1005);
                })
              })
            }
            if (document.querySelector(".contents_inner_button_right_btn") !== null) {
              const closeBtn = document.querySelectorAll(" .contents_inner_button_right_btn, .contents_inner_button_left_btn");
              closeBtn.forEach((btn, idx) => {
                btn.addEventListener("click", (e) => {
                  setTimeout(() => {
                    fnStart(context, template);
                  }, 1005)
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

