const colors = ['#2ecc71', '#3498db', '#9b59b6']

function aggregateData(data) {
    let aggregated_data = []

    data.forEach((d) => {
        const avg_views = Math.floor(d3.mean(d.trending_videos, (v) => v.views))
        const avg_likes = Math.floor(d3.mean(d.trending_videos, (v) => v.likes))
        const avg_comments = Math.floor(
            d3.mean(d.trending_videos, (v) => v.comment_count)
        )

        aggregated_data.push({
            country_name: d.country_name,
            country_abbr: d.country_abbr,
            avg_views,
            avg_likes,
            avg_comments
        })
    })

    return aggregated_data
}

export function renderBarChart(data) {
    // =========== Aggregate DATA ========= \\
    data = aggregateData(data)

    // =========== SVG SETUP =========== \\
    const svg = d3.select('svg#barchart')
    const width = svg.attr('width')
    const height = svg.attr('height')
    const margin = { top: 25, right: 10, bottom: 75, left: 150 }
    const chartWidth = width - margin.left - margin.right
    const chartHeight = height - margin.top - margin.bottom

    let annotations = svg.append('g').attr('id', 'annotations')
    let chartArea = svg
        .append('g')
        .attr('id', 'bars')
        .attr('transform', `translate(${margin.left},${margin.top})`)

    // =========== CREATE SCALES AND AXIS =========== \\
    const countries = d3.map(data, (d) => d.country_name)
    const countryScale = d3
        .scaleBand()
        .domain(countries)
        .range([0, chartWidth])
        .padding(0.15)

    const maxStat = d3.max(data, (d) =>
        Math.max(d.avg_views, d.avg_likes, d.avg_comments)
    )

    const statScale = d3
        .scalePow()
        .exponent(0.45)
        .domain([1, maxStat])
        .range([chartHeight, 0])

    let leftAxis = d3.axisLeft(statScale)

    let leftGridlines = d3
        .axisLeft(statScale)
        .tickSize(-chartWidth - 10)
        .tickFormat('')

    annotations
        .append('g')
        .attr('class', 'y axis')
        .attr('transform', `translate(${margin.left - 10},${margin.top})`)
        .call(leftAxis)
        .append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -chartHeight / 2)
        .attr('y', -105)
        .text('Views, Likes, Comments')

    annotations
        .append('g')
        .attr('class', 'y gridlines')
        .attr('transform', `translate(${margin.left - 10},${margin.top})`)
        .call(leftGridlines)

    const bottomAxis = d3.axisBottom(countryScale)

    annotations
        .append('g')
        .attr('class', 'x axis')
        .attr(
            'transform',
            `translate(${margin.left},${chartHeight + margin.top + 10})`
        )
        .call(bottomAxis)
        .append('text')
        .attr('class', 'axis-label')
        .attr('x', chartWidth / 2)
        .attr('y', 50)
        .text('Country')

    // ============ DRAW BARS ============== \\
    const countryGs = chartArea
        .selectAll('g.country')
        .data(data)
        .join('g')
        .attr('class', 'country')
        .attr(
            'transform',
            (d) => `translate(${countryScale(d.country_name)}, 0)`
        )

    countryGs
        .selectAll('rect.bar')
        .data((d) => [d.avg_views, d.avg_likes, d.avg_comments])
        .join('rect')
        .attr('class', 'bar')
        .attr(
            'x',
            (_, i) => Math.floor(i * (countryScale.bandwidth() / 3)) + i * 2
        )
        .attr('y', (d) => statScale(d))
        .attr('width', Math.floor(countryScale.bandwidth() / 3))
        .attr('height', (d) => statScale(0) - statScale(d))
        .style('fill', (_, i) => colors[i])

    // ============ DRAW LABLES ============== \\
    countryGs
        .selectAll('text.label')
        .data((d) => [d.avg_views, d.avg_likes, d.avg_comments])
        .join('text')
        .attr('class', 'label')
        .attr(
            'x',
            (_, i) => Math.floor(i * (countryScale.bandwidth() / 3)) + i * 2 + 4
        )
        .attr('y', (d) => statScale(d) - 3)
        .text((d) => `${Math.floor(d / 1000)}K`)
        .raise()

    renderLegend()
}

function renderLegend() {
    const svg = d3.select('svg#barchart-legend')
    const margin = { top: 35, left: 25 }

    const legend = svg
        .append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const labels = ['Average Views', 'Average Likes', 'Average Comments']
    const colors = ['#2ecc71', '#3498db', '#9b59b6']

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
            .text(labels[i])
    })
}

export default renderBarChart
