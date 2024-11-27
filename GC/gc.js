// 테스트 시간
console.log("테스트 시간 24-11-20 16:10");

// refferer
const referrer = document.referrer;

//골프ID 값 가져오기
const getGolfId = () => {

  const url = '/gcounty/info/reservepc/?gc_no=48';
  const fullUrl = new URL(url, 'https://golfzoncounty.com'); // 베이스 URL을 추가하여 전체 URL로 변환
  const params = new URLSearchParams(fullUrl.search);
  const gcNum = params.get('gc_no');
  return gcNum

}

function formatDateString(dateString) {
  // 날짜 문자열에서 연도, 월, 일을 추출
  const regex = /(\d{4})년\s(\d{1,2})월\s(\d{1,2})일/;
  const match = dateString.match(regex);

  if (!match) {
    throw new Error("날짜 형식이 잘못되었습니다.");
  }

  const year = match[1];
  const month = match[2].padStart(2, "0"); // 월을 두 자리로 변환
  const day = match[3].padStart(2, "0");   // 일을 두 자리로 변환

  return `${year}${month}${day}`;
}

//식별 정보 값 가져오기
const getLoginInfo = setTimeout(() => {
  const email = document.querySelector("input#email");
  const memNum = document.querySelector("input#golfzonNo");

  //식별 코드 존재 확인
  if (email !== null && memNum !== null) {
    const fakeEmail = `${memNum.value}@golfzon_f.com`
    //이메일 값이 존재할 때
    if (email.value !== "") {
      //세션에 미리 저장된 email이 없을 때
      if (sessionStorage.getItem("email") === null) {
        sessionStorage.setItem("email", email.value);
        sessionStorage.setItem("log", true)
      } else {
        //세션에 미리 저장된 email 값이 존재할 경우, 저장된 email과 현재 로그인 이메일 일치 여부 확인
        if (sessionStorage.getItem("email") !== null && email.value !== sessionStorage.getItem("email")) {
          sessionStorage.setItem("email", email.value);
          sessionStorage.setItem("log", true)
        }
      }
    } else {
      //회원번호 값 존재 여부 확인
      if (memNum.value !== "") {
        //세션에 저장된 이메일 값 확인
        if (sessionStorage.getItem("email") === null) {
          sessionStorage.setItem("email", fakeEmail)
        } else {
          //세션에 저장되 이메일 값이 있지만 조회되는 이메일과 일치하지 않을 경우
          if (sessionStorage.getItem("email") !== null && sessionStorage.getItem("email") !== fakeEmail) {
            sessionStorage.setItem("email", fakeEmail)
          }
        }
        sessionStorage.setItem("log", true)
        //이메일 주소는 존재하지 않고 회원번호만 존재
      } else {
        //정보값 아무것도 없음
        sessionStorage.setItem("log", false)
      }
    }
  }


}, 2000);


const domain = window.location.hostname;
const allowedDomains = ["www.golfzoncounty.com", "m.golfzoncounty.com", "mv2qa.golfzoncounty.com"];
// const allowedDomains = "mv2qa.golfzoncounty.com";
if (allowedDomains.includes(domain)) {
  SalesforceInteractions.init({
    cookieDomain: domain
  }).then(() => {

    SalesforceInteractions.setLoggingLevel(5);

    const sitemapConfig = {
      global: {
        // locale: getLocale(), //지역 정보 수집 X
        onActionEvent: (actionEvent) => {
          actionEvent.user = actionEvent.user || {};
          actionEvent.user.identities = actionEvent.user.identities || {};
          actionEvent.user.attributes = actionEvent.user.attributes || {};

          if (sessionStorage.getItem("email") !== null) {
            actionEvent.user.identities.emailAddress = sessionStorage.getItem("email");
          }

          actionEvent.user.attributes.referrerUrl = referrer;
          // 로그인 여부
          if (sessionStorage.getItem("log") !== null) {
            actionEvent.user.attributes.loginBool = sessionStorage.getItem("log")
          }
          if (sessionStorage.getItem("recentGcNum") !== null) {
            actionEvent.user.attributes.recentGcNum = sessionStorage.getItem("recentGcNum");
          }
          if (sessionStorage.getItem("recentGcDate") !== null) {
            actionEvent.user.attributes.recentGcDate = sessionStorage.getItem("recentGcDate");
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
          }),
        ],
        contentZones: [
          {
            name: "C9_All_마지막라운드"
          },
          {
            name: "C12_All_예약이탈", selector: "body"
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
            SalesforceInteractions.listener("click", ".dropBox-orange ul li", (ele) => {
              const targetEl = ele.target;
              const listItem = SalesforceInteractions.cashDom(targetEl).closest("li");
              const listItems = SalesforceInteractions.cashDom(listItem).parent();
              const gcNoValue = SalesforceInteractions.cashDom(listItems).attr("data-gc_no");
              sessionStorage.setItem("recentGcNum", gcNoValue);

              SalesforceInteractions.sendEvent({
                interaction: {
                  name: `PC_예약(티타임선택) 최근 클릭 골프장 번호`,
                },
                user: {
                  attributes: {
                    recentGcNum: sessionStorage.getItem("recentGcNum"),
                  },
                },
              })
            }),
            SalesforceInteractions.listener("click", ".dBox_wrap ul li", (ele) => {
              const targetEl = ele.target;
              const listItem = SalesforceInteractions.cashDom(targetEl).closest("li");
              const listItems = SalesforceInteractions.cashDom(listItem).parent();
              const gcNoValue = SalesforceInteractions.cashDom(listItems).attr("data-gc_no");
              sessionStorage.setItem("recentGcNum", gcNoValue);

              SalesforceInteractions.sendEvent({
                interaction: {
                  name: `PC_예약(티타임선택) 최근 클릭 골프장 번호`,
                },
                user: {
                  attributes: {
                    recentGcNum: sessionStorage.getItem("recentGcNum"),
                  },
                },
              })
            }),
            SalesforceInteractions.listener("click", ".calendar_type3 ul li", (ele) => {
              const targetEl = ele.target;
              const listItem = SalesforceInteractions.cashDom(targetEl).closest("input");
              const gcDateValue = SalesforceInteractions.cashDom(listItem).attr("data-date");
              sessionStorage.setItem("recentGcDate", gcDateValue);
              SalesforceInteractions.sendEvent({
                interaction: {
                  name: `PC_예약(티타임선택) 최근 클릭 골프장 날짜`,
                },
                user: {
                  attributes: {
                    recentGcDate: sessionStorage.getItem("recentGcDate"),
                  },
                },
              })
            }),
            SalesforceInteractions.listener("click", ".dBox_wrap ul li", (ele) => {
              const targetEl = ele.target;
              const listItem = SalesforceInteractions.cashDom(targetEl).closest("#reserveList");
              const gcName = listItem[0].previousSibling.previousSibling.children[0].innerText;
              sessionStorage.setItem("recentGcName", gcName);

              SalesforceInteractions.sendEvent({
                interaction: {
                  name: `PC_예약(티타임선택) 최근 클릭 골프장명`,
                },
                user: {
                  attributes: {
                    recentGcName: sessionStorage.getItem("recentGcName"),
                  },
                },
              })

            }),
            SalesforceInteractions.listener("click", ".dBox_wrap ul li", (ele) => {
              setTimeout(() => {
                const targetEl = ele.target;
                const listItem = SalesforceInteractions.cashDom(targetEl).closest(".container");
                const gcDateStr = listItem[0].nextSibling.nextElementSibling.children[0].children[0].children[2].innerText;
                const gcDate = formatDateString(gcDateStr);
                sessionStorage.setItem("recentGcDate", gcDate);
                SalesforceInteractions.sendEvent({
                  interaction: {
                    name: `PC_예약(티타임선택) 최근 클릭 골프장 날짜`,
                  },
                  user: {
                    attributes: {
                      recentGcDate: sessionStorage.getItem("recentGcDate"),
                    },
                  },
                })



              }, 500)

            }),
            SalesforceInteractions.listener("click", ".dropBox-orange ul li", (ele) => {
              const targetEl = ele.target;
              const listItem = SalesforceInteractions.cashDom(targetEl).closest("li");
              // const gcName = listItem[0].previousSibling.previousSibling.children[0].children[0].innerText
              const gcName = SalesforceInteractions.cashDom(listItem).attr("data-cc_name");
              sessionStorage.setItem("recentGcName", gcName);

              SalesforceInteractions.sendEvent({
                interaction: {
                  name: `PC_예약(티타임선택) 최근 클릭 골프장명`,
                },
                user: {
                  attributes: {
                    recentGcName: sessionStorage.getItem("recentGcName"),
                  },
                },
              })
            }),
            SalesforceInteractions.listener("click", ".dropBox-orange ul li", (ele) => {
              setTimeout(() => {
                const targetEl = ele.target;
                const listItem = SalesforceInteractions.cashDom(targetEl).closest(".container");
                const gcDateStr = listItem[0].nextSibling.nextElementSibling.children[0].children[0].children[2].innerText
                const gcDate = formatDateString(gcDateStr);
                sessionStorage.setItem("recentGcDate", gcDate);
                SalesforceInteractions.sendEvent({
                  interaction: {
                    name: `PC_예약(티타임선택) 최근 클릭 골프장 날짜`,
                  },
                  user: {
                    attributes: {
                      recentGcDate: sessionStorage.getItem("recentGcDate"),
                    },
                  },
                })
              }, 500)
            }),
          ],
          contentZones: [
            {
              name: "C11_PC_자주가는 골프장"
            },
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
                if (window.location.href.includes("https://www.golfzoncounty.com/countyBoard/event") && document.querySelector("#eventView").style.display !== "none") {
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
          isMatch: () => new Promise((resolve, reject) => {
            setTimeout(() => {
              if (window.location.href.includes("https://www.golfzoncounty.com/reserve/reserveComplete")) {
                resolve(true);
              }
            }, 1000);
          }),
          interaction: {
            // name: SalesforceInteractions.OrderInteractionName.Purchase,
            name: "PC_예약 완료 방문",
            /* order: {
                id: SalesforceInteractions.DisplayUtils.pageElementLoaded("#reserveComplete", "html").then(
                    (ele) => {
                        if (window.location.href.includes("https://www.golfzoncounty.com/reserve/reserveComplete")) {
                            const ccArray = [];
                            SalesforceInteractions.cashDom(".innerWrap .list01").each((index, data) => {
                                const ccFilter = Array.from(data.children).filter(dt => dt.tagName === "P");
                                ccFilter.forEach((dd) => {
                                    const golfResult = {
                                        name: dd.innerText,
                                        num: dd.children[0].getAttribute('data-cc_code')
                                    }
                                    ccArray.push(golfResult);
                                })
                            });
                            const resResult = SalesforceInteractions.cashDom(".tit_info").text();
                            const result = ccArray.filter((d) => {
                                return d.name === resResult;
                            })
                            return result[0].num
                        }

                    },
                ),
                lineItems: () => {
                    let purchaseLineItems = []
                    let lineItem = {
                        catalogObjectType: "Product",
                        catalogObjectId: SalesforceInteractions.cashDom("#timeTableHasBookgInfoId").val().trim(),
                        price: parseInt(SalesforceInteractions.cashDom(".price").text().replace(/,|원/g, ''), 10),
                        quantity: 1,
                    };
                    purchaseLineItems.push(lineItem);
                    return purchaseLineItems;
                },
            }, */
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
          name: "PC_예약 안내 방문",
          isMatch: () => {
            if (window.location.href.includes("https://www.golfzoncounty.com/gcounty/info/reservepc")) {
              return true;
            }
          },
          interaction: {
            name: "PC_예약 안내 방문",
          },
        },
        {
          // PC_요금안내
          name: "PC_요금 안내 방문",
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
          name: "PC_이용 안내 방문",
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
          // isMatch: () => {
          //     if (window.location.href.includes("https://www.golfzoncounty.com/gcounty/info/main")) {
          //         return true;
          //     }
          // },
          isMatch: () => new Promise((resolve, reject) => {
            setTimeout(() => {
              if (window.location.href.includes("https://www.golfzoncounty.com/gcounty/info/main")) {
                resolve(true);
              }
            }, 1000);
          }),
          interaction: {
            name: "PC_골프장요약 방문",
            /* name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
            catalogObject: {
                type: "Product",
                id: () => {
                    return SalesforceInteractions.util.resolveWhenTrue.bind(() => {
                        const urlSearchCode = window.location.search;
                        const params = new URLSearchParams(urlSearchCode);
                        const code = params.get("cc_code");
                        return code;
                    })
                },
                attributes: {
                    // sku: () => {

                    //     const gcNumName = SalesforceInteractions.cashDom(".gnb ul li > *:nth-child(2) > *:first-child > *:nth-child(2) > *:first-child > *:first-child").attr('href');
                    //     const gcNum = gcNumName.split('gc_no=')[1].split('&')[0];
                    //     return gcNum;

                    // },
                    sku: {
                        id: getGolfId()
                    },
                    //   name: SalesforceInteractions.resolvers.fromJsonLd("name"),
                    name: SalesforceInteractions.resolvers.fromSelector(".container_1200 .golf_top .golf_tit"), //골프장 이름
                    description: SalesforceInteractions.resolvers.fromSelector(
                        ".contArea .desc",
                        (desc) => desc.trim(),
                    ),
                    url: () => {
                        let url = window.location.href;
                        url = url.replace("https://www.", "")
                        return url;
                    },
                    imageUrl: () => {
                        const img = SalesforceInteractions.cashDom(".swiper-container .swiper-wrapper .swiper-slide").find(".cimg")[0];
                        const backgroundStyle = img.style.background;
                        // 3. 정규식을 사용하여 URL 추출
                        const urlMatch = backgroundStyle.match(/url\("(.+?)"\)/);

                        // 4. URL 값이 존재하면 추출하여 변수에 저장
                        const imgUrl = urlMatch ? urlMatch[1] : null;
                        return imgUrl;
                    },
                    // rating: () => {
                    //     return SalesforceInteractions.cashDom(".tour-detail-view .course-info-wrap .review-num-area .star-score").text() //골프장 별점
                    // },
                }
            }, */
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
              sessionStorage.setItem("log", true);

              SalesforceInteractions.sendEvent({
                interaction: { name: "로그인 클릭" },
                user: {
                  attributes: {
                    logBool: true
                  }
                }
              });
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
          listeners: [
            SalesforceInteractions.listener("click", "#p-cancle .popup-modal-cancel", (el) => {
              SalesforceInteractions.sendEvent({
                interaction: { name: "PC_예약취소 클릭" },
              });
            }),
          ]
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
          listeners: [
            SalesforceInteractions.listener("click", ".myReserve .cancel", (el) => {
              SalesforceInteractions.sendEvent({
                interaction: { name: "MO_예약취소 클릭" },
              });
            }),
          ]

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
          // MO_예약(티타임선택) 상세 페이지
          name: "MO_예약(티타임선택) 상세 방문",
          isMatch: () => new Promise((resolve, reject) => {
            setTimeout(() => {
              return SalesforceInteractions.DisplayUtils.pageElementLoaded("#reserveComplete", "html").then(() => {
                if (document.querySelector("#reserveComplete").style.display !== "block" && window.location.href.includes("https://m.golfzoncounty.com/reserve/main?gc_no")) {
                  resolve(true);
                }
              });
            }, 1500);
          }),
          interaction: {
            name: "MO_예약(티타임선택) 상세 방문",
          },
          listeners: [
            SalesforceInteractions.listener("click", "#timeList_reserve .reserveList ul li dl dt", (ele) => {
              const targetEl = ele.target;
              const gcNoValue = SalesforceInteractions.cashDom(targetEl).closest("dt").attr("data-gc_no");
              sessionStorage.setItem("recentGcNum", gcNoValue);

              SalesforceInteractions.sendEvent({
                interaction: {
                  name: `MO_최근 예약 골프장 번호`,
                },
                user: {
                  attributes: {
                    recentGcNum: sessionStorage.getItem("recentGcNum"),
                  },
                },
              })
            }),
            SalesforceInteractions.listener("click", "#timeList_reserve .reserveList ul li dl dt", (ele) => {
              const targetEl = ele.target;
              const gcNoValue = SalesforceInteractions.cashDom(targetEl).closest("dt").attr("data-course_name");
              sessionStorage.setItem("recentGcName", gcNoValue);

              SalesforceInteractions.sendEvent({
                interaction: {
                  name: `MO_최근 예약 골프장명`,
                },
                user: {
                  attributes: {
                    recentGcName: sessionStorage.getItem("recentGcName"),
                  },
                },
              })
            }),
            SalesforceInteractions.listener("click", "#timeList_reserve .reserveList ul li dl dt", (ele) => {
              function formatDate(dateString) {
                // 날짜 문자열에서 연도, 월, 일을 추출
                const regex = /(\d{4})년\s(\d{1,2})월\s(\d{1,2})일/;
                const match = dateString.match(regex);

                if (!match) {
                  throw new Error("날짜 형식이 잘못되었습니다.");
                }

                const year = match[1]; // 연도
                const month = match[2].padStart(2, "0"); // 월 (두 자리로 변환)
                const day = match[3].padStart(2, "0"); // 일 (두 자리로 변환)

                // "YYYYMMDD" 형식으로 반환
                return `${year}${month}${day}`;
              }
              const targetEl = ele.target;
              const gcNoValue = SalesforceInteractions.cashDom(targetEl).closest("dt").attr("data-tee_date");
              const gcDateResult = formatDate(gcNoValue);
              sessionStorage.setItem("recentGcDate", gcDateResult);


              SalesforceInteractions.sendEvent({
                interaction: {
                  name: `MO_최근 예약 골프장 날짜`,
                },
                user: {
                  attributes: {
                    recentGcDate: sessionStorage.getItem("recentGcDate"),
                  },
                },
              })
            }),
            SalesforceInteractions.listener("click", "#timeList_reserve .reserveList ul li dl dt", (ele) => {
              const urlParams = new URL(location.href).searchParams;
              const areaCode = urlParams.get('area_code');
              sessionStorage.setItem("recentGcArea", areaCode);

              SalesforceInteractions.sendEvent({
                interaction: {
                  name: `MO_최근 예약 골프장 지역`,
                },
                user: {
                  attributes: {
                    recentGcArea: sessionStorage.getItem("recentGcArea"),
                  },
                },
              })
            }),

          ],
          contentZones: [
            {
              name: "C11_MO_자주가는 골프장"
            },
          ]
        },
        {
          // MO_예약(티타임선택) 페이지
          name: "MO_예약(티타임선택) 방문",
          isMatch: () => new Promise((resolve, reject) => {
            setTimeout(() => {
              return SalesforceInteractions.DisplayUtils.pageElementLoaded("#reserveComplete", "html").then(() => {
                if (document.querySelector("#reserveComplete").style.display !== "block" && window.location.href.includes("https://m.golfzoncounty.com/reserve/main") && (window.location.search !== "" || window.location.search !== null)) {
                  resolve(true);
                }
              });
            }, 1500);
          }),
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
            SalesforceInteractions.listener("click", "#timeList_reserve", (ele) => {
              const targetEl = ele.target;
              const gcNoValue = SalesforceInteractions.cashDom(targetEl).closest("dl").attr("data-gc_no");
              sessionStorage.setItem("recentGcNum", gcNoValue);

              SalesforceInteractions.sendEvent({
                interaction: {
                  name: `MO_최근 예약 골프장 번호`,
                },
                user: {
                  attributes: {
                    recentGcNum: sessionStorage.getItem("recentGcNum"),
                  },
                },
              })
            }),
            SalesforceInteractions.listener("click", "#timeList_reserve", (ele) => {
              const targetEl = ele.target;
              const gcNoValue = SalesforceInteractions.cashDom(targetEl).closest("dl").attr("data-work_date");
              sessionStorage.setItem("recentGcDate", gcNoValue);

              SalesforceInteractions.sendEvent({
                interaction: {
                  name: `MO_최근 예약 골프장 날짜`,
                },
                user: {
                  attributes: {
                    recentGcDate: sessionStorage.getItem("recentGcNum"),
                  },
                },
              })
            }),
            SalesforceInteractions.listener("click", "#timeList_reserve", (ele) => {

              const targetEl = ele.target;
              const gcNoValue = SalesforceInteractions.cashDom(targetEl).closest("dl").attr("data-cc_name");
              sessionStorage.setItem("recentGcName", gcNoValue);

              SalesforceInteractions.sendEvent({
                interaction: {
                  name: `MO_최근 예약 골프장명`,
                },
                user: {
                  attributes: {
                    recentGcName: sessionStorage.getItem("recentGcName"),
                  },
                },
              })
            }),
            SalesforceInteractions.listener("click", "#timeList_reserve", (ele) => {

              const urlParams = new URL(location.href).searchParams;
              const areaCode = urlParams.get('area_code');
              sessionStorage.setItem("recentGcArea", areaCode);

              SalesforceInteractions.sendEvent({
                interaction: {
                  name: `MO_최근 예약 골프장 지역`,
                },
                user: {
                  attributes: {
                    recentGcArea: sessionStorage.getItem("recentGcArea"),
                  },
                },
              })
            }),
          ],
          contentZones: [
            {
              name: "C11_MO_자주가는 골프장"
            },
          ]
        },
        {
          // MO_예약 완료 페이지
          name: "MO_예약 완료 방문",
          isMatch: () => new Promise((resolve, reject) => {
            setTimeout(() => {
              return SalesforceInteractions.DisplayUtils.pageElementLoaded("#reserveComplete", "html").then(() => {
                if (document.querySelector("#reserveComplete").style.display === "block") {
                  resolve(true);
                }
              });
            }, 1500)
          }),
          interaction: {
            name: "MO_예약 완료 방문",
          },
        },
        {
          // MO_이벤트 페이지
          name: "MO_이벤트 방문",
          isMatch: () => new Promise((resolve, reject) => {
            setTimeout(() => {
              return SalesforceInteractions.DisplayUtils.pageElementLoaded("#eventView", "html").then(() => {
                if (window.location.href.includes("https://m.golfzoncounty.com/countyBoard/event") && document.querySelector("#eventView").style.display === "none") {
                  resolve(true);
                }
              });
            }, 1500);
          }),
          interaction: {
            name: "MO_이벤트 방문",
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
          // MO_골프장요약
          name: "MO_골프장 요약 방문",
          isMatch: () => new Promise((resolve, reject) => {
            setTimeout(() => {
              if (window.location.href.includes("https://m.golfzoncounty.com/gcounty/info/main")) {
                resolve(true);
              }
            }, 1000);
          }),
          interaction: {
            name: "MO_골프장 요약 방문",
            /* name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
            catalogObject: {
                type: "Product",
                id: () => {
                    return SalesforceInteractions.util.resolveWhenTrue.bind(() => {
                        // getGolfId()
                        const urlSearchCode = window.location.search;
                        const params = new URLSearchParams(urlSearchCode);
                        const code = params.get("cc_code");
                        return code;


                    })
                },
                attributes: {
                    //   name: SalesforceInteractions.resolvers.fromJsonLd("name"),
                    name: SalesforceInteractions.resolvers.fromSelector("#wrap #top h2 > a"), //골프장 이름
                    url: () => {
                        let url = window.location.href;
                        url = url.replace("https://m.", "")
                        return url;
                    },
                    imageUrl: () => {
                        const img = SalesforceInteractions.cashDom(".swiper-container .swiper-wrapper .swiper-slide")[0];
                        const backgroundStyle = img.style.backgroundImage;
                        // 3. 정규식을 사용하여 URL 추출
                        const urlMatch = backgroundStyle.match(/url\("(.+?)"\)/);

                        // 4. URL 값이 존재하면 추출하여 변수에 저장
                        const imgUrl = urlMatch ? urlMatch[1] : null;
                        return imgUrl;
                    },
                    // rating: () => {
                    //     return SalesforceInteractions.cashDom(".tour-detail-view .course-info-wrap .review-num-area .star-score").text() //골프장 별점
                    // },
                }
            }, */
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
          // MO_이벤트 상세페이지 페이지
          name: "MO_이벤트 상세페이지 방문",
          isMatch: () => new Promise((resolve, reject) => {
            setTimeout(() => {
              return SalesforceInteractions.DisplayUtils.pageElementLoaded("#eventView", "html").then(() => {
                if (window.location.href.includes("https://m.golfzoncounty.com/countyBoard/event") && document.querySelector("#eventView").style.display !== "none") {
                  resolve(true);
                }
              });
            }, 1500);
          }),
          interaction: {
            name: "MO_이벤트 상세페이지 방문",
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
    }

    handleSPAPageChange();

    const fnPageChange = (e) => {
      let previousDisplayValue1 = null;
      let previousDisplayValue2 = null;
      // 감시할 대상 요소
      if (window.location.href === "https://www.golfzoncounty.com/countyBoard/event" || window.location.href === "https://m.golfzoncounty.com/countyBoard/event" || window.location.href === "https://m.golfzoncounty.com/reserve/main") {

        const targetNode1 = document.querySelector('#eventView');
        const targetNode2 = document.querySelector('#reserveComplete');
        // 옵저버 설정: attributes와 attributeFilter 옵션을 설정하여 특정 속성만 감지
        const config = { attributes: true, attributeFilter: ['class', 'style'], attributeOldValue: true };
        // MutationObserver 생성
        const observer = new MutationObserver((mutationsList, observer) => {
          // 감지된 모든 변화를 순회하며 처리
          for (const mutation of mutationsList) {
            const newDisplayValue = getComputedStyle(mutation.target).display; // 새로운 display 값
            if (mutation.type === 'attributes') {

              // targetNode1에 대해 display 속성 변경 시
              if (mutation.target === targetNode1 && previousDisplayValue1 !== newDisplayValue) {
                previousDisplayValue1 = newDisplayValue;
                setTimeout(() => {
                  SalesforceInteractions.reinit();
                }, 10)
              }

              // targetNode2에 대해 display 속성 변경 시
              if (mutation.target === targetNode2 && previousDisplayValue2 !== newDisplayValue) {
                previousDisplayValue2 = newDisplayValue;
                setTimeout(() => {
                  SalesforceInteractions.reinit();
                }, 10)
              }

            }
          }
        });

        // 각 targetNode에 대해 감시 시작
        if (targetNode1) observer.observe(targetNode1, config);
        if (targetNode2) observer.observe(targetNode2, config); // 두 번째 targetNode 감시 추가

      }


    }

    setTimeout(() => {

      fnPageChange();

    }, 500);

    SalesforceInteractions.initSitemap(sitemapConfig);

  });
}