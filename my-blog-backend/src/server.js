import expess from "express"
// import { MongoClient } from "mongodb" //client used to connect to the Mongo database

import {db, connectToDb} from "./db.js";

//localhost:3000/articles/learn-mode  in front-end

//PUT   /articles/learn-react/upvote

const app = expess();
app.use(expess.json());

//temp inmemroy DB
// let arcticlesInfo = [{
//     name: "learn-react",
//     upvotes: 0,
//     comments: [],
// }, {
//     name: "learn-node",
//     upvotes: 0,
//     comments: [],
// }, {
//     name: "mongodb",
//     upvotes: 0,
//     comments: [],
// }];

//get upvotes data from mongodb
app.get("/api/articles/:name", async (req, res) => {  //call back function
    const { name } = req.params; //get the value of url parameter name

    // const client = new MongoClient("mongodb://127.0.0.1:27017")
    // await client.connect(); //asynchronous 
    // const db = client.db("react-blog-db");  //get the name of the database, same as use react-blog-db in the mongodb shell

    const article = await db.collection("articles").findOne({name}); //geting one article

    if (article) {
        res.send(article);

    }else{
        res.sendStatus(404); //.send("Article Not Found")
    }

});



app.put("/api/articles/:name/upvote", async (req, res) => {
    const { name } = req.params;
    // const article = arcticlesInfo.find(a => a.name === name);

    // const client = new MongoClient("mongodb://127.0.0.1:27017")
    // await client.connect(); //asynchronous 
    // const db = client.db("react-blog-db");

    await db.collection("articles").updateOne({name}, {$inc: {upvotes: 1}});  // update count of upvotes

    const article = await db.collection("articles").findOne({name});

    if (article) {
        // article.upvotes += 1;
        res.send(`The ${name} article now has ${article.upvotes} upvotes!!!`)
    } else {
        res.json("That article doesn\'t exist!");
    }
});


//to add comments per article
app.post("/api/articles/:name/comments", async (req, res) => {
    const { name } = req.params;
    const { postedBy, text } = req.body;
    // const article = arcticlesInfo.find(a => a.name === name);

    // const client = new MongoClient("mongodb://127.0.0.1:27017")
    // await client.connect(); //asynchronous 
    // const db = client.db("react-blog-db");


    //make query to db to post a comment
    await db.collection("articles").updateOne({name}, {$push: {comments: {postedBy, text}}});

    //laod the article from db
    const article = await db.collection("articles").findOne({name});

    if (article) {
        // article.comments.push({ postedBy, text });
        res.send(article.comments);
    } else {
        res.send("That article doesn\'t exist!");
    }


});

connectToDb(() => {   // Connect to the db first, will throw an error if connection to DB fails. 
    app.listen(8000, () => {
        console.log("Server is listening at port 8000");
    });
});