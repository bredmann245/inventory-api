import { Injectable } from '@nestjs/common';
import { Inventory } from 'src/models/inventory-model';
import { DataService } from '../data/data.service';
import { v4 as uuidv4 } from 'uuid';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class InventoryService {
    
    inventoryItems: Inventory[] = [];
    newItem$: BehaviorSubject<Inventory[]> = new BehaviorSubject([]);

    constructor(private dataSvc: DataService) {}

    async onModuleInit() {
        this.inventoryItems = await this.dataSvc.readInventoryFile();
        this.newItem$.subscribe(async item => {
            if (item && item.length) {
                await this.dataSvc.updateInventoryFile(this.inventoryItems);
            }
        })
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

    async addItem(item: Inventory): Promise<Inventory> {
        //assign unique id to inventory item. 
        item.id = uuidv4();
        this.inventoryItems.push(item);
        this.newItem$.next(this.inventoryItems);
        return item;
    }
}
