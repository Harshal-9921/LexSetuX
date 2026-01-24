import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import BookingsPanel from '@/components/BookingsPanel';
import CaseInputForm from '@/components/CaseInputForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Scale, Users, FileText, Calendar, TrendingUp, Clock, ArrowLeft } from 'lucide-react';

const LawyerDashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [showCaseForm, setShowCaseForm] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth', { replace: true });
      } else if (profile && profile.role !== 'lawyer') {
        navigate('/client-dashboard', { replace: true });
      }
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-legal-blue"></div>
      </div>
    );
  }

  const stats = [
    { label: 'Active Cases', value: '12', icon: FileText, color: 'text-legal-blue' },
    { label: 'Total Clients', value: '48', icon: Users, color: 'text-legal-gold' },
    { label: 'Consultations', value: '8', icon: Calendar, color: 'text-green-600' },
    { label: 'Success Rate', value: '94%', icon: TrendingUp, color: 'text-purple-600' },
  ];

  const recentCases = [
    { id: 1, title: 'Property Dispute - Ram Kumar', category: 'Property Law', status: 'In Progress', priority: 'High' },
    { id: 2, title: 'Employment Termination - Priya Singh', category: 'Employment', status: 'New', priority: 'Medium' },
    { id: 3, title: 'Consumer Rights - Amit Sharma', category: 'Consumer Rights', status: 'Under Review', priority: 'Low' },
  ];

  const upcomingConsultations = [
    { client: 'Rajesh Patel', time: 'Today, 2:00 PM', type: 'Property Law' },
    { client: 'Sunita Reddy', time: 'Tomorrow, 10:30 AM', type: 'Family Law' },
    { client: 'Vikram Mehta', time: 'Tomorrow, 3:00 PM', type: 'Corporate Law' },
  ];

  if (showCaseForm) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Button 
              variant="ghost" 
              onClick={() => setShowCaseForm(false)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <CaseInputForm />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Welcome back, {profile?.full_name || 'Lawyer'}
          </h1>
          <p className="text-muted-foreground">Here's an overview of your practice</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="shadow-card-soft hover:shadow-legal transition-all">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-legal-blue-light/30`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bookings Panel */}
        <div className="mb-8">
          <BookingsPanel userRole={profile?.role || 'lawyer'} />
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Cases */}
          <div className="lg:col-span-2">
            <Card className="shadow-card-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-legal-blue" />
                  <span>Recent Cases</span>
                </CardTitle>
                <CardDescription>Cases requiring your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentCases.map((case_item) => (
                    <div key={case_item.id} className="p-4 border border-border rounded-lg hover:border-legal-blue/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{case_item.title}</h3>
                          <p className="text-sm text-muted-foreground">{case_item.category}</p>
                        </div>
                        <Badge variant={case_item.priority === 'High' ? 'destructive' : 'outline'}>
                          {case_item.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <Badge variant="outline" className="border-legal-blue/30 text-legal-blue">
                          {case_item.status}
                        </Badge>
                        <Button variant="ghost" size="sm">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">View All Cases</Button>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Consultations */}
          <div>
            <Card className="shadow-card-soft bg-legal-blue-light/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-legal-blue">
                  <Clock className="h-5 w-5" />
                  <span>Upcoming Consultations</span>
                </CardTitle>
                <CardDescription>Your schedule for today and tomorrow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingConsultations.map((consultation, index) => (
                    <div key={index} className="p-3 bg-white dark:bg-background rounded-lg border border-legal-blue/20">
                      <p className="font-medium text-foreground">{consultation.client}</p>
                      <p className="text-sm text-muted-foreground mt-1">{consultation.time}</p>
                      <Badge variant="outline" className="mt-2 border-legal-blue/30 text-legal-blue text-xs">
                        {consultation.type}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">View Full Schedule</Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-card-soft mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="hero" size="sm" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Consultation
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setShowCaseForm(true)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Describe Your Legal Case
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  View All Clients
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LawyerDashboard;
