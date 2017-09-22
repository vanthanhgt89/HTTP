const app = require('express')()

const Promise = require('bluebird')
const {
  db,
} = require('./pgp')
const Product = require('./product')

// ====== REDIS CONFIG ======
const redist = require('promise-redis')(function (resolver) {
  return new Promise(resolver)
})

const client = redist.createClient()

client.on('connect', () => {
  console.log('connected');
})




app.get('/', (req, res) => {
  client.hgetall('key10')
    .then(result => {
      if (result) {
        console.log('A');
        console.log(result);
        let data = JSON.parse(result.b)
        res.json(data)

      } else {
        console.log('b');
        db.task(t => {
            return t.batch([
              Product.generalProduct(1, 6),
              Product.getCategoryById(2, 1, 10),
              Product.getCategoryById(2, 1, 10),
              Product.getCategoryById(2, 1, 10),
              Product.getCategoryById(2, 1, 10),
              Product.getCategoryById(2, 1, 10)
            ])
          })
          .then(data => {
            client.hset('key10', 'b', JSON.stringify(data))
            res.json(data)

          })

      }
    })
    .catch(err => {
      throw Error
    })

})




app.listen(3000, () => {
  console.log('listen 3000');
})