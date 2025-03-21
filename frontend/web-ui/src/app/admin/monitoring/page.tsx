'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageLoading } from '@/components/ui/loading';
import { Progress } from '@/components/ui/progress';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  AlertCircle, 
  Server, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  Database, 
  HardDrive, 
  Cpu, 
  ActivitySquare,
  CheckCircle2,
  XCircle,
  Disc,
  Globe,
  Memory,
  MoreHorizontal
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  SystemStatus, 
  AlertLevel, 
  SystemComponent, 
  SystemAlert, 
  SystemLog, 
  adminService 
} from '@/lib/services/admin';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

export default function AdminMonitoringPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [systemOverview, setSystemOverview] = useState<{
    components: { 
      total: number;
      healthy: number;
      degraded: number;
      down: number;
      maintenance: number;
    };
    alerts: {
      total: number;
      critical: number;
      error: number;
      warning: number;
      info: number;
    };
    logs: {
      total: number;
      error: number;
      warning: number;
      info: number;
      debug: number;
    };
    performance: {
      api_response_time: number;
      db_query_time: number;
      server_load: number;
      memory_usage: number;
    };
  } | null>(null);
  const [systemComponents, setSystemComponents] = useState<SystemComponent[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [showResolvedAlerts, setShowResolvedAlerts] = useState(false);
  const [logSearchTerm, setLogSearchTerm] = useState('');
  const [logSourceFilter, setLogSourceFilter] = useState('all');
  const [logLevelFilter, setLogLevelFilter] = useState('all');

  useEffect(() => {
    fetchSystemData();
    
    // Set up polling every 30 seconds for auto-refresh
    const intervalId = setInterval(() => {
      fetchSystemData();
    }, 30000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (activeTab === 'alerts') {
      fetchAlerts();
    } else if (activeTab === 'logs') {
      fetchLogs();
    }
  }, [activeTab, showResolvedAlerts]);

  const fetchSystemData = async () => {
    try {
      setRefreshing(true);
      const [overview, components, alerts, logs] = await Promise.all([
        adminService.getSystemOverview(),
        adminService.getSystemComponents(),
        adminService.getSystemAlerts(false),
        adminService.getSystemLogs(100)
      ]);
      
      setSystemOverview(overview);
      setSystemComponents(components);
      setSystemAlerts(alerts);
      setSystemLogs(logs);
    } catch (error) {
      console.error('Error fetching system data:', error);
      toast.error('Failed to load system monitoring data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const alerts = await adminService.getSystemAlerts(showResolvedAlerts);
      setSystemAlerts(alerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast.error('Failed to load system alerts');
    }
  };

  const fetchLogs = async () => {
    try {
      const source = logSourceFilter !== 'all' ? logSourceFilter : undefined;
      const level = logLevelFilter !== 'all' ? logLevelFilter : undefined;
      const logs = await adminService.getSystemLogs(100, source, level);
      setSystemLogs(logs);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error('Failed to load system logs');
    }
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      await adminService.acknowledgeAlert(alertId, 'current-admin-user-id');
      toast.success('Alert acknowledged');
      fetchAlerts();
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      toast.error('Failed to acknowledge alert');
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      await adminService.resolveAlert(alertId);
      toast.success('Alert resolved');
      fetchAlerts();
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast.error('Failed to resolve alert');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusIcon = (status: SystemStatus) => {
    switch (status) {
      case SystemStatus.HEALTHY:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case SystemStatus.DEGRADED:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case SystemStatus.DOWN:
        return <XCircle className="h-5 w-5 text-red-500" />;
      case SystemStatus.MAINTENANCE:
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusClass = (status: SystemStatus) => {
    switch (status) {
      case SystemStatus.HEALTHY:
        return 'bg-green-100 text-green-800';
      case SystemStatus.DEGRADED:
        return 'bg-yellow-100 text-yellow-800';
      case SystemStatus.DOWN:
        return 'bg-red-100 text-red-800';
      case SystemStatus.MAINTENANCE:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertLevelIcon = (level: AlertLevel) => {
    switch (level) {
      case AlertLevel.CRITICAL:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case AlertLevel.ERROR:
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case AlertLevel.WARNING:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case AlertLevel.INFO:
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAlertLevelClass = (level: AlertLevel) => {
    switch (level) {
      case AlertLevel.CRITICAL:
        return 'bg-red-100 text-red-800';
      case AlertLevel.ERROR:
        return 'bg-orange-100 text-orange-800';
      case AlertLevel.WARNING:
        return 'bg-yellow-100 text-yellow-800';
      case AlertLevel.INFO:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLogLevelClass = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'debug':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getComponentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'database':
        return <Database className="h-5 w-5" />;
      case 'server':
        return <Server className="h-5 w-5" />;
      case 'storage':
        return <HardDrive className="h-5 w-5" />;
      case 'service':
        return <Cpu className="h-5 w-5" />;
      case 'api':
        return <ActivitySquare className="h-5 w-5" />;
      case 'cache':
        return <Memory className="h-5 w-5" />;
      case 'cdn':
        return <Globe className="h-5 w-5" />;
      default:
        return <Disc className="h-5 w-5" />;
    }
  };

  const filteredLogs = systemLogs.filter(log => {
    return log.message.toLowerCase().includes(logSearchTerm.toLowerCase()) &&
      (logSourceFilter === 'all' || log.source === logSourceFilter) &&
      (logLevelFilter === 'all' || log.level === logLevelFilter);
  });

  if (loading) {
    return <PageLoading message="Loading system monitoring data..." />;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">System Monitoring</h1>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={fetchSystemData} 
            disabled={refreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>
      
      {/* Tabs for different monitoring views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* System Health Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Card className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-full mr-4">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Healthy Components</p>
                  <h3 className="text-xl font-semibold">{systemOverview?.components.healthy} / {systemOverview?.components.total}</h3>
                </div>
              </div>
              <Progress
                value={(systemOverview?.components.healthy || 0) / (systemOverview?.components.total || 1) * 100}
                className="h-2 mt-2"
              />
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-full mr-4">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Alerts</p>
                  <h3 className="text-xl font-semibold">{systemOverview?.alerts.total}</h3>
                </div>
              </div>
              <div className="flex mt-2 gap-1 text-xs">
                <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full">
                  Critical: {systemOverview?.alerts.critical}
                </div>
                <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                  Error: {systemOverview?.alerts.error}
                </div>
                <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  Warning: {systemOverview?.alerts.warning}
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-full mr-4">
                  <ActivitySquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">24h Log Entries</p>
                  <h3 className="text-xl font-semibold">{systemOverview?.logs.total}</h3>
                </div>
              </div>
              <div className="flex mt-2 gap-1 text-xs">
                <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full">
                  Error: {systemOverview?.logs.error}
                </div>
                <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  Warning: {systemOverview?.logs.warning}
                </div>
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Info: {systemOverview?.logs.info}
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-full mr-4">
                  <Cpu className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">System Load</p>
                  <h3 className="text-xl font-semibold">{(systemOverview?.performance.server_load || 0) * 100}%</h3>
                </div>
              </div>
              <Progress
                value={(systemOverview?.performance.server_load || 0) * 100}
                className="h-2 mt-2"
                indicatorColor={
                  (systemOverview?.performance.server_load || 0) > 0.9 ? 'bg-red-500' :
                  (systemOverview?.performance.server_load || 0) > 0.7 ? 'bg-yellow-500' :
                  'bg-green-500'
                }
              />
            </Card>
          </div>
          
          {/* Recent Alerts */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
            <Card className="p-4">
              {systemAlerts.length === 0 ? (
                <div className="text-center py-6">
                  <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
                  <p className="text-lg font-medium">No Active Alerts</p>
                  <p className="text-gray-500">All systems are operating normally.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {systemAlerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className={`p-3 rounded-md border-l-4 ${
                      alert.level === AlertLevel.CRITICAL ? 'border-red-500 bg-red-50' :
                      alert.level === AlertLevel.ERROR ? 'border-orange-500 bg-orange-50' :
                      alert.level === AlertLevel.WARNING ? 'border-yellow-500 bg-yellow-50' :
                      'border-blue-500 bg-blue-50'
                    }`}>
                      <div className="flex justify-between">
                        <div className="flex items-start">
                          {getAlertLevelIcon(alert.level)}
                          <div className="ml-2">
                            <h3 className="font-medium">{alert.title}</h3>
                            <p className="text-sm">{alert.message}</p>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <span>{formatDate(alert.created_at)}</span>
                              {alert.component_name && (
                                <>
                                  <span className="mx-1">•</span>
                                  <span>{alert.component_name}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          {!alert.acknowledged_at && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleAcknowledgeAlert(alert.id)}
                            >
                              Acknowledge
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {systemAlerts.length > 5 && (
                    <div className="text-center pt-2">
                      <Button 
                        variant="ghost" 
                        onClick={() => setActiveTab('alerts')}
                      >
                        View all {systemAlerts.length} alerts
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
          
          {/* Component Status */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Component Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {systemComponents.slice(0, 6).map((component) => (
                <Card key={component.id} className="p-4">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-4 ${
                      component.status === SystemStatus.HEALTHY ? 'bg-green-100' :
                      component.status === SystemStatus.DEGRADED ? 'bg-yellow-100' :
                      component.status === SystemStatus.DOWN ? 'bg-red-100' :
                      'bg-blue-100'
                    }`}>
                      {getComponentIcon(component.type)}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium">{component.name}</h3>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusClass(component.status)}`}>
                          {component.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{component.type}</p>
                      <p className="text-xs mt-1">
                        Uptime: {component.uptime_percentage.toFixed(2)}% • Last checked: {new Date(component.last_checked).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            {systemComponents.length > 6 && (
              <div className="text-center mt-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setActiveTab('components')}
                >
                  View all {systemComponents.length} components
                </Button>
              </div>
            )}
          </div>
          
          {/* Performance Metrics */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="font-medium mb-2">API Response Time</h3>
                <div className="flex items-end mb-2">
                  <p className="text-2xl font-semibold">{systemOverview?.performance.api_response_time || 0}ms</p>
                  <p className="text-sm text-gray-500 ml-2 mb-1">Average</p>
                </div>
                <Progress
                  value={Math.min(((systemOverview?.performance.api_response_time || 0) / 300) * 100, 100)}
                  className="h-2"
                  indicatorColor={
                    (systemOverview?.performance.api_response_time || 0) > 200 ? 'bg-red-500' :
                    (systemOverview?.performance.api_response_time || 0) > 150 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }
                />
              </Card>
              
              <Card className="p-4">
                <h3 className="font-medium mb-2">Database Query Time</h3>
                <div className="flex items-end mb-2">
                  <p className="text-2xl font-semibold">{systemOverview?.performance.db_query_time || 0}ms</p>
                  <p className="text-sm text-gray-500 ml-2 mb-1">Average</p>
                </div>
                <Progress
                  value={Math.min(((systemOverview?.performance.db_query_time || 0) / 100) * 100, 100)}
                  className="h-2"
                  indicatorColor={
                    (systemOverview?.performance.db_query_time || 0) > 75 ? 'bg-red-500' :
                    (systemOverview?.performance.db_query_time || 0) > 50 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }
                />
              </Card>
              
              <Card className="p-4">
                <h3 className="font-medium mb-2">Server Load</h3>
                <div className="flex items-end mb-2">
                  <p className="text-2xl font-semibold">{((systemOverview?.performance.server_load || 0) * 100).toFixed(1)}%</p>
                  <p className="text-sm text-gray-500 ml-2 mb-1">Current</p>
                </div>
                <Progress
                  value={(systemOverview?.performance.server_load || 0) * 100}
                  className="h-2"
                  indicatorColor={
                    (systemOverview?.performance.server_load || 0) > 0.9 ? 'bg-red-500' :
                    (systemOverview?.performance.server_load || 0) > 0.7 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }
                />
              </Card>
              
              <Card className="p-4">
                <h3 className="font-medium mb-2">Memory Usage</h3>
                <div className="flex items-end mb-2">
                  <p className="text-2xl font-semibold">{((systemOverview?.performance.memory_usage || 0) * 100).toFixed(1)}%</p>
                  <p className="text-sm text-gray-500 ml-2 mb-1">Current</p>
                </div>
                <Progress
                  value={(systemOverview?.performance.memory_usage || 0) * 100}
                  className="h-2"
                  indicatorColor={
                    (systemOverview?.performance.memory_usage || 0) > 0.9 ? 'bg-red-500' :
                    (systemOverview?.performance.memory_usage || 0) > 0.7 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }
                />
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Components Tab */}
        <TabsContent value="components" className="space-y-6">
          <div className="bg-white rounded-lg border shadow">
            <Table>
              <TableCaption>A list of all system components and their status</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Uptime</TableHead>
                  <TableHead>Last Checked</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {systemComponents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No components found in the system.
                    </TableCell>
                  </TableRow>
                ) : (
                  systemComponents.map((component) => (
                    <TableRow key={component.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="mr-2">
                            {getComponentIcon(component.type)}
                          </div>
                          <div>{component.name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{component.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getStatusIcon(component.status)}
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusClass(component.status)}`}>
                            {component.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={component.uptime_percentage} className="h-2 w-24" />
                          <span>{component.uptime_percentage.toFixed(2)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(component.last_checked)}</TableCell>
                      <TableCell className="max-w-md truncate">{component.notes || 'No notes'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">System Alerts</h2>
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 mr-2"
                  checked={showResolvedAlerts}
                  onChange={(e) => setShowResolvedAlerts(e.target.checked)}
                />
                <span className="text-sm text-gray-600">Show resolved alerts</span>
              </label>
            </div>
          </div>
          
          {systemAlerts.length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Active Alerts</h3>
              <p className="text-gray-500 mb-4">
                {showResolvedAlerts 
                  ? 'There are no alerts in the system.' 
                  : 'All systems are operating normally. Enable "Show resolved alerts" to see past issues.'}
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {systemAlerts.map((alert) => (
                <Card key={alert.id} className={`p-4 border-l-4 ${
                  alert.level === AlertLevel.CRITICAL ? 'border-red-500' :
                  alert.level === AlertLevel.ERROR ? 'border-orange-500' :
                  alert.level === AlertLevel.WARNING ? 'border-yellow-500' :
                  'border-blue-500'
                }`}>
                  <div className="flex justify-between">
                    <div className="flex">
                      {getAlertLevelIcon(alert.level)}
                      <div className="ml-3">
                        <div className="flex items-center">
                          <h3 className="font-semibold">{alert.title}</h3>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getAlertLevelClass(alert.level)}`}>
                            {alert.level}
                          </span>
                          {alert.resolved_at && (
                            <span className="ml-2 px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              Resolved
                            </span>
                          )}
                          {alert.acknowledged_at && !alert.resolved_at && (
                            <span className="ml-2 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                              Acknowledged
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                        <div className="flex flex-wrap items-center mt-2 text-xs text-gray-500">
                          <div>Created: {formatDate(alert.created_at)}</div>
                          {alert.component_name && (
                            <div className="ml-3">Component: {alert.component_name}</div>
                          )}
                          {alert.acknowledged_at && (
                            <div className="ml-3">
                              Acknowledged: {formatDate(alert.acknowledged_at)} 
                              {alert.acknowledger_name && ` by ${alert.acknowledger_name}`}
                            </div>
                          )}
                          {alert.resolved_at && (
                            <div className="ml-3">Resolved: {formatDate(alert.resolved_at)}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {!alert.resolved_at && (
                      <div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            {!alert.acknowledged_at && (
                              <DropdownMenuItem onClick={() => handleAcknowledgeAlert(alert.id)}>
                                Acknowledge
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleResolveAlert(alert.id)}>
                              Mark as Resolved
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="relative flex-1">
              <Input
                placeholder="Search logs..."
                value={logSearchTerm}
                onChange={(e) => setLogSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <select
                className="border border-gray-300 rounded-md p-2 text-sm"
                value={logSourceFilter}
                onChange={(e) => setLogSourceFilter(e.target.value)}
              >
                <option value="all">All Sources</option>
                <option value="api">API</option>
                <option value="database">Database</option>
                <option value="auth">Authentication</option>
                <option value="app">Application</option>
                <option value="payment">Payment</option>
              </select>
              
              <select
                className="border border-gray-300 rounded-md p-2 text-sm"
                value={logLevelFilter}
                onChange={(e) => setLogLevelFilter(e.target.value)}
              >
                <option value="all">All Levels</option>
                <option value="error">Error</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
                <option value="debug">Debug</option>
              </select>
              
              <Button variant="outline" onClick={fetchLogs} size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border shadow">
            <Table>
              <TableCaption>System logs for the past 24 hours</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="w-1/2">Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      No logs match your search criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs">{formatDate(log.timestamp)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getLogLevelClass(log.level)}`}>
                          {log.level}
                        </span>
                      </TableCell>
                      <TableCell>{log.source}</TableCell>
                      <TableCell className="font-mono text-xs whitespace-pre-wrap max-w-md">
                        {log.message}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">API Performance</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Average Response Time</span>
                    <span className="font-medium">{systemOverview?.performance.api_response_time || 0} ms</span>
                  </div>
                  <Progress
                    value={Math.min(((systemOverview?.performance.api_response_time || 0) / 300) * 100, 100)}
                    className="h-2"
                    indicatorColor={
                      (systemOverview?.performance.api_response_time || 0) > 200 ? 'bg-red-500' :
                      (systemOverview?.performance.api_response_time || 0) > 150 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }
                  />
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>Good (&lt;150ms)</span>
                    <span>Warning (&lt;200ms)</span>
                    <span>Critical (&gt;200ms)</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Endpoint Performance</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>/api/orders</span>
                        <span>124 ms</span>
                      </div>
                      <Progress value={41.3} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>/api/users</span>
                        <span>89 ms</span>
                      </div>
                      <Progress value={29.7} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>/api/payments</span>
                        <span>196 ms</span>
                      </div>
                      <Progress value={65.3} className="h-2" indicatorColor="bg-yellow-500" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>/api/analytics</span>
                        <span>254 ms</span>
                      </div>
                      <Progress value={84.7} className="h-2" indicatorColor="bg-red-500" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Database Performance</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Average Query Time</span>
                    <span className="font-medium">{systemOverview?.performance.db_query_time || 0} ms</span>
                  </div>
                  <Progress
                    value={Math.min(((systemOverview?.performance.db_query_time || 0) / 100) * 100, 100)}
                    className="h-2"
                    indicatorColor={
                      (systemOverview?.performance.db_query_time || 0) > 75 ? 'bg-red-500' :
                      (systemOverview?.performance.db_query_time || 0) > 50 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }
                  />
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>Good (&lt;50ms)</span>
                    <span>Warning (&lt;75ms)</span>
                    <span>Critical (&gt;75ms)</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Query Types</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>SELECT</span>
                        <span>42 ms</span>
                      </div>
                      <Progress value={42} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>INSERT</span>
                        <span>38 ms</span>
                      </div>
                      <Progress value={38} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>UPDATE</span>
                        <span>56 ms</span>
                      </div>
                      <Progress value={56} className="h-2" indicatorColor="bg-yellow-500" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>JOIN</span>
                        <span>78 ms</span>
                      </div>
                      <Progress value={78} className="h-2" indicatorColor="bg-red-500" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Server Resources</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">CPU Load</span>
                    <span className="font-medium">{((systemOverview?.performance.server_load || 0) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress
                    value={(systemOverview?.performance.server_load || 0) * 100}
                    className="h-2"
                    indicatorColor={
                      (systemOverview?.performance.server_load || 0) > 0.9 ? 'bg-red-500' :
                      (systemOverview?.performance.server_load || 0) > 0.7 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Memory Usage</span>
                    <span className="font-medium">{((systemOverview?.performance.memory_usage || 0) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress
                    value={(systemOverview?.performance.memory_usage || 0) * 100}
                    className="h-2"
                    indicatorColor={
                      (systemOverview?.performance.memory_usage || 0) > 0.9 ? 'bg-red-500' :
                      (systemOverview?.performance.memory_usage || 0) > 0.7 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Disk I/O</span>
                    <span className="font-medium">38.2 MB/s</span>
                  </div>
                  <Progress
                    value={38.2}
                    className="h-2"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Network Traffic</span>
                    <span className="font-medium">15.7 MB/s</span>
                  </div>
                  <Progress
                    value={31.4}
                    className="h-2"
                  />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Response Time Distribution</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>&lt; 50ms</span>
                    <span>32%</span>
                  </div>
                  <Progress value={32} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>50-100ms</span>
                    <span>41%</span>
                  </div>
                  <Progress value={41} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>100-200ms</span>
                    <span>18%</span>
                  </div>
                  <Progress value={18} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>200-500ms</span>
                    <span>7%</span>
                  </div>
                  <Progress value={7} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>&gt; 500ms</span>
                    <span>2%</span>
                  </div>
                  <Progress value={2} className="h-2" />
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Key Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-500">P50 Response</p>
                    <p className="text-lg font-semibold">84 ms</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-500">P95 Response</p>
                    <p className="text-lg font-semibold">187 ms</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-500">P99 Response</p>
                    <p className="text-lg font-semibold">328 ms</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-500">Error Rate</p>
                    <p className="text-lg font-semibold">0.42%</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}