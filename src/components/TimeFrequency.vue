<template>
<section class="timeFrequency" id="canvas"></section>
</template>

<script>
import * as d3 from 'd3';
import axios from 'axios';
import {mapGetters} from 'vuex';

export default {
    name: 'TimeFrequency',
    computed: {
        ...mapGetters('publicData', ['travelType']),
    },
    data(){
        return {
            canvasId: 'canvas',
            cellArr: [],
            width: 0
        };
    },
    methods: {
        // 划分网格
        drawGrid(){
            // 选择DOM容器
            let canvas = document.getElementById(this.canvasId);
            // 向容器中添加svg画布
            canvas = d3.select(`#${this.canvasId}`)
                .append('svg')
                .attr('width', canvas.offsetWidth)
                .attr('height', canvas.offsetHeight);
            // 计算每个单元格的宽高
            this.width = canvas.attr('width') / 5;
            let height = canvas.attr('height') / 2;
            // 排列第一排的单元格
            for(let i = 0; i < 5; i++){
                this.cellArr.push(
                    canvas.append('g')
                        .attr('transform', `translate(${(this.width / 2) + (i * this.width)}, ${height / 2})`)
                );
            }
            // 排列第二排的单元格
            for(let i = 0; i < 5; i++){
                this.cellArr.push(
                    canvas.append('g')
                        .attr('transform', `translate(${(this.width / 2) + (i * this.width)}, ${height / 2 + height})`)
                );
            }
        },
        // 绘制外圈的各时段出行频次柱状图
        drawFrequencyOfTravel(g, data){
            const INNERRADIUS = 50;
            const AXISMARKARR = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];

            // 定义线性比例尺
            let linearScale = d3.scaleLinear()
                .domain([0, d3.max(data)])
                .range([INNERRADIUS, (this.width - 18) / 2])

            // 添加组元素g，包裹出行频次柱状图
            let frequencyBarG = g.append('g');
            // 绘制圆弧
            let arcPathArr = [];
            data.forEach((item, index)=>{
                arcPathArr.push(
                    d3.arc()
                        .innerRadius(INNERRADIUS)
                        .outerRadius(linearScale(item))
                        .startAngle((index * 15) * (Math.PI / 180))
                        .endAngle((index * 15 + 15) * (Math.PI / 180))
                        .padAngle(0.02)
                );
            });
            frequencyBarG.selectAll('path')
                .data(arcPathArr)
                .join('path')
                .attr('d', (d)=>{
                    return d();
                })
                .attr('fill', '#39a6dd');

            // 添加组元素g，包裹刻度
            let axisG = g.append('g');
            // 绘制刻度
            let axisMark = null;
            AXISMARKARR.forEach((item)=>{
                axisMark = axisG.append('g')
                    .attr('transform', `rotate(${-90 + item * 15}) translate(${INNERRADIUS}, 0)`);
                axisMark.append('line')
                    .attr('x2', -5)
                    .attr('stroke', '#000')
                    .attr('stroke-width', '1.5px');
                axisMark.append('text')
                    .attr("text-anchor", "middle")
                    .attr('transform', 'rotate(90) translate(0, 12)')
                    .attr('font-size', '0.6rem')
                    .text(`${item}h`);
            })
        },
        // 绘制内圈的各时段排放径向面积图
        drawRadialAreaOfEmission(g, title, data){
            const OUTTERRADIUS = 50;
            const INNERRADIUS = 25;
            // 定义线性比例尺
            let linearScale = d3.scaleLinear()
                .domain([0, data.max])
                .range([INNERRADIUS, OUTTERRADIUS])
            // 绘制最大值径向面积
            let arcPath = d3.arc()
                .innerRadius(INNERRADIUS)
                .outerRadius(OUTTERRADIUS);
            g.append('g')
                .append('path')
                .attr('d', arcPath({startAngle: 0, endAngle: 2 * Math.PI}))
                .attr('fill', '#39a6dd')
                .attr('fill-opacity', 0.2);
            // 绘制平均排放线
            g.append('g')
                .append('circle')
                .attr("cx", g.attr('width') / 2)
                .attr("cy", g.attr('height') / 2)
                .attr("r", linearScale(data.average))
                .attr('stroke', '#39a6dd')
                .attr('stroke-width', '2px')
                .attr("stroke-dasharray", 8 + " " + 4)
                .attr("fill", "none"); 
            // 平分角度
            let angles = d3.range(0, 2 * Math.PI, Math.PI / 48);
            // 创建径向面积生成器
            let area = d3.areaRadial()
                .curve(d3.curveLinearClosed)
                .angle((d) => { return d })
                .innerRadius(INNERRADIUS)
                .outerRadius((d, i) => { return linearScale(data.emission[i]) });
            // 开始绘制
            g.append('g')
                .append('path')
                .attr('d', area(angles))
                .attr("fill", "#39a6dd")
                .attr("fill-opacity", 0.7);
            // 绘制旅行目的文字
            g.append('g')
                .append('text')
                .attr("text-anchor", "middle")
                .attr('font-size', '0.9rem')
                .attr('font-weight', 600)
                .attr('color', '#aaa')
                .text(title);
        },
        // 开始绘制
        async drawGraph(){
            this.drawGrid();
            let frequencyOfTravel = await axios.get('http://localhost:8081/frequencyOfTravel.json');
            let emissionOfTravel = await axios.get('http://localhost:8081/emissionOfTravel.json');
            frequencyOfTravel = frequencyOfTravel.data;
            emissionOfTravel = emissionOfTravel.data;
            this.cellArr.forEach((item, index)=>{
                this.drawFrequencyOfTravel(item, frequencyOfTravel[index + 1]);
                this.drawRadialAreaOfEmission(item, this.travelType[index], emissionOfTravel[index + 1]);
            });
        }
    },
    mounted(){
        this.drawGraph();
    }
}
</script>

<style scoped>
.timeFrequency{
    grid-column: 1 / 17;
    grid-row: 21 / 33;
    background-color: #fff;
    overflow: hidden;
}
</style>