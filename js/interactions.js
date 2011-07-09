/** Initial steps **/
$(function() { 
  $("#interactions").hide(); 
});

/** comments/submitted bottons **/        
$(function() {
  $("#buttongroup").tipsy({gravity: 's', fade: true, trigger: 'manual',
                     fallback: "You must view at least one type of data"})
                   .buttonset();

  $("#submitted_button, #comment_button").click(function() {	  
    var this_id = "#" + this.id;
    var other_id = this_id == "#submitted_button" ? "#comment_button" : "#submitted_button";
      
    if (!$(other_id).is(":checked")) {
      $(this_id).prop("checked", true);
      $(this_id).button("refresh");    
      $("#buttongroup").tipsy("show");
      setTimeout("$('#buttongroup').tipsy('hide')", 1000);
    } else {    
      my_redditor.filters.comments = $("#comment_button").is(":checked");
      my_redditor.filters.submitted = $("#submitted_button").is(":checked");
      my_redditor.update();
    }       
  });    
});
  
/** selectable subreddits **/
$(function() {          
  $("#selectable_subreddits").bind("mousedown", function(e) {
    e.metaKey = true; // force "ctrl" for the user
  }).selectable({
    stop: function() {
        my_redditor.update();
    }
  }); 

  
  $("#subreddits_all").bind("click", function() { 
    $('.selectable').each(function() {
        if (!$(this).hasClass("ui-selected")) {
          $(this).addClass("ui-selected");   
        }
        my_redditor.update();
    });
  });
  
  $("#subreddits_none").bind("click", function() { 
    $('.selectable').each(function() {
        if ($(this).hasClass("ui-selected")) {
          $(this).removeClass("ui-selected");   
        }
        my_redditor.update();
    });
  });
  
  // filter the subreddits as the user types
  $("#subreddits_opts_text").bind("keyup", function() {
    var text = $(this).val().toLowerCase();
    $('.selectable').each(function() {
        $(this).text().toLowerCase().match(text) ? $(this).show("medium") : $(this).hide("medium");
    });            
  });
});
  
/** Submit button for choosing new username **/
$(function() {
  $("#username_submit").click(function() {  
      my_redditor.username = $("#username_input").val();
      $("#selectable_subreddits").empty();
      get_data(my_redditor);	
      
      // show the filters
      $("#interactions").fadeIn(5000);
  });
});