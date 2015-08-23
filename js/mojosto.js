var mtgjson = null;

var MoJoSto;

MoJoSto = (function(){
  function MoJoSto(){
    var mojosto = this;

    this.card_lookup = {
      "Creature": [],
      "Equipment": [],
      "Sorcery": [],
      "Instant": []
    }

    this.battlefield = {};
    this.unequiped = {};

    this.mtgjson;

    this.initHelperFunctions();
    this.initPlayFieldEvents();

    //Loaded and ready
    $.getJSON("AllSets.json", function(json) {
        mojosto.mtgjson = json;
        $("#loading").hide();
        $("#page").show(); 

        mojosto.initCardLookup();
        mojosto.initMenuDOM();
        mojosto.initMenuEvents();
    });
  };

  MoJoSto.prototype.initHelperFunctions = function(){ 
    Array.prototype.clean = function(deleteValue) {
      for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {         
          this.splice(i, 1);
          i--;
        }
      }
      return this;
    };

    $.fn.center = function () {
        this.css("position","absolute");
        this.css("top", ( $(window).height() - this.height() ) / 2+$(window).scrollTop() + "px");
        this.css("left", ( $(window).width() - this.width() ) / 2+$(window).scrollLeft() + "px");
        return this;
    }

    $.fn.rotate = function(degrees) {
      $(this).css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
                   '-moz-transform' : 'rotate('+ degrees +'deg)',
                   '-ms-transform' : 'rotate('+ degrees +'deg)',
                   'transform' : 'rotate('+ degrees +'deg)'});
      return $(this);
    };

    $.fn.arrayUnique = function(a) {
        return a.reduce(function(p, c) {
            if (p.indexOf(c) < 0) p.push(c);
            return p;
        }, []);
    };
  };

  MoJoSto.prototype.initPlayFieldEvents = function(){ 
    $(".zone_header").click(function(e){
      console.log($(this).siblings());
      $(this).siblings(".zone_content").slideToggle();
    });
  };

  MoJoSto.prototype.initMenuDOM = function(){ 
    for (var i = 0; i <= 30; i++){
      if (this.card_lookup["Creature"][i] != undefined){
        $("#creature_cmc").append('<option val="'+i+'" id="cmc-'+i+'">'+i+'</option>');
      }     
    } 

    $("#creature_cmc option").first().attr("selected",true);
  };

  MoJoSto.prototype.initMenuEvents = function(){ 
    var mojosto = this;

    $("#add_creature").click(function(e){
      var cmc = $("#creature_cmc").val();

      var creature = mojosto.getRandomCard("Creature", cmc);
      var equipment = mojosto.getRandomCard("Equipment", cmc);
      creature.equipment = [equipment];

      var card_instance = 1;
      var creature_placed = false;
      var new_element_id;
      while (!creature_placed){
        new_element_id = creature.multiverseid+"-"+card_instance;
        if( mojosto.battlefield[new_element_id] == undefined ){
          mojosto.battlefield[new_element_id] = creature.clone(new_element_id);
          creature_placed = true;
        } else {
          card_instance++;
        }
      }

      card_instance = 1;
      var equipment_placed = false;
      while (!equipment_placed){
        new_element_id = equipment.multiverseid+"-"+card_instance;
        if( mojosto.battlefield[new_element_id] == undefined ){
          mojosto.battlefield[new_element_id] = equipment.clone(new_element_id);
          equipment_placed = true;
        } else {
          card_instance++;
        }
      }

      mojosto.buildBattlefield();


    });

    $("#get_instants").click(function(e){

    });

    $("#get_sorceries").click(function(e){

    });

    $(document).contextmenu({
        delegate: ".cardmenu",
        menu: [
          {title: "Tap/Untap", action: function(event, ui){
            var element_id = ui.target.parent().attr("id");
            mojosto.battlefield[element_id].toggleTapped();
          }},

          {title: "Add Counter", action: function(event, ui){
            var element_id = ui.target.parent().attr("id");
          }},

          {title: "Remove Counter", action: function(event, ui){
            var element_id = ui.target.parent().attr("id");
          }},

          {title: "Unequip", action: function(event, ui){            
            var element_id = ui.target.parent().attr("id");
            var equipment = mojosto.battlefield[element_id];
            equipment.unattach();
            
            var card_instance = 1;   
            var equipment_placed = false;

            while (!equipment_placed){
              new_element_id = equipment.multiverseid+"-"+card_instance;
              if( mojosto.unequiped[new_element_id] == undefined ){
                mojosto.unequiped[new_element_id] = equipment.clone(new_element_id);
                equipment_placed = true;
              } else {
                card_instance++;
              }
            }

            delete mojosto.battlefield[element_id];

            mojosto.buildBattlefield();
            mojosto.buildUnequiped();
          }},

          {title: "Graveyard", action: function(event, ui){            
            var element_id = ui.target.parent().attr("id");
          }},

          {title: "Exile", action: function(event, ui){            
            var element_id = ui.target.parent().attr("id");
          }},

          {title: "To Hand", action: function(event, ui){            
            var element_id = ui.target.parent().attr("id");
          }},

          {title: "Top of Library", action: function(event, ui){            
            var element_id = ui.target.parent().attr("id");
          }},

          {title: "Z Level Up", action: function(event, ui){            
            var element_id = ui.target.parent().attr("id");
          }},

          {title: "Z Level Down", action: function(event, ui){            
            var element_id = ui.target.parent().attr("id");
          }},

        ],
        hide: 0,
        show: 0,
    });
  };

  MoJoSto.prototype.initCardLookup = function(){ 
    var mtgjson = this.mtgjson;
    var card_lookup = this.card_lookup;

    for (var set in mtgjson){
      mtgjson[set].cards.forEach(function(c){
        if (c.multiverseid != undefined){
          if (c.layout == "token"){
            c.types = ["Creature", "Token"];
            c.type = "token";
            c.cmc = 0;
          }

          c.set_name = mtgjson[set].name;
          c.set_releaseDate = mtgjson[set].releaseDate;

          var lookup_group;

          if (c.types.indexOf("Creature") != -1 ){
            lookup_group = "Creature";
          } else if (c.type == "Artifact — Equipment") {
            lookup_group = "Equipment";
          } else if (c.type == "Instant"){
            lookup_group = "Instant";
          } else if (c.type == "Sorcery"){
            lookup_group = "Sorcery";
          }
          

          if (lookup_group == "Creature" || lookup_group == "Equipment"){
            var card_cmc_group = card_lookup[lookup_group][c.cmc];
            if(card_cmc_group == undefined){
              card_lookup[lookup_group][c.cmc] = {};
              card_cmc_group = card_lookup[lookup_group][c.cmc];
            } 
            if(card_cmc_group[c.name] == undefined){
              card_cmc_group[c.name] = new Card(c);
            }

          } else if (lookup_group == "Sorcery" || lookup_group == "Instant"){
            card_lookup[lookup_group].push(new Card(c));
          }
        }  
      });    
    }

    delete card_lookup["Creature"][undefined];
    delete card_lookup["Creature"][0.5];


    card_lookup["Creature"].forEach(function(cmc_object,i){
      var new_cmc_array = [];

      for (var card_name in cmc_object){
        new_cmc_array.push(cmc_object[card_name]);
      }

      card_lookup["Creature"][i] = new_cmc_array;
    });

    card_lookup["Equipment"].forEach(function(cmc_object,i){
      var new_cmc_array = [];

      for (var card_name in cmc_object){
        new_cmc_array.push(cmc_object[card_name]);
      }

      card_lookup["Equipment"][i] = new_cmc_array;
    });
  };

  MoJoSto.prototype.getRandomCard = function(type, cmc){
    var cards;
    var card_lookup = this.card_lookup;

    if (Array.isArray(card_lookup[type][0])){
      if (type == "Creature") {
        if (cmc){
          cards = card_lookup[type][cmc];
        } else {
          cards = card_lookup[type];
        }
      } else if (type == "Equipment"){
        if (cmc){
          cards = card_lookup[type].slice(0,cmc+1);
        } else {
          cards = card_lookup[type];
        }
      }

      cards = [].concat.apply([],cards);    
    } else {
      cards = card_lookup[type];
    }

    return cards[Math.floor(Math.random() * cards.length)];
  };

  MoJoSto.prototype.buildBattlefield = function(){
    $(".card").off("click");
    $("#battlefield .zone_content").html("");

    for (var card_id in this.battlefield) {
      var card = this.battlefield[card_id];
      card.attach("image", "#battlefield .zone_content");
      
    }

    $("#battlefield .zone_content").show();
  }

  MoJoSto.prototype.buildUnequiped = function(){
    $(".card").off("click");
    $("#unequiped .zone_content").html("");

    for (var card_id in this.unequiped) {
      var card = this.unequiped[card_id];
      card.attach("name", "#unequiped_equipment .zone_content");
    }

    $("#unequiped_equipment .zone_content").show();
  }

  MoJoSto.prototype.searchForCard = function(cardName){
    var found_cards = [];
    for (var set in this.mtgjson){
      this.mtgjson[set].cards.forEach(function(c){
        if (c.name == cardName){ 
          found_cards.push(c);
        }
      });
    }
    return found_cards;
  }

  MoJoSto.prototype.getAndShowCardArt = function(multiverseid){
    $.blockUI({ 
      message: '<p>click the card to close</p><img class="card_art" src="http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid='+multiverseid+'&type=card" />',
      fadeIn:  0, 
      onBlock: function(){
        $('.blockUI.blockMsg').center();
        
        $(".card_art").off("load").on("load", function() {
          $('.blockUI.blockMsg').center();
        }).each(function() {
          if(this.complete) $(this).load();
        });
        
        $(".card_art").off('click').on("click", function(){
          $.unblockUI({
            fadeOut: 0
          });
        })
      },
      css: {
        width: "auto",
      }

    });
  }

  return MoJoSto;
})();

var mojosto;
$(function(){
  mojosto = new MoJoSto();
});
