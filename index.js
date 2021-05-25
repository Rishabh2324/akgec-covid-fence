class GeoMap {
    constructor(mapElement){
        this.platform = new H.service.Platform({
            apikey:hereCredentials.apikey 
        });
  
        this.map = new H.Map(
            mapElement,
            this.platform.createDefaultLayers().vector.normal.map,
            {
                zoom: 10,
                center: { lat:25, lng:78 },
                pixelRatio: window.devicePixelRatio || 1

            }
        );
        this.map.setCenter({ lat: 25.461138599999998, lng: 78.55616959999999 })
        setTimeout(() => {
            this.map.setZoom(20)
        }, 3000);
        const mapEvent = new H.mapevents.MapEvents(this.map);
        const behavior = new H.mapevents.Behavior(mapEvent);
        this.geofencing = this.platform.getGeofencingService();
        this.currentPosition = new H.map.Marker({ lat: 25.461138599999998, lng: 78.55616959999999 });
        this.map.addObject(this.currentPosition);
        this.map.addEventListener("tap", (ev) => {
            var target = ev.target;
            this.map.removeObject(this.currentPosition);
            this.currentPosition = new H.map.Marker(this.map.screenToGeo(ev.currentPointer.viewportX, ev.currentPointer.viewportY));
            this.map.addObject(this.currentPosition);
            this.fenceRequest(["1234"], this.currentPosition).then(result => {
                if(result.geometries.length > 0) {
                    alert("You are within a geofence!")
                } else {
                    alert("Not within a geofence!");
                }
            });
        }, false);
    }

    
    draw(mapObject) {
        this.map.addObject(mapObject);
    }
    polygonToWKT(polygon) {
        const geometry = polygon.getGeometry();
        return geometry.toString();
    }
    uploadGeofence(layerId, name, geometry) {
        const zip = new JSZip();
        zip.file("data.wkt", "NAME\tWKT\n" + name + "\t" + geometry);
        return zip.generateAsync({ type:"blob" }).then(content => {
            var formData = new FormData();
            formData.append("zipfile", content);
            return axios.post("https://fleet.ls.hereapi.com/2/layers/upload.json", formData, {
                headers: {
                    "content-type": "multipart/form-data"
                },
                params: {
                    "layer_id": layerId,
                    "apiKey":hereCredentials.apikey
                }
                
            });
        });
    }
    fenceRequest(layerIds, position) {
        debugger
        return new Promise((resolve, reject) => {
            this.geofencing.request(
                H.service.extension.geofencing.Service.EntryPoint.SEARCH_PROXIMITY,
                {
                    'layer_ids': layerIds,
                    'proximity': position.b.lat + "," + position.b.lng,
                    'key_attributes': ['NAME']
                },
                result => {
                    resolve(result);
                }, error => {
                    reject(error);
                }
            );
        });
    }

}

