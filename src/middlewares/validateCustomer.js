import { customerSchema } from "../schemas.js";
import {connection} from "../database.js";

export async function validateCustomer(req,res,next){
    const body = req.body;
    const validation = customerSchema.validate(body, {abortEarly: false})
    if (validation.error){
        console.log(validation.error)
        res.sendStatus(400)
        return
    }
    const searchCpf = await (await connection.query('SELECT * FROM customers WHERE cpf=$1',[body.cpf])).rows
    if(searchCpf.length!=0){
        res.sendStatus(409)
        return
    }
    return next();
}