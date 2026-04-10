import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import apiClient, { LawyerProfile as LawyerProfileType } from '@/services/api';
import { Scale, ArrowLeft } from 'lucide-react';

interface LawyerProfileForm {
  specializationText: string;
  experienceYears: string;
  location: string;
  hourlyRate: string;
  bio: string;
  isAvailable: boolean;
}

const LawyerProfile = () => {
  const { user, profile, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [lawyerProfile, setLawyerProfile] = useState<LawyerProfileType | null>(null);
  const [profileForm, setProfileForm] = useState<LawyerProfileForm>({
    specializationText: '',
    experienceYears: '',
    location: '',
    hourlyRate: '',
    bio: '',
    isAvailable: true,
  });

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth', { replace: true });
        return;
      }
      if (profile && profile.role !== 'lawyer') {
        navigate('/client-dashboard', { replace: true });
        return;
      }
      loadLawyerProfile();
    }
  }, [loading, user, profile, navigate]);

  const mapProfileToForm = (data: LawyerProfileType): LawyerProfileForm => ({
    specializationText: data.specialization?.join(', ') || '',
    experienceYears: data.experience_years?.toString() || '',
    location: data.location || '',
    hourlyRate: data.hourly_rate?.toString() || '',
    bio: data.bio || '',
    isAvailable: data.is_available,
  });

  const loadLawyerProfile = async () => {
    try {
      setProfileLoading(true);
      const data = await apiClient.getLawyerProfile();
      setLawyerProfile(data);
      setProfileExists(true);
      setProfileForm(mapProfileToForm(data));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load lawyer profile';
      if (message.toLowerCase().includes('not found')) {
        setProfileExists(false);
      } else {
        toast({
          title: 'Profile load failed',
          description: message,
          variant: 'destructive',
        });
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const updateProfileForm = (key: keyof LawyerProfileForm, value: string | boolean) => {
    setProfileForm((prev) => ({ ...prev, [key]: value }));
  };

  const parseSpecializations = (raw: string) =>
    raw
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

  const handleSaveProfile = async () => {
    const specialization = parseSpecializations(profileForm.specializationText);

    if (specialization.length === 0) {
      toast({
        title: 'Validation error',
        description: 'Please enter at least one specialization.',
        variant: 'destructive',
      });
      return;
    }

    const experienceYears = profileForm.experienceYears.trim()
      ? Number(profileForm.experienceYears)
      : undefined;
    const hourlyRate = profileForm.hourlyRate.trim()
      ? Number(profileForm.hourlyRate)
      : undefined;

    if (experienceYears !== undefined && Number.isNaN(experienceYears)) {
      toast({
        title: 'Validation error',
        description: 'Experience must be a valid number.',
        variant: 'destructive',
      });
      return;
    }

    if (hourlyRate !== undefined && Number.isNaN(hourlyRate)) {
      toast({
        title: 'Validation error',
        description: 'Hourly rate must be a valid number.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setProfileSaving(true);
      const saved = await apiClient.upsertLawyerProfile({
        specialization,
        experience_years: experienceYears,
        location: profileForm.location.trim() || undefined,
        hourly_rate: hourlyRate,
        bio: profileForm.bio.trim() || undefined,
        is_available: profileForm.isAvailable,
      });

      setLawyerProfile(saved);
      setProfileExists(true);
      setProfileForm(mapProfileToForm(saved));

      toast({
        title: 'Profile saved',
        description: 'Your lawyer profile has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Save failed',
        description: error instanceof Error ? error.message : 'Failed to save profile',
        variant: 'destructive',
      });
    } finally {
      setProfileSaving(false);
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-legal-blue"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Button variant="ghost" onClick={() => navigate('/lawyer-dashboard')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Lawyer Dashboard
        </Button>

        <Card className="shadow-card-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-legal-blue" />
              Lawyer Profile
            </CardTitle>
            <CardDescription>
              Add or edit your professional details shown to clients.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specialization">Specializations</Label>
                <Input
                  id="specialization"
                  placeholder="Example: Criminal Law, Family Law"
                  value={profileForm.specializationText}
                  onChange={(e) => updateProfileForm('specializationText', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Use comma-separated values.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City, State"
                  value={profileForm.location}
                  onChange={(e) => updateProfileForm('location', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience (years)</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  value={profileForm.experienceYears}
                  onChange={(e) => updateProfileForm('experienceYears', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate (INR)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  min="0"
                  value={profileForm.hourlyRate}
                  onChange={(e) => updateProfileForm('hourlyRate', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Write a short professional bio"
                value={profileForm.bio}
                onChange={(e) => updateProfileForm('bio', e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <div className="flex items-center justify-between border rounded-lg px-4 py-3">
              <div>
                <p className="text-sm font-medium">Available for new cases</p>
                <p className="text-xs text-muted-foreground">Turn off if you are not accepting new clients.</p>
              </div>
              <Switch
                checked={profileForm.isAvailable}
                onCheckedChange={(value) => updateProfileForm('isAvailable', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {profileExists ? 'You can update your profile anytime.' : 'Create your profile to appear in recommendations.'}
              </p>
              <Button onClick={handleSaveProfile} disabled={profileSaving}>
                {profileSaving ? 'Saving...' : profileExists ? 'Update Profile' : 'Create Profile'}
              </Button>
            </div>

            {lawyerProfile && (
              <p className="text-xs text-muted-foreground">
                Current rating: {lawyerProfile.rating.toFixed(1)}
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LawyerProfile;
