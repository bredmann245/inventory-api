import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Inventory } from 'src/models/inventory-model';
import { InventoryService } from 'src/services/inventory/inventory.service';

@Controller('items')
export class InventoryController {
    constructor(private readonly inventorySvc: InventoryService) {}
    
    @Get(':id')
    getItemById(@Res() res: Response, @Param('id', new ParseUUIDPipe()) id: string) {
      const item: Inventory = this.inventorySvc.getItemById(id);
      if (!item) {
        return res.status(404).json('Item not found')
      } 
      return res.json(item);
    }

    @Get()
    getAllItems(@Res() res: Response) {
      const items: Inventory[] = this.inventorySvc.getAllItems(); 
      if (!items.length) {
        return res.status(404).json('No items in your inventory.')
      }
      return res.json(items);
    }

    @Get()
    getItemsByCategory(@Res() res: Response, @Query('category') category: string) {
      const items: Inventory[] = this.inventorySvc.getItemsByCategory(category.trim()); 
      if (!items.length) {
        return res.status(404).json(`No items in your inventory for category ${category}.`)
      }
      return res.json(items);
    }

    @Post()
    async create(@Res() res: Response, @Body() inventoryItem: Inventory) {
        const item: Inventory = await this.inventorySvc.addItem(inventoryItem);
        return res.json(item);
    }

    @Put()
    updateItem(@Body() inventoryItem: Inventory) {
        return inventoryItem;
    }

    @Delete()
    deleteItem(@Query('category') category: string) {
      
    }
}
