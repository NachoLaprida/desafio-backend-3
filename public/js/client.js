const socket = io.connect()


//////////// chat //////////////////
const renderChat = (chat) => {
    console.log(chat)
    let mensajes = document.querySelector(`#chat`)
    let html = chat.map(text => {
        return `<div>
            <p class="fyh">[${fecha.day}/${fecha.month}/${fecha.year} ${hora.hour}:${hora.minutes}:${hora.seconds}] : <i class="texto"> ${text.mensaje}</i></p>
        </div>`
    })
    
    mensajes.innerHTML = html.join(' ')
}

const addText = (evt) => {
    const mensaje = document.querySelector('#mensaje').value
    const enviar = {mensaje}

    socket.emit('mensaje-nuevo', enviar, (id) => {
    console.log(id)
    })
    return false
}

socket.on('mensaje-servidor', (mensaje) => {
    console.log(mensaje)
    renderChat(mensaje.messages)
    
})
const time = new Date()
const hour = time.getHours()
const minutes = time.getMinutes()
const seconds = time.getSeconds()
const hora = {
    hour: hour,
    minutes: minutes,
    seconds: seconds
}

const date = new Date()
const year = date.getFullYear()
const month = date.getMonth()
const day = date.getDate()
const fecha = {
    day: day,
    month: month,
    year: year
} 

const addEmail = (evt) => {
    const email = document.querySelector('#email').value
    const enviar = {email}

    socket.emit('mensaje-email', enviar, (id) => {
    console.log(id)
    })
    return false
}
socket.on('mensaje-email-agregado', (data) => {
    console.log('email agregado', data)
})

///////////////// catalogo con web socket //////////////////

const addProduct = (evt) => {
    const name = document.querySelector('#name').value
    const price = document.querySelector('#price').value
    const thumbnail = document.querySelector('#thumbnail').value
    const enviar = {
        name: name,
        price: price,
        thumbnail: thumbnail
    }

    socket.emit('mensaje-nuevo-producto', enviar, (id) => {
    console.log(id)
    })
    return false
}

const renderProduct = (prod) => {
    let mensaje = document.querySelector(`#catalogo`)
    let html = `
            <div class="card tarjeta m-3" style="width: 18rem;">
                <img src=${prod.thumbnail} class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title"> ${prod.name}</h5>
                    <h5 class="card-title">$${ prod.price }</h5>
                </div>
            </div>
    `
    mensaje.innerHTML += html
}

socket.on('mensaje-servidor-nuevo-producto', (data) => {
    console.log('nuevo producto agregado',data)
    renderProduct(data)
})
/////////////////////////////////////////////


socket.on('connect', () => {
    console.log('connected to server')

    //socket.emit('mensaje-cliente', 'Hola Server como estas')
})





