var Zone;

Zone = (function(){
  function Zone(options){
    this.cards_obscured = options.cards_obscured || false;
    this.cards = options.cards || {};
  
    this.$element = options.$element || null;
  };

  Zone.prototype.initContextMenuForCards = function(){ 
    return null;
  };

  Zone.prototype.build = function(){
    return null;
  };

  Zone.prototype.initZoneEvents = function(){
    return null;
  };

  return Zone;
})();