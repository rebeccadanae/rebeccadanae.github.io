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

  function buildGraphs() {}

  function app() {
    var zipData = [];
    zipData[1] = [
      {
        year: "2009",
        values: [
          { geo_level: "National", grpValue: 0.726696 },
          { geo_level: "State", grpValue: 1 },
          { geo_level: "County", grpValue: 1 }
        ]
      },
      {
        year: "2017",
        values: [
          { geo_level: "National", grpValue: 0.227346 },
          { geo_level: "State", grpValue: 1 },
          { geo_level: "County", grpValue: 1 }
        ]
      }
    ];
    zipData[2] = [
      {
        year: "2009",
        values: [
          { geo_level: "National", grpValue: 0.69374 },
          { geo_level: "State", grpValue: 1 },
          { geo_level: "County", grpValue: 1 }
        ]
      },
      {
        year: "2017",
        values: [
          { geo_level: "National", grpValue: 0.228431 },
          { geo_level: "State", grpValue: 1 },
          { geo_level: "County", grpValue: 1 }
        ]
      }
    ];

    //Initial graph setup
    var legend = d3.select(".legend-svg");

    legend
      .append("text")
      .attr("y", 30)
      .attr("x", 130)
      .style("font-weight", "bold")
      .attr("id", "state_name")
      .text("State");

    legend
      .append("text")
      .attr("y", 30)
      .attr("x", 230)
      .style("font-weight", "bold")
      .attr("id", "county_name")
      .text("County");

    var margin = { top: 60, right: 60, bottom: 100, left: 100 },
      width = 400 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // The scale spacing the groups:
    var x0 = d3
      .scaleBand()
      .rangeRound([0, width], 0.5)
      .padding(0.1);
    var x1 = d3.scaleBand().padding(0.05);
    var y = d3.scaleLinear().rangeRound([0, height]);
    var color = d3.scaleOrdinal().range(["#053769", "#65a4e5", "#ff5e1a"]);

    var xAxis = d3.axisTop().scale(x0);

    var yAxis = d3.axisLeft().scale(y);



    for (var i = 1; i < 3; ++i) {
      var categoriesNames = zipData[i].map(function(d) {
        return d.year;
      });
      var rateNames = zipData[i][0].values.map(function(d) {
        return d.geo_level;
      });

      x0.domain(categoriesNames);
      x1.domain(rateNames).rangeRound([0, x0.bandwidth()]);
      y.domain([
        0,
        d3.max(zipData[i], function(year) {
          return d3.max(year.values, function(d) {
            return d.grpValue;
          });
        })
      ]);

      var svg = [];
      var graph = [];
      var ylabels = ["population", "household"];
      var graphlabels = ["U.S. Population", "SNAP Households"];
      graph[i] = ".graph".concat(i);
      svg[i] = d3
        .select(graph[i])
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      svg[i]
        .append("g")
        .attr("class", "x axis")
        .call(xAxis);
      svg[i]
        .append("g")
        .attr("class", "y axis")
        .call(yAxis);
      svg[i]
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", 20)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style("font-weight", "bold")
        .text("Percent decrease in eligibility (".concat(ylabels[i - 1], ")"));
      svg[i]
        .append("text")
        .attr("y", 285)
        .attr("x", 40)
        .style("font-weight", "bold")
        .style("font-size", 18)
        .text(graphlabels[i - 1]);
      var slice = svg[i]
        .selectAll(".slice")
        .data(zipData[i])
        .enter()
        .append("g")
        .attr("class", "g")
        .attr("transform", function(d) {
          return "translate(" + x0(d.year) + ",0)";
        });

      slice
        .selectAll("rect")
        .data(function(d) {
          return d.values;
        })
        .enter()
        .append("rect")
        .attr("width", x1.bandwidth())
        .attr("x", function(d) {
          return x1(d.geo_level);
        })
        .style("fill", function(d) {
          return color(d.geo_level);
        })
        .attr("y", 0)
        .attr("height", function(d) {
          return y(d.grpValue);
        })
        .on("mouseover", function(d) {
          d3.select(this).style("fill", d3.rgb(color(d.geo_level)).darker(2));
        })
        .on("mouseout", function(d) {
          d3.select(this).style("fill", color(d.geo_level));
        });

        // data labels
      slice.selectAll(".text")
      .data(function(d) {
        return d.values;
      })
        .enter()
        .append("text")
        .attr("class","label")
        .attr("x", (function(d) { return x1(d.geo_level); }  ))
        .attr("y", function(d) { return y(d.grpValue - .05); })
        .attr("dy", ".75em")
        .text(function(d) { return (Math.round(1000 * d.grpValue)/10).toString().concat("%"); });
    }
    var input = document.getElementById("zip_search");
    //clear function

    input.addEventListener("search", function() {
      if (document.getElementById("zip_search").value === "") {
        reset();
      }
    });

    function reset() {
      d3.select("#error_message").remove();
      d3.selectAll("rect")
        .transition()
        .delay(function(d) {
          return Math.random() * 1000;
        })
        .duration(1000)
        .attr("height", y(0));
    }

    //trigger when go button is clicked

    document.getElementById("go").onclick = function() {
      reset();
      new_zip();
    };

    // click go button when enter key is selected
    input.addEventListener("keyup", function(event) {
      // Number 13 is the "Enter" key on the keyboard
      if (event.keyCode === 13) {
        // Trigger the button element with a click
        document.getElementById("go").click();
      }
    });

    function new_zip() {
      var zip_code = document.getElementById("zip_search").value;
      var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zip_code);
      if (isValidZip) {
        d3.selectAll("#state_name, #county_name").remove();
        d3.csv("/interactive_data_zip.csv").then(function(data) {
          var selected_zip = data.filter(function(d) {
            return d.zip == zip_code;
          })[0];
          var state_name = selected_zip.stname;
          var county_name = selected_zip.ctyname;

          legend
            .append("text")
            .attr("y", 30)
            .attr("x", 130)
            .style("font-weight", "bold")
            .attr("id", "state_name")
            .text(state_name);

          legend
            .append("text")
            .attr("y", 30)
            .attr("x", 230)
            .style("font-weight", "bold")
            .attr("id", "county_name")
            .text(county_name);

          zipData[1] = [
            {
              year: "2009",
              values: [
                {
                  geo_level: "National",
                  grpValue: Number(selected_zip.lost_elig_nat_pop2009)
                },
                {
                  geo_level: "State",
                  grpValue: Number(selected_zip.lost_elig_state_pop2009)
                },
                {
                  geo_level: "County",
                  grpValue: Number(selected_zip.lost_elig_county_pop2009)
                }
              ]
            },
            {
              year: "2017",
              values: [
                {
                  geo_level: "National",
                  grpValue: Number(selected_zip.lost_elig_nat_pop2017)
                },
                {
                  geo_level: "State",
                  grpValue: Number(selected_zip.lost_elig_state_pop2017)
                },
                {
                  geo_level: "County",
                  grpValue: Number(selected_zip.lost_elig_county_pop2017)
                }
              ]
            }
          ];

          zipData[2] = [
            {
              year: "2009",
              values: [
                {
                  geo_level: "National",
                  grpValue: Number(selected_zip.lost_elig_nat_HH2009)
                },
                {
                  geo_level: "State",
                  grpValue: Number(selected_zip.lost_elig_state_HH2009)
                },
                {
                  geo_level: "County",
                  grpValue: Number(selected_zip.lost_elig_county_HH2009)
                }
              ]
            },
            {
              year: "2017",
              values: [
                {
                  geo_level: "National",
                  grpValue: Number(selected_zip.lost_elig_nat_HH2017)
                },
                {
                  geo_level: "State",
                  grpValue: Number(selected_zip.lost_elig_state_HH2017)
                },
                {
                  geo_level: "County",
                  grpValue: Number(selected_zip.lost_elig_county_HH2017)
                }
              ]
            }
          ];

          slice = d3
            .select(".graph1")
            .selectAll("svg")
            .select("g")
            .selectAll(".slice")
            .data(zipData[1])
            .enter()
            .append("g")
            .attr("class", "g")
            .attr("transform", function(d) {
              return "translate(" + x0(d.year) + ",0)";
            });

          slice
            .selectAll("rect")
            .data(function(d) {
              return d.values;
            })
            .enter()
            .append("rect")
            .attr("width", x1.bandwidth())
            .attr("x", function(d) {
              return x1(d.geo_level);
            })
            .style("fill", function(d) {
              return color(d.geo_level);
            })
            .attr("y", 0)
            .attr("height", function(d) {
              return y(0);
            })
            .on("mouseover", function(d) {
              d3.select(this).style(
                "fill",
                d3.rgb(color(d.geo_level)).darker(2)
              );
            })
            .on("mouseout", function(d) {
              d3.select(this).style("fill", color(d.geo_level));
            });

          slice
            .selectAll("rect")
            .transition()
            .delay(function(d) {
              return Math.random() * 1000;
            })
            .duration(1000)
            .attr("y", function(d) {
              return 0;
            })
            .attr("height", function(d) {
              return y(d.grpValue);
            });

          var slice2 = d3
            .select(".graph2")
            .selectAll("svg")
            .select("g")
            .selectAll(".slice2")
            .data(zipData[2])
            .enter()
            .append("g")
            .attr("class", "g")
            .attr("transform", function(d) {
              return "translate(" + x0(d.year) + ",0)";
            });

          slice2
            .selectAll("rect")
            .data(function(d) {
              return d.values;
            })
            .enter()
            .append("rect")
            .attr("width", x1.bandwidth())
            .attr("x", function(d) {
              return x1(d.geo_level);
            })
            .style("fill", function(d) {
              return color(d.geo_level);
            })
            .attr("y", 0)
            .attr("height", function(d) {
              return y(0);
            })
            .on("mouseover", function(d) {
              d3.select(this).style(
                "fill",
                d3.rgb(color(d.geo_level)).darker(2)
              );
            })
            .on("mouseout", function(d) {
              d3.select(this).style("fill", color(d.geo_level));
            });

          slice2
            .selectAll("rect")
            .transition()
            .delay(function(d) {
              return Math.random() * 1000;
            })
            .duration(1000)
            .attr("y", function(d) {
              return 0;
            })
            .attr("height", function(d) {
              return y(d.grpValue);
            });
        });
      } else {
        console.log("invalid zip code");
        d3.select("#error_message").remove();

        d3.select(".error-box")
          .append("text")
          .attr("y", 0)
          .attr("x", 500)
          .attr("id", "error_message")
          .style("font-weight", "bold")
          .text("Not a valid zip code.");
      }
    }
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
