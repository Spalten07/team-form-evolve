import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Mail, 
  Send, 
  Calendar,
  CheckCircle2,
  Phone,
  CalendarDays,
  Clock
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const SendCallup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preSelectedPlayers = location.state?.selectedPlayers || [];
  
  const [sortBy, setSortBy] = useState<"name" | "attendance">("name");
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>(preSelectedPlayers);
  const [callupData, setCallupData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: "18:00",
    location: "",
    type: "training",
    message: ""
  });
  
  const players = [...mockPlayers].sort((a, b) => {
    if (sortBy === "name") {
      const lastNameA = a.name.split(" ")[1] || a.name;
      const lastNameB = b.name.split(" ")[1] || b.name;
      return lastNameA.localeCompare(lastNameB);
    } else {
      return b.attendanceRate - a.attendanceRate;
    }
  });

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

  const handleSendCallup = () => {
    if (selectedPlayers.length === 0) {
      toast.error("Välj minst en spelare");
      return;
    }
    if (!callupData.location) {
      toast.error("Ange plats för träningen");
      return;
    }
    
    toast.success(`Kallelse skickad till ${selectedPlayers.length} spelare!`);
    navigate("/planner");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
            Skicka kallelse
          </h1>
          <p className="text-muted-foreground text-lg">
            Välj spelare och fyll i detaljer för kallelsen
          </p>
        </div>

        {/* Callup Details Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Kallelsedetaljer
            </CardTitle>
            <CardDescription>
              Fyll i information om träningen eller matchen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Typ av aktivitet</Label>
                <Select
                  value={callupData.type}
                  onValueChange={(value) => setCallupData({ ...callupData, type: value })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Välj typ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="training">Träning</SelectItem>
                    <SelectItem value="match">Match</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">Datum</Label>
                <Input
                  id="date"
                  type="date"
                  value={callupData.date}
                  onChange={(e) => setCallupData({ ...callupData, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="time">Starttid</Label>
                <Select
                  value={callupData.time}
                  onValueChange={(value) => setCallupData({ ...callupData, time: value })}
                >
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Välj tid" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {Array.from({ length: 48 }, (_, i) => {
                      const hour = Math.floor(i / 2) + 6;
                      const minute = (i % 2) * 30;
                      if (hour >= 22) return null;
                      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                    }).filter(Boolean).map((time) => (
                      <SelectItem key={time} value={time!}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Plats</Label>
                <Input
                  id="location"
                  value={callupData.location}
                  onChange={(e) => setCallupData({ ...callupData, location: e.target.value })}
                  placeholder="T.ex. Fotbollsplan 1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="message">Meddelande (valfritt)</Label>
              <Textarea
                id="message"
                value={callupData.message}
                onChange={(e) => setCallupData({ ...callupData, message: e.target.value })}
                placeholder="Lägg till ett meddelande till spelarna..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Selected Players Summary */}
        {selectedPlayers.length > 0 && (
          <Card className="mb-6 border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                {selectedPlayers.length} spelare valda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedPlayers.map(playerId => {
                  const player = players.find(p => p.id === playerId);
                  return player ? (
                    <Badge key={playerId} variant="outline">
                      {player.name}
                    </Badge>
                  ) : null;
                })}
              </div>
              <Button 
                variant="default" 
                className="w-full gap-2"
                onClick={handleSendCallup}
              >
                <Send className="w-4 h-4" />
                Skicka kallelse till {selectedPlayers.length} spelare
              </Button>
            </CardContent>
          </Card>
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedPlayers(players.map(p => p.id))}
          >
            Välj alla spelare
          </Button>
        </div>

        {/* Player Selection */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Välj spelare</h2>
          
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
                      <CardDescription className="flex flex-col gap-1">
                        <span className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {player.email}
                        </span>
                        <span className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Vårdnadshavare: {player.guardian.name}
                        </span>
                        <span className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {player.guardian.phone}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={`${getAttendanceColor(player.attendanceRate)}`}>
                    {player.attendanceRate}% närvaro
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SendCallup;
