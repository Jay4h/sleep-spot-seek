import mongoose, { Schema } from 'mongoose';
import { IBooking } from '../types';

const bookingSchema = new Schema<IBooking>({
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
  roomId: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Room ID is required']
  },
  checkInDate: {
    type: Date,
    required: [true, 'Check-in date is required'],
    validate: {
      validator: function(this: IBooking, value: Date) {
        return value > new Date();
      },
      message: 'Check-in date must be in the future'
    }
  },
  checkOutDate: {
    type: Date,
    required: [true, 'Check-out date is required'],
    validate: {
      validator: function(this: IBooking, value: Date) {
        return value > this.checkInDate;
      },
      message: 'Check-out date must be after check-in date'
    }
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  securityDeposit: {
    type: Number,
    required: [true, 'Security deposit is required'],
    min: [0, 'Security deposit cannot be negative']
  },
  platformCommission: {
    type: Number,
    required: [true, 'Platform commission is required'],
    min: [0, 'Platform commission cannot be negative']
  },
  bookingStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentIntentId: {
    type: String,
    default: null
  },
  paymentMethod: {
    type: String,
    default: null
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot exceed 500 characters'],
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for seeker details
bookingSchema.virtual('seeker', {
  ref: 'User',
  localField: 'seekerId',
  foreignField: '_id',
  justOne: true,
  select: 'firstName lastName email phoneNumber'
});

// Virtual for owner details
bookingSchema.virtual('owner', {
  ref: 'User',
  localField: 'ownerId',
  foreignField: '_id',
  justOne: true,
  select: 'firstName lastName email phoneNumber'
});

// Virtual for property details
bookingSchema.virtual('property', {
  ref: 'Property',
  localField: 'propertyId',
  foreignField: '_id',
  justOne: true,
  select: 'propertyName address'
});

// Virtual for room details
bookingSchema.virtual('room', {
  ref: 'Room',
  localField: 'roomId',
  foreignField: '_id',
  justOne: true,
  select: 'roomNumber roomType price'
});

// Virtual for duration in days
bookingSchema.virtual('durationDays').get(function() {
  const diffTime = this.checkOutDate.getTime() - this.checkInDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for total amount with deposit
bookingSchema.virtual('totalWithDeposit').get(function() {
  return this.totalAmount + this.securityDeposit;
});

// Indexes
bookingSchema.index({ seekerId: 1 });
bookingSchema.index({ ownerId: 1 });
bookingSchema.index({ propertyId: 1 });
bookingSchema.index({ roomId: 1 });
bookingSchema.index({ bookingStatus: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ createdAt: -1 });

// Compound indexes
bookingSchema.index({ seekerId: 1, bookingStatus: 1 });
bookingSchema.index({ ownerId: 1, bookingStatus: 1 });
bookingSchema.index({ propertyId: 1, bookingStatus: 1 });

// Index for availability queries
bookingSchema.index({ 
  roomId: 1, 
  checkInDate: 1, 
  checkOutDate: 1 
});

// Pre-save middleware to validate booking dates
bookingSchema.pre('save', function(next) {
  if (this.checkInDate >= this.checkOutDate) {
    return next(new Error('Check-out date must be after check-in date'));
  }
  
  if (this.checkInDate <= new Date()) {
    return next(new Error('Check-in date must be in the future'));
  }
  
  next();
});

// Method to check availability
bookingSchema.statics.checkAvailability = async function(
  roomId: string, 
  checkInDate: Date, 
  checkOutDate: Date, 
  excludeBookingId?: string
) {
  const query: any = {
    roomId,
    bookingStatus: { $in: ['pending', 'confirmed'] },
    $or: [
      {
        checkInDate: { $lt: checkOutDate },
        checkOutDate: { $gt: checkInDate }
      }
    ]
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflictingBooking = await this.findOne(query);
  return !conflictingBooking;
};

// Method to calculate total amount
bookingSchema.methods.calculateTotal = function(roomPrice: number, durationDays: number) {
  this.totalAmount = roomPrice * durationDays;
  this.platformCommission = Math.round(this.totalAmount * 0.05); // 5% platform fee
  return this.totalAmount;
};

// Method to cancel booking
bookingSchema.methods.cancelBooking = async function(reason?: string) {
  this.bookingStatus = 'cancelled';
  
  // Update room occupancy
  const Room = mongoose.model('Room');
  await Room.findByIdAndUpdate(this.roomId, {
    $inc: { currentOccupancy: -1 }
  });
  
  await this.save();
  return this;
};

// Method to confirm booking
bookingSchema.methods.confirmBooking = async function() {
  this.bookingStatus = 'confirmed';
  
  // Update room occupancy
  const Room = mongoose.model('Room');
  await Room.findByIdAndUpdate(this.roomId, {
    $inc: { currentOccupancy: 1 }
  });
  
  await this.save();
  return this;
};

// Method to complete booking
bookingSchema.methods.completeBooking = async function() {
  this.bookingStatus = 'completed';
  await this.save();
  return this;
};

// Method to get booking summary
bookingSchema.methods.getSummary = function() {
  return {
    _id: this._id,
    seekerId: this.seekerId,
    ownerId: this.ownerId,
    propertyId: this.propertyId,
    roomId: this.roomId,
    checkInDate: this.checkInDate,
    checkOutDate: this.checkOutDate,
    durationDays: this.durationDays,
    totalAmount: this.totalAmount,
    securityDeposit: this.securityDeposit,
    totalWithDeposit: this.totalWithDeposit,
    platformCommission: this.platformCommission,
    bookingStatus: this.bookingStatus,
    paymentStatus: this.paymentStatus,
    specialRequests: this.specialRequests,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export default mongoose.model<IBooking>('Booking', bookingSchema);
