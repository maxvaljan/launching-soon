'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { adminService, VehicleType } from '@/lib/services/admin';

// Schema for vehicle form validation
const vehicleFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  capacity: z.string().min(1, 'Capacity is required'),
  max_weight: z.coerce.number().positive('Must be a positive number'),
  base_price: z.coerce.number().positive('Must be a positive number'),
  price_per_km: z.coerce.number().positive('Must be a positive number'),
  image_url: z.string().optional(),
  active: z.boolean().default(true),
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

interface VehicleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: VehicleType;
  onVehicleSaved: () => void;
}

export function VehicleEditModal({ isOpen, onClose, vehicle, onVehicleSaved }: VehicleEditModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isNewVehicle = !vehicle?.id;

  // Initialize form with vehicle data or empty values
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      name: vehicle?.name || '',
      capacity: vehicle?.capacity || '',
      max_weight: vehicle?.max_weight || 0,
      base_price: vehicle?.base_price || 0,
      price_per_km: vehicle?.price_per_km || 0,
      image_url: vehicle?.image_url || '',
      active: vehicle?.active ?? true,
    },
  });

  async function onSubmit(values: VehicleFormValues) {
    try {
      setIsSubmitting(true);
      
      if (isNewVehicle) {
        await adminService.createVehicle(values);
        toast.success('Vehicle created successfully');
      } else {
        await adminService.updateVehicle(vehicle.id, values);
        toast.success('Vehicle updated successfully');
      }
      
      // Call the callback to refresh the vehicle list
      onVehicleSaved();
      // Close the modal
      onClose();
    } catch (error) {
      console.error('Error saving vehicle:', error);
      toast.error(isNewVehicle ? 'Failed to create vehicle' : 'Failed to update vehicle');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isNewVehicle ? 'Add New Vehicle' : 'Edit Vehicle'}</DialogTitle>
          <DialogDescription>
            {isNewVehicle
              ? 'Add a new vehicle type to your fleet'
              : 'Update the details of this vehicle type'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Sedan, Van, Truck" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Small, Medium, Large" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="max_weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="base_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price_per_km"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per km ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                    <FormDescription>
                      Active vehicles will be displayed to customers
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isNewVehicle ? 'Creating...' : 'Updating...'}
                  </>
                ) : (
                  <>{isNewVehicle ? 'Create Vehicle' : 'Update Vehicle'}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}