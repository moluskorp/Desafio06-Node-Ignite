import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { app } from '../../../../app';

let connection : Connection;

describe('Create User Controller', () => {
  beforeAll(async() => {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it('should be able to create a new user',async() =>{
    const response = await request(app).post('/users').send({
      name: 'user_test',
      email: 'user@test.com',
      password: 'test'
    });

    expect(response.status).toBe(201);
  })
})
