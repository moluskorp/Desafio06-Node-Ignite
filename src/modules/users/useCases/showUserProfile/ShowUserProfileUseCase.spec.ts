import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let showUserProfileUseCase : ShowUserProfileUseCase

describe('Show User Profile',() => {
  beforeEach(() =>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  })

  it('should be able to show user profile', async () => {
    const user = await createUserUseCase.execute({
      name: 'user',
      email: 'user@test.com',
      password: 'password'
    })

    const id = user.id as string;

    const userProfile = await showUserProfileUseCase.execute(id);

    expect(userProfile).toHaveProperty('id');
  })

  it('should not be able to show user profile to an inexistent id', async () => {
    await expect(async () => {
      await showUserProfileUseCase.execute('incorrect_id');
    }).rejects.toBeInstanceOf(AppError);
  })
})
