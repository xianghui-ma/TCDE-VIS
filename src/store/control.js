// 来源于ControlPanel组件的共享数据
export default{
    namespaced: true,
    state: {
        date: '',
        time: null,
        selectedTrip: '',
        accuracy: ''
    },
    actions: {
        storeDate(context, data){
            context.commit('storeDate', data);
        },
        storeTime(context, data){
            context.commit('storeTime', data);
        },
        storeSelectedTrip(context, data){
            context.commit('storeSelectedTrip', data);
        },
        storeaccuracy(context, data){
            context.commit('storeaccuracy', data);
        }
    },
    mutations: {
        storeDate(preState, data){
            preState.date = data
        },
        storeTime(preState, data){
            preState.time = data
        },
        storeSelectedTrip(preState, data){
            preState.selectedTrip = data
        },
        storeaccuracy(preState, data){
            preState.accuracy = data
        },
    },
}