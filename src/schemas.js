import joi from "joi";

export const categorySchema = joi.object(
    {
        name: joi.string().required().min(1)
    }
)
export const gameSchema = joi.object(
    {
        name: joi.string().required().min(1),
        image: joi.string().required().min(1),
        stockTotal: joi.number().required().min(1),
        pricePerDay: joi.number().required().min(1),
        categoryId: joi.number().required()
    }
)
export const customerSchema = joi.object(
    {
        name: joi.string().required().min(1),
        cpf: joi.string().length(11),
        phone: joi.string().min(10).max(11),
        birthday: joi.date()
    }
)