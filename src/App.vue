<template>
	<div
		id="app"
		class="w-full h-full"
		:style="{ 'background-color': indexBgColor }"
	>
		<div
			v-if="activeStep.id !== steps[steps.length - 1].id"
			class="graphic sticky top-0 overflow-hidden w-full h-full"
		>
			<div v-if="activeStep.id != 0">
				<h1 class="text-center font-bold text-[2rem] mt-20">
					{{ activeStep.category }}
				</h1>
			</div>
			<div class="flex justify-center items-center">
				<div :class="activeStep.class">
					<component
						:is="activeStep.component"
						:activeStepId="activeStep.id"
						:is_up="is_up"
						ref="componentRef"
					></component>
				</div>
			</div>
		</div>
		<div id="scrollama">
			<div
				v-for="step in steps"
				:key="step.id"
				:data-step="step.id"
				class="step-panel min-h-[483px] mt-8 mb-16 mx-auto"
			>
				<div
					v-if="step.id != 0"
					class="panel mx-auto border bg-white bg-opacity-90 relative whitespace-pre-line"
				>
					{{ step.message }}
					<div
						v-if="step.id == 1"
						v-katex:display="
							'CD_t=\\frac{1}{n}\\sum\\limits_{n=i}^{n}-f_{it}b_{it}+b_{it}'
						"
					></div>
				</div>
				<div
					v-else="step.id == 0"
					class="w-[600px] mt-[850px] mx-auto relative"
				>
					<div
						class="bg-white border-panel w-[300px] h-[300px] mx-[150px] mb-10"
						style="border-radius: 50%"
					>
						<Network :width="300" :height="300" />
					</div>
					<div
						class="panel0 border-panel bg-white border bg-opacity-90 whitespace-pre-line relative"
					>
						{{ step.message }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { onMounted } from 'vue'
import LanguageVerb from './components/LanguageVerb.vue'
import LanguageNewWords from './components/LanguageNewWords.vue'
import LanguageUniqueWords from './components/LanguageUniqueWords.vue'
import CDBySubject from './components/CDBySubject.vue'
import CDBins from './components/CDBins.vue'
import SubjectTheme from './components/SubjectTheme.vue'
import DiverSityWorkCited from './components/DiverSityWorkCited.vue'
import Top1Cited from './components/Top1Cited.vue'
import CitedSelf from './components/CitedSelf.vue'
import CitedAge from './components/CitedAge.vue'
import ExampleCD from './components/ExampleCD.vue'
import IndexPage from './components/IndexPage.vue'
import Network from './components/Network.vue'

const indexBgColor = '#67e8f9' // 首页颜色

// 每一次滚动的内容
const steps = [
	{
		id: 0,
		component: IndexPage,
		class: 'mt-60',
		category: '',
		message: '',
	},
	{
		id: 1,
		component: ExampleCD,
		class: 'mt',
		category: '一、CD指数示意图',
		message:
			'CD指数（consolidating/disruptive index）用来衡量一项研究的颠覆性大小，该值在-1到1之间，越大说明研究的颠覆性越强。\n',
	},
	{
		id: 2,
		component: CDBySubject,
		class: 'mt-20 ml-40',
		category: '二、总体情况',
		message: '所有学科的专利颠覆性都在降低',
	},
	{
		id: 3,
		component: CDBins,
		class: 'mt-20 ml-40',
		category: '二、总体情况',
		message:
			'科学的速度是越来越快的，新研究层出不穷，有颠覆性的研究所占的比例虽然没有增加，但绝对数目是有可能有所增加的。' +
			'而且，颠覆性的总体趋势会掩盖专利颠覆性的异质性，以及具有高度颠覆性专利的绝对数量的稳定性\n' +
			'对于专利，则除了绿线（CD5指数在0到0.25之间），其它更有颠覆性的专利数量略微呈现下降趋势，但都比较稳定。但是，考虑到还有更多的颠覆性得分为负的研究，平均后导致了颠覆性得分总分的下降。\n',
	},
	{
		id: 4,
		component: SubjectTheme,
		category: '二、总体情况',
		class: 'mt-20 ml-40',
		message:
			'主题河流图显示了最具颠覆性的专利（CD5 > 0.25）在各个学科的数量随着时间的变化。尽管在过去的30年间，这些学科和领域都发生相当大的变化，但观察到的高度颠覆性专利的绝对数量保持稳定',
	},
	{
		id: 5,
		component: LanguageNewWords,
		class: 'mt-20 ml-40',
		category: '三、科学颠覆性与语言模式',
		message:
			'在一个有创造性的领域，颠覆性的论文和专利应该具有较少相同的单词，甚至可能会引入新词。如果颠覆性正在下降，我们预期会看到科技领域使用的单词的多样性的下降。' +
			'\n' +
			'图Diversity of Language Used in Technology（New）单词多样性的这些下降伴随着组合新颖性的下降;随着时间的推移，科学家和发明家在专利标题中使用的特定词语越来越有可能在以前作品的标题中一起使用。',
	},
	{
		id: 6,
		component: LanguageUniqueWords,
		class: 'mt-20 ml-40',
		category: '三、科学颠覆性与语言模式',
		message:
			'图Diversity of Language Used in Technology (Unique) 记录了专利标题随时间的类型标记比（即唯一词语/总词语）。我们观察到显著的下降，特别是在早期时期，即专利的1990年以前。下降范围（1980–2010年）从32.5%（化学）到81%（计算机和通信）不等',
	},
	{
		id: 7,
		component: LanguageVerb,
		class: 'mt-10 ml-40',
		category: '三、科学颠覆性与语言模式',
		message:
			'颠覆性的减少在发明家使用的特定词语中也很明显。如果颠覆性正在下降，我们推断，随着时间的推移，暗示新事物的创造、发现或感知的动词应该减少使用，而暗示现有事物的改进、应用或评估的动词可能会更频繁地使用\n' +
			'随着时间的推移，发明家在专利标题中使用的特定词语越来越可能在以前工作的标题中一起使用过。',
	},

	{
		id: 8,
		component: DiverSityWorkCited,
		class: 'mt-20 ml-40',
		category: '四、科学颠覆性与引用模式',
		message:
			'除了语言模式，专利引用的模式也在改变。\n 首先是引用的专利类型的多样性下降，所有的学科和领域的专利引用多样性都呈现下降趋势，这表示跨学科研究和开发的比例在下降。',
	},
	{
		id: 9,
		component: Top1Cited,
		class: 'mt-20',
		category: '四、科学颠覆性与引用模式',
		message: '引用次数前1%的论文在引用份额和语义多样性上呈现相反的变化趋势',
	},
	{
		id: 10,
		component: CitedSelf,
		class: 'mt-20 ml-40',
		category: '四、科学颠覆性与引用模式',
		message:
			'所有学科自引用的增加(图Mean of Self-citations)，这与科学家和发明家更多地依赖于熟悉的知识相一致。',
	},
	{
		id: 11,
		component: CitedAge,
		class: 'mt-20 ml-40',
		category: '四、科学颠覆性与引用模式',
		message:
			'引用的工作的平均年龄正在增加，发明家越来越依赖过时的知识来进行发明创造活动。',
	},
	{ id: 12, class: 'panel-last', message: '' },
]

import useScrollama from './hooks/useScrollama'
const { activeStep, componentRef, is_up, setupScrollama } = useScrollama(
	steps,
	indexBgColor,
	{
		step: '.step-panel',
		offset: 0.95,
		debug: false,
		progress: true,
	}
)
onMounted(() => {
	setupScrollama()
})
</script>

<style scoped>
.panel {
	width: 600px;
	padding: 30px 30px 30px 60px;
	margin-top: 850px;
	border: 1px solid #d1d1d1;
	box-shadow: 5px 5px 14px rgba(188, 188, 188, 0.5);
	line-height: 35px;
	font-size: 16px;
}
.border-panel {
	border: 1px solid #d1d1d1;
	box-shadow: 5px 5px 14px rgba(188, 188, 188, 0.5);
}
.panel0 {
	padding: 30px 30px 30px 60px;
	line-height: 35px;
	font-size: 16px;
}
.panel::before {
	display: block;
	content: '';
	width: 16px;
	height: 16px;
	position: absolute;
	top: 40px;
	left: 25px;
	border-radius: 50%;
	background: #c42427;
}
.panel0::before {
	display: block;
	content: '';
	width: 16px;
	height: 16px;
	position: absolute;
	top: 40px;
	left: 25px;
	border-radius: 50%;
	background: #c42427;
}
.panel-last {
	/* 隐藏 */
	display: none;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
	transform: translateX(-100px);
}

.fade-enter-active,
.fade-leave-active {
	transition: all 0.5s ease;
	position: absolute;
}
</style>
