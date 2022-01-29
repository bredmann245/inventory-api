import { Module } from '@nestjs/common';
import { InventoryController } from './routes/inventory/inventory.controller';
import { InventoryService } from './services/inventory/inventory.service';
import { DataService } from './services/data/data.service';

@Module({
  imports: [],
  controllers: [InventoryController],
  providers: [InventoryService, DataService],
})
export class AppModule {}
