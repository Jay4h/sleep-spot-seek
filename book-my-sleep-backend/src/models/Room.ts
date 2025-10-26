import mongoose, { Schema } from 'mongoose';
import { IRoom } from '../types';

const roomSchema = new Schema<IRoom>({
  propertyId: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property ID is required']
  },
  roomNumber: {
    type: String,
    required: [true, 'Room number is required'],
    trim: true,
    maxlength: [20, 'Room number cannot exceed 20 characters']
  },
  roomType: {
    type: String,
    enum: ['Single', 'Double', 'Triple', 'Dormitory'],
    required: [true, 'Room type is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  securityDeposit: {
    type: Number,
    required: [true, 'Security deposit is required'],
    min: [0, 'Security deposit cannot be negative']
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1'],
    max: [10, 'Capacity cannot exceed 10']
  },
  currentOccupancy: {
    type: Number,
    default: 0,
    min: [0, 'Current occupancy cannot be negative'],
    validate: {
      validator: function(this: IRoom, value: number) {
        return value <= this.capacity;
      },
      message: 'Current occupancy cannot exceed capacity'
    }
  },
  amenities: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String,
    trim: true
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  availableFrom: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for property details
roomSchema.virtual('property', {
  ref: 'Property',
  localField: 'propertyId',
  foreignField: '_id',
  justOne: true,
  select: 'propertyName address ownerId'
});

// Virtual for occupancy percentage
roomSchema.virtual('occupancyPercentage').get(function() {
  return this.capacity > 0 ? Math.round((this.currentOccupancy / this.capacity) * 100) : 0;
});

// Virtual for availability status
roomSchema.virtual('availabilityStatus').get(function() {
  if (!this.isAvailable) return 'unavailable';
  if (this.currentOccupancy >= this.capacity) return 'full';
  if (this.availableFrom > new Date()) return 'not-ready';
  return 'available';
});

// Indexes
roomSchema.index({ propertyId: 1 });
roomSchema.index({ isAvailable: 1 });
roomSchema.index({ price: 1 });
roomSchema.index({ roomType: 1 });
roomSchema.index({ availableFrom: 1 });
roomSchema.index({ propertyId: 1, isAvailable: 1 });

// Compound index for availability queries
roomSchema.index({ 
  propertyId: 1, 
  isAvailable: 1, 
  availableFrom: 1 
});

// Pre-save middleware to update availability
roomSchema.pre('save', function(next) {
  if (this.currentOccupancy >= this.capacity) {
    this.isAvailable = false;
  }
  next();
});

// Method to check availability for date range
roomSchema.methods.checkAvailability = async function(checkInDate: Date, checkOutDate: Date) {
  const Booking = mongoose.model('Booking');
  
  // Check if room is available
  if (!this.isAvailable || this.currentOccupancy >= this.capacity) {
    return false;
  }

  // Check if available from date is before check-in
  if (this.availableFrom > checkInDate) {
    return false;
  }

  // Check for conflicting bookings
  const conflictingBooking = await Booking.findOne({
    roomId: this._id,
    bookingStatus: { $in: ['confirmed', 'pending'] },
    $or: [
      {
        checkInDate: { $lt: checkOutDate },
        checkOutDate: { $gt: checkInDate }
      }
    ]
  });

  return !conflictingBooking;
};

// Method to update occupancy
roomSchema.methods.updateOccupancy = async function(change: number) {
  this.currentOccupancy += change;
  
  if (this.currentOccupancy < 0) {
    this.currentOccupancy = 0;
  }
  
  if (this.currentOccupancy >= this.capacity) {
    this.isAvailable = false;
  } else if (this.availableFrom <= new Date()) {
    this.isAvailable = true;
  }
  
  await this.save();
};

// Method to get room summary
roomSchema.methods.getSummary = function() {
  return {
    _id: this._id,
    roomNumber: this.roomNumber,
    roomType: this.roomType,
    price: this.price,
    securityDeposit: this.securityDeposit,
    capacity: this.capacity,
    currentOccupancy: this.currentOccupancy,
    occupancyPercentage: this.occupancyPercentage,
    availabilityStatus: this.availabilityStatus,
    amenities: this.amenities,
    images: this.images,
    isAvailable: this.isAvailable,
    availableFrom: this.availableFrom
  };
};

export default mongoose.model<IRoom>('Room', roomSchema);
