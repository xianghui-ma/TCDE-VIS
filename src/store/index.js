import Vue from "vue";
import Vuex from 'vuex';

import publicData from "./publicData.js";

Vue.use(Vuex);

// 创建store
export default new Vuex.Store({
    modules: {
        publicData,
    }
});