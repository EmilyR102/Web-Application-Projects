import DATASETS from './datasets.js'
import renderBarChart from './graphs/bar-chart.js'
import renderPieCharts from './graphs/pie-chart.js'
import renderSpiralChart from './graphs/spiral-chart.js'

async function fetchData() {
    let trending_videos_by_country = []

    for (const dataset of DATASETS) {
        let data = await d3.csv(dataset.path, d3.autoType)

        const parseDate = d3.timeParse('%y.%d.%m')

        data.forEach((d) => d.trending_date = parseDate(d.trending_date))

        trending_videos_by_country.push({
            country_name: dataset.country_name,
            country_abbr: dataset.country_abbr,
            trending_videos: data
        })
    }

    return trending_videos_by_country
}

async function createVisualizations() {
    const data = await fetchData()
    renderBarChart(data)
    renderSpiralChart(data)
    renderPieCharts(data)
}

createVisualizations()
