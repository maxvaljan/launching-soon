'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  ArrowLeft,
  Calendar,
  Tag,
  CreditCard,
  Users,
  Shield,
  Trash2
} from 'lucide-react';
import { 
  PromoCode, 
  PromoCodeStatus,
  PromoCodeType,
  adminService 
} from '@/lib/services/admin';
import { PageLoading } from '@/components/ui/loading';

export default function PromoCodeDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState<PromoCode | null>(null);
  const [formData, setFormData] = useState<Partial<PromoCode>>({});

  useEffect(() => {
    const fetchPromoCode = async () => {
      try {
        setLoading(true);
        const code = await adminService.getPromoCodeById(params.id);
        setPromoCode(code);
        
        // Format dates for input fields
        setFormData({
          ...code,
          start_date: code?.start_date ? code.start_date.split('T')[0] : undefined,
          expiry_date: code?.expiry_date ? code.expiry_date.split('T')[0] : undefined
        });
      } catch (error) {
        console.error('Error fetching promo code:', error);
        toast.error('Failed to load promo code details');
      } finally {
        setLoading(false);
      }
    };
    
    if (params.id) {
      fetchPromoCode();
    }
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let parsedValue: string | number | undefined = value;
    
    // Parse numerical fields
    if (['value', 'min_order_amount', 'max_discount_amount', 'usage_limit'].includes(name) && value !== '') {
      parsedValue = parseFloat(value);
    }
    
    setFormData({
      ...formData,
      [name]: parsedValue === '' ? undefined : parsedValue
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      if (!formData.code || !formData.description || formData.value === undefined || !formData.type || !formData.start_date) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      // Convert dates to ISO strings
      const processedData = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        expiry_date: formData.expiry_date 
          ? new Date(formData.expiry_date).toISOString() 
          : undefined
      };
      
      await adminService.updatePromoCode(params.id, processedData);
      
      toast.success('Promo code updated successfully');
      router.push('/admin/marketing');
    } catch (error) {
      console.error('Error updating promo code:', error);
      toast.error('Failed to update promo code');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this promo code? This action cannot be undone.')) {
      try {
        setSubmitting(true);
        await adminService.deletePromoCode(params.id);
        toast.success('Promo code deleted successfully');
        router.push('/admin/marketing');
      } catch (error) {
        console.error('Error deleting promo code:', error);
        toast.error('Failed to delete promo code');
      } finally {
        setSubmitting(false);
      }
    }
  };
  
  if (loading) {
    return <PageLoading message="Loading promo code details..." />;
  }
  
  if (!promoCode) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Promo Code Not Found</h1>
        <p className="mb-6">The promo code you're looking for doesn't exist or has been deleted.</p>
        <Link href="/admin/marketing">
          <Button>Back to Marketing</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/admin/marketing" className="mr-4">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Edit Promo Code</h1>
        </div>
        
        <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-4 col-span-3 md:col-span-1">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Shield className="mr-2 h-5 w-5 text-blue-600" />
            Promo Code Overview
          </h2>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Code</p>
              <p className="font-medium">{promoCode.code}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className={`inline-block px-2 py-1 rounded-full text-xs ${
                promoCode.status === PromoCodeStatus.ACTIVE ? 'bg-green-100 text-green-800' :
                promoCode.status === PromoCodeStatus.PAUSED ? 'bg-yellow-100 text-yellow-800' :
                promoCode.status === PromoCodeStatus.EXPIRED ? 'bg-gray-100 text-gray-800' :
                promoCode.status === PromoCodeStatus.DEPLETED ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {promoCode.status}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Discount</p>
              <p className="font-medium">
                {promoCode.type === PromoCodeType.PERCENTAGE ? `${promoCode.value}% off` :
                 promoCode.type === PromoCodeType.FIXED_AMOUNT ? `$${promoCode.value.toFixed(2)} off` :
                 'Free delivery'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Usage</p>
              <p className="font-medium">
                {promoCode.usage_count}{promoCode.usage_limit ? `/${promoCode.usage_limit}` : ' uses'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Valid Period</p>
              <p className="font-medium">
                {new Date(promoCode.start_date).toLocaleDateString()} - 
                {promoCode.expiry_date 
                  ? new Date(promoCode.expiry_date).toLocaleDateString() 
                  : 'No expiration'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Created On</p>
              <p className="font-medium">
                {new Date(promoCode.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 col-span-3 md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Tag className="mr-2 h-5 w-5 text-blue-600" />
                  Basic Information
                </h2>
                
                <div className="space-y-2">
                  <Label htmlFor="code">Code <span className="text-red-500">*</span></Label>
                  <Input
                    id="code"
                    name="code"
                    value={formData.code || ''}
                    onChange={handleChange}
                    placeholder="SUMMER2023"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                    placeholder="Summer discount for all customers"
                    required
                  />
                </div>
                
                <div className="flex gap-4">
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="type">Discount Type <span className="text-red-500">*</span></Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleSelectChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={PromoCodeType.PERCENTAGE}>Percentage</SelectItem>
                        <SelectItem value={PromoCodeType.FIXED_AMOUNT}>Fixed Amount</SelectItem>
                        <SelectItem value={PromoCodeType.FREE_DELIVERY}>Free Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="value">Value <span className="text-red-500">*</span></Label>
                    <Input
                      id="value"
                      name="value"
                      type="number"
                      min={0}
                      step={formData.type === PromoCodeType.PERCENTAGE ? 1 : 0.01}
                      max={formData.type === PromoCodeType.PERCENTAGE ? 100 : undefined}
                      value={formData.value?.toString() || ''}
                      onChange={handleChange}
                      placeholder={formData.type === PromoCodeType.PERCENTAGE ? "10" : "5.00"}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PromoCodeStatus.ACTIVE}>Active</SelectItem>
                      <SelectItem value={PromoCodeStatus.PAUSED}>Paused</SelectItem>
                      <SelectItem value={PromoCodeStatus.EXPIRED}>Expired</SelectItem>
                      <SelectItem value={PromoCodeStatus.DEPLETED}>Depleted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Conditions & Limits */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-green-600" />
                  Conditions & Limits
                </h2>
                
                <div className="space-y-2">
                  <Label htmlFor="min_order_amount">Minimum Order Amount</Label>
                  <Input
                    id="min_order_amount"
                    name="min_order_amount"
                    type="number"
                    min={0}
                    step={0.01}
                    value={formData.min_order_amount?.toString() || ''}
                    onChange={handleChange}
                    placeholder="20.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max_discount_amount">Maximum Discount Amount</Label>
                  <Input
                    id="max_discount_amount"
                    name="max_discount_amount"
                    type="number"
                    min={0}
                    step={0.01}
                    value={formData.max_discount_amount?.toString() || ''}
                    onChange={handleChange}
                    placeholder="50.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="usage_limit">Usage Limit</Label>
                  <Input
                    id="usage_limit"
                    name="usage_limit"
                    type="number"
                    min={1}
                    step={1}
                    value={formData.usage_limit?.toString() || ''}
                    onChange={handleChange}
                    placeholder="100"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Current usage: {promoCode.usage_count}</span>
                    <span>Leave empty for unlimited</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer_type">Customer Type</Label>
                  <Input
                    id="customer_type"
                    name="customer_type"
                    value={formData.customer_type || ''}
                    onChange={handleChange}
                    placeholder="new, returning, business"
                  />
                </div>
              </div>
            </div>
            
            {/* Dates */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-purple-600" />
                Validity Period
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date <span className="text-red-500">*</span></Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={formData.start_date || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expiry_date">Expiry Date</Label>
                  <Input
                    id="expiry_date"
                    name="expiry_date"
                    type="date"
                    value={formData.expiry_date || ''}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-gray-500">Leave empty for no expiration</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
              <Link href="/admin/marketing">
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}