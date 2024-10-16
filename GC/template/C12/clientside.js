(function () {

  function apply(context, template) {

    const { userGroup, triggerOptions, triggerOptionsNumber } = context || {};
    let statusNum = 0;
    function fnInit() {
      if (SalesforceInteractions.cashDom("#email").val() === "") return;
      if (SalesforceInteractions.cashDom("#golfzonNo").val() === "") return;
      if (window.innerWidth > 1080) {
        if (document.querySelector("#divpop") !== null) {
          if (document.querySelector("#divpop").style.visibility === "visible") {
            return false;
          } else if (SalesforceInteractions.cashDom("#evg-new-template-c8").length > 0 && document.querySelector("#divpop").style.visibility === "hidden") {
            return false;
          } else if (SalesforceInteractions.cashDom("#evg-new-template-c8").length <= 0 && document.querySelector("#divpop").style.visibility === "hidden") {
            statusNum = 2;
          };
        } else {
          statusNum = 2;
        }
      } else {
        if (document.querySelector("#evtPop") !== null) {
          if (document.querySelector("#evtPop").style.display === "block") {
            return false;
          } else if (SalesforceInteractions.cashDom("#evg-new-template-c8").length > 0 && document.querySelector("#evtPop").style.display === "none") {
            return false;
          } else if (SalesforceInteractions.cashDom("#evg-new-template-c8").length <= 0 && document.querySelector("#evtPop").style.display === "none") {
            statusNum = 2;
          }
        } else {
          statusNum = 2;
        }
      }
      if (statusNum === 0) return;
      return true;
    }

    function fnInsert(context, template) {
      const htmlArr = template(context).split("</br>");
      const device = window.innerWidth > 1080 ? "PC" : "mobile";
      const deviceIndex = { "PC": 0, "mobile": 1 }[device];
      SalesforceInteractions.cashDom("#header").prepend(htmlArr[deviceIndex]);
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
          });
      } else {
        fetch(`https://www.golfzoncounty.com/member_api/mingreenfeelist?gc_no=${c12GcNum}&chnl=m`)
          .then((res) => res.json())
          .then((data) => {
            const golfZoneApi = data.entitys
            if (context.attributes.attributes.name.value !== null || context.attributes.attributes.name.value !== undefined) {
              SalesforceInteractions.cashDom(".text_name").text(context.attributes.attributes.name.value);
            }
            SalesforceInteractions.cashDom(".text_area").text(golfZoneApi[0].golfclub_name);
          });
      }
    }

    function fnStart(context, template) {
      fnInit();
      if (fnInit() === undefined || !fnInit()) return;
      fnInsert(context, template);
      fnPopHide();
      fnApiInner();
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (userGroup !== "Control") {
          fnStart(context, template);
          if (document.querySelector("#evtPop .btn2 button") !== null) {
            const popBtn = document.querySelectorAll("#evtPop .btn1 button, #evtPop .btn2 button");
            popBtn.forEach((btn, idx) => {
              btn.addEventListener("click", (e) => {
                setTimeout(() => {
                  fnStart(context, template);
                }, 400);
              })
            })
          }
          if (document.querySelector(".contents_inner_button_right_btn") !== null) {
            const closeBtn = document.querySelectorAll(".contents_inner_button_right_btn, .contents_inner_button_left_btn");
            closeBtn.forEach((btn, idx) => {
              btn.addEventListener("click", (e) => {
                setTimeout(() => {
                  fnStart(context, template);
                }, 400)
              });
            })
          }
        }
        resolve(true);
      }, 400)
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

