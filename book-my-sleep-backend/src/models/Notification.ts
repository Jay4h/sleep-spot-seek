import mongoose, { Schema } from 'mongoose';
import { INotification } from '../types';

const notificationSchema = new Schema<INotification>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  type: {
    type: String,
    enum: ['booking', 'payment', 'message', 'system'],
    required: [true, 'Type is required']
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for user details
notificationSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
  select: 'firstName lastName email'
});

// Indexes
notificationSchema.index({ userId: 1 });
notificationSchema.index({ read: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ createdAt: -1 });

// Compound indexes
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ userId: 1, type: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });

// Static method to get user notifications
notificationSchema.statics.getUserNotifications = async function(
  userId: string,
  page: number = 1,
  limit: number = 20,
  unreadOnly: boolean = false
) {
  const skip = (page - 1) * limit;
  const query: any = { userId };
  
  if (unreadOnly) {
    query.read = false;
  }

  const notifications = await this.find(query)
    .populate('user', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await this.countDocuments(query);

  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function(userId: string) {
  return this.countDocuments({
    userId,
    read: false
  });
};

// Static method to mark as read
notificationSchema.statics.markAsRead = async function(notificationId: string, userId: string) {
  return this.findOneAndUpdate(
    { _id: notificationId, userId },
    { read: true },
    { new: true }
  );
};

// Static method to mark all as read
notificationSchema.statics.markAllAsRead = async function(userId: string) {
  return this.updateMany(
    { userId, read: false },
    { read: true }
  );
};

// Static method to create notification
notificationSchema.statics.createNotification = async function(
  userId: string,
  title: string,
  message: string,
  type: 'booking' | 'payment' | 'message' | 'system'
) {
  const notification = new this({
    userId,
    title,
    message,
    type
  });

  await notification.save();
  return notification;
};

// Static method to create bulk notifications
notificationSchema.statics.createBulkNotifications = async function(
  userIds: string[],
  title: string,
  message: string,
  type: 'booking' | 'payment' | 'message' | 'system'
) {
  const notifications = userIds.map(userId => ({
    userId,
    title,
    message,
    type
  }));

  return this.insertMany(notifications);
};

// Method to mark as read
notificationSchema.methods.markAsRead = async function() {
  this.read = true;
  await this.save();
  return this;
};

// Method to get public notification data
notificationSchema.methods.getPublicData = function() {
  return {
    _id: this._id,
    title: this.title,
    message: this.message,
    type: this.type,
    read: this.read,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export default mongoose.model<INotification>('Notification', notificationSchema);
