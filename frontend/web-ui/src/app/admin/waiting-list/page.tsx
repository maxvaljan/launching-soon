'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Download, RefreshCw, Mail, User, Calendar, Tag, Users } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface WaitingListEntry {
  id: string;
  email: string;
  created_at: string;
  source: string;
  utm_source: string | null;
  referral_code: string;
  referrer_id: string | null;
  referral_count: number;
}

export default function AdminWaitingListPage() {
  const [waitingList, setWaitingList] = useState<WaitingListEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState('');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchWaitingList();
  }, []);

  const fetchWaitingList = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/waiting-list');
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Unauthorized: You do not have permission to view this data');
        }
        throw new Error('Failed to fetch waiting list data');
      }

      const data = await response.json();
      setWaitingList(data);
      toast.success('Waiting list data loaded successfully');
    } catch (err: any) {
      console.error('Error fetching waiting list:', err);
      setError(err.message || 'Failed to load waiting list data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const exportCSV = () => {
    // Escape CSV values properly
    const escapeCSV = (value: string | number | null) => {
      if (value === null || value === undefined) return '';
      const strValue = String(value);
      // If value contains commas, quotes, or newlines, wrap in quotes and escape quotes
      if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
        return `"${strValue.replace(/"/g, '""')}"`;
      }
      return strValue;
    };

    const headers = ['Email', 'Signup Date', 'Source', 'UTM Source', 'Referral Code', 'Referrer ID', 'Referral Count'];
    const csvData = [
      headers.join(','),
      ...filteredWaitingList.map(entry => [
        escapeCSV(entry.email), 
        escapeCSV(format(new Date(entry.created_at), 'yyyy-MM-dd HH:mm:ss')),
        escapeCSV(entry.source),
        escapeCSV(entry.utm_source),
        escapeCSV(entry.referral_code),
        escapeCSV(entry.referrer_id),
        escapeCSV(entry.referral_count)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maxmove-waiting-list-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('CSV exported successfully');
  };

  const filteredWaitingList = waitingList.filter(entry => 
    entry.email.toLowerCase().includes(filterValue.toLowerCase()) ||
    entry.source.toLowerCase().includes(filterValue.toLowerCase()) ||
    (entry.utm_source && entry.utm_source.toLowerCase().includes(filterValue.toLowerCase()))
  );

  const sortedWaitingList = [...filteredWaitingList].sort((a, b) => {
    if (sortBy === 'created_at') {
      return sortDirection === 'asc' 
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sortBy === 'referral_count') {
      return sortDirection === 'asc' 
        ? a.referral_count - b.referral_count 
        : b.referral_count - a.referral_count;
    } else {
      const aValue = a[sortBy as keyof WaitingListEntry] || '';
      const bValue = b[sortBy as keyof WaitingListEntry] || '';
      return sortDirection === 'asc' 
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    }
  });

  // Analytics
  const totalSignups = waitingList.length;
  const totalReferrals = waitingList.reduce((sum, entry) => sum + entry.referral_count, 0);
  const topReferrers = [...waitingList]
    .sort((a, b) => b.referral_count - a.referral_count)
    .filter(entry => entry.referral_count > 0)
    .slice(0, 5);
    
  // Source breakdown
  const sourceCounts = waitingList.reduce((acc: Record<string, number>, entry) => {
    acc[entry.source] = (acc[entry.source] || 0) + 1;
    return acc;
  }, {});
  
  const sourceBreakdown = Object.entries(sourceCounts)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-600">Loading waiting list data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
            <p>{error}</p>
          </div>
          <Button onClick={fetchWaitingList}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Waiting List Dashboard</h1>
      <p className="text-gray-500 mb-8">Manage and monitor your pre-launch waiting list</p>
      
      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Mail className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">Total Signups</h3>
              <p className="text-3xl font-bold text-blue-600">{totalSignups}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-purple-700" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">Total Referrals</h3>
              <p className="text-3xl font-bold text-purple-600">{totalReferrals}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-teal-100 p-3 rounded-full">
              <Tag className="h-6 w-6 text-teal-700" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">Conversion Rate</h3>
              <p className="text-3xl font-bold text-teal-600">
                {totalSignups > 0 ? `${Math.round((totalReferrals / totalSignups) * 100)}%` : '0%'}
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Analysis Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Top Referrers */}
        <div className="md:col-span-2">
          <Card className="bg-white shadow-sm h-full">
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium text-gray-700">Top Referrers</h3>
            </div>
            <div className="p-6">
              {topReferrers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Signed Up</TableHead>
                      <TableHead className="text-right">Referrals</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topReferrers.map(referrer => (
                      <TableRow key={referrer.id}>
                        <TableCell className="font-medium">{referrer.email}</TableCell>
                        <TableCell className="text-gray-500">
                          {format(new Date(referrer.created_at), 'PP')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary" className="font-bold bg-purple-100 text-purple-700">
                            {referrer.referral_count}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                  <Users className="h-12 w-12 text-gray-300 mb-2" />
                  <p>No referrals yet</p>
                </div>
              )}
            </div>
          </Card>
        </div>
        
        {/* Sources Breakdown */}
        <div>
          <Card className="bg-white shadow-sm h-full">
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium text-gray-700">Sign-up Sources</h3>
            </div>
            <div className="p-6">
              {sourceBreakdown.length > 0 ? (
                <div className="space-y-4">
                  {sourceBreakdown.map(({ source, count }) => (
                    <div key={source} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2">{source}</Badge>
                        <span className="text-sm text-gray-500">
                          {Math.round((count / totalSignups) * 100)}%
                        </span>
                      </div>
                      <span className="font-semibold text-gray-700">{count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500">No data available</p>
              )}
              
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-4">Actions</h4>
                <div className="space-y-3">
                  <Button onClick={exportCSV} className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button onClick={fetchWaitingList} variant="secondary" className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Data
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Waiting List Table */}
      <Card className="bg-white shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-medium text-gray-700">Complete Waiting List</h3>
          <div className="w-full sm:w-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search emails, sources..."
              value={filterValue}
              onChange={e => setFilterValue(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Email
                    {sortBy === 'email' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Signup Date
                    {sortBy === 'created_at' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('source')}
                >
                  Source
                  {sortBy === 'source' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </TableHead>
                <TableHead>UTM Source</TableHead>
                <TableHead className="hidden md:table-cell">Referred By</TableHead>
                <TableHead 
                  className="cursor-pointer text-right"
                  onClick={() => handleSort('referral_count')}
                >
                  <div className="flex items-center justify-end">
                    Referrals
                    {sortBy === 'referral_count' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedWaitingList.map(entry => {
                const referrer = entry.referrer_id 
                  ? waitingList.find(item => item.id === entry.referrer_id) 
                  : null;
                  
                return (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.email}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(entry.created_at), 'PPp')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{entry.source}</Badge>
                    </TableCell>
                    <TableCell>{entry.utm_source || '-'}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {referrer ? (
                        <span className="text-blue-600 text-sm">{referrer.email}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {entry.referral_count > 0 ? (
                        <Badge variant="secondary" className="font-bold bg-purple-100 text-purple-700">
                          {entry.referral_count}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {sortedWaitingList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                    {filterValue ? (
                      <>
                        <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No entries match your search</p>
                      </>
                    ) : (
                      <>
                        <Mail className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No waiting list entries found</p>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-4 border-t">
          <p className="text-sm text-gray-500">
            Showing {sortedWaitingList.length} of {totalSignups} entries
            {filterValue && ` (filtered from ${totalSignups})`}
          </p>
        </div>
      </Card>
    </div>
  );
}