import { getCustomRepository, getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: TransactionDTO): Promise<Transaction> {
    // TODO
    const transactionsRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);
    const balance = await transactionsRepository.getBalance();

    if (type == 'outcome' && value > balance.total) {
      throw new AppError('Not enough balance', 400);
    }

    const dbCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (dbCategory) {
      const transaction = transactionsRepository.create({
        title,
        value,
        type,
        category_id: dbCategory?.id,
      });

      await transactionsRepository.save(transaction);
      return transaction;
    }

    const newCategory = categoryRepository.create({ title: category });

    const newDbCategory = await categoryRepository.save(newCategory);

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: newDbCategory?.id,
    });

    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
