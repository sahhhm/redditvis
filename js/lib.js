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
  this.data_context = new Array();
  this.subreddits = { min_count : 1, max_count: 1, r : {} }; 
  this.filters = { comments: true, submitted: true, 
                   min_date: 0, max_date: 0, 
                   min_date_global: 0, max_date_global: 0,
                   min_score: 0, max_score: 0,
                   min_score_global: 0, max_score_global: 0};

  this.get_color = function(d) {
    return pv.Scale.linear(0, this.subreddits.max_count/2, this.subreddits.max_count)
      .range('red', 'yellow', 'green')(this.subreddits.r[d.data.subreddit].count);  
  }

  this.clear = function() {
    this.data = new Array();
    this.raw_data = new Array();
    this.comments_after = "";
    this.submitted_after = "";
    this.subreddits = { min_count : 1, max_count: 1, r : {} };
  }
  
  /** clean function up!! **/
  this.update = function() {
    // show the right kind of data (submitted/comments)
    if (this.filters.comments && this.filters.submitted) {
      this.data = this.raw_data;
    } else if (this.filters.comments && !this.filters.submitted) {
      this.data = this.raw_data.filter(function(d) { return d.kind == "t1"; });
    } else if (!this.filters.comments && this.filters.submitted) {
      this.data = this.raw_data.filter(function(d) { return d.kind == "t3"; });
    }
    
    // display the correct date range
    var mind = this.filters.min_date;
    var maxd = this.filters.max_date;
    this.data = this.data.filter(function(d) { return d.data.created >= mind && d.data.created <= maxd; });

    // scale the score
    this.filters.min_score = pv.min(this.data.map(function(d) { return d.data.ups - d.data.downs; }));
    this.filters.max_score = pv.max(this.data.map(function(d) { return d.data.ups - d.data.downs; }));
    if (this.filters.min_score == this.filters.max_score) {
      this.filters.min_score -= this.filters.min_score/2;
      this.filters.max_score += this.filters.max_score/2;
    }

    // display the correct score range
    var mins = this.filters.min_score;
    var maxs = this.filters.max_score;
    this.data = this.data.filter(function(d) { 
      var score = d.data.ups - d.data.downs;
      return score >= mins && score <= maxs;
    });
    
    // display only data points from the selected subreddits (defaults to all)
    var r = this;
    var temp_data = new Array();
    $('.ui-selected').each(function() {
      var sub = $(this).text();
      temp_data = temp_data.concat(r.data.filter(function(d) { return d.data.subreddit == sub; }));
    });
    this.data = temp_data;
    
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