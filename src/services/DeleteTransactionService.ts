// import AppError from '../errors/AppError';
import { DeleteResult, getCustomRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<DeleteResult> {
    // TODO
    const transactionRepository = await getCustomRepository(
      TransactionRepository,
    );

    const deleteResult = await transactionRepository.delete(id);
    if (deleteResult.raw.length > 0) {
      return deleteResult;
    }
    throw new Error('Transaction not found');
  }
}

export default DeleteTransactionService;
