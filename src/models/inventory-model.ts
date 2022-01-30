import * as Joi from "joi";

export interface Inventory {
    id?: string,
    name: string,
    quantity: number,
    category?: string
}

export const InventorySchemaPost = Joi.object({
    name: Joi.string().required(),
    quantity: Joi.number().greater(0).required(),
    category: Joi.string()
}); 

export const InventorySchemaPut = Joi.object({
    id: Joi.string().uuid().required(),
    name: Joi.string().required(),
    quantity: Joi.number().greater(-1).required(),
    category: Joi.string()
}); 