import { Injectable } from '@nestjs/common';
import { readFile, writeFile, existsSync } from 'fs';
import { join } from 'path';
import { Inventory } from 'src/models/inventory-model';

const FILE_PATH = join(process.cwd(), 'src/models/data.json');

@Injectable()
export class DataService {

    readInventoryFile(): Promise<any> {
        return new Promise(async (res, rej) => {
            if (!await this.fileExists()) {
                await this.initializeInventoryFile();
            }
            readFile(join(process.cwd(), 'src/models/data.json'), 'utf-8', async (err, items) => {
                if (!items || !Array.isArray(JSON.parse(items))) {
                    console.log('Initializing data array.');
                    const initializedInventory = await this.initializeInventoryFile();
                    return res(initializedInventory);
                }
                if (err) {
                    console.log(err);
                    return rej(err);
                }
    
                return res(JSON.parse(items) as Inventory[]);
            });
        });
    }

    updateInventoryFile(items: Inventory[]): Promise<any> {
        return new Promise((res, rej) => {
            writeFile(FILE_PATH, JSON.stringify(items), 'utf-8', (err) => {
                if (err) {
                    console.log(err);
                    return rej(err);
                }
                console.log("Added Item to inventory.");
                return res(items);
            });
        });
    }

    initializeInventoryFile(): Promise<any> {
        return new Promise(async (res, rej) => {
            writeFile(FILE_PATH, JSON.stringify([]), 'utf-8', (err) => {
                if (err) {
                    console.log(err);
                    return rej(err);
                }
                console.log("Inventory Updated.");
                return res(true);
            });
        });
    }

    fileExists(): Promise<any> {
        return new Promise((res, rej) => {
            try {
                if (existsSync(FILE_PATH)) {
                    return res(true);
                } 
                return res(false);  
            } catch (err) {
                return rej(err);
            }
        })
    }
}
