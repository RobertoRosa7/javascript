(function () {
  "use strict";
  document.onreadystatechange = function () {
    "use strict";
    if (document.readyState === "complete") {
      if (typeof Worker !== undefined) {
        const worker = new Worker("worker.js");
        const first = document.querySelector("#first");
        const second = document.querySelector("#second");

        first.addEventListener("change", function () {
          worker.postMessage(first.value);
        });
        second.addEventListener("change", function () {
          worker.postMessage(second.value);
        });
        worker.onmessage = function (e) {
          console.log(`Message receive from worker: ${e.data}`);
        };
      } else {
        console.log("The Browser is not supported Web Worker");
      }
      initialize();
    }
  };
})();

function initialize() {
  /*
   function declaration: function nameFunc() {}
    here is excecute code first this example doesn’t throw an error because the function declaration
    is read fi rst before the code begins to execute.

   function expression: var nameFunc = function() {}
    if the function is called after of its declaration throw an error because the function is declare
    
    sayHi('oi') // error function doesn't exist yet
    var sayHi = function(string) {}
  */
  "use strict";

  const title = document.querySelector("#title");
  var num = -18;
  var div = document.createElement("div");
  var p = document.createElement("p");
  p.innerHTML = `convert negative number in binary: ${num.toString(2)}`;

  div.appendChild(p);
  div.appendChild(compare(10, 9));
  div.appendChild(breakPointContinue());
  div.appendChild(outermoster());

  document.body.append(div);

  function compare(a, b) {
    "use strict";
    var p = document.createElement("p");

    if (a > b) {
      p.innerHTML = `${a} is greater than ${b}`;
      return p;
    } else if (a < b) {
      p.innerHTML = `${a} is less than ${b}`;
      return p;
    } else {
      p.innerHTML = `${a} is equal ${b}`;
      return p;
    }
  }

  function breakPointContinue() {
    "use strict";
    var p = document.createElement("p");
    var num = 0;

    for (var i = 1; i < 10; i++) {
      if (i % 5 == 0) {
        continue;
      }
      num++;
    }

    p.innerHTML = `break continue: ${num}`;
    return p;
  }

  function outermoster() {
    "use strict";
    var p = document.createElement("p");
    var num = 0;

    outermost: for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 10; j++) {
        if (i == 5 && j == 5) {
          break outermost;
        }
        num++;
      }
    }
    p.innerHTML = `break outermost: ${num}`;
    return p;
  }
}
