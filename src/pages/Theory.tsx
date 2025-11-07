import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Eye, Plus, Target, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { CreateQuizDialog } from "@/components/CreateQuizDialog";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface QuizDetails {
  id: string;
  title: string;
  questions: number;
  level: string;
}

interface TheoryAssignment {
  id: string;
  quiz_id: string;
  completed: boolean;
  created_at: string;
  completed_at?: string | null;
}

const quizDetails: Record<string, QuizDetails> = {
  "5-manna-positioner": { id: "5-manna-positioner", title: "Positioner och grundregler", questions: 8, level: "5-manna" },
  "7-manna-begrepp": { id: "7-manna-begrepp", title: "Fotbollsbegrepp", questions: 8, level: "7-manna" },
  "7-manna-historia": { id: "7-manna-historia", title: "Fotbollshistoria", questions: 8, level: "7-manna" },
  "7-manna-taktik": { id: "7-manna-taktik", title: "Taktiska grunder", questions: 8, level: "7-manna" },
  "9-manna-offside": { id: "9-manna-offside", title: "Offsideregeln & Formationer", questions: 8, level: "9-manna" },
  "9-manna-taktik": { id: "9-manna-taktik", title: "Taktik och Spelidéer", questions: 8, level: "9-manna" },
  "9-manna-avancerat": { id: "9-manna-avancerat", title: "Avancerade begrepp", questions: 8, level: "9-manna" },
};

const Theory = () => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchRole = async () => {
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (data) setUserRole(data.role);
    };
    fetchRole();
  }, [user]);
  const navigate = useNavigate();
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [customQuizzes, setCustomQuizzes] = useState<QuizDetails[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [assignments, setAssignments] = useState<TheoryAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch assignments for players
  useEffect(() => {
    if (!user) return;
    if (userRole === 'player') {
      const fetchAssignments = async () => {
        try {
          const { data, error } = await supabase
            .from('theory_assignments')
            .select('*')
            .eq('assigned_to', user.id)
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
                const customQuizList: QuizDetails[] = customData.map((quiz: any) => ({
                  id: quiz.quiz_id,
                  title: quiz.title,
                  questions: (quiz.questions as any[]).length,
                  level: quiz.level
                }));
                setCustomQuizzes(prev => {
                  const newQuizzes = customQuizList.filter(q => 
                    !prev.some(pq => pq.id === q.id)
                  );
                  return [...prev, ...newQuizzes];
                });
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
    } else {
      setIsLoading(false);
    }
  }, [user, userRole]);

  // Fetch custom quizzes for coaches
  useEffect(() => {
    if (!user || userRole !== 'coach') return;

    fetchCustomQuizzes();
  }, [user, userRole]);

  const fetchCustomQuizzes = async () => {
    if (!user) return;

    try {
      const { data: quizzes, error } = await supabase
        .from('custom_quizzes')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (quizzes) {
        const formattedQuizzes: QuizDetails[] = quizzes.map((quiz: any) => ({
          id: quiz.quiz_id,
          title: quiz.title,
          questions: (quiz.questions as any[]).length,
          level: quiz.level
        }));
        setCustomQuizzes(formattedQuizzes);
      }
    } catch (error: any) {
      console.error('Error fetching custom quizzes:', error);
      toast.error("Kunde inte hämta anpassade teoripass");
    }
  };

  const pendingAssignments = assignments.filter(a => !a.completed);
  const completedAssignments = assignments.filter(a => a.completed);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
            Teoribank
          </h1>
          <p className="text-muted-foreground text-lg">
            {userRole === 'coach'
              ? 'Skapa och skicka ut teoripass till dina spelare'
              : 'Lär dig mer om fotboll med våra quiz'}
          </p>
        </div>

        {userRole === 'player' ? (
          <>
            {/* Progress Overview for players */}
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
                    <div className="text-3xl font-bold">{completedAssignments.length}</div>
                    <div className="text-sm opacity-90">Uppgifter klara</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Assignments for players */}
            {pendingAssignments.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Att göra</h2>
                <div className="space-y-4">
                  {pendingAssignments.map((assignment) => {
                    const quiz = quizDetails[assignment.quiz_id] || customQuizzes.find(q => q.id === assignment.quiz_id);
                    if (!quiz) return null;

                    return (
                      <Card key={assignment.id} className="hover:shadow-lg transition-all border-2 border-primary">
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
                            <a href={`/quiz/${assignment.quiz_id}`}>Starta quiz</a>
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All theory passes for players */}
              {/* 5-manna */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary text-primary-foreground text-lg px-4 py-1">5-manna</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.values(quizDetails)
                    .filter(quiz => quiz.level === "5-manna")
                    .map((quiz) => {
                      const assignmentForThisQuiz = assignments.find(a => a.quiz_id === quiz.id);
                      const isCompleted = assignmentForThisQuiz?.completed;

                      return (
                        <Card key={quiz.id} className="hover:shadow-lg transition-all">
                          <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <CardTitle className="text-xl">{quiz.title}</CardTitle>
                                  {isCompleted && <CheckCircle2 className="w-5 h-5 text-success" />}
                                </div>
                                <CardDescription className="text-sm">
                                  {quiz.questions} frågor • {quiz.level}
                                </CardDescription>
                              </div>
                              <BookOpen className="w-8 h-8 text-muted-foreground flex-shrink-0" />
                            </div>
                          </CardHeader>
                          <CardContent>
                            <Button variant="default" size="sm" asChild className="w-full">
                              <a href={`/quiz/${quiz.id}`}>
                                {isCompleted ? 'Gör om' : 'Starta quiz'}
                              </a>
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </div>

              {/* 7-manna */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary text-primary-foreground text-lg px-4 py-1">7-manna</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.values(quizDetails)
                    .filter(quiz => quiz.level === "7-manna")
                    .map((quiz) => {
                      const assignmentForThisQuiz = assignments.find(a => a.quiz_id === quiz.id);
                      const isCompleted = assignmentForThisQuiz?.completed;

                      return (
                        <Card key={quiz.id} className="hover:shadow-lg transition-all">
                          <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <CardTitle className="text-xl">{quiz.title}</CardTitle>
                                  {isCompleted && <CheckCircle2 className="w-5 h-5 text-success" />}
                                </div>
                                <CardDescription className="text-sm">
                                  {quiz.questions} frågor • {quiz.level}
                                </CardDescription>
                              </div>
                              <BookOpen className="w-8 h-8 text-muted-foreground flex-shrink-0" />
                            </div>
                          </CardHeader>
                          <CardContent>
                            <Button variant="default" size="sm" asChild className="w-full">
                              <a href={`/quiz/${quiz.id}`}>
                                {isCompleted ? 'Gör om' : 'Starta quiz'}
                              </a>
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </div>

              {/* 9-manna */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary text-primary-foreground text-lg px-4 py-1">9-manna</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.values(quizDetails)
                    .filter(quiz => quiz.level === "9-manna")
                    .map((quiz) => {
                      const assignmentForThisQuiz = assignments.find(a => a.quiz_id === quiz.id);
                      const isCompleted = assignmentForThisQuiz?.completed;

                      return (
                        <Card key={quiz.id} className="hover:shadow-lg transition-all">
                          <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <CardTitle className="text-xl">{quiz.title}</CardTitle>
                                  {isCompleted && <CheckCircle2 className="w-5 h-5 text-success" />}
                                </div>
                                <CardDescription className="text-sm">
                                  {quiz.questions} frågor • {quiz.level}
                                </CardDescription>
                              </div>
                              <BookOpen className="w-8 h-8 text-muted-foreground flex-shrink-0" />
                            </div>
                          </CardHeader>
                          <CardContent>
                            <Button variant="default" size="sm" asChild className="w-full">
                              <a href={`/quiz/${quiz.id}`}>
                                {isCompleted ? 'Gör om' : 'Starta quiz'}
                              </a>
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </div>

              {/* Custom quizzes for players */}
              {customQuizzes.length > 0 && (
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-secondary text-secondary-foreground text-lg px-4 py-1">Anpassade teoripass</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {customQuizzes.map((quiz) => {
                      const assignmentForThisQuiz = assignments.find(a => a.quiz_id === quiz.id);
                      const isCompleted = assignmentForThisQuiz?.completed;

                      return (
                        <Card key={quiz.id} className="hover:shadow-lg transition-all">
                          <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <CardTitle className="text-xl">{quiz.title}</CardTitle>
                                  {isCompleted && <CheckCircle2 className="w-5 h-5 text-success" />}
                                </div>
                                <CardDescription className="text-sm">
                                  {quiz.questions} frågor • {quiz.level}
                                </CardDescription>
                              </div>
                              <BookOpen className="w-8 h-8 text-muted-foreground flex-shrink-0" />
                            </div>
                          </CardHeader>
                          <CardContent>
                            <Button variant="default" size="sm" asChild className="w-full">
                              <a href={`/quiz/${quiz.id}`}>
                                {isCompleted ? 'Gör om' : 'Starta quiz'}
                              </a>
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
          </>
        ) : (
          <>
            {/* Coach view */}
            {userRole === 'coach' && (
              <div className="mb-6">
                <Button 
                  onClick={() => setShowCreateDialog(true)}
                  className="w-full md:w-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Skapa eget teoripass
                </Button>
              </div>
            )}

            {/* 5-manna */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Badge className="bg-primary text-primary-foreground text-lg px-4 py-1">5-manna</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(quizDetails)
                  .filter(quiz => quiz.level === "5-manna")
                  .map((quiz) => (
                    <Card key={quiz.id} className="hover:shadow-lg transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">{quiz.title}</CardTitle>
                            <CardDescription className="text-sm">
                              {quiz.questions} frågor • {quiz.level}
                            </CardDescription>
                          </div>
                          <BookOpen className="w-8 h-8 text-muted-foreground flex-shrink-0" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/quiz/${quiz.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Förhandsgranska
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>

            {/* 7-manna */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Badge className="bg-primary text-primary-foreground text-lg px-4 py-1">7-manna</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(quizDetails)
                  .filter(quiz => quiz.level === "7-manna")
                  .map((quiz) => (
                    <Card key={quiz.id} className="hover:shadow-lg transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">{quiz.title}</CardTitle>
                            <CardDescription className="text-sm">
                              {quiz.questions} frågor • {quiz.level}
                            </CardDescription>
                          </div>
                          <BookOpen className="w-8 h-8 text-muted-foreground flex-shrink-0" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/quiz/${quiz.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Förhandsgranska
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>

            {/* 9-manna */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Badge className="bg-primary text-primary-foreground text-lg px-4 py-1">9-manna</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(quizDetails)
                  .filter(quiz => quiz.level === "9-manna")
                  .map((quiz) => (
                    <Card key={quiz.id} className="hover:shadow-lg transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">{quiz.title}</CardTitle>
                            <CardDescription className="text-sm">
                              {quiz.questions} frågor • {quiz.level}
                            </CardDescription>
                          </div>
                          <BookOpen className="w-8 h-8 text-muted-foreground flex-shrink-0" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/quiz/${quiz.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Förhandsgranska
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>

            {/* Custom quizzes for coaches */}
            {customQuizzes.length > 0 && (
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Badge className="bg-secondary text-secondary-foreground text-lg px-4 py-1">Anpassade teoripass</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customQuizzes.map((quiz) => (
                    <Card key={quiz.id} className="hover:shadow-lg transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle className="text-xl">{quiz.title}</CardTitle>
                              <Badge variant="outline" className="text-xs">Anpassat</Badge>
                            </div>
                            <CardDescription className="text-sm">
                              {quiz.questions} frågor • {quiz.level}
                            </CardDescription>
                          </div>
                          <BookOpen className="w-8 h-8 text-muted-foreground flex-shrink-0" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/quiz/${quiz.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Förhandsgranska
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {userRole === 'coach' && user && (
          <CreateQuizDialog
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
            userId={user.id}
            teamId={null}
            onSuccess={fetchCustomQuizzes}
          />
        )}
      </main>
    </div>
  );
};

export default Theory;
