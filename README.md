# Inventory API

## Getting Started 
```
npm i -g @nestjs/cli
npm install 
npm run start
```

## API e2e tests
```
npm run test:e2e
```
### Description
- There are several tests that will be run:
    * Happy path:
        - POST - create an item w/o a category and add it to the inventory
        - GET - get the item by ID and verify it is correct
        - PUT - update the item with a new category and new quantity.
        - GET - get all items by the category name of the mock data and verify
        - GET - get all the items in the inventory
        - DELETE - delete all items by category. 
    * Delete item when quantity is 0
        - POST - create an item and add it to the inventory
        - PUT - update the item with quantity zero.
        - GET - verify item was deleted from the inventory
    * Inventory API Test -- Bad data 400 test
        - POST - Create item w/o required property "name" expect 400
        - POST - Create item w/ quantity 0 expect 400
        - PUT - Update item w/ empty required fields expect 400
        - GET - Get item by id w/ invalid uuid expect 400
        - DELETE - Delete items by category w/ empty name expect 400
        - GET - Get items by category w/ empty name expect 400

## APIs 

### POST /items (add a new item to the inventory)
* Request Body (category is an optional property)
  ```
  {
    name: "Hammer",
    quantity: 1,
    category: "Tools"
  }
  ```
* Response Body (returns w/ an assign uuid)
  ```
  {
    id: "01ba3195-72a4-4f95-8d3d-8dd3e1b2b690"  
    name: "Hammer",
    quantity: 1,
    category: "Tools"
  }
  ```

### GET /items/:id (:id param is the id return in the response body of the POST)
* Response Body (returns w/ an assign uuid)
  ```
  {
    id: "01ba3195-72a4-4f95-8d3d-8dd3e1b2b690"  
    name: "Hammer",
    quantity: 1,
    category: "Tools"
  }
  ```

### GET /items (gets an array of all items in the inventory)
* Response Body
  ```
  [
    {
      id: "01ba3195-72a4-4f95-8d3d-8dd3e1b2b690"  
      name: "Hammer",
      quantity: 1,
      category: "Tools"
    }
  ]
  ```

### GET /items/categories?name= (gets an array of items by category)
* Response Body
  ```
  [
    {
      id: "01ba3195-72a4-4f95-8d3d-8dd3e1b2b690"  
      name: "Hammer",
      quantity: 1,
      category: "Tools"
    }
  ]
  ```

### PUT /items (update an existing item in the inventory)
* Request Body (id, name and quantity are required, and category is an optional property)
  ```
  {
    id: "01ba3195-72a4-4f95-8d3d-8dd3e1b2b690",
    name: "Hammer",
    quantity: 2,
    category: "Tools"
  }
  ```
* Response Body (returns w/ an assign uuid)
  ```
  {
    id: "01ba3195-72a4-4f95-8d3d-8dd3e1b2b690"  
    name: "Hammer",
    quantity: 2,
    category: "Tools"
  }
  ```
NOTE: Request Body w/ quantity equal to 0 results in removing the item from the inventory and will receive a 204 response status code.

### DELETE /items/categories?name= (deletes all items by the specified category)
* Response status code on successful delete will be 204.