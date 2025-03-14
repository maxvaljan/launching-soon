import { supabase } from '@/lib/supabase';

export interface Report {
  id: string;
  name: string;
  description: string;
  file_path: string;
}

export async function getReports(): Promise<Report[]> {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*');
    
    if (error) {
      console.error('Error fetching reports:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
}

export async function checkAdminStatus(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    return data?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

export async function uploadReport(file: File, reportName: string): Promise<boolean> {
  try {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('reports')
      .upload(`reports/${reportName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`, file);

    if (uploadError) {
      console.error('Error uploading report:', uploadError);
      return false;
    }

    const { error: dbError } = await supabase
      .from('reports')
      .insert({
        name: reportName,
        file_path: uploadData.path,
        file_type: 'application/pdf',
        description: reportName
      });

    if (dbError) {
      console.error('Error inserting report data:', dbError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error uploading report:', error);
    return false;
  }
}

export async function downloadReport(report: Report): Promise<void> {
  try {
    const { data, error } = await supabase.storage
      .from('reports')
      .download(report.file_path);

    if (error) {
      console.error('Error downloading report:', error);
      return;
    }

    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = report.name + '.pdf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading report:', error);
  }
}

export function getReportUrl(reportName: string): string {
  switch (reportName) {
    case 'BMVI Report':
      return 'https://xuehdmslktlsgpoexilo.supabase.co/storage/v1/object/public/reports//BMVI%20Innovationsprogramm%20Logistik%202030.pdf';
    case 'Deloitte Analysis':
      return 'https://xuehdmslktlsgpoexilo.supabase.co/storage/v1/object/public/reports//Deloitte Consulting Global Smart Last-Mile Logistics Outlook.pdf';
    case 'McKinsey Report':
      return 'https://xuehdmslktlsgpoexilo.supabase.co/storage/v1/object/public/reports//Mckinsey Digitizing mid- and last-mile logistics handovers to reduce waste.pdf';
    default:
      return '';
  }
}