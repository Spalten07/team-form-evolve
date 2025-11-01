import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, Copy, Check, Edit2, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function MyTeam() {
  const { user } = useAuth();
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [teamId, setTeamId] = useState("");
  const [playerCount, setPlayerCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTeamName, setEditedTeamName] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchTeamData = async () => {
      try {
        setLoading(true);
        
        // Fetch team information
        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .select('*')
          .eq('coach_id', user.id)
          .single();

        if (teamError) throw teamError;

        if (teamData) {
          setTeamName(teamData.name);
          setTeamCode(teamData.team_code);
          setTeamId(teamData.id);
          setEditedTeamName(teamData.name);

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
      } catch (error) {
        console.error('Error fetching team data:', error);
        toast.error('Kunde inte hämta lagdata');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [user]);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(teamCode);
    setCopied(true);
    toast.success('Lagkod kopierad!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveTeamName = async () => {
    if (!teamId || !editedTeamName.trim()) {
      toast.error('Lagnamnet kan inte vara tomt');
      return;
    }

    try {
      const { error } = await supabase
        .from('teams')
        .update({ name: editedTeamName.trim() })
        .eq('id', teamId);

      if (error) throw error;

      setTeamName(editedTeamName.trim());
      setIsEditing(false);
      toast.success('Lagnamnet har uppdaterats');
    } catch (error) {
      console.error('Error updating team name:', error);
      toast.error('Kunde inte uppdatera lagnamnet');
    }
  };

  const handleCancelEdit = () => {
    setEditedTeamName(teamName);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <p className="text-muted-foreground">Laddar...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
            Mitt lag
          </h1>
          <p className="text-muted-foreground text-lg">
            Hantera ditt lags information och bjud in spelare
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Team Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Laginformation
              </CardTitle>
              <CardDescription>
                Ditt lags namn och detaljer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="teamName">Lagnamn</Label>
                <div className="flex gap-2 mt-2">
                  {isEditing ? (
                    <>
                      <Input
                        id="teamName"
                        value={editedTeamName}
                        onChange={(e) => setEditedTeamName(e.target.value)}
                        placeholder="Ange lagnamn"
                      />
                      <Button
                        size="icon"
                        variant="default"
                        onClick={handleSaveTeamName}
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Input
                        id="teamName"
                        value={teamName}
                        disabled
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div>
                <Label>Antal spelare</Label>
                <div className="mt-2">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {playerCount} spelare
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Code */}
          <Card>
            <CardHeader>
              <CardTitle>Lagkod</CardTitle>
              <CardDescription>
                Dela denna kod med dina spelare så att de kan gå med i laget
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="teamCode">Din unika lagkod</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="teamCode"
                    value={teamCode}
                    disabled
                    className="text-2xl font-mono font-bold tracking-wider"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleCopyCode}
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-success" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Tips:</strong> Spelare anger denna kod när de registrerar sig för att automatiskt kopplas till ditt lag.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle>Så här bjuder du in spelare</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Kopiera din lagkod ovan</li>
              <li>Dela koden med dina spelare (via mail, sms, eller i gruppen)</li>
              <li>Be spelarna att registrera sig på appen och ange lagkoden</li>
              <li>Spelarna kommer automatiskt att kopplas till ditt lag</li>
            </ol>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
