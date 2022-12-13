import {connection} from "../database.js";

export async function validateRental(req,res,next){
    const body = req.body;
    if(!body.daysRented >0){
        res.sendStatus(400)
        return
    }
    const searchCustomerId = await (await connection.query('SELECT * FROM customers WHERE id=$1',[body.customerId])).rows
    if(searchCustomerId.length==0){
        res.sendStatus(400)
        return
    }
    const searchGameId = await (await connection.query('SELECT * FROM games WHERE id=$1',[body.gameId])).rows
    if(searchGameId.length==0){
        res.sendStatus(400)
        return
    }
    const searchRentals = await (await connection.query('SELECT * FROM rentals WHERE gameId=$1',[body.gameId])).rows
    if(searchRentals.length + 1 > searchGameId[0].stockTotal)
    {
        res.sendStatus(400)
        return
    }
    return next();


}