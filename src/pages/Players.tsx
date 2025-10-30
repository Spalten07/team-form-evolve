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
  XCircle,
  Phone,
  CalendarDays
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Player {
  id: number;
  name: string;
  email: string;
  attendanceRate: number;
  personalTrainingSessions: number;
  lastTraining: string;
  upcomingTrainings: number;
  guardian: {
    name: string;
    phone: string;
  };
}

const mockPlayers: Player[] = [
  {
    id: 1,
    name: "Erik Andersson",
    email: "erik.andersson@email.se",
    attendanceRate: 85,
    personalTrainingSessions: 12,
    lastTraining: "2025-10-28",
    upcomingTrainings: 3,
    guardian: { name: "Maria Andersson", phone: "070-123 45 67" }
  },
  {
    id: 2,
    name: "Sofia Nilsson",
    email: "sofia.nilsson@email.se",
    attendanceRate: 92,
    personalTrainingSessions: 18,
    lastTraining: "2025-10-29",
    upcomingTrainings: 3,
    guardian: { name: "Peter Nilsson", phone: "070-234 56 78" }
  },
  {
    id: 3,
    name: "Oscar Berg",
    email: "oscar.berg@email.se",
    attendanceRate: 78,
    personalTrainingSessions: 8,
    lastTraining: "2025-10-27",
    upcomingTrainings: 2,
    guardian: { name: "Linda Berg", phone: "070-345 67 89" }
  },
  {
    id: 4,
    name: "Anna Karlsson",
    email: "anna.karlsson@email.se",
    attendanceRate: 95,
    personalTrainingSessions: 22,
    lastTraining: "2025-10-29",
    upcomingTrainings: 3,
    guardian: { name: "Johan Karlsson", phone: "070-456 78 90" }
  },
  {
    id: 5,
    name: "Lucas Eriksson",
    email: "lucas.eriksson@email.se",
    attendanceRate: 88,
    personalTrainingSessions: 15,
    lastTraining: "2025-10-28",
    upcomingTrainings: 3,
    guardian: { name: "Emma Eriksson", phone: "070-567 89 01" }
  },
  {
    id: 6,
    name: "Emma Johansson",
    email: "emma.johansson@email.se",
    attendanceRate: 82,
    personalTrainingSessions: 10,
    lastTraining: "2025-10-27",
    upcomingTrainings: 2,
    guardian: { name: "Anders Johansson", phone: "070-678 90 12" }
  },
  {
    id: 7,
    name: "Oliver Larsson",
    email: "oliver.larsson@email.se",
    attendanceRate: 90,
    personalTrainingSessions: 16,
    lastTraining: "2025-10-29",
    upcomingTrainings: 3,
    guardian: { name: "Karin Larsson", phone: "070-789 01 23" }
  },
  {
    id: 8,
    name: "Maja Svensson",
    email: "maja.svensson@email.se",
    attendanceRate: 87,
    personalTrainingSessions: 14,
    lastTraining: "2025-10-28",
    upcomingTrainings: 3,
    guardian: { name: "Stefan Svensson", phone: "070-890 12 34" }
  }
];

const Players = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<"name" | "attendance">("name");
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  
  const players = [...mockPlayers].sort((a, b) => {
    if (sortBy === "name") {
      const lastNameA = a.name.split(" ")[1] || a.name;
      const lastNameB = b.name.split(" ")[1] || b.name;
      return lastNameA.localeCompare(lastNameB);
    } else {
      return b.attendanceRate - a.attendanceRate;
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('sv-SE', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return "bg-success/20 text-success";
    if (rate >= 75) return "bg-warning/20 text-warning";
    return "bg-destructive/20 text-destructive";
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
            <p className="text-muted-foreground text-sm">
              Hantera dina spelare och följ deras utveckling
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <Card>
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-xl">{players.length}</CardTitle>
              <CardDescription className="text-xs">Totalt spelare</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-xl">{avgAttendance}%</CardTitle>
              <CardDescription className="text-xs">Snitt närvaro</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-xl">
                {players.reduce((sum, p) => sum + p.personalTrainingSessions, 0)}
              </CardTitle>
              <CardDescription className="text-xs">Personliga träningar</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Action Buttons */}
        {selectedPlayers.length > 0 && (
          <div className="mb-6 flex gap-3">
            <Button 
              variant="default" 
              className="gap-2"
              onClick={() => navigate('/send-callup', { state: { selectedPlayers } })}
            >
              <Send className="w-4 h-4" />
              Skicka kallelse ({selectedPlayers.length})
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setSelectedPlayers([])}
            >
              Avmarkera alla
            </Button>
          </div>
        )}

        {/* Sort Options */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={sortBy === "name" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("name")}
          >
            Sortera efter efternamn
          </Button>
          <Button
            variant={sortBy === "attendance" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("attendance")}
          >
            Sortera efter högst närvaro
          </Button>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="overview">Översikt</TabsTrigger>
            <TabsTrigger value="communication">Kommunikation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-3">
              {players.map((player) => (
                <Card 
                  key={player.id} 
                  className={`hover:shadow-md transition-all cursor-pointer ${
                    selectedPlayers.includes(player.id) ? 'border-primary border-2' : ''
                  }`}
                  onClick={() => togglePlayerSelection(player.id)}
                >
                  <CardHeader className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-base mb-1 flex items-center gap-2">
                            {player.name}
                            {selectedPlayers.includes(player.id) && (
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                            )}
                          </CardTitle>
                          <CardDescription className="text-xs flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {player.guardian.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {player.guardian.phone}
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getAttendanceColor(player.attendanceRate)} text-xs`}>
                          {player.attendanceRate}%
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 h-8 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/player-calendar/${player.id}`);
                          }}
                        >
                          <CalendarDays className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
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
                <CardDescription className="text-xs">
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button 
                        variant="default" 
                        className="gap-2"
                        onClick={() => navigate('/send-callup', { state: { selectedPlayers } })}
                      >
                        <Mail className="w-4 h-4" />
                        Skicka träningskallelse
                      </Button>
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => navigate('/theory')}
                      >
                        <ClipboardList className="w-4 h-4" />
                        Skicka teoripass
                      </Button>
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => setSelectedPlayers(players.map(p => p.id))}
                      >
                        <Mail className="w-4 h-4" />
                        Välj alla spelare
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
