import { ValidationPipe } from './validation.pipe';
import { InventorySchema } from '../models/inventory-model';

describe('ValidationPipe', () => {
  it('should be defined', () => {
    expect(new ValidationPipe(InventorySchema)).toBeDefined();
  });
});
