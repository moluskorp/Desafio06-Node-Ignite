import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe('Create User',() =>{
  beforeEach(() =>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it('should be able to create a new user', async () =>{
    const user = await createUserUseCase.execute({
      name: 'user',
      email: 'user@test.com',
      password: 'password'
    })

    expect(user).toHaveProperty('id');
  })

  it('should not be able to create a new user if already existing email',async () => {
    await createUserUseCase.execute({
      name: 'user',
      email: 'user@test.com',
      password: 'password'
    })

    await expect(async () => {
      await createUserUseCase.execute({
        name: 'user',
        email: 'user@test.com',
        password: 'password'
      });
    }).rejects.toBeInstanceOf(AppError);

  })
})
