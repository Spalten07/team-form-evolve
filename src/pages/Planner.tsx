import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Plus, Users, Target, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Filter } from "lucide-react";

interface TrainingSession {
  id: number;
  date: string;
  time: string;
  title: string;
  focus: string;
  duration: string;
  players: number;
  status: "planned" | "completed" | "upcoming";
  calledPlayers?: number[];
}

interface Player {
  id: number;
  name: string;
}

const mockPlayers: Player[] = [
  { id: 1, name: "Erik Andersson" },
  { id: 2, name: "Sofia Nilsson" },
  { id: 3, name: "Oscar Berg" },
  { id: 4, name: "Anna Karlsson" },
  { id: 5, name: "Lucas Eriksson" },
  { id: 6, name: "Emma Johansson" },
  { id: 7, name: "Oliver Larsson" },
  { id: 8, name: "Maja Svensson" }
];

const mockSessions: TrainingSession[] = [
  {
    id: 1,
    date: "2025-11-01",
    time: "18:00",
    title: "Passningsfokus",
    focus: "Teknik & Passning",
    duration: "90 min",
    players: 16,
    status: "completed",
    calledPlayers: [1, 2, 3, 4, 5, 6, 7, 8]
  },
  {
    id: 2,
    date: "2025-11-03",
    time: "18:00",
    title: "Taktisk träning",
    focus: "Positionsspel",
    duration: "90 min",
    players: 18,
    status: "upcoming",
    calledPlayers: [1, 2, 3, 4, 5, 6, 7, 8]
  },
  {
    id: 3,
    date: "2025-11-05",
    time: "18:00",
    title: "Match & Avslut",
    focus: "Avslut & Spelformer",
    duration: "90 min",
    players: 20,
    status: "planned",
    calledPlayers: [1, 2, 4, 5, 6, 7, 8]
  }
];

const Planner = () => {
  const [sessions, setSessions] = useState<TrainingSession[]>(mockSessions);
  const [expandedSession, setExpandedSession] = useState<number | null>(null);
  const [weekFilter, setWeekFilter] = useState("current");
  const [monthFilter, setMonthFilter] = useState("november");
  const [activityFilter, setActivityFilter] = useState("all");

  const togglePlayerInSession = (sessionId: number, playerId: number) => {
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        const calledPlayers = session.calledPlayers || [];
        const isCalledCurrently = calledPlayers.includes(playerId);
        return {
          ...session,
          calledPlayers: isCalledCurrently 
            ? calledPlayers.filter(id => id !== playerId)
            : [...calledPlayers, playerId]
        };
      }
      return session;
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success/10 text-success hover:bg-success/20">Genomförd</Badge>;
      case "upcoming":
        return <Badge className="bg-accent/10 text-accent hover:bg-accent/20">Kommande</Badge>;
      case "planned":
        return <Badge variant="outline">Planerad</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('sv-SE', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
            Träningsplanering
          </h1>
          <p className="text-muted-foreground text-sm mb-4">
            Planera och organisera dina träningar
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="hero" size="sm" className="gap-2" asChild>
              <Link to="/create-training">
                <Plus className="w-4 h-4" />
                Ny träning
              </Link>
            </Button>
            <Button variant="default" size="sm" className="gap-2" asChild>
              <Link to="/send-callup">
                <Users className="w-4 h-4" />
                Skicka kallelse
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <Link to="/saved-trainings">
                <Target className="w-4 h-4" />
                Mina träningspass
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="trainings" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3 mb-6 h-auto bg-secondary/50 p-1 gap-1">
            <TabsTrigger value="trainings" className="text-xs py-2 border-r border-border">
              <Calendar className="w-4 h-4 mr-1.5" />
              Träningar
            </TabsTrigger>
            <TabsTrigger value="calendar" className="text-xs py-2 border-r border-border">
              <CalendarDays className="w-4 h-4 mr-1.5" />
              Lagets kalender
            </TabsTrigger>
            <TabsTrigger value="scheduling" className="text-xs py-2">
              <Clock className="w-4 h-4 mr-1.5" />
              Schemaläggning
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="trainings">
            {/* Calendar View Card */}
            <Card className="mb-6 bg-gradient-primary text-primary-foreground border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  November 2025
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-primary-foreground/10 backdrop-blur rounded-lg p-3">
                    <div className="text-2xl font-bold">8</div>
                    <div className="text-xs opacity-90 leading-tight">Träningar denna månad</div>
                  </div>
                  <div className="bg-primary-foreground/10 backdrop-blur rounded-lg p-3">
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-xs opacity-90 leading-tight">Kommande träningar</div>
                  </div>
                  <div className="bg-primary-foreground/10 backdrop-blur rounded-lg p-3">
                    <div className="text-2xl font-bold">18</div>
                    <div className="text-xs opacity-90 leading-tight">Snitt antal spelare</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Training Sessions List */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold">Planerade träningar</h2>
              
              {sessions.map((session) => (
                <Collapsible 
                  key={session.id}
                  open={expandedSession === session.id}
                  onOpenChange={(isOpen) => setExpandedSession(isOpen ? session.id : null)}
                >
                  <Card className="hover:shadow-md transition-all">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="py-3 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getStatusBadge(session.status)}
                              <span className="text-xs text-muted-foreground">
                                {formatDate(session.date)} • {session.time}
                              </span>
                            </div>
                            <CardTitle className="text-base">{session.title}</CardTitle>
                          </div>
                          <ChevronDown className={`w-5 h-5 transition-transform ${expandedSession === session.id ? 'rotate-180' : ''}`} />
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="border-t pt-3 space-y-3">
                          {session.id === 2 && (
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-3">
                              <p className="text-sm font-medium mb-1">Kopplat träningspass</p>
                              <p className="text-xs text-muted-foreground">Taktisk träning - Positionsspel</p>
                              <Button variant="link" size="sm" className="h-auto p-0 text-xs mt-1">
                                Visa träningspass →
                              </Button>
                            </div>
                          )}
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Kallade spelare ({session.calledPlayers?.length || 0})</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {mockPlayers.map(player => (
                                <div key={player.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`session-${session.id}-player-${player.id}`}
                                    checked={session.calledPlayers?.includes(player.id)}
                                    onCheckedChange={() => togglePlayerInSession(session.id, player.id)}
                                  />
                                  <label
                                    htmlFor={`session-${session.id}-player-${player.id}`}
                                    className="text-sm cursor-pointer"
                                  >
                                    {player.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CalendarDays className="w-6 h-6" />
                        Lagets kalender
                      </CardTitle>
                      <CardDescription className="text-xs">Veckoschema för träningar och matcher</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">← Föregående</Button>
                      <Button 
                        variant={weekFilter === "current" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setWeekFilter("current")}
                      >
                        Denna vecka
                      </Button>
                      <Button variant="outline" size="sm">Nästa →</Button>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
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
                <div className="border rounded-lg overflow-x-auto">
                  <div className="w-full">
                    {/* Header row */}
                    <div className="grid grid-cols-[80px_repeat(7,1fr)] bg-secondary/80">
                      <div className="p-2 text-sm font-semibold border-r">Tid</div>
                      <div className="p-2 text-sm font-semibold border-r text-center">Måndag<br/><span className="text-xs font-normal text-muted-foreground">4/11</span></div>
                      <div className="p-2 text-sm font-semibold border-r text-center">Tisdag<br/><span className="text-xs font-normal text-muted-foreground">5/11</span></div>
                      <div className="p-2 text-sm font-semibold border-r text-center">Onsdag<br/><span className="text-xs font-normal text-muted-foreground">6/11</span></div>
                      <div className="p-2 text-sm font-semibold border-r text-center">Torsdag<br/><span className="text-xs font-normal text-muted-foreground">7/11</span></div>
                      <div className="p-2 text-sm font-semibold border-r text-center">Fredag<br/><span className="text-xs font-normal text-muted-foreground">8/11</span></div>
                      <div className="p-2 text-sm font-semibold border-r text-center">Lördag<br/><span className="text-xs font-normal text-muted-foreground">9/11</span></div>
                      <div className="p-2 text-sm font-semibold text-center">Söndag<br/><span className="text-xs font-normal text-muted-foreground">10/11</span></div>
                    </div>
                    
                    {/* Calendar grid */}
                    <div className="relative grid grid-cols-[80px_repeat(7,1fr)]" style={{ gridAutoRows: '30px' }}>
                      {["08:00", "08:15", "08:30", "08:45", "09:00", "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30", "18:45", "19:00", "19:15", "19:30", "19:45", "20:00", "20:15", "20:30", "20:45", "21:00", "21:15", "21:30", "21:45", "22:00"].map((time, idx) => (
                        <>
                          <div key={`time-${time}`} className="p-1 text-[10px] font-medium text-muted-foreground border-r border-t bg-secondary/30 flex items-start">
                            {time}
                          </div>
                          {/* Måndag */}
                          <div className="border-r border-t relative"></div>
                          {/* Tisdag */}
                          <div className="border-r border-t relative">
                            {time === "18:00" && (activityFilter === "all" || activityFilter === "training") && (
                              <div className="absolute inset-0 bg-primary/30 p-2 flex flex-col justify-start z-10" style={{ gridRow: `span 6` }}>
                                <p className="text-xs font-bold text-primary">Träning</p>
                                <p className="text-[10px] text-muted-foreground">18:00-19:30</p>
                              </div>
                            )}
                          </div>
                          {/* Onsdag */}
                          <div className="border-r border-t relative"></div>
                          {/* Torsdag */}
                          <div className="border-r border-t relative">
                            {time === "18:00" && (activityFilter === "all" || activityFilter === "training") && (
                              <div className="absolute inset-0 bg-primary/30 p-2 flex flex-col justify-start z-10" style={{ gridRow: `span 6` }}>
                                <p className="text-xs font-bold text-primary">Träning</p>
                                <p className="text-[10px] text-muted-foreground">18:00-19:30</p>
                              </div>
                            )}
                          </div>
                          {/* Fredag */}
                          <div className="border-r border-t relative">
                            {time === "17:00" && (activityFilter === "all" || activityFilter === "match") && (
                              <div className="absolute inset-0 bg-accent/30 p-2 flex flex-col justify-start z-10" style={{ gridRow: `span 6` }}>
                                <p className="text-xs font-bold text-accent">Match</p>
                                <p className="text-[10px] text-muted-foreground">17:00-18:30</p>
                                <p className="text-[10px] text-muted-foreground">vs Frösö</p>
                              </div>
                            )}
                          </div>
                          {/* Lördag */}
                          <div className="border-r border-t relative"></div>
                          {/* Söndag */}
                          <div className="border-t relative"></div>
                        </>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduling">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  Schemalagda kallelser
                </CardTitle>
                <CardDescription className="text-xs">
                  Automatiska kallelser som skickas i förväg
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Scheduled Callup 1 */}
                <Collapsible>
                  <Card className="border-primary/20">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="py-3 cursor-pointer hover:bg-secondary/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-sm">Träningskallelse - Tisdagar</CardTitle>
                            <CardDescription className="text-xs mt-1">
                              Skickas 2 dagar innan • Till: 8 spelare
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-success/10 text-success">Aktiv</Badge>
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0 border-t">
                        <div className="space-y-3 pt-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Status</span>
                            <Button variant="outline" size="sm">Inaktivera</Button>
                          </div>
                          <div>
                            <span className="text-sm font-medium block mb-2">Kallade spelare (8)</span>
                            <div className="grid grid-cols-2 gap-2">
                              {mockPlayers.map(player => (
                                <div key={player.id} className="flex items-center space-x-2">
                                  <Checkbox id={`sched1-${player.id}`} defaultChecked />
                                  <label htmlFor={`sched1-${player.id}`} className="text-sm cursor-pointer">
                                    {player.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>

                {/* Scheduled Callup 2 */}
                <Collapsible>
                  <Card className="border-primary/20">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="py-3 cursor-pointer hover:bg-secondary/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-sm">Matchkallelse - Lördagar</CardTitle>
                            <CardDescription className="text-xs mt-1">
                              Skickas 3 dagar innan • Till: 8 spelare
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-success/10 text-success">Aktiv</Badge>
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0 border-t">
                        <div className="space-y-3 pt-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Status</span>
                            <Button variant="outline" size="sm">Inaktivera</Button>
                          </div>
                          <div>
                            <span className="text-sm font-medium block mb-2">Kallade spelare (8)</span>
                            <div className="grid grid-cols-2 gap-2">
                              {mockPlayers.map(player => (
                                <div key={player.id} className="flex items-center space-x-2">
                                  <Checkbox id={`sched2-${player.id}`} defaultChecked />
                                  <label htmlFor={`sched2-${player.id}`} className="text-sm cursor-pointer">
                                    {player.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>

                {/* Scheduled Callup 3 */}
                <Collapsible>
                  <Card className="border-primary/20">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="py-3 cursor-pointer hover:bg-secondary/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-sm">Träningskallelse - Torsdagar</CardTitle>
                            <CardDescription className="text-xs mt-1">
                              Skickas 1 dag innan • Till: 7 spelare
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Inaktiv</Badge>
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0 border-t">
                        <div className="space-y-3 pt-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Status</span>
                            <Button variant="default" size="sm">Aktivera</Button>
                          </div>
                          <div>
                            <span className="text-sm font-medium block mb-2">Kallade spelare (7)</span>
                            <div className="grid grid-cols-2 gap-2">
                              {mockPlayers.map(player => (
                                <div key={player.id} className="flex items-center space-x-2">
                                  <Checkbox id={`sched3-${player.id}`} defaultChecked={player.id !== 3} />
                                  <label htmlFor={`sched3-${player.id}`} className="text-sm cursor-pointer">
                                    {player.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Planner;
