// ----- MAKE YOUR CHANGES BETWEEN THESE LINES FOR #10 ----- 

const drawMap = async function () {
  let svgMap = d3.select("svg#map");

  let widthMap = +svgMap.attr("width");

  let heightMap = +svgMap.attr("height");

  let artists = await d3.json("us_artists.topo.json");

  // console.log("artists", artists);

  var states = topojson.feature(artists, artists.objects.states);

  // console.log(states)

  var projection = d3.geoAlbersUsa().fitSize([widthMap, heightMap], states);
  // console.log(projection([42.4476, -76.4]))

  const path = d3.geoPath().projection(projection);

  const ext_art = d3.extent(states.features, d => d.properties.percent_artists);

  const viewport = svgMap.append("g");

  const colorScaleArt = d3.scaleSequential(d3.interpolateViridis).domain(ext_art);

  // console.log(states.features);

  viewport
    .selectAll("path.states")
    .data(states.features)
    .join("path")
    .attr("class", "states")
    .style("fill", (d) => colorScaleArt(d.properties.percent_artists))
    .attr("d", path);

  //projection([longitude,latitude])
  const washington = projection([-77.025955, 38.942142]);

  const circMap = viewport
    .append("circle")
    .attr("r", 8)
    .attr("cx", washington[0])
    .attr("cy", washington[1])
    .style("fill", colorScaleArt(.244));

  // console.log(circ);
  // console.log(viewport);
};

drawMap();






// ----- MAKE YOUR CHANGES BETWEEN THESE LINES FOR #10 -----
