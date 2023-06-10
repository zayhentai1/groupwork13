import { ref } from 'vue'
import scrollama from 'scrollama'
import { select, easeLinear } from 'd3'

export default function useScrollama(steps, indexBgColor, options) {
	const scroller = scrollama()

	const activeStep = ref(steps[0])

	const componentRef = ref(null)
	const is_up = ref(false)

	const stepEnterHandler = ({ element, direction, index }) => {
		activeStep.value = steps[index]

		if (index == 4 && direction == 'up') {
			is_up.value = false
		}
		if (index == 4 && direction == 'up') {
			is_up.value = false
		}
	}

	const stepProgressHandler = ({ element, index, progress, direction }) => {
		if (index === 7) {
			// if progress === 0.2,0.4,0.6, then chaneYear
			if (direction == 'down') {
				if (progress > 0.2 && progress < 0.4) {
					componentRef.value.changeYear(1)
				} else if (progress > 0.5 && progress < 0.7) {
					componentRef.value.changeYear(2)
				} else if (progress > 0.7 && progress < 0.9) {
					componentRef.value.changeYear(3)
				}
			} else {
				if (progress > 0.2 && progress < 0.5) {
					componentRef.value.changeYear(0)
				} else if (progress > 0.5 && progress < 0.7) {
					componentRef.value.changeYear(1)
				} else if (progress > 0.7 && progress < 0.8) {
					componentRef.value.changeYear(2)
				}
			}
		}

		if (index === 0) {
			if (direction == 'down') {
				select('#app')
					.transition()
					.duration(1000)
					.ease(easeLinear)
					.style('background-color', '#ffffff')
			} else {
				select('#app')
					.transition()
					.duration(1000)
					.ease(easeLinear)
					.style('background-color', indexBgColor)
			}
		}
	}

	const stepExitHandler = ({ element, direction, index }) => {}

	const setupScrollama = () => {
		scroller
			.setup(options)
			.onStepEnter(stepEnterHandler)
			.onStepProgress(stepProgressHandler)
			.onStepExit(stepExitHandler)
	}

	return {
		activeStep,
		componentRef,
		is_up,
		setupScrollama,
	}
}
