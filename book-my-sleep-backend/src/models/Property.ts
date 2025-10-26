import mongoose, { Schema } from 'mongoose';
import { IProperty } from '../types';

const propertySchema = new Schema<IProperty>({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner ID is required']
  },
  propertyName: {
    type: String,
    required: [true, 'Property name is required'],
    trim: true,
    maxlength: [100, 'Property name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      default: 'India'
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required'],
      trim: true
    },
    coordinates: {
      lat: {
        type: Number,
        required: [true, 'Latitude is required'],
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90']
      },
      lng: {
        type: Number,
        required: [true, 'Longitude is required'],
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180']
      }
    }
  },
  propertyType: {
    type: String,
    enum: ['PG', 'Hostel', 'Flat'],
    required: [true, 'Property type is required']
  },
  amenities: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String,
    trim: true
  }],
  rules: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: [0, 'Review count cannot be negative']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for owner details
propertySchema.virtual('owner', {
  ref: 'User',
  localField: 'ownerId',
  foreignField: '_id',
  justOne: true,
  select: 'firstName lastName email phoneNumber'
});

// Virtual for rooms
propertySchema.virtual('rooms', {
  ref: 'Room',
  localField: '_id',
  foreignField: 'propertyId'
});

// Indexes
propertySchema.index({ ownerId: 1 });
propertySchema.index({ verificationStatus: 1 });
propertySchema.index({ 'address.city': 1 });
propertySchema.index({ 'address.coordinates': '2dsphere' });
propertySchema.index({ isActive: 1 });
propertySchema.index({ rating: -1 });
propertySchema.index({ createdAt: -1 });

// Text search index
propertySchema.index({
  propertyName: 'text',
  description: 'text',
  'address.city': 'text',
  'address.state': 'text'
});

// Method to get average rating
propertySchema.methods.calculateAverageRating = async function() {
  const Review = mongoose.model('Review');
  const stats = await Review.aggregate([
    { $match: { propertyId: this._id } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    this.rating = Math.round(stats[0].averageRating * 10) / 10;
    this.reviewCount = stats[0].totalReviews;
  } else {
    this.rating = 0;
    this.reviewCount = 0;
  }

  await this.save();
};

// Method to get public property data
propertySchema.methods.getPublicData = function() {
  const propertyObject = this.toObject();
  return {
    _id: propertyObject._id,
    propertyName: propertyObject.propertyName,
    description: propertyObject.description,
    address: propertyObject.address,
    propertyType: propertyObject.propertyType,
    amenities: propertyObject.amenities,
    images: propertyObject.images,
    rules: propertyObject.rules,
    isActive: propertyObject.isActive,
    verificationStatus: propertyObject.verificationStatus,
    rating: propertyObject.rating,
    reviewCount: propertyObject.reviewCount,
    createdAt: propertyObject.createdAt,
    updatedAt: propertyObject.updatedAt
  };
};

export default mongoose.model<IProperty>('Property', propertySchema);
