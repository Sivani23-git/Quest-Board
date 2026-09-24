import { User } from '../models/User.js';
import { CoinTransaction } from '../models/CoinTransaction.js';
import { AppError } from '../utils/AppError.js';

export class CoinService {
  /**
   * Awards virtual coins to a user.
   */
  static async award(userId, amount, source, referenceId = null, description = 'Coins earned') {
    if (!amount || amount <= 0) return { awarded: 0 };

    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { coinBalance: amount } },
      { new: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await CoinTransaction.create({
      userId,
      amount,
      type: 'earned',
      source,
      referenceId,
      description,
      balanceAfter: user.coinBalance,
    });

    return {
      awarded: amount,
      coinBalance: user.coinBalance,
    };
  }

  /**
   * Atomically spends virtual coins ensuring no negative balances or race conditions.
   */
  static async deduct(userId, amount, source, referenceId = null, description = 'Coins spent') {
    if (!amount || amount <= 0) {
      throw new AppError('Invalid coin amount to deduct', 400);
    }

    // Atomic conditional decrement
    const user = await User.findOneAndUpdate(
      { _id: userId, coinBalance: { $gte: amount } },
      { $inc: { coinBalance: -amount } },
      { new: true }
    );

    if (!user) {
      throw new AppError('Insufficient coin balance for this transaction.', 400);
    }

    await CoinTransaction.create({
      userId,
      amount: -amount,
      type: 'spent',
      source,
      referenceId,
      description,
      balanceAfter: user.coinBalance,
    });

    return {
      deducted: amount,
      coinBalance: user.coinBalance,
    };
  }
}
