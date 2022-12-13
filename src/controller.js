import dayjs from 'dayjs';
import {connection} from './database.js'

export async function getCategories (req, res){
    try{
    const categories = await connection.query('SELECT * FROM categories')
    res.send(categories.rows)
    }catch(err){res.sendStatus(500)}
}
export async function postCategories (req, res){
    const body = req.body;
    console.log(body);
    try{
    const categories = await connection.query('INSERT INTO categories (name) VALUES ($1)',[body.name])
    res.sendStatus(201)
    }catch(err){res.sendStatus(500)}
}
export async function getGames(req, res){
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
}
export async function postGames(req, res){
    const body = req.body;
    console.log(body);
    try{
    const games = await connection.query('INSERT INTO games (name,image,"stockTotal","categoryId","pricePerDay") VALUES ($1,$2,$3,$4,$5)',[body.name, body.image, body.stockTotal, body.categoryId, body.pricePerDay])
    res.sendStatus(201)
    }catch(err){console.log(err);res.sendStatus(500)}
}
export async function getCustomers (req, res){
    const cpf= req.query.cpf || "";
    try{
    const customers = await connection.query('SELECT * FROM customers WHERE cpf LIKE $1',[cpf+"%"])
    res.send(customers.rows)
    }catch(err){console.log(err);res.sendStatus(500)}
}
export async function getCustomersById(req, res){
    const customerId = req.params.id; 
    try{
    const customers = await connection.query('SELECT * FROM customers WHERE id = $1',[customerId])
    if(customers.rowCount == 1)res.send(customers.rows[0]);
    else{res.sendStatus(404)}
    }catch(err){console.log(err);res.sendStatus(500)}
}
export async function postCustomers (req, res){
    const body = req.body
    try{
    const customers = await connection.query('INSERT INTO customers (name,phone,cpf,birthday) VALUES ($1,$2,$3,$4)',
    [body.name, body.phone,body.cpf,body.birthday])
    res.sendStatus(201)
    }catch(err){console.log(err);res.sendStatus(500)}
}
export async function putCustomers (req, res){
    const customerId = req.params.id; 
    const body = req.body
    try{
    const customers = await connection.query('UPDATE customers SET name=$1, phone=$2,cpf=$3,birthday=$4 WHERE id=$5',
    [body.name, body.phone,body.cpf,body.birthday,customerId])
    res.sendStatus(201)
    }catch(err){console.log(err);res.sendStatus(500)}
}
export async function getRentals (req,res){
    const customerId = req.query.customerId || "";
    const gameId = req.query.gameId || "";
    try{
        const categories = await (await connection.query('SELECT * FROM categories')).rows
        const customers = await (await connection.query('SELECT * FROM customers')).rows
        const games = await (await connection.query('SELECT * FROM games')).rows
        let rentals
        if(gameId != "" && customerId != "")
        {
            rentals = await (await connection.query('SELECT * FROM rentals WHERE '+
            'customerId = $1 AND gameId = $2',[customerId, gameId])).rows
        }
        else if (gameId != "" && customerId == ""){
            rentals = await (await connection.query('SELECT * FROM rentals WHERE '+
            'gameId = $1',[gameId])).rows
        }
        else if(gameId == "" && customerId != "")
        {
            rentals = await (await connection.query('SELECT * FROM rentals WHERE '+
            'customerId = $1',[customerId])).rows 
        }
        else{
            rentals = await (await connection.query('SELECT * FROM rentals')).rows 
        }
        rentals = rentals.map((rental)=>{
            const game = games.find(obj=>{return obj.id = rental.gameId})
            const customer = customers.find(obj=>{return obj.id = rental.customerId})
            const category = categories.find(obj=>{return obj.id = game.categoryId})
            return {...rental,
            customer:{
                id:customer.id,
                name:customer.name
            },
            game:{
                id:game.id,
                name:game.name,
                categoryId: game.categoryId,
                categoryName:category.name
            }}

        })
        res.send(rentals);

    }catch(err){console.log(err);res.sendStatus(500)}
}
export async function postRentals(req,res){
    const body = req.body
    const rentDate = dayjs().format('YYYY-MM-DD')
    try{
        const dailyPrice = await (await connection.query('SELECT games."pricePerDay" FROM games WHERE id=$1',[body.gameId])).rows[0].pricePerDay
        const originalPrice = dailyPrice * body.daysRented;
        const rentals = await connection.query('INSERT INTO rentals '+
        '("customerId","gameId","rentDate","daysRented","returnDate","originalPrice","delayFee")'+
        'VALUES ($1,$2,$3,$4,$5,$6,$7)',
        [body.customerId, body.gameId, rentDate, body.daysRented, null, originalPrice, null])
        res.sendStatus(201)
    }catch(err){console.log(err);res.sendStatus(500)}
}
export async function postRentalsById(req,res){
    const {id} = req.params
    console.log(id)
    const returnDate = dayjs();
    const returnDateStr = returnDate.format('YYYY-MM-DD')
    console.log(returnDate)
    try{
        const rental = await (await connection.query('SELECT * FROM rentals WHERE id=$1',[id])).rows[0]
        console.log(rental)
        const dailyPrice = await (await connection.query('SELECT games."pricePerDay" FROM games WHERE id=$1',[rental.gameId])).rows[0].pricePerDay
        console.log(dailyPrice)
        const dayDiff = returnDate.diff(rental.rentDate, "days");
        let delayFee =null;
        if ( dayDiff > rental.daysRented){
            delayFee = (dayDiff-daysRented)*dailyPrice
        }
        const rentalUpdt = await connection.query('UPDATE rentals SET "delayFee"=$1, "returnDate"=$2 WHERE id=$3',
        [delayFee, returnDateStr,id])

        res.sendStatus(200)
    }catch(err){console.log(err);res.sendStatus(500)}
}
export async function deleteRentals (req,res){
    const {id} = req.params
    try{
        const del = await connection.query('DELETE FROM rentals WHERE id=$1',[id]);
        res.sendStatus(200)
    }catch(err){res.sendStatus(500)}
}
