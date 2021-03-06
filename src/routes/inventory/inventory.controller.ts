import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, ParseUUIDPipe, Post, Put, Query, Res, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { Inventory, InventorySchemaPost, InventorySchemaPut } from '../../models/inventory-model';
import { InventoryService } from '../../services/inventory/inventory.service';
import { ValidationPipe } from '../../pipes/validation.pipe';

@Controller('items')
export class InventoryController {
    constructor(private readonly inventorySvc: InventoryService) {}
    
    @Get('categories')
    getItemsByCategory(@Query('name') category: string) {
      if (!category) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'You must supply a category name'
        });
      }

      const items: Inventory[] = this.inventorySvc.getItemsByCategory(category);
      if (!items.length) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND, 
          message: `No items in your inventory for category ${category}.`
        });
      }

      return items;
    }

    @Get(':id')
    getItemById(@Param('id', new ParseUUIDPipe()) id: string) {
      const item: Inventory = this.inventorySvc.getItemById(id);
      if (!item) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND, 
          message: 'No item found for the given id'
        });
      } 
      return item;
    }

    @Get()
    getAllItems() {
      const items: Inventory[] = this.inventorySvc.getAllItems(); 
      if (!items.length) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND, 
          message: 'No items in your inventory.'
        });
      }

      return items;
    }

    @Post()
    @UsePipes(new ValidationPipe(InventorySchemaPost))
    async addItem(@Body() inventoryItem: Inventory) {      
      const item: Inventory = this.inventorySvc.addItem(inventoryItem);
      return item;
    }

    @Put()
    @UsePipes(new ValidationPipe(InventorySchemaPut))
    updateItem(@Body() inventoryItem: Inventory) {
      const item: Inventory = this.inventorySvc.udpateInventoryItem(inventoryItem);
      if (!item) {
        throw new HttpException({
          message: 'Item removed, quantity is equal to zero',
          statusCode: HttpStatus.NO_CONTENT
        }, HttpStatus.NO_CONTENT);
      }
      
      return item;
    }

    @Delete('categories')
    deleteItem(@Res() res: Response, @Query('name') category: string) {
      if (!category) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'You must supply a category name'
        });
      }

      //First check if category exists
      const categories: Inventory[] = this.inventorySvc.getItemsByCategory(category);
      if (!categories.length) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND, 
          message: `No items exist with category name ${category}`
        });
      }

      this.inventorySvc.deleteItemByCategory(category);
      return res.status(HttpStatus.NO_CONTENT).json();
    }
}
