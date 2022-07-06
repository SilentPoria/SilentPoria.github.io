var i = 100
appear = function(i){
    var test = document.getElementById("appear");
          var count = (function(i) {
          var timer;
              function change(tar) {
                  i--;
                  var num = 1-i/100;
                  test.style.opacity=num;
                  if (i === tar) {
                      clearTimeout(timer);
                      return false;
                  }
                  timer = setTimeout(function() {
                      change(tar)
                  }, 100)
              }
              return change;
          })()
         count(500)
}
disappear = function(i){
    var test = document.getElementById("appear");
          var count = (function(i) {
          var timer;
              function change(tar) {
                  i++;
                  var num = 1-i/100;
                  test.style.opacity=num;
                  if (i === tar) {
                      clearTimeout(timer);
                      return false;
                  }
                  timer = setTimeout(function() {
                      change(tar)
                  }, 1)
              }
              return change;
          })()
         count(1000)
}