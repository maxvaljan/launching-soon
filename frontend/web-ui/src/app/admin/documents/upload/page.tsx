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
  FileUp,
  FileText,
  Tag,
  Calendar
} from 'lucide-react';
import { 
  Document, 
  DocumentType,
  DocumentStatus,
  adminService 
} from '@/lib/services/admin';

export default function UploadDocumentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    description?: string;
    document_type: DocumentType;
    uploaded_by: string;
    entity_id?: string;
    entity_type?: string;
    tags?: string;
    expiry_date?: string;
  }>({
    name: '',
    description: '',
    document_type: DocumentType.OTHER,
    // In a real app, this would be the current user's ID
    uploaded_by: 'current-admin-user-id',
    entity_id: '',
    entity_type: '',
    tags: '',
    expiry_date: ''
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      return;
    }
    
    const file = e.target.files[0];
    
    // Validate file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds the 10MB limit');
      setSelectedFile(null);
      return;
    }
    
    // Update document name if not already set
    if (!formData.name.trim()) {
      setFormData({
        ...formData,
        name: file.name
      });
    }
    
    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (!selectedFile) {
        toast.error('Please select a file to upload');
        return;
      }
      
      if (!formData.name.trim()) {
        toast.error('Document name is required');
        return;
      }
      
      // Process tags into array
      const tags = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : undefined;
      
      // Upload the document
      await adminService.uploadDocument(
        {
          ...formData,
          tags,
          status: DocumentStatus.PENDING
        }, 
        selectedFile
      );
      
      toast.success('Document uploaded successfully');
      router.push('/admin/documents');
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      setLoading(false);
    }
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <Link href="/admin/documents" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Upload Document</h1>
      </div>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File Upload Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center">
                <FileUp className="mr-2 h-5 w-5 text-blue-600" />
                File Upload
              </h2>
              
              <div className="space-y-2">
                <Label htmlFor="file">Select File <span className="text-red-500">*</span></Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, PNG, JPG, DOC up to 10MB
                    </p>
                  </div>
                </div>
                {fileError && <p className="text-sm text-red-500">{fileError}</p>}
                {selectedFile && (
                  <div className="mt-2 p-2 bg-gray-50 rounded border flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(selectedFile.size)} - {selectedFile.type || 'Unknown type'}
                      </p>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedFile(null);
                        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                        if (fileInput) fileInput.value = '';
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Document Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center">
                <FileText className="mr-2 h-5 w-5 text-green-600" />
                Document Information
              </h2>
              
              <div className="space-y-2">
                <Label htmlFor="name">Document Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Invoice #12345"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of the document"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="document_type">Document Type <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.document_type}
                  onValueChange={(value) => handleSelectChange('document_type', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DocumentType.INVOICE}>Invoice</SelectItem>
                    <SelectItem value={DocumentType.CONTRACT}>Contract</SelectItem>
                    <SelectItem value={DocumentType.DRIVER_LICENSE}>Driver License</SelectItem>
                    <SelectItem value={DocumentType.VEHICLE_REGISTRATION}>Vehicle Registration</SelectItem>
                    <SelectItem value={DocumentType.INSURANCE}>Insurance</SelectItem>
                    <SelectItem value={DocumentType.TAX_DOCUMENT}>Tax Document</SelectItem>
                    <SelectItem value={DocumentType.OTHER}>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiry_date">Expiry Date</Label>
                <Input
                  id="expiry_date"
                  name="expiry_date"
                  type="date"
                  value={formData.expiry_date}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500">Leave empty if document doesn't expire</p>
              </div>
            </div>
          </div>
          
          {/* Additional Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Tag className="mr-2 h-5 w-5 text-purple-600" />
              Additional Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entity_type">Related To (Type)</Label>
                <Input
                  id="entity_type"
                  name="entity_type"
                  value={formData.entity_type}
                  onChange={handleChange}
                  placeholder="driver, customer, order, vehicle"
                />
                <p className="text-xs text-gray-500">Type of entity this document relates to</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="entity_id">Related To (ID)</Label>
                <Input
                  id="entity_id"
                  name="entity_id"
                  value={formData.entity_id}
                  onChange={handleChange}
                  placeholder="Entity ID (e.g., driver-123)"
                />
                <p className="text-xs text-gray-500">ID of the related entity</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="important, legal, driver-docs"
              />
              <p className="text-xs text-gray-500">Comma-separated list of tags</p>
            </div>
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <Link href="/admin/documents">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button type="submit" disabled={loading || !selectedFile}>
              {loading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}