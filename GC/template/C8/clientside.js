(function () {

  function apply(context, template) {

    const { userGroup, triggerOptions, triggerOptionsNumber } = context || {};

    const htmlArr = template(context).split("</br>");
    const device = window.innerWidth > 1220 ? "PC" : window.innerWidth >= 768 ? "Tablet" : "Mobile";
    const deviceIndex = { "PC": 0, "Tablet": 1, "Mobile": 2 }[device];

    function fnInitC8() {
      if (SalesforceInteractions.cashDom("#email").val() === "") return;
      if (SalesforceInteractions.cashDom("#golfzonNo").val() === "") return;
      return true;
    }

    function fnInsertC8(context, template) {

      if (deviceIndex === 0) {
        SalesforceInteractions.cashDom("body").append(htmlArr[deviceIndex]);
      } else {
        SalesforceInteractions.cashDom("#wrap #content").append(htmlArr[deviceIndex]);
      }
    }

    function fnRemoveC8() {
      const wrap = SalesforceInteractions.cashDom("#evg-new-template-c8");
      const btn = document.querySelectorAll(".contents_inner_button_left_btn, .contents_inner_button_right_btn");
      btn.forEach((node, idx) => {
        node.addEventListener("click", (e) => {
          wrap.remove();
        })
      });
    }

    function fnShowPopUpC8() {
      if (deviceIndex === 0) {
        let stateNum = 0;
        if (document.querySelector("#divpop").style.visibility === "hidden") {
          stateNum = 1;
        }
        document.querySelector("a.close_btn").addEventListener("click", (e) => {
          stateNum = 2;
          if (stateNum !== 0) {
            document.querySelector(".c8_modal_popup_wrap").style.display = "block";
          }
        });
        if (stateNum !== 0) {
          document.querySelector(".c8_modal_popup_wrap").style.display = "block";
        }
      } else if (deviceIndex === 1) {
        let stateNum = 0;
        if (document.querySelector("#evtPop").style.display === "none") {
          stateNum = 1;
        }

        document.querySelector("button.close").addEventListener("click", (e) => {
          stateNum = 2;
          if (stateNum !== 0) {
            document.querySelector(".c8_tab_modal_popup_wrap").style.display = "block";
          }
        });

        document.querySelector("button.today").addEventListener("click", (e) => {
          stateNum = 3;
          if (stateNum !== 0) {
            document.querySelector(".c8_tab_modal_popup_wrap").style.display = "block";
          }
        });

        if (stateNum !== 0) {
          document.querySelector(".c8_tab_modal_popup_wrap").style.display = "block";
        }
      } else if (deviceIndex === 2) {
        let stateNum = 0;
        if (document.querySelector("#evtPop").style.display === "none") {
          stateNum = 1;
        }
        document.querySelector("button.close").addEventListener("click", (e) => {
          stateNum = 2;
          if (stateNum !== 0) {
            document.querySelector(".c8_mo_modal_popup_wrap").style.display = "block";
          }
        });
        document.querySelector("button.today").addEventListener("click", (e) => {
          stateNum = 3;
          if (stateNum !== 0) {
            document.querySelector(".c8_tab_modal_popup_wrap").style.display = "block";
          }
        })
        if (stateNum !== 0) {
          document.querySelector(".c8_mo_modal_popup_wrap").style.display = "block";
        }
      }
    }

    function fnStartC8(context, template) {
      fnInitC8();
      if (fnInitC8() === undefined) return;
      fnInsertC8(context, template);
      fnRemoveC8();
      fnShowPopUpC8();
    }




    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (userGroup !== "Control") {
          fnStartC8();
        }
      }, 100)
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

