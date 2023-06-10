<template>
	<div>
		<div id="network-wrapper"></div>
	</div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as d3 from 'd3'
import useNetworkChart from '../hooks/useNetworkChart'

const props = defineProps({
	width: {
		type: Number,
		default: 800,
	},
	height: {
		type: Number,
		default: 600,
	},
})

onMounted(async () => {
	const miserables = await d3.json('./miserables.json')
	useNetworkChart(miserables, {
		nodeId: (d) => d.id,
		nodeGroup: (d) => d.group,
		linkStrokeWidth: (l) => Math.sqrt(l.value),
		width: props.width,
		height: props.height,
		linkStrength: 0.8,
	})
})
</script>

<style></style>
