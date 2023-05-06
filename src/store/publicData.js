// 所有组件的共享数据，它们不单独属于某一个组件
export default{
    namespaced: true,
    state: {
        leftColTravel: [{type: 'Traffic', color: '#a6cee3'}, {type: 'Shop', color: '#fb9a99'}, {type: 'Dining', color: '#ff7f00'}, {type: 'Service', color: '#e31a1c'}, {type: 'Pastime', color: '#b2df8a'}, {type: 'Medical', color: '#fdbf6f'}],
        rightColTravel: [{type: 'Hotel', color: '#1f78b4'}, {type: 'Home', color: '#cab2d6'}, {type: 'Work', color: '#6a3d9a'}, {type: 'School', color: '#33a02c'}, {type: 'Other', color: '#b15928'}],
    },
    getters: {
        travels(state){
            return state.leftColTravel.concat(state.rightColTravel);
        },
        travelType(state){
            return state.leftColTravel.concat(state.rightColTravel).map((item)=>{
                return item.type;
            });
        }
    }
}