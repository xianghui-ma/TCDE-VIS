import Vue from 'vue';
import App from './App.vue';
import { Divider, DatePicker, TimeSelect, TimePicker, Switch, Select, Option, Slider } from 'element-ui';

Vue.use(Divider);
Vue.use(DatePicker);
Vue.use(TimeSelect);
Vue.use(TimePicker);
Vue.use(Switch);
Vue.use(Select);
Vue.use(Option);
Vue.use(Slider);

Vue.config.productionTip = false;


new Vue({
  render: h => h(App),
}).$mount('#app');
