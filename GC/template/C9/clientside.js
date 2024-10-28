(function () {
  console.log("C9번 시작");
  function apply(context, template) {
    const { userGroup, triggerOptions, triggerOptionsNumber } = context || {};
    function fnInitC9(context, template) {
      console.log("C9_TEST_1");
      const referrerUrl = document.referrer;
      if (SalesforceInteractions.cashDom("#email").val() === "") return;
      if (SalesforceInteractions.cashDom("#golfzonNo").val() === "") return;
      if (SalesforceInteractions.cashDom("#evg-new-template-c9").length > 0) return;
      if (context.attributes.attributes.histRoundAreaNum === undefined || context.attributes.attributes.histRoundAreaNum === null) return;
      if (context.attributes.attributes.memberName === undefined || context.attributes.attributes.memberName === null) return;
      if (window.location.href === "https://www.golfzoncounty.com/" || window.location.href === "https://www.golfzoncounty.com/main" || window.location.href === "https://m.golfzoncounty.com/main" || window.location.href === "https://m.golfzoncounty.com/") return;
      if (document.querySelector(".evtPop") !== null) {
        if (document.querySelector(".evtPop").style.visibility === "visible") return;
      }
      if (document.querySelector("#evtPop") !== null) {
        if (document.querySelector("#evtPop").style.display === "block") return;
      }
      if (referrerUrl === "https://www.golfzoncounty.com/" || referrerUrl === "https://www.golfzoncounty.com/main" || referrerUrl === "https://m.golfzoncounty.com/main" || referrerUrl === "https://m.golfzoncounty.com/") {
        return true;
      } else {
        return false;
      };

    }
    function fnInsertC9(context, template) {
      console.log("C9_TEST_2");
      const htmlArr = template(context).split("</br>");
      const device = window.innerWidth > 1080 ? "PC" : window.innerWidth > 768 ? "Tablet" : "mobile";
      const deviceIndex = { "PC": 0, "Tablet": 1, "mobile": 2 }[device];
      SalesforceInteractions.cashDom("body").append(htmlArr[deviceIndex]);
      SalesforceInteractions.sendEvent({
        interaction: {
          name: "[시나리오] C9 - 마지막 라운드 골프장 기준동일 권역 실행"
        }
      })

    }
    function fnApiInnerC9(context, template) {
      const memberName = context.attributes.attributes.memberName.value;
      const roundAreaNum = parseInt(Number(context.attributes.attributes.histRoundAreaNum.value));
      console.log("C9_TEST_3");
      SalesforceInteractions.cashDom(".contents_inner_info_recom .text_name").text(memberName + "님");
      function replaceWWWwithM(url) {
        if (url.includes("www.")) {
          return url.replace("www.", "m.");
        } else {
          console.warn("URL에 'www.'가 포함되어 있지 않습니다.");
          return url;
        }
      }



      if (roundAreaNum !== undefined) {
        setTimeout(() => {
          fetch(`https://www.golfzoncounty.com/member_api/mingreenfeelist?gc_no=${roundAreaNum}&chnl=w`)
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              const apiData = data.entitys;
              if (window.innerWidth > 1080) {
                SalesforceInteractions.cashDom(".contents_inner_info_title_middle").text(apiData[0].golfclub_name);
                SalesforceInteractions.cashDom(".contents_inner_button a")[0].attributes.href.value = apiData[0].reserve_url;
              } else {
                const moUrl = replaceWWWwithM(apiData[0].reserve_url);
                SalesforceInteractions.cashDom(".contents_inner_info_title_middle").text(apiData[0].golfclub_name);
                SalesforceInteractions.cashDom(".contents_inner_button a")[0].attributes.href.value = moUrl;
              }
            })
        }, 50)
      } else {

        fetch(`https://www.golfzoncounty.com/member_api/mingreenfeelist?gc_no=4&chnl=w`)
          .then((res) => res.json())
          .then((data) => {

            const apiData = data.entitys;

            if (window.innerWidth > 1080) {
              SalesforceInteractions.cashDom(".contents_inner_info_title_middle").text(apiData[0].golfclub_name);
              SalesforceInteractions.cashDom(".contents_inner_button a")[0].attr("href", apiData[0].reserve_url);
            } else {
              const moUrl = replaceWWWwithM(apiData[0].reserve_url);
              SalesforceInteractions.cashDom(".contents_inner_info_title_middle").text(apiData[0].golfclub_name);
              SalesforceInteractions.cashDom(".contents_inner_button a")[0].attr("href", moUrl);
            }
          })
      }
    }

    function fnRemoveC9(context, template) {
      console.log("C9_TEST_4");
      if (window.innerWidth > 1080) {
        SalesforceInteractions.listener("click", "#evg-new-template-c9 .contents_inner_info_image_button", (e) => {
          document.querySelector(".modal_popup_wrap .modal_popup").style.display = "none";
          document.querySelector(".modal_popup_wrap .modal_popup_bg").style.display = "none";
        })
        document.querySelector("#evg-new-template-c9 .contents_inner_info_image_button").addEventListener("click", (e) => {
          document.querySelector(".modal_popup_wrap .modal_popup").style.display = "none";
          document.querySelector(".modal_popup_wrap .modal_popup_bg").style.display = "none";
        });

        document.querySelector(".modal_popup_wrap .contents_inner_info_title_today_btn").addEventListener("click", (e) => {
          document.querySelector(".modal_popup_wrap .modal_popup").style.display = "none";
          document.querySelector(".modal_popup_wrap .modal_popup_bg").style.display = "none";
          SalesforceInteractions.sendEvent({
            interaction: {
              name: "[시나리오] C9 - 오늘 하루 보지 않기 클릭"
            }
          })

        });
      } else if (window.innerWidth > 768) {
        document.querySelector(".ta_modal_popup_wrap .contents_inner_info_image_button").addEventListener("click", (e) => {

          document.querySelector(".ta_modal_popup_wrap .modal_popup").style.display = "none";
          document.querySelector(".ta_modal_popup_wrap .modal_popup_bg").style.display = "none";

        });

        document.querySelector(".ta_modal_popup_wrap .contents_inner_info_title_today_btn").addEventListener("click", (e) => {

          document.querySelector(".ta_modal_popup_wrap .modal_popup").style.display = "none";
          document.querySelector(".ta_modal_popup_wrap .modal_popup_bg").style.display = "none";

          SalesforceInteractions.sendEvent({
            interaction: {
              name: "[시나리오] C9 - 오늘 하루 보지 않기 클릭"
            }
          })
        });

      } else {

        document.querySelector(".mo_modal_popup_wrap .contents_inner_info_image_button").addEventListener("click", (e) => {
          document.querySelector(".mo_modal_popup_wrap .mo_modal_popup").style.display = "none";
          document.querySelector(".mo_modal_popup_wrap .mo_modal_popup_bg").style.display = "none";

        });

        document.querySelector(".mo_modal_popup_wrap .contents_inner_info_title_today_btn").addEventListener("click", (e) => {
          document.querySelector(".mo_modal_popup_wrap .mo_modal_popup").style.display = "none";
          document.querySelector(".mo_modal_popup_wrap .mo_modal_popup_bg").style.display = "none";
          SalesforceInteractions.sendEvent({
            interaction: {
              name: "[시나리오] C9 - 오늘 하루 보지 않기 클릭"
            }
          })
        });
      }


    }

    function fnStartC9(context, template) {
      const initC9Result = fnInitC9(context, template); // 결과를 변수에 저장
      setTimeout(() => {
        if (initC9Result === undefined || initC9Result === false) return; // 저장한 결과로 조건 검사
        fnInsertC9(context, template);
        fnApiInnerC9(context, template);
        fnRemoveC9(context, template);
      }, 50)

    }

    return new Promise((resolve, reject) => {
      window.addEventListener("load", (e) => {
        setTimeout(() => {

          if (userGroup !== "Control") {
            fnStartC9(context, template);
            if (window.innerWidth > 1080) {
              if (document.querySelector(".evtPop") !== null) {
                document.querySelector("a.close_btn").addEventListener("click", (e) => {
                  setTimeout(() => {
                    console.log("C9_TEST_닫기클릭");
                    fnStartC9(context, template);
                  }, 1000);
                });
              }

            } else {
              if (document.querySelector("#evtPop") !== null) {
                document.querySelector("button.close").addEventListener("click", (e) => {
                  setTimeout(() => {
                    console.log("C9_TEST_오늘 하루 버튼 클릭");
                    fnStartC9(context, template);
                  }, 1000);
                });
              }

            }

          }
          resolve(true);
        }, 400);
      })

    })




  }

  function reset(context, template) {

    /** Remove the template from the DOM to reset the template. */
    Evergage.cashDom("#evg-new-template-c9").remove();
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

