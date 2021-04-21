import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { OperationType } from "../createStatement/CreateStatementController";
import { ICreateTransferUseCaseDTO } from "./ICreateTransferUseCaseDTO";

@injectable()
class CreateTransferUseCase {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('StatementsRepository') private statementsRepository: IStatementsRepository
  ){}


  //asdasdsadsa
  async execute({amount, description, destination_id, user_id}:ICreateTransferUseCaseDTO): Promise<Statement>{
    const statement = await this.statementsRepository.create({
      user_id,
      amount,
      description,
      type: OperationType.TRANSFER
    })
    return statement;
  }
}

export {CreateTransferUseCase}
