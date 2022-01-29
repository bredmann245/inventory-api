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
                    res(initializedInventory);
                }
                if (err) {
                    console.log(err);
                    rej(err);
                }
    
                res(JSON.parse(items) as Inventory[]);
            });
        });
    }

    updateInventoryFile(items: Inventory[]): Promise<any> {
        return new Promise((res, rej) => {
            writeFile(FILE_PATH, JSON.stringify(items), 'utf-8', (err) => {
                if (err) {
                    console.log(err);
                    rej(err);
                }
                console.log("Added Item to inventory.");
                res(items);
            });
        });
    }

    initializeInventoryFile(): Promise<any> {
        return new Promise(async (res, rej) => {
            writeFile(FILE_PATH, JSON.stringify([]), 'utf-8', (err) => {
                if (err) {
                    console.log(err);
                    rej(err);
                }
                console.log("Inventory Updated.");
                res(true);
            });
        });
    }

    fileExists(): Promise<any> {
        return new Promise((res, rej) => {
            try {
                if (existsSync(FILE_PATH)) {
                    res(true);
                } else {
                    res(false);
                }   
            } catch (err) {
                rej(err);
            }
        })
    }
}
