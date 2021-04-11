import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let createUserUseCase : CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase : AuthenticateUserUseCase;


describe("Authenticate User",() => {
  beforeEach(() =>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  })


  it('should be able to authenticate an user',async() =>{
    const {email} = await createUserUseCase.execute({
      name: 'user_test',
      email: 'user@test.com',
      password: 'test'
    });

    const auth = await authenticateUserUseCase.execute({
      email, password: 'test'
    });

    expect(auth).toHaveProperty('token');

  })

  it('should not be able to authenticate with a inexistent user', async() => {
    await expect(async() => {
      await authenticateUserUseCase.execute({
        email: 'inexistent@test.com', password: 'test'
      });
    }).rejects.toBeInstanceOf(AppError);
  })

  it('should not be able to authenticate with incorrect password',async() => {
    const {email} = await createUserUseCase.execute({
      name: 'user_test',
      email: 'user@test.com',
      password: 'test'
    });

    await expect(async() => {
      await authenticateUserUseCase.execute({
        email, password: 'incorrect_password'
      });
    }).rejects.toBeInstanceOf(AppError);
  })
})
