'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, Upload, Car, Bike, Truck } from 'lucide-react';
import { vehicleService, Vehicle } from '@/lib/services/vehicle';
import { Textarea } from '@/components/ui/textarea';

// Schema for vehicle form validation
const vehicleFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  category: z.string().min(1, 'Category is required'),
  dimensions: z.string().min(1, 'Dimensions are required'),
  max_weight: z.string().min(1, 'Max weight is required'),
  base_price: z.coerce.number().min(0, 'Must be 0 or higher'),
  price_per_km: z.coerce.number().min(0, 'Must be 0 or higher'),
  minimum_distance: z.coerce.number().min(0, 'Must be 0 or higher'),
  svg_icon: z.string().optional(),
  active: z.boolean().default(true),
  display_order: z.coerce.number().int().min(0, 'Must be 0 or higher')
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

interface VehicleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: Vehicle;
  onVehicleSaved: () => void;
}

export function VehicleEditModal({ isOpen, onClose, vehicle, onVehicleSaved }: VehicleEditModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSvgPreview, setSelectedSvgPreview] = useState<string | null>(vehicle?.svg_icon || null);
  const isNewVehicle = !vehicle?.id;
  
  // Initialize form with vehicle data or empty values
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      name: vehicle?.name || '',
      description: vehicle?.description || '',
      category: vehicle?.category || '',
      dimensions: vehicle?.dimensions || '',
      max_weight: vehicle?.max_weight || '',
      base_price: vehicle?.base_price || 0,
      price_per_km: vehicle?.price_per_km || 0,
      minimum_distance: vehicle?.minimum_distance || 0,
      svg_icon: vehicle?.svg_icon || '',
      active: vehicle?.active ?? true,
      display_order: vehicle?.display_order || 0,
    },
  });

  // Watch for SVG icon changes to update preview
  const svgIconValue = form.watch('svg_icon');
  if (svgIconValue !== selectedSvgPreview) {
    setSelectedSvgPreview(svgIconValue || null);
  }

  async function onSubmit(values: VehicleFormValues) {
    try {
      setIsSubmitting(true);
      
      if (isNewVehicle) {
        await vehicleService.createVehicle(values);
        toast.success('Vehicle created successfully');
      } else if (vehicle) {
        await vehicleService.updateVehicle(vehicle.id, values);
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
                    <Input placeholder="e.g. Small Van, Truck" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Description of the vehicle and its use cases" 
                      rows={3} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. van, car, bike_motorcycle" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dimensions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dimensions</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 120cm x 90cm x 80cm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="max_weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Weight</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 500kg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="display_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Lower numbers display first
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="base_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Price (€)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price_per_km"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per km (€)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minimum_distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Distance (km)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="mt-4">
              <FormLabel className="block mb-2">SVG Icon</FormLabel>
              <FormField
                control={form.control}
                name="svg_icon"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <div className="space-y-2">
                        <Textarea 
                          placeholder="<svg>...</svg>" 
                          {...field} 
                          rows={4}
                          className="font-mono text-xs"
                        />
                        
                        {selectedSvgPreview && (
                          <div className="p-4 bg-gray-50 border rounded-md">
                            <div className="text-sm font-medium mb-2">Preview:</div>
                            <div className="flex gap-4 items-center">
                              <div 
                                className="p-3 border rounded-md bg-white w-16 h-16 flex items-center justify-center"
                                dangerouslySetInnerHTML={{ __html: selectedSvgPreview }}
                              />
                              <div 
                                className="p-3 border rounded-md bg-white w-8 h-8 flex items-center justify-center"
                                dangerouslySetInnerHTML={{ __html: selectedSvgPreview }}
                              />
                            </div>
                          </div>
                        )}
                        
                        <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mt-2">
                          <h4 className="text-sm font-medium text-blue-900 mb-1">SVG Guidelines:</h4>
                          <ul className="text-xs text-blue-800 list-disc pl-5 space-y-1">
                            <li>Paste the complete SVG code including {"<svg>"} tags</li>
                            <li>Use simple, single-color SVG files for best results</li>
                            <li>Make sure it has viewBox attribute for proper scaling</li>
                            <li>Use "currentColor" for stroke/fill to match theme colors</li>
                          </ul>
                        </div>
                      </div>
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