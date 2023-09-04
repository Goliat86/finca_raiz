(function(){
    const cambiarEstadoBotones = document.querySelectorAll('.cambiar-estado')
    const token = document.querySelector('meta[name="csrf_token"]').getAttribute('content')

    cambiarEstadoBotones.forEach(boton =>{
        boton.addEventListener('click', cambiarEstadoPropiedad)
    })

    async function cambiarEstadoPropiedad(e){
        const {propiedadId: id} = e.target.dataset

        try {
            const url =`/propiedades/${id}`
            // console.log(url)
            const respuesta = await fetch(url, {
                method: 'PUT',
                headers: {
                    'CSRF-Token': token
                }
            })
            // console.log(respuesta)
            const {resultado} = await respuesta.json()
            if (resultado){
                if (e.target.classList.contains('bg-yellow-100')){
                    e.target.classList.add('bg-green-100', 'text-green-800')
                    e.target.classList.remove('bg-yellow-100', 'text-yellow-800')
                    e.target.textContent = 'Publicado'
                }else{
                    e.target.classList.remove('bg-green-100', 'text-green-800')
                    e.target.classList.add('bg-yellow-100', 'text-yellow-800')
                    e.target.textContent = 'No publicado'

                }
                //console.log(e.target.classList.containts('bg-yellow-100'))//Verificar el elemnto soblre el cual se esta dando click
            }
            // console.log(resultado)
        } catch (error) {
            console.log(error)
        }
        // console.log(id)
        // console.log(e.target.dataset)
    }
})()