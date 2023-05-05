<template>
<header class="systemHeader">
    <h1>TCDEVIS</h1>
</header>
</template>

<script>
export default {
    name: 'Header'
}
</script>

<style scoped>
.systemHeader{
  grid-column: 1 / 33;
  grid-row: 1 / 2;
}
.systemHeader h1{
    width: 100%;
    height: 100%;
    background-color: #ccc;
    color: #fff;
    text-align: center;
}
</style>