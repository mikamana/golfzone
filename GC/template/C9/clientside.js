(function () {
  function apply(context, template) {
    console.log("C9번 시작");

    setTimeout(() => {
      sessionStorage.setItem("c8_landing", false);
      sessionStorage.setItem("c10_landing", false);
      sessionStorage.setItem("c12_landing", false);
    }, 3000);

    const today = new Date();
    const formattedDate = today.getFullYear().toString() +
      String(today.getMonth() + 1).padStart(2, '0') +
      String(today.getDate()).padStart(2, '0');

    // 초기화 함수
    function fnInitC9(context, template) {
      if (window.location.href === "https://www.golfzoncounty.com/" || window.location.href === "https://www.golfzoncounty.com/main" || window.location.href === "https://m.golfzoncounty.com/main" || window.location.href === "https://m.golfzoncounty.com/") return;
      // 로그인 여부
      if (sessionStorage.getItem("log") !== "true") return;
      // 랜딩페이지 체크
      if (sessionStorage.getItem("c10_landing") === "true") return;
      if (sessionStorage.getItem("c8_landing") === "true") return;
      if (sessionStorage.getItem("c12_landing") === "true") return;
      // 이메일 체크
      // if (SalesforceInteractions.cashDom("#email").val() === "") return;
      if (SalesforceInteractions.cashDom("#golfzonNo").val() === "") return;
      // 템플릿 중복 체크
      if (SalesforceInteractions.cashDom("#evg-new-template-c9").length > 0) return;
      // 고객 속성 체크

      //이 시점에 고객 정보를 가져오기 못함
      if (context.attributes.attributes.histRoundAreaNum === undefined || context.attributes.attributes.histRoundAreaNum === null || context.attributes.attributes.histRoundAreaNum.value === "N") return;
      if (context.attributes.attributes.histRoundAreaName === undefined || context.attributes.attributes.histRoundAreaName === null || context.attributes.attributes.histRoundAreaName.value === "N") return;
      if (context.attributes.attributes.histRoundAreaArea === undefined || context.attributes.attributes.histRoundAreaArea === null || context.attributes.attributes.histRoundAreaArea.value === "N") return;
      if (context.attributes.attributes.memberName === undefined || context.attributes.attributes.memberName === null || context.attributes.attributes.memberName.value === "N") return;
      // 피로도 확인 - 쿠키
      // const clickDate = fnGetCookie("clickNowC9");
      // if (clickDate !== undefined) return;
      // 피로도 확인 - 로컬스토리지
      let currentDate = new Date();
      if (currentDate < new Date(localStorage.getItem("c9DayEnd"))) return;
      // 팝업창 체크
      const pcPop = document.querySelector(".evtPop");
      const moPop = document.querySelector("#evtPop");
      if (pcPop && pcPop.style.visibility === "visible") return;
      if (moPop && moPop.style.display === "block") return;
      // 메인 페이지 제외
      // referrer 체크
      const referrerUrl = document.referrer;
      return ["https://www.golfzoncounty.com/", "https://www.golfzoncounty.com/main", "https://m.golfzoncounty.com/main", "https://m.golfzoncounty.com/"].includes(referrerUrl);

    }
    // 삽입 함수
    function fnInsertC9(context, template) {
      const htmlArr = template(context).split("</br>");
      const device = window.innerWidth > 1080 ? "PC" : window.innerWidth > 768 ? "Tablet" : "mobile";
      const deviceIndex = { "PC": 0, "Tablet": 1, "mobile": 2 }[device];
      SalesforceInteractions.cashDom("body").append(htmlArr[deviceIndex]);
      SalesforceInteractions.mcis.sendStat({
        campaignStats: [{
          control: false,
          experienceId: context.experience,
          stat: "Impression"
        }]
      });
    }

    // APi 호출 함수
    async function fnApiInnerC9(context, template) {

      const memberName = context.attributes.attributes.memberName.value;
      const roundAreaArea = parseInt(Number(context.attributes.attributes.histRoundAreaArea.value));
      const roundAreaName = context.attributes.attributes.histRoundAreaName.value;
      const roundAreaNum = parseInt(Number(context.attributes.attributes.histRoundAreaNum.value)) || 4;
      const replaceWWWwithM = (url) => url.includes("www.") ? url.replace("www.", "m.") : (console.warn("URL에 'www.'가 포함되어 있지 않습니다."), url);


      const fnC9ApiResult = await fetch(`https://www.golfzoncounty.com/member_api/mingreenfeelist?gc_no=${roundAreaNum}&chnl=w`)
        .then((res) => res.json())
        .then((data) => {

          if (Object.keys(data).length <= 0) {
            return false;
          } else {
            fnInsertC9(context, template);
            fnRemoveC9(context, template);

            const fnC9SortApiSort = (data) => {
              return data.entitys.sort((a, b) => {
                // 서로의 result_date를 비교하여 오름차순으로 정렬
                return a.reserve_date - b.reserve_date;
              });
            };





            SalesforceInteractions.cashDom(".contents_inner_info_recom .text_name").text(`${memberName}님`);
            if (window.innerWidth > 1080) {
              // DC에서 골프장명 받아야함
              SalesforceInteractions.cashDom(".contents_inner_info_title_middle").text(roundAreaName);
              SalesforceInteractions.cashDom(".contents_inner_button a")[0].attributes.href.value = `${fnC9SortApiSort(data)[0].reserve_url}`;

            } else {
              // DC에서 골프장명 받아야함
              SalesforceInteractions.cashDom(".contents_inner_info_title_middle").text(roundAreaName);
              const unReserveUrl = replaceWWWwithM(`${fnC9SortApiSort(data)[0].reserve_url}`)
              SalesforceInteractions.cashDom(".contents_inner_button a")[0].attributes.href.value = unReserveUrl
            }
          }

        })

      /* const setGolfClubInfo = (apiData) => {

          


          // 골프장을 예약할 수 있는 정보가 없음, 예약할 수 없는 골프장을 제외시킨 후(파악해야함)
          // 1. 다른 골프장을 추천하도록 할 것
          // 2. 추천 자체를 못하도록 할 것
          // 3. DC에서 골프장명 받은 후 태그에 적용
          // 4. 오늘 날짜로 설정 후 url에 적용
          // 5. 골프장번호 url에 적용
          
          if(apiData === undefined){
              if(window.innerWidth > 1080){
                  // DC에서 골프장명 받아야함
                  SalesforceInteractions.cashDom(".contents_inner_info_title_middle").text(roundAreaName);
                  SalesforceInteractions.cashDom(".contents_inner_button a")[0].attributes.href.value = `https://www.golfzoncounty.com/reserve/main?gc_no=${roundAreaNum}&area_code=${roundAreaArea}&select_date=${formattedDate}`;
              }else{
                  // DC에서 골프장명 받아야함
                  SalesforceInteractions.cashDom(".contents_inner_info_title_middle").text(roundAreaName);
                  const unReserveUrl = replaceWWWwithM(`https://www.golfzoncounty.com/reserve/main?gc_no=${roundAreaNum}&area_code=${roundAreaArea}&select_date=${formattedDate}`)
                  SalesforceInteractions.cashDom(".contents_inner_button a")[0].attributes.href.value = unReserveUrl
              }
          }else{
              const golfclubName = apiData[0].golfclub_name;
              const reserveUrl = window.innerWidth > 1080 ? apiData[0].reserve_url : replaceWWWwithM(apiData[0].reserve_url);

              SalesforceInteractions.cashDom(".contents_inner_info_title_middle").text(golfclubName);
              SalesforceInteractions.cashDom(".contents_inner_button a")[0].attributes.href.value = reserveUrl;
          }
          
      };  */

      /* setTimeout(() => {
          fetch(`https://www.golfzoncounty.com/member_api/mingreenfeelist?gc_no=${roundAreaNum}&chnl=w`)
              .then((res) => res.json())
              .then((data) => setGolfClubInfo(data.entitys));
      }, 50); */


    }

    // 쿠키 가져오기
    function fnGetCookie(name) {
      let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    // 닫기, 오늘 하루 보지 않기 함수
    function fnRemoveC9(context, template) {
      const isDesktop = window.innerWidth > 1080;
      const isTablet = window.innerWidth > 768 && window.innerWidth <= 1080;

      const modalSelector = isDesktop ? ".modal_popup_wrap" :
        isTablet ? ".ta_modal_popup_wrap" : ".mo_modal_popup_wrap";

      const modalPopup = document.querySelector(`${modalSelector} .modal_popup`);
      const modalPopupBg = document.querySelector(`${modalSelector} .modal_popup_bg`);
      const imageButton = document.querySelector(`${modalSelector} .contents_inner_info_image_button`);
      const todayBtn = document.querySelector(`${modalSelector} .contents_inner_info_title_today_btn`);

      const closeModal = () => {
        modalPopup.style.display = "none";
        modalPopupBg.style.display = "none";
      };

      imageButton.addEventListener("click", closeModal);

      function fnNowDate() {

        //피로도 설정
        let saveDate = new Date();
        let endDate = new Date(saveDate.getFullYear(), saveDate.getMonth(), saveDate.getDate(), 23, 59, 59);
        localStorage.setItem("c9DayEnd", endDate);
        // SalesforceInteractions.sendEvent({
        //     interaction: {
        //         name: "C8. 예약 고객 대상 홀인원 보험 가입 홍보"
        //     }
        // })

        // 들어온 날짜 구하기
        const now = new Date();
        // 쿠키 저장
        const nextDay = new Date(now);
        nextDay.setHours(24, 0, 0, 0); // 다음 날 00:00으로 설정

        // 클릭한 시간 저장 & 클릭한 다음 날까지 유효기간
        document.cookie = `clickNowC9=${now}; expires=${nextDay}`;

      }

      todayBtn.addEventListener("click", () => {

        fnNowDate()
        closeModal();
      });
    }

    // 전체 함수
    function fnStartC9(context, template) {
      fnSetCloseC9(context, template);
      const initC9Result = fnInitC9(context, template); // 결과를 변수에 저장
      setTimeout(() => {
        if (initC9Result === undefined || initC9Result === false) return; // 저장한 결과로 조건 검사
        fnApiInnerC9(context, template);
      }, 50)

    }

    // 팝업창 체크 시 실행 함수
    function fnSetCloseC9(context, template) {
      const pcPop = document.querySelector(".evtPop");
      const moPop = document.querySelector("#evtPop");
      const closeBtnName = window.innerWidth > 1080 ? "a.close_btn" : "button.close";
      if (pcPop !== null || moPop !== null) {
        const closeBtn = document.querySelector(closeBtnName);
        closeBtn.addEventListener("click", (e) => {
          setTimeout(() => {
            fnStartC9(context, template)
          }, 1000);
        })
      }
    }


    return new Promise((resolve, reject) => {
      // window.addEventListener("load", (e) => {
      setTimeout(() => {
        fnStartC9(context, template);
        resolve(true);
      }, 400);
      // })
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

