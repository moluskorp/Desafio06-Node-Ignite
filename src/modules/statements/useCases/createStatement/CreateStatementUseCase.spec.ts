import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { StatementsRepository } from "../../repositories/StatementsRepository";
import { OperationType } from "./CreateStatementController";
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let createStatementUseCase : CreateStatementUseCase;
let inMemoryUsersRepository : InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe('Create Statement',() => {

  beforeAll(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
  })

  it('should be able to create a deposit statement', async() => {
    const user = await inMemoryUsersRepository.create({
      name: 'user_test',
      email: 'user@test.com',
      password: 'test'
    });

    const user_id = user.id as string;
    const type = 'deposit' as OperationType;

    const statement = await createStatementUseCase.execute({
      user_id,
      type,
      amount: 100,
      description: 'deposit_test'
    });

    expect(statement).toHaveProperty('id');
  });

  it('should be able to create a withdraw statement',async() => {
    const user = await inMemoryUsersRepository.create({
      name: 'user_test',
      email: 'user@test.com',
      password: 'test'
    });

    const user_id = user.id as string;
    const typeDeposit = 'deposit' as OperationType;
    const typeWithdraw = 'withdraw' as OperationType;

    await createStatementUseCase.execute({
      user_id,
      type: typeDeposit,
      amount: 200,
      description: 'deposit_test'
    });

    const statement = await createStatementUseCase.execute({
      user_id,
      type: typeWithdraw,
      amount: 200,
      description: 'withdraw_test'
    });

    expect(statement).toHaveProperty('id');
  });

  it('should not be able to withdraw without funds', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'user_test',
      email: 'user@test.com',
      password: 'test'
    });

    const user_id = user.id as string;
    const type = 'withdraw' as OperationType;

    await expect(async() => {
      await createStatementUseCase.execute({
        user_id,
        type,
        amount: 200,
        description: 'withdraw_test'
      });
    }).rejects.toBeInstanceOf(AppError);
  })

})
