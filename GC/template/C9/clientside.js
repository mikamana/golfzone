(function () {

  function apply(context, template) {
    console.log("test1");
    if (SalesforceInteractions.cashDom("#email").val() === "") return;
    if (SalesforceInteractions.cashDom("#golfzonNo").val() === "") return;
    console.log("test2");
    const htmlArr = template(context).split("</br>");
    const device = window.innerWidth > 1080 ? "PC" : window.innerWidth > 768 ? "Tablet" : "mobile";
    const deviceIndex = { "PC": 0, "Tablet": 1, "mobile": 2 }[device];



    SalesforceInteractions.cashDom("body").append(htmlArr[deviceIndex]);

    setTimeout(() => {

      if (context.attributes.attributes.name.value !== null || context.attributes.attributes.name.value !== undefined) {
        SalesforceInteractions.cashDom(".text_name").text(context.attributes.attributes.name.value);


      }

      const roundAreaNum = context.attributes.attributes.histRoundAreaNum;

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
              SalesforceInteractions.cashDom(".contents_inner_button a")[0].attributes.href.value = apiData[0].reserve_url;
            } else {
              const moUrl = replaceWWWwithM(apiData[0].reserve_url);
              SalesforceInteractions.cashDom(".contents_inner_info_title_middle").text(apiData[0].golfclub_name);
              SalesforceInteractions.cashDom(".contents_inner_button a")[0].attributes.href.value = moUrl;

            }
          })

      }



      if (window.innerWidth > 1080) {
        document.querySelector(".modal_popup").style.display = "block";
        document.querySelector(".modal_popup_bg").style.display = "block";

        document.querySelector(".modal_popup_wrap .contents_inner_info_image_button").addEventListener("click", (e) => {

          document.querySelector(".modal_popup_wrap .modal_popup").style.display = "none";
          document.querySelector(".modal_popup_wrap .modal_popup_bg").style.display = "none";

        });

        document.querySelector(".modal_popup_wrap .contents_inner_info_title_today_btn").addEventListener("click", (e) => {

          document.querySelector(".modal_popup_wrap .modal_popup").style.display = "none";
          document.querySelector(".modal_popup_wrap .modal_popup_bg").style.display = "none";

        });

      } else if (window.innerWidth > 768) {

        document.querySelector(".ta_modal_popup_wrap .modal_popup").style.display = "block";
        document.querySelector(".ta_modal_popup_wrap .modal_popup_bg").style.display = "block";

        document.querySelector(".ta_modal_popup_wrap .contents_inner_info_image_button").addEventListener("click", (e) => {

          document.querySelector(".ta_modal_popup_wrap .modal_popup").style.display = "none";
          document.querySelector(".ta_modal_popup_wrap .modal_popup_bg").style.display = "none";

        });

        document.querySelector(".ta_modal_popup_wrap .contents_inner_info_title_today_btn").addEventListener("click", (e) => {

          document.querySelector(".ta_modal_popup_wrap .modal_popup").style.display = "none";
          document.querySelector(".ta_modal_popup_wrap .modal_popup_bg").style.display = "none";

        });

      }
      else {
        document.querySelector(".mo_modal_popup").style.display = "block";
        document.querySelector(".mo_modal_popup_bg").style.display = "block";

        document.querySelector(".mo_modal_popup_wrap .contents_inner_info_image_button").addEventListener("click", (e) => {

          document.querySelector(".mo_modal_popup_wrap .mo_modal_popup").style.display = "none";
          document.querySelector(".mo_modal_popup_wrap .mo_modal_popup_bg").style.display = "none";

        });

        document.querySelector(".mo_modal_popup_wrap .contents_inner_info_title_today_btn").addEventListener("click", (e) => {

          document.querySelector(".mo_modal_popup_wrap .mo_modal_popup").style.display = "none";
          document.querySelector(".mo_modal_popup_wrap .mo_modal_popup_bg").style.display = "none";

        });
      }



    }, 1000);

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

