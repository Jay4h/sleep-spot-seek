import * as yup from 'yup';

export const basicInfoSchema = yup.object({
  propertyName: yup.string().required('Property name is required').max(100),
  propertyType: yup.string().oneOf(['PG', 'Hostel', 'Flat']).required(),
  description: yup.string().required('Description is required').max(500),
  street: yup.string().required('Street address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string().required('ZIP code is required'),
  country: yup.string().required('Country is required'),
});

export const roomSchema = yup.object({
  roomNumber: yup.string().required('Room number is required'),
  roomType: yup.string().oneOf(['Single', 'Double', 'Triple', 'Dormitory']).required(),
  price: yup.number().positive('Price must be positive').required('Price is required'),
  securityDeposit: yup.number().min(0, 'Deposit cannot be negative').required('Security deposit is required'),
  capacity: yup.number().positive().integer().required('Capacity is required'),
  availableFrom: yup.date().required('Available from date is required'),
  isAvailable: yup.boolean().default(true),
});

export const bookingSchema = yup.object({
  checkInDate: yup.date().required('Check-in date is required').min(new Date(), 'Check-in date must be in the future'),
  checkOutDate: yup
    .date()
    .required('Check-out date is required')
    .min(yup.ref('checkInDate'), 'Check-out must be after check-in'),
  roomId: yup.string().required('Please select a room'),
});
