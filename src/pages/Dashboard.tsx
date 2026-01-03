import { Users, DollarSign, Calendar, FileText, TrendingUp, Clock } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/data-table';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const recentLeaveRequests = [
  { id: '1', employee: 'John Smith', type: 'Vacation', dates: 'Jan 15 - Jan 20', status: 'pending' as const },
  { id: '2', employee: 'Emily Davis', type: 'Sick Leave', dates: 'Jan 10', status: 'approved' as const },
  { id: '3', employee: 'Michael Brown', type: 'Personal', dates: 'Jan 12 - Jan 13', status: 'rejected' as const },
  { id: '4', employee: 'Sarah Wilson', type: 'Vacation', dates: 'Jan 22 - Jan 25', status: 'pending' as const },
];

const upcomingPayroll = [
  { id: '1', period: 'January 2024', employees: 156, amount: '$425,000', status: 'Processing' },
  { id: '2', period: 'December 2023', employees: 154, amount: '$418,500', status: 'Completed' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <DashboardLayout 
      title={`Welcome back, ${user?.name.split(' ')[0]}`}
      subtitle={isAdmin ? 'Here\'s what\'s happening with your team today.' : 'Here\'s your overview for today.'}
    >
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {isAdmin ? (
          <>
            <StatCard
              title="Total Employees"
              value="156"
              subtitle="12 new this month"
              icon={Users}
              trend={{ value: 8.2, isPositive: true }}
            />
            <StatCard
              title="Monthly Payroll"
              value="$425,000"
              subtitle="Due in 5 days"
              icon={DollarSign}
              iconClassName="bg-success/10 text-success"
              trend={{ value: 3.1, isPositive: true }}
            />
            <StatCard
              title="Pending Leaves"
              value="12"
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
              title="Leave Balance"
              value="18 days"
              subtitle="Annual leave remaining"
              icon={Calendar}
            />
            <StatCard
              title="This Month Salary"
              value="$5,200"
              subtitle="Paid on Jan 25"
              icon={DollarSign}
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
        {/* Recent Leave Requests */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Leave Requests</h3>
              <p className="text-sm text-muted-foreground">Recent leave applications</p>
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <DataTable
            columns={[
              { key: 'employee', header: 'Employee' },
              { key: 'type', header: 'Type' },
              { key: 'dates', header: 'Dates' },
              {
                key: 'status',
                header: 'Status',
                render: (item) => <StatusBadge status={item.status} />,
              },
            ]}
            data={recentLeaveRequests}
            keyExtractor={(item) => item.id}
          />
        </div>

        {/* Quick Actions / Payroll Overview */}
        <div className="space-y-6">
          {isAdmin && (
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
                  <DollarSign className="h-5 w-5 mr-3 text-success" />
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
