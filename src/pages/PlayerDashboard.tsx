import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity,
  Target,
  Trophy,
  TrendingUp,
  Calendar
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const PlayerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    attendance: 0,
    trainings: 0,
    matches: 0
  });

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        // Get player's team_id
        const { data: profile } = await supabase
          .from('profiles')
          .select('team_id')
          .eq('id', user.id)
          .single();

        if (!profile?.team_id) return;

        // Fetch all activities from the last 3 months where end_time has passed
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        const { data: activities } = await supabase
          .from('activities')
          .select('id, activity_type, end_time')
          .eq('team_id', profile.team_id)
          .lt('end_time', new Date().toISOString())
          .gte('start_time', threeMonthsAgo.toISOString());

        // Fetch callup responses for completed activities
        const activityIds = activities?.map(a => a.id) || [];
        const { data: responses } = await supabase
          .from('callup_responses')
          .select('status, activity_id')
          .eq('player_id', user.id)
          .in('activity_id', activityIds);

        // Calculate statistics
        const totalActivities = activities?.length || 0;
        const confirmedResponses = responses?.filter(r => r.status === 'confirmed').length || 0;
        const attendanceRate = totalActivities > 0 ? Math.round((confirmedResponses / totalActivities) * 100) : 0;

        const trainings = activities?.filter(a => a.activity_type === 'training').length || 0;
        const matches = activities?.filter(a => a.activity_type === 'match').length || 0;

        setStats({
          attendance: attendanceRate,
          trainings,
          matches
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Kunde inte hämta statistik');
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
            Min översikt
          </h1>
          <p className="text-muted-foreground text-lg">
            Din statistik och resultat
          </p>
        </div>

        {/* Personal Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Närvaro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.attendance}%</div>
              <p className="text-xs text-muted-foreground mt-1">Senaste 3 månaderna</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Träningar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.trainings}</div>
              <p className="text-xs text-muted-foreground mt-1">Genomförda träningar senaste 3 månaderna</p>
            </CardContent>
          </Card>


          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Matcher
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.matches}</div>
              <p className="text-xs text-muted-foreground mt-1">Genomförda matcher senaste 3 månaderna</p>
            </CardContent>
          </Card>
        </div>

      </main>
    </div>
  );
};

export default PlayerDashboard;
