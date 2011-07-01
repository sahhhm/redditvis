/**
 * Object representing a redditor and 
 * related important information
 */
function Redditor()
{
  this.username = "";
  this.comments = new Array();
  this.comments_after = "";
  this.submitted = new Array();
  this.submitted_after = "";

  this.test = function() {  
		$.each(this.comments, function(d, val) {
			alert(val.data.subreddit);
		});
		  };

  /* getters for comment data */
  this.get_min_score_comments = function() { 
    return pv.min(this.comments.map(function(d) {return d.data.ups - d.data.downs;})); 
  };
  this.get_max_score_comments = function() { 
    return pv.max(this.comments.map(function(d) {return d.data.ups - d.data.downs;})); 
  };
  this.get_min_date_comments = function() { 
    return pv.min(this.comments.map(function(d) {return d.data.created;})); 
  };
  this.get_max_date_comments = function() { 
    return pv.max(this.comments.map(function(d) {return d.data.created;})); 
  };
  
  /* getters for submitted data */
  this.get_min_score_submitted = function() { 
    return pv.min(this.submitted.map(function(d) {return d.data.ups - d.data.downs;})); 
  };
  this.get_max_score_submitted = function() { 
    return pv.max(this.submitted.map(function(d) {return d.data.ups - d.data.downs;})); 
  };
  this.get_min_date_submitted = function() { 
    return pv.min(this.submitted.map(function(d) {return d.data.created;})); 
  };
  this.get_max_date_submitted = function() { 
    return pv.max(this.submitted.map(function(d) {return d.data.created;})); 
  };  
  
  /* getters for ovreall data */
  this.get_min_date = function() { 
    return Math.min(this.get_min_date_comments(), this.get_min_date_submitted());
  };
  this.get_max_date = function() { 
    return Math.max(this.get_max_date_comments(), this.get_max_date_submitted());
  }; 
  this.get_min_score = function() { 
    return Math.min(this.get_min_score_comments(), this.get_min_score_submitted());
  };  
  this.get_max_score = function() { 
    return Math.max(this.get_max_score_comments(), this.get_max_score_submitted());
  };  
  this.debug = true;
}

/**
 * A function to format an epoch datetime
 * @param utc - an integer representing a utc time
 * @returns - the desired date representation
 */
function format_date(utc) {
  var d = new Date(utc * 1000);
  return d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear();
}