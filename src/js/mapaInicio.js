(function(){
    const lat = 4.6321707;
    const lng = -74.0664525;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 16);

    let markers = new L.FeatureGroup().addTo(mapa)
    // console.log(markers)

    let propiedades = [];

    const filtros = {
        categoria:'',
        precio:''
    }

    const categoriasSelect = document.querySelector("#categorias")
    const preciosSelect = document.querySelector("#precios")

    //filtros
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //filtrado de categorias y precios
    categoriasSelect.addEventListener('change', e=>{
        // console.log(+e.target.value)//Con el + convertimos el dato de tipo string a number
        filtros.categoria = +e.target.value
        filtrarPropiedades();
    })

    preciosSelect.addEventListener('change', e=>{
        // console.log(+e.target.value)//Con el + convertimos el dato de tipo string a number
        filtros.precio = +e.target.value
        filtrarPropiedades();
    })

    const obtenerPropiedades = async()=>{
        try {
            const url = '/api/propiedades'
            const respuesta = await fetch(url)
            propiedades = await respuesta.json()
            // console.log(propiedades)
            // console.log(respuesta)
            mostrarPropiedades(propiedades)
            
        } catch (error) {
            console.log(error)
        }
    }

    const mostrarPropiedades = propiedades =>{

        //Limpiar los markers previos
        markers.clearLayers()

        // console.log(propiedades)
        propiedades.forEach(propiedad =>{
            //Agregar los pines
            const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
                autopan: true,
            })
            .addTo(mapa)
            .bindPopup(`
                <p class="text-indigo-600 font-bold">${propiedad.categoria.nombre}</p>
                <h1 class="text-xl font-extrabold uppercase my-3">${propiedad?.titulo}</h1>
                <img src="/uploads/${propiedad?.imagen}" alt"Imagen de la propiedad ${propiedad.titulo}">
                <p class="text-gray-600 font-bold">${propiedad.precio.nombre}</p>
                <a href="/propiedad/${propiedad.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase rounded-md">Ver propiedad</a>
                
            `)

            markers.addLayer(marker)
        })
    }

    const filtrarPropiedades = ()=>{
        // console.log("filtrando.....")
        // console.log(propiedades)
        const resultado = propiedades.filter(filtrarCategoria).filter(filtrarPrecio)
        mostrarPropiedades(resultado)
    }    
    
    const filtrarCategoria = (propiedad) =>{
        // console.log(propiedad.categoriaId)
        return filtros.categoria? propiedad.categoriaId === filtros.categoria : propiedad
    }

    const filtrarPrecio = (propiedad) =>{
        // console.log(propiedad.categoriaId)
        return filtros.precio? propiedad.precioId === filtros.precio : propiedad
    }

    obtenerPropiedades()
})()