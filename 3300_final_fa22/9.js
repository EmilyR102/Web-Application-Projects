// ----- MAKE YOUR CHANGES BETWEEN THESE LINES FOR #9 ----- 

const genNetwork = async () => {
  var svgNet = d3.select("svg#network");

  const net = await d3.json("class_network.json");

  // console.log(net);

  var network = svgNet.append("g");

  var edges = net.links;
  var nodes = net.nodes;

  // console.log("nodes", nodes);
  // console.log("edges", edges);

  var colorScaleNet = d3
    .scaleOrdinal(d3.schemeCategory10);

  var links = [];

  edges.forEach((d) =>
    links.push({ source: d.source, target: d.target })
  );

  // console.log("links", links);

  var sim = d3
    .forceSimulation()
    .nodes(nodes)
    .force(
      "links",
      d3
        .forceLink()
        .links(links)
        .id((d) => d.course)
    )
    .force("repulse", d3.forceManyBody().strength(-120))
    .force("collision", d3.forceCollide().radius(6))
    .force("r", d3.forceRadial().radius(d => 60 * d.level).x(300).y(300).strength(3))
    .on("tick", render);

  function render() {
    let lines = network
      .selectAll("line.link")
      .data(links)
      .join((enter) =>
        enter.append("line").attr("class", "link").attr("stroke", "black")
      )
      .attr("x1", (d) => d.source.x)
      .attr("x2", (d) => d.target.x)
      .attr("y1", (d) => d.source.y)
      .attr("y2", (d) => d.target.y);

    const circlesNet = network
      .selectAll("circle.node")
      .data(nodes)
      .join((enter) =>
        enter
          .append("circle")
          .attr("class", "node")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("r", 6)
      )
      .attr("fill", (d) => colorScaleNet(d.prefix))
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`);
  }

  render();
};

genNetwork();

// ----- MAKE YOUR CHANGES BETWEEN THESE LINES FOR #9 -----
