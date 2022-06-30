const express = require('express');
const cors = require('cors');
require('dotenv').config()
const port=process.env.PORT || 5000;
const app=express()

//meddle ware
app.use(cors());
app.use(express.json()) //use to get data req.body


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2ptrm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const taskCollection = client.db('manage_Task').collection('task');

        app.get('/task', async (req, res) => {
            const query = {}; 
            const cursor = taskCollection.find(query);
            const task = await cursor.toArray();
            res.send(task);
        })
        
        //add task
        app.post('/add-task', async (req, res) => {
            const taskInfo = req.body
            const result = await taskCollection.insertOne(taskInfo)
            res.send(result)
        });
    }
    finally {

    }

}
run().catch(console.dir)



//Get  
app.get('/',(req,res)=>{
    res.send('running genuse server')
})

//Listen Port
app.listen(port,()=>{
    console.log('lising the port',port)
})
