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
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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

const mockPlayers: Player[] = [];

const SendCallup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const preSelectedPlayers = location.state?.selectedPlayers || [];
  
  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);
  
  const [sortBy, setSortBy] = useState<"name" | "attendance">("name");
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>(preSelectedPlayers);
  const [callupData, setCallupData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: "18:00",
    gatherTime: "",
    location: "",
    type: "training",
    customType: "",
    message: "",
    reminderTime: "1day",
    scheduled: false,
    sendBefore: "1day",
    responseDeadline: "1day",
    bringItems: "",
    bringItemsReminder: false,
    bringItemsReminderTime: "1day"
  });

  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const footballLocations = [
    "Östermalms IP",
    "Östermalms konstgräs",
    "Östersunds fotbollsarena",
    "Östervalls IP",
    "Frösö IP",
    "Storsjöhallen fotbollsplan",
    "Brunflo IP",
    "Lit IP"
  ];

  const locationHistory = [
    "Östermalms IP",
    "Frösö IP",
    "Östersunds fotbollsarena"
  ];

  const handleLocationChange = (value: string) => {
    setCallupData({ ...callupData, location: value });
    if (value.length > 0) {
      const filtered = [...new Set([...locationHistory, ...footballLocations])]
        .filter(loc => loc.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      setLocationSuggestions(filtered);
      setShowLocationSuggestions(true);
    } else {
      setShowLocationSuggestions(false);
    }
  };

  const selectLocation = (location: string) => {
    setCallupData({ ...callupData, location });
    setShowLocationSuggestions(false);
  };

  // Generate gather time options based on start time
  const getGatherTimeOptions = () => {
    if (!callupData.time) return [];
    
    const [hours, minutes] = callupData.time.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const options: string[] = [];
    
    // Generate times from 60 minutes before to 15 minutes before
    for (let i = 60; i >= 15; i -= 5) {
      const gatherMinutes = startMinutes - i;
      if (gatherMinutes >= 0) {
        const h = Math.floor(gatherMinutes / 60);
        const m = gatherMinutes % 60;
        options.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }
    
    return options;
  };
  
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

  const handleSendCallup = async () => {
    if (selectedPlayers.length === 0) {
      toast.error("Välj minst en spelare");
      return;
    }
    if (!callupData.location) {
      toast.error("Ange plats för träningen");
      return;
    }
    if (!user) {
      toast.error("Du måste vara inloggad för att skicka kallelser");
      return;
    }
    
    try {
      // Get user's team
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('team_id')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      if (!profileData?.team_id) {
        toast.error("Du är inte kopplad till ett lag");
        return;
      }

      // Create ISO datetime string
      const startDateTime = new Date(`${callupData.date}T${callupData.time}`);
      // Default duration is 1.5 hours for training
      const endDateTime = new Date(startDateTime.getTime() + 90 * 60000);
      
      // Determine activity type and title
      let activityType = 'callup';
      let title = 'Kallelse';
      
      if (callupData.type === 'training') {
        activityType = 'training';
        title = 'Träning';
      } else if (callupData.type === 'match') {
        activityType = 'match';
        title = 'Match';
      } else if (callupData.customType) {
        title = callupData.customType;
      }
      
      // Build description
      let description = `Plats: ${callupData.location}`;
      if (callupData.gatherTime) {
        description += `\nSamling: ${callupData.gatherTime}`;
      }
      if (callupData.message) {
        description += `\n\n${callupData.message}`;
      }
      if (callupData.bringItems) {
        description += `\n\nMedtages: ${callupData.bringItems}`;
      }
      
      // Insert activity into database with team_id
      const { error } = await supabase
        .from('activities')
        .insert({
          title,
          description,
          activity_type: activityType,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          created_by: user.id,
          team_id: profileData.team_id
        });
      
      if (error) throw error;
      
      toast.success(`Kallelse skickad till ${selectedPlayers.length} spelare och lagd till i kalendern!`);
      navigate("/planner");
    } catch (error: any) {
      console.error('Error sending callup:', error);
      toast.error("Kunde inte skicka kallelse. Försök igen.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
            Skicka kallelse
          </h1>
          <p className="text-muted-foreground text-sm">
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
            <CardDescription className="text-xs">
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
                    <SelectItem value="other">Övrigt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {callupData.type === "other" && (
                <div>
                  <Label htmlFor="customType">Namn på aktivitet</Label>
                  <Input
                    id="customType"
                    value={callupData.customType}
                    onChange={(e) => setCallupData({ ...callupData, customType: e.target.value })}
                    placeholder="T.ex. Lagmöte"
                  />
                </div>
              )}
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
                <Input
                  id="time"
                  type="time"
                  value={callupData.time}
                  onChange={(e) => setCallupData({ ...callupData, time: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="gatherTime">Samlingstid (valfritt)</Label>
                <Select
                  value={callupData.gatherTime}
                  onValueChange={(value) => setCallupData({ ...callupData, gatherTime: value })}
                >
                  <SelectTrigger id="gatherTime">
                    <SelectValue placeholder="Välj samlingstid" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {getGatherTimeOptions().map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="relative">
                <Label htmlFor="location">Plats</Label>
                <Input
                  id="location"
                  value={callupData.location}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  onFocus={() => {
                    if (callupData.location.length > 0) {
                      setShowLocationSuggestions(true);
                    }
                  }}
                  placeholder="T.ex. Östermalms IP"
                />
                {showLocationSuggestions && locationSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md">
                    {locationSuggestions.map((location, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 hover:bg-secondary cursor-pointer text-sm"
                        onClick={() => selectLocation(location)}
                      >
                        {location}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reminder">Påminnelse</Label>
                <Select
                  value={callupData.reminderTime}
                  onValueChange={(value) => setCallupData({ ...callupData, reminderTime: value })}
                >
                  <SelectTrigger id="reminder">
                    <SelectValue placeholder="Välj påminnelsetid" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4days">4 dagar innan</SelectItem>
                    <SelectItem value="3days">3 dagar innan</SelectItem>
                    <SelectItem value="2days">2 dagar innan</SelectItem>
                    <SelectItem value="1day">1 dag innan</SelectItem>
                    <SelectItem value="12hours">12 timmar innan</SelectItem>
                    <SelectItem value="6hours">6 timmar innan</SelectItem>
                    <SelectItem value="3hours">3 timmar innan</SelectItem>
                    <SelectItem value="none">Ingen påminnelse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="responseDeadline">Senaste svarstid</Label>
                <Select
                  value={callupData.responseDeadline}
                  onValueChange={(value) => setCallupData({ ...callupData, responseDeadline: value })}
                >
                  <SelectTrigger id="responseDeadline">
                    <SelectValue placeholder="Välj svarstid" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4days">4 dagar innan</SelectItem>
                    <SelectItem value="3days">3 dagar innan</SelectItem>
                    <SelectItem value="2days">2 dagar innan</SelectItem>
                    <SelectItem value="1day">1 dag innan</SelectItem>
                    <SelectItem value="12hours">12 timmar innan</SelectItem>
                    <SelectItem value="6hours">6 timmar innan</SelectItem>
                    <SelectItem value="3hours">3 timmar innan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="scheduled"
                checked={callupData.scheduled}
                onChange={(e) => setCallupData({ ...callupData, scheduled: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="scheduled" className="cursor-pointer">
                Schemalägg kallelse
              </Label>
            </div>
            {callupData.scheduled && (
              <div>
                <Label htmlFor="sendBefore">Skicka kallelse innan</Label>
                <Select
                  value={callupData.sendBefore}
                  onValueChange={(value) => setCallupData({ ...callupData, sendBefore: value })}
                >
                  <SelectTrigger id="sendBefore">
                    <SelectValue placeholder="Välj tid" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1week">1 vecka innan</SelectItem>
                    <SelectItem value="3days">3 dagar innan</SelectItem>
                    <SelectItem value="2days">2 dagar innan</SelectItem>
                    <SelectItem value="1day">1 dag innan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
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
            <div>
              <Label htmlFor="bringItems">Medtages (valfritt)</Label>
              <Textarea
                id="bringItems"
                value={callupData.bringItems}
                onChange={(e) => setCallupData({ ...callupData, bringItems: e.target.value })}
                placeholder="T.ex. Vattenflaska, extra t-shirt, fotbollsskor..."
                rows={2}
              />
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="bringItemsReminder"
                  checked={callupData.bringItemsReminder}
                  onChange={(e) => setCallupData({ ...callupData, bringItemsReminder: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="bringItemsReminder" className="cursor-pointer text-sm">
                  Skicka påminnelse om vad som ska medtages
                </Label>
              </div>
              {callupData.bringItemsReminder && (
                <div className="mt-2">
                  <Label htmlFor="bringItemsReminderTime" className="text-sm">När ska påminnelsen skickas?</Label>
                  <Select
                    value={callupData.bringItemsReminderTime || "1day"}
                    onValueChange={(value) => setCallupData({ ...callupData, bringItemsReminderTime: value })}
                  >
                    <SelectTrigger id="bringItemsReminderTime" className="mt-1">
                      <SelectValue placeholder="Välj tid" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4days">4 dagar innan</SelectItem>
                      <SelectItem value="3days">3 dagar innan</SelectItem>
                      <SelectItem value="2days">2 dagar innan</SelectItem>
                      <SelectItem value="1day">1 dag innan</SelectItem>
                      <SelectItem value="12hours">12 timmar innan</SelectItem>
                      <SelectItem value="6hours">6 timmar innan</SelectItem>
                      <SelectItem value="3hours">3 timmar innan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
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
          {selectedPlayers.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedPlayers([])}
            >
              Ta bort alla markerade
            </Button>
          )}
        </div>

        {/* Player Selection */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Välj spelare</h2>
          
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
                      <CardDescription className="text-xs flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {player.guardian.phone}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={`${getAttendanceColor(player.attendanceRate)} text-xs`}>
                    {player.attendanceRate}%
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
