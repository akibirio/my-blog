import { MongoClient } from "mongodb" //client used to connect to the Mongo database

let db;

async function connectToDb(cb) {
    const client = new MongoClient("mongodb://127.0.0.1:27017")
    await client.connect(); //asynchronous 

     db = client.db("react-blog-db");  
     
     cb(); 
}

export {
    db,
    connectToDb,
};