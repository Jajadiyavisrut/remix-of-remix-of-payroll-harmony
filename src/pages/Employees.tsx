import { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Mail, Phone, Clock, LogIn, LogOut } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox as CheckboxUI } from '@/components/ui/checkbox';
import { useProfiles } from '@/hooks/useProfiles';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
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
import { Skeleton } from '@/components/ui/skeleton';

const getStatusIndicatorColor = (status?: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'inactive':
      return 'bg-red-500';
    default:
      return 'bg-muted';
  }
};

export default function Employees() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const { data: employees, isLoading } = useProfiles();

  const filteredEmployees = employees?.filter(emp =>
    emp.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const toggleEmployeeSelection = (id: string) => {
    setSelectedEmployees(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout title="Employees" subtitle="Manage your team members and their information">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or department..."
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
                New employees should sign up through the login page. Their profile will be created automatically.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 text-center text-muted-foreground">
              <p>Share the signup link with the new employee to get started.</p>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Employee Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : (
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
                      className={`h-3 w-3 rounded-full ${getStatusIndicatorColor(emp.status || undefined)} ring-2 ring-background shadow-sm`}
                      title={emp.status === 'active' ? 'Active' : 'Inactive'}
                    />
                  </div>

                  <CardContent className="p-5">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center text-center mb-4">
                      <Avatar className="h-16 w-16 mb-3 ring-2 ring-background shadow-md">
                        <AvatarImage src={emp.avatar_url || undefined} alt={emp.full_name} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-lg font-semibold text-primary">
                          {emp.full_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-foreground">{emp.full_name}</h3>
                      <p className="text-xs text-muted-foreground">{emp.email}</p>
                    </div>

                    {/* Role & Department */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Role</span>
                        <span className="font-medium">{emp.position || 'Not assigned'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Dept</span>
                        <span className="font-medium">{emp.department || 'Not assigned'}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mt-4 flex justify-center">
                      <StatusBadge status={emp.status as 'active' | 'inactive' || 'active'} />
                    </div>
                  </CardContent>
                </Card>
              </HoverCardTrigger>

              {/* Hover Card with Details */}
              <HoverCardContent className="w-72" side="right" align="start">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={emp.avatar_url || undefined} alt={emp.full_name} />
                      <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                        {emp.full_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{emp.full_name}</p>
                      <p className="text-xs text-muted-foreground">{emp.position}</p>
                    </div>
                  </div>

                  {/* Leave Balance */}
                  <div className="pt-2 border-t space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Leave Balance</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-muted/50 rounded p-2">
                        <span className="text-muted-foreground text-xs">Annual</span>
                        <p className="font-semibold">{emp.remaining_annual_leave || 0} days</p>
                      </div>
                      <div className="bg-muted/50 rounded p-2">
                        <span className="text-muted-foreground text-xs">Sick</span>
                        <p className="font-semibold">{emp.remaining_sick_leave || 0} days</p>
                      </div>
                    </div>
                  </div>

                  {/* Salary */}
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Salary</span>
                      <span className="font-semibold">{formatCurrency(emp.salary)}</span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="pt-2 border-t space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="truncate">{emp.email}</span>
                    </div>
                    {emp.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{emp.phone}</span>
                      </div>
                    )}
                    {emp.join_date && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Joined {format(new Date(emp.join_date), 'MMM d, yyyy')}</span>
                      </div>
                    )}
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
      )}

      {/* Empty State */}
      {!isLoading && filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No employees found matching your search.</p>
        </div>
      )}
    </DashboardLayout>
  );
}
