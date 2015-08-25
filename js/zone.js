var Zone;

Zone = (function(){
  function Zone(options){
    this.editable = options.editable || true;
    this.cards = options.cards || {};
  };

  Zone.prototype.initContextMenu = function(){ 
    return null;
  };

  return Zone;
})();