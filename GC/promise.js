async function fnTest() {

  const fnStart = await test1();

  console.log(fnStart);



}

async function test1() {

  const response = await fetch("https://www.golfzoncounty.com/member_api/mingreenfeelist?gc_no=1&chnl=w")
  const result = await response.json();

  return result;

}

function test2() {

  function test3() {
    console.log("test3");
  }

}

test3();



async function test3() {

}

fnTest();

// async function test() {

//   await test1();
//   await test2();
//   await test3();

// }