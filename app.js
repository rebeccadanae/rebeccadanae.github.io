"use strict";
!(function() {
  function analytics(action) {
    var label =
      1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "null";
    window.dataLayer.push({
      event: "Interactive",
      category: "Interactive",
      action: action,
      label: label
    });
  }

  console.log("test");

  function buildGraphs() {

  }
  function app() {
    var margin = {top: 60, right: 60, bottom: 100, left: 100},
    width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .2);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x0)
    .tickSize(0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .innerTickSize(-width)
    .outerTickSize(0)
    .tickPadding(10);

var color = d3.scale.ordinal()
    .range(["#053769","#65a4e5","#ff5e1a"]);


var svg = d3.select(".graph-left").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

          d3.json("data.json", function(error, data) {

            console.log(d3.min(data, function(categorie) { return d3.min(categorie.values, function(d) { return d.value; }); }));
            var categoriesNames = data.map(function(d) { return d.categorie; });
            var rateNames = data[0].values.map(function(d) { return d.rate; });

            x0.domain(categoriesNames);
            x1.domain(rateNames).rangeRoundBands([0, x0.rangeBand()], .2);
            y.domain([0, d3.max(data, function(categorie) { return d3.max(categorie.values, function(d) { return d.value; }); })]);

            svg.append("g")
                .attr("class", "x axis")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .style('opacity','0')
                .call(yAxis)

            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -50)
                .attr("x", -10)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .style('font-weight','bold')
                .text("Percent decrease in eligibility");

            svg.append("text")
                .attr("y", 285)
                .attr("x", 80)
                .style('font-weight', 'bold')
                .style('font-size', 18)
                .text("June 2009")

            svg.select('.y').transition().duration(500).delay(1300).style('opacity','1');

            var slice = svg.selectAll(".slice")
                .data(data)
                .enter().append("g")
                .attr("class", "g")
                .attr("transform",function(d) { return "translate(" + x0(d.categorie) + ",0)"; });

            slice.selectAll("rect")
                .data(function(d) { return d.values; })
            .enter().append("rect")
                .attr("width", x1.rangeBand())
                .attr("x", function(d) { return x1(d.rate); })
                .style("fill", function(d) { return color(d.rate) })
                .attr("y", function(d) { return y(0); })
                .attr("height", function(d) { return height - y(0); })
                .on("mouseover", function(d) {
                    d3.select(this).style("fill", d3.rgb(color(d.rate)).darker(2));
                })
                .on("mouseout", function(d) {
                    d3.select(this).style("fill", color(d.rate));
                });

            slice.selectAll("rect")
                .transition()
                .delay(function (d) {return Math.random()*1000;})
                .duration(1000)
                .attr("y", function(d) { return y(d.value); })
                .attr("height", function(d) { return height - y(d.value); });
});
  }


  document.addEventListener(
    "readystatechange",
    function() {
      "interactive" === document.readyState && app(),
        "complete" === document.readyState && buildGraphs();
    },
    !1
  );
})();
