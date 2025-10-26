import { Box, FormControl, FormLabel, Input, Select, Textarea, FormErrorMessage } from '@chakra-ui/react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { PropertyFormData } from '@/services/propertyService';

interface BasicInfoProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<PropertyFormData>;
}

export default function BasicInfo({ register, errors }: BasicInfoProps) {
  return (
    <Box>
      <FormControl isInvalid={!!errors.propertyName} mb={4}>
        <FormLabel>Property Name</FormLabel>
        <Input {...register('propertyName')} placeholder="Enter property name" />
        <FormErrorMessage>{errors.propertyName?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.propertyType} mb={4}>
        <FormLabel>Property Type</FormLabel>
        <Select {...register('propertyType')} placeholder="Select type">
          <option value="PG">PG (Paying Guest)</option>
          <option value="Hostel">Hostel</option>
          <option value="Flat">Flat</option>
        </Select>
        <FormErrorMessage>{errors.propertyType?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.description} mb={4}>
        <FormLabel>Description</FormLabel>
        <Textarea {...register('description')} placeholder="Describe your property" rows={4} />
        <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.street} mb={4}>
        <FormLabel>Street Address</FormLabel>
        <Input {...register('street')} placeholder="Street address" />
        <FormErrorMessage>{errors.street?.message}</FormErrorMessage>
      </FormControl>

      <Box display="grid" gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
        <FormControl isInvalid={!!errors.city}>
          <FormLabel>City</FormLabel>
          <Input {...register('city')} placeholder="City" />
          <FormErrorMessage>{errors.city?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.state}>
          <FormLabel>State</FormLabel>
          <Input {...register('state')} placeholder="State" />
          <FormErrorMessage>{errors.state?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.zipCode}>
          <FormLabel>ZIP Code</FormLabel>
          <Input {...register('zipCode')} placeholder="ZIP code" />
          <FormErrorMessage>{errors.zipCode?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.country}>
          <FormLabel>Country</FormLabel>
          <Input {...register('country')} placeholder="Country" />
          <FormErrorMessage>{errors.country?.message}</FormErrorMessage>
        </FormControl>
      </Box>
    </Box>
  );
}
