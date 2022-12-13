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
    const gameName = req.query.name || ""; 
    try{
    const gamesPkg = await connection.query('SELECT * FROM games WHERE lower(name) LIKE $1',[gameName+"%"])
    const categories = await (await connection.query('SELECT * FROM categories')).rows
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
app.get("/customers",async (req, res)=>{
    const cpf= req.query.cpf || "";
    try{
    const customers = await connection.query('SELECT * FROM customers WHERE cpf LIKE $1',[cpf+"%"])
    res.send(customers.rows)
    }catch(err){console.log(err);res.sendStatus(500)}
})
app.get("/customers/:id",async (req, res)=>{
    const customerId = req.params.id; 
    try{
    const customers = await connection.query('SELECT * FROM customers WHERE id = $1',[customerId])
    res.send(customers.rows[0])
    }catch(err){console.log(err);res.sendStatus(500)}
})
app.post("/customers",async (req, res)=>{
    const body = req.body
    try{
    const customers = await connection.query('INSERT INTO customers (name,phone,cpf,birthday) VALUES ($1,$2,$3,$4)',
    [body.name, body.phone,body.cpf,body.birthday])
    res.sendStatus(201)
    }catch(err){console.log(err);res.sendStatus(500)}
})
app.put("/customers/:id",async (req, res)=>{
    const customerId = req.params.id; 
    const body = req.body
    try{
    const customers = await connection.query('UPDATE customers SET name=$1, phone=$2,cpf=$3,birthday=$4 WHERE id=$5',
    [body.name, body.phone,body.cpf,body.birthday,customerId])
    res.sendStatus(201)
    }catch(err){console.log(err);res.sendStatus(500)}
})




const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log('Server running at port ' + port);
});