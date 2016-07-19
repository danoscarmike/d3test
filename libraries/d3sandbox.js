function sandBox() {

  var width = parseInt(d3.select("#blurb").style("width")),
    height = width/2;

  var container = d3.select("#viz").style("position","relative")

  var svg = container.append("svg")
              .attr("width",width).attr("height",height);

  svg.append("rect")
      .attr("height","100%").attr("width","100%")
      .attr("fill","#ccc")
      .on("mouseover",tooltip)
      .on("mousemove",tooltip)
      .on("mouseout",hide);

  var nameTip = d3.select("#viz")
    .append("div")
    .attr("class", "tooltip")
    .style("fill-opacity", 0);

  function tooltip() {
    nameTip
      .transition()
      .duration(500)
      .style("opacity", 0.9);

    nameTip
      .html("TEST")
      .style("left",d3.mouse(this)[0] + 'px')
      .style("top",d3.mouse(this)[1] + 'px');
  }

  function hide() {
    nameTip.style("opacity", 0);
  }

}
