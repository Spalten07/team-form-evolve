import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Target, Edit, Trash2, Copy, Archive } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface SavedTraining {
  id: string;
  title: string;
  duration: number;
  focus: string;
  players: number;
  exercises: any;
  created_at: string;
  deleted_at: string | null;
}

const SavedTrainings = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [trainings, setTrainings] = useState<SavedTraining[]>([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [loadingTrainings, setLoadingTrainings] = useState(true);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Fetch trainings
  useEffect(() => {
    if (!user) return;

    const fetchTrainings = async () => {
      try {
        setLoadingTrainings(true);
        const query = supabase
          .from('saved_trainings')
          .select('*')
          .eq('coach_id', user.id)
          .order('created_at', { ascending: false });

        if (!showDeleted) {
          query.is('deleted_at', null);
        }

        const { data, error } = await query;

        if (error) throw error;
        setTrainings(data || []);
      } catch (error: any) {
        console.error('Error fetching trainings:', error);
        toast.error("Kunde inte hämta träningspass");
      } finally {
        setLoadingTrainings(false);
      }
    };

    fetchTrainings();
  }, [user, showDeleted]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('sv-SE', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_trainings')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      setTrainings(prev => prev.filter(t => t.id !== id));
      toast.success("Träningspass arkiverat");
    } catch (error: any) {
      console.error('Error deleting training:', error);
      toast.error("Kunde inte arkivera träningspass");
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_trainings')
        .update({ deleted_at: null })
        .eq('id', id);

      if (error) throw error;
      
      setTrainings(prev => prev.filter(t => t.id !== id));
      toast.success("Träningspass återställt");
    } catch (error: any) {
      console.error('Error restoring training:', error);
      toast.error("Kunde inte återställa träningspass");
    }
  };

  const handleDuplicate = async (training: SavedTraining) => {
    try {
      const { data: newTraining, error } = await supabase
        .from('saved_trainings')
        .insert({
          coach_id: user!.id,
          title: `${training.title} (kopia)`,
          duration: training.duration,
          focus: training.focus,
          players: training.players,
          exercises: training.exercises
        })
        .select()
        .single();

      if (error) throw error;
      
      setTrainings(prev => [newTraining, ...prev]);
      toast.success("Träningspass duplicerat");
    } catch (error: any) {
      console.error('Error duplicating training:', error);
      toast.error("Kunde inte duplicera träningspass");
    }
  };

  const activeTrainings = trainings.filter(t => !t.deleted_at);
  const deletedTrainings = trainings.filter(t => t.deleted_at);

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
              <CardTitle className="text-2xl">{activeTrainings.length}</CardTitle>
              <CardDescription>Sparade träningspass</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {activeTrainings.length > 0 
                  ? Math.round(activeTrainings.reduce((sum, t) => sum + t.duration, 0) / activeTrainings.length) 
                  : 0} min
              </CardTitle>
              <CardDescription>Genomsnittlig längd</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {activeTrainings.reduce((sum, t) => sum + (t.exercises && Array.isArray(t.exercises) ? t.exercises.length : 0), 0)}
              </CardTitle>
              <CardDescription>Totalt antal övningar</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Training Sessions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Träningspass</h2>
            <Button 
              variant={showDeleted ? "default" : "outline"}
              className="gap-2"
              onClick={() => setShowDeleted(!showDeleted)}
            >
              <Archive className="w-4 h-4" />
              {showDeleted ? "Visa aktiva" : `Raderade (${deletedTrainings.length})`}
            </Button>
          </div>
          
          {loadingTrainings ? (
            <div className="text-center py-8 text-muted-foreground">
              Laddar träningspass...
            </div>
          ) : trainings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground text-lg">
                  {showDeleted ? "Inga raderade träningspass" : "Inga sparade träningspass ännu"}
                </p>
                {!showDeleted && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Skapa ett nytt träningspass och spara det för att återanvända senare
                  </p>
                )}
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
                          {showDeleted ? `Raderad ${formatDate(training.deleted_at!)}` : `Sparad ${formatDate(training.created_at)}`}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-1">{training.title}</CardTitle>
                      <CardDescription>
                        {training.exercises ? (Array.isArray(training.exercises) ? training.exercises.length : 0) : 0} övningar • {training.focus}
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
                  
                  {showDeleted ? (
                    <div className="flex gap-2">
                      <Button 
                        variant="default" 
                        className="flex-1 gap-2"
                        onClick={() => handleRestore(training.id)}
                      >
                        Återställ
                      </Button>
                    </div>
                  ) : (
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
                  )}
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