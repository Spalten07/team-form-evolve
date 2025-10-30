import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  PlayCircle
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
  warmup: TrainingExercise[];
  main: TrainingExercise[];
  cooldown: TrainingExercise[];
  notes: string;
}

const exerciseBank = [
  { id: "1", title: "Joggning & stretch", category: "Uppvärmning", defaultDuration: 10 },
  { id: "2", title: "Passningstriangel", category: "Passning", defaultDuration: 15 },
  { id: "3", title: "1v1 Dribbling", category: "Teknik", defaultDuration: 15 },
  { id: "4", title: "Skottövning", category: "Avslut", defaultDuration: 20 },
  { id: "5", title: "Positionsspel 4v4+1", category: "Taktik", defaultDuration: 20 },
  { id: "6", title: "Matchspel", category: "Spelform", defaultDuration: 20 },
  { id: "7", title: "Stretch & nedvarvning", category: "Nedvarvning", defaultDuration: 10 },
  { id: "8", title: "Koordinationsstege", category: "Uppvärmning", defaultDuration: 10 },
  { id: "9", title: "Fyrkantspassning", category: "Passning", defaultDuration: 15 },
  { id: "10", title: "Huvudspel", category: "Teknik", defaultDuration: 15 },
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

const CreateTraining = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<TrainingSession>({
    title: "",
    date: new Date().toISOString().split('T')[0],
    time: "18:00",
    duration: 90,
    players: 16,
    focus: "",
    warmup: [],
    main: [],
    cooldown: [],
    notes: ""
  });

  const [showExerciseMenu, setShowExerciseMenu] = useState<"warmup" | "main" | "cooldown" | null>(null);

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
    setShowExerciseMenu(null);
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
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <Badge variant="outline">
            {exercises.reduce((sum, e) => sum + e.duration, 0)} min
          </Badge>
        </CardTitle>
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
            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
              {exerciseBank.map((exercise) => (
                <Button
                  key={exercise.id}
                  variant="outline"
                  className="justify-start"
                  onClick={() => addExercise(section, exercise.id)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="flex-1 text-left">{exercise.title}</span>
                  <Badge variant="secondary" className="ml-2">
                    {exercise.category}
                  </Badge>
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full"
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
  );

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
                  <Label htmlFor="players">Antal spelare</Label>
                  <Input
                    id="players"
                    type="number"
                    value={session.players}
                    onChange={(e) => setSession({ ...session, players: parseInt(e.target.value) || 0 })}
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
