function aggregateData(data) {
    let aggregated_data = []

    const MILLISECONDS_IN_YEAR = 86400000

    data.forEach((d) => {
        const time_to_trend_stats = [0, 0, 0, 0, 0];

        d.trending_videos.forEach(v => {
            let trendTime = Math.floor((v.trending_date.getTime() - v.publish_time.getTime()) / MILLISECONDS_IN_YEAR);
            if (trendTime > 4) trendTime = 4;

            time_to_trend_stats[trendTime]++;
        })

        const total_videos = d.trending_videos.length

        aggregated_data.push({
            country_name: d.country_name,
            country_abbr: d.country_abbr,
            time_to_trend_stats,
            total_videos
        })
    })

    return aggregated_data
}

function createPieChart(country_data) {
    // ========= CREATE SVG =========== \\
    const svg = d3.select('div.piecharts').append('svg').attr('class', 'svg-piechart').attr('id', `${country_data.country_abbr}-piechart`).attr('width', "325").attr('height', '375');
    const width = svg.attr('width');
    const height = svg.attr('height');
    const radius = Math.min(width, height) / 2;
    
    let chartArea = svg.append('g')
                        .attr('transform', `translate(${width/2},${height/2})`)

    const colorScale = d3.scaleQuantize().domain([0, 4]).range(['#2ecc71', '#3498db', '#9b59b6', '#f39c12', '#e74c3c']);

    // ============ DRAW SLICES ============== \\
    const total_v = country_data.total_videos

    const pieChart = d3.pie();

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const slices = chartArea.selectAll("g.slice")
                    .data(pieChart(country_data.time_to_trend_stats))
                    .join("g")
                    .attr("class", "slice");

    slices.append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => colorScale(i)).lower();
    
    // ============ DRAW LABELS ============== \\
    chartArea.selectAll('text')
            .data(pieChart(country_data.time_to_trend_stats))
            .join("text")
            .attr('transform', function(d,i){
                if (i==4 && (d.data/total_v) * 100 < 4){
                    return `translate(${arc.centroid(d)}) translate(0,-15)`
                }
                return `translate(${arc.centroid(d)})`
            })
            .attr("text-anchor", "middle")
            .text(d => (Math.round((d.data/total_v) * 1000) / 10) + "%");
    

    chartArea.append('text').text(country_data.country_name)
                            .attr('transform', `translate(0,${-height/2 + 15})`)
                            .attr("text-anchor", "middle")
                            .attr("font-weight", "bold")
                            
    renderLegend();
}

function renderLegend() {
    const svg = d3.select('svg#piechart-legend')
    const margin = { top: 40, left: 25 }

    const legend = svg
        .append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const labels = ['0 Days', '1 Day', '2 Days', '3 Days', '4+ Days']
    const colors = ['#2ecc71', '#3498db', '#9b59b6', '#f39c12', '#e74c3c']

    labels.forEach((label, i) => {
        legend
            .append('circle')
            .attr('cx', 0)
            .attr('cy', i * 30)
            .attr('r', 5)
            .style('fill', colors[i])

        legend
            .append('text')
            .attr('x', 15)
            .attr('y', i * 30)
            .attr('alignment-baseline', 'middle')
            .text(label)
    })
}

function renderPieCharts(data) {
    data = aggregateData(data)
    console.log(data);
    
    data.forEach(createPieChart)
}

export default renderPieCharts
