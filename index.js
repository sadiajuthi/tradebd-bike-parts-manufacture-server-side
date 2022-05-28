const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// connect to mongoDB


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wujqyvj.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db('tradebd').collection('products');

        const reviewCollection = client.db('tradebd').collection('reviews');

        const userCollection = client.db('tradebd').collection('users');
        const orderCollection = client.db('tradebd').collection('orders');

        const adminCollection = client.db('tradebd').collection('users')

        // const userCollection=client.db('tradebd')=client.db('tradebd').collection('admin')

        // admin and users
        app.get('/user', async (req, res) => {
            const users = await userCollection.find().toArray();
            res.send(users);
        });




        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })





        // get all product
        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        })

        // get order by user


        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })

        app.get('/order', async (req, res) => {

            const email = req.query.email;

            const query = { email: email };
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);

        })

        // get product by id
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        })

        // add a product by admin
        app.post('/product', async (req, res) => {
            const newproduct = req.body;
            const result = await productCollection.insertOne(newproduct);
            res.send(result);
        })

        // get all review
        app.get('/review', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews)
        })

        // Add review
        app.post('/review', async (req, res) => {
            const newReview = req.body;
            const result = await reviewCollection.insertOne(newReview);
            res.send(result);
        })


    }
    finally {

    }
};

run().catch(console.dir)

// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });


app.get('/', (req, res) => {
    res.send('Hello from, tradebd')
});

app.listen(port, () => {
    console.log(`tradebd server listening port ${port}`);
})
