import { ValidationPipe } from './validation.pipe';
import { InventorySchemaPost } from '../models/inventory-model';

describe('ValidationPipe', () => {
  it('should be defined', () => {
    expect(new ValidationPipe(InventorySchemaPost)).toBeDefined();
  });
});
