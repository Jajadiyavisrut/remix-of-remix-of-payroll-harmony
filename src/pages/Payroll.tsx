import { IndianRupee, Download, Calendar, TrendingUp, Wallet } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/ui/data-table';
import { StatCard } from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PayrollRecord {
  id: string;
  employee: string;
  department: string;
  baseSalary: string;
  deductions: string;
  bonus: string;
  netPay: string;
  status: 'paid' | 'pending' | 'processing';
}

const payrollRecords: PayrollRecord[] = [
  { id: '1', employee: 'Rahul Sharma', department: 'Engineering', baseSalary: '₹65,000', deductions: '₹8,500', bonus: '₹5,000', netPay: '₹61,500', status: 'paid' },
  { id: '2', employee: 'Priya Patel', department: 'Design', baseSalary: '₹55,000', deductions: '₹7,200', bonus: '₹0', netPay: '₹47,800', status: 'paid' },
  { id: '3', employee: 'Amit Kumar', department: 'Marketing', baseSalary: '₹58,000', deductions: '₹7,500', bonus: '₹3,000', netPay: '₹53,500', status: 'processing' },
  { id: '4', employee: 'Neha Singh', department: 'HR', baseSalary: '₹45,000', deductions: '₹5,800', bonus: '₹0', netPay: '₹39,200', status: 'pending' },
  { id: '5', employee: 'Vikram Reddy', department: 'Engineering', baseSalary: '₹62,000', deductions: '₹8,100', bonus: '₹0', netPay: '₹53,900', status: 'paid' },
];

const statusStyles = {
  paid: 'bg-success/10 text-success',
  pending: 'bg-warning/10 text-warning',
  processing: 'bg-info/10 text-info',
};

export default function Payroll() {
  const { user } = useAuth();
  const isHR = user?.role === 'hr';

  // For employee view, show only their record
  const myPayroll = payrollRecords.find(r => r.employee === 'Rahul Sharma');
  const displayRecords = isHR ? payrollRecords : (myPayroll ? [myPayroll] : []);

  return (
    <DashboardLayout 
      title="Payroll" 
      subtitle={isHR ? "Manage employee salaries and payments" : "View your salary details"}
    >
      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {isHR ? (
          <>
            <StatCard
              title="Total Payroll"
              value="₹12,50,000"
              subtitle="January 2024"
              icon={IndianRupee}
              trend={{ value: 3.2, isPositive: true }}
            />
            <StatCard
              title="Processed"
              value="22"
              subtitle="Out of 24 employees"
              icon={TrendingUp}
              iconClassName="bg-success/10 text-success"
            />
            <StatCard
              title="Pending"
              value="2"
              subtitle="Awaiting approval"
              icon={Calendar}
              iconClassName="bg-warning/10 text-warning"
            />
            <StatCard
              title="Total Bonus"
              value="₹45,000"
              subtitle="This month"
              icon={Wallet}
              iconClassName="bg-info/10 text-info"
            />
          </>
        ) : (
          <>
            <StatCard
              title="Net Salary"
              value="₹61,500"
              subtitle="January 2024"
              icon={IndianRupee}
            />
            <StatCard
              title="Base Salary"
              value="₹65,000"
              subtitle="Monthly"
              icon={Wallet}
              iconClassName="bg-info/10 text-info"
            />
            <StatCard
              title="Deductions"
              value="₹8,500"
              subtitle="Tax & PF"
              icon={TrendingUp}
              iconClassName="bg-warning/10 text-warning"
            />
            <StatCard
              title="Bonus"
              value="₹5,000"
              subtitle="Performance bonus"
              icon={Calendar}
              iconClassName="bg-success/10 text-success"
            />
          </>
        )}
      </div>

      {/* Salary Breakdown for Employee */}
      {!isHR && (
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Salary Breakdown</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Basic Salary</p>
              <p className="text-xl font-semibold mt-1">₹45,000</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">HRA</p>
              <p className="text-xl font-semibold mt-1">₹12,000</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Travel Allowance</p>
              <p className="text-xl font-semibold mt-1">₹5,000</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Special Allowance</p>
              <p className="text-xl font-semibold mt-1">₹3,000</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Year-to-Date Earnings</p>
                <p className="text-2xl font-semibold text-primary mt-1">₹61,500</p>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Pay Slip
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Filters for Admin */}
      {isHR && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
          <div className="flex items-center gap-3">
            <Select defaultValue="january">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="january">January 2024</SelectItem>
                <SelectItem value="december">December 2023</SelectItem>
                <SelectItem value="november">November 2023</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>Run Payroll</Button>
          </div>
        </div>
      )}

      {/* Payroll Table */}
      <DataTable
        columns={[
          {
            key: 'employee',
            header: 'Employee',
            render: (record) => (
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {record.employee.split(' ').map((n: string) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{record.employee}</p>
                  <p className="text-xs text-muted-foreground">{record.department}</p>
                </div>
              </div>
            ),
          },
          { key: 'baseSalary', header: 'Base Salary' },
          { key: 'deductions', header: 'Deductions' },
          { key: 'bonus', header: 'Bonus' },
          { 
            key: 'netPay', 
            header: 'Net Pay',
            render: (record) => (
              <span className="font-semibold text-foreground">{record.netPay}</span>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            render: (record) => (
              <span className={`status-badge ${statusStyles[record.status as keyof typeof statusStyles]}`}>
                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
              </span>
            ),
          },
          ...(isHR ? [{
            key: 'actions',
            header: '',
            render: () => (
              <Button variant="ghost" size="sm">
                View Details
              </Button>
            ),
          }] : []),
        ]}
        data={displayRecords}
        keyExtractor={(record) => record.id}
        emptyMessage="No payroll records found"
      />
    </DashboardLayout>
  );
}
