import { Users, IndianRupee, Calendar, FileText, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/data-table';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useLeaveRequests } from '@/hooks/useLeaveRequests';
import { format } from 'date-fns';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { user } = useAuth();
  const isHR = user?.role === 'hr';
  const [leaveFilter, setLeaveFilter] = useState<string>('all');
  
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: leaveRequests, isLoading: leavesLoading } = useLeaveRequests(leaveFilter);

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

  return (
    <DashboardLayout 
      title={`Welcome back, ${user?.name?.split(' ')[0] || 'User'}`}
      subtitle={isHR ? 'Here\'s what\'s happening with your team today.' : 'Here\'s your overview for today.'}
    >
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {statsLoading ? (
          <>
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-32" />
            ))}
          </>
        ) : isHR ? (
          <>
            <StatCard
              title="Total Employees"
              value={stats?.totalEmployees || 0}
              subtitle="Active team members"
              icon={Users}
            />
            <StatCard
              title="Monthly Payroll"
              value={formatCurrency(stats?.monthlyPayroll || 0)}
              subtitle="Due in 5 days"
              icon={IndianRupee}
              iconClassName="bg-success/10 text-success"
            />
            <StatCard
              title="Pending Leaves"
              value={stats?.pendingLeaves || 0}
              subtitle="Requires attention"
              icon={FileText}
              iconClassName="bg-warning/10 text-warning"
            />
            <StatCard
              title="Attendance Today"
              value={`${stats?.attendanceRate || 0}%`}
              subtitle={`${stats?.presentToday || 0} present`}
              icon={Calendar}
              iconClassName="bg-info/10 text-info"
            />
          </>
        ) : (
          <>
            <StatCard
              title="Remaining Annual Leave"
              value={`${stats?.remainingAnnualLeave || 0} days`}
              subtitle="Out of 20 days"
              icon={Calendar}
            />
            <StatCard
              title="This Month Salary"
              value={formatCurrency(stats?.salary || 0)}
              subtitle="Paid on 25th"
              icon={IndianRupee}
              iconClassName="bg-success/10 text-success"
            />
            <StatCard
              title="Attendance"
              value={`${stats?.attendanceRate || 0}%`}
              subtitle="This month"
              icon={Clock}
              iconClassName="bg-info/10 text-info"
            />
            <StatCard
              title="Pending Requests"
              value={stats?.pendingRequests || 0}
              subtitle="Awaiting approval"
              icon={FileText}
              iconClassName="bg-warning/10 text-warning"
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Leave Requests Widget */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Leave Requests</h3>
              <p className="text-sm text-muted-foreground">Recent leave applications</p>
            </div>
            <div className="flex items-center gap-2">
              {isHR && (
                <Select value={leaveFilter} onValueChange={setLeaveFilter}>
                  <SelectTrigger className="w-32 h-8 text-xs">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All ({totalCount})</SelectItem>
                    <SelectItem value="pending">Pending ({pendingCount})</SelectItem>
                    <SelectItem value="approved">Approved ({approvedCount})</SelectItem>
                    <SelectItem value="rejected">Rejected ({rejectedCount})</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </div>

          {/* Leave Stats Summary for HR */}
          {isHR && (
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold">{totalCount}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div className="bg-warning/10 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-warning">{pendingCount}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
              <div className="bg-success/10 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-success">{approvedCount}</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
              <div className="bg-destructive/10 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-destructive">{rejectedCount}</p>
                <p className="text-xs text-muted-foreground">Rejected</p>
              </div>
            </div>
          )}

          {leavesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : (
            <DataTable
              columns={[
                ...(isHR ? [{
                  key: 'employee',
                  header: 'Employee',
                  render: (item: typeof leaveRequests[0]) => (
                    <div>
                      <span className="font-medium block">{item.profile?.full_name || 'Unknown'}</span>
                      <span className="text-xs text-muted-foreground">
                        Annual: {item.profile?.remaining_annual_leave || 0}d | Sick: {item.profile?.remaining_sick_leave || 0}d
                      </span>
                    </div>
                  ),
                }] : []),
                { key: 'leave_type', header: 'Type' },
                {
                  key: 'dates',
                  header: 'Dates',
                  render: (item: typeof leaveRequests[0]) => (
                    <span>{format(new Date(item.start_date), 'MMM d')} - {format(new Date(item.end_date), 'MMM d')}</span>
                  ),
                },
                {
                  key: 'status',
                  header: 'Status',
                  render: (item: typeof leaveRequests[0]) => (
                    <StatusBadge status={item.status as 'pending' | 'approved' | 'rejected'} />
                  ),
                },
              ]}
              data={leaveRequests?.slice(0, 5) || []}
              keyExtractor={(item) => item.id}
              emptyMessage="No leave requests found"
            />
          )}
        </div>

        {/* Quick Actions / Payroll Overview */}
        <div className="space-y-6">
          {isHR && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start h-auto py-4">
                  <Users className="h-5 w-5 mr-3 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Add Employee</p>
                    <p className="text-xs text-muted-foreground">Onboard new team member</p>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-4">
                  <IndianRupee className="h-5 w-5 mr-3 text-success" />
                  <div className="text-left">
                    <p className="font-medium">Run Payroll</p>
                    <p className="text-xs text-muted-foreground">Process monthly payroll</p>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-4">
                  <FileText className="h-5 w-5 mr-3 text-warning" />
                  <div className="text-left">
                    <p className="font-medium">Review Leaves</p>
                    <p className="text-xs text-muted-foreground">{pendingCount} pending requests</p>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-4">
                  <TrendingUp className="h-5 w-5 mr-3 text-info" />
                  <div className="text-left">
                    <p className="font-medium">View Reports</p>
                    <p className="text-xs text-muted-foreground">Analytics & insights</p>
                  </div>
                </Button>
              </div>
            </div>
          )}

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Payroll Overview</h3>
                <p className="text-sm text-muted-foreground">Recent payroll cycles</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{format(new Date(), 'MMMM yyyy')}</p>
                  <p className="text-sm text-muted-foreground">{stats?.totalEmployees || 0} employees</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">{formatCurrency(stats?.monthlyPayroll || stats?.salary || 0)}</p>
                  <p className="text-xs text-warning">Processing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
