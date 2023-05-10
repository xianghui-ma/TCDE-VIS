<template>
<section class="drivingStatus">
    <section class='toggleModel'>
        <el-button icon="el-icon-top-right" size="mini" @click="modelToggle('speed', 'Speed(m/s)')"></el-button>
        <el-button icon="el-icon-top-right" size="mini" @click="modelToggle('distance', 'Distance(km)')"></el-button>
        <el-button icon="el-icon-top-right" size="mini" @click="modelToggle('time', 'Time(h)')"></el-button>
        <el-button icon="el-icon-top-right" size="mini" @click="modelToggle('co2', 'CO2(kg)')"></el-button>
    </section>
    <section class='chartBox'>
        <section id='speed' class='speedBox'></section>
        <section id='distance' class='distanceBox'></section>
        <section id='time' class='timeBox'></section>
        <section id='co2' class='co2Box'></section>
    </section>
</section>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
import * as echarts from 'echarts';
import axios from 'axios';

export default {
    name: 'DrivingStatus',
    data(){
        return{
            chartsCol: {}
        };
    },
    computed: {
        ...mapGetters('publicData', ['travelType']),
        ...mapState('publicData', ['urlPrefix']),
    },
    methods: {
        async initChart(){
            let data = await axios.get(`${this.urlPrefix}boxbar.json`);
            data = data.data;
            const idArr = ['speed', 'distance', 'time', 'co2'];
            const titleArr = ['Speed(m/s)', 'Distance(km)', 'Time(h)', 'CO2(kg)'];
            let chart = null;
            idArr.forEach((item, index)=>{
                chart = echarts.init(document.getElementById(item));
                this.chartsCol[item] = {
                    chart,
                    toggleStatus: true
                };
                this.drawBar(data[item], chart, item == 'speed', titleArr[index]);
            });
        },
        drawBar(data, chart, ifSpeed, title){
            chart.setOption({
                grid: ifSpeed ? {
                    left: '18%',
                    right: '1%',
                    bottom: '1%',
                    top: '5%'
                } : {
                    left: '0%',
                    right: '1%',
                    bottom: '1%',
                    top: '5%'
                },
                title: {
                    text: title,
                    left: 'center',
                    textStyle: {
                        fontSize: 12
                    }
                },
                xAxis: {
                    type: 'value',
                    z: 10,
                    axisLine: {
                        show: true
                    },
                    axisTick: {
                        show: true,
                        inside: true
                    },
                    axisLabel: {
                        inside: true,
                        rotate: 45,
                        color: '#000'
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'category',
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: ['#fff', '#ddd']
                        }
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: ifSpeed,
                        color: '#000'
                    },
                    data: this.travelType
                },
                series: [{
                    data,
                    type: 'bar',
                    itemStyle: {
                        color: '#39a6dd'
                    }
                }]
            });
        },
        drawBoxPlot(data, chart, ifSpeed, title){
            chart.setOption({
                title: [
                    {
                        text: title,
                        left: 'center',
                        textStyle: {
                            fontSize: 12
                        }
                    }
                ],
                dataset: [
                    {
                        source: data
                    },
                    {
                    transform: {
                        type: 'boxplot',
                        config: {
                            itemNameFormatter: (params)=>{
                                return this.travelType[params.value];
                            }
                        }
                    }
                    },
                    {
                        fromDatasetIndex: 1,
                        fromTransformResult: 1
                    }
                ],
                grid: ifSpeed ? {
                    left: '18%',
                    right: '1%',
                    bottom: '1%',
                    top: '5%'
                }:{
                    left: '0%',
                    right: '1%',
                    bottom: '1%',
                    top: '5%'
                },
                yAxis: {
                    type: 'category',
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: ['#fff', '#ddd']
                        }
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: ifSpeed,
                        color: '#000'
                    }
                },
                xAxis: {
                    type: 'value',
                    z: 10,
                    axisLine: {
                        show: true
                    },
                    axisTick: {
                        show: true,
                        inside: true
                    },
                    axisLabel: {
                        inside: true,
                        rotate: 45,
                        color: '#000'
                    },
                    splitLine: {
                        show: false
                    }
                },
                series: [
                    {
                        name: 'boxplot',
                        type: 'boxplot',
                        itemStyle: {
                            color: '#aaa',
                            borderColor: '#000'
                        },
                        datasetIndex: 1
                    }
                ]
            });
        },
        async modelToggle (id, title){
            let url = this.chartsCol[id].toggleStatus ? `${this.urlPrefix}boxplot.json` : `${this.urlPrefix}boxbar.json`;
            let data = await axios.get(url);
            data = data.data;
            this.chartsCol[id].toggleStatus ? this.drawBoxPlot(data[id], this.chartsCol[id].chart, id == 'speed', title) : this.drawBar(data[id], this.chartsCol[id].chart, id == 'speed', title);
            this.chartsCol[id].toggleStatus = !this.chartsCol[id].toggleStatus;
        }
    },
    mounted(){
        this.initChart();
    }
}
</script>

<style scoped>
.drivingStatus{
    grid-column: 17 / 33;
    grid-row: 21 / 33;
    background-color: #fff;
    position: relative;
}
.drivingStatus .toggleModel{
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 100;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}
.drivingStatus .toggleModel .el-button{
    margin-left: 17em;
    padding: 0.3em;
}
.drivingStatus .chartBox{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
}
.drivingStatus .chartBox .speedBox{
    flex-basis: 31%;
}
.drivingStatus .chartBox .distanceBox{
    flex-basis: 23%;
}
.drivingStatus .chartBox .timeBox{
    flex-basis: 23%;
}
.drivingStatus .chartBox .co2Box{
    flex-basis: 23%;
}
</style>