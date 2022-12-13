import { gameSchema } from "../schemas.js";
import {connection} from "../database.js";


export async function validateGame(req,res,next){
    const body = req.body;
    const validation = gameSchema.validate(body, {abortEarly: false})
    if (validation.error){
        console.log(validation.error)
        res.sendStatus(400)
        return
    }
    const searchCategories = await (await connection.query('SELECT * FROM categories WHERE id=$1',[body.categoryId])).rows
    if(searchCategories.length == 0){
        res.sendStatus(400)
        return
    }
    const searchName = await (await connection.query('SELECT * FROM games WHERE name=$1',[body.name])).rows
    if(searchName.length!=0){
        res.sendStatus(409)
        return
    }
    return next();


}