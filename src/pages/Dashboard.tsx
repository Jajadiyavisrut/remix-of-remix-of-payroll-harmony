import { useState } from 'react';
import { Users, IndianRupee, Calendar, FileText, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/data-table';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const recentLeaveRequests = [
  { id: '1', employee: 'Rahul Sharma', type: 'Vacation', dates: 'Jan 15 - Jan 20', status: 'pending' as const, remainingAnnual: 12, remainingSick: 8 },
  { id: '2', employee: 'Priya Patel', type: 'Sick Leave', dates: 'Jan 10', status: 'approved' as const, remainingAnnual: 15, remainingSick: 9 },
  { id: '3', employee: 'Amit Kumar', type: 'Personal', dates: 'Jan 12 - Jan 13', status: 'rejected' as const, remainingAnnual: 8, remainingSick: 6 },
  { id: '4', employee: 'Neha Singh', type: 'Vacation', dates: 'Jan 22 - Jan 25', status: 'pending' as const, remainingAnnual: 18, remainingSick: 10 },
  { id: '5', employee: 'Vikram Reddy', type: 'Sick Leave', dates: 'Jan 8 - Jan 9', status: 'approved' as const, remainingAnnual: 5, remainingSick: 1 },
];

const upcomingPayroll = [
  { id: '1', period: 'January 2024', employees: 24, amount: '₹12,50,000', status: 'Processing' },
  { id: '2', period: 'December 2023', employees: 24, amount: '₹12,25,000', status: 'Completed' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const isHR = user?.role === 'hr';
  const [leaveFilter, setLeaveFilter] = useState<string>('all');

  const pendingCount = recentLeaveRequests.filter(r => r.status === 'pending').length;
  const approvedCount = recentLeaveRequests.filter(r => r.status === 'approved').length;
  const rejectedCount = recentLeaveRequests.filter(r => r.status === 'rejected').length;
  const totalCount = recentLeaveRequests.length;

  const filteredLeaveRequests = leaveFilter === 'all' 
    ? recentLeaveRequests 
    : recentLeaveRequests.filter(r => r.status === leaveFilter);

  return (
    <DashboardLayout 
      title={`Welcome back, ${user?.name.split(' ')[0]}`}
      subtitle={isHR ? 'Here\'s what\'s happening with your team today.' : 'Here\'s your overview for today.'}
    >
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {isHR ? (
          <>
            <StatCard
              title="Total Employees"
              value="24"
              subtitle="2 new this month"
              icon={Users}
              trend={{ value: 8.2, isPositive: true }}
            />
            <StatCard
              title="Monthly Payroll"
              value="₹12,50,000"
              subtitle="Due in 5 days"
              icon={IndianRupee}
              iconClassName="bg-success/10 text-success"
              trend={{ value: 3.1, isPositive: true }}
            />
            <StatCard
              title="Pending Leaves"
              value={pendingCount}
              subtitle="Requires attention"
              icon={FileText}
              iconClassName="bg-warning/10 text-warning"
            />
            <StatCard
              title="Attendance Today"
              value="94%"
              subtitle="147 present"
              icon={Calendar}
              iconClassName="bg-info/10 text-info"
              trend={{ value: 2.4, isPositive: true }}
            />
          </>
        ) : (
          <>
            <StatCard
              title="Remaining Annual Leave"
              value="12 days"
              subtitle="Out of 20 days"
              icon={Calendar}
            />
            <StatCard
              title="This Month Salary"
              value="₹52,000"
              subtitle="Paid on 25th"
              icon={IndianRupee}
              iconClassName="bg-success/10 text-success"
            />
            <StatCard
              title="Attendance"
              value="96%"
              subtitle="This month"
              icon={Clock}
              iconClassName="bg-info/10 text-info"
            />
            <StatCard
              title="Pending Requests"
              value="1"
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

          <DataTable
            columns={[
              ...(isHR ? [{
                key: 'employee',
                header: 'Employee',
                render: (item: typeof recentLeaveRequests[0]) => (
                  <div>
                    <span className="font-medium block">{item.employee}</span>
                    <span className="text-xs text-muted-foreground">
                      Annual: {item.remainingAnnual}d | Sick: {item.remainingSick}d
                    </span>
                  </div>
                ),
              }] : [{ key: 'employee', header: 'Employee' }]),
              { key: 'type', header: 'Type' },
              { key: 'dates', header: 'Dates' },
              {
                key: 'status',
                header: 'Status',
                render: (item: typeof recentLeaveRequests[0]) => <StatusBadge status={item.status} />,
              },
            ]}
            data={filteredLeaveRequests}
            keyExtractor={(item) => item.id}
          />
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
                    <p className="text-xs text-muted-foreground">12 pending requests</p>
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
              {upcomingPayroll.map((payroll) => (
                <div key={payroll.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{payroll.period}</p>
                    <p className="text-sm text-muted-foreground">{payroll.employees} employees</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">{payroll.amount}</p>
                    <p className={`text-xs ${payroll.status === 'Completed' ? 'text-success' : 'text-warning'}`}>
                      {payroll.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
