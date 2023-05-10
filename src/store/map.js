// 来源于map组件的共享数据
export default{
    namespaced: true,
    state: {
        odMes: null,
        map: null,
        heatMap: null
    },
    actions: {
        storeOdMes(context, data){
            context.commit('storeOdMes', data);
        },
        storeMap(context, data){
            context.commit('storeMap', data);
        },
        storeHeatMap(context, data){
            context.commit('storeHeatMap', data);
        }
    },
    mutations: {
        storeOdMes(preState, data){
            preState.odMes = data
        },
        storeMap(preState, data){
            preState.map = data
        },
        storeHeatMap(preState, data){
            preState.heatMap = data
        },
    },
}