import { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Mail, Phone, Clock, LogIn, LogOut } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox as CheckboxUI } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  role: 'employee' | 'intern';
  joinDate: string;
  status: 'active' | 'inactive';
  salary: string;
  checkIn?: string;
  checkOut?: string;
  attendanceStatus?: 'present' | 'absent' | 'leave';
  remainingAnnualLeave: number;
  remainingSickLeave: number;
}

const employees: Employee[] = [
  { id: 'EMP001', name: 'Rahul Sharma', email: 'rahul.sharma@company.com', phone: '+91 98765 43210', department: 'Engineering', position: 'Senior Developer', role: 'employee', joinDate: 'Jan 15, 2022', status: 'active', salary: '₹65,000', checkIn: '09:00 AM', checkOut: '06:15 PM', attendanceStatus: 'present', remainingAnnualLeave: 12, remainingSickLeave: 8 },
  { id: 'EMP002', name: 'Priya Patel', email: 'priya.patel@company.com', phone: '+91 98765 43211', department: 'Design', position: 'UI/UX Designer', role: 'employee', joinDate: 'Mar 20, 2022', status: 'active', salary: '₹55,000', checkIn: '09:30 AM', checkOut: '06:00 PM', attendanceStatus: 'present', remainingAnnualLeave: 15, remainingSickLeave: 10 },
  { id: 'EMP003', name: 'Amit Kumar', email: 'amit.kumar@company.com', phone: '+91 98765 43212', department: 'Marketing', position: 'Marketing Manager', role: 'employee', joinDate: 'Jun 10, 2021', status: 'active', salary: '₹58,000', checkIn: '10:15 AM', checkOut: '--', attendanceStatus: 'present', remainingAnnualLeave: 8, remainingSickLeave: 6 },
  { id: 'EMP004', name: 'Neha Singh', email: 'neha.singh@company.com', phone: '+91 98765 43213', department: 'HR', position: 'HR Specialist', role: 'employee', joinDate: 'Sep 5, 2023', status: 'active', salary: '₹45,000', checkIn: '--', checkOut: '--', attendanceStatus: 'leave', remainingAnnualLeave: 18, remainingSickLeave: 10 },
  { id: 'EMP005', name: 'Vikram Reddy', email: 'vikram.reddy@company.com', phone: '+91 98765 43214', department: 'Engineering', position: 'DevOps Engineer', role: 'intern', joinDate: 'Nov 12, 2022', status: 'inactive', salary: '₹62,000', checkIn: '--', checkOut: '--', attendanceStatus: 'absent', remainingAnnualLeave: 5, remainingSickLeave: 3 },
  { id: 'EMP006', name: 'Anjali Gupta', email: 'anjali.gupta@company.com', phone: '+91 98765 43215', department: 'Sales', position: 'Sales Executive', role: 'employee', joinDate: 'Feb 28, 2023', status: 'active', salary: '₹48,000', checkIn: '08:45 AM', checkOut: '05:30 PM', attendanceStatus: 'present', remainingAnnualLeave: 10, remainingSickLeave: 7 },
];

const getStatusIndicatorColor = (status?: 'present' | 'absent' | 'leave') => {
  switch (status) {
    case 'present':
      return 'bg-green-500';
    case 'absent':
      return 'bg-red-500';
    case 'leave':
      return 'bg-yellow-500';
    default:
      return 'bg-muted';
  }
};

const getAttendanceStatusColor = (status?: string) => {
  switch (status) {
    case 'present':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'absent':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'leave':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export default function Employees() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleEmployeeSelection = (id: string) => {
    setSelectedEmployees(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  return (
    <DashboardLayout title="Employees" subtitle="Manage your team members and their information">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              + New
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Enter the details of the new team member. Employee ID will be auto-generated.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Employee ID</Label>
                <Input value="EMP007" disabled className="bg-muted" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Smith" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@company.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input id="position" placeholder="Software Developer" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select defaultValue="employee">
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="intern">Intern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Create Employee
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredEmployees.map((emp) => (
          <HoverCard key={emp.id} openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
              <Card className="relative group cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/30">
                {/* Selection Checkbox */}
                <div className="absolute top-3 right-3 z-10">
                  <CheckboxUI
                    checked={selectedEmployees.includes(emp.id)}
                    onCheckedChange={() => toggleEmployeeSelection(emp.id)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                {/* Status Indicator */}
                <div className="absolute top-3 left-3 z-10">
                  <div 
                    className={`h-3 w-3 rounded-full ${getStatusIndicatorColor(emp.attendanceStatus)} ring-2 ring-background shadow-sm`}
                    title={emp.attendanceStatus === 'present' ? 'Present' : emp.attendanceStatus === 'absent' ? 'Absent' : 'On Leave'}
                  />
                </div>

                <CardContent className="p-5">
                  {/* Profile Picture */}
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center mb-3 ring-2 ring-background shadow-md">
                      <span className="text-lg font-semibold text-primary">
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground">{emp.name}</h3>
                    <p className="text-xs text-muted-foreground font-mono">{emp.id}</p>
                  </div>

                  {/* Role & Department */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Role</span>
                      <span className="font-medium">{emp.position}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Dept</span>
                      <span className="font-medium">{emp.department}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-4 flex justify-center">
                    <StatusBadge status={emp.status} />
                  </div>
                </CardContent>
              </Card>
            </HoverCardTrigger>

            {/* Hover Card with Check-in/Check-out Details */}
            <HoverCardContent className="w-72" side="right" align="start">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{emp.name}</p>
                    <p className="text-xs text-muted-foreground">{emp.id}</p>
                  </div>
                </div>

                {/* Today's Attendance */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      Today's Attendance
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${getAttendanceStatusColor(emp.attendanceStatus)}`}>
                      {emp.attendanceStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Check-in */}
                    <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3 border border-green-100 dark:border-green-900">
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
                        <LogIn className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">Check In</span>
                      </div>
                      <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                        {emp.checkIn || '--'}
                      </p>
                    </div>

                    {/* Check-out */}
                    <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-3 border border-red-100 dark:border-red-900">
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-1">
                        <LogOut className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">Check Out</span>
                      </div>
                      <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                        {emp.checkOut || '--'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Leave Balance */}
                <div className="pt-2 border-t space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Leave Balance</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-muted/50 rounded p-2">
                      <span className="text-muted-foreground text-xs">Annual</span>
                      <p className="font-semibold">{emp.remainingAnnualLeave} days</p>
                    </div>
                    <div className="bg-muted/50 rounded p-2">
                      <span className="text-muted-foreground text-xs">Sick</span>
                      <p className="font-semibold">{emp.remainingSickLeave} days</p>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="pt-2 border-t space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{emp.phone}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Profile
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost" className="px-2">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Details</DropdownMenuItem>
                      <DropdownMenuItem>Send Email</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>

      {/* Empty State */}
      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No employees found matching your search.</p>
        </div>
      )}
    </DashboardLayout>
  );
}
