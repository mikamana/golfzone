(function () {
  var message = "템플릿 1";
  console.log(message);
  function apply() {

  }
})();

(function () {
  var message = "템플릿 2";
  console.log(message);
})();

(function () {
  var message = "템플릿 3";
  console.log(message);
})();


function registerTemplate({ apply, reset, control }) {
  // 템플릿 초기 등록
  console.log("템플릿 등록 완료");

  // 예시: 템플릿을 적용
  apply();

  // 예시: 템플릿을 리셋
  reset();

  // 예시: 템플릿을 제어
  control();
}

