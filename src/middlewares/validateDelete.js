import {connection} from "../database.js";

export async function validateDelete(req,res,next){
    const id = req.params.id;
    const searchRental = await (await connection.query('SELECT * FROM rentals WHERE id=$1',[id])).rows
    if(searchRental.length==0){
        res.sendStatus(404)
        return
    }
    if(searchRental[0].returnDate == null)
    {
        res.sendStatus(400)
        return
    }
    return next();
}