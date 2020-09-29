const express = require('express')
const bodyParser = require('body-parser');
const password = '3vEZjXjUzJ9zUfS';
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = "mongodb+srv://organicUser:3vEZjXjUzJ9zUfS@cluster0.sgixs.mongodb.net/organicbd?retryWrites=true&w=majority";


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("organicdb").collection("products");

  app.get('/collection', (req, res)=>{
    productCollection.find({})
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })

  app.post("/addProduct", (req, res)=>{
    const product = req.body;
    console.log(product);
    productCollection.insertOne(product)
    .then(result=>{
    console.log('Product added Successfully');
    // res.send('Success');
    res.redirect('/');
    })
  })

  app.delete(`/delete/:id`, (req, res)=>{
    console.log(req.params.id); 
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result=>{
      console.log(result);
      res.send(result.deletedCount > 0);

    })
  })

  app.patch(`/update/:id`, (req, res)=>{
    console.log(req.body.size);
    productCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {'size': req.body.size, 'quantity': req.body.quantity},
      $currentDate: { "lastModified": true }
    })
    .then( result => {
      console.log(result);
      res.send(result.modifiedCount > 0);
    })
  })

  app.get(`/product/:id`, (req, res)=>{
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents)=>{
      res.send(documents[0]);
    })
  })
  
  if (err) throw err;
  console.log('database connected');
  // perform actions on the collection object
  
});


app.listen(3000, ()=>console.log("Listening to port 3000"));