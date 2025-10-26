import mongoose, { Schema } from 'mongoose';
import { IMessage } from '../types';

const messageSchema = new Schema<IMessage>({
  conversationId: {
    type: String,
    required: [true, 'Conversation ID is required'],
    trim: true
  },
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'From user ID is required']
  },
  toUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'To user ID is required']
  },
  propertyId: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    default: null
  },
  text: {
    type: String,
    required: [true, 'Message text is required'],
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  read: {
    type: Boolean,
    default: false
  },
  metadata: {
    deliveredAt: {
      type: Date,
      default: null
    },
    seenAt: {
      type: Date,
      default: null
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for sender details
messageSchema.virtual('sender', {
  ref: 'User',
  localField: 'fromUser',
  foreignField: '_id',
  justOne: true,
  select: 'firstName lastName profilePicture'
});

// Virtual for recipient details
messageSchema.virtual('recipient', {
  ref: 'User',
  localField: 'toUser',
  foreignField: '_id',
  justOne: true,
  select: 'firstName lastName profilePicture'
});

// Virtual for property details
messageSchema.virtual('property', {
  ref: 'Property',
  localField: 'propertyId',
  foreignField: '_id',
  justOne: true,
  select: 'propertyName address'
});

// Indexes
messageSchema.index({ conversationId: 1 });
messageSchema.index({ fromUser: 1 });
messageSchema.index({ toUser: 1 });
messageSchema.index({ propertyId: 1 });
messageSchema.index({ read: 1 });
messageSchema.index({ createdAt: -1 });

// Compound indexes
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ toUser: 1, read: 1 });
messageSchema.index({ fromUser: 1, toUser: 1 });

// Pre-save middleware to set delivery time
messageSchema.pre('save', function(next) {
  if (this.isNew) {
    this.metadata.deliveredAt = new Date();
  }
  next();
});

// Method to mark as read
messageSchema.methods.markAsRead = async function() {
  this.read = true;
  this.metadata.seenAt = new Date();
  await this.save();
  return this;
};

// Static method to get conversation messages
messageSchema.statics.getConversationMessages = async function(
  conversationId: string,
  page: number = 1,
  limit: number = 50
) {
  const skip = (page - 1) * limit;

  const messages = await this.find({ conversationId })
    .populate('sender', 'firstName lastName profilePicture')
    .populate('recipient', 'firstName lastName profilePicture')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await this.countDocuments({ conversationId });

  return {
    messages: messages.reverse(), // Return in chronological order
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Static method to get user conversations
messageSchema.statics.getUserConversations = async function(userId: string) {
  const conversations = await this.aggregate([
    {
      $match: {
        $or: [
          { fromUser: new mongoose.Types.ObjectId(userId) },
          { toUser: new mongoose.Types.ObjectId(userId) }
        ]
      }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $group: {
        _id: '$conversationId',
        lastMessage: { $first: '$$ROOT' },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$toUser', new mongoose.Types.ObjectId(userId)] },
                  { $eq: ['$read', false] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'lastMessage.fromUser',
        foreignField: '_id',
        as: 'sender'
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'lastMessage.toUser',
        foreignField: '_id',
        as: 'recipient'
      }
    },
    {
      $lookup: {
        from: 'properties',
        localField: 'lastMessage.propertyId',
        foreignField: '_id',
        as: 'property'
      }
    },
    {
      $project: {
        _id: 1,
        conversationId: 1,
        lastMessage: {
          _id: '$lastMessage._id',
          text: '$lastMessage.text',
          createdAt: '$lastMessage.createdAt',
          read: '$lastMessage.read'
        },
        unreadCount: 1,
        sender: { $arrayElemAt: ['$sender', 0] },
        recipient: { $arrayElemAt: ['$recipient', 0] },
        property: { $arrayElemAt: ['$property', 0] }
      }
    },
    {
      $sort: { 'lastMessage.createdAt': -1 }
    }
  ]);

  return conversations;
};

// Static method to mark conversation as read
messageSchema.statics.markConversationAsRead = async function(
  conversationId: string,
  userId: string
) {
  return this.updateMany(
    {
      conversationId,
      toUser: userId,
      read: false
    },
    {
      $set: {
        read: true,
        'metadata.seenAt': new Date()
      }
    }
  );
};

// Static method to get unread count
messageSchema.statics.getUnreadCount = async function(userId: string) {
  return this.countDocuments({
    toUser: userId,
    read: false
  });
};

// Method to get public message data
messageSchema.methods.getPublicData = function() {
  return {
    _id: this._id,
    conversationId: this.conversationId,
    fromUser: this.fromUser,
    toUser: this.toUser,
    propertyId: this.propertyId,
    text: this.text,
    read: this.read,
    metadata: this.metadata,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export default mongoose.model<IMessage>('Message', messageSchema);
