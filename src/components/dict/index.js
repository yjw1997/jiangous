import T from './WDictSelectTag.vue'
import HT from './WHelpDictSelectTag.vue'


const WDictSelectTag = {
  install: function (Vue) {
    Vue.component('WDictSelectTag', T);
    Vue.component('WHelpDictSelectTag', HT);
  }
}
export default WDictSelectTag;