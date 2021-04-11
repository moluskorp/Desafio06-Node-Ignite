import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { StatementsRepository } from "../../repositories/StatementsRepository";
import { OperationType } from "../createStatement/CreateStatementController";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let createStatementUseCase : CreateStatementUseCase;
let getStatementOperationUseCase : GetStatementOperationUseCase;
let inMemoryUsersRepository : InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe('Get Statement Operation',() => {

  beforeAll(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
  })

  it('should be able to get statement operation', async() => {
    const user = await inMemoryUsersRepository.create({
      name: 'user_test',
      email: 'user@test.com',
      password: 'test'
    });

    const user_id = user.id as string;
    const typeDeposit = 'deposit' as OperationType;
    const typeWithdraw = 'withdraw' as OperationType;

    const statement = await createStatementUseCase.execute({
      user_id,
      type: typeDeposit,
      amount: 200,
      description: 'deposit_test'
    });

    const statement_id = statement.id as string;

    const statementOperation = await getStatementOperationUseCase.execute({user_id,statement_id});

    expect(statementOperation.id).toEqual(statement_id);
    expect(statementOperation.user_id).toEqual(user_id);
    expect(statementOperation.type).toEqual(statement.type);
    expect(statementOperation.amount).toEqual(statement.amount);
  });

  it('should not be able to get statement operation with incorrect user', async() => {

    const typeDeposit = 'deposit' as OperationType;

    await expect(async() => {
      await getStatementOperationUseCase.execute({user_id : 'incorrect_user',statement_id: 'statement_id'})
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to get statement operation with incorrect statement', async() => {
    const user = await inMemoryUsersRepository.create({
      name: 'user_test',
      email: 'user@test.com',
      password: 'test'
    });

    const user_id = user.id as string;

    await expect(async() => {
      await getStatementOperationUseCase.execute({user_id, statement_id: 'incorrect_statement'})
    }).rejects.toBeInstanceOf(AppError);
  });
})
