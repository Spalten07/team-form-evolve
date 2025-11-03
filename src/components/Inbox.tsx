import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { sv } from "date-fns/locale";

interface CallupResponse {
  id: string;
  activity_id: string;
  status: 'pending' | 'confirmed' | 'declined';
  decline_reason: string | null;
  created_at: string;
  activity: {
    id: string;
    title: string;
    description: string | null;
    activity_type: string;
    start_time: string;
    end_time: string;
    created_by: string;
  };
}

interface InboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnreadCountChange?: (count: number) => void;
}

export const Inbox = ({ open, onOpenChange, onUnreadCountChange }: InboxProps) => {
  const { user } = useAuth();
  const [callups, setCallups] = useState<CallupResponse[]>([]);
  const [selectedCallup, setSelectedCallup] = useState<CallupResponse | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch callups from database
  useEffect(() => {
    if (!user) return;

    const fetchCallups = async () => {
      try {
        const { data, error } = await supabase
          .from('callup_responses')
          .select(`
            *,
            activity:activities(*)
          `)
          .eq('player_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCallups((data || []) as CallupResponse[]);
        
        // Count pending callups AND pending theory assignments as unread
        const pendingCallups = (data || []).filter(c => c.status === 'pending').length;
        
        // Fetch pending theory assignments
        const { data: theoryData } = await supabase
          .from('theory_assignments')
          .select('id')
          .eq('assigned_to', user.id)
          .eq('completed', false);
        
        const pendingTheory = (theoryData || []).length;
        onUnreadCountChange?.(pendingCallups + pendingTheory);
      } catch (error: any) {
        console.error('Error fetching callups:', error);
        toast.error("Kunde inte hämta kallelser");
      }
    };

    fetchCallups();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('callup-responses-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'callup_responses',
          filter: `player_id=eq.${user.id}`
        },
        () => {
          fetchCallups();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, onUnreadCountChange]);

  const handleResponse = async (callupId: string, status: 'confirmed' | 'declined') => {
    if (status === 'declined' && !declineReason.trim()) {
      toast.error("Ange en anledning till varför du inte kan komma");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('callup_responses')
        .update({
          status,
          decline_reason: status === 'declined' ? declineReason : null
        })
        .eq('id', callupId);

      if (error) throw error;

      toast.success(status === 'confirmed' ? "Du har bekräftat din närvaro" : "Du har avsagt dig");
      setSelectedCallup(null);
      setDeclineReason("");
    } catch (error: any) {
      console.error('Error updating callup response:', error);
      toast.error("Kunde inte uppdatera svar");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-success/10 text-success"><CheckCircle className="w-3 h-3 mr-1" />Bekräftad</Badge>;
      case "declined":
        return <Badge className="bg-destructive/10 text-destructive"><XCircle className="w-3 h-3 mr-1" />Avsagd</Badge>;
      default:
        return <Badge className="bg-warning/10 text-warning"><AlertCircle className="w-3 h-3 mr-1" />Väntande svar</Badge>;
    }
  };

  const parseActivityDetails = (activity: any) => {
    const location = activity.description?.match(/Plats:\s*(.+?)(?:\n|$)/)?.[1] || "Plats ej angiven";
    const gatherTime = activity.description?.match(/Samling:\s*(.+?)(?:\n|$)/)?.[1];
    const bringItems = activity.description?.match(/Medtages:\s*(.+?)(?:\n|$)/)?.[1];
    
    return {
      location,
      gatherTime,
      bringItems,
      time: format(parseISO(activity.start_time), 'HH:mm'),
      endTime: format(parseISO(activity.end_time), 'HH:mm'),
      date: format(parseISO(activity.start_time), 'PPP', { locale: sv })
    };
  };

  return (
    <>
      <Dialog open={open && !selectedCallup} onOpenChange={(isOpen) => {
        if (!isOpen) setSelectedCallup(null);
        onOpenChange(isOpen);
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-6 h-6" />
              Inkorg
            </DialogTitle>
            <DialogDescription>
              {callups.filter(c => c.status === 'pending').length} väntande kallelser
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2">
            {callups.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Inga kallelser än
              </div>
            ) : (
              callups.map((callup) => {
                const details = parseActivityDetails(callup.activity);
                return (
                  <Card 
                    key={callup.id}
                    className={`cursor-pointer hover:shadow-md transition-all ${callup.status === 'pending' ? 'border-primary border-2' : ''}`}
                    onClick={() => setSelectedCallup(callup)}
                  >
                    <CardHeader className="py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${callup.status === 'pending' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="bg-primary/10 text-primary">Kallelse</Badge>
                              {getStatusBadge(callup.status)}
                            </div>
                            <CardTitle className="text-base truncate">{callup.activity.title}</CardTitle>
                            <CardDescription className="text-xs">
                              {details.date} • {details.time}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Callup Details Dialog */}
      <Dialog open={!!selectedCallup} onOpenChange={(isOpen) => {
        if (!isOpen) {
          setSelectedCallup(null);
          setDeclineReason("");
        }
      }}>
        <DialogContent className="max-w-lg">
          {selectedCallup && (() => {
            const details = parseActivityDetails(selectedCallup.activity);
            return (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedCallup.activity.title}</DialogTitle>
                  <DialogDescription>
                    {details.date}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">
                      {selectedCallup.activity.activity_type === "match" ? "Match" : "Träning"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Tid</div>
                      <div className="text-sm text-muted-foreground">
                        Start: {details.time}
                        {details.gatherTime && ` • Samling: ${details.gatherTime}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Plats</div>
                      <div className="text-sm text-muted-foreground">{details.location}</div>
                    </div>
                  </div>

                  {details.bringItems && (
                    <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                      <div className="font-medium mb-1">Medtages</div>
                      <div className="text-sm">{details.bringItems}</div>
                    </div>
                  )}

                  {/* Status display */}
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <div className="font-medium mb-2">Din status</div>
                    {getStatusBadge(selectedCallup.status)}
                    {selectedCallup.status === 'declined' && selectedCallup.decline_reason && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span className="font-medium">Anledning: </span>
                        {selectedCallup.decline_reason}
                      </div>
                    )}
                  </div>

                  {/* Response buttons */}
                  {selectedCallup.status === 'pending' && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Button 
                          variant="default" 
                          className="flex-1 gap-2"
                          onClick={() => handleResponse(selectedCallup.id, 'confirmed')}
                          disabled={loading}
                        >
                          <CheckCircle className="w-4 h-4" />
                          Ja, jag kommer
                        </Button>
                        <Button 
                          variant="destructive" 
                          className="flex-1 gap-2"
                          onClick={() => {
                            if (!declineReason.trim()) {
                              // Show decline reason input
                              return;
                            }
                            handleResponse(selectedCallup.id, 'declined');
                          }}
                          disabled={loading}
                        >
                          <XCircle className="w-4 h-4" />
                          Nej
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="decline-reason">
                          Kan du inte komma? Ange anledning nedan:
                        </Label>
                        <Textarea
                          id="decline-reason"
                          placeholder="T.ex. Sjuk, annan aktivitet, familjeåtagande..."
                          value={declineReason}
                          onChange={(e) => setDeclineReason(e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Button variant="outline" onClick={() => {
                  setSelectedCallup(null);
                  setDeclineReason("");
                }}>
                  Stäng
                </Button>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </>
  );
};