const socket = io.connect()


//////////// chat //////////////////
const renderChat = (chatHistory) => {
    console.log(chatHistory)
    let mensajes = document.querySelector(`#chat`)
    let html = chatHistory.map(chat => {
        return `<div>
            <p class="fyh">[${chat.dateTime}] <strong>${chat.author.id}</strong>: <i class="texto"> ${chat.message}</i></p>
        </div>`
    })
    
    mensajes.innerHTML = html.join(' ')
}

const addText = (evt) => {
    const mensaje = {
        author: {
            id: document.querySelector('#email').value,
            avatar: document.querySelector('#avatar').value,
            age: document.querySelector('#age').value,
            firstName: document.querySelector('#firstName').value,
            lastName: document.querySelector('#lastName').value,
            alias: document.querySelector('#alias').value
        }, 
        message: document.querySelector('#message').value,
        dateTime: new Date()   
    }
    
    /* const enviar = {mensaje} */

    socket.emit('mensaje-nuevo', mensaje, (id) => {
    console.log(id)
    })
    return false
}

socket.on('mensaje-servidor', (chat) => {
    renderChat(chat)
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






