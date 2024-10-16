(function () {

  function apply(context, template) {

    const { userGroup, triggerOptions, triggerOptionsNumber } = context || {};
    let statusNumC10 = 0;

    function fnInitC10() {
      if (SalesforceInteractions.cashDom("#email").val() === "") return;
      if (SalesforceInteractions.cashDom("#golfzonNo").val() === "") return;
      if (SalesforceInteractions.cashDom('#evg-new-template-c12').length > 0) return;
      if (window.innerWidth > 1080) {
        if (document.querySelector("#divpop") !== null) {
          if (document.querySelector("#divpop").style.visibility === "visible") {
            return false;
          } else if (SalesforceInteractions.cashDom("#evg-new-template-c8").length > 0 && document.querySelector("#divpop").style.visibility === "hidden") {
            return false;
          } else if (SalesforceInteractions.cashDom("#evg-new-template-c8").length <= 0 && document.querySelector("#divpop").style.visibility === "hidden") {
            statusNumC10 = 2;
          };
        } else {
          statusNumC10 = 2;
        }
      } else {
        if (document.querySelector("#evtPop") !== null) {
          if (document.querySelector("#evtPop").style.display === "block") {
            return false;
          } else if (SalesforceInteractions.cashDom("#evg-new-template-c8").length > 0 && document.querySelector("#evtPop").style.display === "none") {
            return false;
          } else if (SalesforceInteractions.cashDom("#evg-new-template-c8").length <= 0 && document.querySelector("#evtPop").style.display === "none") {
            statusNumC10 = 2;
          }
        } else {
          statusNumC10 = 2;
        }
      }




      if (statusNumC10 === 0) return;
      return true;
    }

    function fnInsertC10(context, template) {
      const htmlArr = template(context).split("</br>");
      const device = window.innerWidth > 1080 ? "PC" : "mobile";
      const deviceIndex = { "PC": 0, "mobile": 1 }[device];
      SalesforceInteractions.cashDom("#header").prepend(htmlArr[deviceIndex]);
    }

    function fnApiInnerC10() {
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

    function fnStartC10(context, template) {
      fnInitC10();
      if (fnInitC10() === undefined || !fnInitC10()) return;
      fnInsertC10(context, template);
      fnApiInnerC10();
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (userGroup !== "Control") {
          fnStartC10(context, template);
          if (document.querySelector("#evtPop .btn2 button") !== null) {
            const popBtn = document.querySelectorAll("#evtPop .btn1 button, #evtPop .btn2 button");
            popBtn.forEach((btn, idx) => {
              btn.addEventListener("click", (e) => {
                setTimeout(() => {
                  fnStartC10(context, template);
                }, 400);
              })
            })
          }
          if (document.querySelector(".contents_inner_button_right_btn") !== null) {
            const closeBtnC10 = document.querySelectorAll(".contents_inner_button_right_btn, .contents_inner_button_left_btn");
            closeBtnC10.forEach((btn, idx) => {
              btn.addEventListener("click", (e) => {
                statusNumC10 = 1;
                setTimeout(() => {
                  fnStartC10(context, template);
                }, 500)
              });
            })
          }
          /* let segID;
          context.attributes.segmentMembership.forEach((item, index) => {
              const segId = item.segmentId; //segid
              console.log(segId);
              if(segId == "nmIwY") segID = segId;
          })
              if(segID == "nmIwY") return; */
        }
        resolve(true);
      }, 500);
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

