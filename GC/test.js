



const btn = document.querySelector(".btn");


function fnGetCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function fnNowDate(connect) {

  // 들어온 날짜 구하기
  const now = new Date();
  // const utcNow = now.getTime() + (now.getTimezoneOffset() * 60 * 1000); // 현재 시간을 utc로 변환한 밀리세컨드값
  // const koreaTimeDiff = 9 * 60 * 60 * 1000; // 한국 시간은 UTC보다 9시간 빠름(9시간의 밀리세컨드 표현)
  // const koreaNow = new Date(utcNow + koreaTimeDiff); // utc로 변환된 값을 한국 시간으로 변환시키기 위해 9시간(밀리세컨드)를 더함

  // console.log(now);
  // console.log(koreaNow);

  // 쿠키 저장
  if (connect === "접속") {
    // 접속한 시간 저장
    document.cookie = `connectNow=${now}`;

    const result = fnGetCookie("clickNow");

    console.log(result);

    if (result === undefined) return;

  } else if (connect === "클릭") {

    const nextDay = new Date(now);
    nextDay.setHours(24, 0, 0, 0); // 다음 날 00:00으로 설정

    // 클릭한 시간 저장
    document.cookie = `clickNow=${now}; expires=${nextDay}`;
    // 클릭한 다음 날 저장

    // 한국 시간 기준으로 쿠키 저장
    // const expires = nextDay.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

  }

}

fnNowDate("접속");

btn.addEventListener("click", (e) => {

  fnNowDate("클릭");

});


function fnNowDate(connect) {

  // 들어온 날짜 구하기
  const now = new Date();

  // 쿠키 저장
  if (connect === "접속") {
    // 접속한 시간 저장
    document.cookie = `connectNow=${now}`;

    const clickDate = fnGetCookie("clickNow");



  } else if (connect === "클릭") {

    const nextDay = new Date(now);
    nextDay.setHours(24, 0, 0, 0); // 다음 날 00:00으로 설정


    // 클릭한 시간 저장 & 클릭한 다음 날까지 유효기간
    document.cookie = `clickNow=${now}; expires=${nextDay}`;


  }

}

