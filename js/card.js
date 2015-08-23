var Card;

Card = (function(){
  function Card(base_card_data, instance_id){
    for (var key in base_card_data){
      this[key] = base_card_data[key];
    }

    this.tapped = false;
    this.counters = 0;
    this.attached = false;

    this.element_id = (instance_id);
    if (this.element_id == undefined)
      this.element_id = 'card-'+this.multiverseid;

    this.$element;
  }

  Card.prototype.htmlString = function(){ 
    return (
      '<div class="card cardmenu ui-widget-content" id="'+this.element_id+'">'+
        '<img src="http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid='+this.multiverseid+'&type=card">'+
      '</div>'
    )
  };

  Card.prototype.attach = function(selector){ 
    $(selector).append(this.htmlString());
    this.$element = $('#'+this.element_id);
    this.registerEvents();
  };

  Card.prototype.unattach = function(){ 
    this.$element.remove();
  };

  Card.prototype.registerEvents = function(){ 
    this.$element.draggable();
  };

  Card.prototype.clone = function(instance_id){ 
    var new_card = new Card(JSON.parse(JSON.stringify(this)), instance_id);
    return new_card;
  };

  Card.prototype.toggleTapped = function(){ 
    if (this.tapped){
      this.tapped = false;
      this.$element.rotate(0);
    } else {
      this.tapped = true;
      this.$element.rotate(90);
    }
  };

  return Card;
})();