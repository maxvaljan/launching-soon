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
import { adminService, VehicleType } from '@/lib/services/admin';

// Define valid vehicle icon types
const iconTypes = ['auto1', 'courier1', 'kangoo1', 'minilkw1', 'minivan1', 'towing1', 'van1', ''] as const;
type IconType = typeof iconTypes[number];

// Schema for vehicle form validation
const vehicleFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  capacity: z.string().min(1, 'Capacity is required'),
  max_weight: z.coerce.number().positive('Must be a positive number'),
  base_price: z.coerce.number().positive('Must be a positive number'),
  price_per_km: z.coerce.number().positive('Must be a positive number'),
  image_url: z.string().optional(),
  icon_type: z.enum(iconTypes).default('auto1'),
  custom_icon_url: z.string().optional(),
  active: z.boolean().default(true),
})
.refine(data => {
  // Either icon_type or custom_icon_url must be provided, not both
  if (data.custom_icon_url && data.custom_icon_url.trim() !== '') {
    return data.icon_type === ''; // If custom URL is provided, icon_type should be empty
  }
  return data.icon_type !== ''; // Otherwise, icon_type must be provided
}, {
  message: "Please choose either a built-in icon or provide a custom SVG URL, not both",
  path: ["icon_type"]
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

  const [iconTab, setIconTab] = useState(vehicle?.custom_icon_url ? 'custom' : 'built-in');
  
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
      icon_type: vehicle?.icon_type || 'auto1',
      custom_icon_url: vehicle?.custom_icon_url || '',
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
            
            <div className="mt-4">
              <FormLabel className="block mb-2">Vehicle Icon</FormLabel>
              <Tabs 
                defaultValue="built-in" 
                value={iconTab} 
                onValueChange={(value) => {
                  setIconTab(value);
                  // Clear the other field when switching tabs
                  if (value === 'built-in') {
                    form.setValue('custom_icon_url', '');
                  } else {
                    form.setValue('icon_type', '');
                  }
                }}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="built-in">Built-in SVG Icons</TabsTrigger>
                  <TabsTrigger value="custom">Custom SVG URL</TabsTrigger>
                </TabsList>
                
                <TabsContent value="built-in" className="mt-0">
                  <FormField
                    control={form.control}
                    name="icon_type"
                    render={({ field }) => (
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                        <div 
                          className={`flex flex-col items-center justify-center p-4 border rounded-md cursor-pointer ${field.value === 'auto1' ? 'bg-blue-50 border-blue-400' : 'hover:bg-gray-50'}`}
                          onClick={() => field.onChange('auto1')}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={32}
                            height={32}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mb-2"
                          >
                            <path d="M14 16H9M5 11L13 7H8.5C7.4 7 6.46667 7.63333 6.16667 8.58333L5 11Z" />
                            <circle cx="6.5" cy="16.5" r="2.5" />
                            <circle cx="16.5" cy="16.5" r="2.5" />
                            <path d="M3 12H17V16H3V12Z" />
                            <path d="M14 9H19L21 12H14V9Z" />
                          </svg>
                          <span className="text-sm font-medium">Car</span>
                        </div>
                        
                        <div 
                          className={`flex flex-col items-center justify-center p-4 border rounded-md cursor-pointer ${field.value === 'courier1' ? 'bg-blue-50 border-blue-400' : 'hover:bg-gray-50'}`}
                          onClick={() => field.onChange('courier1')}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={32}
                            height={32}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mb-2"
                          >
                            <path d="M12 11H15C15.5523 11 16 11.4477 16 12V15H4V6C4 4.89543 4.89543 4 6 4H15L18 7V11H12Z" />
                            <circle cx="9" cy="15" r="2" />
                            <circle cx="16" cy="15" r="2" />
                          </svg>
                          <span className="text-sm font-medium">Courier</span>
                        </div>
                        
                        <div 
                          className={`flex flex-col items-center justify-center p-4 border rounded-md cursor-pointer ${field.value === 'kangoo1' ? 'bg-blue-50 border-blue-400' : 'hover:bg-gray-50'}`}
                          onClick={() => field.onChange('kangoo1')}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={32}
                            height={32}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mb-2"
                          >
                            <path d="M6 9H17C18.1046 9 19 9.89543 19 11V13.5H15V12H5V15H3C2.44772 15 2 14.5523 2 14V12.18C2 11.5291 2.52908 11 3.18 11H5V7L6 4H9.93C10.5955 4 11.2115 4.35412 11.5937 4.9L13 7V9" />
                            <circle cx="4" cy="15" r="2" />
                            <circle cx="18" cy="15" r="2" />
                          </svg>
                          <span className="text-sm font-medium">Kangoo</span>
                        </div>
                        
                        <div 
                          className={`flex flex-col items-center justify-center p-4 border rounded-md cursor-pointer ${field.value === 'minilkw1' ? 'bg-blue-50 border-blue-400' : 'hover:bg-gray-50'}`}
                          onClick={() => field.onChange('minilkw1')}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={32}
                            height={32}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mb-2"
                          >
                            <path d="M3 8H16C17.1046 8 18 8.89543 18 10V14H15C14.4477 14 14 14.4477 14 15V16H8V15C8 14.4477 7.55228 14 7 14H3V8Z" />
                            <path d="M5 14H7.5" />
                            <path d="M13 14H15.5" />
                            <path d="M3 3V8" />
                            <path d="M10 3V8" />
                            <path d="M6 2H10" />
                          </svg>
                          <span className="text-sm font-medium">Mini Truck</span>
                        </div>
                        
                        <div 
                          className={`flex flex-col items-center justify-center p-4 border rounded-md cursor-pointer ${field.value === 'minivan1' ? 'bg-blue-50 border-blue-400' : 'hover:bg-gray-50'}`}
                          onClick={() => field.onChange('minivan1')}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={32}
                            height={32}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mb-2"
                          >
                            <circle cx="7" cy="15" r="2" />
                            <circle cx="17" cy="15" r="2" />
                            <path d="M5 9H19L17 17H7L5 9Z" />
                            <path d="M5 9L3 5H22L20 9" />
                            <path d="M10 5V3H14V5" />
                          </svg>
                          <span className="text-sm font-medium">Minivan</span>
                        </div>
                        
                        <div 
                          className={`flex flex-col items-center justify-center p-4 border rounded-md cursor-pointer ${field.value === 'towing1' ? 'bg-blue-50 border-blue-400' : 'hover:bg-gray-50'}`}
                          onClick={() => field.onChange('towing1')}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={32}
                            height={32}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mb-2"
                          >
                            <circle cx="10" cy="15" r="2" />
                            <circle cx="5" cy="15" r="2" />
                            <path d="M15 15H10" />
                            <path d="M8 15H5.23C4.1 15 3.15 14.22 2.98 13.1L2 7H5M5 5H14M14 5V11" />
                            <path d="M2 9H14C15.1 9 16 9.9 16 11V13" />
                            <path d="M16 13H18.7C19.0 13 19.3 13.1 19.4 13.3L22 15.9" />
                            <path d="M16 13.1V16H14" />
                          </svg>
                          <span className="text-sm font-medium">Towing</span>
                        </div>
                        
                        <div 
                          className={`flex flex-col items-center justify-center p-4 border rounded-md cursor-pointer ${field.value === 'van1' ? 'bg-blue-50 border-blue-400' : 'hover:bg-gray-50'}`}
                          onClick={() => field.onChange('van1')}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={32}
                            height={32}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mb-2"
                          >
                            <circle cx="10" cy="15" r="2" />
                            <circle cx="19" cy="15" r="2" />
                            <path d="M5 15H3V6C3 4.89543 3.89543 4 5 4H16L19 8V15H17" />
                            <path d="M15 15H13" />
                            <path d="M7 15H5" />
                          </svg>
                          <span className="text-sm font-medium">Van</span>
                        </div>
                      </div>
                    )}
                  />

                  <div className="mt-4">
                    <FormMessage name="icon_type" />
                    <p className="text-xs text-gray-500 mt-2">
                      These SVG icons are built directly into the app for optimal performance. Select the one that best represents your vehicle type.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="custom" className="mt-0">
                  <FormField
                    control={form.control}
                    name="custom_icon_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="space-y-2">
                            <Input 
                              placeholder="https://example.com/icon.svg" 
                              {...field} 
                            />
                            <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mt-2">
                              <h4 className="text-sm font-medium text-blue-900 mb-1">SVG URL Guidelines:</h4>
                              <ul className="text-xs text-blue-800 list-disc pl-5 space-y-1">
                                <li>Use simple, single-color SVG files for best results</li>
                                <li>Ensure your SVG has the appropriate CORS headers to display properly</li>
                                <li>SVG should be optimized for 24x24 or 32x32 viewBox</li>
                                <li>Consider using the built-in icons for improved performance</li>
                              </ul>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
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