(function () {

  function apply(context, template) {

    const htmlArr = template(context).split("</br>");
    const device = window.innerWidth > 1080 ? "PC" : window.innerWidth > 768 ? "Tablet" : "mobile";
    const deviceIndex = { "PC": 0, "Tablet": 1, "mobile": 2 }[device];

    SalesforceInteractions.cashDom("body").append(htmlArr[deviceIndex]);


    setTimeout(() => {

      if (window.innerWidth > 1080) {
        document.querySelector(".modal_popup").style.display = "block";
        document.querySelector(".modal_popup_bg").style.display = "block";

        document.querySelector(".modal_popup .p_close_btn").addEventListener("click", (e) => {

          document.querySelector(".modal_popup").style.display = "none";
          document.querySelector(".modal_popup_bg").style.display = "none";

        })


      } else if (window.innerWidth > 768) {

        document.querySelector(".ta_modal_popup_wrap .modal_popup").style.display = "block";
        document.querySelector(".ta_modal_popup_wrap .modal_popup_bg").style.display = "block";

        document.querySelector(".ta_modal_popup_wrap .modal_popup .p_close_btn").addEventListener("click", (e) => {

          document.querySelector(".ta_modal_popup_wrap .modal_popup").style.display = "none";
          document.querySelector(".ta_modal_popup_wrap .modal_popup_bg").style.display = "none";

        })

      }
      else {
        document.querySelector(".mo_modal_popup").style.display = "block";
        document.querySelector(".mo_modal_popup_bg").style.display = "block";

        document.querySelector(".mo_modal_popup .p_close_btn").addEventListener("click", (e) => {

          document.querySelector(".mo_modal_popup").style.display = "none";
          document.querySelector(".mo_modal_popup_bg").style.display = "none";

        })
      }

      console.log("test1");

    }, 1000);

  }

  function reset(context, template) {

    /** Remove the template from the DOM to reset the template. */
    Evergage.cashDom("#evg-new-template").remove();
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

