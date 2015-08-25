var Counter;

Counter = (function(){
  function Counter(){
    this.val = 1;
  };

  Counter.prototype.htmlString = function(){ 
    return (
      '<div class="counter ui-widget-content"></div>'
    )
  };

  

  return Counter;
})();