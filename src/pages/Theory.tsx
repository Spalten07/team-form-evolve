import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Trophy, Target, CheckCircle2, Play, Send, Plus, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { CreateQuizDialog } from "@/components/CreateQuizDialog";

interface QuizItem {
  id: string;
  title: string;
  questions: number;
  completed: boolean;
}

interface TheoryLevel {
  id: number;
  level: string;
  title: string;
  description: string;
  topics: string[];
  quizzes: QuizItem[];
  color: string;
}

const theoryLevels: TheoryLevel[] = [
  {
    id: 1,
    level: "5-manna",
    title: "Grundläggande regler",
    description: "Lär dig de mest grundläggande reglerna och positionerna i fotboll",
    topics: ["Positioner", "Inkast", "Matchtid", "Spelregler"],
    quizzes: [
      { id: "5-manna-positioner", title: "Positioner och grundregler", questions: 5, completed: true }
    ],
    color: "bg-success"
  },
  {
    id: 2,
    level: "7-manna",
    title: "Utvecklad kunskap",
    description: "Mer avancerade positioner och fotbollsbegrepp",
    topics: ["Inlägg", "Djupledslöpning", "Bredsida", "Överstegsfint", "Fotbollshistoria", "Framspel", "Positionering"],
    quizzes: [
      { id: "7-manna-begrepp", title: "Fotbollsbegrepp", questions: 8, completed: false },
      { id: "7-manna-historia", title: "Fotbollshistoria", questions: 8, completed: false },
      { id: "7-manna-taktik", title: "Taktiska grunder", questions: 8, completed: false }
    ],
    color: "bg-warning"
  },
  {
    id: 3,
    level: "9-manna",
    title: "Avancerad taktik",
    description: "Offsideregeln, formationer och spelidéer",
    topics: ["Offside", "Formationer", "Positionsnummer", "Spelidéer", "Fotbollshistoria", "Pressfotboll", "Uppbyggnadsspel"],
    quizzes: [
      { id: "9-manna-offside", title: "Offsideregeln & Formationer", questions: 8, completed: false },
      { id: "9-manna-taktik", title: "Taktik och Spelidéer", questions: 8, completed: false },
      { id: "9-manna-avancerat", title: "Avancerade begrepp", questions: 8, completed: false }
    ],
    color: "bg-primary"
  }
];

interface Player {
  id: string;
  full_name: string;
}

interface CustomQuiz {
  id: string;
  quiz_id: string;
  title: string;
  level: string;
  questions: any[];
}

const Theory = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [teamPlayers, setTeamPlayers] = useState<Player[]>([]);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [customQuizzes, setCustomQuizzes] = useState<CustomQuiz[]>([]);
  const [teamId, setTeamId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, team_id')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUserRole(profile.role);
        setTeamId(profile.team_id);

        if (profile.role === 'coach' && profile.team_id) {
          const { data: players } = await supabase
            .from('profiles')
            .select('id, full_name')
            .eq('team_id', profile.team_id)
            .eq('role', 'player');

          if (players) setTeamPlayers(players as Player[]);

          // Fetch custom quizzes
          const { data: quizzes } = await supabase
            .from('custom_quizzes')
            .select('*')
            .eq('created_by', user.id)
            .order('created_at', { ascending: false });

          if (quizzes) setCustomQuizzes(quizzes as CustomQuiz[]);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const totalQuizzes = theoryLevels.reduce((sum, level) => sum + level.quizzes.length, 0);
  const completedQuizzes = theoryLevels.reduce(
    (sum, level) => sum + level.quizzes.filter(q => q.completed).length, 
    0
  );
  const completionPercentage = totalQuizzes > 0 ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0;

  const handleSendTheory = (quizId: string) => {
    setSelectedQuiz(quizId);
    setSendDialogOpen(true);
  };

  const handleConfirmSend = async () => {
    if (!user || !selectedQuiz || selectedPlayers.length === 0) {
      toast.error("Välj minst en spelare");
      return;
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('team_id')
        .eq('id', user.id)
        .single();

      const assignments = selectedPlayers.map(playerId => ({
        quiz_id: selectedQuiz,
        assigned_by: user.id,
        assigned_to: playerId,
        team_id: profile?.team_id
      }));

      const { error } = await supabase
        .from('theory_assignments')
        .insert(assignments);

      if (error) throw error;

      toast.success(`Teoriuppgift skickad till ${selectedPlayers.length} spelare!`);
      setSendDialogOpen(false);
      setSelectedPlayers([]);
      setSelectedQuiz(null);
    } catch (error: any) {
      console.error('Error sending theory:', error);
      toast.error("Kunde inte skicka teoriuppgift");
    }
  };

  const fetchCustomQuizzes = async () => {
    if (!user) return;
    
    const { data: quizzes } = await supabase
      .from('custom_quizzes')
      .select('*')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false });

    if (quizzes) setCustomQuizzes(quizzes as CustomQuiz[]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
            Teoribank
          </h1>
          <p className="text-muted-foreground text-lg">
            Utveckla din fotbollskunskap genom quizar och teorilektioner
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8 bg-gradient-hero text-primary-foreground border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              Din framgång
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary-foreground/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">{completedQuizzes}</div>
                <div className="text-sm opacity-90">Quiz genomförda</div>
              </div>
              <div className="bg-primary-foreground/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">{totalQuizzes}</div>
                <div className="text-sm opacity-90">Quiz tillgängliga</div>
              </div>
              <div className="bg-primary-foreground/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">{completionPercentage}%</div>
                <div className="text-sm opacity-90">Totalt genomförda</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create Quiz Button for Coaches */}
        {userRole === 'coach' && (
          <Button onClick={() => setCreateDialogOpen(true)} className="mb-6 gap-2">
            <Plus className="w-4 h-4" />
            Skapa eget teoripass
          </Button>
        )}

        {/* Custom Quizzes */}
        {customQuizzes.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Dina egna teoripass</h2>
            <div className="space-y-4">
              {customQuizzes.map((quiz) => (
                <Card key={quiz.id} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className="bg-primary text-primary-foreground">
                            {quiz.level}
                          </Badge>
                          <Badge variant="outline">Anpassat</Badge>
                          <span className="text-sm text-muted-foreground">
                            {quiz.questions.length} frågor
                          </span>
                        </div>
                        <CardTitle className="text-2xl">{quiz.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <Link to={`/quiz/${quiz.quiz_id}`}>
                          <Eye className="w-3 h-3 mr-1" />
                          Förhandsgranska
                        </Link>
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleSendTheory(quiz.quiz_id)}
                        className="flex-1"
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Skicka ut
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Theory Levels */}
        <div className="space-y-6">
          {theoryLevels.map((level) => (
            <Card key={level.id} className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={`${level.color} text-primary-foreground`}>
                        {level.level}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {level.quizzes.filter(q => q.completed).length}/{level.quizzes.length} quiz genomförda
                      </span>
                    </div>
                    <CardTitle className="text-2xl mb-2">{level.title}</CardTitle>
                    <CardDescription className="text-base">{level.description}</CardDescription>
                  </div>
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Quiz List */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Tillgängliga quizar</span>
                    </div>
                    {level.quizzes.map((quiz) => (
                      <div key={quiz.id} className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-medium">{quiz.title}</p>
                            <p className="text-sm text-muted-foreground">{quiz.questions} frågor</p>
                          </div>
                          {quiz.completed && (
                            <Badge className="bg-success/10 text-success hover:bg-success/20">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Klar
                            </Badge>
                          )}
                        </div>
                        {!quiz.completed && (
                          <div className="flex gap-2">
                            {userRole === 'coach' ? (
                              <>
                                <Button variant="outline" size="sm" asChild className="flex-1">
                                  <Link to={`/quiz/${quiz.id}`}>
                                    <Eye className="w-3 h-3 mr-1" />
                                    Förhandsgranska
                                  </Link>
                                </Button>
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  onClick={() => handleSendTheory(quiz.id)}
                                  className="flex-1"
                                >
                                  <Send className="w-3 h-3 mr-1" />
                                  Skicka ut
                                </Button>
                              </>
                            ) : (
                              <Button variant="default" size="sm" asChild className="w-full">
                                <Link to={`/quiz/${quiz.id}`}>Starta</Link>
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Topics */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Ämnen</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {level.topics.map((topic, index) => (
                        <Badge key={index} variant="outline">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Send Theory Dialog */}
      <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Skicka ut teoriuppgift
            </DialogTitle>
            <DialogDescription>
              Välj vilka spelare som ska få teoriuppgiften
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-3">Välj spelare ({selectedPlayers.length} valda)</p>
              <div className="max-h-60 overflow-y-auto space-y-2 border rounded-lg p-3">
                {teamPlayers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Inga spelare i laget
                  </p>
                ) : (
                  teamPlayers.map(player => (
                    <div key={player.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`player-${player.id}`}
                        checked={selectedPlayers.includes(player.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedPlayers([...selectedPlayers, player.id]);
                          } else {
                            setSelectedPlayers(selectedPlayers.filter(id => id !== player.id));
                          }
                        }}
                      />
                      <label
                        htmlFor={`player-${player.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {player.full_name || 'Namnlös spelare'}
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSendDialogOpen(false)} className="flex-1">
                Avbryt
              </Button>
              <Button onClick={handleConfirmSend} className="flex-1" disabled={selectedPlayers.length === 0}>
                Skicka
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Quiz Dialog */}
      {user && (
        <CreateQuizDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          userId={user.id}
          teamId={teamId}
          onSuccess={fetchCustomQuizzes}
        />
      )}
    </div>
  );
};

export default Theory;
