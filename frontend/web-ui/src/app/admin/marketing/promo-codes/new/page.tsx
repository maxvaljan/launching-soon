'use client';

import { useState } from 'react';
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
  Users
} from 'lucide-react';
import { 
  PromoCode, 
  PromoCodeStatus,
  PromoCodeType,
  adminService 
} from '@/lib/services/admin';

export default function NewPromoCodePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<PromoCode>>({
    code: '',
    description: '',
    type: PromoCodeType.PERCENTAGE,
    value: 0,
    min_order_amount: undefined,
    max_discount_amount: undefined,
    usage_limit: undefined,
    status: PromoCodeStatus.ACTIVE,
    customer_id: undefined,
    customer_type: undefined,
    vehicle_type_id: undefined,
    start_date: new Date().toISOString().split('T')[0],
    expiry_date: undefined
  });

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
      setLoading(true);
      
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
      
      await adminService.createPromoCode(processedData as any);
      
      toast.success('Promo code created successfully');
      router.push('/admin/marketing');
    } catch (error) {
      console.error('Error creating promo code:', error);
      toast.error('Failed to create promo code');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <Link href="/admin/marketing" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create New Promo Code</h1>
      </div>
      
      <Card className="p-6">
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
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="SUMMER2023"
                  required
                />
                <p className="text-xs text-gray-500">Unique code that customers will enter at checkout</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
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
                  <p className="text-xs text-gray-500">
                    {formData.type === PromoCodeType.PERCENTAGE ? 'Percentage (0-100%)' : 
                     formData.type === PromoCodeType.FIXED_AMOUNT ? 'Amount in dollars' : 
                     'Set to 1 for free delivery'}
                  </p>
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
                <p className="text-xs text-gray-500">Minimum order amount to apply this promo code</p>
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
                <p className="text-xs text-gray-500">Maximum discount amount regardless of order total (for percentage discounts)</p>
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
                <p className="text-xs text-gray-500">Maximum number of times this code can be used (leave empty for unlimited)</p>
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
                <p className="text-xs text-gray-500">Optional: Limit to specific customer types</p>
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
                  value={formData.start_date?.toString().split('T')[0] || ''}
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
                  value={formData.expiry_date?.toString().split('T')[0] || ''}
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
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Promo Code'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}