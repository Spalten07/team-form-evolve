import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, History, CalendarDays, Filter, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format, parseISO, addWeeks, startOfWeek, addDays, isSameDay } from "date-fns";
import { sv } from "date-fns/locale";

interface Activity {
  id: string;
  title: string;
  description: string | null;
  activity_type: string;
  start_time: string;
  end_time: string;
  created_by: string;
}

interface CallupResponse {
  status: 'pending' | 'confirmed' | 'declined';
}

const PlayerCalendar = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [callupResponses, setCallupResponses] = useState<Record<string, CallupResponse>>({});
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [activityFilter, setActivityFilter] = useState("all");

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Fetch activities and callup responses
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Get player's team
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('team_id')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        if (!profileData?.team_id) return;

        // Fetch activities for the team
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('activities')
          .select('*')
          .eq('team_id', profileData.team_id)
          .order('start_time', { ascending: true });

        if (activitiesError) throw activitiesError;
        setActivities(activitiesData || []);

        // Fetch callup responses for this player
        const { data: responsesData, error: responsesError } = await supabase
          .from('callup_responses')
          .select('activity_id, status')
          .eq('player_id', user.id);

        if (responsesError) throw responsesError;

        // Create a map of activity_id -> response
        const responsesMap: Record<string, CallupResponse> = {};
        (responsesData || []).forEach(response => {
          responsesMap[response.activity_id] = { status: response.status as 'pending' | 'confirmed' | 'declined' };
        });
        setCallupResponses(responsesMap);

      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast.error("Kunde inte hämta aktiviteter");
      }
    };

    fetchData();

    // Subscribe to realtime updates
    const activitiesChannel = supabase
      .channel('player-activities')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activities'
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    const responsesChannel = supabase
      .channel('player-responses')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'callup_responses',
          filter: `player_id=eq.${user.id}`
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(activitiesChannel);
      supabase.removeChannel(responsesChannel);
    };
  }, [user]);

  // Get the days for the current week
  const getWeekDays = () => {
    return Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  };

  // Navigate to previous/next week
  const goToPreviousWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, -1));
  const goToNextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  const goToCurrentWeek = () => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));

  // Get activities for a specific day and time slot
  const getActivitiesForTimeSlot = (day: Date, hour: number) => {
    return activities.filter(activity => {
      if (activityFilter !== "all" && activity.activity_type !== activityFilter) {
        return false;
      }
      const activityStart = parseISO(activity.start_time);
      const activityHour = activityStart.getHours();
      return isSameDay(activityStart, day) && activityHour === hour;
    });
  };

  // Calculate activity positioning within time slot
  const calculateActivityStyle = (activity: Activity) => {
    const start = parseISO(activity.start_time);
    const end = parseISO(activity.end_time);
    
    const startMinutes = start.getMinutes();
    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = durationMs / (1000 * 60);
    
    const topPercent = (startMinutes / 60) * 100;
    const hourSlotHeight = 20;
    const heightPx = (durationMinutes / 60) * hourSlotHeight;
    
    return {
      top: `${topPercent}%`,
      height: `${heightPx}px`
    };
  };

  const weekDays = getWeekDays();

  // Count statistics
  const upcomingActivities = activities.filter(a => new Date(a.start_time) > new Date());
  const trainings = upcomingActivities.filter(a => a.activity_type === 'training');
  const matches = upcomingActivities.filter(a => a.activity_type === 'match');
  const confirmedCount = upcomingActivities.filter(a => callupResponses[a.id]?.status === 'confirmed').length;

  const getStatusBadge = (activityId: string) => {
    const response = callupResponses[activityId];
    if (!response) return null;
    
    switch (response.status) {
      case "confirmed":
        return <Badge className="bg-success/10 text-success"><CheckCircle className="w-3 h-3 mr-1" />Bekräftad</Badge>;
      case "declined":
        return <Badge className="bg-destructive/10 text-destructive"><XCircle className="w-3 h-3 mr-1" />Avsagd</Badge>;
      default:
        return <Badge className="bg-warning/10 text-warning"><AlertCircle className="w-3 h-3 mr-1" />Väntande</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
            Min kalender
          </h1>
          <p className="text-muted-foreground text-sm mb-4">
            Se dina kommande träningar och matcher
          </p>
        </div>

        {/* Calendar Overview */}
        <Card className="mb-6 bg-gradient-primary text-primary-foreground border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Översikt
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-primary-foreground/10 backdrop-blur rounded-lg p-3">
                <div className="text-2xl font-bold">{trainings.length}</div>
                <div className="text-xs opacity-90 leading-tight">Träningar</div>
              </div>
              <div className="bg-primary-foreground/10 backdrop-blur rounded-lg p-3">
                <div className="text-2xl font-bold">{matches.length}</div>
                <div className="text-xs opacity-90 leading-tight">Matcher</div>
              </div>
              <div className="bg-primary-foreground/10 backdrop-blur rounded-lg p-3">
                <div className="text-2xl font-bold">{confirmedCount}</div>
                <div className="text-xs opacity-90 leading-tight">Bekräftade</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Week Calendar */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="w-6 h-6" />
                  Veckoschema
                </CardTitle>
                <CardDescription className="text-xs">Dina träningar och matcher</CardDescription>
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Button
                  variant={activityFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActivityFilter("all")}
                >
                  Alla
                </Button>
                <Button
                  variant={activityFilter === "training" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActivityFilter("training")}
                >
                  Träningar
                </Button>
                <Button
                  variant={activityFilter === "match" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActivityFilter("match")}
                >
                  Matcher
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-1 mb-2 justify-center">
              <Button variant="outline" size="sm" className="h-6 text-xs px-2" onClick={goToPreviousWeek}>← Föreg.</Button>
              <Button 
                variant="default"
                size="sm"
                className="h-6 text-xs px-2"
                onClick={goToCurrentWeek}
              >
                Denna vecka
              </Button>
              <Button variant="outline" size="sm" className="h-6 text-xs px-2" onClick={goToNextWeek}>Nästa →</Button>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <div className="w-full">
                <div className="grid grid-cols-[50px_repeat(7,1fr)] w-full">
                  <div className="p-0.5 text-sm font-semibold border-r border-b text-center flex items-center justify-center h-12">Tid</div>
                  {weekDays.map((day, idx) => (
                    <div key={`hdr-${idx}`} className={`p-0.5 text-sm font-semibold ${idx < 6 ? 'border-r' : ''} border-b text-center flex flex-col items-center justify-center h-12`}>
                      <div>{format(day, 'EEEEEE', { locale: sv }).toUpperCase()}</div>
                      <div className="text-xs font-normal text-muted-foreground">{format(day, 'd/M')}</div>
                    </div>
                  ))}

                  {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"].map((time, idx) => {
                    const rowHeight = 'h-5';
                    return (
                      <React.Fragment key={`row-${time}-${idx}`}>
                        <div className={`p-0.5 text-[8px] font-medium text-muted-foreground border-r border-t bg-secondary/30 flex items-center justify-center ${rowHeight}`}>
                          {time}
                        </div>
                        {weekDays.map((day, dayIdx) => {
                          const hour = parseInt(time.split(':')[0]);
                          const dayActivities = getActivitiesForTimeSlot(day, hour);
                          
                          return (
                            <div key={`${time}-${dayIdx}`} className={`${dayIdx < 6 ? 'border-r' : ''} border-t relative ${rowHeight}`}>
                              <div className="absolute top-[25%] left-0 right-0 h-[1px] bg-border/50"></div>
                              <div className="absolute top-[50%] left-0 right-0 h-[1px] bg-border/50"></div>
                              <div className="absolute top-[75%] left-0 right-0 h-[1px] bg-border/50"></div>
                              
                              {dayActivities.map((activity) => {
                                const style = calculateActivityStyle(activity);
                                const startTime = format(parseISO(activity.start_time), 'HH:mm');
                                const endTime = format(parseISO(activity.end_time), 'HH:mm');
                                const response = callupResponses[activity.id];
                                const bgColor = response?.status === 'confirmed' 
                                  ? 'bg-success/30 border-success' 
                                  : response?.status === 'declined'
                                  ? 'bg-destructive/30 border-destructive'
                                  : 'bg-primary/30 border-primary';
                                
                                return (
                                  <div 
                                    key={activity.id}
                                    className={`absolute left-0 right-0 ${bgColor} border-l-4 p-0.5 z-10 flex flex-col items-center justify-start overflow-hidden`}
                                    style={style}
                                  >
                                    <p className="text-[7px] font-bold leading-tight truncate w-full text-center">
                                      {activity.title}
                                    </p>
                                    <p className="text-[6px] text-muted-foreground leading-tight">
                                      {startTime}-{endTime}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Activities List */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Kommande aktiviteter</CardTitle>
            <CardDescription className="text-xs">
              Dina närmaste träningar och matcher
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingActivities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Inga kommande aktiviteter
                </div>
              ) : (
                upcomingActivities.slice(0, 5).map((activity) => {
                  const startDate = parseISO(activity.start_time);
                  const location = activity.description?.match(/Plats:\s*(.+?)(?:\n|$)/)?.[1] || "Plats ej angiven";
                  
                  return (
                    <Card key={activity.id} className="hover:shadow-md transition-all">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex flex-col items-center justify-center bg-primary/10 rounded-lg p-3 min-w-[60px]">
                              <div className="text-2xl font-bold text-primary">
                                {format(startDate, 'd')}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {format(startDate, 'MMM', { locale: sv })}
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <Badge variant="outline">
                                  {activity.activity_type === 'match' ? 'Match' : 'Träning'}
                                </Badge>
                                {getStatusBadge(activity.id)}
                              </div>
                              <h3 className="font-semibold text-lg">{activity.title}</h3>
                              <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {format(startDate, 'HH:mm')}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {location}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PlayerCalendar;