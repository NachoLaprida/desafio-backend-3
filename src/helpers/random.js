const calculo = (cant) => {
    var map = new Map()
    for(i = 1; i <= cant; i++){
        map.set(i, getRandomIntInclusive(1, 20000))
    }
    var obj = Object.fromEntries(map)
    var jsonString = JSON.stringify(obj)
    return jsonString
}

process.on('message', cant => {
    process.send(calculo(cant))
})

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min) // The maximum is inclusive and the minimum is inclusive
}