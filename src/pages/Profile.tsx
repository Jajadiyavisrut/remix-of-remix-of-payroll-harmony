import { useState } from 'react';
import { Mail, Phone, MapPin, Building2, Calendar, Edit2, Save, X } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 234 567 890',
    address: '123 Main Street, San Francisco, CA 94102',
    emergencyContact: 'Jane Smith - +1 234 567 899',
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been updated successfully.',
    });
  };

  return (
    <DashboardLayout title="My Profile" subtitle="View and manage your personal information">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="text-center">
              <div className="h-24 w-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-3xl font-semibold text-primary">
                  {user?.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.position}</p>
              <p className="text-sm text-primary mt-1 capitalize">{user?.role}</p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>+1 234 567 890</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>{user?.department}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined Jan 15, 2022</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full mt-6"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="bg-card rounded-xl border border-border p-6 mt-6">
            <h3 className="font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Leave Balance</span>
                <span className="font-medium">18 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Attendance Rate</span>
                <span className="font-medium text-success">96%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Projects</span>
                <span className="font-medium">5 active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Team Size</span>
                <span className="font-medium">12 members</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold mb-6">Personal Information</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input 
                      type="date"
                      defaultValue="1990-05-15"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Address</Label>
                    <Input 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Emergency Contact</Label>
                    <Input 
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                {isEditing && (
                  <div className="flex justify-end mt-6">
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="employment">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold mb-6">Employment Details</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Employee ID</Label>
                    <Input value="EMP-2022-001" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Input value={user?.department} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Input value={user?.position} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Employment Type</Label>
                    <Input value="Full-time" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Join Date</Label>
                    <Input value="January 15, 2022" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Reporting Manager</Label>
                    <Input value="Sarah Johnson" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Work Location</Label>
                    <Input value="San Francisco Office" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Work Schedule</Label>
                    <Input value="Mon - Fri, 9:00 AM - 6:00 PM" disabled />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documents">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold mb-6">Documents</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Employment Contract', date: 'Jan 15, 2022', type: 'PDF' },
                    { name: 'ID Verification', date: 'Jan 10, 2022', type: 'PDF' },
                    { name: 'Tax Form W-4', date: 'Jan 12, 2022', type: 'PDF' },
                    { name: 'NDA Agreement', date: 'Jan 15, 2022', type: 'PDF' },
                  ].map((doc) => (
                    <div key={doc.name} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">{doc.type}</span>
                        </div>
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">Uploaded on {doc.date}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
