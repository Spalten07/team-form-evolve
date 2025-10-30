import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { 
  Plus, 
  X, 
  Clock, 
  Users, 
  Target, 
  Save,
  Trash2,
  GripVertical,
  PlayCircle,
  Wand2
} from "lucide-react";
import { toast } from "sonner";

interface TrainingExercise {
  id: string;
  title: string;
  duration: number;
  category: string;
  notes?: string;
}

interface TrainingSession {
  title: string;
  date: string;
  time: string;
  duration: number;
  players: number;
  focus: string;
  equipment: string[];
  warmup: TrainingExercise[];
  main: TrainingExercise[];
  cooldown: TrainingExercise[];
  notes: string;
}

interface ExerciseBankItem {
  id: string;
  title: string;
  category: string;
  defaultDuration: number;
  description: string;
}

const exerciseBank: ExerciseBankItem[] = [
  // Uppvärmning
  { 
    id: "1", 
    title: "Joggning & dynamisk stretch", 
    category: "Uppvärmning", 
    defaultDuration: 10,
    description: "Börja med lätt joggning 3-4 varv. Följ med dynamisk stretch: bensvingar, armcirklar, höftrotationer. Fokus på rörlighet och värmeupp av muskler."
  },
  { 
    id: "8", 
    title: "Koordinationsstege", 
    category: "Uppvärmning", 
    defaultDuration: 10,
    description: "Placera koordinationsstege på marken. Övningar: snabba fötter, sidosteg, hopp på ett ben. Utvecklar fotarbete och koordination."
  },
  { 
    id: "11", 
    title: "Rondo 4v1", 
    category: "Uppvärmning", 
    defaultDuration: 10,
    description: "Fyra spelare bildar kvadrat, en i mitten försöker ta bollen. Snabba passningar, konstant rörelse. Byt mittspelare var 60:e sekund."
  },
  { 
    id: "12", 
    title: "Bollkänsla par", 
    category: "Uppvärmning", 
    defaultDuration: 10,
    description: "Par står 5m från varandra. Passa med insida, utsida, trampa bollen, rullar. Öka tempo gradvis för att värma upp."
  },
  
  // Passning
  { 
    id: "2", 
    title: "Passningstriangel", 
    category: "Passning", 
    defaultDuration: 15,
    description: "Tre spelare i triangel 10m mellanrum. Passa och följ bollen till nästa position. Variera: 1-touch, 2-touch, olika fötter. Fokus på precision."
  },
  { 
    id: "9", 
    title: "Fyrkantspassning", 
    category: "Passning", 
    defaultDuration: 15,
    description: "Fyra koner i kvadrat, spelare i varje hörn. Passa diagonalt och rakt, följ passningen. Öka tempo, lägg till extra bollar för utmaning."
  },
  { 
    id: "13", 
    title: "Långpassning parvis", 
    category: "Passning", 
    defaultDuration: 15,
    description: "Par står 20-30m från varandra. Öva långa passningar i luften och längs mark. Fokus på teknik: stå över bollen, träffa rätt på foten."
  },
  
  // Teknik
  { 
    id: "3", 
    title: "1v1 Dribbling", 
    category: "Teknik", 
    defaultDuration: 15,
    description: "Par i zon 10x10m. En dribblar, en försvarar. Försök ta sig förbi motståndare med finter. Byt roller var 2:a minut. Fokus på kroppsfinter."
  },
  { 
    id: "10", 
    title: "Huvudspel", 
    category: "Teknik", 
    defaultDuration: 15,
    description: "Par kastar boll till varandra för nick. Fokus: ögon på boll, panna mot boll, nicka nedåt. Öka avstånd gradvis. Kan lägga till mål."
  },
  { 
    id: "14", 
    title: "Jongleringsutmaning", 
    category: "Teknik", 
    defaultDuration: 10,
    description: "Spelare jonglerar själva eller tävlar parvis. Räkna träffar: fot, lår, huvud. Tävling: vem når 50 träffar först?"
  },
  { 
    id: "15", 
    title: "Vändningar med boll", 
    category: "Teknik", 
    defaultDuration: 15,
    description: "Koner i rad 5m mellanrum. Dribbla till kon, vänd med insida/utsida/sula. Olika vändningstekniker: Cruyff, drag-back, step-over."
  },
  
  // Avslut
  { 
    id: "4", 
    title: "Skottövning", 
    category: "Avslut", 
    defaultDuration: 20,
    description: "Spelare i kö 16-18m från mål. En passare lägger till, skjut direkt eller efter touch. Rotera: passare, skytt, hämta boll. Fokus: precision före kraft."
  },
  { 
    id: "16", 
    title: "Avslut efter löpning", 
    category: "Avslut", 
    defaultDuration: 20,
    description: "Spelare springer från kant, får passning i löpbana, avslutar. Variera: från höger/vänster, låga/höga passningar. Träna både fötter."
  },
  { 
    id: "17", 
    title: "Skott i rörelse", 
    category: "Avslut", 
    defaultDuration: 20,
    description: "Dribbla genom koner, avsluta på mål. Kombinera teknik och avslut. Tidsbegränsa: måste skjuta inom 10 sek. Tävling: flest mål på 10 försök."
  },
  
  // Taktik
  { 
    id: "5", 
    title: "Positionsspel 4v4+1", 
    category: "Taktik", 
    defaultDuration: 20,
    description: "Fyra mot fyra plus en joker som spelar med bollinnehavare. Zon 20x20m. Mål: håll bollen 10 passningar = 1 poäng. Lägg till små mål senare."
  },
  { 
    id: "18", 
    title: "Överspel till zon", 
    category: "Taktik", 
    defaultDuration: 20,
    description: "Dela plan i tre zoner. Lag ska spela bollen från egen zon till sista zonen genom mittzon. Motståndare försöker ta boll. Fokus: tålmodigt uppspel."
  },
  { 
    id: "19", 
    title: "Snabbväxling", 
    category: "Taktik", 
    defaultDuration: 15,
    description: "Vid bolltapp ska laget direkt pressa för att vinna tillbaka. Vid bollvinst snabb övergång till anfall. Fokus: intensitet i växling."
  },
  
  // Spelform
  { 
    id: "6", 
    title: "Matchspel", 
    category: "Spelform", 
    defaultDuration: 20,
    description: "Vanligt matchspel, anpassad planstorlek. Låt spelarna använda det de tränat. Tränare coachar från sidan. Rotera lag för jämna matcher."
  },
  { 
    id: "20", 
    title: "Små mål 4v4", 
    category: "Spelform", 
    defaultDuration: 20,
    description: "Fyra mot fyra, små mål utan målvakter. Plan 30x20m. Tvingar spelarna till precision. Byt lag var 5:e minut för att hålla intensitet."
  },
  { 
    id: "21", 
    title: "Zonfotboll", 
    category: "Spelform", 
    defaultDuration: 20,
    description: "Spelare måste stanna i tilldelad zon. Utvecklar positionsspel och förståelse för position. Byt zoner mellan omgångar."
  },
  
  // Kondition
  { 
    id: "22", 
    title: "Intervalllöpning", 
    category: "Kondition", 
    defaultDuration: 15,
    description: "Spring 30 sek högt tempo, vila 30 sek. Upprepa 8-10 gånger. Kan göras med boll: dribbla snabbt mellan koner."
  },
  { 
    id: "23", 
    title: "Shuttleruns", 
    category: "Kondition", 
    defaultDuration: 15,
    description: "Koner 10m, 20m, 30m från start. Spring till första, tillbaka, till andra, tillbaka osv. 3-4 set med paus mellan."
  },
  
  // Nedvarvning
  { 
    id: "7", 
    title: "Stretch & nedvarvning", 
    category: "Nedvarvning", 
    defaultDuration: 10,
    description: "Lugn joggning 2-3 varv. Statisk stretch: vadmuskler, lår, höftböjare, rygg. Håll varje stretch 20-30 sek. Samla laget för avslutande prat."
  },
  { 
    id: "24", 
    title: "Cirkelpass & stretch", 
    category: "Nedvarvning", 
    defaultDuration: 10,
    description: "Lugna passningar i cirkel, låg intensitet. Därefter stretch i par: hjälp varandra med stretch. Avrunda med gruppsamtal om träningen."
  }
];

const focusAreas = [
  "Teknik & Ballkontroll",
  "Passning & Mottagning",
  "Avslut & Skott",
  "Taktik & Positionsspel",
  "Kondition & Uthållighet",
  "1v1 Situationer",
  "Spelförståelse",
  "Anfallsspel",
  "Försvarsspel"
];

const equipmentOptions = [
  "Bollar",
  "Koner",
  "Hinder",
  "Ribbor",
  "Västar",
  "Mål",
  "Startblock",
  "Agility-stegar",
  "Koordinationsringar",
  "Markörer",
  "Träningsdummy",
  "Miniband"
];

const CreateTraining = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<TrainingSession>({
    title: "",
    date: new Date().toISOString().split('T')[0],
    time: "18:00",
    duration: 30,
    players: 6,
    focus: "",
    equipment: [],
    warmup: [],
    main: [],
    cooldown: [],
    notes: ""
  });

  const [showExerciseMenu, setShowExerciseMenu] = useState<"warmup" | "main" | "cooldown" | null>(null);

  const isExerciseInSection = (section: "warmup" | "main" | "cooldown", exerciseId: string) => {
    return session[section].some(ex => ex.id.startsWith(exerciseId));
  };

  const addExercise = (section: "warmup" | "main" | "cooldown", exerciseId: string) => {
    const exercise = exerciseBank.find(e => e.id === exerciseId);
    if (!exercise) return;

    const newExercise: TrainingExercise = {
      id: `${exerciseId}-${Date.now()}`,
      title: exercise.title,
      duration: exercise.defaultDuration,
      category: exercise.category,
    };

    setSession(prev => ({
      ...prev,
      [section]: [...prev[section], newExercise]
    }));
  };

  const toggleExercise = (section: "warmup" | "main" | "cooldown", exerciseId: string) => {
    const isInSection = isExerciseInSection(section, exerciseId);
    
    if (isInSection) {
      // Ta bort övningen
      setSession(prev => ({
        ...prev,
        [section]: prev[section].filter(e => !e.id.startsWith(exerciseId))
      }));
    } else {
      // Lägg till övningen
      addExercise(section, exerciseId);
    }
  };

  const removeExercise = (section: "warmup" | "main" | "cooldown", exerciseId: string) => {
    setSession(prev => ({
      ...prev,
      [section]: prev[section].filter(e => e.id !== exerciseId)
    }));
  };

  const updateExerciseDuration = (section: "warmup" | "main" | "cooldown", exerciseId: string, duration: number) => {
    setSession(prev => ({
      ...prev,
      [section]: prev[section].map(e => 
        e.id === exerciseId ? { ...e, duration } : e
      )
    }));
  };

  const getTotalDuration = () => {
    const warmupTotal = session.warmup.reduce((sum, e) => sum + e.duration, 0);
    const mainTotal = session.main.reduce((sum, e) => sum + e.duration, 0);
    const cooldownTotal = session.cooldown.reduce((sum, e) => sum + e.duration, 0);
    return warmupTotal + mainTotal + cooldownTotal;
  };

  const handleSave = () => {
    if (!session.title || !session.focus) {
      toast.error("Vänligen fyll i titel och fokusområde");
      return;
    }

    if (session.warmup.length === 0 && session.main.length === 0) {
      toast.error("Lägg till minst en övning");
      return;
    }

    toast.success("Träning sparad!");
    setTimeout(() => navigate("/planner"), 1000);
  };

  const generateTrainingSession = () => {
    if (!session.focus) {
      toast.error("Välj ett fokusområde först");
      return;
    }

    const warmupExercises = getFilteredExercises("warmup");
    const mainExercises = getFilteredExercises("main");
    const cooldownExercises = getFilteredExercises("cooldown");

    const selectedWarmup = warmupExercises.slice(0, 2);
    const selectedMain = mainExercises.slice(0, 3);
    const selectedCooldown = cooldownExercises.slice(0, 1);

    const newWarmup: TrainingExercise[] = selectedWarmup.map(ex => ({
      id: `${ex.id}-${Date.now()}-${Math.random()}`,
      title: ex.title,
      duration: ex.defaultDuration,
      category: ex.category
    }));

    const newMain: TrainingExercise[] = selectedMain.map(ex => ({
      id: `${ex.id}-${Date.now()}-${Math.random()}`,
      title: ex.title,
      duration: ex.defaultDuration,
      category: ex.category
    }));

    const newCooldown: TrainingExercise[] = selectedCooldown.map(ex => ({
      id: `${ex.id}-${Date.now()}-${Math.random()}`,
      title: ex.title,
      duration: ex.defaultDuration,
      category: ex.category
    }));

    setSession(prev => ({
      ...prev,
      warmup: newWarmup,
      main: newMain,
      cooldown: newCooldown
    }));

    toast.success("Träningspass genererat!");
  };

  const toggleEquipment = (equipment: string) => {
    setSession(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipment)
        ? prev.equipment.filter(e => e !== equipment)
        : [...prev.equipment, equipment]
    }));
  };

  const getFilteredExercises = (section: "warmup" | "main" | "cooldown") => {
    const categoryMap = {
      warmup: ["Uppvärmning"],
      main: ["Passning", "Teknik", "Avslut", "Taktik", "Spelform", "Kondition"],
      cooldown: ["Nedvarvning"]
    };
    
    let filtered = exerciseBank.filter(ex => categoryMap[section].includes(ex.category));
    
    // Filtrera också baserat på fokusområde om ett är valt
    if (session.focus) {
      const focusMapping: Record<string, string[]> = {
        "Teknik & Ballkontroll": ["Teknik", "Uppvärmning"],
        "Passning & Mottagning": ["Passning", "Uppvärmning"],
        "Avslut & Skott": ["Avslut"],
        "Taktik & Positionsspel": ["Taktik"],
        "Kondition & Uthållighet": ["Kondition"],
        "1v1 Situationer": ["Teknik"],
        "Spelförståelse": ["Taktik", "Spelform"],
        "Anfallsspel": ["Avslut", "Passning", "Spelform"],
        "Försvarsspel": ["Taktik"]
      };
      
      const relevantCategories = focusMapping[session.focus];
      if (relevantCategories && section === "main") {
        filtered = filtered.filter(ex => relevantCategories.includes(ex.category));
      }
    }
    
    return filtered;
  };

  const ExerciseSection = ({ 
    title, 
    section, 
    exercises,
    description 
  }: { 
    title: string; 
    section: "warmup" | "main" | "cooldown"; 
    exercises: TrainingExercise[];
    description: string;
  }) => {
    const filteredExercises = getFilteredExercises(section);
    
    return (
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between w-full pr-4">
              <span className="text-xl font-semibold">{title}</span>
              <Badge variant="outline">
                {exercises.reduce((sum, e) => sum + e.duration, 0)} min
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {exercises.map((exercise) => (
                  <div key={exercise.id} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                    <div className="flex-1">
                      <p className="font-medium">{exercise.title}</p>
                      <p className="text-sm text-muted-foreground">{exercise.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={exercise.duration}
                        onChange={(e) => updateExerciseDuration(section, exercise.id, parseInt(e.target.value) || 0)}
                        className="w-20 text-center"
                        min="1"
                      />
                      <span className="text-sm text-muted-foreground">min</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExercise(section, exercise.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}

                {showExerciseMenu === section ? (
                  <div className="border-2 border-dashed border-border rounded-lg p-4 space-y-2">
                    <p className="text-sm font-medium mb-3">Välj övning från banken:</p>
                    <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto">
                      {filteredExercises.map((exercise) => {
                        const isInSection = isExerciseInSection(section, exercise.id);
                        return (
                          <div 
                            key={exercise.id} 
                            className={`border rounded-lg p-3 hover:bg-secondary/50 transition-colors cursor-pointer ${isInSection ? 'border-2 border-primary bg-primary/5' : ''}`}
                            onClick={() => toggleExercise(section, exercise.id)}
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm mb-1">{exercise.title}</h4>
                                <Badge variant="secondary" className="text-xs">
                                  {exercise.category}
                                </Badge>
                              </div>
                              <Button
                                variant={isInSection ? "destructive" : "outline"}
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExercise(section, exercise.id);
                                }}
                              >
                                {isInSection ? (
                                  <>
                                    <X className="w-4 h-4 mr-1" />
                                    Ta bort
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-4 h-4 mr-1" />
                                    Lägg till
                                  </>
                                )}
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">{exercise.description}</p>
                          </div>
                        );
                      })}
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full mt-2"
                      onClick={() => setShowExerciseMenu(null)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Avbryt
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full border-dashed"
                    onClick={() => setShowExerciseMenu(section)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Lägg till övning
                  </Button>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/planner")}
              className="mb-4"
            >
              ← Tillbaka till Planering
            </Button>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
              Skapa träningspass
            </h1>
            <p className="text-muted-foreground text-lg">
              Bygg upp ditt träningspass genom att välja övningar och sätta tider
            </p>
          </div>

          {/* Basic Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Grundinformation</CardTitle>
              <CardDescription>Fyll i detaljer om träningspasset</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Titel *</Label>
                <Input
                  id="title"
                  placeholder="T.ex. Passningsfokus"
                  value={session.title}
                  onChange={(e) => setSession({ ...session, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Datum</Label>
                  <Input
                    id="date"
                    type="date"
                    value={session.date}
                    onChange={(e) => setSession({ ...session, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Starttid</Label>
                  <Input
                    id="time"
                    type="time"
                    value={session.time}
                    onChange={(e) => setSession({ ...session, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Önskad träningstid (minuter)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={session.duration === 0 ? "" : session.duration}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSession({ ...session, duration: value === "" ? 0 : Math.max(10, parseInt(value) || 0) });
                    }}
                    min="10"
                    step="5"
                  />
                </div>
                <div>
                  <Label htmlFor="players">Antal spelare</Label>
                  <Input
                    id="players"
                    type="number"
                    value={session.players === 0 ? "" : session.players}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSession({ ...session, players: value === "" ? 0 : Math.max(1, parseInt(value) || 0) });
                    }}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="focus">Fokusområde *</Label>
                  <Select value={session.focus} onValueChange={(value) => setSession({ ...session, focus: value })}>
                    <SelectTrigger id="focus">
                      <SelectValue placeholder="Välj fokusområde" />
                    </SelectTrigger>
                    <SelectContent>
                      {focusAreas.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Tillgänglig utrustning</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {equipmentOptions.map((equipment) => (
                    <div key={equipment} className="flex items-center space-x-2">
                      <Checkbox
                        id={equipment}
                        checked={session.equipment.includes(equipment)}
                        onCheckedChange={() => toggleEquipment(equipment)}
                      />
                      <label
                        htmlFor={equipment}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {equipment}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Anteckningar</Label>
                <Textarea
                  id="notes"
                  placeholder="Lägg till anteckningar om träningspasset..."
                  value={session.notes}
                  onChange={(e) => setSession({ ...session, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Generate Training Button */}
          <Card className="mb-6 bg-gradient-primary text-primary-foreground border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Behöver du hjälp?</h3>
                  <p className="text-sm opacity-90">Generera ett komplett träningspass baserat på dina val</p>
                </div>
                <Button
                  variant="hero"
                  size="lg"
                  onClick={generateTrainingSession}
                  disabled={!session.focus}
                >
                  <Wand2 className="w-5 h-5 mr-2" />
                  Generera
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Duration Overview */}
          <Card className="mb-6 bg-gradient-accent text-accent-foreground border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8" />
                  <div>
                    <p className="text-sm opacity-90">Total träningstid</p>
                    <p className="text-3xl font-bold">{getTotalDuration()} min</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm opacity-90">{session.players} spelare</span>
                  </div>
                  {session.focus && (
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <span className="text-sm opacity-90">{session.focus}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exercise Sections */}
          <div className="space-y-6 mb-6">
            <ExerciseSection
              title="Uppvärmning"
              section="warmup"
              exercises={session.warmup}
              description="Förbered kroppen för träning"
            />

            <ExerciseSection
              title="Huvudmoment"
              section="main"
              exercises={session.main}
              description="Fokusövningar för dagens tema"
            />

            <ExerciseSection
              title="Nedvarvning"
              section="cooldown"
              exercises={session.cooldown}
              description="Avsluta träningen lugnt"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 sticky bottom-4">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => navigate("/planner")}
            >
              Avbryt
            </Button>
            <Button
              variant="hero"
              size="lg"
              className="flex-1"
              onClick={handleSave}
            >
              <Save className="w-5 h-5 mr-2" />
              Spara träning
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateTraining;
