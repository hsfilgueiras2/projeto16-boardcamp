import express, { json } from 'express';
import cors from 'cors';
import pkg from 'pg';
import * as dotenv from 'dotenv'
dotenv.config()

const { Pool } = pkg;


const app = express();
app.use(json());
app.use(cors());

const connection = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.get("/categories",async (req, res)=>{
    try{
    const categories = await connection.query('SELECT * FROM categories')
    res.send(categories.rows)
    }catch(err){res.sendStatus(500)}
})
app.post("/categories",async (req, res)=>{
    const body = req.body;
    console.log(body);
    try{
    const categories = await connection.query('INSERT INTO categories (name) VALUES ($1)',[body.name])
    res.sendStatus(201)
    }catch(err){res.sendStatus(500)}
})
app.get("/games",async (req, res)=>{
    const gameName = req.query.name; 
    try{
    const gamesPkg = await connection.query('SELECT * FROM games WHERE lower(name) LIKE $1',[gameName+"%"])
    const categories = await (await connection.query('SELECT * FROM categories')).rows
    console.log(categories)
    console.log(gamesPkg)

    const games = gamesPkg.rows.map((game)=>{
        const categoryName = categories.find(obj =>{return obj.id == game.categoryId});
        return {...game,categoryName:categoryName.name}
    })
    res.send(games)
    }catch(err){console.log(err);res.sendStatus(500)}
})
app.post("/games",async (req, res)=>{
    const body = req.body;
    console.log(body);
    try{
    const games = await connection.query('INSERT INTO games (name,image,"stockTotal","categoryId","pricePerDay") VALUES ($1,$2,$3,$4,$5)',[body.name, body.image, body.stockTotal, body.categoryId, body.pricePerDay])
    res.sendStatus(201)
    }catch(err){console.log(err);res.sendStatus(500)}
})




const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log('Server running at port ' + port);
});