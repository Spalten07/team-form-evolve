import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, Target, Clock, Filter } from "lucide-react";
import { useState } from "react";

interface Exercise {
  id: number;
  title: string;
  category: string;
  players: string;
  duration: string;
  difficulty: "Nybörjare" | "Medel" | "Avancerad";
  equipment: string[];
  description: string;
}

const mockExercises: Exercise[] = [
  {
    id: 1,
    title: "Passningstriangel",
    category: "Passning",
    players: "3-4 spelare",
    duration: "10-15 min",
    difficulty: "Nybörjare",
    equipment: ["Bollar", "Koner"],
    description: "Grundläggande passningsövning i triangelformation. Fokus på teknik och första touch."
  },
  {
    id: 2,
    title: "1v1 Dribbling",
    category: "Teknik",
    players: "2 spelare",
    duration: "15-20 min",
    difficulty: "Medel",
    equipment: ["Bollar", "Koner", "Mål"],
    description: "Träna en-mot-en situationer med fokus på dribblingsteknik och avslut."
  },
  {
    id: 3,
    title: "Positionsspel 4v4+1",
    category: "Taktik",
    players: "9 spelare",
    duration: "20 min",
    difficulty: "Avancerad",
    equipment: ["Bollar", "Koner", "Västar"],
    description: "Avancerad positionsspelsövning med fokus på att behålla bollen och skapa ytor."
  },
];

const Exercises = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const filteredExercises = mockExercises.filter(exercise => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exercise.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = !selectedDifficulty || exercise.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Nybörjare": return "bg-success/10 text-success hover:bg-success/20";
      case "Medel": return "bg-warning/10 text-warning hover:bg-warning/20";
      case "Avancerad": return "bg-destructive/10 text-destructive hover:bg-destructive/20";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
            Övningsbank
          </h1>
          <p className="text-muted-foreground text-lg">
            Hitta perfekta övningar för din träning eller solo-session
          </p>
        </div>

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
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Svårighetsgrad:</span>
            <Button
              variant={selectedDifficulty === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDifficulty(null)}
            >
              Alla
            </Button>
            <Button
              variant={selectedDifficulty === "Nybörjare" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDifficulty("Nybörjare")}
            >
              Nybörjare
            </Button>
            <Button
              variant={selectedDifficulty === "Medel" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDifficulty("Medel")}
            >
              Medel
            </Button>
            <Button
              variant={selectedDifficulty === "Avancerad" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDifficulty("Avancerad")}
            >
              Avancerad
            </Button>
          </div>
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
            <Card key={exercise.id} className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getDifficultyColor(exercise.difficulty)}>
                    {exercise.difficulty}
                  </Badge>
                  <Badge variant="outline">{exercise.category}</Badge>
                </div>
                <CardTitle className="text-xl">{exercise.title}</CardTitle>
                <CardDescription>{exercise.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    {exercise.players}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {exercise.duration}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="w-4 h-4" />
                    {exercise.equipment.join(", ")}
                  </div>
                  <Button variant="default" className="w-full mt-4">
                    Visa detaljer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Inga övningar hittades</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Exercises;
