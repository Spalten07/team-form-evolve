import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const TeamCodeCard = () => {
  const [teamCode, setTeamCode] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [playerCount, setPlayerCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchTeamData = async () => {
      try {
        // Fetch team data
        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .select('team_code, id')
          .eq('coach_id', user.id)
          .single();

        if (teamError) throw teamError;
        if (teamData) {
          setTeamCode(teamData.team_code);

          // Fetch player count
          const { data: players, error: playersError } = await supabase
            .from('profiles')
            .select('id')
            .eq('team_id', teamData.id)
            .eq('role', 'player');

          if (!playersError && players) {
            setPlayerCount(players.length);
          }
        }
      } catch (error: any) {
        console.error('Error fetching team data:', error);
        toast.error("Kunde inte hämta lagkod");
      }
    };

    fetchTeamData();
  }, [user]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(teamCode);
      setCopied(true);
      toast.success("Lagkod kopierad!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Kunde inte kopiera lagkod");
    }
  };

  if (!teamCode) return null;

  return (
    <Card className="bg-gradient-primary text-primary-foreground border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Users className="w-6 h-6" />
          Din lagkod
        </CardTitle>
        <CardDescription className="text-primary-foreground/80">
          Dela denna kod med dina spelare för att de ska kunna gå med i laget
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-primary-foreground/10 backdrop-blur rounded-lg p-6 text-center">
            <div className="text-5xl font-bold tracking-widest mb-2">
              {teamCode}
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={copyToClipboard}
              className="mt-4"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Kopierad!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Kopiera kod
                </>
              )}
            </Button>
          </div>
          
          <div className="bg-primary-foreground/10 backdrop-blur rounded-lg p-4">
            <div className="text-3xl font-bold">{playerCount}</div>
            <div className="text-sm opacity-90">
              {playerCount === 1 ? "Spelare" : "Spelare"} i laget
            </div>
          </div>

          <div className="text-sm opacity-90">
            <p>📝 Spelare anger denna kod när de skapar sitt konto</p>
            <p className="mt-2">✉️ Du kan sedan skicka kallelser till alla spelare i laget</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
