function redditvis(aRed) {
  /* Sizing and scales. */
  var w = 800,
  h1 = 400,
  h2 = 30;

  var i = {x:0, dx:800};
  
  function getX() {
    return pv.Scale.linear(aRed.filters.min_date, aRed.filters.max_date).range(0, w);
  }  
  
  function getXContext() {
    return pv.Scale.linear(aRed.filters.min_date_global, aRed.filters.max_date_global).range(0, w);  
  }

  function getY() {
    return pv.Scale.linear(aRed.filters.min_score, aRed.filters.max_score).range(0, h1);
  }

  function getYContext() {
    return pv.Scale.linear(aRed.filters.min_score_global, aRed.filters.max_score_global).range(0, h2);
  }  
  
  /* The root panel. */
  vis = new pv.Panel()
  .width(w)
  .height(h1 + h2 + 20)
  .bottom(20)
  .left(20)
  .right(10)
  .top(5)
  .def("active", false); // vis.active -> currently hovered data element

  
  var rvis = vis.add(pv.Panel)
    .top(0)
    .height(h1);  
  
  /* Y-axis and ticks. */
  rvis.add(pv.Rule)
    .data(function() { return getY().ticks(); })
    .bottom(function(d) { return getY()(d); })
    .strokeStyle(function(d) {return d ? "#eee" : "#000"; })
  .anchor("left").add(pv.Label)
    .text(function(d) { return d; });

  /* X-axis and ticks. */
  rvis.add(pv.Rule)
    .data(function() { return getX().ticks(); })
    .left(function(d) { return getX()(d); })
    .strokeStyle(function(d) { return d ? "#eee" : "#000"; })
   .anchor("bottom").add(pv.Label)
    .text(function(d) { return format_date(d); });

  /* The plot */
  rvis.add(pv.Panel)
    .data(function() { return aRed.data; })
  .add(pv.Dot)
    .left(function(d) { return getX()((d.data.created_utc)); })
    .bottom(function(d) { return getY()(d.data.ups - d.data.downs); })
    .shape(function(d) { return d.kind == "t1" ? "circle" : "triangle"; })
    .size(function(d) { return ((d.data.ups - d.data.downs)/aRed.filters.max_score)* 100 })
    .strokeStyle(function(d) { return aRed.get_color(d).alpha(.8); })
    .fillStyle(function(d) { return vis.active() && vis.active().data.subreddit == d.data.subreddit ? aRed.get_color(d).alpha(.8) : aRed.get_color(d).alpha(.2); })
    .event("mouseover", function(d) { return vis.active(d); })
    .event("mouseout", function(d) { return vis.active(false); });

  /* Context panel (zoomed out). */
  var context = vis.add(pv.Panel)
    .bottom(0)
    .height(h2);    
   
  /* X-axis ticks. */
  context.add(pv.Rule)
    .data(function() { return getXContext().ticks(); })
    .left(function(d) { return getXContext()(d); })
    .strokeStyle("#eee")
  .anchor("bottom").add(pv.Label)
    .text(function(d) { return format_date(d); });
    
  /* Y-axis ticks. */
  context.add(pv.Rule)
    .bottom(0);
  
/* 
  context.add(pv.Bar)
    .data(function () { return aRed.data_context; })
    .left(function(d) { return getXContext()(d.date); })
    .height(function(d) { return d.count * 10; })
    .width(1)
    .bottom(0)
    .title(function(d) { return d.count; })
    .fillStyle("steelblue");
*/
  context.add(pv.Dot)
    .data(function() { return aRed.raw_data; })
    .left(function(d) { return getXContext()((d.data.created_utc)); })
    .bottom(function(d) { return getYContext()(d.data.ups - d.data.downs); })
    .shape(function(d) { return d.kind == "t1" ? "circle" : "triangle"; })
    .size(function(d) { return ((d.data.ups - d.data.downs)/aRed.filters.max_score_global)* 10 });
    //.strokeStyle(function(d) { return aRed.get_color(d).alpha(.8); })
    //.fillStyle(function(d) { return vis.active() && vis.active().data.subreddit == d.data.subreddit ? aRed.get_color(d).alpha(.8) : aRed.get_color(d).alpha(.2); })
    //.event("mouseover", function(d) { return vis.active(d); })
    //.event("mouseout", function(d) { return vis.active(false); });

  context.add(pv.Panel)
    .data([i])
    .cursor("crosshair")
    .events("all")
    .event("mousedown", pv.Behavior.select())
    .event("select", focus)
  .add(pv.Bar)
    .left(function(d) { return d.x; })
    .width(function(d) { return d.dx; })
    .fillStyle("rgba(255, 128, 128, .4)")
    .cursor("move")
    .event("mousedown", pv.Behavior.drag())
    .event("drag", focus);
    
  function focus() {
    var x = getXContext().invert(i.x);
    var dx = getXContext().invert(i.x +i.dx);
    aRed.filters.min_date = Math.min(x, dx);
    aRed.filters.max_date = Math.max(x, dx);
    aRed.update();
  }
  //vis.render(); 
}