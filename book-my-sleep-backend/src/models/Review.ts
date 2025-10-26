import mongoose, { Schema } from 'mongoose';
import { IReview } from '../types';

const reviewSchema = new Schema<IReview>({
  seekerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seeker ID is required']
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner ID is required']
  },
  propertyId: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property ID is required']
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking ID is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  review: {
    type: String,
    required: [true, 'Review text is required'],
    trim: true,
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for seeker details
reviewSchema.virtual('seeker', {
  ref: 'User',
  localField: 'seekerId',
  foreignField: '_id',
  justOne: true,
  select: 'firstName lastName profilePicture'
});

// Virtual for property details
reviewSchema.virtual('property', {
  ref: 'Property',
  localField: 'propertyId',
  foreignField: '_id',
  justOne: true,
  select: 'propertyName address'
});

// Virtual for booking details
reviewSchema.virtual('booking', {
  ref: 'Booking',
  localField: 'bookingId',
  foreignField: '_id',
  justOne: true,
  select: 'checkInDate checkOutDate totalAmount'
});

// Indexes
reviewSchema.index({ propertyId: 1 });
reviewSchema.index({ seekerId: 1 });
reviewSchema.index({ ownerId: 1 });
reviewSchema.index({ bookingId: 1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ createdAt: -1 });

// Compound indexes
reviewSchema.index({ propertyId: 1, rating: -1 });
reviewSchema.index({ propertyId: 1, createdAt: -1 });

// Unique constraint to prevent duplicate reviews for same booking
reviewSchema.index({ bookingId: 1 }, { unique: true });

// Pre-save middleware to validate booking completion
reviewSchema.pre('save', async function(next) {
  const Booking = mongoose.model('Booking');
  
  // Check if booking exists and is completed
  const booking = await Booking.findById(this.bookingId);
  if (!booking) {
    return next(new Error('Booking not found'));
  }
  
  if (booking.bookingStatus !== 'completed') {
    return next(new Error('Can only review completed bookings'));
  }
  
  if (booking.seekerId.toString() !== this.seekerId.toString()) {
    return next(new Error('Only the seeker can review this booking'));
  }
  
  next();
});

// Post-save middleware to update property rating
reviewSchema.post('save', async function() {
  const Property = mongoose.model('Property');
  const property = await Property.findById(this.propertyId);
  
  if (property) {
    await property.calculateAverageRating();
  }
});

// Post-remove middleware to update property rating
reviewSchema.post('findOneAndDelete', async function() {
  const Property = mongoose.model('Property');
  const property = await Property.findById(this.propertyId);
  
  if (property) {
    await property.calculateAverageRating();
  }
});

// Static method to get property reviews with pagination
reviewSchema.statics.getPropertyReviews = async function(
  propertyId: string, 
  page: number = 1, 
  limit: number = 10,
  sortBy: string = 'createdAt',
  order: 'asc' | 'desc' = 'desc'
) {
  const skip = (page - 1) * limit;
  const sort: any = {};
  sort[sortBy] = order === 'asc' ? 1 : -1;

  const reviews = await this.find({ propertyId })
    .populate('seeker', 'firstName lastName profilePicture')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await this.countDocuments({ propertyId });

  return {
    reviews,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Static method to get rating statistics
reviewSchema.statics.getRatingStats = async function(propertyId: string) {
  const stats = await this.aggregate([
    { $match: { propertyId: new mongoose.Types.ObjectId(propertyId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ]);

  if (stats.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }

  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  stats[0].ratingDistribution.forEach((rating: number) => {
    ratingDistribution[rating as keyof typeof ratingDistribution]++;
  });

  return {
    averageRating: Math.round(stats[0].averageRating * 10) / 10,
    totalReviews: stats[0].totalReviews,
    ratingDistribution
  };
};

// Method to get public review data
reviewSchema.methods.getPublicData = function() {
  return {
    _id: this._id,
    seeker: this.seeker,
    propertyId: this.propertyId,
    bookingId: this.bookingId,
    rating: this.rating,
    review: this.review,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export default mongoose.model<IReview>('Review', reviewSchema);
