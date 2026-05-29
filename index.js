const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const app = express();
dotenv.config()

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

const PORT = process.env.PORT

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    await client.connect();

    const db = client.db('studyNookDB')
    const roomCollection = db.collection('addRooms');
    const bookingCollection = db.collection('bookings')

    console.log("MongoDB Connected Successfully");

    app.get("/featured", async(req, res) => {
      const featureRoom = req.body
      const result = await roomCollection.find().limit(3).toArray()
      res.json(result)
    })

    app.get("/", (req, res) => {
      res.send("Express Running Successfully");
    });

    app.post("/rooms", async (req, res)=> {
      const roomData = req.body
      const result = await roomCollection.insertOne(roomData)
      res.json(result)
    });

    app.get("/rooms", async(req, res)=> {
      const result = await roomCollection.find().toArray()
      res.json(result)
    })

    app.get("/rooms/:id", async(req, res)=> {
      const id = req.params.id
      const query = {
        _id : new ObjectId(id)
      }
      const result = await roomCollection.findOne(query)
      res.json(result)
    })

    app.post("/bookings", async (req, res)=> {
      const bookingData = req.body
      const result =  await bookingCollection.insertOne(bookingData)
      res.json(result)
    })

    app.get("/bookings/:userId", async(req, res) => {
      const {userId} = req.params
      const result = await bookingCollection.find({userId : userId}).toArray()
      console.log(result)
      res.json(result)
    })

  } catch (error) {
    console.log(error);
  }
}

run();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});