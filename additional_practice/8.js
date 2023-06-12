// ----- MAKE YOUR CHANGES BETWEEN THESE LINES FOR #8 -----

const genPlotBaking = async () => {
  var svgBake = d3.select("svg#bakeoff");

  var widthBake = svgBake.attr("width");

  var heightBake = svgBake.attr("height");

  var marginsBake = { top: 10, bottom: 40, left: 40, right: 10 };

  const chartAreaBake = svgBake
    .append("g")
    .attr("class", "chart")
    .attr("transform", `translate(${marginsBake.left},${marginsBake.top})`);

  const chartwidthBake = widthBake - marginsBake.left - marginsBake.right;

  const chartheightBake = heightBake - marginsBake.top - marginsBake.bottom;

  const ySideBake = svgBake
    .append("g")
    .attr("transform", `translate(${marginsBake.left - 2},${marginsBake.top})`);

  const xSideBake = svgBake
    .append("g")
    .attr(
      "transform",
      `translate(${marginsBake.left},${chartheightBake + 2 + marginsBake.top})`
    );

  var baking = await d3.json("bakeoff_scores.json");

  console.log(baking);


  const colorScaleBake = d3.scaleOrdinal(d3.schemeCategory10);


  //offsetBake so points aren't right on axes
  let offsetBake = marginsBake.left / 2;

  //age
  const ageScale = d3
    .scaleLinear()
    .domain([17, 71])
    .range([offsetBake, chartwidthBake - offsetBake]);

  //score
  const scoreScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([chartheightBake - offsetBake, 0]);

  //axis
  const yAxisBake = d3.axisLeft(scoreScale);
  const xAxisBake = d3.axisBottom(ageScale);

  ySideBake.append("g").attr("class", "axis").call(yAxisBake);

  xSideBake.append("g").attr("class", "axis").call(xAxisBake);

  //gridlines
  const yGridBake = d3.axisLeft(scoreScale).tickSize(-chartwidthBake).tickFormat("");

  const xGridBake = d3
    .axisBottom(ageScale)
    .tickSize(-chartheightBake - marginsBake.top)
    .tickFormat("");

  ySideBake.append("g").attr("class", "gridlines").call(yGridBake);

  xSideBake.append("g").attr("class", "gridlines").call(xGridBake);

  const gs = chartAreaBake
    .selectAll("g.pt")
    .data(baking)
    .join("g")
    .attr("class", "pt");

  gs.append("line")
    .attr("x1", d => ageScale(d.start_age))
    .attr("x2", d => ageScale(d.end_age))
    .attr("y1", d => scoreScale(d.overall_score))
    .attr("y2", d => scoreScale(d.overall_score))
    .attr("stroke", "blue")
    .attr("stroke-width", 10);

  gs.append("line")
    .attr("x1", d => ageScale(d.start_age))
    .attr("x2", d => ageScale(d.end_age))
    .attr("y1", d => scoreScale(d.technique_score))
    .attr("y2", d => scoreScale(d.technique_score))
    .attr("stroke", "red")
    .attr("stroke-width", 10);

  gs.append("line")
    .attr("x1", d => ageScale((d.start_age + d.end_age) / 2))
    .attr("x2", d => ageScale((d.start_age + d.end_age) / 2))
    .attr("y1", d => scoreScale(d.overall_score))
    .attr("y2", d => scoreScale(d.technique_score))
    .attr("opacity", 0.9)
    .attr("stroke", "grey")
    .attr("stroke-width", d => ageScale(d.end_age) - ageScale(d.start_age));

  chartAreaBake.raise();
};

genPlotBaking();

// ----- MAKE YOUR CHANGES BETWEEN THESE LINES FOR #8 -----
