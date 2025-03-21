'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PageLoading } from '@/components/ui/loading';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Search, Plus, Filter, Truck, Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';

interface VehicleType {
  id: string;
  name: string;
  capacity: string;
  max_weight: number;
  base_price: number;
  price_per_km: number;
  image_url?: string;
  active: boolean;
  created_at: string;
}

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      
      // This would be a real query in a production app
      const { data, error } = await supabase
        .from('vehicle_types')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setVehicles(data || sampleVehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Failed to load vehicles');
      // For demo purposes, use sample data if the query fails
      setVehicles(sampleVehicles);
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleAction = async (action: string, vehicleId: string) => {
    try {
      switch (action) {
        case 'edit':
          toast.info(`Editing vehicle ${vehicleId}`);
          // In a real app, this would open a modal with the vehicle details
          break;
        case 'toggle':
          // Toggle the active status
          const vehicleToToggle = vehicles.find(v => v.id === vehicleId);
          if (vehicleToToggle) {
            const updatedVehicle = { ...vehicleToToggle, active: !vehicleToToggle.active };
            
            // Update in the database (mock for now)
            toast.success(`Vehicle ${updatedVehicle.active ? 'activated' : 'deactivated'}`);
            
            // Update local state
            setVehicles(vehicles.map(v => v.id === vehicleId ? updatedVehicle : v));
          }
          break;
        case 'delete':
          if (confirm('Are you sure you want to delete this vehicle type? This action cannot be undone.')) {
            // In a real app, delete from the database
            toast.success('Vehicle type deleted');
            // Update the UI
            setVehicles(vehicles.filter(v => v.id !== vehicleId));
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error performing action ${action}:`, error);
      toast.error('Operation failed');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.capacity.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesActive = 
      activeFilter === 'all' || 
      (activeFilter === 'active' && vehicle.active) || 
      (activeFilter === 'inactive' && !vehicle.active);
    
    return matchesSearch && matchesActive;
  });

  if (loading) {
    return <PageLoading message="Loading vehicles..." />;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vehicle Management</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle Type
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            className="border border-gray-300 rounded-md p-2 text-sm"
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
          >
            <option value="all">All Vehicles</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow">
        <Table>
          <TableCaption>A list of all vehicle types in the system</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle Type</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Max Weight</TableHead>
              <TableHead>Base Price</TableHead>
              <TableHead>Price/km</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  {searchTerm || activeFilter !== 'all'
                    ? 'No vehicles match your search or filter criteria.'
                    : 'No vehicles found in the system.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Truck className="mr-2 h-4 w-4 text-gray-400" />
                      {vehicle.name}
                    </div>
                  </TableCell>
                  <TableCell>{vehicle.capacity}</TableCell>
                  <TableCell>{vehicle.max_weight} kg</TableCell>
                  <TableCell>{formatPrice(vehicle.base_price)}</TableCell>
                  <TableCell>{formatPrice(vehicle.price_per_km)}/km</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      vehicle.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {vehicle.active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleVehicleAction('edit', vehicle.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Vehicle
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleVehicleAction('toggle', vehicle.id)}>
                          {vehicle.active ? 'Deactivate' : 'Activate'} Vehicle
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleVehicleAction('delete', vehicle.id)}
                          className="text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Vehicle
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="p-6 bg-blue-50 border-blue-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Vehicles</p>
              <h3 className="text-2xl font-bold mt-1">{vehicles.length}</h3>
            </div>
            <Truck className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        
        <Card className="p-6 bg-green-50 border-green-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-600 text-sm font-medium">Active Vehicles</p>
              <h3 className="text-2xl font-bold mt-1">{vehicles.filter(v => v.active).length}</h3>
            </div>
            <Truck className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        
        <Card className="p-6 bg-amber-50 border-amber-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-amber-600 text-sm font-medium">Avg. Base Price</p>
              <h3 className="text-2xl font-bold mt-1">
                {formatPrice(
                  vehicles.reduce((sum, v) => sum + v.base_price, 0) / (vehicles.length || 1)
                )}
              </h3>
            </div>
            <Truck className="h-8 w-8 text-amber-500" />
          </div>
        </Card>
      </div>
    </div>
  );
}

// Sample vehicle data for demonstration
const sampleVehicles: VehicleType[] = [
  {
    id: '1',
    name: 'Motorcycle',
    capacity: 'Small',
    max_weight: 20,
    base_price: 5.99,
    price_per_km: 0.5,
    active: true,
    created_at: '2023-01-15T09:00:00Z'
  },
  {
    id: '2',
    name: 'Sedan',
    capacity: 'Medium',
    max_weight: 150,
    base_price: 9.99,
    price_per_km: 0.75,
    active: true,
    created_at: '2023-02-05T14:30:00Z'
  },
  {
    id: '3',
    name: 'Van',
    capacity: 'Large',
    max_weight: 500,
    base_price: 14.99,
    price_per_km: 1.25,
    active: true,
    created_at: '2023-03-10T11:45:00Z'
  },
  {
    id: '4',
    name: 'Truck',
    capacity: 'Extra Large',
    max_weight: 1500,
    base_price: 24.99,
    price_per_km: 2.00,
    active: true,
    created_at: '2023-04-18T16:20:00Z'
  },
  {
    id: '5',
    name: 'Cargo Truck',
    capacity: 'XXL',
    max_weight: 3000,
    base_price: 39.99,
    price_per_km: 3.50,
    active: false,
    created_at: '2023-05-22T10:15:00Z'
  }
];