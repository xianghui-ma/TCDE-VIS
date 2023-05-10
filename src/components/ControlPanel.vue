<template>
<section class="controlPanel">
    <section class='dateBox'>
        <el-divider content-position="center">Select&nbsp;Date</el-divider>
        <el-date-picker v-model="date" size="mini" type="date" placeholder="Select Date"></el-date-picker>
    </section>
    <section class='hourBox'>
        <el-divider content-position="center">Select&nbsp;Time</el-divider>
        <el-time-picker v-model="time" size="mini" is-range range-separator="-" start-placeholder="Start" end-placeholder="End"></el-time-picker>
    </section>
    <section class='odHeatmap'>
        <el-divider content-position="center">OD&nbsp;Heatmap</el-divider>
        <section class='heatmapControl'>
            <p>Hidden/Show Layer:</p>
            <el-switch style="padding-left: 30%" v-model="showHeatmap" active-color="#13ce66" inactive-color="#aaa" change="isShowOdLayer"></el-switch>
            <p>Select Travel Type:</p>
            <el-select size="mini" v-model="selectedType" placeholder="Travel Type">
                <el-option v-for="item in travels" :key="item.type" :label="item.type" :value="item.type"></el-option>
            </el-select>
            <p>OD Heatmap Accuracy:</p>
            <el-slider v-model="accuracy" :min="50" :max="500" :step="50"></el-slider>
        </section>
    </section>
    <section class='travelBox'>
        <el-divider content-position="center">Travel&nbsp;Colors</el-divider>
        <section class='travelList'>
            <section class="leftCol">
                <p v-for="item in leftColTravel" :key="item.type"><span class="colorMark" :style="{backgroundColor: item.color}"></span><span>{{ item.type }}</span></p>
            </section>
            <section class="rightCol">
                <p v-for="item in rightColTravel" :key="item.type"><span class="colorMark" :style="{backgroundColor: item.color}"></span><span>{{ item.type }}</span></p>
            </section>
        </section>
    </section>
</section>
</template>

<script>
import {mapGetters, mapState} from 'vuex';

export default {
    name: 'ControlPanel',
    computed: {
        ...mapGetters('publicData', ['travels']),
        ...mapState('publicData', ['leftColTravel', 'rightColTravel']),
        ...mapState('mapData', ['map', 'heatMap'])
    },
    data(){
        return {
            date: '',
            time: '',
            showHeatmap: true,
            selectedType: '',
            accuracy: 200,
        };
    },
    methods: {
        isShowOdLayer(checked){
            console.log(checked);
            checked ? this.map.addLayer(this.heatMap) : this.map.removeLayer(this.heatMap);
        }
    }
}
</script>

<style scoped>
.controlPanel{
    grid-column: 1 / 4;
    grid-row: 2 / 21;
    background-color: #fff;
    padding: 0em 0.5em 0em 0.5em;
}
.controlPanel .el-divider{
    margin: 1.2em 0 1.2em 0;
}
.controlPanel .el-divider__text{
    font-weight: 600;
}
.controlPanel .el-date-editor{
    width: 100%;
}
.controlPanel .odHeatmap .heatmapControl{
    font-size: 0.8rem;
    font-weight: 800;
    text-align: left;
}
.controlPanel .odHeatmap .heatmapControl p{
    margin: 0.4em 0 0.4em 0;
}
.controlPanel .odHeatmap .heatmapControl .el-switch__core{
    width: 90px !important;
}
.controlPanel .travelBox .travelList{
    width: 100%;
    display: flex;
    flex-direction: row;
    font-size: 0.8rem;
    font-weight: 800;
    justify-content: space-between;
    text-align: left;
}
.controlPanel .travelBox .travelList p{
    margin-bottom: 1em;
}
.controlPanel .travelBox .travelList .colorMark{
    display: inline-block;
    width: 1em;
    height: 1em;
    border-radius: 30%;
    margin-right: 0.3em;
}
</style>