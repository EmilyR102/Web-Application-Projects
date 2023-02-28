// ----- MAKE YOUR CHANGES BETWEEN THESE LINES FOR #7 ----- 

const genPlotOlymp = async () => {
  var svgPlot = d3.select("svg#olympic");

  var widthPlot = svgPlot.attr("width");

  var heightPlot = svgPlot.attr("height");

  var margins = { top: 10, bottom: 40, left: 40, right: 10 };

  const chartArea = svgPlot
    .append("g")
    .attr("class", "chart")
    .attr("transform", `translate(${margins.left},${margins.top})`);

  const chartwidthPlot = widthPlot - margins.left - margins.right;

  const chartheightPlot = heightPlot - margins.top - margins.bottom;

  const ySide = svgPlot
    .append("g")
    .attr("transform", `translate(${margins.left - 2},${margins.top})`);

  const xSide = svgPlot
    .append("g")
    .attr(
      "transform",
      `translate(${margins.left},${chartheightPlot + 2 + margins.top})`
    );

  var olymp = await d3.json("olympic_ages.json");

  // console.log(olymp);

  const parser = d3.timeParse("%Y");

  olymp.forEach(d => {
    d.date = parser(d.date);
    d.date = d.date.getFullYear();
  })


  const colorScaleScatter = d3.scaleOrdinal(d3.schemeCategory10);

  //x
  const timeExtent = d3.extent(olymp, (d) => d.date);

  //y
  const ageExtent = d3.extent(olymp, (d) => d.age);

  //offset so points aren't right on axes
  let offset = margins.left / 2;
  const xScale = d3
    .scaleSymlog()
    .domain(timeExtent)
    .range([offset, chartwidthPlot - offset]);

  const yScale = d3
    .scaleLinear()
    .domain(ageExtent)
    .range([chartheightPlot - offset, 0]);

  //axis
  const yAxis = d3.axisLeft(yScale);
  const xAxis = d3.axisBottom(xScale);

  ySide.append("g").attr("class", "axis").call(yAxis);

  xSide.append("g").attr("class", "axis").call(xAxis);

  //gridlines

  const yGrid = d3.axisLeft(yScale).tickSize(-chartwidthPlot).tickFormat(""); //check

  const xGrid = d3
    .axisBottom(xScale)
    .tickSize(-chartheightPlot - margins.top)
    .tickFormat("");

  ySide.append("g").attr("class", "gridlines").call(yGrid);

  xSide.append("g").attr("class", "gridlines").call(xGrid);


  function jitter() {
    return d3.randomUniform(-3, 3)(); //check if this is the best
  }

  const r = 5;

  const circlesScatter = chartArea
    .selectAll("circle.pt")
    .data(olymp)
    .join("circle")
    .attr("class", "pt")
    .attr("cx", (d) => xScale(d.date) + jitter())
    .attr("cy", (d) => yScale(d.age) + jitter())
    .attr("r", r)
    .attr("opacity", 0.4)
    .style("fill", (d) => colorScaleScatter(d.sport));

  chartArea.raise();
};

genPlotOlymp();

// ----- MAKE YOUR CHANGES BETWEEN THESE LINES FOR #7 -----
