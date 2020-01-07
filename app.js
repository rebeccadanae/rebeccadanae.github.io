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
    .range([0, height]);

var xAxis = d3.svg.axis()
    .scale(x0)
    .tickSize(0)
    .orient("top");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .innerTickSize(-width)
    .outerTickSize(0)
    .tickPadding(10);

var color = d3.scale.ordinal()
    .range(["#053769","#65a4e5","#ff5e1a"]);


var svg1 = d3.select(".graph-left").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var svg2 = d3.select(".graph-right").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform","translate(" + margin.left + "," + margin.top + ")");



          d3.csv("/interactive_data_zip.csv", function(error, data) {
            var selected_zip = data.filter(function(d){return d.zip == 35123})[0];
            var jsonData1 = [
                {
                    "year": "2009",
                    "values": [
                        {
                            "value": selected_zip.lost_elig_nat_pop2009,
                            "rate": "National"
                        },
                        {
                            "value": selected_zip.lost_elig_state_pop2009,
                            "rate": "State"
                        },
                        {
                            "value": selected_zip.lost_elig_county_pop2009,
                            "rate": "County"
                        }
                    ]
                },
                {
                    "year": "2017",
                    "values": [
                        {
                            "value": selected_zip.lost_elig_nat_pop2017,
                            "rate": "National"
                        },
                        {
                            "value": selected_zip.lost_elig_state_pop2017,
                            "rate": "State"
                        },
                        {
                            "value": selected_zip.lost_elig_county_pop2017,
                            "rate": "County"
                        }
                    ]
                }
            ]

            var jsonData2 = [
                {
                    "year": "2009",
                    "values": [
                        {
                            "value": selected_zip.lost_elig_nat_HH2009,
                            "rate": "National"
                        },
                        {
                            "value": selected_zip.lost_elig_state_HH2009,
                            "rate": "State"
                        },
                        {
                            "value": selected_zip.lost_elig_county_HH2009,
                            "rate": "County"
                        }
                    ]
                },
                {
                    "year": "2017",
                    "values": [
                        {
                            "value": selected_zip.lost_elig_nat_HH2017,
                            "rate": "National"
                        },
                        {
                            "value": selected_zip.lost_elig_state_HH2017,
                            "rate": "State"
                        },
                        {
                            "value": selected_zip.lost_elig_county_HH2017,
                            "rate": "County"
                        }
                    ]
                }
            ]

            var categoriesNames1 = jsonData1.map(function(d) { return d.year; });
            var rateNames1 = jsonData1[0].values.map(function(d) { return d.rate; });
            var categoriesNames2 = jsonData2.map(function(d) { return d.year; });
            var rateNames2 = jsonData2[0].values.map(function(d) { return d.rate; });

            x0.domain(categoriesNames1);
            x1.domain(rateNames1).rangeRoundBands([0, x0.rangeBand()], .2);
            y.domain([0, d3.max(jsonData1, function(year) { return d3.max(year.values, function(d) { return 100*(d.value); }); })]);

            x0.domain(categoriesNames2);
            x1.domain(rateNames2).rangeRoundBands([0, x0.rangeBand()], .2);
            y.domain([0, d3.max(jsonData2, function(year) { return d3.max(year.values, function(d) { return 100*(d.value); }); })]);

            svg1.append("g")
                .attr("class", "x axis")
                .call(xAxis);

            svg2.append("g")
                    .attr("class", "x axis")
                    .call(xAxis);

            svg1.append("g")
                .attr("class", "y axis")
                .style('opacity','0')
                .call(yAxis)

            svg2.append("g")
                .attr("class", "y axis")
                .style('opacity','0')
                .call(yAxis)

            svg1.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -50)
                .attr("x", 20)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .style('font-weight','bold')
                .text("Percent decrease in eligibility (population)");

            svg2.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -50)
                .attr("x", 20)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .style('font-weight','bold')
                .text("Percent decrease in eligibility (household)");

            svg1.append("text")
                .attr("y", 285)
                .attr("x", 50)
                .style('font-weight', 'bold')
                .style('font-size', 18)
                .text("U.S. Population")

            svg2.append("text")
                .attr("y", 285)
                .attr("x", 50)
                .style('font-weight', 'bold')
                .style('font-size', 18)
                .text("SNAP Households")

            svg1.select('.y').transition().duration(500).delay(1300).style('opacity','1');
            svg2.select('.y').transition().duration(500).delay(1300).style('opacity','1');


            var slice1 = svg1.selectAll(".slice1")
                .data(jsonData1)
                .enter().append("g")
                .attr("class", "g")
                .attr("transform",function(d) {
                  return "translate(" + x0(d.year) + ",0)"; });

          var slice2 = svg2.selectAll(".slice2")
              .data(jsonData2)
              .enter().append("g")
              .attr("class", "g")
              .attr("transform",function(d) {
              return "translate(" + x0(d.year) + ",0)"; });

            slice1.selectAll("rect")
                .data(function(d) { return d.values; })
            .enter().append("rect")
                .attr("width", x1.rangeBand())
                .attr("x", function(d) { return x1(d.rate); })
                .style("fill", function(d) { return color(d.rate) })
                .attr("y", function(d) { return 0; })
                .attr("height", function(d) { return y(0); })
                .on("mouseover", function(d) {
                    d3.select(this).style("fill", d3.rgb(color(d.rate)).darker(2));
                })
                .on("mouseout", function(d) {
                    d3.select(this).style("fill", color(d.rate));
                });

                slice2.selectAll("rect")
                    .data(function(d) { return d.values; })
                .enter().append("rect")
                    .attr("width", x1.rangeBand())
                    .attr("x", function(d) { return x1(d.rate); })
                    .style("fill", function(d) { return color(d.rate) })
                    .attr("y", function(d) { return 0; })
                    .attr("height", function(d) { return y(0); })
                    .on("mouseover", function(d) {
                        d3.select(this).style("fill", d3.rgb(color(d.rate)).darker(2));
                    })
                    .on("mouseout", function(d) {
                        d3.select(this).style("fill", color(d.rate));
                    });

            slice1.selectAll("rect")
                .transition()
                .delay(function (d) {return Math.random()*1000;})
                .duration(1000)
                .attr("y", function(d) { return 0; })
                .attr("height", function(d) { return y(100*(d.value)); });

          slice2.selectAll("rect")
                .transition()
                .delay(function (d) {return Math.random()*1000;})
                .duration(1000)
                .attr("y", function(d) { return 0; })
                .attr("height", function(d) { return y(100*(d.value)); });

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
