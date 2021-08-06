const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');

const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()


const port = process.env.PORT || 5055;
console.log(process.env.DB_USER)

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello World! I Am Akash')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ifp7e.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection error', err);
  const photoCollection = client.db("studio").collection("photography");
  // perform actions on the collection object

  app.get('/addPhotographys', (req, res) => {
    photoCollection.find()
      .toArray((error, items) => {
        res.send(items)
      })
  })





  app.post('/addPhotographys', (req, res) => {
    const newPhotos = req.body;
    console.log('adding new Photo', newPhotos)
    photoCollection.insertOne(newPhotos)
      .then(result => {
        console.log('inserted count', result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })





  app.get('/addPhotography/:id', (req, res) => {
    photoCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((error, items) => {
        res.send(items)
      })
  })



  
  

  app.delete('/deletePhotography/:id', (req, res) =>{
    photoCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then( result => {
      res.send(result.deletedCount > 0);
    })
  })


  // client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})