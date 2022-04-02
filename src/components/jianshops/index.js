
import UBC from './WUserBuyIntentionClassify.vue'

import RM from './registerModal'
import WBackgroundCategory from './WBackgroundCategory'
import WSellGoodsListModal from './WSellGoodsListModal.vue'
export default {
  install (Vue) {
    Vue.component('WUserBuyClassify', UBC);
    Vue.component('resgisterModal', RM);
    Vue.component('WBackCategory', WBackgroundCategory);
    Vue.component('WSellGoodsList', WSellGoodsListModal);
  }
}