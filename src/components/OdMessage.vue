<template>
<section class="odMessage">
    <section class='pathCluster' id='clusterBox'>
        <section class='scatter' id='scatterBox'></section>
        <section class='timeAndNum'>
            <section class='time' id='timeBox'></section>
            <section class='bar' id='barBox'></section>
        </section>
    </section>
    <section class='mesTable' id='tabelBox'>
        <el-table
            :data="odMes ? odMes.table : null"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            >
            <el-table-column
            type="selection"
            width="55">
            </el-table-column>
            <el-table-column
            prop="purpose"
            label="Trip Type"
            sortable>
            </el-table-column>
            <el-table-column
            prop="co2"
            label="CO2"
            sortable>
            </el-table-column>
            <el-table-column
            prop="speed"
            label="Average Speed"
            sortable>
            </el-table-column>
            <el-table-column
            prop="time"
            label="Trip Time"
            sortable>
            </el-table-column>
            <el-table-column
            prop="distance"
            label="Distance"
            sortable>
            </el-table-column>
        </el-table>
    </section>
</section>
</template>

<script>
import {mapState, mapGetters} from 'vuex';
import * as echarts from 'echarts';
import * as d3 from 'd3';
import L from 'leaflet';

export default {
    name: 'OdMessage',
    data(){
        return {
            scatterContainerId: 'scatterBox',
            timeContainerId: 'timeBox',
            barContainerId: 'barBox',
            tableContainerId: 'tabelBox',
            pathFromScatter: null,
            pathLayers: null
        };
    },
    computed: {
        ...mapState('mapData', ['odMes', 'map', 'heatMap']),
        ...mapGetters('publicData', ['colorMap']),
    },
    watch: {
        odMes: {
            handler(){
                this.drawScatter();
                this.drawBarStatics();
                this.drawTimeFrequency();
            }
        }
    },
    methods: {
        handleSelectionChange(selectedRows){
            let path = []
            this.pathLayers && this.map.removeLayer(this.pathLayers);
            selectedRows.forEach((item)=>{
                path.push(JSON.parse(item['traj']));
            });
            this.pathLayers = L.geoJSON(path, {
                style: {
                    "color": "#8C2752",
                    "weight": 4,
                    "opacity": 0.3
                }
            }).addTo(this.map);
        },
        // 绘制散点图
        drawScatter(){
            // 创建series和legend
            let series = [];
            let legendData = [];
            for(let key in this.odMes.scatter){
                legendData.push(key);
                series.push({
                    name: key,
                    symbolSize: 10,
                    data: this.odMes.scatter[key],
                    type: 'scatter',
                    itemStyle: {
                        color: this.colorMap[key]
                    }
                });
            }
            // 开始绘制
            let chart = echarts.init(document.getElementById(this.scatterContainerId));
            let selectedPoints = null;

            chart.on('brushSelected', (params)=>{
                selectedPoints = params.batch[0].selected;
            });

            chart.on('brushEnd', (params)=>{
                if(params.areas.length === 0){
                    this.pathFromScatter && this.map.removeLayer(this.pathFromScatter);
                }else{
                    this.mapScatterToPath(selectedPoints);
                }
            });

            chart.setOption({
                xAxis: {
                show: false
                },
                yAxis: {
                show: false
                },
                grid: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
                },
                dataZoom: [
                {
                    type: 'inside',
                    xAxisIndex: [0]
                },
                {
                    type: 'inside',
                    yAxisIndex: [0]
                }
                ],
                toolbox: {
                    feature: {
                        brush: {
                        type: ['rect', 'polygon', 'clear']
                        }
                    }
                },
                brush: {},
                series
            }, true);
        },
        mapScatterToPath(selectedPoints){
            let travelName = '';
            let pointArr = null;
            let targetArr = null;
            let paths = [];
            selectedPoints.forEach((points)=>{
                if(points.dataIndex.length !== 0){
                travelName = points.seriesName;
                pointArr = points.dataIndex;
                targetArr = this.odMes.scatterPath[travelName];
                pointArr.forEach((item)=>{
                    paths.push(JSON.parse(targetArr[item]));
                });
                }
            });
            this.pathFromScatter = L.geoJSON(paths, {
                style: {
                "color": "#8C2752",
                "weight": 4,
                "opacity": 0.3
                }
            }).addTo(this.map);
        },
        drawBarStatics(){
            let chart = echarts.init(document.getElementById(this.barContainerId));
            let data = []
            for(let key in this.odMes.bar){
                data.push({
                    value: this.odMes.bar[key],
                    itemStyle: {
                        color: this.colorMap[key]
                    }
                });
            }
            chart.setOption({
                grid: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
                },
                title: {
                text: 'Number of travel',
                textStyle: {
                    fontWeight: 600,
                    fontSize: 12,
                    color: '#000',
                }
                },
                xAxis: {
                type: 'category',
                show: false
                },
                yAxis: {
                type: 'value',
                show: false
                },
                series: [
                {
                    data,
                    type: 'bar'
                }
                ]
            });
        },
        drawTimeFrequency(){
            // 定义刻度文本
            const text = ['01', '03', '05', '07', '09', '11', '13', '15', '17', '19', '21', '23'];
            // 定义容器宽高
            const width = 480;
            const height = 66;
            // 定义正方形尺寸
            const size = 18;
            // 定义颜色比例尺
            let colorScale = d3.scaleLinear()
                .domain([0, d3.max(this.odMes.hot)])
                .range(['#fff', '#39a6dd']);
            // 向容器中添加svg画布
            let canvas = d3.select(`#${this.timeContainerId}`)
                .append('svg')
                .attr('width', width)
                .attr('height', height);
            // 开始绘制24个正方形
            const squares = canvas.append('g')
                .attr("transform", `translate(20, 20)`)
                .selectAll('rect')
                .data(this.odMes.hot)
                .enter()
                .append('rect');
            squares
                .attr('x', (d, i) => i * size)
                .attr('y', 0)
                .attr('width', size)
                .attr('height', size)
                .attr('stroke', '#fff')
                .attr('stroke-width', '1px')
                .attr('fill', (d)=>{
                return colorScale(d);
                });
            // 添加刻度
            const textScale = d3.scaleBand()
                .domain(text)
                .range([0, 431]);
            const axisGenerator = d3.axisBottom(textScale)
                .ticks(12);
            canvas.append("g")
                .attr("transform", "translate(20, 40)")
                .call(axisGenerator);
            // 添加title
            canvas.append("text")
                .attr("x", 5)
                .attr("y", height - 50)
                .text("Time Heatmap")
                .attr("font-size", "12px")
                .attr("fill", "#000")
                .attr('font-weight', 600);
        }
    }
}
</script>

<style scoped>
.odMessage{
    grid-column: 17 / 33;
    grid-row: 2 / 21;
    background-color: #fff;
}
.odMessage{
    display: flex;
    flex-direction: row;
}
.odMessage .pathCluster{
    flex-basis: 50%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
.odMessage .pathCluster .scatter{
    flex-basis: 70%;
}
.odMessage .pathCluster .timeAndNum{
    flex-basis: 30%;
    display: flex;
    flex-direction: column;
}
.odMessage .pathCluster .timeAndNum .time{
    flex-basis: 40%;
}
.odMessage .pathCluster .timeAndNum .bar{
    flex-basis: 60%;
}
.odMessage .mesTable{
    flex-basis: 50%;
    overflow-y: scroll;
    overflow-x: scroll;
}
</style>