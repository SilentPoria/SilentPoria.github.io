disappear = function(){
    var test = document.getElementById("appear");
          var count = (function() {
          var timer;
          var i = 0;
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
         count(100)
}

