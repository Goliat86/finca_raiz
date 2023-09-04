(function() {
    const lat = document.querySelector('#lat').value || 4.6321707;// usamos logical or para gusrdar la posicion del pin en el mapa en caso de que algun campo falte ene le formulario o si es un string vacio cargue las coordenadas por default
    const lng = document.querySelector('#lng').value || -74.0664525;
    const mapa = L.map('mapa').setView([lat, lng ], 16);
    let marker;

    //Utilizar provider y geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // El pin
    marker = L.marker([lat, lng],{
        draggable:true,// permite mover el pin
        autoPan:true //permite mover el pin junto con el mapa
    }) 
    .addTo(mapa)

    // Detectar la longitud y latitud del pin
    marker.on('moveend', function(e){
        marker = e.target
        const posicion = marker.getLatLng();//se usa para optener la latitud y la longitud donde ubiquemos el pin
        console.log(posicion)
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))//se usa para centrar el mapa

        //obtener el nombre de las calles al soltar el pin
        geocodeService.reverse().latlng(posicion,13).run(function(error, resultado){
            
            marker.bindPopup(resultado.address.LongLabel)

        //llenar los campos
            document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';
            document.querySelector('#calle').value = resultado?.address?.Address ?? '';
            document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';
            document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';
        })

    })
        
})()