import Vue from 'vue';
import App from './App.vue';
import { Divider, DatePicker, TimeSelect, TimePicker, Switch, Select, Option, Slider, Button, Table, TableColumn } from 'element-ui';

import store from './store/index.js';

Vue.use(Divider);
Vue.use(DatePicker);
Vue.use(TimeSelect);
Vue.use(TimePicker);
Vue.use(Switch);
Vue.use(Select);
Vue.use(Option);
Vue.use(Slider);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);

Vue.config.productionTip = false;


new Vue({
  render: h => h(App),
  store
}).$mount('#app');
