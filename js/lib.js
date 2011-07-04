/**
 * Object representing a redditor and 
 * related important information
 */
function Redditor()
{
  this.debug = false;
  this.username = "";
  this.raw_data = new Array();
  this.data = new Array();
  this.comments_after = "";
  this.submitted_after = "";
  this.subreddits = { min_count : 1, max_count: 1, r : {} }; // subreddits['nyc'] = {num: xxx, color: #xxx}
  this.filters = { comments: true, submitted: true };

  this.get_color = function(d) {
    return pv.Scale.linear(0, this.subreddits.max_count/2, this.subreddits.max_count)
	  .range('red', 'yellow', 'green')(this.subreddits.r[d.data.subreddit].count);  
  }

  /* getters for ovreall data */
  this.get_min_date = function() { 
    return pv.min(this.data.map(function(d) { return d.data.created; }));
  };
  this.get_max_date = function() { 
    return pv.max(this.data.map(function(d) { return d.data.created; }));
  }; 
  this.get_min_score = function() { 
    return pv.min(this.data.map(function(d) { return d.data.ups - d.data.downs; }));
  };  
  this.get_max_score = function() { 
    return pv.max(this.data.map(function(d) { return d.data.ups - d.data.downs; }));
  };

  this.clear = function() {
    this.data = new Array();
	this.raw_data = new Array();
	this.comments_after = "";
	this.submitted_after = "";
	this.subreddits = { min_count : 1, max_count: 1, r : {} };
  }
  
  this.update = function() {
    // show the right kind of data
    if (this.filters.comments && this.filters.submitted) {
	  this.data = this.raw_data;
	} else if (this.filters.comments && !this.filters.submitted) {
	  this.data = this.raw_data.filter(function(d) { return d.kind == "t1"; });
	} else if (!this.filters.comments && this.filters.submitted) {
	  this.data = this.raw_data.filter(function(d) { return d.kind == "t3"; });
	}
	vis.render();
  }
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