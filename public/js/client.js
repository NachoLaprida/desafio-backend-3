const socket = io.connect()

const render = (chat) => {
    let mensajes = document.querySelector(`#chat`)
    let html = chat.map(text => {
        return `<li>
            <strong>${text.txt}</strong>
        </li>`
    })
    mensajes.innetHTML = html.join(' ')
}

const addText = (evt) => {
    const mensaje = document.querySelector('#mensaje').value

    const enviar = {mensaje}

    socket.emit('mensaje-nuevo', enviar, (id) => {
        console.log(id)
    })
    return false
}




socket.on('connect', () => {
    console.log('connected to server')

    //socket.emit('mensaje-cliente', 'Hola Server como estas')
})

socket.on('mensaje-server', (mensaje) => {
    render(mensaje.chat)
})

