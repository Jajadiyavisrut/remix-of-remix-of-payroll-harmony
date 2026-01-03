import { useState } from 'react';
import { Calendar, Clock, CheckCircle2, XCircle, MinusCircle, LogIn, LogOut, UserPlus } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/ui/data-table';
import { StatCard } from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

interface AttendanceRecord {
  id: string;
  employee: string;
  date: string;
  checkIn: string;
  checkOut: string;
  workHours: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
}

const attendanceRecords: AttendanceRecord[] = [
  { id: '1', employee: 'John Smith', date: 'Jan 3, 2024', checkIn: '09:02 AM', checkOut: '06:15 PM', workHours: '9h 13m', status: 'present' },
  { id: '2', employee: 'Emily Davis', date: 'Jan 3, 2024', checkIn: '08:55 AM', checkOut: '05:30 PM', workHours: '8h 35m', status: 'present' },
  { id: '3', employee: 'Michael Brown', date: 'Jan 3, 2024', checkIn: '10:20 AM', checkOut: '06:45 PM', workHours: '8h 25m', status: 'late' },
  { id: '4', employee: 'Sarah Wilson', date: 'Jan 3, 2024', checkIn: '-', checkOut: '-', workHours: '-', status: 'absent' },
  { id: '5', employee: 'David Lee', date: 'Jan 3, 2024', checkIn: '09:00 AM', checkOut: '01:00 PM', workHours: '4h 0m', status: 'half-day' },
  { id: '6', employee: 'Jennifer Martinez', date: 'Jan 3, 2024', checkIn: '08:45 AM', checkOut: '05:50 PM', workHours: '9h 5m', status: 'present' },
];

const statusStyles = {
  present: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', label: 'Present' },
  absent: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Absent' },
  late: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Late' },
  'half-day': { icon: MinusCircle, color: 'text-info', bg: 'bg-info/10', label: 'Half Day' },
};

export default function Attendance() {
  const { user } = useAuth();
  const { toast } = useToast();
  const isHR = user?.role === 'hr';
  const [selectedMonth, setSelectedMonth] = useState('january');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);

  const myAttendance = attendanceRecords.filter(r => r.employee === 'John Smith');
  const displayRecords = isHR ? attendanceRecords : myAttendance;

  const handleCheckIn = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setIsCheckedIn(true);
    setCheckInTime(timeString);
    toast({
      title: 'Checked In Successfully',
      description: `You checked in at ${timeString}`,
    });
  };

  const handleCheckOut = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setIsCheckedIn(false);
    setCheckInTime(null);
    toast({
      title: 'Checked Out Successfully',
      description: `You checked out at ${timeString}`,
    });
  };

  const handleManualEntry = () => {
    setIsManualEntryOpen(false);
    toast({
      title: 'Attendance Recorded',
      description: 'Manual attendance entry has been saved.',
    });
  };

  return (
    <DashboardLayout 
      title="Attendance" 
      subtitle={isHR ? "Track team attendance and work hours" : "View your attendance records"}
    >
      {/* Check In/Out Section for Employees */}
      {!isHR && (
        <div className="bg-card rounded-xl border border-border p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Today's Attendance</h3>
              <p className="text-sm text-muted-foreground">
                {isCheckedIn 
                  ? `Checked in at ${checkInTime}` 
                  : 'You have not checked in yet'}
              </p>
            </div>
            <div className="flex gap-3">
              {!isCheckedIn ? (
                <Button onClick={handleCheckIn} className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Check In
                </Button>
              ) : (
                <Button onClick={handleCheckOut} variant="destructive" className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Check Out
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title={isHR ? "Present Today" : "Days Present"}
          value={isHR ? "147" : "22"}
          subtitle={isHR ? "Out of 156 employees" : "This month"}
          icon={CheckCircle2}
          iconClassName="bg-success/10 text-success"
        />
        <StatCard
          title={isHR ? "Absent Today" : "Days Absent"}
          value={isHR ? "5" : "0"}
          subtitle={isHR ? "3 on leave, 2 unexcused" : "This month"}
          icon={XCircle}
          iconClassName="bg-destructive/10 text-destructive"
        />
        <StatCard
          title={isHR ? "Late Arrivals" : "Late Arrivals"}
          value={isHR ? "4" : "2"}
          subtitle={isHR ? "After 9:30 AM" : "This month"}
          icon={Clock}
          iconClassName="bg-warning/10 text-warning"
        />
        <StatCard
          title="Avg. Work Hours"
          value={isHR ? "8.5h" : "8.7h"}
          subtitle="Per day this month"
          icon={Calendar}
          iconClassName="bg-info/10 text-info"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="flex items-center gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="january">January 2024</SelectItem>
              <SelectItem value="december">December 2023</SelectItem>
              <SelectItem value="november">November 2023</SelectItem>
            </SelectContent>
          </Select>
          {isHR && (
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
          )}
        </div>
        <div className="flex gap-2">
          {isHR && (
            <Dialog open={isManualEntryOpen} onOpenChange={setIsManualEntryOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Manual Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Manual Attendance Entry</DialogTitle>
                  <DialogDescription>
                    Record attendance manually in case of machine failure or other issues.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Employee</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="john">John Smith</SelectItem>
                        <SelectItem value="emily">Emily Davis</SelectItem>
                        <SelectItem value="michael">Michael Brown</SelectItem>
                        <SelectItem value="sarah">Sarah Wilson</SelectItem>
                        <SelectItem value="david">David Lee</SelectItem>
                        <SelectItem value="jennifer">Jennifer Martinez</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Check In Time</Label>
                      <Input type="time" />
                    </div>
                    <div className="space-y-2">
                      <Label>Check Out Time</Label>
                      <Input type="time" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select defaultValue="present">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="late">Late</SelectItem>
                        <SelectItem value="half-day">Half Day</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Reason (Optional)</Label>
                    <Input placeholder="e.g., Machine failure, forgot to punch" />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsManualEntryOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleManualEntry}>
                    Save Entry
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          <Button variant="outline">Export Report</Button>
        </div>
      </div>

      {/* Attendance Table */}
      <DataTable
        columns={[
          ...(isHR ? [{
            key: 'employee',
            header: 'Employee',
            render: (record: AttendanceRecord) => (
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {record.employee.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <span className="font-medium">{record.employee}</span>
              </div>
            ),
          }] : []),
          { key: 'date', header: 'Date' },
          { key: 'checkIn', header: 'Check In' },
          { key: 'checkOut', header: 'Check Out' },
          { key: 'workHours', header: 'Work Hours' },
          {
            key: 'status',
            header: 'Status',
            render: (record: AttendanceRecord) => {
              const style = statusStyles[record.status];
              const Icon = style.icon;
              return (
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.color}`}>
                  <Icon className="h-3.5 w-3.5" />
                  {style.label}
                </div>
              );
            },
          },
        ]}
        data={displayRecords}
        keyExtractor={(record) => record.id}
        emptyMessage="No attendance records found"
        currentPage={1}
        totalPages={3}
        onPageChange={() => {}}
      />
    </DashboardLayout>
  );
}
