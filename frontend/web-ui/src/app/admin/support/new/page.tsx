'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { 
  SupportTicket, 
  TicketStatus, 
  TicketPriority, 
  TicketType, 
  adminService 
} from '@/lib/services/admin';
import { supabase } from '@/lib/supabase';

export default function CreateTicketPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<{id: string, name: string, email: string}[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [ticketData, setTicketData] = useState({
    subject: '',
    description: '',
    priority: TicketPriority.MEDIUM,
    type: TicketType.GENERAL_INQUIRY
  });
  
  useEffect(() => {
    fetchCustomers();
  }, []);
  
  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email')
        .in('role', ['customer', 'business'])
        .order('name');
        
      if (error) throw error;
      
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
    }
  };
  
  const handleChange = (field: string, value: string) => {
    setTicketData({
      ...ticketData,
      [field]: value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCustomer) {
      toast.error('Please select a customer');
      return;
    }
    
    if (!ticketData.subject || !ticketData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      
      await adminService.createTicket({
        customer_id: selectedCustomer,
        subject: ticketData.subject,
        description: ticketData.description,
        status: TicketStatus.OPEN,
        priority: ticketData.priority as TicketPriority,
        type: ticketData.type as TicketType
      });
      
      toast.success('Support ticket created successfully');
      router.push('/admin/support');
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Failed to create ticket');
      setLoading(false);
    }
  };
  
  return (
    <div className="p-8">
      <Button variant="outline" onClick={() => router.push('/admin/support')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Tickets
      </Button>
      
      <h1 className="text-2xl font-bold mb-6">Create New Support Ticket</h1>
      
      <Card className="p-6 max-w-3xl">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name} ({customer.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <Input
              type="text"
              value={ticketData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              placeholder="Brief summary of the issue"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <Textarea
              value={ticketData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Detailed description of the issue or request"
              className="min-h-[150px]"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <Select 
                value={ticketData.priority} 
                onValueChange={(value) => handleChange('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TicketPriority.LOW}>Low</SelectItem>
                  <SelectItem value={TicketPriority.MEDIUM}>Medium</SelectItem>
                  <SelectItem value={TicketPriority.HIGH}>High</SelectItem>
                  <SelectItem value={TicketPriority.URGENT}>Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <Select 
                value={ticketData.type} 
                onValueChange={(value) => handleChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TicketType.GENERAL_INQUIRY}>General Inquiry</SelectItem>
                  <SelectItem value={TicketType.TECHNICAL_ISSUE}>Technical Issue</SelectItem>
                  <SelectItem value={TicketType.BILLING_ISSUE}>Billing Issue</SelectItem>
                  <SelectItem value={TicketType.FEATURE_REQUEST}>Feature Request</SelectItem>
                  <SelectItem value={TicketType.COMPLAINT}>Complaint</SelectItem>
                  <SelectItem value={TicketType.OTHER}>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="button" variant="outline" className="mr-2" onClick={() => router.push('/admin/support')}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Ticket'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}