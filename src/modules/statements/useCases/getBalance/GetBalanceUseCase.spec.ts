import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { StatementsRepository } from "../../repositories/StatementsRepository";
import { OperationType } from "../createStatement/CreateStatementController";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let createStatementUseCase : CreateStatementUseCase;
let getBalanceUseCase : GetBalanceUseCase;
let inMemoryUsersRepository : InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe('Get Balance',() => {

  beforeAll(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository,inMemoryUsersRepository);
  })

  it('should be able to get balance', async() => {
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

    await createStatementUseCase.execute({
      user_id,
      type: typeDeposit,
      amount: 200,
      description: 'deposit_test'
    });

    await createStatementUseCase.execute({
      user_id,
      type: typeWithdraw,
      amount: 300,
      description: 'deposit_test'
    });

    const balance = await getBalanceUseCase.execute({
      user_id
    });

    expect(balance.balance).toEqual(100);
    expect(balance.statement).toHaveLength(3);
  });

  it('should not be able to get balance with incorrect user', async () => {
    const typeDeposit = 'deposit' as OperationType;
    const typeWithdraw = 'withdraw' as OperationType;

    await expect(async() => {
      await createStatementUseCase.execute({
        user_id: 'incorrect_user',
        type: typeDeposit,
        amount: 200,
        description: 'deposit_test'
      })
    }).rejects.toBeInstanceOf(AppError);

  })


})
