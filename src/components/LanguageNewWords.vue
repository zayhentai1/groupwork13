<template>
	<div id="language-new-words-wrapper"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as d3 from 'd3'

async function getMultipleLineChart() {
	// 1. Access data
	const dataset = await d3.csv('./new_word.csv')
	const xAccessor = (d) => d3.timeParse('%Y')(d.grant_year)
	const group = [
		'Chemical',
		'Computers and communications',
		'Drugs and medical',
		'Electrical and electronic',
		'Mechanical',
	]
	// 2. Create chart dimensions
	const width = 800

	let dimensions = {
		width: width,
		height: width * 0.6,
		margin: {
			top: 30,
			right: 20,
			bottom: 50,
			left: 50,
		},
	}

	dimensions.boundedWidth =
		dimensions.width - dimensions.margin.left - dimensions.margin.right

	dimensions.boundedHeight =
		dimensions.height - dimensions.margin.top - dimensions.margin.bottom

	// 3. Draw canvas
	const wrapper = d3
		.select('#language-new-words-wrapper')
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
		.domain([0, d3.max(dataset, (row) => d3.max(group, (key) => +row[key]))])
		.range([dimensions.boundedHeight, 0])
		.nice()

	// color scale
	const colorScale = d3.scaleOrdinal().domain(group).range(d3.schemeSet2)

	// 5. Draw data
	const lineGenerator = d3
		.line()
		.x((d) => xScale(xAccessor(d)))
		.y((d) => yScale(d.value))

	const lines = bounds
		.selectAll('.line')
		.data(group)
		.enter()
		.append('path')
		.attr('class', 'new-words-line')
		.attr('id', (d, i) => 'new-words-line' + i)
		.attr('d', (d) =>
			lineGenerator(
				dataset.map((row) => ({ grant_year: row.grant_year, value: row[d] }))
			)
		)
		.attr('stroke-dasharray', function (d, i) {
			return this.getTotalLength()
		})
		.attr('stroke-dashoffset', function (d, i) {
			return this.getTotalLength()
		})
		.attr('fill', 'none')
		.attr('stroke', (d) => colorScale(d))
		.attr('stroke-width', 2)
		.transition()
		.duration(1000)
		.ease(d3.easeLinear)
		.attr('stroke-dashoffset', 0)

	// 5.1 add legend in the top
	const legend = bounds
		.append('g')
		.attr('transform', `translate(${dimensions.boundedWidth + 50}, ${150})`)
		.selectAll('.legend')
		.data(group)
		.enter()
		.append('g')
		.attr('class', 'legend')
		.attr('transform', (d, i) => `translate(0, ${i * 20})`)
		.on('click', function (event, d) {
			const line = d3.select('#new-words-line' + group.indexOf(d))
			const opacity = line.style('opacity')
			opacity == 1
				? line
						.transition()
						.duration(800)
						.ease(d3.easeLinear)
						.style('opacity', 0)
				: line
						.transition()
						.duration(800)
						.ease(d3.easeLinear)
						.style('opacity', 1)
		})

	legend
		.append('circle')
		.attr('cx', 0)
		.attr('cy', 0)
		.attr('r', 5)
		.attr('fill', (d) => colorScale(d))

	legend
		.append('text')
		.attr('x', 15)
		.attr('y', 0)
		.text((d) => d)
		.attr('fill', 'black')
		.style('font-size', '0.8em')
		.style('font-weight', 'bold')
		.attr('alignment-baseline', 'middle')

	// 5.2 add title
	const title = bounds
		.append('text')
		.attr('x', dimensions.boundedWidth / 2 + 100)
		.attr('y', -10)
		.text('Diversity of Language Used in Technology (New), 1980-2010 ')
		.attr('fill', 'black')
		.style('font-size', '1.4em')
		.style('font-weight', 'bold')
		.style('text-anchor', 'middle')

	// 6. Draw peripherals
	const yAxisGenerator = d3.axisLeft().scale(yScale)
	const yAxis = bounds.append('g').call(yAxisGenerator)
	const yAxisLabel = yAxis
		.append('text')
		.attr('x', -dimensions.boundedHeight / 2)
		.attr('y', -dimensions.margin.left + 10)
		.attr('fill', 'black')
		.style('font-size', '1.4em')
		.style('font-weight', 'bold')
		.text('New word pairs / Total word pairs')
		.style('transform', 'rotate(-90deg)')
		.style('text-anchor', 'middle')

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
		.style('font-weight', 'bold')
		.text('Year')
		.style('text-anchor', 'middle')
	// 7. Set up interactions
	// add
}

onMounted(() => {
	getMultipleLineChart()
})
</script>

<style>
.legend {
	cursor: pointer;
	/* arranges in a row */
	display: inline-block;
	margin-right: 10px;
	user-select: none;
}
</style>
