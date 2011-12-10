/** Initial steps **/
$(function() { 
  $("#interactions").hide(); 
  
  // force controllers to be inactive on mouseup 
  // (fixes issue where user moves cursor off 
  //  of context bar while dragging)
  $("body").mouseup(function() { 
    if (vis.lactive()) vis.lactive(false);
    if (vis.ractive()) vis.ractive(false);	
  })
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
    stop: function(event, ui) {
      $('.selectable').each(function() {
	    var name = $(this).attr("name"); 
        // add custom `notselected` class if needed
		$(this).hasClass("ui-selected") ? $('.selectable.' + name).removeClass("notselected") :
		                                  $('.selectable.' + name).addClass("notselected");   
	  });	
      my_redditor.update();		
    }
  }); 

  
  $("#subreddits_all").bind("click", function() { 
    $('.selectable').each(function() {
        if (!$(this).hasClass("ui-selected")) $(this).addClass("ui-selected"); 		  
        if ($(this).hasClass("notselected")) $(this).removeClass("notselected");
        my_redditor.update();
    });
  });
  
  $("#subreddits_none").bind("click", function() { 
    $('.selectable').each(function() {
        if ($(this).hasClass("ui-selected")) $(this).removeClass("ui-selected");   
        if (!$(this).hasClass("notselected")) $(this).addClass("notselected");
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

/** hodgepodge of stuff that may need to be updated more than once **/
update_interactions = function(redd) {
    //update colors for subreddit based on most recent data
    $('.selectable').each(function() {
	  var name = $(this).attr("name"); 
      $('.selectable.ui-selected.' + name).css("background",redd.get_color_for_name(name).color);
	});
	
	//handle hovering over/out selectable subreddit name
    $("li[t|='sel-subreddit']").bind("mouseover", function() {
	  vis.selsub($(this)[0].textContent);
	  vis.render();
    });  
    $("li[t|='sel-subreddit']").bind("mouseout", function() {;
	  vis.selsub("");
	  vis.render();
    });  	
}