(function () {

  function apply(context, template) {
    console.log("C8번 실행");
    const { userGroup, triggerOptions, triggerOptionsNumber } = context || {};
    const htmlArr = template(context).split("</br>");
    const device = window.innerWidth > 1220 ? "PC" : window.innerWidth >= 768 ? "Tablet" : "Mobile";
    const deviceIndex = { "PC": 0, "Tablet": 1, "Mobile": 2 }[device];

    function fnInitC8() {
      if (SalesforceInteractions.cashDom("#email").val() === "") return;
      if (SalesforceInteractions.cashDom("#golfzonNo").val() === "") return;
      if (SalesforceInteractions.cashDom("#evg-new-template-c9").length > 0) return;
      if (SalesforceInteractions.cashDom("#evg-new-template-c8").length > 0) return;
      if (deviceIndex === 0) {
        if (document.querySelector("#divpop").style.visibility === "visible") return;
      } else if (deviceIndex === 1 || deviceIndex === 2) {
        if (document.querySelector("#evtPop") !== null) {
          // setTimeout(()=>{
          if (document.querySelector("#evtPop").style.display === "block") {
            return false;
          } else {
            return true;
          }
          // },50);
        }
      }
      return true;
    }

    function fnInsertC8(context, template) {

      if (deviceIndex === 0) {
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

    function fnRemoveC8() {
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
      fnInitC8();
      if (fnInitC8() === undefined || fnInitC8() === false) return;
      fnInsertC8(context, template);
      fnRemoveC8();
    }




    return new Promise((resolve, reject) => {
      console.log("test0");
      window.addEventListener("load", (e) => {
        setTimeout(() => {
          if (userGroup !== "Control") {
            fnStartC8();

            if (deviceIndex === 0) {
              document.querySelector("a.close_btn").addEventListener("click", (e) => {
                setTimeout(() => {
                  fnStartC8();
                }, 1000);
              })

            } else if (deviceIndex === 1 || deviceIndex === 2) {
              document.querySelector("button.close").addEventListener("click", (e) => {
                setTimeout(() => {
                  fnStartC8();
                }, 1000);
              })
              document.querySelector("button.today").addEventListener("click", (e) => {
                setTimeout(() => {
                  fnStartC8();
                }, 1500);
              })

            }
          }
        }, 700)
      })
      console.log("test1");
      resolve(true);
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

