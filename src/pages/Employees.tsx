import { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Mail, Phone } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  joinDate: string;
  status: 'active' | 'inactive';
  salary: string;
}

const employees: Employee[] = [
  { id: '1', name: 'John Smith', email: 'john.smith@company.com', phone: '+1 234 567 890', department: 'Engineering', position: 'Senior Developer', joinDate: 'Jan 15, 2022', status: 'active', salary: '$95,000' },
  { id: '2', name: 'Emily Davis', email: 'emily.davis@company.com', phone: '+1 234 567 891', department: 'Design', position: 'UI/UX Designer', joinDate: 'Mar 20, 2022', status: 'active', salary: '$78,000' },
  { id: '3', name: 'Michael Brown', email: 'michael.brown@company.com', phone: '+1 234 567 892', department: 'Marketing', position: 'Marketing Manager', joinDate: 'Jun 10, 2021', status: 'active', salary: '$85,000' },
  { id: '4', name: 'Sarah Wilson', email: 'sarah.wilson@company.com', phone: '+1 234 567 893', department: 'HR', position: 'HR Specialist', joinDate: 'Sep 5, 2023', status: 'active', salary: '$65,000' },
  { id: '5', name: 'David Lee', email: 'david.lee@company.com', phone: '+1 234 567 894', department: 'Engineering', position: 'DevOps Engineer', joinDate: 'Nov 12, 2022', status: 'inactive', salary: '$92,000' },
  { id: '6', name: 'Jennifer Martinez', email: 'jennifer.m@company.com', phone: '+1 234 567 895', department: 'Sales', position: 'Sales Executive', joinDate: 'Feb 28, 2023', status: 'active', salary: '$72,000' },
];

export default function Employees() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout title="Employees" subtitle="Manage your team members and their information">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
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
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Enter the details of the new team member.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
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
                <Label htmlFor="salary">Annual Salary</Label>
                <Input id="salary" placeholder="$75,000" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Add Employee
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Employees Table */}
      <DataTable
        columns={[
          {
            key: 'name',
            header: 'Employee',
            render: (emp) => (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {emp.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{emp.name}</p>
                  <p className="text-sm text-muted-foreground">{emp.email}</p>
                </div>
              </div>
            ),
          },
          { key: 'department', header: 'Department' },
          { key: 'position', header: 'Position' },
          { key: 'joinDate', header: 'Join Date' },
          { key: 'salary', header: 'Salary' },
          {
            key: 'status',
            header: 'Status',
            render: (emp) => <StatusBadge status={emp.status} />,
          },
          {
            key: 'actions',
            header: '',
            render: (emp) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </DropdownMenuItem>
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Edit Details</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Deactivate
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ),
          },
        ]}
        data={filteredEmployees}
        keyExtractor={(emp) => emp.id}
        emptyMessage="No employees found"
        currentPage={1}
        totalPages={1}
      />
    </DashboardLayout>
  );
}
