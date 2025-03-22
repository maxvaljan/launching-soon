'use client';

import { useState, useEffect } from 'react';
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
import { MoreHorizontal, Search, Plus, Filter, Truck, Edit, Trash, ToggleLeft, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { vehicleService, Vehicle } from '@/lib/services/vehicle';
import { VehicleEditModal } from '@/components/admin/VehicleEditModal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      
      const data = await vehicleService.getAllVehicles();
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = (vehicle?: Vehicle) => {
    setSelectedVehicle(vehicle);
    setEditModalOpen(true);
  };

  const handleOpenDeleteDialog = (vehicleId: string) => {
    setVehicleToDelete(vehicleId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteVehicle = async () => {
    if (!vehicleToDelete) return;
    
    try {
      await vehicleService.deleteVehicle(vehicleToDelete);
      toast.success('Vehicle deleted successfully');
      fetchVehicles(); // Refresh the list
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      let errorMessage = 'Failed to delete vehicle';
      
      // Check if the error contains a specific message
      if (error instanceof Error) {
        // Display more specific error message if available
        errorMessage = error.message.includes('used in orders') 
          ? 'Cannot delete vehicle that is used in orders'
          : error.message || errorMessage;
      }
      
      toast.error(errorMessage);
    } finally {
      setDeleteDialogOpen(false);
      setVehicleToDelete(null);
    }
  };

  const handleToggleVehicleStatus = async (vehicle: Vehicle) => {
    try {
      const updatedVehicle = await vehicleService.toggleVehicleActive(vehicle.id);
      
      if (updatedVehicle) {
        toast.success(`Vehicle ${updatedVehicle.active ? 'activated' : 'deactivated'}`);
        
        // Update the local state
        setVehicles(vehicles.map(v => 
          v.id === vehicle.id ? updatedVehicle : v
        ));
      }
    } catch (error) {
      console.error('Error toggling vehicle status:', error);
      toast.error('Failed to update vehicle status');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(price / 100); // Assuming prices are stored in cents
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.category.toLowerCase().includes(searchTerm.toLowerCase());
    
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
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => handleOpenEditModal()}
        >
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
            aria-label="Filter vehicles"
          >
            <option value="all">All Vehicles</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow overflow-hidden">
        <Table>
          <TableCaption>A list of all vehicle types in the system</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Order</TableHead>
              <TableHead>Vehicle Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Dimensions</TableHead>
              <TableHead>Max Weight</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  {searchTerm || activeFilter !== 'all'
                    ? 'No vehicles match your search or filter criteria.'
                    : 'No vehicles found in the system.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <Badge variant="outline">{vehicle.display_order}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {vehicle.svg_icon ? (
                        <div 
                          className="h-8 w-8 mr-2 flex items-center justify-center text-gray-700"
                          dangerouslySetInnerHTML={{ __html: vehicle.svg_icon }}
                        />
                      ) : (
                        <Truck className="mr-2 h-5 w-5 text-gray-400" />
                      )}
                      {vehicle.name}
                    </div>
                  </TableCell>
                  <TableCell>{vehicle.category}</TableCell>
                  <TableCell>{vehicle.dimensions}</TableCell>
                  <TableCell>{vehicle.max_weight}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      Base: {formatPrice(vehicle.base_price)}
                      <br />
                      Per km: {formatPrice(vehicle.price_per_km)}
                    </div>
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => handleOpenEditModal(vehicle)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Vehicle
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleVehicleStatus(vehicle)}>
                          <ToggleLeft className="mr-2 h-4 w-4" />
                          {vehicle.active ? 'Deactivate' : 'Activate'} Vehicle
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleOpenDeleteDialog(vehicle.id)}
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

      {/* Edit Modal */}
      {editModalOpen && (
        <VehicleEditModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedVehicle(undefined);
          }}
          vehicle={selectedVehicle}
          onVehicleSaved={fetchVehicles}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              selected vehicle type from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setVehicleToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteVehicle}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}