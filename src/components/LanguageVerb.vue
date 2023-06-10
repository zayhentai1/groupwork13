<template>
	<div id="language-verb-wrapper"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as d3 from 'd3'

const times = [1980, 1990, 2000, 2010]

var tokenAccessor
var frequencyAccessor
var dataset
var bounds
var xScale
var yScale
var yAxis

const props = defineProps({
	is_up: {
		type: Boolean,
		default: false,
	},
})

async function drawHorizontalBarChart(yearIndex = 0) {
	/*
    draw a horizontal bar chart
    */
	// 1. Access data
	yearIndex = props.is_up ? -1 : yearIndex
	const year = yearIndex === -1 ? times[times.length - 1] : times[yearIndex]
	dataset = await d3.csv('./patent_tokens_table_analytical_df.csv')
	tokenAccessor = (d) => d['token_d' + year] // token
	// keep two decimals
	frequencyAccessor = (d) => Math.round(d['nrp100_d' + year] * 100) / 100 // frequency

	// 2. Create chart dimensions
	const width = 900

	let dimensions = {
		width: width,
		height: width * 0.6,
		margin: {
			top: 70,
			right: 10,
			bottom: 50,
			left: 60,
		},
	}

	dimensions.boundedWidth =
		dimensions.width - dimensions.margin.left - dimensions.margin.right

	dimensions.boundedHeight =
		dimensions.height - dimensions.margin.top - dimensions.margin.bottom

	// 3. Draw canvas
	const wrapper = d3
		.select('#language-verb-wrapper')
		.append('svg')
		.attr('width', dimensions.width)
		.attr('height', dimensions.height)

	const titleArea = wrapper.append('g').style('transform', `translate(0, 30px)`)

	bounds = wrapper
		.append('g')
		.style(
			'transform',
			`translate(${dimensions.margin.left + 50}px, ${dimensions.margin.top}px)`
		)

	// 1980 label which is in the right bottom corner
	const timeArea = wrapper
		.append('g')
		.style(
			'transform',
			`translate(${dimensions.boundedWidth - 520}px, ${
				dimensions.boundedHeight + 60
			}px)`
		)

	// 4. Create scales
	xScale = d3
		.scaleLinear()
		.domain([
			d3.min(dataset, (d) => d3.min(times, (t) => d['nrp100_d' + t])),
			d3.max(dataset, (d) => d3.max(times, (t) => d['nrp100_d' + t])),
		]) // 所有年份的最大最小值
		.range([10, dimensions.boundedWidth / 1.5])
		.nice()

	yScale = d3
		.scaleBand()
		.domain(dataset.map(tokenAccessor))
		.range([0, dimensions.boundedHeight])
		.padding(0.1)

	// 5. Draw data
	const title = titleArea
		.append('text')
		.attr('x', dimensions.boundedWidth / 2)
		.attr('y', -10)
		.text('Verb use per 100 verbs')
		.attr('fill', 'black')
		.style('font-size', '1.4em')
		.style('text-anchor', 'middle')

	const subtitle = titleArea
		.append('text')
		.attr('x', dimensions.boundedWidth / 2 + 65)
		.attr('y', 20)
		.text('united: frequency')
		.attr('fill', 'black')
		.style('font-size', '1em')
		.style('text-anchor', 'middle')

	const timeLabel = timeArea
		.append('text')
		.attr('class', 'time-label')
		.attr('x', dimensions.boundedWidth / 2)
		.attr('y', 0)
		.text(year)
		.attr('fill', 'black')
		.style('font-size', '2.4em')
		.style('text-anchor', 'middle')

	const barRects = bounds
		.selectAll('rect')
		.data(dataset)
		.enter()
		.append('rect')
		.attr('x', 0)
		.attr('y', (d) => yScale(tokenAccessor(d)))
		.attr('height', yScale.bandwidth())
		.attr('fill', 'cornflowerblue')
		.on('mouseover', function (e, d) {
			// the bar's color will be highlighted when mouseover
			d3.select(this).style('filter', 'brightness(120%)')
		})
		.on('mouseout', function (e, d) {
			d3.select(this).style('filter', 'brightness(100%)')
		})
		.transition()
		.duration(800)
		.ease(d3.easeLinear)
		.attr('width', (d) => xScale(frequencyAccessor(d)))

	const barText = bounds
		.selectAll('text')
		.data(dataset)
		.enter()
		.append('text')
		.attr('y', (d) => yScale(tokenAccessor(d)) + (yScale.bandwidth() + 5) / 2)
		.text((d) => frequencyAccessor(d))
		.style('text-anchor', 'start')
		.attr('fill', 'black')
		.style('font-size', '12px')
		.style('font-family', 'sans-serif')
		.transition()
		.duration(800)
		.ease(d3.easeLinear)
		.attr('x', (d) => xScale(frequencyAccessor(d)) + 5)

	// add 7 vertial lines
	const lineScale = d3
		.scaleLinear()
		.domain([0, 10])
		.range([0, dimensions.boundedWidth / 1.5])
	const lines = bounds
		.selectAll('line')
		.data([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
		.enter()
		.append('line')
		.attr('x1', (d) => lineScale(d))
		.attr('y1', -10)
		.attr('x2', (d) => lineScale(d))
		.attr('y2', dimensions.boundedHeight + 10)
		.attr('stroke', 'grey')
		.attr('stroke-width', 1)
		.attr('opacity', 0.1)

	// 6. Draw peripherals
	// y axis with label 1rem
	const yAxisGenerator = d3.axisLeft().scale(yScale)
	yAxis = bounds.append('g').attr('class', 'yAxis').call(yAxisGenerator)
	yAxis.selectAll('.domain, .tick line').remove()
	yAxis.selectAll('text').attr('font-size', '1rem')

	// 7. Set up interactions
}

var index = props.is_up ? times.length - 1 : 0

async function changeYear(year_index) {
	if (dataset === undefined || dataset === null || dataset.length === 0) {
		dataset = await d3.csv('./patent_tokens_table_analytical_df.csv')
	}
	if (index == year_index) {
		return
	}
	index = year_index
	d3.select('.time-label').text(times[year_index])
	tokenAccessor = (d) => d['token_d' + times[year_index]]
	frequencyAccessor = (d) =>
		Math.round(d['nrp100_d' + times[year_index]] * 100) / 100
	yScale.domain(dataset.map(tokenAccessor))
	bounds
		.selectAll('rect')
		.data(dataset)
		.transition()
		.duration(800)
		.ease(d3.easeLinear)
		.attr('width', (d) => xScale(frequencyAccessor(d)))
	bounds
		.selectAll('text')
		.data(dataset)
		.transition()
		.duration(800)
		.ease(d3.easeLinear)
		.attr('x', (d) => xScale(d['nrp100_d' + times[year_index]]) + 5)
		.text((d) => frequencyAccessor(d))

	var yAxisGenerator = d3.axisLeft().scale(yScale)
	yAxis.call(yAxisGenerator).transition().duration(800).ease(d3.easeLinear)
	yAxis.selectAll('.domain, .tick line').remove()
	yAxis.selectAll('text').attr('font-size', '1rem')
}

onMounted(() => {
	drawHorizontalBarChart()
})

defineExpose({
	changeYear,
})
</script>

<style></style>
