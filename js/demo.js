

$(document).ready(function(){
  function disco_div(selector, speed){
    var r = Math.floor((Math.random() * 30) + 1), 
    g = Math.floor((Math.random() * 30) + 1), 
    b = Math.floor((Math.random() * 30) + 1),
    r_up = true, 
    g_up = true, 
    b_up = true;

    var r_inc = Math.floor((Math.random() * 30) + 1);
    var g_inc = Math.floor((Math.random() * 30) + 1);
    var b_inc = Math.floor((Math.random() * 30) + 1);

    var timer = setInterval(function(){
      if (r_up){
        if (r + r_inc > 255) r_up = false;
        else r += r_inc;
      } else {
        if (r - r_inc < 0) r_up = true;
        else r -= r_inc
      }

      if (g_up){
        if (g + g_inc > 255) g_up = false;
        else g += g_inc;
      } else {
        if (g - g_inc < 0) g_up = true;
        else g -= g_inc
      }

      if (b_up){
        if (b + b_inc > 255) b_up = false;
        else b += b_inc;
      } else {
        if (b - b_inc < 0) b_up = true;
        else b -= b_inc
      }

      $(selector).css("background-color", (
        "rgb(" + 
        (r % 256) + 
        "," + 
        (g % 256) + 
        "," + 
        (b % 256 ) +
        ")"
      ));
    }, speed);

  }

  disco_div("#outer-h", 33);
  disco_div("#inner-i-1", 33);
  disco_div("#inner-i-2", 33);
  


});
