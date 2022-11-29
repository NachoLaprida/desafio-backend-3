const {faker} = require('@faker-js/faker')

faker.locale = 'es'

function generateProducts(quantity = 1) {
    let Products = []
    for(i = 0; i < quantity; i++){
        Products.push({
            id: faker.random.numeric(),
            name: faker.commerce.product(),
            price: faker.commerce.price(100, 200, 0),
            thumbnail: faker.image.imageUrl(null, null, null, true)
        })
    }
    return Products
}

module.exports = { generateProducts }
