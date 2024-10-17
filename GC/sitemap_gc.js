// 테스트 시간
console.log("테스트 시간 24-10-17-09:30");

//접속 국가
const getLocale = () => {
  const localeOrigin = navigator.language;
  const localeConvert = localeOrigin.replace("-", "_");
  if (localeConvert.length === 5) {
    return localeConvert;
  }
};

// refferer
const referrer = document.referrer;

//골프ID 값 가져오기
const getGolfId = () => {

  const gcNumName = document.querySelector(".gnb ul li > *:nth-child(2) > *:first-child > *:nth-child(2) > *:first-child > *:first-child").getAttribute('href');
  const gcNum = gcNumName.split('gc_no=')[1].split('&')[0];
  return gcNum;

}

if (window.innerWidth > 1080) {
  if (SalesforceInteractions.cashDom("#header .util").find(".name").length > 0) {
    const userName = SalesforceInteractions.cashDom("#header .util").find(".name").text();
    sessionStorage.setItem("userName", userName);
  }
} else {

  if (SalesforceInteractions.cashDom("#header .on").find("member").length > 0) {
    const userName = SalesforceInteractions.cashDom("#header .on").find("member").text();
    sessionStorage.setItem("userName", userName);
  }

}




const domain = window.location.hostname;
const allowedDomains = ["www.golfzoncounty.com", "m.golfzoncounty.com", "mv2qa.golfzoncounty.com"];
// const allowedDomains = "mv2qa.golfzoncounty.com";
if (allowedDomains.includes(domain)) {
  SalesforceInteractions.init({
    cookieDomain: domain
  }).then(() => {

    SalesforceInteractions.setLoggingLevel(5);

    //이메일 주소 및 로그인 여부    
    const getInfo = setTimeout(() => {

      const emailEl = SalesforceInteractions.cashDom("input#email");
      const numEl = SalesforceInteractions.cashDom("input#golfzonNo");

      if (numEl.length > 0) {
        if (emailEl.val() === '' && numEl.val() === '') {
          sessionStorage.setItem("log", false);
        } else if (emailEl.val() !== '') {
          sessionStorage.setItem("email", emailEl.val());
          sessionStorage.setItem("log", true);
          sessionStorage.setItem("truechk", "1");
        } else if (emailEl.val() === '' && numEl.val() !== '') {
          sessionStorage.setItem("email", numEl.val() + "golfzon_f.com");
          sessionStorage.setItem("log", true);
          sessionStorage.setItem("truechk", "2");
        }
      }

    }, 1000);

    const sitemapConfig = {
      global: {
        locale: getLocale(),
        onActionEvent: (actionEvent) => {
          actionEvent.user = actionEvent.user || {};
          actionEvent.user.identities = actionEvent.user.identities || {};
          actionEvent.user.attributes = actionEvent.user.attributes || {};
          actionEvent.user.identities.emailAddress = sessionStorage.getItem("email");
          actionEvent.user.attributes.referrerUrl = referrer;
          actionEvent.user.attributes.userName = sessionStorage.getItem("userName");
          // 로그인 여부
          if (sessionStorage.getItem("log") !== null) {
            actionEvent.user.attributes.loginBool = sessionStorage.getItem("log")
          }
          if (sessionStorage.getItem("recentGcNum") !== null) {
            actionEvent.user.attributes.recentGcNum = sessionStorage.getItem("recentGcNum");
          }
          return actionEvent;
        },
        listeners: [
          SalesforceInteractions.listener("click", "#header .util ul li a", (e) => {
            SalesforceInteractions.sendEvent({
              interaction: {
                name: "PC_공통_회원가입 클릭"
              }
            })
          }),
          SalesforceInteractions.listener("click", "#lououtHeader", () => {
            sessionStorage.setItem("log", false);
            SalesforceInteractions.sendEvent({
              interaction: { name: "로그아웃 클릭" },
              user: {
                attributes: {
                  logBool: false
                }
              }
            });
            //   }
          }),
        ],
        contentZones: [
          {
            name: "C9_All_마지막라운드"
          },
          {
            name: "C12_All_예약이탈다음"
          },
          {
            name: "C12_All_예약이탈"
          },
        ]
      },
      pageTypeDefault: {
        name: "default",
        interaction: {
          name: "default",
        },
      },
      pageTypes: [
        {
          // PC_메인 페이지
          name: "PC_메인 방문",
          isMatch: () => {
            if (window.location.href === "https://www.golfzoncounty.com/" || window.location.href === "https://www.golfzoncounty.com/main") {
              return true;
            }
          },
          interaction: {
            name: "PC_메인 방문",
          },
          contentZones: [
            {
              name: "C8_PC_신규가입", selector: ".round_tabA"
            },
            {
              // 푸시형팝업
              name: "C10_PC_쿠폰보유"
            },
          ]
        },
        {
          // PC_예약_티타임선택 페이지
          name: "PC_예약(티타임선택) 방문",
          isMatch: () => {
            if (window.location.href.includes("https://www.golfzoncounty.com/reserve/main")) {
              return true;
            }
          },
          interaction: {
            name: "PC_예약(티타임선택) 방문",
          },
          listeners: [
            SalesforceInteractions.listener("click", ".btn_right > a.btn6", (ele) => {
              SalesforceInteractions.sendEvent({
                interaction: {
                  name: `PC_예약(티타임선택) 예약하기 클릭`,
                },
              })
            }),
            SalesforceInteractions.listener("click", ".dropBox-orange", (ele) => {

              const ulElement = ele.target.closest('[data-gc_no]');
              const gcNoValue = ulElement.getAttribute('data-gc_no');


              sessionStorage.setItem("recentGcNum", gcNoValue);

              SalesforceInteractions.sendEvent({
                interaction: {
                  name: `recentGcNum`,
                },
                user: {
                  attributes: {
                    recentGcNum: sessionStorage.getItem("recentGcNum"),
                  },
                },
              })
            }),
          ],
          contentZones: [
            {
              name: "C11_PC_자주가는 골프장"
            },
            {
              name: "C12_PC_예약페이지이탈_PC시연"
            },
            {
              name: "C12_tsettt"
            }
          ]
        },
        {
          // PC_호시그린
          name: "PC_호시그린 방문",
          isMatch: () => {
            if (window.location.href.includes("https://www.golfzoncounty.com/gcounty/info/otherspc")) {
              return true;
            }
          },
          interaction: {
            name: "PC_호시그린 방문",
          },
        },
        {
          // PC_미션존 페이지 
          name: "PC_미션존 방문",
          isMatch: () => {
            if (window.location.href === "https://www.golfzoncounty.com/myround/mission/main") {
              return true
            }
          },
          interaction: {
            name: "PC_미션존 방문",
          },
        },
        {
          // PC_예약변경 
          name: "PC_예약변경 방문",
          isMatch: () => {
            if (window.location.href.includes("https://www.golfzoncounty.com/reserve/reserveChange")) {
              return true
            }
          },
          interaction: {
            name: "PC_예약변경 방문",
          },
        },
        {
          // PC_쿠폰 페이지
          name: "PC_쿠폰함 방문",
          isMatch: () => {
            if (window.location.href === "https://www.golfzoncounty.com/myround/coupon") {
              return true
            }
          },
          interaction: {
            name: "PC_쿠폰함 방문",
          },
        },
        {
          // PC_골프텔 페이지
          name: "PC_골프텔 방문",
          isMatch: () => {
            if (window.location.href === "https://www.golfzoncounty.com/common/golftel") {
              return true
            }
          },
          interaction: {
            name: "PC_골프텔 방문",
          },
        },
        {
          // PC_이벤트 페이지
          name: "PC_이벤트 방문",
          isMatch: () => new Promise((resolve, reject) => {
            setTimeout(() => {
              return SalesforceInteractions.DisplayUtils.pageElementLoaded("#eventView", "html").then(() => {
                if (document.querySelector("#eventView").style.display === "none") {
                  resolve(true);
                }
              });
            }, 1500);
          }),
          interaction: {
            name: "PC_이벤트 방문",
          },
        },
        {
          // PC_이벤트 상세페이지 페이지
          name: "PC_이벤트 상세페이지 방문",
          isMatch: () => new Promise((resolve, reject) => {
            setTimeout(() => {
              return SalesforceInteractions.DisplayUtils.pageElementLoaded("#eventView", "html").then(() => {
                if (document.querySelector("#eventView").style.display === "block") {
                  resolve(true);
                }
              });
            }, 1500);
          }),
          interaction: {
            name: "PC_이벤트 상세페이지 방문",
          },
        },
        {
          // PC_예약 확인/정보 페이지
          name: "PC_예약 확인/정보 방문",
          isMatch: () => {
            if (window.location.href.includes("https://www.golfzoncounty.com/reserve/reserveConfirm")) {
              return true;
            }
          },
          interaction: {
            name: "PC_예약 확인/정보 방문",
          },
        },
        {
          // PC_예약 완료 페이지
          name: "PC_예약 완료 방문",
          isMatch: () => {
            if (window.location.href.includes("https://www.golfzoncounty.com/reserve/reserveComplete")) {
              return true;
            }
          },
          interaction: {
            name: "PC_예약 완료 방문",
          },
        },
        {
          // PC_코스소개
          name: "PC_코스소개 방문",
          isMatch: () => {
            if (SalesforceInteractions.cashDom("#course_tit").length > 0) {
              return true;
            }
          },
          interaction: {
            name: "PC_코스소개 방문",
          },
        },
        {
          // PC_예약안내
          name: "PC_예약안내 방문",
          isMatch: () => {
            if (window.location.href.includes("https://www.golfzoncounty.com/gcounty/info/reservepc")) {
              return true;
            }
          },
          interaction: {
            name: "PC_예약안내 방문",
          },
        },
        {
          // PC_요금안내
          name: "PC_요금안내 방문",
          isMatch: () => {
            if (window.location.href.includes("feepc")) {
              return true;
            }
          },
          interaction: {
            name: "PC_요금안내 방문",
          },
        },
        {
          // PC_취소 및 예약규정
          name: "PC_취소 및 예약규정 방문",
          isMatch: () => {
            if (window.location.href.includes("cancelpc")) {
              return true;
            }
          },
          interaction: {
            name: "PC_취소 및 예약규정 방문",
          },

        },
        {
          // PC_이용안내
          name: "PC_이용안내 방문",
          isMatch: () => {
            if (window.location.href.includes("usepc")) {
              return true;
            }
          },
          interaction: {
            name: "PC_이용안내 방문",
          },
        },
        {
          // PC_공지사항
          name: "PC_공지사항 방문",
          isMatch: () => {
            if (window.location.href.includes("https://www.golfzoncounty.com/countyBoard/notice")) {
              return true;
            }
          },
          interaction: {
            name: "PC_공지사항 방문",
          },
        },
        {
          // PC_공고사항
          name: "PC_공고사항 방문",
          isMatch: () => {
            if (window.location.href.includes("https://www.golfzoncounty.com/common/enjoy/notice")) {
              return true;
            }
          },
          interaction: {
            name: "PC_공고사항 방문",
          },
        },
        {
          // PC_서비스이용약관
          name: "PC_서비스이용약관 방문",
          isMatch: () => {
            if (window.location.href.includes("https://www.golfzoncounty.com/myround/unified_terms")) {
              return true;
            }
          },
          interaction: {
            name: "PC_서비스이용약관 방문",
          },
        },
        {
          // PC_개인정보처리방침
          name: "PC_개인정보처리방침 방문",
          isMatch: () => {
            if (window.location.href === "https://www.golfzoncounty.com/common/config/customer?cd=private") {
              return true;
            }
          },
          interaction: {
            name: "PC_개인정보처리방침 방문",
          },
        },
        {
          // PC_영상정보처리기기
          name: "PC_영상정보처리기기 방문",
          isMatch: () => {
            if (window.location.href === "https://www.golfzoncounty.com/common/config/customer?cd=video") {
              return true;
            }
          },
          interaction: {
            name: "PC_영상정보처리기기 방문",
          },
        },
        {
          // PC_골프장요약
          name: "PC_골프장요약 방문",
          isMatch: () => {
            if (window.location.href.includes("https://www.golfzoncounty.com/gcounty/info/main")) {
              return true;
            }
          },
          interaction: {
            name: "PC_골프장요약 방문",
            // catalogObject: {
            //   type: "GolfZone",
            //   id: () => {
            //     return getGolfId()
            //   },
            //   attributes: {
            //     name: SalesforceInteractions.resolvers.fromSelector(".container_1200 .golf_top .golf_tit"), //골프장 이름
            //     url: () => {
            //       // const seq = getGolfId();
            //       const url = window.location.href;
            //       return url;
            //     },
            //     imageUrl: () => {
            //       const img = SalesforceInteractions.cashDom(".swiper-container .swiper-wrapper .swiper-slide").find(".cimg")[0];
            //       const backgroundStyle = img.style.background;
            //       // 3. 정규식을 사용하여 URL 추출
            //       const urlMatch = backgroundStyle.match(/url\("(.+?)"\)/);

            //       // 4. URL 값이 존재하면 추출하여 변수에 저장
            //       const imgUrl = urlMatch ? urlMatch[1] : null;
            //       return imgUrl;
            //     },
            //     // rating: () => {
            //     //     return SalesforceInteractions.cashDom(".tour-detail-view .course-info-wrap .review-num-area .star-score").text() //골프장 별점
            //     // },
            //   }
            // },
          },
        },
        {
          // PC_골프장이용약관
          name: "PC_골프장이용약관 방문",
          isMatch: () => {
            if (window.location.href === "https://www.golfzoncounty.com/common/config/customer?cd=golfclub") {
              return true;
            }
          },
          interaction: {
            name: "PC_골프장이용약관 방문",
          },
        },
        {
          // PC_로그인
          name: "PC_로그인 방문",
          isMatch: () => {
            if (window.location.href.includes("https://www.golfzoncounty.com/member/login")) {
              return true;
            }
          },
          interaction: {
            name: "PC_로그인 방문",
          },
          listeners: [
            SalesforceInteractions.listener("click", "form[name='mainForm'] #fnLogin", (e) => {
              //   const email = SalesforceInteractions.cashDom("#dwfrm_mcsubscribe_email").val();
              //   if (email) {
              sessionStorage.setItem("log", true);

              SalesforceInteractions.sendEvent({
                interaction: { name: "로그인" },
                user: {
                  attributes: {
                    logBool: true
                  }
                }
              });
              //   }
            }),
          ]
        },
        {
          // PC_회원가입
          name: "PC_회원가입 방문",
          isMatch: () => {
            if (window.location.href === "https://www.golfzoncounty.com/member/join") {
              return true;
            }
          },
          interaction: {
            name: "PC_회원가입 방문",
          },
        },
        {
          // PC_회사소개
          name: "PC_회사소개 방문",
          isMatch: () => {
            if (window.location.href === "https://www.golfzoncounty.com/common/enjoy") {
              return true;
            }
          },
          interaction: {
            name: "PC_회사소개 방문",
          },
        },
        {
          // PC_고객센터
          name: "PC_고객센터 방문",
          isMatch: () => {
            if (window.location.href.includes("https://www.golfzoncounty.com/common/config/customer?cd=cs")) {
              return true;
            }
          },
          interaction: {
            name: "PC_고객센터 방문",
          },
        },
        {
          // PC_내 프로필
          name: "PC_내 프로필 방문",
          isMatch: () => {
            if (window.location.href.includes("https://www.golfzoncounty.com/myround/profile")) {
              return true;
            }
          },
          interaction: {
            name: "PC_내 프로필 방문",
          },
          listeners: [
            SalesforceInteractions.listener("click", ".myProfile .profile_top ul li.mission a", (ele) => {
              SalesforceInteractions.sendEvent({
                interaction: {
                  name: `PC_내프로필_미션 클릭`,
                },
              })
            }),
            SalesforceInteractions.listener("click", ".myProfile .profile_top ul li.coupon a", (ele) => {
              SalesforceInteractions.sendEvent({
                interaction: {
                  name: `PC_내프로필_쿠폰 클릭`,
                },
              })
            }),
            SalesforceInteractions.listener("click", ".myProfile .profile_top ul li.mileage a", (ele) => {
              SalesforceInteractions.sendEvent({
                interaction: {
                  name: `PC_내프로필_마일리지 클릭`,
                },
              })
            }),
          ],
        },
        {
          // PC_예약 내역
          name: "PC_예약 내역 방문",
          isMatch: () => {
            if (window.location.href.includes("https://www.golfzoncounty.com/reserve/info/booking")) {
              return true;
            }
          },
          interaction: {
            name: "PC_예약 내역 방문",
          },
        },
        {
          // PC_마일리지
          name: "PC_마일리지 방문",
          isMatch: () => {
            if (window.location.href === "https://www.golfzoncounty.com/myround/mileage") {
              return true;
            }
          },
          interaction: {
            name: "PC_마일리지 방문",
          },
        },
        {
          // PC_마이라운드
          name: "PC_마이라운드 방문",
          isMatch: () => {
            if (window.location.href.includes("https://www.golfzoncounty.com/myround/")) {
              return true;
            }
          },
          interaction: {
            name: "PC_마이라운드 방문",
          },
        },
        {
          // PC_회원혜택
          name: "PC_회원혜택 방문",
          isMatch: () => {
            if (window.location.href.includes("https://www.golfzoncounty.com/common/benefits")) {
              return true;
            }
          },
          interaction: {
            name: "PC_회원혜택 방문",
          },
        },
        {
          // PC_스윙영상
          name: "PC_스윙영상 방문",
          isMatch: () => {
            if (window.location.href === "https://www.golfzoncounty.com/myround/swing") {
              return true;
            }
          },
          interaction: {
            name: "PC_스윙영상 방문",
          },
        },
        {
          // PC_인증서
          name: "PC_인증서 방문",
          isMatch: () => {
            if (window.location.href === "https://www.golfzoncounty.com/myround/certification") {
              return true;
            }
          },
          interaction: {
            name: "PC_인증서 방문",
          },
        },
        {
          // PC_필드기록
          name: "PC_필드기록 방문",
          isMatch: () => {
            if (window.location.href === "https://www.golfzoncounty.com/myround/fieldhistory") {
              return true;
            }
          },
          interaction: {
            name: "PC_필드기록 방문",
          },
        },
        {
          // MO_필드기록
          name: "MO_필드기록 방문",
          isMatch: () => {
            if (window.location.href === "https://m.golfzoncounty.com/myround/fieldhistory") {
              return true;
            }
          },
          interaction: {
            name: "MO_필드기록 방문",
          },
        },
        {
          // MO_동반자등록 방문
          name: "MO_동반자등록 방문",
          isMatch: () => {
            if (window.location.href.includes("https://m.golfzoncounty.com/Share")) {
              return true;
            }
          },
          interaction: {
            name: "MO_동반자등록 방문",
          },
        },
        {
          // MO_약간동의
          name: "MO_약관동의 방문",
          isMatch: () => {
            if (window.location.href.includes("https://m.golfzoncounty.com/myround/unified_terms")) {
              return true;
            }
          },
          interaction: {
            name: "MO_약관동의 방문",
          },
        },
        {
          // MO_고객만족도 평가
          name: "MO_고객만족도 평가 방문",
          isMatch: () => {
            if (window.location.href.includes("https://m.golfzoncounty.com/survey")) {
              return true;
            }
          },
          interaction: {
            name: "MO_고객만족도 평가 방문",
          },
        },
        {
          // MO_스코어카드
          name: "MO_스코어카드 방문",
          isMatch: () => {
            if (window.location.href.includes("https://m.golfzoncounty.com/scoreCard")) {
              return true;
            }
          },
          interaction: {
            name: "MO_스코어카드 방문",
          },
        },
        {
          // MO_공지사항
          name: "MO_공지사항 방문",
          isMatch: () => {
            if (window.location.href.includes("https://m.golfzoncounty.com/countyBoard/notice")) {
              return true;
            }
          },
          interaction: {
            name: "MO_공지사항 방문",
          },
        },
        {
          // MO_미션_NOW
          name: "MO_미션_NOW 방문",
          isMatch: () => {
            if (window.location.href.includes("https://m.golfzoncounty.com/myround/mission/now")) {
              return true;
            }
          },
          interaction: {
            name: "MO_미션_NOW 방문",
          },
        },
        {
          // MO_골프장 공지사항
          name: "MO_골프장 공지사항 방문",
          isMatch: () => {
            if (window.location.href.includes("https://m.golfzoncounty.com/gcounty/info/notice")) {
              return true;
            }
          },
          interaction: {
            name: "MO_골프장 공지사항 방문",
          },
        },
        {
          // MO_인증서
          name: "MO_인증서 방문",
          isMatch: () => {
            if (window.location.href === "https://m.golfzoncounty.com/myround/certification") {
              return true;
            }
          },
          interaction: {
            name: "MO_인증서 방문",
          },
        },
        {
          // MO_스윙영상
          name: "MO_스윙영상 방문",
          isMatch: () => {
            if (window.location.href === "https://m.golfzoncounty.com/myround/swing") {
              return true;
            }
          },
          interaction: {
            name: "MO_스윙영상 방문",
          },
        },
        {
          // MO_마이라운드
          name: "MO_마이라운드 방문",
          isMatch: () => {
            if (window.location.href.includes("https://m.golfzoncounty.com/myround/main")) {
              return true;
            }
          },
          interaction: {
            name: "MO_마이라운드 방문",
          },
        },
        {
          // MO_마일리지
          name: "MO_마일리지 방문",
          isMatch: () => {
            if (window.location.href === "https://m.golfzoncounty.com/myround/mileage") {
              return true;
            }
          },
          interaction: {
            name: "MO_마일리지 방문",
          },
        },
        {
          // MO_예약 내역
          name: "MO_예약 내역 방문",
          isMatch: () => {
            if (window.location.href.includes("https://m.golfzoncounty.com/reserve/info/booking")) {
              return true;
            }
          },
          interaction: {
            name: "MO_예약 내역 방문",
          },
        },
        {
          // MO_예약 안내
          name: "MO_예약 안내 방문",
          isMatch: () => {
            if (window.location.href.includes("https://m.golfzoncounty.com/gcounty/info/reserve")) {
              return true;
            }
          },
          interaction: {
            name: "MO_예약 안내 방문",
          },
        },
        {
          // MO_회원혜택
          name: "MO_회원혜택 방문",
          isMatch: () => {
            if (window.location.href.includes("https://m.golfzoncounty.com/common/benefits")) {
              return true;
            }
          },
          interaction: {
            name: "MO_회원혜택 방문",
          },
        },
        {
          // MO_내 프로필
          name: "MO_내 프로필 방문",
          isMatch: () => {
            if (window.location.href === "https://m.golfzoncounty.com/myround/profile") {
              return true;
            }
          },
          interaction: {
            name: "MO_내 프로필 방문",
          },
        },
        {
          // MO_고객센터
          name: "MO_고객센터 방문",
          isMatch: () => {
            if (window.location.href === "https://m.golfzoncounty.com/common/config/customer?cd=cs") {
              return true;
            }
          },
          interaction: {
            name: "MO_고객센터 방문",
          },
        },
        {
          // MO_로그인
          name: "MO_로그인 방문",
          isMatch: () => {
            if (window.location.href.includes("https://m.golfzoncounty.com/member/login") || window.location.href.includes("https://m.golfzoncounty.com/#/login")) {
              return true;
            }
          },
          interaction: {
            name: "MO_로그인 방문",
          },
          listeners: [
            SalesforceInteractions.listener("click", "form[name='mainForm'] button.login", () => {

              sessionStorage.setItem("log", true);

              SalesforceInteractions.sendEvent({
                interaction: { name: "MO_로그인 클릭" },
                user: {
                  attributes: {
                    logBool: true
                  }
                }
              });
            })
          ]
        },
        {
          // MO_본인인증
          name: "MO_본인인증 방문",
          isMatch: () => {
            if (window.location.href.includes("https://m.golfzoncounty.com/myround/auth")) {
              return true;
            }
          },
          interaction: {
            name: "MO_본인인증 방문",
          },
        },
        {
          // MO_골프장이용약관
          name: "MO_골프장 시설 이용약관 방문",
          isMatch: () => {
            if (window.location.href === "https://m.golfzoncounty.com/common/config/customer?cd=use" && SalesforceInteractions.cashDom(".top h2").text() === "골프장 시설 이용약관") {
              return true;
            }
          },
          interaction: {
            name: "MO_골프장 시설 이용약관 방문",
          },
        },
        {
          // MO_영상정보처리기기
          name: "MO_영상정보처리기기 방문",
          isMatch: () => {
            if (window.location.href === "https://m.golfzoncounty.com/common/config/customer?cd=use" && SalesforceInteractions.cashDom(".top h2").text() === "영상정보처리기기 운영·관리방침") {
              return true;
            }
          },
          interaction: {
            name: "MO_영상정보처리기기 방문",
          },
        },
        {
          // MO_개인정보처리방침
          name: "MO_개인정보처리방침 방문",
          isMatch: () => {
            if (window.location.href === "https://m.golfzoncounty.com/common/config/customer?cd=private" && SalesforceInteractions.cashDom(".top h2").text() === "개인정보처리방침") {
              return true;
            }
          },
          interaction: {
            name: "MO_개인정보처리방침 방문",
          },
        },
        {
          // MO_서비스 이용약관
          name: "MO_서비스 이용약관 방문",
          isMatch: () => {
            if (window.location.href === "https://m.golfzoncounty.com/common/config/customer?cd=use" && SalesforceInteractions.cashDom(".top h2").text() === "서비스 이용 약관") {
              return true;
            }
          },
          interaction: {
            name: "MO_서비스이용약관 방문",
          },
        },
        {
          // MO_공지사항
          name: "MO_공지사항 방문",
          isMatch: () => {
            if (window.location.href === "https://m.golfzoncounty.com/countyBoard/notice") {
              return true;
            }
          },
          interaction: {
            name: "MO_공지사항 방문",
          },
        },
        {
          // MO_회원혜택
          name: "MO_회원혜택 방문",
          isMatch: () => {
            if (window.location.href === "https://m.golfzoncounty.com/common/benefits") {
              return true;
            }
          },
          interaction: {
            name: "MO_회원혜택 방문",
          },
        },
        {
          // MO_이용안내
          name: "MO_이용안내 방문",
          isMatch: () => {
            if (window.location.href.includes("https://m.golfzoncounty.com/gcounty/info/use")) {
              return true;
            }
          },
          interaction: {
            name: "MO_이용안내 방문",
          },
        },
        {
          // MO_취소 및 예약규정
          name: "MO_취소 및 예약규정 방문",
          isMatch: () => {
            if (window.location.href.includes("cancel")) {
              return true;
            }
          },
          interaction: {
            name: "MO_취소 및 예약규정 방문",
          },
        },
        {
          // MO_요금안내
          name: "MO_요금안내 방문",
          isMatch: () => {
            if (window.location.href.includes("fee")) {
              return true;
            }
          },
          interaction: {
            name: "MO_요금안내 방문",
          },
        },
        {
          // MO_메인 페이지
          name: "MO_메인 방문",
          isMatch: () => {
            if (window.location.href === "http://m.golfzoncounty.com/" || window.location.href === "https://m.golfzoncounty.com/" || window.location.href.includes("https://m.golfzoncounty.com/main") || window.location.href === "https://mv2qa.golfzoncounty.com/" || window.location.href === "http://mv2qa.golfzoncounty.com/") {
              return true;
            }
          },
          // isMatch: () => {
          //     if (window.location.href === "http://m.golfzoncounty.com/" || window.location.href === "https://m.golfzoncounty.com/" || window.location.href.includes("https://m.golfzoncounty.com/main") || window.location.href === "https://mv2qa.golfzoncounty.com/" || window.location.href === "https://mv2qa.golfzoncounty.com/") {
          //         return true;
          //     }
          // },
          interaction: {
            name: "MO_메인 방문",
          },
          listeners: [
            SalesforceInteractions.listener("click", ".home #content .btnContainer .btn2 button", (ele) => {
              SalesforceInteractions.sendEvent({
                interaction: {
                  name: `MO_메인_회원가입 클릭`,
                },
              })
            }),
            SalesforceInteractions.listener("click", ".home #content .quickMenu a", (e) => {
              console.log(e.currentTarget);
              console.log(e.currentTarget.href);
              const targetElHref = e.currentTarget.href;

              if (targetElHref === "https://m.golfzoncounty.com/reserve/main") {
                SalesforceInteractions.sendEvent({
                  interaction: {
                    name: `MO_메인_예약 클릭`,
                  },
                })
              } else if (targetElHref === "https://m.golfzoncounty.com/myround/mission/main") {
                SalesforceInteractions.sendEvent({
                  interaction: {
                    name: `MO_메인_미션 클릭`,
                  },
                })
              } else if (targetElHref === "https://m.golfzoncounty.com/myround/coupon") {
                SalesforceInteractions.sendEvent({
                  interaction: {
                    name: `MO_메인_쿠폰 클릭`,
                  },
                })
              } else if (targetElHref === "https://m.golfzoncounty.com/myround/main") {
                SalesforceInteractions.sendEvent({
                  interaction: {
                    name: `MO_메인_마이라운드 클릭`,

                  },
                })
              } else if (targetElHref === "https://m.golfzoncounty.com/gcounty/list") {
                SalesforceInteractions.sendEvent({
                  interaction: {
                    name: `MO_메인_골프장 클릭`,
                  },
                })
              }
            }),
          ],
          contentZones: [
            {
              name: "C8_MO_신규가입", selector: ".member"
            },
            {
              name: "C10_MO_쿠폰보유", selector: ".member #header"
            }
          ],
        },
        {
          // MO_예약안내
          name: "MO_예약안내 방문",
          isMatch: () => {
            if (SalesforceInteractions.cashDom("#top h2").text() === "예약안내") {
              return true;
            }
          },
          interaction: {
            name: "MO_예약안내 방문",
          },
        },
        {
          // MO_모바일 설정 페이지
          name: "MO_모바일 설정 방문",
          isMatch: () => {
            if (window.location.href === "https://m.golfzoncounty.com/common/config/all") {
              return true;
            }
          },
          interaction: {
            name: "MO_모바일 설정 방문",
          },
          listeners: [
            SalesforceInteractions.listener("click", ".btnContainer button", (el) => {
              sessionStorage.setItem("log", false);

              console.log(el.target);

              SalesforceInteractions.sendEvent({
                interaction: { name: "MO_로그아웃 클릭" },
                user: {
                  attributes: {
                    logBool: false
                  }
                }
              });
            }),
          ]
        },
        {
          // MO_예약(티타임선택) 페이지
          name: "MO_예약(티타임선택) 방문",
          isMatch: () => {
            if (window.location.href.includes("https://m.golfzoncounty.com/reserve/main")) {
              return true;
            }
          },
          interaction: {
            name: "MO_예약(티타임선택) 방문",
          },
          listeners: [
            SalesforceInteractions.listener("click", "#selectReserve button", (ele) => {
              SalesforceInteractions.sendEvent({
                interaction: {
                  name: `MO_예약(티타임선택)_예약하기 모바일 클릭`,
                },
              })
            }),
          ],
          contentZones: [
            {
              name: "C11_MO_자주가는 골프장"
            },
            {
              name: "C12_PC_예약페이지이탈_MO시연"
            },
            {
              name: "C12_tsetttmo"
            }
          ]
        },
        {
          // MO_예약 완료 페이지
          name: "MO_예약 완료 방문",
          isMatch: () => {
            if (SalesforceInteractions.cashDom(".reserveComplete").length > 0) {
              return true;
            }
          },
          interaction: {
            name: "MO_예약 완료 방문",
          },
        },
        {
          // MO_이벤트 페이지
          name: "MO_이벤트 방문",
          isMatch: () => {
            if (window.location.href.includes("https://m.golfzoncounty.com/countyBoard/event")) {
              return true;
            }
          },
          interaction: {
            name: "MO_이벤트 방문",
          },
        },
        {
          // MO_예약 확인/정보 페이지
          name: "MO_예약 확인/정보 방문",
          isMatch: () => {
            if (window.location.href.includes("https://m.golfzoncounty.com/reserve/main") && SalesforceInteractions.cashDom("#reserveConfirm .btnContainer .btn2 button").text() === "예약완료") {
              return true;
            }
          },
          interaction: {
            name: "MO_예약 확인/정보 방문",
          },
        },
        {
          // MO_골프텔 페이지
          name: "MO_골프텔 방문",
          isMatch: () => {
            if (window.location.href.includes("https://m.golfzoncounty.com/common/golftel")) {
              return true
            }
          },
          interaction: {
            name: "MO_골프텔 방문",
          },
        },

        {
          // MO_미션_단골손님
          name: "MO_미션_단골손님 방문",
          isMatch: () => {
            if (window.location.href === "https://m.golfzoncounty.com/myround/mission/main?o=regular") {
              return true;
            }
          },
          interaction: {
            name: "MO_미션_단골손님 방문",
          },
        },
        {
          // MO_미션존 페이지 
          name: "MO_미션존 방문",
          isMatch: () => {
            if (window.location.href === "https://m.golfzoncounty.com/myround/mission/main") {
              return true
            }
          },
          interaction: {
            name: "MO_미션존 방문",
          },
        },
        {
          // MO_쿠폰 페이지
          name: "MO_쿠폰함 방문",
          isMatch: () => {
            if (window.location.href === "https://m.golfzoncounty.com/myround/coupon") {
              return true
            }
          },
          interaction: {
            name: "MO_쿠폰함 방문",
          },
        },
        {
          // MO_골프장 목록
          name: "MO_골프장 목록 방문",
          isMatch: () => {
            if (window.location.href === "https://m.golfzoncounty.com/gcounty/list") {
              return true;
            }
          },
          interaction: {
            name: "MO_골프장 목록 방문",
          },
        },
        {
          // MO_골프장 요약
          name: "MO_골프장 요약 방문",
          isMatch: () => {
            if (window.location.href.includes("https://m.golfzoncounty.com/gcounty/info/main")) {
              return true;
            }
          },
          interaction: {
            name: "MO_골프장 요약 방문",
          },
        },
        {
          // MO_호시그린
          name: "MO_호시그린 방문",
          isMatch: () => {
            if (window.location.href.includes("https://m.golfzoncounty.com/gcounty/info/others")) {
              return true;
            }
          },
          interaction: {
            name: "MO_호시그린 방문",
          },
        },
        {
          // MO_코스소개
          name: "MO_코스소개 방문",
          isMatch: () => {
            if (window.location.href.includes("course")) {
              return true;
            }
          },
          interaction: {
            name: "MO_코스소개 방문",
          },
        },
      ]
    };

    //SPA 페이지, 변화 감지
    const handleSPAPageChange = () => {
      let url = window.location.href;
      const urlChangeInterval = setInterval(() => {
        if (url !== window.location.href) {
          url = window.location.href;
          SalesforceInteractions.reinit();
        }
      }, 1500);
      console.log(url);
    }

    handleSPAPageChange();

    const fnEventPageChange = (e) => {

      // 감시할 대상 요소
      if (window.location.href === "https://www.golfzoncounty.com/countyBoard/event" || window.location.href === "https://m.golfzoncounty.com/countyBoard/event") {

        const targetNode = document.querySelector('#eventView');
        // 옵저버 설정: attributes와 attributeFilter 옵션을 설정하여 특정 속성만 감지
        const config = { attributes: true, attributeFilter: ['class', 'style'], attributeOldValue: true };
        // MutationObserver 생성
        const observer = new MutationObserver((mutationsList, observer) => {
          // 감지된 모든 변화를 순회하며 처리
          for (const mutation of mutationsList) {
            if (mutation.type === 'attributes') {
              // 변경된 속성 이름과 대상 요소 출력

              // 속성 값이 변경되었는지 확인하고 출력
              const oldValue = mutation.oldValue;  // 이전 속성 값 (옵션에서 oldValue 설정이 필요)
              const newValue = mutation.target.getAttribute(mutation.attributeName);  // 현재 속성 값
              console.log(`Old value: ${oldValue}, New value: ${newValue}`);
              SalesforceInteractions.reinit();
            }
          }
        });

        // 감시 시작
        observer.observe(targetNode, config);

      }


    }

    setTimeout(() => {

      fnEventPageChange();

    }, 1000)




    SalesforceInteractions.initSitemap(sitemapConfig);

  });
}