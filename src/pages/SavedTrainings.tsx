import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Target, Edit, Trash2, Copy } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SavedTraining {
  id: number;
  title: string;
  duration: number;
  focus: string;
  players: number;
  exercises: number;
  createdDate: string;
}

const mockSavedTrainings: SavedTraining[] = [
  {
    id: 1,
    title: "Passningsteknik & Spelförståelse",
    duration: 90,
    focus: "Teknik & Passning",
    players: 16,
    exercises: 8,
    createdDate: "2025-10-20"
  },
  {
    id: 2,
    title: "Avslutsfokus & Målskytte",
    duration: 75,
    focus: "Avslut",
    players: 18,
    exercises: 6,
    createdDate: "2025-10-15"
  },
  {
    id: 3,
    title: "Taktisk träning - Positionsspel",
    duration: 90,
    focus: "Taktik & Positionsspel",
    players: 20,
    exercises: 7,
    createdDate: "2025-10-10"
  },
  {
    id: 4,
    title: "Kondition & Snabbhet",
    duration: 60,
    focus: "Kondition",
    players: 16,
    exercises: 5,
    createdDate: "2025-10-05"
  }
];

const SavedTrainings = () => {
  const navigate = useNavigate();
  const [trainings, setTrainings] = useState<SavedTraining[]>(mockSavedTrainings);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('sv-SE', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  const handleDelete = (id: number) => {
    setTrainings(prev => prev.filter(t => t.id !== id));
    toast.success("Träningspass borttaget");
  };

  const handleDuplicate = (training: SavedTraining) => {
    const newTraining = {
      ...training,
      id: Math.max(...trainings.map(t => t.id)) + 1,
      title: `${training.title} (kopia)`,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setTrainings(prev => [newTraining, ...prev]);
    toast.success("Träningspass duplicerat");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
            Mina träningspass
          </h1>
          <p className="text-muted-foreground text-lg">
            Dina sparade träningspass som du kan återanvända
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{trainings.length}</CardTitle>
              <CardDescription>Sparade träningspass</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {Math.round(trainings.reduce((sum, t) => sum + t.duration, 0) / trainings.length)} min
              </CardTitle>
              <CardDescription>Genomsnittlig längd</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {trainings.reduce((sum, t) => sum + t.exercises, 0)}
              </CardTitle>
              <CardDescription>Totalt antal övningar</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Training Sessions List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Träningspass</h2>
          
          {trainings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground text-lg">
                  Inga sparade träningspass ännu
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Skapa ett nytt träningspass och spara det för att återanvända senare
                </p>
              </CardContent>
            </Card>
          ) : (
            trainings.map((training) => (
              <Card key={training.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline">
                          Sparad {formatDate(training.createdDate)}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-1">{training.title}</CardTitle>
                      <CardDescription>
                        {training.exercises} övningar • {training.focus}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {training.duration} minuter
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {training.players} spelare
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Target className="w-4 h-4" />
                      {training.focus}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="default" 
                      className="flex-1 gap-2"
                      onClick={() => {
                        navigate('/create-training', { state: { editingTraining: training } });
                      }}
                    >
                      <Edit className="w-4 h-4" />
                      Redigera
                    </Button>
                    <Button 
                      variant="outline" 
                      className="gap-2"
                      onClick={() => handleDuplicate(training)}
                    >
                      <Copy className="w-4 h-4" />
                      Duplicera
                    </Button>
                    <Button 
                      variant="outline" 
                      className="gap-2 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(training.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default SavedTrainings;
