<template>
	<div id="theme-subject-wrapper" class="vue"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as d3 from 'd3'

async function drawThemeSubject() {
	// 1. Access data
	const dataset = await d3.csv('./d_5_count.csv')
	const xAccessor = (d) => d3.timeParse('%Y')(d.grant_year)
	const group = [
		'Chemical',
		'Computers and communications',
		'Drugs and medical',
		'Electrical and electronic',
		'Mechanical',
	]

	const stackedData = d3
		.stack()
		.keys(group)
		.value((d, key) => +d[key])
		.offset(d3.stackOffsetWiggle)(dataset)

	// 2. Create chart dimensions
	const width = 800
	let dimensions = {
		width: width,
		height: width * 0.6,
		margin: {
			top: 30,
			right: 20,
			bottom: 50,
			left: 70,
		},
	}

	dimensions.boundedWidth =
		dimensions.width - dimensions.margin.left - dimensions.margin.right

	dimensions.boundedHeight =
		dimensions.height - dimensions.margin.top - dimensions.margin.bottom

	// 3. Draw canvas
	const wrapper = d3
		.select('#theme-subject-wrapper')
		.append('svg')
		.attr('width', dimensions.width + 300)
		.attr('height', dimensions.height)

	const bounds = wrapper
		.append('g')
		.style(
			'transform',
			`translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
		)

	// 4. Create scales
	const xScale = d3
		.scaleTime()
		.domain(d3.extent(dataset, xAccessor))
		.range([0, dimensions.boundedWidth])

	const yScale = d3
		.scaleLinear()
		.domain([0, 18000])
		.range([dimensions.boundedHeight, 0])

	// 4.1 color scale
	const colorScale = d3.scaleOrdinal().domain(group).range(d3.schemeSet2)

	// 5. Draw data
	const areaGenerator = d3
		.area()
		.x((d) => xScale(xAccessor(d.data)))
		.y0((d) => yScale(d[0]))
		.y1((d) => yScale(d[1]))
		.curve(d3.curveBasis)

	const areas = bounds.selectAll('.area').data(stackedData).join('path')

	const rect = bounds
		.append('rect')
		.attr('x', 0)
		.attr('y', 0)
		.attr('width', dimensions.boundedWidth)
		.attr('height', dimensions.boundedHeight)
		.attr('fill', 'white')

	areas
		.attr('class', 'area')
		.attr('fill', (d) => colorScale(d.key))
		.attr('d', areaGenerator)

	// 逐渐向右移动矩形
	rect
		.transition()
		.duration(1000)
		.ease(d3.easeLinear)
		.attr('x', dimensions.boundedWidth)
		.remove()

	const legend = bounds
		.append('g')
		.attr('transform', `translate(${dimensions.boundedWidth + 50}, ${150})`)
		.selectAll('g')
		.data(group)
		.join('g')
		.attr('class', (d) => 'st-legend st-legend-' + d.replace(/\s/g, '-'))
		.attr('transform', (d, i) => `translate(0, ${i * 20})`)

	legend
		.append('circle')
		.attr('cx', 0)
		.attr('cy', 0)
		.attr('r', 5)
		.attr('fill', colorScale)

	legend
		.append('text')
		.attr('x', 15)
		.attr('y', 0)
		.text((d) => d)
		.attr('fill', 'black')
		.style('font-size', '0.8em')
		.style('font-weight', 'bold')
		.attr('alignment-baseline', 'middle')

	// 6. Draw peripherals
	const xAxisGenerator = d3.axisBottom().scale(xScale).ticks(5)
	const xAxis = bounds
		.append('g')
		.call(xAxisGenerator)
		.style('transform', `translateY(${dimensions.boundedHeight}px)`)
	const xAxisLabel = xAxis
		.append('text')
		.attr('x', dimensions.boundedWidth / 2)
		.attr('y', dimensions.margin.bottom - 10)
		.attr('fill', 'black')
		.style('font-size', '1.4em')
		.html('Year')

	const yAxisGenerator = d3.axisLeft().scale(yScale)
	const yAxis = bounds.append('g').call(yAxisGenerator)
	const yAxisLabel = yAxis
		.append('text')
		.attr('x', -dimensions.boundedHeight / 2)
		.attr('y', -dimensions.margin.left + 10)
		.attr('fill', 'black')
		.style('font-size', '1.4em')
		.text('Count of Patents')
		.style('transform', 'rotate(-90deg)')
		.style('text-anchor', 'middle')

	// 7. Set up interactions
	const mouseover = function (event, d) {
		d3.selectAll('.area').style('opacity', 0.2)
		d3.select(this).style('opacity', 1).style('stroke', 'black')
		d3.selectAll('.st-legend').style('opacity', 0.2)
		d3.select('.st-legend-' + d.key.replace(/\s/g, '-')).style('opacity', 1)
	}

	const mouseleave = function (event, d) {
		d3.selectAll('.area').style('opacity', 1).style('stroke', 'none')
		d3.selectAll('.st-legend').style('opacity', 1)
	}

	areas.on('mouseover', mouseover).on('mouseleave', mouseleave)
}

onMounted(() => {
	drawThemeSubject()
})
</script>

<style></style>
