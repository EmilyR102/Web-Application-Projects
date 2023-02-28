async function renderSpiralChart(data) {
  // ADD CODE HERE FOR GRAPH
  // console.log(data)

  const avg_days = [];

  data.forEach((country) => {
    country.avg_days = 0;
    country.trending_videos.forEach((vid) => {
      let diff = Math.floor(
        (vid.trending_date.getTime() - vid.publish_time.getTime()) /
          (1000 * 60 * 60 * 24) //Need to divide by ms in a day
      );
      //total diff
      country.avg_days += diff;
      vid.trend_days = diff;
    });
    //get avg
    country.avg_days = Math.floor(
      country.avg_days / country.trending_videos.length
    );

    avg_days.push(country.avg_days);
  });

  //   console.log(data);

  //spiral - https://bl.ocks.org/arpitnarechania/027e163073864ef2ac4ceb5c2c0bf616

  const svg = d3.select("svg#spiralchart");

  const margin = { top: 50, right: 50, bottom: 50, left: 50 };

  const width = svg.attr("width");
  //   console.log(width);
  const height = svg.attr("height");

  const chartArea = svg
    .append("g")
    .attr("id", "chart")
    .attr(
      "transform",
      `translate(${margin.left + width / 2},  ${margin.top + height / 2})`
    );

  const max_days = d3.max(avg_days) + 5;
  
  let circ = 2 * Math.PI;

  const makeArc = (front, avg) => {
    const arc = d3
      .arc()
      .innerRadius(28 * front)
      .outerRadius(26 + 28 * front)
      .startAngle(0)
      .endAngle(circ * (avg / max_days));
    return arc;
  };

  chartArea
    .append("path")
    .attr("d", makeArc(1, avg_days[0]))
    .attr("fill", "red")
    .attr("stroke", "gray")
    .attr("stroke-width", 1);

  chartArea
    .append("path")
    .attr("d", makeArc(2, avg_days[1]))
    .attr("fill", "green")
    .attr("stroke", "gray")
    .attr("stroke-width", 1);

  chartArea
    .append("path")
    .attr("d", makeArc(3, avg_days[2]))
    .attr("fill", "orange")
    .attr("stroke", "gray")
    .attr("stroke-width", 1);

  chartArea
    .append("path")
    .attr("d", makeArc(4, avg_days[3]))
    .attr("fill", "purple")
    .attr("stroke", "gray")
    .attr("stroke-width", 1);



  renderLegend();

  // const FR = chartArea
  //   .append("path")
  //   .datum(data[1].points)
  //   .attr("id", "fr spiral")
  //   .attr("d", MakeSpiral(rScaleFR))
  //   .style("fill", "none")
  //   .style("stroke-width", 10)
  //   .style("stroke", colorScale(data[1].avg_days));

  // const path2 = countries
  //   .append("path")
  //   .datum((c) => c.points)
  //   .attr("id", "countries")
  //   .attr("d", spiral)
  //   .style("fill", "none")
  //   .style("stroke-width", 10);

  //   console.log(data);
  //   console.log(data[0]["trending_videos"][0]);
  //   console.log(data[0]["trending_videos"][0]["trendDays"]);
}

function renderLegend() {
  const svg = d3.select("svg#spiralchart-legend");
  const margin = { top: 40, left: 10 };

  const legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const labels = ["United States", "Mexico", "France", "Korea"];
  const colors = ["red", "green", "orange", "purple"];

  labels.forEach((label, i) => {
    legend
      .append("circle")
      .attr("cx", 0)
      .attr("cy", i * 30)
      .attr("r", 5)
      .style("fill", colors[i]);

    legend
      .append("text")
      .attr("x", 15)
      .attr("y", i * 30)
      .attr("alignment-baseline", "middle")
      .text(label);
  });
}

export default renderSpiralChart;
