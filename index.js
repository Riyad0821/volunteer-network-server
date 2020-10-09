const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config()
const app = express()

app.use(bodyParser.json());
app.use(cors());



const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qguwb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const activitiesCollection = client.db("volunteerNetwork").collection("activities");
  const registrationsCollection = client.db("volunteerNetwork").collection("registrations");

  app.get('/', (req, res) => {
    res.send('Hello folks, It is working.');
  }) 


  app.post('/addActivity', (req, res) => {
    const activities = req.body;
    activitiesCollection.insertMany(activities)
      .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount)
      })
  })

  app.post('/addEvent', (req, res) => {
    const events = req.body;
    activitiesCollection.insertOne(events)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.delete('/admin', cors(), (req, res) => {
    registrationsCollection.deleteOne({_id: ObjectId(req.query._id) })
      .then(documents => {
        res.send(documents.deletedCount > 0);
        //res.redirect('/');
      })
  })


  app.get('/activities', (req, res) => {
    activitiesCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })
  app.get('/lists', (req, res) => {
    registrationsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })
  app.get('/profile', (req, res) => {
    registrationsCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      })
  })
  app.get('/activities/:serviceType', (req, res) => {
    activitiesCollection.find({ serviceType: req.params.serviceType })
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
  })

  app.post('/addRegistration', (req, res) => {
    const registration = req.body;
    registrationsCollection.insertOne(registration)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })
  console.log('Database Connected');
});

app.listen(process.env.PORT || port)