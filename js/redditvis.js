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
  .data(function() { return getY().ticks(); })
  .bottom(function(d) { return getY()(d); })
  .strokeStyle(function(d) {return d ? "#eee" : "#000"; })
  .anchor("left").add(pv.Label)
  .text(function(d) { return d; });

  /* X-axis and ticks. */
  vis.add(pv.Rule)
   .data(function() { return getX().ticks(); })
   .left(function(d) { return getX()(d); })
   .strokeStyle(function(d) { return d ? "#eee" : "#000"; })
  .anchor("bottom").add(pv.Label)
   .text(function(d) { return format_date(d); });

  /* The plot */
  vis.add(pv.Panel)
    .data(function() { return aRed.data; })
  .add(pv.Dot)
    .left(function(d) { return getX()((d.data.created_utc)); })
    .bottom(function(d) { return getY()(d.data.ups - d.data.downs); })
    .shape(function(d) { return d.kind == "t1" ? "circle" : "triangle"; })
    .size(function(d) { return ((d.data.ups - d.data.downs)/aRed.get_max_score())* 100 })
    .strokeStyle(function(d) { return aRed.get_color(d).alpha(.8); })
    .fillStyle(function(d) { return vis.active() && vis.active().data.subreddit == d.data.subreddit ? aRed.get_color(d).alpha(.8) : aRed.get_color(d).alpha(.2); })
    .event("mouseover", function(d) { return vis.active(d); })
    .event("mouseout", function(d) { return vis.active(false); });

  //vis.render(); 
}