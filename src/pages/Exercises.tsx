import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Users, Target, Clock, Lightbulb, Play } from "lucide-react";
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
  const [recommendedSession, setRecommendedSession] = useState<Exercise[] | null>(null);

  const allEquipment = ["Bollar", "Koner", "Mål", "Små mål", "Västar", "Koordinationsstege"];
  const categories = ["Alla", "Uppvärmning", "Passning", "Teknik", "Avslut", "Taktik", "Spelform", "Kondition", "Nedvarvning"];

  const toggleEquipment = (equipment: string) => {
    setSelectedEquipment(prev =>
      prev.includes(equipment)
        ? prev.filter(e => e !== equipment)
        : [...prev, equipment]
    );
  };

  const generateRecommendation = () => {
    if (playerCount === 0) return;

    let filteredExercises = exercises.filter(ex => 
      ex.minPlayers <= playerCount && ex.maxPlayers >= playerCount
    );

    if (selectedEquipment.length > 0) {
      filteredExercises = filteredExercises.filter(ex =>
        ex.equipment.length === 0 || ex.equipment.some(eq => selectedEquipment.includes(eq))
      );
    }

    // Bygg ett träningspass
    const warmup = filteredExercises.filter(ex => ex.category === "Uppvärmning");
    const main = filteredExercises.filter(ex => 
      ["Passning", "Teknik", "Avslut", "Taktik", "Spelform"].includes(ex.category)
    );
    const cooldown = filteredExercises.filter(ex => ex.category === "Nedvarvning");

    const session: Exercise[] = [];
    let totalDuration = 0;

    // Lägg till uppvärmning (10 min)
    if (warmup.length > 0) {
      const randomWarmup = warmup[Math.floor(Math.random() * warmup.length)];
      session.push(randomWarmup);
      totalDuration += randomWarmup.duration;
    }

    // Lägg till huvudpass (tills vi når önskad tid - 10 min för nedvarvning)
    const targetMainDuration = customDuration - totalDuration - 10;
    while (main.length > 0 && totalDuration < customDuration - 10) {
      const randomMain = main[Math.floor(Math.random() * main.length)];
      if (totalDuration + randomMain.duration <= customDuration - 10) {
        session.push(randomMain);
        totalDuration += randomMain.duration;
      }
      main.splice(main.indexOf(randomMain), 1);
    }

    // Lägg till nedvarvning
    if (cooldown.length > 0) {
      const randomCooldown = cooldown[Math.floor(Math.random() * cooldown.length)];
      session.push(randomCooldown);
      totalDuration += randomCooldown.duration;
    }

    setRecommendedSession(session);
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

        {/* Recommendation Generator */}
        <Card className="mb-8 border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Få träningsförslag
            </CardTitle>
            <CardDescription>
              Ställ in dina förutsättningar så genererar vi ett träningspass åt dig
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
                  value={playerCount || ""}
                  onChange={(e) => setPlayerCount(parseInt(e.target.value) || 0)}
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="duration">Önskad träningstid (minuter)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(parseInt(e.target.value) || 60)}
                  min="20"
                  max="120"
                />
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
              onClick={generateRecommendation} 
              className="w-full"
              disabled={playerCount === 0}
            >
              <Play className="w-4 h-4 mr-2" />
              Generera träningspass
            </Button>

            {recommendedSession && (
              <div className="mt-6 p-4 bg-secondary/50 rounded-lg space-y-3">
                <h3 className="font-semibold text-lg mb-3">Ditt träningsförslag:</h3>
                {recommendedSession.map((exercise, index) => (
                  <div key={exercise.id + index} className="flex items-start gap-3 p-3 bg-background rounded-lg">
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
                <div className="text-center pt-2 border-t">
                  <p className="text-sm font-medium">
                    Total tid: {recommendedSession.reduce((sum, ex) => sum + ex.duration, 0)} minuter
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

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
          {filteredExercises.map((exercise) => (
            <Card key={exercise.id} className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline">{exercise.category}</Badge>
                  <Badge variant="secondary">{exercise.duration} min</Badge>
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
          ))}
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