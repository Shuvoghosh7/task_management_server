const express = require('express');
const cors = require('cors');
require('dotenv').config()
const port=process.env.PORT || 5000;
const app=express()

//meddle ware
app.use(cors());
app.use(express.json()) //use to get data req.body


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2ptrm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const taskCollection = client.db('manage_Task').collection('task');
        const completeTaskCollection= client.db('manage_Task').collection('completeTask');

        app.get('/task', async (req, res) => {
            const query = {}; 
            const cursor = taskCollection.find(query);
            const task = await cursor.toArray();
            res.send(task);
        })
        //get single task update
        app.get('/get-task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const parts = await taskCollection.findOne(query);
            res.send(parts)
          });
        //add task
        app.post('/add-task', async (req, res) => {
            const taskInfo = req.body
            const result = await taskCollection.insertOne(taskInfo)
            res.send(result)
        });

        //update task
        app.put("/update-task/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const data = req.body;
            console.log(data)
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
              $set: {
                task:data.task
              },
            };
            const result = await taskCollection.updateOne(filter,updateDoc,options);
            res.send(result);
          });
         //Get task api
          app.get('/get-complete-task', async (req, res) => {
            const query = {}; 
            const cursor = completeTaskCollection.find(query);
            const Completetask = await cursor.toArray();
            res.send(Completetask);
        })
          //Conplite task
        app.post('/complete-task', async (req, res) => {
          const TaskComplete = req.body
          const result = await completeTaskCollection.insertOne(TaskComplete )
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
