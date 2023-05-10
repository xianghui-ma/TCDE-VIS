<template>
<section class="map" id="mapContainer"></section>
</template>

<script>
import L from 'leaflet';
import {DrawAreaSelection} from '@bopen/leaflet-area-selection';
import {mapState} from 'vuex';

import "leaflet/dist/leaflet.css";
import '@bopen/leaflet-area-selection/dist/index.css';

export default {
    name: 'Map',
    computed: {
        ...mapState('publicData', ['serverPrefix']),
    },
    data(){
        return {
            mapContainerId: 'mapContainer',
            map: null,
            searchArea: [],
            selectedAreaLayer: []
        };
    },
    methods: {
        // 加载地图
        loadMap(){
            this.map = L.map(this.mapContainerId).setView([28.676493, 115.892151], 13);
            L.tileLayer('https://api.mapbox.com/styles/v1/smallma/clb4twadj000w15mmqu5b8c5f/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic21hbGxtYSIsImEiOiJja3lxeTRwdGUwaHpnMnV0Z2puN3hqY2Y4In0.JPUf6RG-a2zrvBVsyKLAFA', {
                attribution: '&copy; <a href="https://www.mapbox.com/">mapbox</>'
            }).addTo(this.map);
        },
        // 添加选区按钮
        addBrushButton(){
            let selectedArea = null;
            this.map.addControl(new DrawAreaSelection({
                position: 'topleft',
                onPolygonReady: (polygon)=>{
                    selectedArea = polygon.toGeoJSON(3);
                    this.searchArea.push(selectedArea.geometry.coordinates[0]);
                },
                onButtonDeactivate: ()=>{
                    // 向地图添加选区图层
                    this.selectedAreaLayer.push(
                        L.geoJSON(selectedArea, {
                            style: {
                                weight: 0
                            }
                        }).addTo(this.map)
                    );
                }
            }));
        },
        // 添加删除按钮
        addDeleteButton(){
            L.Control.ClearButton = L.Control.extend({
            onAdd: ()=>{
                    let clearButton = L.DomUtil.create('img');
                    clearButton.src = './clear.png';
                    clearButton.style.width = '32px';
                    clearButton.style.height = '32px';
                    clearButton.style.borderRadius = '10%';
                    clearButton.style.border = '1px solid #ccc';
                    clearButton.style.backgroundColor = '#fff';
                    clearButton.style.cursor = 'pointer';
                    L.DomEvent.on(clearButton, 'click', ()=>{
                        this.clearSelectedAreaLayer();
                    });
                    return clearButton;
                }
            });
            L.control.clearButton = (opts)=>{
                return new L.Control.ClearButton(opts);
            }
            L.control.clearButton({ position: 'topleft' }).addTo(this.map);
        },
        // 添加查询按钮
        addSearchButton(){
            L.Control.SearchButton = L.Control.extend({
                onAdd: ()=>{
                    let searchButton = L.DomUtil.create('img');
                    searchButton.src = './search.png';
                    searchButton.style.width = '32px';
                    searchButton.style.height = '32px';
                    searchButton.style.borderRadius = '10%';
                    searchButton.style.border = '1px solid #ccc';
                    searchButton.style.backgroundColor = '#fff';
                    searchButton.style.cursor = 'pointer';
                    L.DomEvent.on(searchButton, 'click', ()=>{
                        axios({
                            method: 'post',
                            url: `${this.serverPrefix}odPathSearch`,
                            data: {
                                startArea: this.searchArea[0],
                                endArea: this.searchArea[1]
                            }
                        }).then((response)=>{
                            
                            // pubsub.publish('odMes', response.data);
                        });
                    });
                    return searchButton;
                }
            });
            L.control.searchButton = (opts)=>{
                return new L.Control.SearchButton(opts);
            }
            L.control.searchButton({ position: 'topleft' }).addTo(this.map);
        },
        clearSelectedAreaLayer(){
            this.selectedAreaLayer.forEach((item)=>{
                this.map.removeLayer(item);
            });
            this.selectedAreaLayer = [];
            this.searchArea = [];
        }
    },
    mounted(){
        this.loadMap();
        this.addBrushButton();
        this.addDeleteButton();
        this.addSearchButton();
    }
}
</script>

<style scoped>
.map{
  grid-column: 4 / 17;
  grid-row: 2 / 21;
  background-color: #fff;
}
</style>