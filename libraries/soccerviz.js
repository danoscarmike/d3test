
//main function to be called 'on load' of d3ia.html <body>
function createSoccerViz() {
  d3.csv("data/worldcup.csv", function(data) {
    overallTeamViz(data);
  })
}

//define function to be called once 'createSoccerViz' has loaded dataset
function overallTeamViz(incomingData) {
  d3.select("svg")
    .append("g")
    .attr("id", "teamsG")
    .attr("transform", "translate(50,300)")
    .selectAll("g")
    .data(incomingData)
    .enter()
    .append("g")
    .attr("class", "overallG")
    .attr("transform",function (d,i) {return "translate(" + (i*50) + ", 0)"});

//create a div for modal dialog box for statistics
  d3.text("resources/modal.html", function(data) {
    d3.select("body").append("div").attr("id", "modal").html(data);
  });

  var teamG = d3.selectAll("g.overallG");

//append circles for each teamG with 'pulse' animation
  teamG
    .append("circle").attr("r",0)
    .transition()
    .delay(function(d,i) {return i*100;})
    .duration(500)
    .attr("r",40)
    .transition()
    .duration(500)
    .attr("r",20);

//append text labels for each teamG
  teamG
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", 30)
    .text(function(d) {return d.team;});

//insert image of each team's nataional flag
  teamG
    .insert("image", "text")
    .attr("xlink:href", function(d) {
      return "images/" + d.team + ".png";
    })
    .attr("width", "45px").attr("height", "20px")
    .attr("x", "-22").attr("y", "-10");

//add a click listener to populate statistics modal dialog
  teamG
    .on("click", teamClick);

//add a mouseover listener to highlight the teams in the same region
  teamG
    .on("mouseover", highlightRegion)

//add mouseout listener
  teamG
    .on("mouseout", unHighlight)

//exclude text from the pointer-events (only circles)
  teamG
    .select("text").style("pointer-events","none")

//define function for click behavior
  function teamClick(d) {
    d3.selectAll("td.data").data(d3.values(d))
      .html(function(p) {
        return p;
      });
  }

//define function for mouseout behavior
  function unHighlight() {
    d3.selectAll("g.overallG").select("circle").style("fill","pink")
    d3.selectAll("g.overallG").select("text").attr("class","").attr("y",30)
  }

//define function for mouseover behavior
  function highlightRegion(d) {
    var teamColor = d3.rgb("pink")
    d3.select(this).select("text").classed("active",true).attr("y",10);
    d3.selectAll("g.overallG").select("circle")
      .style("fill", function(p) {
        return p.region == d.region ?
          teamColor.darker(.75) : teamColor.brighter(.5);
        });
    this.parentElement.appendChild(this);
  }

//create buttons from header row in dataset
  var dataKeys = d3.keys(incomingData[0]).filter(function(el) {
    return el != "team" && el != "region";});

  d3.select("#controls").selectAll("button.teams")
    .data(dataKeys).enter()
    .append("button")
    .on("click", buttonClick)
    .html(function(d) {return d;});

//define function for buttonClick
  function buttonClick(datapoint) {

    var maxValue = d3.max(incomingData, function(d) {
      return parseFloat(d[datapoint]);
    });

    var radiusScale = d3.scaleLinear().domain([0,maxValue]).range([2,20]);
    var threeRedScale = d3.scaleQuantize().domain([0,maxValue])
      .range(colorbrewer.Reds[3]);

    d3.selectAll("g.overallG").select("circle").transition().duration(1000)
    .attr("r", function(d) {
      return radiusScale(d[datapoint]);
      })
    .style("fill", function(p) {
      return threeRedScale(p[datapoint]);
      })
  }
}
