<template>
<section class="odMessage">
    <section class='pathCluster' id='clusterBox'>
        <section class='scatter' id='scatterBox'></section>
        <section class='timeAndNum'>
            <section class='time' id='timeBox'></section>
            <section class='bar' id='barBox'></section>
        </section>
    </section>
    <section class='mesTable' id='tabelBox'></section>
</section>
</template>

<script>
export default {
    name: 'OdMessage'
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