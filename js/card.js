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
    var element_id = this.instance_id;
    if (this.instance_id == undefined)
      element_id = 'card-'+this.multiverseid;
    
    return (
      '<div class="card cardmenu ui-widget-content" id="'+element_id+'">'+
        '<img src="http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid='+this.multiverseid+'&type=card">'+
      '</div>'
    )
  };

  Card.prototype.attach = function(selector){ 
    $(selector).append(this.htmlString());
    this.registerEvents();
  };

  Card.prototype.registerEvents = function(selector){ 
    var element_id = this.instance_id;
    if (this.instance_id == undefined)
      element_id = 'card-'+this.multiverseid;

    $('#'+element_id).draggable();
  };


  Card.prototype.clone = function(instance_id){ 
    var new_card = new Card(JSON.parse(JSON.stringify(this)));
    new_card.instance_id = instance_id;
    return new_card;
  };

  

  return Card;
})();