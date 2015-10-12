

$(document).ready(function(){
  function disco_div(selector, speed){
    var r = Math.floor((Math.random() * 30) + 1), 
    g = Math.floor((Math.random() * 30) + 1), 
    b = Math.floor((Math.random() * 30) + 1),
    r2 = Math.floor((Math.random() * 30) + 1), 
    g2 = Math.floor((Math.random() * 30) + 1), 
    b2 = Math.floor((Math.random() * 30) + 1),
    r_up = true, 
    g_up = true, 
    b_up = true,
    r2_up = true, 
    g2_up = true, 
    b2_up = true;

    var deg = Math.floor((Math.random() * 360) + 1);    

    var timer = setInterval(function(){
      var r_inc = Math.floor((Math.random() * 30) + 1);
      var g_inc = Math.floor((Math.random() * 30) + 1);
      var b_inc = Math.floor((Math.random() * 30) + 1);

      var r2_inc = Math.floor((Math.random() * 30) + 1);
      var g2_inc = Math.floor((Math.random() * 30) + 1);
      var b2_inc = Math.floor((Math.random() * 30) + 1);
      
      var deg_inc = Math.floor((Math.random() * 10) + 1) - 5;

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

      if (r2_up){
        if (r2 + r2_inc > 255) r2_up = false;
        else r2 += r2_inc;
      } else {
        if (r2 - r2_inc < 0) r2_up = true;
        else r2 -= r2_inc
      }

      if (g2_up){
        if (g2 + g2_inc > 255) g2_up = false;
        else g2 += g2_inc;
      } else {
        if (g2 - g2_inc < 0) g2_up = true;
        else g2 -= g2_inc
      }

      if (b2_up){
        if (b2 + b2_inc > 255) b2_up = false;
        else b2 += b2_inc;
      } else {
        if (b2 - b2_inc < 0) b2_up = true;
        else b2 -= b2_inc
      }

      // $(selector).css("background-color", (
      //   "rgb(" + 
      //   (r % 256) + 
      //   "," + 
      //   (g % 256) + 
      //   "," + 
      //   (b % 256 ) +
      //   ")"
      // ));

      deg += deg_inc
      deg = deg % 360

      $(selector).css("background", (
        "linear-gradient(" +
          deg+"deg,"+
          "rgb("+ 
            (r % 256) + 
            "," + 
            (g % 256) + 
            "," + 
            (b % 256 ) +
          "),"+
          "rgb("+ 
            (r2 % 256) + 
            "," + 
            (g2 % 256) + 
            "," + 
            (b2 % 256 ) +
          ")"+
        ")"
      ));

      console.log("test");
    }, speed);
    
  }

  //linear-gradient(angle, color-stop1, color-stop2);

  disco_div("#outer-h", 33);
  disco_div("#inner-i-1", 33);
  disco_div("#inner-i-2", 33);
  


});
