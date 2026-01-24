import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle, Clock, User, FileText, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Booking {
  id: number;
  case_id: number;
  lawyer_id: number;
  customer_id: number;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  message?: string;
  booking_notes?: string;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  lawyer_name?: string;
  case_category?: string;
  case_description?: string;
}

const BookingsPanel = ({ userRole }: { userRole: 'customer' | 'lawyer' | 'admin' }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected' | 'cancelled'>('all');
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, [userRole]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getMyBookings(filter === 'all' ? undefined : filter);
      setBookings(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load bookings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId: number, newStatus: 'accepted' | 'rejected' | 'cancelled', notes?: string) => {
    try {
      setProcessingIds((prev) => [...prev, bookingId]);
      await apiClient.updateBookingStatus(bookingId, newStatus, notes);
      
      toast({
        title: 'Success',
        description: `Booking ${newStatus} successfully`,
      });

      // Update local state
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: newStatus, booking_notes: notes } : b
        )
      );
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update booking',
        variant: 'destructive',
      });
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== bookingId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'rejected':
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredBookings = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  const title = userRole === 'lawyer' ? 'Booking Requests' : 'My Bookings';
  const description =
    userRole === 'lawyer'
      ? 'Manage booking requests from clients'
      : 'Track your lawyer booking requests';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" onValueChange={(v) => setFilter(v as typeof filter)} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-legal-blue"></div>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No bookings found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {userRole === 'lawyer' ? booking.customer_name : booking.lawyer_name}
                          </h4>
                          <p className="text-sm text-muted-foreground">{booking.case_category}</p>
                        </div>
                      </div>
                      <Badge className={`flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="capitalize">{booking.status}</span>
                      </Badge>
                    </div>

                    {/* Case Details */}
                    {booking.case_description && (
                      <div className="mb-3 p-3 bg-muted/50 rounded border border-border/50">
                        <p className="text-sm text-foreground line-clamp-2">{booking.case_description}</p>
                      </div>
                    )}

                    {/* Booking Message */}
                    {booking.message && (
                      <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                        <p className="text-xs font-medium text-blue-900 dark:text-blue-300 mb-1">Message from customer:</p>
                        <p className="text-sm text-blue-800 dark:text-blue-200">{booking.message}</p>
                      </div>
                    )}

                    {/* Booking Notes */}
                    {booking.booking_notes && (
                      <div className="mb-3 p-3 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-800">
                        <p className="text-xs font-medium text-amber-900 dark:text-amber-300 mb-1">Lawyer notes:</p>
                        <p className="text-sm text-amber-800 dark:text-amber-200">{booking.booking_notes}</p>
                      </div>
                    )}

                    {/* Footer with Dates */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xs text-muted-foreground">
                        <span>
                          Requested: {new Date(booking.created_at).toLocaleDateString()} at{' '}
                          {new Date(booking.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions - Only show for lawyers if status is pending */}
                    {userRole === 'lawyer' && booking.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleUpdateStatus(booking.id, 'accepted')}
                          disabled={processingIds.includes(booking.id)}
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          {processingIds.includes(booking.id) ? 'Processing...' : 'Accept'}
                        </Button>
                        <Button
                          onClick={() => handleUpdateStatus(booking.id, 'rejected')}
                          disabled={processingIds.includes(booking.id)}
                          size="sm"
                          variant="outline"
                          className="flex-1"
                        >
                          {processingIds.includes(booking.id) ? 'Processing...' : 'Reject'}
                        </Button>
                      </div>
                    )}

                    {/* Status summary for accepted/rejected bookings */}
                    {booking.status !== 'pending' && (
                      <div className="text-sm text-muted-foreground">
                        {booking.status === 'accepted' && (
                          <span className="text-green-600 dark:text-green-400">✓ Booking accepted on {new Date(booking.updated_at).toLocaleDateString()}</span>
                        )}
                        {booking.status === 'rejected' && (
                          <span className="text-red-600 dark:text-red-400">✗ Booking rejected</span>
                        )}
                        {booking.status === 'cancelled' && (
                          <span className="text-gray-600 dark:text-gray-400">✗ Booking cancelled</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BookingsPanel;
