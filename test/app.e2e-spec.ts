import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { MockInventory, SecondaryMockInventory } from './mock-data';
import { Inventory } from '../src/models/inventory-model';

describe('Inventory API Test -- Happy Path', () => {
  let app: INestApplication;

  let newCategory: string = 'Test';
  let newQuantity: number = 1;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  
  it('Add new item to the inventory', () => {
    return request(app.getHttpServer())
    .post('/items')
    .send(MockInventory)
    .expect(201)
    .then((res) =>{
      //Set returning id to mockinventory object in order to use in PUT
      MockInventory.id = res.body.id;
    });
  });

  it('Get added item by its ID', () => {
    return request(app.getHttpServer())
      .get(`/items/${MockInventory.id}`)
      .expect(200)
      .then(res => {
        expect(res.body.id).toBe(MockInventory.id)
        expect(res.body.name).toBe(MockInventory.name)
        expect(res.body.category).toBe(MockInventory.category)
        expect(res.body.quantity).toBe(MockInventory.quantity)
        //Set new category and quantity for PUT test
        MockInventory.quantity = newQuantity;
        MockInventory.category = newCategory;
      })
  });

  it('Update item\'s quantity and category', () => {
    return request(app.getHttpServer())
      .put('/items')
      .send(MockInventory)
      .expect(200)
      .then(res => {
        expect(res.body.id).toBe(MockInventory.id)
        expect(res.body.name).toBe(MockInventory.name)
        expect(res.body.category).toBe(newCategory)
        expect(res.body.quantity).toBe(newQuantity)
      })
  });

  it('Get all items by Category', () => {
    return request(app.getHttpServer())
      .get(`/items/categories?name=${MockInventory.category}`)
      .expect(200)
      .then(res => {
        const itemsArray: Inventory[] = res.body;
        expect(res.body.length).toBeTruthy()
        itemsArray.forEach(item => {
          expect(item.category).toBe(MockInventory.category);
        });
      })
  });

  it('Get All items in the inventory', () => {
    return request(app.getHttpServer())
      .get('/items')
      .expect(200)
      .then(res => {
        expect(res.body.length).toBeTruthy()
      })
  });

  it('Delete the item by category', () => {
    return request(app.getHttpServer())
      .delete(`/items/categories?name=${MockInventory.category}`)
      .expect(204)
  });

  it('Verify all items w/ the specified category were deleted', () => {
    return request(app.getHttpServer())
      .get(`/items/categories?name=${MockInventory.category}`)
      .expect(404)
  });
});

describe('Inventory API Test -- Item is removed when quantity 0', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  
  it('Create item expect 201', () => {
    return request(app.getHttpServer())
    .post('/items')
    .send(SecondaryMockInventory)
    .expect(201)
    .then((res) =>{
      SecondaryMockInventory.id = res.body.id;
      //Set quantity equal to zero for PUT call
      SecondaryMockInventory.quantity = 0;
    });
  });

  it('Update item w/ quantity 0 expect 204', () => {
    return request(app.getHttpServer())
      .put('/items')
      .send(SecondaryMockInventory)
      .expect(204)
  });

  it('Verify Item w/ quantity 0 was removed from inventory', () => {
    return request(app.getHttpServer())
      .get(`/items/${SecondaryMockInventory.id}`)
      .expect(404)
  });
});


describe('Inventory API Test -- Bad data 400 test', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  
  it('Create item w/o required property "name" expect 400', () => {
    return request(app.getHttpServer())
    .post('/items')
    .send({ name: "" ,quantity: 1, category: "test" })
    .expect(400)
  });

  it('Create item w/ quantity 0 expect 400', () => {
    return request(app.getHttpServer())
    .post('/items')
    .send({ name: "test", quantity: 0 })
    .expect(400)
  });

  it('Update item w/ empty required fields expect 400', () => {
    return request(app.getHttpServer())
      .put('/items')
      .send({ id: "", name: "", quantity: 1 })
      .expect(400)
  });

  it('Get item by id w/ invalid uuid id expect 400', () => {
    return request(app.getHttpServer())
      .get(`/items/jfkdlsajfdksl;a`)
      .expect(400)
  });


  it('Delete items by category w/ empty name expect 400', () => {
    return request(app.getHttpServer())
      .delete(`/items/categories?name=`)
      .expect(400)
  });

  it('Get items by category w/ empty name expect 400', () => {
    return request(app.getHttpServer())
      .get(`/items/categories?name=`)
      .expect(400)
  });
});