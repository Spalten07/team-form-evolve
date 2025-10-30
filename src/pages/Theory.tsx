import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Trophy, Target, CheckCircle2, Play } from "lucide-react";
import { Link } from "react-router-dom";

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

const Theory = () => {
  const totalQuizzes = theoryLevels.reduce((sum, level) => sum + level.quizzes.length, 0);
  const completedQuizzes = theoryLevels.reduce(
    (sum, level) => sum + level.quizzes.filter(q => q.completed).length, 
    0
  );
  const completionPercentage = totalQuizzes > 0 ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0;

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
                      <div key={quiz.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                        <div className="flex-1">
                          <p className="font-medium">{quiz.title}</p>
                          <p className="text-sm text-muted-foreground">{quiz.questions} frågor</p>
                        </div>
                        {quiz.completed ? (
                          <Badge className="bg-success/10 text-success hover:bg-success/20">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Klar
                          </Badge>
                        ) : (
                          <Button variant="default" size="sm" asChild>
                            <Link to={`/quiz/${quiz.id}`}>Starta</Link>
                          </Button>
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
    </div>
  );
};

export default Theory;
