'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageLoading } from '@/components/ui/loading';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Tag, 
  Users, 
  BarChart, 
  Mail, 
  Plus, 
  RefreshCw,
  Search,
  Filter,
  MoreHorizontal,
  Percent
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  PromoCode, 
  PromoCodeStatus, 
  PromoCodeType,
  Campaign,
  CustomerSegment,
  adminService 
} from '@/lib/services/admin';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

export default function AdminMarketingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('promo-codes');
  const [loading, setLoading] = useState(true);
  const [marketingStats, setMarketingStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalCustomers: 0,
    activePromoCodes: 0,
    totalSegments: 0
  });
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [promoSearchTerm, setPromoSearchTerm] = useState('');
  const [promoStatusFilter, setPromoStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchMarketingData();
  }, []);

  const fetchMarketingData = async () => {
    try {
      setLoading(true);
      const [stats, codes, campaignsData, segmentsData] = await Promise.all([
        adminService.getMarketingStats(),
        adminService.getPromoCodes(),
        adminService.getCampaigns(),
        adminService.getCustomerSegments()
      ]);
      
      setMarketingStats(stats);
      setPromoCodes(codes);
      setCampaigns(campaignsData);
      setSegments(segmentsData);
    } catch (error) {
      console.error('Error fetching marketing data:', error);
      toast.error('Failed to load marketing data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePromoCode = async (codeId: string) => {
    if (confirm('Are you sure you want to delete this promo code? This action cannot be undone.')) {
      try {
        await adminService.deletePromoCode(codeId);
        toast.success('Promo code deleted successfully');
        fetchMarketingData();
      } catch (error) {
        console.error('Error deleting promo code:', error);
        toast.error('Failed to delete promo code');
      }
    }
  };

  const handleUpdatePromoStatus = async (codeId: string, status: PromoCodeStatus) => {
    try {
      await adminService.updatePromoCode(codeId, { status });
      toast.success(`Promo code ${status === PromoCodeStatus.ACTIVE ? 'activated' : 'paused'} successfully`);
      fetchMarketingData();
    } catch (error) {
      console.error('Error updating promo code status:', error);
      toast.error('Failed to update promo code status');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status: PromoCodeStatus) => {
    switch (status) {
      case PromoCodeStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case PromoCodeStatus.PAUSED:
        return 'bg-yellow-100 text-yellow-800';
      case PromoCodeStatus.EXPIRED:
        return 'bg-gray-100 text-gray-800';
      case PromoCodeStatus.DEPLETED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPromoTypeDisplay = (type: PromoCodeType, value: number) => {
    switch (type) {
      case PromoCodeType.PERCENTAGE:
        return `${value}% off`;
      case PromoCodeType.FIXED_AMOUNT:
        return `$${value.toFixed(2)} off`;
      case PromoCodeType.FREE_DELIVERY:
        return 'Free delivery';
      default:
        return `${value} ${type}`;
    }
  };

  const filteredPromoCodes = promoCodes.filter(code => {
    const matchesSearch = 
      code.code.toLowerCase().includes(promoSearchTerm.toLowerCase()) || 
      code.description.toLowerCase().includes(promoSearchTerm.toLowerCase());
    
    const matchesStatus = promoStatusFilter === 'all' || code.status === promoStatusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <PageLoading message="Loading marketing data..." />;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Marketing</h1>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={fetchMarketingData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-full mr-4">
              <Tag className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Promo Codes</p>
              <h3 className="text-xl font-semibold">{marketingStats.activePromoCodes}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-full mr-4">
              <BarChart className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Campaigns</p>
              <h3 className="text-xl font-semibold">{marketingStats.activeCampaigns}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-full mr-4">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Customers</p>
              <h3 className="text-xl font-semibold">{marketingStats.totalCustomers}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-amber-100 rounded-full mr-4">
              <Users className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Customer Segments</p>
              <h3 className="text-xl font-semibold">{marketingStats.totalSegments}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-full mr-4">
              <Mail className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Campaigns</p>
              <h3 className="text-xl font-semibold">{marketingStats.totalCampaigns}</h3>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Tabs for different marketing features */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="promo-codes">Promo Codes</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="segments">Customer Segments</TabsTrigger>
        </TabsList>
        
        {/* Promo Codes Tab */}
        <TabsContent value="promo-codes" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Promo Codes</h2>
            <Link href="/admin/marketing/promo-codes/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Promo Code
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search promo codes..."
                value={promoSearchTerm}
                onChange={(e) => setPromoSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                className="border border-gray-300 rounded-md p-2 text-sm"
                value={promoStatusFilter}
                onChange={(e) => setPromoStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value={PromoCodeStatus.ACTIVE}>Active</option>
                <option value={PromoCodeStatus.PAUSED}>Paused</option>
                <option value={PromoCodeStatus.EXPIRED}>Expired</option>
                <option value={PromoCodeStatus.DEPLETED}>Depleted</option>
              </select>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border shadow">
            <Table>
              <TableCaption>A list of all promo codes</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPromoCodes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      {promoSearchTerm || promoStatusFilter !== 'all'
                        ? 'No promo codes match your search or filter criteria.'
                        : 'No promo codes found in the system.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPromoCodes.map((code) => (
                    <TableRow key={code.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Percent className="h-4 w-4 mr-2 text-blue-500" />
                          {code.code}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{code.description}</TableCell>
                      <TableCell>{getPromoTypeDisplay(code.type, code.value)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(code.status)}`}>
                          {code.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {code.usage_count}{code.usage_limit ? `/${code.usage_limit}` : ''}
                      </TableCell>
                      <TableCell>{formatDate(code.expiry_date)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem 
                              onClick={() => router.push(`/admin/marketing/promo-codes/${code.id}`)}
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => router.push(`/admin/marketing/promo-codes/${code.id}`)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {code.status === PromoCodeStatus.ACTIVE ? (
                              <DropdownMenuItem onClick={() => handleUpdatePromoStatus(code.id, PromoCodeStatus.PAUSED)}>
                                Pause Code
                              </DropdownMenuItem>
                            ) : code.status === PromoCodeStatus.PAUSED ? (
                              <DropdownMenuItem onClick={() => handleUpdatePromoStatus(code.id, PromoCodeStatus.ACTIVE)}>
                                Activate Code
                              </DropdownMenuItem>
                            ) : null}
                            <DropdownMenuItem 
                              onClick={() => handleDeletePromoCode(code.id)}
                              className="text-red-600"
                            >
                              Delete
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
        </TabsContent>
        
        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Marketing Campaigns</h2>
            <Link href="/admin/marketing/campaigns/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Campaign
              </Button>
            </Link>
          </div>
          
          {campaigns.length === 0 ? (
            <Card className="p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No Marketing Campaigns</h3>
              <p className="text-gray-500 mb-4">You haven't created any marketing campaigns yet.</p>
              <Link href="/admin/marketing/campaigns/new">
                <Button>Create Your First Campaign</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="p-4">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">{campaign.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      campaign.status === 'active' ? 'bg-green-100 text-green-800' : 
                      campaign.status === 'draft' ? 'bg-gray-100 text-gray-800' : 
                      campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                      campaign.status === 'completed' ? 'bg-purple-100 text-purple-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{campaign.description}</p>
                  <div className="text-xs text-gray-500 mb-3">
                    <p>Audience: {campaign.audience}</p>
                    <p>Start: {formatDate(campaign.start_date)}</p>
                    {campaign.end_date && <p>End: {formatDate(campaign.end_date)}</p>}
                  </div>
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-gray-500">Conversions</p>
                      <p className="font-medium">{campaign.conversion_count}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Clicks</p>
                      <p className="font-medium">{campaign.click_count}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Impressions</p>
                      <p className="font-medium">{campaign.impression_count}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Customer Segments Tab */}
        <TabsContent value="segments" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Customer Segments</h2>
            <Link href="/admin/marketing/segments/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Segment
              </Button>
            </Link>
          </div>
          
          {segments.length === 0 ? (
            <Card className="p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No Customer Segments</h3>
              <p className="text-gray-500 mb-4">You haven't created any customer segments yet.</p>
              <Link href="/admin/marketing/segments/new">
                <Button>Create Your First Segment</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {segments.map((segment) => (
                <Card key={segment.id} className="p-4">
                  <h3 className="font-medium mb-2">{segment.name}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{segment.description}</p>
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-500">Created: {formatDate(segment.created_at)}</p>
                    <p className="font-medium">{segment.customer_count} customers</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}