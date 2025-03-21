'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageLoading } from '@/components/ui/loading';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  FileText, 
  File, 
  FileCog, 
  FileCheck, 
  FileX, 
  Clock, 
  Plus, 
  MoreHorizontal, 
  RefreshCw,
  Download,
  Eye,
  BadgeCheck,
  BadgeX
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Document, 
  DocumentType, 
  DocumentStatus, 
  adminService 
} from '@/lib/services/admin';
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AdminDocumentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentStats, setDocumentStats] = useState({
    totalDocuments: 0,
    pendingVerification: 0,
    verified: 0,
    expired: 0,
    rejected: 0,
    documentTypeBreakdown: [] as { type: string; count: number }[]
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const [documents, stats] = await Promise.all([
        adminService.getDocuments(),
        adminService.getDocumentStats()
      ]);
      
      setDocuments(documents);
      setDocumentStats(stats);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDocument = async (documentId: string) => {
    try {
      await adminService.updateDocumentStatus(
        documentId, 
        DocumentStatus.VERIFIED, 
        // In a real app, get the current user's ID
        'current-admin-user-id'
      );
      toast.success('Document verified successfully');
      fetchDocuments();
    } catch (error) {
      console.error('Error verifying document:', error);
      toast.error('Failed to verify document');
    }
  };

  const handleRejectDocument = async (documentId: string) => {
    try {
      await adminService.updateDocumentStatus(documentId, DocumentStatus.REJECTED);
      toast.success('Document rejected');
      fetchDocuments();
    } catch (error) {
      console.error('Error rejecting document:', error);
      toast.error('Failed to reject document');
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      try {
        await adminService.deleteDocument(documentId);
        toast.success('Document deleted successfully');
        fetchDocuments();
      } catch (error) {
        console.error('Error deleting document:', error);
        toast.error('Failed to delete document');
      }
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDocumentTypeDisplay = (type: DocumentType) => {
    switch (type) {
      case DocumentType.INVOICE:
        return 'Invoice';
      case DocumentType.CONTRACT:
        return 'Contract';
      case DocumentType.DRIVER_LICENSE:
        return 'Driver License';
      case DocumentType.VEHICLE_REGISTRATION:
        return 'Vehicle Registration';
      case DocumentType.INSURANCE:
        return 'Insurance';
      case DocumentType.TAX_DOCUMENT:
        return 'Tax Document';
      case DocumentType.OTHER:
        return 'Other';
      default:
        return type;
    }
  };

  const getStatusBadgeClass = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case DocumentStatus.VERIFIED:
        return 'bg-green-100 text-green-800';
      case DocumentStatus.EXPIRED:
        return 'bg-gray-100 text-gray-800';
      case DocumentStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else if (fileType.includes('image')) {
      return <File className="h-5 w-5 text-blue-500" />;
    } else if (fileType.includes('word') || fileType.includes('doc')) {
      return <File className="h-5 w-5 text-indigo-500" />;
    } else if (fileType.includes('excel') || fileType.includes('sheet') || fileType.includes('csv')) {
      return <File className="h-5 w-5 text-green-500" />;
    } else {
      return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (doc.uploader_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesType = typeFilter === 'all' || doc.document_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading) {
    return <PageLoading message="Loading documents..." />;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Document Management</h1>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={fetchDocuments}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Link href="/admin/documents/upload">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-full mr-4">
              <File className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Documents</p>
              <h3 className="text-xl font-semibold">{documentStats.totalDocuments}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-full mr-4">
              <FileCog className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Verification</p>
              <h3 className="text-xl font-semibold">{documentStats.pendingVerification}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-full mr-4">
              <FileCheck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Verified Documents</p>
              <h3 className="text-xl font-semibold">{documentStats.verified}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-full mr-4">
              <FileX className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Rejected Documents</p>
              <h3 className="text-xl font-semibold">{documentStats.rejected}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-full mr-4">
              <Clock className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Expired Documents</p>
              <h3 className="text-xl font-semibold">{documentStats.expired}</h3>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value={DocumentStatus.PENDING}>Pending</SelectItem>
              <SelectItem value={DocumentStatus.VERIFIED}>Verified</SelectItem>
              <SelectItem value={DocumentStatus.EXPIRED}>Expired</SelectItem>
              <SelectItem value={DocumentStatus.REJECTED}>Rejected</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={typeFilter}
            onValueChange={setTypeFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value={DocumentType.INVOICE}>Invoices</SelectItem>
              <SelectItem value={DocumentType.CONTRACT}>Contracts</SelectItem>
              <SelectItem value={DocumentType.DRIVER_LICENSE}>Driver Licenses</SelectItem>
              <SelectItem value={DocumentType.VEHICLE_REGISTRATION}>Vehicle Registrations</SelectItem>
              <SelectItem value={DocumentType.INSURANCE}>Insurance</SelectItem>
              <SelectItem value={DocumentType.TAX_DOCUMENT}>Tax Documents</SelectItem>
              <SelectItem value={DocumentType.OTHER}>Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Documents Table */}
      <div className="bg-white rounded-lg border shadow">
        <Table>
          <TableCaption>A list of all documents in the system</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                    ? 'No documents match your search or filter criteria.'
                    : 'No documents found in the system.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredDocuments.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <div className="flex items-center">
                      {getFileIcon(document.file_type)}
                      <div className="ml-2">
                        <p className="font-medium line-clamp-1">{document.name}</p>
                        {document.description && (
                          <p className="text-xs text-gray-500 line-clamp-1">{document.description}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getDocumentTypeDisplay(document.document_type)}</TableCell>
                  <TableCell>{document.uploader_name || 'Unknown'}</TableCell>
                  <TableCell>{formatDate(document.created_at)}</TableCell>
                  <TableCell>{formatFileSize(document.file_size)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(document.status)}`}>
                      {document.status}
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
                        <DropdownMenuItem onClick={() => window.open(document.file_path, '_blank')}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Document
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          // Create an anchor element to download the file
                          const a = document.createElement('a');
                          a.href = document.file_path;
                          a.download = document.name;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        }}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {document.status === DocumentStatus.PENDING && (
                          <>
                            <DropdownMenuItem onClick={() => handleVerifyDocument(document.id)}>
                              <BadgeCheck className="h-4 w-4 mr-2 text-green-500" />
                              Verify Document
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRejectDocument(document.id)}>
                              <BadgeX className="h-4 w-4 mr-2 text-red-500" />
                              Reject Document
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteDocument(document.id)}
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
    </div>
  );
}