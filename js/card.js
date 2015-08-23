var Card;

Card = (function(){
  function Card(base_card_data){
    for (var key in base_card_data){
      this[key] = base_card_data[key];
    }

    this.tapped = false;
    this.counters = 0;
  }

  Card.prototype.htmlString = function(){ 
    return (
      '<div class="card ui-widget-content" id="card-'+this.multiverseid+'">'+
        '<img src="http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid='+this.multiverseid+'&type=card">'+
      '</div>'
    )
  };

  

  return Card;
})();