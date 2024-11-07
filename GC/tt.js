
// 내일 찾은 값으로 사이트맵에 id값 적용시켜야함

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
console.log(result);
