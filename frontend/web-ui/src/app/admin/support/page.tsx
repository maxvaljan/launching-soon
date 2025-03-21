'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
import { Card } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  SupportTicket, 
  TicketStatus, 
  TicketPriority, 
  TicketType, 
  adminService 
} from '@/lib/services/admin';
import { 
  MoreHorizontal, 
  Search, 
  Filter, 
  Plus, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  XCircle 
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSupportPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [stats, setStats] = useState({
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    totalTickets: 0,
    averageResolutionTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  useEffect(() => {
    fetchTicketsAndStats();
  }, []);

  const fetchTicketsAndStats = async () => {
    try {
      setLoading(true);
      const [ticketsData, statsData] = await Promise.all([
        adminService.getTickets(),
        adminService.getTicketStats()
      ]);
      
      setTickets(ticketsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching support data:', error);
      toast.error('Failed to load support data');
    } finally {
      setLoading(false);
    }
  };

  const handleTicketAction = async (action: string, ticketId: string) => {
    try {
      switch (action) {
        case 'view':
          router.push(`/admin/support/${ticketId}`);
          break;
        case 'resolve':
          await adminService.updateTicket(ticketId, { status: TicketStatus.RESOLVED });
          toast.success('Ticket marked as resolved');
          fetchTicketsAndStats();
          break;
        case 'close':
          await adminService.updateTicket(ticketId, { status: TicketStatus.CLOSED });
          toast.success('Ticket closed');
          fetchTicketsAndStats();
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

  const getStatusBadgeClass = (status: TicketStatus) => {
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

  const getPriorityBadgeClass = (priority: TicketPriority) => {
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

  const getTicketTypeDisplay = (type: TicketType) => {
    switch (type) {
      case TicketType.GENERAL_INQUIRY:
        return 'General Inquiry';
      case TicketType.TECHNICAL_ISSUE:
        return 'Technical Issue';
      case TicketType.BILLING_ISSUE:
        return 'Billing Issue';
      case TicketType.FEATURE_REQUEST:
        return 'Feature Request';
      case TicketType.COMPLAINT:
        return 'Complaint';
      case TicketType.OTHER:
        return 'Other';
      default:
        return 'Unknown';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.customer_email || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) {
    return <PageLoading message="Loading support tickets..." />;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Support Tickets</h1>
        <Link href="/admin/support/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Create Ticket
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-full mr-4">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Open Tickets</p>
              <h3 className="text-2xl font-semibold">{stats.open}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-full mr-4">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <h3 className="text-2xl font-semibold">{stats.inProgress}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-full mr-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Resolved</p>
              <h3 className="text-2xl font-semibold">{stats.resolved}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-full mr-4">
              <XCircle className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Closed</p>
              <h3 className="text-2xl font-semibold">{stats.closed}</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              className="border border-gray-300 rounded-md p-2 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value={TicketStatus.OPEN}>Open</option>
              <option value={TicketStatus.IN_PROGRESS}>In Progress</option>
              <option value={TicketStatus.RESOLVED}>Resolved</option>
              <option value={TicketStatus.CLOSED}>Closed</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              className="border border-gray-300 rounded-md p-2 text-sm"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value={TicketPriority.LOW}>Low</option>
              <option value={TicketPriority.MEDIUM}>Medium</option>
              <option value={TicketPriority.HIGH}>High</option>
              <option value={TicketPriority.URGENT}>Urgent</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow">
        <Table>
          <TableCaption>A list of all support tickets</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                    ? 'No tickets match your search or filter criteria.'
                    : 'No support tickets found in the system.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.id.slice(0, 8)}...</TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">{ticket.subject}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{ticket.customer_name || 'Unknown'}</span>
                      <span className="text-xs text-gray-500">{ticket.customer_email || 'No email'}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getTicketTypeDisplay(ticket.type)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityBadgeClass(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(ticket.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleTicketAction('view', ticket.id)}>
                          View Details
                        </DropdownMenuItem>
                        {ticket.status !== TicketStatus.RESOLVED && ticket.status !== TicketStatus.CLOSED && (
                          <DropdownMenuItem onClick={() => handleTicketAction('resolve', ticket.id)}>
                            Mark as Resolved
                          </DropdownMenuItem>
                        )}
                        {ticket.status !== TicketStatus.CLOSED && (
                          <DropdownMenuItem onClick={() => handleTicketAction('close', ticket.id)}>
                            Close Ticket
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Average Resolution Time */}
      {stats.averageResolutionTime > 0 && (
        <div className="mt-6 p-4 bg-white rounded-lg border shadow">
          <h3 className="text-lg font-medium mb-2">Performance Metrics</h3>
          <div className="flex flex-col">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Average Resolution Time:</span> {stats.averageResolutionTime.toFixed(1)} hours
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Total Tickets:</span> {stats.totalTickets}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}