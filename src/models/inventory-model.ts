import * as Joi from "joi";

export interface Inventory {
    id?: string,
    name: string,
    quantity: number,
    category?: string
}

export const InventorySchema = Joi.object({
    name: Joi.string(),
    quantity: Joi.number(),
    category: Joi.string()
}); 