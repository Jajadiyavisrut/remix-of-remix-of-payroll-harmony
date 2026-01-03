import { useState } from 'react';
import { Calendar, Clock, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
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
  const isAdmin = user?.role === 'admin';
  const [selectedMonth, setSelectedMonth] = useState('january');

  const myAttendance = attendanceRecords.filter(r => r.employee === 'John Smith');
  const displayRecords = isAdmin ? attendanceRecords : myAttendance;

  return (
    <DashboardLayout 
      title="Attendance" 
      subtitle={isAdmin ? "Track team attendance and work hours" : "View your attendance records"}
    >
      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title={isAdmin ? "Present Today" : "Days Present"}
          value={isAdmin ? "147" : "22"}
          subtitle={isAdmin ? "Out of 156 employees" : "This month"}
          icon={CheckCircle2}
          iconClassName="bg-success/10 text-success"
        />
        <StatCard
          title={isAdmin ? "Absent Today" : "Days Absent"}
          value={isAdmin ? "5" : "0"}
          subtitle={isAdmin ? "3 on leave, 2 unexcused" : "This month"}
          icon={XCircle}
          iconClassName="bg-destructive/10 text-destructive"
        />
        <StatCard
          title={isAdmin ? "Late Arrivals" : "Late Arrivals"}
          value={isAdmin ? "4" : "2"}
          subtitle={isAdmin ? "After 9:30 AM" : "This month"}
          icon={Clock}
          iconClassName="bg-warning/10 text-warning"
        />
        <StatCard
          title="Avg. Work Hours"
          value={isAdmin ? "8.5h" : "8.7h"}
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
          {isAdmin && (
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
        <Button variant="outline">Export Report</Button>
      </div>

      {/* Attendance Table */}
      <DataTable
        columns={[
          ...(isAdmin ? [{
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
