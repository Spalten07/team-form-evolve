import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Send, 
  ClipboardList, 
  TrendingUp, 
  Calendar,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useState } from "react";

interface Player {
  id: number;
  name: string;
  email: string;
  attendanceRate: number;
  personalTrainingSessions: number;
  lastTraining: string;
  upcomingTrainings: number;
}

const mockPlayers: Player[] = [
  {
    id: 1,
    name: "Erik Andersson",
    email: "erik.andersson@email.se",
    attendanceRate: 85,
    personalTrainingSessions: 12,
    lastTraining: "2025-10-28",
    upcomingTrainings: 3
  },
  {
    id: 2,
    name: "Sofia Nilsson",
    email: "sofia.nilsson@email.se",
    attendanceRate: 92,
    personalTrainingSessions: 18,
    lastTraining: "2025-10-29",
    upcomingTrainings: 3
  },
  {
    id: 3,
    name: "Oscar Berg",
    email: "oscar.berg@email.se",
    attendanceRate: 78,
    personalTrainingSessions: 8,
    lastTraining: "2025-10-27",
    upcomingTrainings: 2
  }
];

const Players = () => {
  const [players] = useState<Player[]>(mockPlayers);
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('sv-SE', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return "text-success";
    if (rate >= 75) return "text-warning";
    return "text-destructive";
  };

  const togglePlayerSelection = (playerId: number) => {
    setSelectedPlayers(prev => 
      prev.includes(playerId) 
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  const avgAttendance = Math.round(
    players.reduce((sum, p) => sum + p.attendanceRate, 0) / players.length
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
              Mina spelare
            </h1>
            <p className="text-muted-foreground text-lg">
              Hantera dina spelare och följ deras utveckling
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{players.length}</CardTitle>
              <CardDescription>Totalt antal spelare</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{avgAttendance}%</CardTitle>
              <CardDescription>Genomsnittlig närvaro</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {players.reduce((sum, p) => sum + p.personalTrainingSessions, 0)}
              </CardTitle>
              <CardDescription>Personliga träningar totalt</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{selectedPlayers.length}</CardTitle>
              <CardDescription>Valda spelare</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="overview">Översikt</TabsTrigger>
            <TabsTrigger value="communication">Kommunikation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-4">
              {players.map((player) => (
                <Card 
                  key={player.id} 
                  className={`hover:shadow-lg transition-all cursor-pointer ${
                    selectedPlayers.includes(player.id) ? 'border-primary border-2' : ''
                  }`}
                  onClick={() => togglePlayerSelection(player.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                          <User className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-xl mb-1 flex items-center gap-2">
                            {player.name}
                            {selectedPlayers.includes(player.id) && (
                              <CheckCircle2 className="w-5 h-5 text-primary" />
                            )}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {player.email}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={`${getAttendanceColor(player.attendanceRate)}`}>
                        {player.attendanceRate}% närvaro
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <ClipboardList className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {player.personalTrainingSessions} egna träningar
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Senaste: {formatDate(player.lastTraining)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {player.upcomingTrainings} kommande träningar
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="communication">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-6 h-6" />
                  Skicka kallelser och quizer
                </CardTitle>
                <CardDescription>
                  Välj spelare i översikten och skicka sedan kallelser eller quizer till dem
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPlayers.length > 0 ? (
                  <>
                    <div className="bg-secondary/30 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Valda spelare ({selectedPlayers.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedPlayers.map(playerId => {
                          const player = players.find(p => p.id === playerId);
                          return player ? (
                            <Badge key={playerId} variant="outline">
                              {player.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="default" className="gap-2">
                        <Mail className="w-4 h-4" />
                        Skicka träningskallelse
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <ClipboardList className="w-4 h-4" />
                        Skicka quiz
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <XCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground text-lg mb-2">
                      Inga spelare valda
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Gå till översikten och klicka på spelarna du vill skicka till
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Players;
