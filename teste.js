function syncSum(x) {
  console.log("syncSum called");
  x = x + 1;
  console.log(x);
}

function asyncSum(x) {
  console.log("asyncSum called");
  return new Promise((res, rej) => {
    x = x + 1;
    res(x);
  });
}

function asyncPow(x) {
  console.log("asyncPow called");
  return new Promise((res, rej) => {
    x = ((x ** 2 - 21) * 7) ** 3;
    res(x);
  });
}

/*
syncSum(1);
syncSum(2);
syncSum(3);
syncSum(4);
asyncSum(2).then(x => console.log(x));
syncSum(3);
*/

async function callSumsAndPows(n) {
  for (let i = 0; i < n; i++) {
    console.log("i = %d", i);
    if (i % 2 === 0) await asyncPow(i).then(x => console.log(x)).then(() => console.log('promise resolvida'));
    else await asyncSum(i).then(x => console.log(x));
  }
}

callSumsAndPows(10);
/*
function syncTimeout(t) {
  console.log("sync timeout with t = %d called", t);
  setTimeout(() => {
    console.log("sync timeout ended");
  }, t * 1000);
}

function asyncTimeout(t) {
  console.log("async timeout with t = %d called", t);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(t);
    }, t * 1000);
  })
}

syncTimeout(3);
syncTimeout(4);
asyncTimeout(1).then(t => console.log('resolved timeout with t = %d', t));
asyncTimeout(2).then(t => console.log('resolved timeout with t = %d', t));
*/