import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PropertyFormData } from '@/services/propertyService';

interface BasicInfoProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export default function BasicInfo({ register, errors }: BasicInfoProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="propertyName">Property Name *</Label>
        <Input
          id="propertyName"
          {...register('propertyName')}
          placeholder="Enter property name"
          className={errors.propertyName ? 'border-destructive' : ''}
        />
        {errors.propertyName && (
          <p className="text-sm text-destructive mt-1">{errors.propertyName.message as string}</p>
        )}
      </div>

      <div>
        <Label htmlFor="propertyType">Property Type *</Label>
        <select
          id="propertyType"
          {...register('propertyType')}
          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            errors.propertyType ? 'border-destructive' : ''
          }`}
        >
          <option value="">Select type</option>
          <option value="PG">PG (Paying Guest)</option>
          <option value="Hostel">Hostel</option>
          <option value="Flat">Flat</option>
        </select>
        {errors.propertyType && (
          <p className="text-sm text-destructive mt-1">{errors.propertyType.message as string}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Describe your property"
          rows={4}
          className={errors.description ? 'border-destructive' : ''}
        />
        {errors.description && (
          <p className="text-sm text-destructive mt-1">{errors.description.message as string}</p>
        )}
      </div>

      <div>
        <Label htmlFor="street">Street Address *</Label>
        <Input
          id="street"
          {...register('street')}
          placeholder="Street address"
          className={errors.street ? 'border-destructive' : ''}
        />
        {errors.street && <p className="text-sm text-destructive mt-1">{errors.street.message as string}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            {...register('city')}
            placeholder="City"
            className={errors.city ? 'border-destructive' : ''}
          />
          {errors.city && <p className="text-sm text-destructive mt-1">{errors.city.message as string}</p>}
        </div>

        <div>
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            {...register('state')}
            placeholder="State"
            className={errors.state ? 'border-destructive' : ''}
          />
          {errors.state && <p className="text-sm text-destructive mt-1">{errors.state.message as string}</p>}
        </div>

        <div>
          <Label htmlFor="zipCode">ZIP Code *</Label>
          <Input
            id="zipCode"
            {...register('zipCode')}
            placeholder="ZIP code"
            className={errors.zipCode ? 'border-destructive' : ''}
          />
          {errors.zipCode && <p className="text-sm text-destructive mt-1">{errors.zipCode.message as string}</p>}
        </div>

        <div>
          <Label htmlFor="country">Country *</Label>
          <Input
            id="country"
            {...register('country')}
            placeholder="Country"
            className={errors.country ? 'border-destructive' : ''}
          />
          {errors.country && <p className="text-sm text-destructive mt-1">{errors.country.message as string}</p>}
        </div>
      </div>
    </div>
  );
}
