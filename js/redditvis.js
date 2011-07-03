function redditvis(aRed) {
  /* Sizing and scales. */
  var w = 800,
  h = 400;

  function getX() {
    return pv.Scale.linear(aRed.get_min_date(), aRed.get_max_date()).range(0, w);
  }

  function getY() {
    return pv.Scale.linear(aRed.get_min_score(), aRed.get_max_score()).range(0, h);
  }

  /* The root panel. */
  vis = new pv.Panel()
  .width(w)
  .height(h)
  .bottom(20)
  .left(20)
  .right(10)
  .top(5)
  .def("active", false); // vis.active -> currently hovered data element

  /* Y-axis and ticks. */
  vis.add(pv.Rule)
  .data(function() getY().ticks())
  .bottom(function(d) getY()(d))
  .strokeStyle(function(d) d ? "#eee" : "#000")
  .anchor("left").add(pv.Label)
  .text(function(d) d);

  /* X-axis and ticks. */
  vis.add(pv.Rule)
   .data(function() getX().ticks())
   .left(function(d) getX()(d))
   .strokeStyle(function(d) d ? "#eee" : "#000")
  .anchor("bottom").add(pv.Label)
   .text(function(d) format_date(d));

  /* The comment plot */
  vis.add(pv.Panel)
    .data(function() aRed.comments)
  .add(pv.Dot)
    .left(function(d) getX()((d.data.created_utc)))
    .bottom(function(d) getY()(d.data.ups - d.data.downs))
	.shape("circle")
    .size(function(d) ((d.data.ups - d.data.downs)/aRed.get_max_score_comments())* 100)
	.strokeStyle(function(d) aRed.get_color_scale(d).alpha(.8))
	.fillStyle(function(d) vis.active() && vis.active().data.subreddit == d.data.subreddit ? aRed.get_color_scale(d).alpha(.8) : aRed.get_color_scale(d).alpha(.2))
    .event("mouseover", function(d) vis.active(d))
    .event("mouseout", function(d) vis.active(false));

  /* The submitted plot */
  /*
  vis.add(pv.Panel)
    .data(function() aRed.submitted)
  .add(pv.Dot)
    .left(function(d) getX()(d.data.created_utc))
    .bottom(function(d) getY()(d.data.ups - d.data.downs))
    .shape("triangle")
    .size(function(d) ((d.data.ups - d.data.downs)/aRed.get_max_score_submitted()) * 100)
	.strokeStyle(function(d) aRed.get_color_scale(d).alpha(.8))
	.fillStyle(function(d) vis.active() && vis.active().data.subreddit == d.data.subreddit ? aRed.get_color_scale(d).alpha(.8) : aRed.get_color_scale(d).alpha(.2))
    .event("mouseover", function(d) vis.active(d))
    .event("mouseout", function(d) vis.active(false));
  */
  //vis.render(); 
}