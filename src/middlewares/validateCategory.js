import { categorySchema } from "../schemas.js";
import {connection} from "../database.js";
export async function validateCategory(req,res,next){
    const body = req.body;
    const validation = categorySchema.validate(body, {abortEarly: false})
    if (validation.error){
        res.sendStatus(400)
        return
    }
    const searchName = await (await connection.query('SELECT * FROM categories WHERE name=$1',[body.name])).rows
    if(searchName.length!=0){
        res.sendStatus(409)
        return
    }
    return next();


}