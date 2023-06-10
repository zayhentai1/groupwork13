import Vue from 'vue'
import App from './App.vue'
import 'virtual:windi.css'
import VueKatex from 'vue-katex'
import 'katex/dist/katex.min.css'

Vue.use(VueKatex)

new Vue({
	render: (h) => h(App),
}).$mount('#app')

// 刷新页面时，滚动条回到顶部
window.onunload = unload
function unload(e) {
	window.scrollTo(0, 0)
}
