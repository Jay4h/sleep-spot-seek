import mongoose, { Schema } from 'mongoose';
import { IPayout } from '../types';

const payoutSchema = new Schema<IPayout>({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner ID is required']
  },
  stripePayoutId: {
    type: String,
    required: [true, 'Stripe payout ID is required'],
    unique: true,
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    default: 'inr',
    uppercase: true,
    enum: ['INR', 'USD', 'EUR']
  },
  status: {
    type: String,
    enum: ['paid', 'pending', 'failed'],
    default: 'pending'
  },
  details: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for owner details
payoutSchema.virtual('owner', {
  ref: 'User',
  localField: 'ownerId',
  foreignField: '_id',
  justOne: true,
  select: 'firstName lastName email stripeConnected'
});

// Indexes
payoutSchema.index({ ownerId: 1 });
payoutSchema.index({ stripePayoutId: 1 }, { unique: true });
payoutSchema.index({ status: 1 });
payoutSchema.index({ createdAt: -1 });

// Compound indexes
payoutSchema.index({ ownerId: 1, status: 1 });
payoutSchema.index({ ownerId: 1, createdAt: -1 });

// Static method to get owner payouts
payoutSchema.statics.getOwnerPayouts = async function(
  ownerId: string,
  page: number = 1,
  limit: number = 20,
  status?: string
) {
  const skip = (page - 1) * limit;
  const query: any = { ownerId };
  
  if (status) {
    query.status = status;
  }

  const payouts = await this.find(query)
    .populate('owner', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await this.countDocuments(query);

  return {
    payouts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Static method to get payout statistics
payoutSchema.statics.getPayoutStats = async function(ownerId: string) {
  const stats = await this.aggregate([
    { $match: { ownerId: new mongoose.Types.ObjectId(ownerId) } },
    {
      $group: {
        _id: null,
        totalPayouts: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        paidAmount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'paid'] }, '$amount', 0]
          }
        },
        pendingAmount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0]
          }
        },
        failedAmount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'failed'] }, '$amount', 0]
          }
        },
        paidCount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'paid'] }, 1, 0]
          }
        },
        pendingCount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'pending'] }, 1, 0]
          }
        },
        failedCount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'failed'] }, 1, 0]
          }
        }
      }
    }
  ]);

  if (stats.length === 0) {
    return {
      totalPayouts: 0,
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      failedAmount: 0,
      paidCount: 0,
      pendingCount: 0,
      failedCount: 0
    };
  }

  return stats[0];
};

// Static method to get recent payouts
payoutSchema.statics.getRecentPayouts = async function(ownerId: string, limit: number = 5) {
  return this.find({ ownerId })
    .populate('owner', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Method to update payout status
payoutSchema.methods.updateStatus = async function(
  status: 'paid' | 'pending' | 'failed',
  details?: any
) {
  this.status = status;
  if (details) {
    this.details = { ...this.details, ...details };
  }
  await this.save();
  return this;
};

// Method to get payout summary
payoutSchema.methods.getSummary = function() {
  return {
    _id: this._id,
    ownerId: this.ownerId,
    stripePayoutId: this.stripePayoutId,
    amount: this.amount,
    currency: this.currency,
    status: this.status,
    details: this.details,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Method to get public payout data
payoutSchema.methods.getPublicData = function() {
  return {
    _id: this._id,
    amount: this.amount,
    currency: this.currency,
    status: this.status,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export default mongoose.model<IPayout>('Payout', payoutSchema);
