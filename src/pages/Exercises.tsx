import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, Users, Target, Clock, Lightbulb, Play, Plus, X, Trash2, Sparkles, Check } from "lucide-react";
import { useState } from "react";

interface Exercise {
  id: string;
  title: string;
  category: string;
  minPlayers: number;
  maxPlayers: number;
  duration: number;
  equipment: string[];
  description: string;
}

interface SelectedExercise extends Exercise {
  customDuration: number;
}

const exercises: Exercise[] = [
  { 
    id: "1", 
    title: "Joggning & dynamisk stretch", 
    category: "Uppvärmning", 
    minPlayers: 1,
    maxPlayers: 30,
    duration: 10,
    equipment: [],
    description: "Börja med lätt joggning 3-4 varv. Följ med dynamisk stretch: bensvingar, armcirklar, höftrotationer."
  },
  { 
    id: "8", 
    title: "Koordinationsstege", 
    category: "Uppvärmning", 
    minPlayers: 1,
    maxPlayers: 20,
    duration: 10,
    equipment: ["Koordinationsstege"],
    description: "Placera koordinationsstege på marken. Övningar: snabba fötter, sidosteg, hopp på ett ben."
  },
  { 
    id: "11", 
    title: "Rondo 4v1", 
    category: "Uppvärmning", 
    minPlayers: 5,
    maxPlayers: 10,
    duration: 10,
    equipment: ["Bollar", "Koner"],
    description: "Fyra spelare bildar kvadrat, en i mitten försöker ta bollen. Snabba passningar, byt var 60:e sekund."
  },
  { 
    id: "12", 
    title: "Bollkänsla par", 
    category: "Uppvärmning", 
    minPlayers: 2,
    maxPlayers: 20,
    duration: 10,
    equipment: ["Bollar"],
    description: "Par står 5m från varandra. Passa med insida, utsida, trampa bollen. Öka tempo gradvis."
  },
  { 
    id: "2", 
    title: "Passningstriangel", 
    category: "Passning", 
    minPlayers: 3,
    maxPlayers: 12,
    duration: 15,
    equipment: ["Bollar", "Koner"],
    description: "Tre spelare i triangel 10m mellanrum. Passa och följ bollen till nästa position."
  },
  { 
    id: "9", 
    title: "Fyrkantspassning", 
    category: "Passning", 
    minPlayers: 4,
    maxPlayers: 16,
    duration: 15,
    equipment: ["Bollar", "Koner"],
    description: "Fyra koner i kvadrat, spelare i varje hörn. Passa diagonalt och rakt, följ passningen."
  },
  { 
    id: "13", 
    title: "Långpassning parvis", 
    category: "Passning", 
    minPlayers: 2,
    maxPlayers: 20,
    duration: 15,
    equipment: ["Bollar"],
    description: "Par står 20-30m från varandra. Öva långa passningar i luften och längs mark."
  },
  { 
    id: "3", 
    title: "1v1 Dribbling", 
    category: "Teknik", 
    minPlayers: 2,
    maxPlayers: 20,
    duration: 15,
    equipment: ["Bollar", "Koner"],
    description: "Par i zon 10x10m. En dribblar, en försvarar. Försök ta sig förbi motståndare med finter."
  },
  { 
    id: "10", 
    title: "Huvudspel", 
    category: "Teknik", 
    minPlayers: 2,
    maxPlayers: 20,
    duration: 15,
    equipment: ["Bollar"],
    description: "Par kastar boll till varandra för nick. Fokus: ögon på boll, panna mot boll, nicka nedåt."
  },
  { 
    id: "14", 
    title: "Jongleringsutmaning", 
    category: "Teknik", 
    minPlayers: 1,
    maxPlayers: 30,
    duration: 10,
    equipment: ["Bollar"],
    description: "Spelare jonglerar själva eller tävlar parvis. Räkna träffar: fot, lår, huvud."
  },
  { 
    id: "15", 
    title: "Vändningar med boll", 
    category: "Teknik", 
    minPlayers: 1,
    maxPlayers: 20,
    duration: 15,
    equipment: ["Bollar", "Koner"],
    description: "Koner i rad 5m mellanrum. Dribbla till kon, vänd med insida/utsida/sula."
  },
  { 
    id: "4", 
    title: "Skottövning", 
    category: "Avslut", 
    minPlayers: 3,
    maxPlayers: 20,
    duration: 20,
    equipment: ["Bollar", "Mål"],
    description: "Spelare i kö 16-18m från mål. En passare lägger till, skjut direkt eller efter touch."
  },
  { 
    id: "16", 
    title: "Avslut efter löpning", 
    category: "Avslut", 
    minPlayers: 3,
    maxPlayers: 15,
    duration: 20,
    equipment: ["Bollar", "Mål", "Koner"],
    description: "Spelare springer från kant, får passning i löpbana, avslutar. Variera från höger/vänster."
  },
  { 
    id: "17", 
    title: "Skott i rörelse", 
    category: "Avslut", 
    minPlayers: 1,
    maxPlayers: 10,
    duration: 20,
    equipment: ["Bollar", "Mål", "Koner"],
    description: "Dribbla genom koner, avsluta på mål. Kombinera teknik och avslut."
  },
  { 
    id: "5", 
    title: "Positionsspel 4v4+1", 
    category: "Taktik", 
    minPlayers: 9,
    maxPlayers: 11,
    duration: 20,
    equipment: ["Bollar", "Koner", "Västar"],
    description: "Fyra mot fyra plus en joker som spelar med bollinnehavare. Zon 20x20m."
  },
  { 
    id: "18", 
    title: "Överspel till zon", 
    category: "Taktik", 
    minPlayers: 8,
    maxPlayers: 16,
    duration: 20,
    equipment: ["Bollar", "Koner", "Västar"],
    description: "Dela plan i tre zoner. Lag ska spela bollen från egen zon till sista zonen."
  },
  { 
    id: "19", 
    title: "Snabbväxling", 
    category: "Taktik", 
    minPlayers: 6,
    maxPlayers: 14,
    duration: 15,
    equipment: ["Bollar", "Koner", "Västar"],
    description: "Vid bolltapp direkt press för att vinna tillbaka. Vid bollvinst snabb övergång till anfall."
  },
  { 
    id: "6", 
    title: "Matchspel", 
    category: "Spelform", 
    minPlayers: 4,
    maxPlayers: 22,
    duration: 20,
    equipment: ["Bollar", "Mål", "Västar"],
    description: "Vanligt matchspel, anpassad planstorlek. Låt spelarna använda det de tränat."
  },
  { 
    id: "20", 
    title: "Små mål 4v4", 
    category: "Spelform", 
    minPlayers: 8,
    maxPlayers: 8,
    duration: 20,
    equipment: ["Bollar", "Små mål"],
    description: "Fyra mot fyra, små mål utan målvakter. Plan 30x20m. Tvingar spelarna till precision."
  },
  { 
    id: "21", 
    title: "Zonfotboll", 
    category: "Spelform", 
    minPlayers: 6,
    maxPlayers: 14,
    duration: 20,
    equipment: ["Bollar", "Koner", "Västar"],
    description: "Spelare måste stanna i tilldelad zon. Utvecklar positionsspel och förståelse."
  },
  { 
    id: "22", 
    title: "Intervalllöpning", 
    category: "Kondition", 
    minPlayers: 1,
    maxPlayers: 30,
    duration: 15,
    equipment: ["Bollar (valfritt)"],
    description: "Spring 30 sek högt tempo, vila 30 sek. Upprepa 8-10 gånger."
  },
  { 
    id: "23", 
    title: "Shuttleruns", 
    category: "Kondition", 
    minPlayers: 1,
    maxPlayers: 30,
    duration: 15,
    equipment: ["Koner"],
    description: "Koner 10m, 20m, 30m från start. Spring till första, tillbaka, till andra, tillbaka osv."
  },
  { 
    id: "7", 
    title: "Stretch & nedvarvning", 
    category: "Nedvarvning", 
    minPlayers: 1,
    maxPlayers: 30,
    duration: 10,
    equipment: [],
    description: "Lugn joggning 2-3 varv. Statisk stretch: vadmuskler, lår, höftböjare, rygg."
  },
  { 
    id: "24", 
    title: "Cirkelpass & stretch", 
    category: "Nedvarvning", 
    minPlayers: 4,
    maxPlayers: 20,
    duration: 10,
    equipment: ["Bollar"],
    description: "Lugna passningar i cirkel, låg intensitet. Därefter stretch i par."
  }
];

const Exercises = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [playerCount, setPlayerCount] = useState<number>(0);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Alla");
  const [customDuration, setCustomDuration] = useState<number>(60);
  const [recommendedSessions, setRecommendedSessions] = useState<Exercise[][] | null>(null);
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>([]);
  const [showCustomSession, setShowCustomSession] = useState(false);
  const [showRecommendedSessions, setShowRecommendedSessions] = useState(true);

  const allEquipment = ["Bollar", "Koner", "Mål", "Små mål", "Västar", "Koordinationsstege", "Hinder", "Markörer", "Träningsdummy", "Startblock", "Agility-stegar", "Miniband", "Piloner", "Träningskoner"];
  const categories = ["Alla", "Uppvärmning", "Passning", "Teknik", "Avslut", "Taktik", "Spelform", "Kondition", "Nedvarvning"];

  const toggleEquipment = (equipment: string) => {
    setSelectedEquipment(prev =>
      prev.includes(equipment)
        ? prev.filter(e => e !== equipment)
        : [...prev, equipment]
    );
  };

  const addToCustomSession = (exercise: Exercise) => {
    const isAlreadySelected = selectedExercises.some(ex => ex.id === exercise.id);
    if (isAlreadySelected) {
      setSelectedExercises(prev => prev.filter(ex => ex.id !== exercise.id));
    } else {
      setSelectedExercises(prev => [...prev, { ...exercise, customDuration: exercise.duration }]);
      setShowCustomSession(true);
    }
  };

  const isExerciseSelected = (exerciseId: string) => {
    return selectedExercises.some(ex => ex.id === exerciseId);
  };

  const removeFromCustomSession = (index: number) => {
    setSelectedExercises(prev => prev.filter((_, i) => i !== index));
  };

  const updateCustomDuration = (index: number, duration: number) => {
    setSelectedExercises(prev => prev.map((ex, i) => 
      i === index ? { ...ex, customDuration: duration } : ex
    ));
  };

  const generateMultipleSessions = () => {
    if (playerCount === 0) return;

    let filteredExercises = exercises.filter(ex => 
      ex.minPlayers <= playerCount && ex.maxPlayers >= playerCount
    );

    if (selectedEquipment.length > 0) {
      filteredExercises = filteredExercises.filter(ex =>
        ex.equipment.length === 0 || ex.equipment.some(eq => selectedEquipment.includes(eq))
      );
    }

    if (filteredExercises.length < 3) {
      setRecommendedSessions([]);
      return;
    }

    // Generera 3 olika träningspass
    const sessions: Exercise[][] = [];
    for (let sessionNum = 0; sessionNum < 3; sessionNum++) {
      const session: Exercise[] = [];
      let totalDuration = 0;
      const usedExercises = new Set<string>();

      // Välj olika övningar för varje pass
      const warmup = filteredExercises.filter(ex => 
        ex.category === "Uppvärmning" && !usedExercises.has(ex.id)
      );
      const main = filteredExercises.filter(ex => 
        ["Passning", "Teknik", "Avslut", "Taktik", "Spelform"].includes(ex.category) && !usedExercises.has(ex.id)
      );
      const cooldown = filteredExercises.filter(ex => 
        ex.category === "Nedvarvning" && !usedExercises.has(ex.id)
      );

      // Lägg till uppvärmning
      if (warmup.length > 0) {
        const warmupIndex = (sessionNum * 2) % warmup.length;
        const selectedWarmup = warmup[warmupIndex];
        session.push(selectedWarmup);
        totalDuration += selectedWarmup.duration;
        usedExercises.add(selectedWarmup.id);
      }

      // Lägg till huvudövningar
      const targetMainDuration = customDuration - totalDuration - 10;
      const shuffledMain = [...main].sort(() => Math.random() - 0.5);
      
      for (const exercise of shuffledMain) {
        if (totalDuration >= customDuration - 10) break;
        if (totalDuration + exercise.duration <= customDuration - 10) {
          session.push(exercise);
          totalDuration += exercise.duration;
          usedExercises.add(exercise.id);
        }
      }

      // Lägg till nedvarvning
      if (cooldown.length > 0) {
        const cooldownIndex = sessionNum % cooldown.length;
        const selectedCooldown = cooldown[cooldownIndex];
        session.push(selectedCooldown);
        totalDuration += selectedCooldown.duration;
        usedExercises.add(selectedCooldown.id);
      }

      if (session.length >= 3) {
        sessions.push(session);
      }
    }

    setRecommendedSessions(sessions.length > 0 ? sessions : []);
  };

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exercise.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlayers = playerCount === 0 || (exercise.minPlayers <= playerCount && exercise.maxPlayers >= playerCount);
    const matchesEquipment = selectedEquipment.length === 0 || 
      exercise.equipment.length === 0 ||
      exercise.equipment.some(eq => selectedEquipment.includes(eq));
    const matchesCategory = selectedCategory === "Alla" || exercise.category === selectedCategory;
    
    return matchesSearch && matchesPlayers && matchesEquipment && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
            Övningsbank
          </h1>
          <p className="text-muted-foreground text-lg">
            Hitta övningar och skapa träningspass anpassade efter dina förutsättningar
          </p>
        </div>

        {/* Custom Session Builder */}
        {showCustomSession && selectedExercises.length > 0 && (
          <Card className="mb-8 border-2 border-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Ditt anpassade träningspass
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCustomSession(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription>
                Totalt: {selectedExercises.reduce((sum, ex) => sum + ex.customDuration, 0)} minuter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedExercises.map((exercise, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{exercise.title}</p>
                    <p className="text-sm text-muted-foreground">{exercise.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={exercise.customDuration}
                      onChange={(e) => updateCustomDuration(index, parseInt(e.target.value) || 0)}
                      className="w-20 text-center"
                      min="1"
                    />
                    <span className="text-sm text-muted-foreground">min</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCustomSession(index)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* AI Generator */}
        <Accordion type="single" collapsible defaultValue="item-1" className="mb-8">
          <AccordionItem value="item-1">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-xl font-semibold">Generera träningsförslag</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardDescription>
                    Få tre olika träningspass baserade på dina förutsättningar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="players">Antal spelare *</Label>
                      <Input
                        id="players"
                        type="number"
                        placeholder="T.ex. 10"
                        value={playerCount === 0 ? "" : playerCount}
                        onChange={(e) => {
                          const value = e.target.value;
                          setPlayerCount(value === "" ? 0 : Math.max(1, parseInt(value) || 0));
                        }}
                        min="1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Önskad träningstid (minuter)</Label>
                      <Select
                        value={customDuration.toString()}
                        onValueChange={(value) => setCustomDuration(parseInt(value))}
                      >
                        <SelectTrigger id="duration">
                          <SelectValue placeholder="Välj träningstid" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {Array.from({ length: 23 }, (_, i) => (i + 2) * 5).map((minutes) => (
                            <SelectItem key={minutes} value={minutes.toString()}>
                              {minutes} minuter
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Tillgänglig utrustning</Label>
                    <div className="flex flex-wrap gap-2">
                      {allEquipment.map((equipment) => (
                        <Badge
                          key={equipment}
                          variant={selectedEquipment.includes(equipment) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleEquipment(equipment)}
                        >
                          {equipment}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={generateMultipleSessions} 
                    className="w-full"
                    disabled={playerCount === 0}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generera 3 träningsförslag
                  </Button>

                  {recommendedSessions && recommendedSessions.length > 0 && (
                    <Accordion type="single" collapsible value={showRecommendedSessions ? "suggestions" : ""} onValueChange={(value) => setShowRecommendedSessions(value === "suggestions")}>
                      <AccordionItem value="suggestions" className="border-0">
                        <AccordionTrigger className="hover:no-underline">
                          <h3 className="font-semibold text-lg">Mina träningsförslag ({recommendedSessions.length})</h3>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-6 mt-2">
                            {recommendedSessions.map((session, sessionIndex) => (
                              <Card key={sessionIndex} className="bg-secondary/30">
                                <CardHeader>
                                  <CardTitle className="text-lg">Alternativ {sessionIndex + 1}</CardTitle>
                                  <CardDescription>
                                    Total tid: {session.reduce((sum, ex) => sum + ex.duration, 0)} minuter
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                  {session.map((exercise, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 bg-background rounded-lg">
                                      <Badge variant="outline" className="mt-1">
                                        {exercise.duration} min
                                      </Badge>
                                      <div className="flex-1">
                                        <p className="font-medium">{exercise.title}</p>
                                        <p className="text-sm text-muted-foreground">{exercise.category}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{exercise.description}</p>
                                      </div>
                                    </div>
                                  ))}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}

                  {recommendedSessions && recommendedSessions.length === 0 && (
                    <p className="text-center text-muted-foreground text-sm mt-4">
                      Kunde inte generera träningspass med valda förutsättningar. Försök justera antalet spelare eller utrustning.
                    </p>
                  )}
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Sök övningar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Kategori:</span>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => {
            const isSelected = isExerciseSelected(exercise.id);
            return (
              <Card 
                key={exercise.id} 
                className={`hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer ${isSelected ? 'border-2 border-primary' : ''}`}
                onClick={() => addToCustomSession(exercise)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline">{exercise.category}</Badge>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{exercise.duration} min</Badge>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{exercise.title}</CardTitle>
                  <CardDescription>{exercise.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {exercise.minPlayers === exercise.maxPlayers 
                        ? `${exercise.minPlayers} spelare`
                        : `${exercise.minPlayers}-${exercise.maxPlayers} spelare`}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Target className="w-4 h-4" />
                      {exercise.equipment.length > 0 ? exercise.equipment.join(", ") : "Ingen utrustning behövs"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Inga övningar hittades med valda filter</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Exercises;