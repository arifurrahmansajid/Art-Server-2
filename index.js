const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors({origin:["http://localhost:5173", "https://art-craft-client-site.netlify.app"]}));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t2l3l6n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const artcraftdb = client.db('artcraftDB').collection('artcraft');
        const otherdb = client.db('artcraftDB').collection('category')

        app.get('/artcraft', async (req, res) => {
            const cursor = artcraftdb.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/category', async (req, res) => {
            const cursor = otherdb.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // data server site and database to client site data update 1
        app.get('/artcraft/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await artcraftdb.findOne(query);
            res.send(result);
        })

        app.post('/artcraft', async (req, res) => {
            const newArtCraft = req.body;
            console.log('add server side', newArtCraft);
            const result = await artcraftdb.insertOne(newArtCraft);
            res.send(result);
        })

        // data server site and database to client site data update 1
        app.put('/artcraft/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const update = req.body;
            const artcraft = {
                $set: {
                     subcategory: update.subcategory,
                     itme: update.itme,
                     description: update.description,
                     photo: update.photo,
                     price: update.price,
                     rating: update.rating,
                     customization: update.customization,
                     time: update.time,
                     stock: update.stock,
                }
            }
            // console.log(artcraft)
            const result = await artcraftdb.updateOne(filter, artcraft, options);
            res.send(result);
        })

        app.delete('/artcraft/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('Card delete', id);
            const qurey = { _id: new ObjectId(id) }
            const result = await artcraftdb.deleteOne(qurey);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

// routing 
app.get('/', (req, res) => {
    res.send("Art and Craft Server Side Runing");
})

app.listen(port, () => {
    console.log(`Web Art and Craft Server Side Runing on Port ${port}`)
})
