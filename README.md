# desafio-backend-3

Las colecciones para el desafio de la clase 18, son ecommerce que sería la de productos y comentarios que seria la mensaje.

3) 
    db.ecommerce.find()
    db.comentarios.find()

4)
    db.ecommerce.countDocuments()
    db.comentarios.countDocuments()

5) 
    a)
        db.ecommerce.insertOne({'name': 'Camiseta de Japon', 'price':'1200', 'thumbnail':'https://purodiseno.lat/wp-content/uploads/2022/04/CAMISETA-JAPON-2-759x621.png'})
    b)
        i)db.ecommerce.find({'price': {$lt: 1000}})
        ii)db.ecommerce.find({'price': {$gt: 1000, $lt: 3000}})
        iii)db.ecommerce.find({'price': {$gt: 3000}})
        iv)db.ecommerce.find().sort({'price': 1}).limit(1).skip(2)
    c)
        db.ecommerce.updateMany({}, {$set: {'stock': 100}})
    d)
        db.ecommerce.updateMany({'price': {$gt: 4000}}, {$set: {'stock': 0}})
    e)
        db.ecommerce.deleteMany({'price': {$lt: 1000}})

6)
    db.createUser(
  {
    user: "pepe",
    pwd: "asd456",
    roles: [
       { role: "read", db: "ecommerce" }
    ]
  }
)


