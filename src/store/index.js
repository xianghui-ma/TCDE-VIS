import Vue from "vue";
import Vuex from 'vuex';

import publicData from "./publicData.js";
import mapData from "./map.js";
import controlData from './control.js';

Vue.use(Vuex);

// 创建store
export default new Vuex.Store({
    modules: {
        publicData,
        mapData,
        controlData
    }
});