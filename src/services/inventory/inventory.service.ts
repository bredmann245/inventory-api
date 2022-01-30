import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Inventory } from 'src/models/inventory-model';
import { DataService } from '../data/data.service';
import { v4 as uuidv4 } from 'uuid';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class InventoryService {
    
    inventoryItems: Inventory[] = [];
    updateDataFile$: BehaviorSubject<Inventory[]> = new BehaviorSubject(null);

    constructor(private dataSvc: DataService) {}

    async onModuleInit() {
        this.inventoryItems = await this.dataSvc.readInventoryFile();
        this.updateDataFile$.subscribe(async item => {
            if (item !== null) {
                await this.dataSvc.updateInventoryFile(this.inventoryItems);
            } 
        });
    }

    async onModuleDestroy() {
        await this.dataSvc.updateInventoryFile(this.inventoryItems);
    }


    getItemById(id: string): Inventory {
        return this.inventoryItems.filter(item => item.id === id)[0];
    }

    getItemsByCategory(category: string): Inventory[] {
        return this.inventoryItems.filter(item => item.category === category);
    }

    getAllItems(): Inventory[] {
        return this.inventoryItems;
    }

    addItem(item: Inventory): Inventory {
        //assign unique id to each inventory item. 
        item.id = uuidv4();
        this.inventoryItems.push(item);

        //send the inventory items to write to the file async 
        this.updateDataFile$.next(this.inventoryItems);
        return item;
    }

    udpateInventoryItem(inventoryItem: Inventory): Inventory {
        const itemIndex: number = this.inventoryItems.findIndex(item => item.id === inventoryItem.id);
        if (itemIndex < 0) {
            throw new NotFoundException({
                statusCode: HttpStatus.NOT_FOUND,
                message: `No item exists for ${inventoryItem.id} in inventory`
            });
        }

        //If the inventory item coming is 0 then we want to remove it from the inventory
        //otherwise, update the inventory item
        if (inventoryItem.quantity <= 0) {
            this.inventoryItems.splice(itemIndex, 1);
        } else {
            this.inventoryItems[itemIndex] = inventoryItem;    
        }
        
        this.updateDataFile$.next(this.inventoryItems);
        return inventoryItem.quantity <= 0 ? null : inventoryItem;
    }

    deleteItemByCategory(category: string): void {
        this.inventoryItems = this.inventoryItems.filter(item => item.category !== category);
        this.updateDataFile$.next(this.inventoryItems);
    }
}
