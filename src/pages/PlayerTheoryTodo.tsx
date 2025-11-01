import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, Target } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TheoryAssignment {
  id: string;
  quiz_id: string;
  completed: boolean;
  created_at: string;
}

interface QuizDetails {
  id: string;
  title: string;
  questions: number;
  level: string;
}

const quizDetails: Record<string, QuizDetails> = {
  "5-manna-positioner": { id: "5-manna-positioner", title: "Positioner och grundregler", questions: 5, level: "5-manna" },
  "7-manna-begrepp": { id: "7-manna-begrepp", title: "Fotbollsbegrepp", questions: 8, level: "7-manna" },
  "7-manna-historia": { id: "7-manna-historia", title: "Fotbollshistoria", questions: 8, level: "7-manna" },
  "7-manna-taktik": { id: "7-manna-taktik", title: "Taktiska grunder", questions: 8, level: "7-manna" },
  "9-manna-offside": { id: "9-manna-offside", title: "Offsideregeln & Formationer", questions: 8, level: "9-manna" },
  "9-manna-taktik": { id: "9-manna-taktik", title: "Taktik och Spelidéer", questions: 8, level: "9-manna" },
  "9-manna-avancerat": { id: "9-manna-avancerat", title: "Avancerade begrepp", questions: 8, level: "9-manna" },
};

const PlayerTheoryTodo = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<TheoryAssignment[]>([]);
  const [customQuizzes, setCustomQuizzes] = useState<Record<string, QuizDetails>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchAssignments = async () => {
      try {
        const { data, error } = await supabase
          .from('theory_assignments')
          .select('*')
          .eq('assigned_to', user.id)
          .eq('completed', false)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAssignments(data || []);

        // Load custom quiz details
        if (data && data.length > 0) {
          const customQuizIds = data
            .map(a => a.quiz_id)
            .filter(id => id.startsWith('custom-'));

          if (customQuizIds.length > 0) {
            const { data: customData } = await supabase
              .from('custom_quizzes')
              .select('*')
              .in('quiz_id', customQuizIds);

            if (customData) {
              const customMap: Record<string, QuizDetails> = {};
              customData.forEach((quiz: any) => {
                customMap[quiz.quiz_id] = {
                  id: quiz.quiz_id,
                  title: quiz.title,
                  questions: (quiz.questions as any[]).length,
                  level: quiz.level
                };
              });
              setCustomQuizzes(customMap);
            }
          }
        }
      } catch (error: any) {
        console.error('Error fetching assignments:', error);
        toast.error("Kunde inte hämta teoriuppgifter");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('theory-assignments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'theory_assignments',
          filter: `assigned_to=eq.${user.id}`
        },
        () => {
          fetchAssignments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const pendingAssignments = assignments.filter(a => !a.completed);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
            Teori att göra
          </h1>
          <p className="text-muted-foreground text-lg">
            Teoriuppgifter som din tränare har skickat till dig
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8 bg-gradient-hero text-primary-foreground border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Target className="w-6 h-6" />
              Dina uppgifter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-primary-foreground/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">{pendingAssignments.length}</div>
                <div className="text-sm opacity-90">Uppgifter kvar</div>
              </div>
              <div className="bg-primary-foreground/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">{assignments.length - pendingAssignments.length}</div>
                <div className="text-sm opacity-90">Uppgifter klara</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Assignments */}
        {isLoading ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Laddar uppgifter...
            </CardContent>
          </Card>
        ) : pendingAssignments.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Du har inga teoriuppgifter att göra just nu
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingAssignments.map((assignment) => {
              const quiz = quizDetails[assignment.quiz_id] || customQuizzes[assignment.quiz_id];
              if (!quiz) return null;

              return (
                <Card key={assignment.id} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className="bg-primary text-primary-foreground">
                            {quiz.level}
                          </Badge>
                          {assignment.quiz_id.startsWith('custom-') && (
                            <Badge variant="outline">Anpassat</Badge>
                          )}
                          <span className="text-sm text-muted-foreground">
                            {quiz.questions} frågor
                          </span>
                        </div>
                        <CardTitle className="text-xl mb-2">{quiz.title}</CardTitle>
                        <CardDescription className="text-sm">
                          Skickad {new Date(assignment.created_at).toLocaleDateString('sv-SE', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </CardDescription>
                      </div>
                      <BookOpen className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="default" size="sm" asChild>
                      <Link to={`/quiz/${assignment.quiz_id}`}>Starta quiz</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default PlayerTheoryTodo;
