import { useState } from 'react';
import { Plus, Calendar, FileText, Clock, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/ui/data-table';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface LeaveRequest {
  id: string;
  employee: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'approved' | 'pending' | 'rejected';
  appliedOn: string;
  remainingAnnualLeave: number;
  remainingSickLeave: number;
}

const leaveRequests: LeaveRequest[] = [
  { id: '1', employee: 'Rahul Sharma', type: 'Vacation', startDate: 'Jan 15', endDate: 'Jan 20', days: 5, reason: 'Family vacation', status: 'pending', appliedOn: 'Jan 5', remainingAnnualLeave: 12, remainingSickLeave: 8 },
  { id: '2', employee: 'Priya Patel', type: 'Sick Leave', startDate: 'Jan 10', endDate: 'Jan 10', days: 1, reason: 'Medical appointment', status: 'approved', appliedOn: 'Jan 9', remainingAnnualLeave: 15, remainingSickLeave: 9 },
  { id: '3', employee: 'Amit Kumar', type: 'Personal', startDate: 'Jan 12', endDate: 'Jan 13', days: 2, reason: 'Personal matters', status: 'rejected', appliedOn: 'Jan 8', remainingAnnualLeave: 8, remainingSickLeave: 6 },
  { id: '4', employee: 'Neha Singh', type: 'Vacation', startDate: 'Jan 22', endDate: 'Jan 25', days: 4, reason: 'Travel plans', status: 'pending', appliedOn: 'Jan 10', remainingAnnualLeave: 18, remainingSickLeave: 10 },
  { id: '5', employee: 'Vikram Reddy', type: 'Sick Leave', startDate: 'Jan 8', endDate: 'Jan 9', days: 2, reason: 'Flu', status: 'approved', appliedOn: 'Jan 7', remainingAnnualLeave: 5, remainingSickLeave: 1 },
];

export default function Leave() {
  const { user } = useAuth();
  const { toast } = useToast();
  const isHR = user?.role === 'hr';
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const myLeaves = leaveRequests.filter(r => r.employee === 'Rahul Sharma');
  const baseRequests = isHR ? leaveRequests : myLeaves;
  const displayRequests = statusFilter === 'all' 
    ? baseRequests 
    : baseRequests.filter(r => r.status === statusFilter);
  
  const pendingCount = leaveRequests.filter(r => r.status === 'pending').length;
  const approvedCount = leaveRequests.filter(r => r.status === 'approved').length;
  const rejectedCount = leaveRequests.filter(r => r.status === 'rejected').length;

  const handleApprove = (id: string) => {
    toast({
      title: 'Leave Approved',
      description: 'The leave request has been approved successfully.',
    });
  };

  const handleReject = (id: string) => {
    toast({
      title: 'Leave Rejected',
      description: 'The leave request has been rejected.',
      variant: 'destructive',
    });
  };

  return (
    <DashboardLayout 
      title="Leave Management" 
      subtitle={isHR ? "Review and manage leave requests" : "Request and track your leaves"}
    >
      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {isHR ? (
          <>
            <StatCard
              title="Pending Requests"
              value={pendingCount}
              subtitle="Awaiting approval"
              icon={Clock}
              iconClassName="bg-warning/10 text-warning"
            />
            <StatCard
              title="Approved This Month"
              value="24"
              subtitle="Leave requests"
              icon={CheckCircle}
              iconClassName="bg-success/10 text-success"
            />
            <StatCard
              title="On Leave Today"
              value="8"
              subtitle="Employees"
              icon={Calendar}
              iconClassName="bg-info/10 text-info"
            />
            <StatCard
              title="Total Requests"
              value="42"
              subtitle="This year"
              icon={FileText}
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
              title="Remaining Sick Leave"
              value="8 days"
              subtitle="Out of 10 days"
              icon={FileText}
              iconClassName="bg-info/10 text-info"
            />
            <StatCard
              title="Pending"
              value="1"
              subtitle="Request awaiting"
              icon={Clock}
              iconClassName="bg-warning/10 text-warning"
            />
            <StatCard
              title="Used This Year"
              value="5 days"
              subtitle="Total leaves taken"
              icon={CheckCircle}
              iconClassName="bg-success/10 text-success"
            />
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending ({pendingCount})</SelectItem>
              <SelectItem value="approved">Approved ({approvedCount})</SelectItem>
              <SelectItem value="rejected">Rejected ({rejectedCount})</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Leave type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="vacation">Vacation</SelectItem>
              <SelectItem value="sick">Sick Leave</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {!isHR && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Request Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Request Leave</DialogTitle>
                <DialogDescription>
                  Submit a new leave request for approval.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Leave Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vacation">Vacation</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="maternity">Maternity/Paternity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Textarea placeholder="Briefly describe the reason for your leave..." />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  setIsDialogOpen(false);
                  toast({
                    title: 'Leave Request Submitted',
                    description: 'Your request has been sent for approval.',
                  });
                }}>
                  Submit Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Leave Requests Table */}
      <DataTable
        columns={[
          ...(isHR ? [{
            key: 'employee',
            header: 'Employee',
            render: (request: LeaveRequest) => (
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {request.employee.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <span className="font-medium block">{request.employee}</span>
                  <span className="text-xs text-muted-foreground">
                    Annual: {request.remainingAnnualLeave}d | Sick: {request.remainingSickLeave}d
                  </span>
                </div>
              </div>
            ),
          }] : []),
          { key: 'type', header: 'Type' },
          {
            key: 'dates',
            header: 'Dates',
            render: (request: LeaveRequest) => (
              <span>{request.startDate} - {request.endDate}</span>
            ),
          },
          {
            key: 'days',
            header: 'Days',
            render: (request: LeaveRequest) => (
              <span className="font-medium">{request.days} day{request.days > 1 ? 's' : ''}</span>
            ),
          },
          { key: 'reason', header: 'Reason' },
          { key: 'appliedOn', header: 'Applied On' },
          {
            key: 'status',
            header: 'Status',
            render: (request: LeaveRequest) => <StatusBadge status={request.status} />,
          },
          ...(isHR ? [{
            key: 'actions',
            header: 'Actions',
            render: (request: LeaveRequest) => request.status === 'pending' ? (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-success hover:text-success hover:bg-success/10"
                  onClick={() => handleApprove(request.id)}
                >
                  Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleReject(request.id)}
                >
                  Reject
                </Button>
              </div>
            ) : null,
          }] : []),
        ]}
        data={displayRequests}
        keyExtractor={(request) => request.id}
        emptyMessage="No leave requests found"
      />
    </DashboardLayout>
  );
}
