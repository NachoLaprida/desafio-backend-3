const socket = io && io.connect()




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
                <button class="btn btn-primary" type="button">Button</button>
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


//////////////////////////////// desafio redis /////////////


const btnLogin = document.querySelector('#submit-login')
btnLogin && btnLogin.addEventListener('click', e => {
    e.preventDefault()
    const url = `${window.location.origin}/api/usuarios/login`
    let email = document.querySelector("#email").value
    let password = document.querySelector("#password").value
    return fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(res => {
        if (res.status !== 200) {
            window.location.href = `${window.location.origin}/api/usuarios/login/error`
            return
        }
        window.location.href = `${window.location.origin}/api/productos`
    })
    .catch(err => {
        window.location.href = `${window.location.origin}/api/usuarios/login/error`
    })
})

const btnRegistro = document.querySelector('#submit-registro')
btnRegistro && btnRegistro.addEventListener('click', e => {
    e.preventDefault()
    const url = "/api/usuarios/registro"
    let email = document.querySelector("#email").value
    let password = document.querySelector("#password").value
    let name = document.querySelector("#name").value
    let age = document.querySelector("#age").value
    let avatar = document.querySelector("#avatar").value
    let address = document.querySelector("#address").value
    return fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, age, avatar, address })
    })
    .then(res => {
        if (res.status !== 200) {
            window.location.href = `${window.location.origin}/api/usuarios/registro/error`
            return
        }
        window.location.href = `${window.location.origin}/api/productos`
    })
    .catch(err => {
        window.location.href = `${window.location.origin}/api/usuarios/registro/error`
    })
})

const goToLogin = () => {
    window.location.href = `${window.location.origin}/api/usuarios/login`
}

const goToRegister = () => {
    window.location.href = `${window.location.origin}/api/usuarios/registro`
}

const goToLogOut = () => {
    window.location.href = `${window.location.origin}/api/usuarios/logout`
}

const goToProfile = () => {
    window.location.href = `${window.location.origin}/api/productos/profile`
}

const goToHome = () => {
    window.location.href = `${window.location.origin}/api/productos`
}

const goToCart = () => {
    window.location.href = `${window.location.origin}/api/carrito`
}
/////////////////// CARRITO /////////////////

const addToCart = (productId) => {
    let url = 'carrito'
    return fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({productId})
    })
    .then(res => {
        console.log(`se agrego un producto al carrito`)
    })
    .catch(err => {
        console.log(err)
    })
}