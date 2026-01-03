import { Users, IndianRupee, Calendar, FileText, TrendingUp, Clock, CheckCircle, XCircle, Search, Bell, Settings, Home, UserPlus, DollarSign, Briefcase, Award, Target, BarChart3, PieChart, Download, Upload, Filter, Plus, Edit, Trash2, Eye, Mail, Phone, MapPin, Building2, Star, AlertCircle, ChevronRight, Menu, LogOut, Activity } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/data-table';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useLeaveRequests } from '@/hooks/useLeaveRequests';
import { useRecentActivities } from '@/hooks/useRecentActivities';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isHR = user?.role === 'hr';
  const [leaveFilter, setLeaveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);

  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: leaveRequests, isLoading: leavesLoading } = useLeaveRequests(leaveFilter);
  const { data: recentActivitiesData, isLoading: activitiesLoading } = useRecentActivities(8);

  const pendingCount = leaveRequests?.filter(r => r.status === 'pending').length || 0;
  const approvedCount = leaveRequests?.filter(r => r.status === 'approved').length || 0;
  const rejectedCount = leaveRequests?.filter(r => r.status === 'rejected').length || 0;
  const totalCount = leaveRequests?.length || 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Quick access items for HR
  const quickAccessItems = [
    {
      title: 'Employees',
      description: 'Manage team members',
      icon: Users,
      color: 'bg-blue-500',
      link: '/employees',
      count: stats?.totalEmployees || 0,
    },
    {
      title: 'Attendance',
      description: 'Track daily attendance',
      icon: Clock,
      color: 'bg-green-500',
      link: '/attendance',
      count: stats?.presentToday || 0,
    },
    {
      title: 'Leave Requests',
      description: 'Review applications',
      icon: FileText,
      color: 'bg-orange-500',
      link: '/leave',
      count: pendingCount,
      badge: pendingCount > 0,
    },
    {
      title: 'Payroll',
      description: 'Process salaries',
      icon: DollarSign,
      color: 'bg-purple-500',
      link: '/payroll',
      count: stats?.totalEmployees || 0,
    },
    {
      title: 'Reports',
      description: 'View analytics',
      icon: BarChart3,
      color: 'bg-pink-500',
      link: '/reports',
      count: 12,
    },
    {
      title: 'Recruitment',
      description: 'Hire new talent',
      icon: UserPlus,
      color: 'bg-indigo-500',
      link: '/recruitment',
      count: 5,
    },
  ];

  // Recent activities are now fetched dynamically from useRecentActivities hook

  // Upcoming events
  const upcomingEvents = [
    { id: 1, title: 'Monthly Payroll', date: '25th Dec', type: 'payroll', icon: DollarSign },
    { id: 2, title: 'Team Meeting', date: '28th Dec', type: 'meeting', icon: Users },
    { id: 3, title: 'Performance Review', date: '30th Dec', type: 'review', icon: Award },
  ];

  return (
    <DashboardLayout title="HR Dashboard" subtitle="Manage your team and operations efficiently">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search employees, departments, or actions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Quick Add
            </Button>
            <div className="relative">
              <Button variant="outline" size="sm" className="p-2">
                <Bell className="h-4 w-4" />
              </Button>
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {notifications}
                </Badge>
              )}
            </div>
            <Button variant="outline" size="sm" className="p-2">
              <Settings className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback>HR</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">HR Admin</p>
                <p className="text-xs text-gray-500">hr@company.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {quickAccessItems.map((item) => (
            <Link
              key={item.title}
              to={item.link}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  {item.count > 0 && (
                    <Badge variant="secondary" className="mt-2">
                      {item.count}
                    </Badge>
                  )}
                </div>
                {item.badge && (
                  <div className="absolute top-2 right-2">
                    <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats and Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Employees</p>
                  <p className="text-2xl font-bold">{stats?.totalEmployees || 0}</p>
                  <p className="text-xs text-green-600">+2 this month</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Present Today</p>
                  <p className="text-2xl font-bold">{stats?.presentToday || 0}</p>
                  <p className="text-xs text-gray-600">{stats?.attendanceRate || 0}% attendance</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Leaves</p>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-xs text-orange-600">Need review</p>
                </div>
                <FileText className="h-8 w-8 text-orange-500" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Monthly Payroll</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats?.monthlyPayroll || 0)}</p>
                  <p className="text-xs text-gray-600">Due in 5 days</p>
                </div>
                <IndianRupee className="h-8 w-8 text-purple-500" />
              </div>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Activities
                <Button variant="outline" size="sm">View All</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activitiesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-2 w-2 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-3 w-16" />
                    </div>
                  ))}
                </div>
              ) : recentActivitiesData && recentActivitiesData.length > 0 ? (
                <div className="space-y-4">
                  {recentActivitiesData.map((activity) => {
                    const getActivityIcon = (type: string) => {
                      switch (type) {
                        case 'leave': return FileText;
                        case 'attendance': return Clock;
                        case 'employee': return UserPlus;
                        case 'profile': return Edit;
                        default: return Activity;
                      }
                    };

                    const Icon = getActivityIcon(activity.type);

                    return (
                      <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${activity.status === 'pending' ? 'bg-orange-500' :
                            activity.status === 'failed' ? 'bg-red-500' : 'bg-green-500'
                            }`}></div>
                          <Icon className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">{activity.user}</p>
                            <p className="text-xs text-gray-500">{activity.action}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No recent activities found</p>
                  <p className="text-xs text-gray-400 mt-1">Activities will appear here as users interact with the system</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions and Events */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4"
                onClick={() => navigate('/employees')}
              >
                <UserPlus className="h-5 w-5 mr-3 text-blue-500" />
                <div className="text-left">
                  <p className="font-medium">Add Employee</p>
                  <p className="text-xs text-gray-500">Onboard new team member</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4"
                onClick={() => navigate('/payroll')}
              >
                <DollarSign className="h-5 w-5 mr-3 text-green-500" />
                <div className="text-left">
                  <p className="font-medium">Process Payroll</p>
                  <p className="text-xs text-gray-500">Run monthly payroll</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4"
                onClick={() => navigate('/leave')}
              >
                <FileText className="h-5 w-5 mr-3 text-orange-500" />
                <div className="text-left">
                  <p className="font-medium">Review Leaves</p>
                  <p className="text-xs text-gray-500">{pendingCount} pending requests</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4"
                onClick={() => navigate('/reports')}
              >
                <BarChart3 className="h-5 w-5 mr-3 text-purple-500" />
                <div className="text-left">
                  <p className="font-medium">Generate Report</p>
                  <p className="text-xs text-gray-500">View analytics</p>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Important dates and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${event.type === 'payroll' ? 'bg-green-100' :
                      event.type === 'meeting' ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                      <event.icon className={`h-5 w-5 ${event.type === 'payroll' ? 'text-green-600' :
                        event.type === 'meeting' ? 'text-blue-600' : 'text-purple-600'
                        }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-gray-500">{event.date}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <Badge variant="default" className="bg-green-500">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Services</span>
                  <Badge variant="default" className="bg-green-500">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Backup</span>
                  <Badge variant="secondary">Last: 2 hours ago</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
