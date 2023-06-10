<template>
	<div id="top1-cited-wrapper"></div>
</template>

<script setup>
import * as d3 from 'd3'
import { onMounted } from 'vue'

async function drawChart() {
	/*
    draw a line chart
    */
	// 1. Access data
	const dataset = await d3.csv('./top_1pct_cite_share.csv')
	const xAccessor = (d) => d3.timeParse('%Y')(d.grant_year)
	const yAccessor = (d) => d.top_1pct_cite_share

	const dataset2 = await d3.csv('./ttl_coef_var.csv')
	const yAccessor2 = (d) => d.ttl_coef_var

	// 2. Create chart dimensions
	const width = 800

	let dimensions = {
		width: width,
		height: width * 0.6,
		margin: {
			top: 50,
			right: 30,
			bottom: 40,
			left: 60,
		},
	}

	dimensions.boundedWidth =
		dimensions.width - dimensions.margin.left - dimensions.margin.right

	dimensions.boundedHeight =
		dimensions.height - dimensions.margin.top - dimensions.margin.bottom

	// 3. Draw canvas
	const wrapper = d3
		.select('#top1-cited-wrapper')
		.append('svg')
		.attr('width', dimensions.width)
		.attr('height', dimensions.height + 120)

	const bounds = wrapper
		.append('g')
		.style(
			'transform',
			`translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
		)

	const titleArea = wrapper
		.append('g')
		.style('transform', `translate(50px, 50px)`)

	// 4. Create scales
	const xScale = d3
		.scaleTime()
		.domain(d3.extent(dataset, xAccessor))
		.range([0, dimensions.boundedWidth])

	const yScale = d3
		.scaleLinear()
		.domain([0.05, 0.15])
		.range([dimensions.boundedHeight, 0])
		.nice()

	const yScale2 = d3
		.scaleLinear()
		.domain([0.1, 0.2])
		.range([dimensions.boundedHeight, 0])
		.nice()

	// 5. Draw data
	const lineGenerator = d3
		.line()
		.x((d) => xScale(xAccessor(d)))
		.y((d) => yScale(yAccessor(d)))

	const line = bounds
		.append('path')
		.attr('d', lineGenerator(dataset))
		.attr('fill', 'none')
		.attr('stroke', '#5470C6')
		.attr('stroke-width', 2)

	const lineGenerator2 = d3
		.line()
		.x((d) => xScale(xAccessor(d)))
		.y((d) => yScale2(yAccessor2(d)))

	const line2 = bounds
		.append('path')
		.attr('d', lineGenerator2(dataset2))
		.attr('fill', 'none')
		.attr('stroke', '#EE6666')
		.attr('stroke-width', 2)

	const title = titleArea
		.append('text')
		.attr('x', dimensions.boundedWidth / 2)
		.attr('y', -30)
		.attr('text-anchor', 'middle')
		.attr('fill', 'black')
		.style('font-size', '1.4em')
		.text('Top 1% Cited Share and Semantic Diversity')

	// 6. Draw peripherals
	const yAxisGenerator = d3.axisLeft().scale(yScale)
	const yAxis = bounds.append('g').call(yAxisGenerator)

	yAxis.select('path').attr('stroke', '#5470C6')
	yAxis.selectAll('line').attr('stroke', '#5470C6')
	yAxis.selectAll('text').attr('fill', '#5470C6')

	const yAxisLabel = yAxis
		.append('text')
		.attr('x', 80)
		.attr('y', -15)
		.attr('fill', '#5470C6')
		.style('font-size', '1.4em')
		.text('Cite of Share')

	const yAxisGenerator2 = d3.axisRight().scale(yScale2)
	const yAxis2 = bounds
		.append('g')
		.call(yAxisGenerator2)
		.style('transform', `translateX(${dimensions.boundedWidth}px)`)

	yAxis2.select('path').attr('stroke', '#EE6666')
	yAxis2.selectAll('line').attr('stroke', '#EE6666')
	yAxis2.selectAll('text').attr('fill', '#EE6666')

	const yAxisLabel2 = yAxis2
		.append('text')
		.attr('x', -100)
		.attr('y', -15)
		.attr('fill', '#EE6666')
		.style('font-size', '1.4em')
		.text('Semantic Diversity')

	const xAxisGenerator = d3.axisBottom().scale(xScale).ticks(5)
	const xAxis = bounds
		.append('g')
		.call(xAxisGenerator)
		.style('transform', `translateY(${dimensions.boundedHeight}px)`)
	const xAxisLabel = xAxis
		.append('text')
		.attr('x', dimensions.boundedWidth / 2)
		.attr('y', dimensions.margin.bottom)
		.attr('fill', 'black')
		.style('font-size', '1.4em')
		.html('Year')

	// 7. Set up interactions
	const delay = 1000
	const transition = d3.transition().duration(delay).ease(d3.easeLinear)
	const totalLength = line.node().getTotalLength()

	line
		.attr('stroke-dashoffset', totalLength)
		.attr('stroke-dasharray', totalLength)
		.transition(transition)
		.attr('stroke-dashoffset', 0)

	line2
		.attr('stroke-dashoffset', totalLength)
		.attr('stroke-dasharray', totalLength)
		.transition(transition)
		.attr('stroke-dashoffset', 0)
}

onMounted(() => {
	drawChart()
})
</script>

<style></style>
