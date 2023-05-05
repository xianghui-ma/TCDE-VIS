<template>
<section id="app">
    <Header/>
    <ControlPanel/>
    <Map/>
    <OdMessage/>
    <TimeFrequency/>
    <DrivingStatus/>
</section>
</template>

<script>
import Header from './components/Header.vue';
import ControlPanel from './components/ControlPanel.vue';
import Map from './components/Map.vue';
import OdMessage from './components/OdMessage.vue';
import TimeFrequency from './components/TimeFrequency.vue';
import DrivingStatus from './components/DrivingStatus.vue';


export default {
  name: 'App',
  components: {
    Header,
    ControlPanel,
    Map,
    OdMessage,
    TimeFrequency,
    DrivingStatus
  }
}
</script>

<style>
/* 划分页面网格 */
#app {
  display: grid;
  width: 100vw;
  height: 100vh;
  grid-template-columns: repeat(32, 1fr);
  grid-template-rows: repeat(32, 1fr);
	grid-gap: 0.0625em;
  background-color: #d1d1d1;
}

/* 组件SystemHeader位置 */
#app .systemHeader{
  grid-column: 1 / 33;
  grid-row: 1 / 2;
}

/* 组件TravelEmissionVary位置 */
#app .timeFrequency{
  grid-column: 1 / 17;
  grid-row: 21 / 33;
  background-color: #fff;
}

/* 组件Barometer样式 */
#app .drivingStatus{
  grid-column: 17 / 33;
  grid-row: 21 / 33;
  background-color: #fff;
}

#app .odMessage{
  grid-column: 17 / 33;
  grid-row: 2 / 21;
  background-color: #fff;
}

/* 同rem设置字号，用em设置其他属性 */
:root{
  font-size: 1em;
}
/* 清除浏览器默认样式 */
html,
body,
p,
ol,
ul,
li,
dl,
dt,
dd,
blockquote,
figure,
fieldset,
legend,
textarea,
pre,
iframe,
hr,
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
  padding: 0;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: 1.3rem;
}

ul {
  list-style: none;
}

button,
input,
select {
  margin: 0;
}

html {
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: inherit;
}

img,
video {
  height: auto;
  max-width: 100%;
}

iframe {
  border: 0;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

td,
th {
  padding: 0;
}
a{
  text-decoration: none;
  color: #000;
}
:root{
  font-size: 1em;
}
</style>