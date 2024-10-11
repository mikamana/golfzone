//Sitemap 적용시간
console.log("2024-09-26 14:51");

//허용 도메인
// qav2 테스트 페이지
// const allowedDomains = ["www.teescanner.com", "m.teecanner.com","wwwqav2.teescanner.com", "qav2.teescanner.com"]; 
// const allowedDomains = ["www.teescanner.com", "m.teescanner.com"]; 
const allowedDomains = ["wwwqav2.teescanner.com", "qav2.teescanner.com"]; //QA 환경

//접속 도메인
const hostDomain = window.location.hostname;

//접속 기기 너비 확인
// const deviceWidth = window.innerWidth;

// if (deviceWidth > 768) {
//     //PC

// } else {
//     //Mobile

// }


//접속 도메인이 허용 도메인에 포함 시 Sitemap 초기화
if (allowedDomains.includes(hostDomain)) {
    SalesforceInteractions.init({
        cookieDomain: hostDomain
    }).then(() => {
        //Debugging
        SalesforceInteractions.setLoggingLevel(5)

        //접속 지역
        // const getLocale = () => {
        //     let locale = navigator.language;
        //     if (locale.length === 5) {
        //         locale = locale.replace("-", "_");
        //         return locale;
        //     } else {
        //         return null;
        //     }
        // }

        //메인에서 로그인 정보 가져오기
        const getLoginMain = () => {
            //메인에서 확인되는 로그인 요구 영역 확인
            const tourEle = SalesforceInteractions.cashDom(".golf-tour-wrap .recently-swiper-wrap .no-prefer-area.no");
            if (tourEle.length !== 0) {
                //로그인 버튼 확인
                const btnLogin = SalesforceInteractions.cashDom(tourEle).find("button").text();
                if (btnLogin === "로그인") {
                    sessionStorage.setItem("logBool", "미로그인")
                    console.log("미로그인")
                    return "미로그인"
                }
            } else {
                sessionStorage.setItem("logBool", "로그인")
                console.log("로그인")
                return "로그인"
            }
        }

        // const getLogin = () => {
        //     const recentlyEl = SalesforceInteractions.cashDom(".profile-info-area > div > button > p.txt > strong");
        //     console.log(recentlyEl);
        //     if (recentlyEl.text() === "로그인") {
        //         console.log("미 로그인")
        //         return "false";
        //     } else {
        //         console.log("로그인")
        //         return "true";
        //     }
        // }


        //Parameter 값 가져오기
        const getUrl = new URL(window.location.href);
        const urlParams = getUrl.searchParams;
        //Tour Type
        const tourType = urlParams.get("tourType");
        //Tour Type Seq
        const tourTypeSeq = urlParams.get("tourTypeSeq");
        //Tab 
        const tabType = urlParams.get("tab");
        //골프장 번호
        const golfClubSeq = urlParams.get("golfclub_seq");
        //티타임 번호
        const teetimeSeq = urlParams.get("teetime_seq");
        //예약 번호
        const bookingSeq = urlParams.get("order_booking_seq");


        //골프장 상세 방문 확인
        // const chkDetailType = () => {
        //     //골프장 이름 탭 별로 방문 페이지 이름 변경
        //     let pageName;
        //     if(window.location.pathname === "/booking/detail") {
        //         switch(tabType) {
        //             case "teetime":
        //                 pageName = "골프장 상세(티타임) 방문";
        //                 break;
        //             case "introduce":
        //                 pageName = "골프장 상세(골프장 소개) 방문";
        //                 break;
        //             case "review":
        //                 pageName = "골프장 상세(리뷰) 방문";
        //                 break;
        //             case "blogReview":
        //                 pageName = "골프장 상세(블로그리뷰) 방문";
        //                 break;
        //             case "news":
        //                 pageName = "골프장 상세(골프장 소식) 방문";
        //                 break;
        //             default: 
        //                 pageName = "골프장 상세 방문"
        //                 break;
        //         }
        //         return pageName;
        //     }
        // }


        //접속 디바이스 확인
        // const getDevice = () => {
        //     let userDevice;
        //     if (navigator.userAgent.match(/iPhone/i)) {
        //         userDevice = "iPhone"
        //     } else if (navigator.userAgent.match(/Android/i)) {
        //         userDevice = "Android"
        //     } else if (navigator.userAgent.match(/iPad/i)) {
        //         userDevice = "iPad"
        //     } else {
        //         if (deviceWidth > 1024) {
        //             userDevice = "PC"
        //         } else {
        //             userDevice = "Mobile"
        //         }
        //     }
        //     return userDevice;
        // }


        //Configuration
        const config = {
            global: {
                // locale: getLocale(),
                onActionEvent: (actionEvent) => {
                    actionEvent.user = actionEvent.user || {};
                    actionEvent.user.identities = actionEvent.user.identities || {};
                    actionEvent.user.attributes = actionEvent.user.attributes || {};
                    if (sessionStorage.getItem("logBool") !== null) {
                        actionEvent.user.attributes.loginBool = sessionStorage.getItem("logBool")
                    }
                    return actionEvent;
                },
                listeners: [
                    //즐겨찾기, 북마크
                    SalesforceInteractions.listener("click", ".header .right-menu .btn.btn-bookmark", (el) => {
                        const btnBookmark = SalesforceInteractions.cashDom(el.target);
                        if (SalesforceInteractions.cashDom(btnBookmark).hasClass("active") === false) {
                            const golfClubName = SalesforceInteractions.cashDom(".header .navigation .tit span");
                            if (golfClubName !== null) {
                                SalesforceInteractions.sendEvent({
                                    interaction: {
                                        name: "골프장 즐겨찾기"
                                    },
                                    user: {
                                        attributes: {
                                            latestBookmarkClub: SalesforceInteractions.cashDom(golfClubName).text()
                                        }
                                    }
                                })
                            }
                        }
                    }),
                    //찜, Pin
                    SalesforceInteractions.listener("click", ".btm-golf-layer-info .btn-area .btn.btn-pin", (el) => {
                        const btnPin = SalesforceInteractions.cashDom(el.target);
                        if (SalesforceInteractions.cashDom(btnPin).hasClass("active") === false) {
                            const golfInfoLayer = SalesforceInteractions.cashDom(btnPin).closest(".btm-golf-layer-info");
                            const golfClubName = SalesforceInteractions.cashDom(golfInfoLayer).find(".tit-area > strong").text();
                            SalesforceInteractions.sendEvent({
                                interaction: {
                                    name: "골프장 찜 등록"
                                },
                                user: {
                                    attributes: {
                                        latestPinClub: golfClubName
                                    }
                                }
                            });
                        }
                    })
                ]
            },
            pageTypeDefault: {
                name: "티스캐너 페이지 접속",
                interaction: {
                    name: "티스캐너 페이지 접속"
                }
            },
            pageTypes: [
                {
                    name: "메인 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/home") {
                            return true;
                        }
                    },
                    // isMatch: () => new Promise((resolve, reject) => {
                    //     let isMatchPDP = setTimeout(() => {
                    //         return SalesforceInteractions.DisplayUtils.pageElementLoaded("#wrap.main-wrap", "html").then(() => {
                    //             isMatchPDP = null;
                    //             resolve(true);
                    //         })
                    //     }, 1000);
                    //     return SalesforceInteractions.DisplayUtils.pageElementLoaded("#wrap.main-wrap", "html").then(() => {
                    //         clearTimeout(isMatchPDP);
                    //         isMatchPDP = null;
                    //         resolve(true);
                    //     })
                    // }),
                    interaction: {
                        name: "메인 방문"
                    },
                    onActionEvent: (actionEvent) => {
                        actionEvent.user = actionEvent.user || {};
                        actionEvent.user.identities = actionEvent.user.identities || {};
                        actionEvent.user.attributes = actionEvent.user.attributes || {};
                        //로그인 여부 확인하기
                        actionEvent.user.attributes.loginBool = getLoginMain();
                        return actionEvent;
                    },
                    contentZones: [
                        { name: "메인 페이지 최상단", selector: "header.header" },
                        { name: "메인 페이지 전체" }
                    ]
                },
                {
                    name: "로그인 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/login/login") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "로그인 방문"
                    },
                    listeners: [
                        //티스캐너에서 회원가입 클릭을 확인하기 위함.
                        SalesforceInteractions.listener("click", ".join-btn-area li:last-child a", (el) => {
                            const targetEl = SalesforceInteractions.cashDom(el.target);
                            if (targetEl !== null) {
                                const btnJoin = SalesforceInteractions.cashDom(targetEl).text();
                                if (btnJoin === "회원가입") {
                                    SalesforceInteractions.sendEvent({
                                        interaction: {
                                            name: "회원가입 클릭"
                                        }
                                    });
                                }
                            }
                        }),
                    ]
                },
                {
                    name: "예약 목록(골프장형) 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/booking/list" && window.location.search.includes("tab=golfcourse")) {
                            return true;
                        }
                    },
                    interaction: {
                        name: "예약 목록(골프장형) 방문"
                    },
                    contentZones: [
                        { name: "예약 목록(골프장형)", selector: ".infinite-scroll-component__outerdiv ul.golf-info-list:not(.ttime)" }
                    ]
                },
                {
                    name: "예약 목록(티타임형) 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/booking/list" && window.location.search.includes("tab=teetime")) {
                            return true;
                        }
                    },
                    interaction: {
                        name: "예약 목록(티타임형) 방문"
                    },
                    contentZones: [
                        { name: "예약 목록(티타임형)", selector: ".infinite-scroll-component__outerdiv ul.golf-info-list.ttime" }
                    ]
                },
                // {
                //     name: "골프장 예약 목록 방문",
                //     isMatch: () => {
                //         if(window.location.pathname === "/booking/list") {
                //             return true;
                //         }
                //     },
                //     interaction: {
                //         name: "골프장 예약 목록 방문"
                //     },
                //     contentZones: [
                //         { name: "골프장 목록(골프장형)", selector: ".infinite-scroll-component__outerdiv ul.golf-info-list:not(.ttime)" },
                //         { name: "골프장 목록(티타임형)", selector: ".infinite-scroll-component__outerdiv ul.golf-info-list.ttime" }
                //     ],
                //     listeners: [
                //         SalesforceInteractions.listener("click", ".filter-tab-wrap .filter-tab > li > button", (el) => {
                //             const btnTab = SalesforceInteractions.cashDom(el.target);
                //             const btnTabType = SalesforceInteractions.cashDom(btnTab).attr("data-filter-tab");
                //             //선택한 탭 확인
                //             if(btnTabType === "golfcourse") {
                //                 //골프장형 선택
                //                 SalesforceInteractions.sendEvent({
                //                     interaction: {
                //                         name: "골프장형 예약 목록 조회"
                //                     }
                //                 });
                //             } else if(btnTabType === "teetime") {
                //                 //티타임형 선택
                //                 SalesforceInteractions.sendEvent({
                //                     interaction: {
                //                         name: "티타임형 예약 목록 조회"
                //                     }
                //                 });
                //             } else {
                //                 //null
                //             }
                //         })
                //     ]
                // },
                {
                    name: "골프장 상세(티타임) 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/booking/detail" && window.location.search.includes("tab=teetime")) {
                            return true;
                        }
                    },
                    interaction: {
                        name: "골프장 상세(티타임) 방문"
                    }
                },
                {
                    name: "골프장 상세(골프장 소개) 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/booking/detail" && window.location.search.includes("tab=introduce")) {
                            return true;
                        }
                    },
                    interaction: {
                        name: "골프장 상세(골프장 소개) 방문"
                    }
                },
                // {
                //     name: "골프장 상세 방문",
                //     isMatch: () => {
                //         if(window.location.pathname === "/booking/detail") {
                //             return true;
                //         }
                //     },
                //     interaction: {
                //         name: "골프장 상세 방문",
                //         catalogObject: {
                //             type: "Product",
                //             id: () => {
                //                 return golfClubSeq
                //             },
                //             attributes: {
                //                 name: SalesforceInteractions.cashDom(".header .navigation .tit span").text(),
                //                 url: SalesforceInteractions.resolvers.fromHref(),
                //                 imageUrl: SalesforceInteractions.resolvers.fromSelectorAttribute(".thumnail-info .swiper-wrapper .swiper-slide:first-child img", "src", (url) => url)
                //             }
                //         }
                //     },
                //     //탭 선택
                //     //티타임, 골프장 소개, 리뷰, 블로그리뷰, 골프장 소식
                //     //tabType = teetime, introduce, review, blogReview, news
                // },
                {
                    name: "결제 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/booking/detail/pay") {
                            return true
                        }
                    },
                    interaction: {
                        name: "결제 방문"
                    },
                    listeners: [
                        SalesforceInteractions.listener("click", ".reserve-wrap.inform-wrap > .lst-info-wrap > .btn-area .btn.active", (el) => {
                            let reserItem = [];
                            sessionStorage.removeItem("reserItem");
                            const btnPay = SalesforceInteractions.cashDom(el.target);
                            const payWrap = SalesforceInteractions.cashDom(btnPay).closest(".reserve-wrap.inform-wrap");
                            const payInfo = SalesforceInteractions.cashDom(payWrap).find(".lst-info-wrap .lst-info-content-area:nth-child(1)");
                            //인원
                            const reserCnt = parseInt(SalesforceInteractions.cashDom(payInfo).find(".lst-info-content:nth-child(2) .lst-info-area:nth-child(1) .info").text().replaceAll(/[^0-9]/g, ""));
                            //가격
                            const reserPrice = parseInt(SalesforceInteractions.cashDom(payInfo).find(".lst-info-content:nth-child(2) .lst-info-area:nth-child(2) .lst-info li:nth-child(3) strong").text().replaceAll(/[^0-9]/g, ""));
                            let lineItem = {
                                catalogObjectType: "Product",
                                catalogObjectId: teetimeSeq,
                                price: reserPrice,
                                quantity: reserCnt
                            }
                            reserItem.push(lineItem);
                            sessionStorage.setItem("reserItem", JSON.stringify(reserItem));
                        }),
                    ]
                },
                {
                    name: "결제 완료 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/booking/detail/pay/complete") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "결제 완료 방문",
                        order: {
                            id: bookingSeq,
                            lineItems: SalesforceInteractions.DisplayUtils.pageElementLoaded(".reserve-wrap", "html").then(() => {
                                let bookingOrderItems = [];
                                bookingOrderItems = JSON.parse(sessionStorage.getItem("reserItem"));
                                return bookingOrderItems;
                            })
                        }
                    }
                },
                {
                    name: "골프장 예약 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/booking/detail/reservation") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "골프장 예약 방문"
                    },
                    listeners: [
                        SalesforceInteractions.listener("click", ".layer-popup-wrap.reserve-check > .btn-area > .btn", (el) => {
                            let reserItem = [];
                            sessionStorage.removeItem("reserItem");
                            const btnReser = SalesforceInteractions.cashDom(el.target);
                            const reserWrap = SalesforceInteractions.cashDom(btnReser).closest(".reserve-check");
                            const reserInfo = SalesforceInteractions.cashDom(reserWrap).find(".layer-pop-contents");
                            //인원
                            const reserCnt = parseInt(SalesforceInteractions.cashDom(reserInfo).find(".lst-info-area:nth-child(1) .lst-info > li:nth-child(5) strong").text().replaceAll(/[^0-9]/g, ""));
                            //가격
                            const reserPrice = parseInt(SalesforceInteractions.cashDom(reserInfo).find(".lst-info-area:nth-child(2) .lst-info.info-type01 > li:nth-child(2) strong").text().replaceAll(/[^0-9]/g, ""));
                            let lineItem = {
                                catalogObjectType: "Product",
                                catalogObjectId: teetimeSeq,
                                price: reserPrice,
                                quantity: reserCnt
                            }
                            reserItem.push(lineItem);
                            sessionStorage.setItem("reserItem", JSON.stringify(reserItem));
                        }),
                    ]
                },
                {
                    name: "골프장 예약 완료 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/booking/detail/reservation/complete") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "골프장 예약 완료 방문",
                        order: {
                            id: bookingSeq,
                            lineItems: SalesforceInteractions.DisplayUtils.pageElementLoaded(".reserve-wrap", "html").then(() => {
                                let bookingOrderItems = [];
                                bookingOrderItems = JSON.parse(sessionStorage.getItem("reserItem"));
                                return bookingOrderItems;
                            })
                        }
                    }
                },
                {
                    name: "기획전 목록 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/booking/exhibition/list") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "기획전 목록 방문"
                    }
                },
                {
                    name: "기획전 상세 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/booking/exhibition/detail") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "기획전 상세 방문"
                    }
                },
                {
                    name: "국내 투어 목록 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/tour/list" && window.location.search.includes("tourType=52")) {
                            return true;
                        }
                    },
                    interaction: {
                        name: "국내 투어 목록 방문"
                    }
                },
                {
                    name: "해외 투어 목록 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/tour/list" && window.location.search.includes("tourType=53")) {
                            return true;
                        }
                    },
                    interaction: {
                        name: "해외 투어 목록 방문"
                    }
                },
                // {
                //   name: "투어 목록 방문",
                //   isMatch: () => {
                //     if (window.location.pathname === "/tour/list") {
                //         return true;
                //     }
                //   },
                //   interaction: {
                //     name: "투어 목록 방문"
                //   }
                //   //국내 투어, 해외 투어 방문 시도 코드 필요
                //   //tourType = 52 = 국내
                //   //tourType = 53 = 해외
                // },
                {
                    name: "투어 상세 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/tour/detail") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "투어 상세 방문"
                    }
                },
                {
                    name: "상세 검색(부킹) 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/search/booking") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "상세 검색(부킹) 방문"
                    },
                    listeners: [
                        SalesforceInteractions.listener("click", ".srch-list-wrap .srch-golf-list li .list-info", (el) => {
                            const listItem = SalesforceInteractions.cashDom(el.target);
                            const golfcourseName = SalesforceInteractions.cashDom(listItem).find("strong").text();
                            sessionStorage.setItem("golfcourseName", golfcourseName);
                            SalesforceInteractions.sendEvent({
                                interaction: {
                                    name: "검색 골프장 선택"
                                },
                                user: {
                                    attributes: {
                                        latestSrhGreen: golfcourseName
                                    }
                                }
                            })
                        })
                    ]
                },
                {
                    name: "상세 검색 결과(부킹) 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/search/booking/result") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "상세 검색 결과(부킹) 방문"
                    },
                    listeners: [
                        SalesforceInteractions.listener("click", ".booking-wrap .infinite-scroll-component__outerdiv .golf-info-list .golfclub_li .golf-inner-info .place button", (el) => {
                            const listItem = SalesforceInteractions.cashDom(el.target);
                            const golfcourseName = SalesforceInteractions.cashDom(listItem).find("strong").text();
                            sessionStorage.setItem("golfcourseName", golfcourseName);
                            SalesforceInteractions.sendEvent({
                                interaction: {
                                    name: "검색 골프장 선택"
                                },
                                user: {
                                    attributes: {
                                        latestSrhGreen: golfcourseName
                                    }
                                }
                            })
                        })
                    ]
                },
                {
                    name: "상세 검색(투어) 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/search/tour") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "상세 검색(투어) 방문"
                    },
                    listeners: [
                        SalesforceInteractions.listener("click", ".detail-srch-wrap.search .detail-cont.result .srch-golf-list li .btn-select", (el) => {
                            const tourItem = SalesforceInteractions.cashDom(el.target);
                            const tourName = SalesforceInteractions.cashDom(tourItem).closest("li").find("div .info strong").text();
                            sessionStorage.setItem("srhTour", tourName)
                            SalesforceInteractions.sendEvent({
                                interaction: {
                                    name: "검색 투어 선택"
                                },
                                user: {
                                    attributes: {
                                        latestSrhTour: tourName
                                    }
                                }
                            })
                        })
                    ]
                },
                {
                    name: "상세 검색 결과(투어) 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/search/tour/result") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "상세 검색 결과(투어) 방문"
                    },
                    listeners: [
                        SalesforceInteractions.listener("click", ".tour-contents .tour-info-wrap .infinite-scroll-component__outerdiv .tour-list li > button", (el) => {
                            const toruItem = SalesforceInteractions.cashDom(el.target);
                            const tourName = SalesforceInteractions.cashDom(toruItem).find(".info-wrap .tour-content-wrap .tour-content strong").text();
                            sessionStorage.setItem("srhTour", tourName)
                            SalesforceInteractions.sendEvent({
                                interaction: {
                                    name: "검색 투어 선택"
                                },
                                user: {
                                    attributes: {
                                        latestSrhTour: tourName
                                    }
                                }
                            });
                        })
                    ]
                },
                {
                    name: "내 예약 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/home/myreservation") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "내 예약 방문"
                    }
                },
                {
                    name: "단체 예약 목록 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/group/list") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "단체 예약 목록 방문"
                    }
                },
                {
                    name: "단체 예약 상세 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/group/detail") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "단체 예약 상세 방문"
                    }
                },
                {
                    name: "단체 예약 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/group/reserve") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "단체 예약 방문"
                    }
                },
                {
                    name: "이벤트 목록 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/event/list") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "이벤트 목록 방문"
                    }
                },
                {
                    name: "이벤트 상세 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/event/detail") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "이벤트 상세 방문"
                    }
                },
                {
                    name: "My T 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/mypage/list") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "My T 방문"
                    }
                },
                {
                    name: "My T > 마일리지 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/mypage/mileage/list") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "My T > 마일리지 방문"
                    }
                },
                {
                    name: "My T > 내 쿠폰함 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/mypage/couponbox/list") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "My T > 내 쿠폰함 방문"
                    }
                },
                {
                    name: "My T > 나의 단골 골프장 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/mypage/regular/golfcourse") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "My T > 나의 단골 골프장 방문"
                    }
                },
                {
                    name: "My T > 찜 상품 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/mypage/favorite/item") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "My T > 찜 상품 방문"
                    }
                },
                {
                    name: "My T > 리뷰 현황 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/mypage/review/status") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "My T > 리뷰 현황 방문"
                    }
                },
                {
                    name: "My T > 티타임 신청 내역 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/booking/teetime/apply/list") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "My T > 티타임 신청 내역 방문"
                    }
                },
                {
                    name: "My T > 부킹 예약 및 결제 내역 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/mypage/history/booking/list") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "My T > 부킹 예약 및 결제 내역 방문"
                    }
                },
                {
                    name: "My T > 투어 예약 및 결제 내역 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/mypage/history/tour/list") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "My T > 투어 예약 및 결제 내역 방문"
                    }
                },
                {
                    name: "My T > 이벤트 참여 현황 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/mypage/event/status") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "My T > 이벤트 참여 현황 방문"
                    }
                },
                {
                    name: "My T > 즐겨찾기 골프장 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/mypage/favorite/golfcourse") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "My T > 즐겨찾기 골프장 방문"
                    }
                },
                {
                    name: "My T > 최근 본 골프장 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/mypage/recently/item") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "My T > 최근 본 골프장 방문"
                    }
                },
                {
                    name: "알림함 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/notify/list") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "알림함 방문"
                    }
                },
                {
                    name: "Push 알림 설정 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/setting/notify") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "Push 알림 설정 방문"
                    }
                },
                {
                    name: "설정 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/setting/list") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "설정 방문"
                    }
                },
                {
                    name: "계정 설정 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/setting/account") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "계정 설정 방문"
                    }
                },
                {
                    name: "회원 탈퇴 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/setting/withdraw/withdraw") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "회원 탈퇴 방문"
                    }
                },
                {
                    name: "마케팅 수신 동의 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/setting/marketing") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "마케팅 수신 동의 방문"
                    }
                },
                {
                    name: "약관 목록 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/setting/terms/list") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "약관 목록 방문"
                    }
                },
                {
                    name: "이용약관 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/setting/terms/use") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "이용약관 방문"
                    }
                },
                {
                    name: "개인정보 처리방침 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/setting/terms/privacy") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "개인정보 처리방침 방문"
                    }
                },
                {
                    name: "위치정보 이용약관 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/setting/terms/location") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "위치정보 이용약관 방문"
                    }
                },
                {
                    name: "위치기반서비스 이용약관 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/setting/terms/location/base") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "위치기반서비스 이용약관 방문"
                    }
                },
                {
                    name: "오픈소스라이선스 약관 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/setting/terms/license") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "오픈소스라이선스 약관 방문"
                    }
                },
                {
                    name: "골프장 리뷰 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/golfcourse/review/list") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "골프장 리뷰 방문"
                    }
                },
                {
                    name: "골프장 소식 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/golfcourse/news/list") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "골프장 소식 방문"
                    }
                },
                {
                    name: "골프장 소식 상세 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/golfcourse/news/detail") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "골프장 소식 상세 방문"
                    }
                },
                {
                    name: "공지사항 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/notice/list") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "공지사항 방문"
                    }
                },
                {
                    name: "공지사항 상세 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/notice/detail") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "공지사항 상세 방문"
                    }
                },
                {
                    name: "자주하는 질문 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/faq/list") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "자주하는 질문 방문"
                    }
                },
                {
                    name: "티타임알림 신청하기 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/booking/teetime/notify") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "티타임알림 신청하기 방문"
                    }
                },
                {
                    name: "티타임매칭 신청하기 방문",
                    isMatch: () => {
                        if (window.location.pathname === "/booking/teetime/matching") {
                            return true;
                        }
                    },
                    interaction: {
                        name: "티타임매칭 신청하기 방문"
                    }
                }
            ]
        }

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

        //Sitemap 초기화
        SalesforceInteractions.initSitemap(config);
    })
}


isMatch: () => new Promise((resolve, reject) => {
    setTimeout(() => {
        return SalesforceInteractions.DisplayUtils.pageElementLoaded(".booking-detail-wrap .course-info-wrap .course-info .tit", "html").then(() => {
            resolve(true);
        });
    }, 2500);
}),