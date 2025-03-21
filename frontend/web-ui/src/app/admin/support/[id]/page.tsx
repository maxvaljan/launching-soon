'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageLoading } from '@/components/ui/loading';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  SupportTicket,
  TicketMessage,
  TicketStatus,
  TicketPriority,
  TicketType,
  adminService
} from '@/lib/services/admin';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Clock,
  Send,
  User,
  Tag,
  CheckCircle,
  MessageSquare,
  UserPlus,
  Calendar,
  AlertCircle,
  Paperclip
} from 'lucide-react';

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const ticketId = params.id;
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [adminUsers, setAdminUsers] = useState<{id: string, name: string}[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [updatedTicket, setUpdatedTicket] = useState<Partial<SupportTicket>>({});
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    fetchTicketData();
    fetchAdminUsers();
  }, [ticketId]);
  
  useEffect(() => {
    // Scroll to bottom of messages when they update
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchTicketData = async () => {
    try {
      setLoading(true);
      const [ticketData, messagesData] = await Promise.all([
        adminService.getTicketById(ticketId),
        adminService.getTicketMessages(ticketId)
      ]);
      
      setTicket(ticketData);
      setMessages(messagesData);
    } catch (error) {
      console.error('Error fetching ticket data:', error);
      toast.error('Failed to load ticket data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name')
        .eq('role', 'admin');
        
      if (error) throw error;
      
      setAdminUsers(data || []);
    } catch (error) {
      console.error('Error fetching admin users:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !ticket) return;
    
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user || !user.user) {
        toast.error('You must be logged in to send messages');
        return;
      }

      await adminService.addTicketMessage({
        ticket_id: ticketId,
        sender_id: user.user.id,
        message: newMessage,
        is_internal: isInternal
      });
      
      setNewMessage('');
      
      // If this is the first response and ticket is open, update to in progress
      if (ticket.status === TicketStatus.OPEN && messages.length === 0) {
        await adminService.updateTicket(ticketId, { 
          status: TicketStatus.IN_PROGRESS,
          assigned_to: user.user.id
        });
      }
      
      fetchTicketData();
      toast.success('Message sent');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleUpdateTicket = async () => {
    if (!ticket) return;
    
    try {
      await adminService.updateTicket(ticketId, updatedTicket);
      
      // If status changed to resolved, show a confirmation
      if (updatedTicket.status === TicketStatus.RESOLVED) {
        toast.success('Ticket marked as resolved');
      } else {
        toast.success('Ticket updated successfully');
      }
      
      setEditMode(false);
      fetchTicketData();
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error('Failed to update ticket');
    }
  };

  const handleAssignTicket = async (assigneeId: string) => {
    if (!ticket) return;
    
    try {
      await adminService.assignTicket(ticketId, assigneeId);
      toast.success('Ticket assigned successfully');
      fetchTicketData();
    } catch (error) {
      console.error('Error assigning ticket:', error);
      toast.error('Failed to assign ticket');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN:
        return 'bg-blue-100 text-blue-800';
      case TicketStatus.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-800';
      case TicketStatus.RESOLVED:
        return 'bg-green-100 text-green-800';
      case TicketStatus.CLOSED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.LOW:
        return 'bg-gray-100 text-gray-800';
      case TicketPriority.MEDIUM:
        return 'bg-blue-100 text-blue-800';
      case TicketPriority.HIGH:
        return 'bg-orange-100 text-orange-800';
      case TicketPriority.URGENT:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <PageLoading message="Loading ticket details..." />;
  }

  if (!ticket) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Ticket Not Found</h2>
          <p className="text-gray-600 mb-4">The ticket you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => router.push('/admin/support')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Support Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.push('/admin/support')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tickets
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold">{ticket.subject}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-sm text-gray-500">Ticket #{ticketId.slice(0, 8)}</span>
              <span className="text-sm text-gray-500">•</span>
              <Badge className={getStatusColor(ticket.status)}>{ticket.status.replace('_', ' ')}</Badge>
              <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-2">
            {!editMode ? (
              <Button onClick={() => setEditMode(true)}>Edit Ticket</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                <Button onClick={handleUpdateTicket}>Save Changes</Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Ticket details and messages */}
        <div className="md:col-span-2">
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Ticket Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{ticket.description}</p>
          </Card>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Conversation</h2>
            
            <div className="bg-gray-50 border rounded-lg p-4 mb-4 max-h-[500px] overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No messages yet</p>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`p-3 rounded-lg ${
                        message.is_internal 
                          ? 'bg-yellow-50 border-yellow-200 border' 
                          : 'bg-white border shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-full mr-2">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{message.sender_name || 'Unknown'}</p>
                            <p className="text-xs text-gray-500">{message.sender_role || 'User'}</p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(message.created_at)}
                        </div>
                      </div>
                      
                      {message.is_internal && (
                        <div className="mb-2">
                          <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                            Internal Note
                          </span>
                        </div>
                      )}
                      
                      <p className="text-gray-700 whitespace-pre-line">{message.message}</p>
                    </div>
                  ))}
                  <div ref={messageEndRef} />
                </div>
              )}
            </div>
            
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center mb-2">
                <label className="flex items-center text-sm">
                  <input 
                    type="checkbox" 
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                    className="mr-2"
                  />
                  Internal note (not visible to customer)
                </label>
              </div>
              
              <Textarea
                placeholder="Type your message here..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="mb-3 min-h-[100px]"
              />
              
              <div className="flex justify-between items-center">
                <Button variant="outline" disabled className="opacity-50 cursor-not-allowed">
                  <Paperclip className="mr-2 h-4 w-4" />
                  Attach File
                </Button>
                
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Ticket details and actions */}
        <div>
          {/* Customer Information */}
          <Card className="p-4 mb-4">
            <h3 className="font-medium mb-3">Customer Information</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-500 mr-2" />
                <span>{ticket.customer_name || 'Unknown'}</span>
              </div>
              {ticket.customer_email && (
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 text-gray-500 mr-2" />
                  <span>{ticket.customer_email}</span>
                </div>
              )}
            </div>
          </Card>
          
          {/* Ticket Details */}
          <Card className="p-4 mb-4">
            <h3 className="font-medium mb-3">Ticket Details</h3>
            <div className="space-y-3">
              {/* Created At */}
              <div className="flex items-start">
                <Calendar className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p>{formatDate(ticket.created_at)}</p>
                </div>
              </div>
              
              {/* Updated At */}
              <div className="flex items-start">
                <Clock className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Updated</p>
                  <p>{formatDate(ticket.updated_at)}</p>
                </div>
              </div>
              
              {/* Resolved At (if applicable) */}
              {ticket.resolved_at && (
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Resolved</p>
                    <p>{formatDate(ticket.resolved_at)}</p>
                  </div>
                </div>
              )}
              
              {/* Assigned To */}
              <div className="flex items-start">
                <UserPlus className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Assigned To</p>
                  <p>{ticket.assignee_name || 'Unassigned'}</p>
                </div>
              </div>
              
              {/* Ticket Type */}
              <div className="flex items-start">
                <Tag className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p>{ticket.type.replace(/_/g, ' ')}</p>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Actions */}
          {editMode ? (
            <Card className="p-4 mb-4">
              <h3 className="font-medium mb-3">Edit Ticket</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select 
                    className="w-full border-gray-300 rounded-md shadow-sm p-2"
                    value={updatedTicket.status || ticket.status}
                    onChange={(e) => setUpdatedTicket({...updatedTicket, status: e.target.value as TicketStatus})}
                  >
                    <option value={TicketStatus.OPEN}>Open</option>
                    <option value={TicketStatus.IN_PROGRESS}>In Progress</option>
                    <option value={TicketStatus.RESOLVED}>Resolved</option>
                    <option value={TicketStatus.CLOSED}>Closed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select 
                    className="w-full border-gray-300 rounded-md shadow-sm p-2"
                    value={updatedTicket.priority || ticket.priority}
                    onChange={(e) => setUpdatedTicket({...updatedTicket, priority: e.target.value as TicketPriority})}
                  >
                    <option value={TicketPriority.LOW}>Low</option>
                    <option value={TicketPriority.MEDIUM}>Medium</option>
                    <option value={TicketPriority.HIGH}>High</option>
                    <option value={TicketPriority.URGENT}>Urgent</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select 
                    className="w-full border-gray-300 rounded-md shadow-sm p-2"
                    value={updatedTicket.type || ticket.type}
                    onChange={(e) => setUpdatedTicket({...updatedTicket, type: e.target.value as TicketType})}
                  >
                    <option value={TicketType.GENERAL_INQUIRY}>General Inquiry</option>
                    <option value={TicketType.TECHNICAL_ISSUE}>Technical Issue</option>
                    <option value={TicketType.BILLING_ISSUE}>Billing Issue</option>
                    <option value={TicketType.FEATURE_REQUEST}>Feature Request</option>
                    <option value={TicketType.COMPLAINT}>Complaint</option>
                    <option value={TicketType.OTHER}>Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                  <select 
                    className="w-full border-gray-300 rounded-md shadow-sm p-2"
                    value={updatedTicket.assigned_to || ticket.assigned_to || ''}
                    onChange={(e) => setUpdatedTicket({...updatedTicket, assigned_to: e.target.value || undefined})}
                  >
                    <option value="">Unassigned</option>
                    {adminUsers.map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-4 mb-4">
              <h3 className="font-medium mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {ticket.status === TicketStatus.OPEN && (
                  <Button className="w-full" onClick={() => handleAssignTicket(adminUsers[0]?.id || '')}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Assign to Me
                  </Button>
                )}
                
                {(ticket.status === TicketStatus.OPEN || ticket.status === TicketStatus.IN_PROGRESS) && (
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => {
                      adminService.updateTicket(ticketId, { status: TicketStatus.RESOLVED });
                      fetchTicketData();
                      toast.success('Ticket marked as resolved');
                    }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Resolved
                  </Button>
                )}
                
                {ticket.status !== TicketStatus.CLOSED && (
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => {
                      adminService.updateTicket(ticketId, { status: TicketStatus.CLOSED });
                      fetchTicketData();
                      toast.success('Ticket closed');
                    }}
                  >
                    Close Ticket
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}