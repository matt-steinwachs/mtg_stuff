var mtgjson = null;

$(function(){
  var mtgjson_attr = {
    "All Sets": "set_name",
    "Most Recent Set": "set_name",
    "All Rarity": "rarity",
    "Lowest Rarity": "rarity",
    "Colors": "colors",
    "CMC": "cmc",
    "Power": "power",
    "Toughness": "toughness",
    "Text": "text",
    "Type": "type"
  }

  var rarity_order = ["Basic Land", "Common", "Uncommon", "Rare", "Mythic Rare", "Special"];

  Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] == deleteValue) {         
        this.splice(i, 1);
        i--;
      }
    }
    return this;
  };

  var arrayUnique = function(a) {
      return a.reduce(function(p, c) {
          if (p.indexOf(c) < 0) p.push(c);
          return p;
      }, []);
  };

  $.getJSON("AllSets.json", function(json) {
      mtgjson = json;
      $("#loading").hide();
      $("#page").show()
  });

  function searchForCard(cardName){
    var found_cards = [];
    for (var set in mtgjson){
      mtgjson[set].cards.forEach(function(c){
        if (c.name == cardName){ 
          c.set_name = mtgjson[set].name;
          c.set_releaseDate = mtgjson[set].releaseDate;
          found_cards.push(c);
        }
      });
    }

    return found_cards;
  }

  function parseDate(date_string){
    var date_parts = date_string.split("-");
    var date = new Date();
    date.setFullYear(date_parts[0], date_parts[1], date_parts[2]);
    return date;
  }

  function getAndShowCardArt(multiverseid){
    $.blockUI({ 
      message: '<p>click the card to close</p><img class="card_art" src="http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid='+multiverseid+'&type=card" />',
      onBlock: function(){
        $(".card_art").off('click').on("click", function(){
          $.unblockUI();
        })
      },

    });

  }

  $("#attributes_to_include").select2();

  $("#decklist_submit").click(function(){
    var cards = [];
    var attributes = $("#attributes_to_include").val();

    // Split the input and throw out quantities (TCGPlayer format)
    $("#decklist").val().split("\n").clean("").forEach(function(card_string){
      card_string_split = card_string.split(" ");
      if (!isNaN(card_string_split[0])){
        card_string_split.shift();
      }      
      cards.push(card_string_split.join(" "));        
    });
    

    // Destroy the datatable object and clear the table html before recreating it.
    if ($.fn.dataTable.isDataTable('#list')){ 
      $("#list").DataTable().destroy();
    }
    $('#list tbody').html("");
    $('#list thead tr').html("");

    $('#list thead tr').append("<th>Name</th>"); 
    attributes.forEach(function(attr){
      $('#list thead tr').append("<th>"+attr+"</th>"); 
    });



    //Search for card info and add it to the table html
    cards.forEach(function(card){
      var found_cards_info = searchForCard(card);

      if (found_cards_info.length > 0){    
        var name = found_cards_info[0].name;
        var multiverseid = undefined;

        var attributes_to_add = {};
        $("#attributes_to_include").val().forEach(function(attr){
          attributes_to_add[attr] = [];
        });

        found_cards_info.forEach(function(found_card){
          if (multiverseid == undefined) multiverseid = found_card.multiverseid;

          attributes.forEach(function(attr){ 
            var attr_value = found_card[mtgjson_attr[attr]];
            
            var push = true;

            if (attr == "Colors" && attr_value == undefined){
              attr_value = ["Colorless"];
            } else if (attr == "Power" && attr_value == undefined) {
              attr_value = "N/A";
            } else if (attr == "Toughness" && attr_value == undefined) {
              attr_value = "N/A";
            } else if (attr == "Lowest Rarity") {
              var push = false;
              if (attributes_to_add[attr].length == 0 || rarity_order.indexOf(attr_value) < rarity_order.indexOf(attributes_to_add[attr][0])){
                attributes_to_add[attr][0] = attr_value;
              }
            } else if (attr == "Most Recent Set") {
              var push = false;
              if (attributes_to_add[attr].length == 0 || parseDate(found_card.set_releaseDate) < parseDate(attributes_to_add[attr][1])){
                attributes_to_add[attr][0] = attr_value;
                attributes_to_add[attr][1] = found_card.set_releaseDate;
              }
            }

            if (push) attributes_to_add[attr].push(attr_value);
          });
        });

        var new_row = "<tr>";
        new_row += "<td><a href='#' id='"+multiverseid+"' class='get_card_art'>"+name+"</a></td>";
        attributes.forEach(function(attr){


          if (attr == "Colors"){
            attributes_to_add[attr].forEach(function(attr_value,i){
              attributes_to_add[attr][i] = attr_value.join(", ");
            });
          } else if (attr == "Most Recent Set") {
            attributes_to_add[attr] = [attributes_to_add[attr][0]];  //The set name will be in the first index and the release date will be in the second. Only take the set name.
          }
           
          attributes_to_add[attr] = arrayUnique(attributes_to_add[attr]);

          new_row += "<td>"+attributes_to_add[attr].join(", ")+"</td>";
        }); 
        new_row += "</tr>";

        $('#list tbody').append(new_row);
      } 

    });

    $(".get_card_art").off("click").on("click", function(){ 
      var multiverseid = $(this).attr("id");
      getAndShowCardArt(multiverseid);
    });

    $("#list_container").show();

    $("#list").DataTable({
      autoWidth: true,
      paging: false,
      dom: 'Bfrtip',
      buttons: [
          'excelHtml5',
          'csvHtml5'
      ]
    });
  });

});