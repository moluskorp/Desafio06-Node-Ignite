import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { app } from '../../../../app';

let connection : Connection;

describe('Create Statement Controller', () => {
  beforeAll(async() => {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
       await connection.dropDatabase();
        await connection.close();
  });

  it('should be able to deposit a new statement',async() =>{
    /*const response = await request(app).post('/statements/deposit').send({
      name: "Category",
      description: "Description"
    });

    expect(response.status).toBe(201);*/
  })
})
