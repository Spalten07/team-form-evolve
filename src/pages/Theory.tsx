import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Trophy, Target, CheckCircle2 } from "lucide-react";

interface TheoryLevel {
  id: number;
  level: string;
  title: string;
  description: string;
  topics: string[];
  quizzes: number;
  completed: number;
  color: string;
}

const theoryLevels: TheoryLevel[] = [
  {
    id: 1,
    level: "5-manna",
    title: "Grundläggande regler",
    description: "Lär dig de mest grundläggande reglerna och positionerna i fotboll",
    topics: ["Positioner", "Inkast", "Matchtid", "Spelregler"],
    quizzes: 8,
    completed: 3,
    color: "bg-success"
  },
  {
    id: 2,
    level: "7-manna",
    title: "Utvecklad kunskap",
    description: "Mer avancerade positioner och fotbollsbegrepp",
    topics: ["Krossboll", "Djupledslöpning", "Bredsida", "Överstegsfint", "Fotbollshistoria"],
    quizzes: 12,
    completed: 0,
    color: "bg-warning"
  },
  {
    id: 3,
    level: "9-manna",
    title: "Avancerad taktik",
    description: "Offsideregeln, formationer och spelidéer",
    topics: ["Offside", "Formationer", "Positionsnummer", "Spelidéer", "Fotbollshistoria"],
    quizzes: 15,
    completed: 0,
    color: "bg-primary"
  }
];

const Theory = () => {
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
                <div className="text-3xl font-bold">3</div>
                <div className="text-sm opacity-90">Quiz genomförda</div>
              </div>
              <div className="bg-primary-foreground/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">35</div>
                <div className="text-sm opacity-90">Quiz tillgängliga</div>
              </div>
              <div className="bg-primary-foreground/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">9%</div>
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
                        {level.completed}/{level.quizzes} quiz genomförda
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
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Framsteg</span>
                      <span className="font-medium">
                        {Math.round((level.completed / level.quizzes) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${level.color} transition-all duration-300`}
                        style={{ width: `${(level.completed / level.quizzes) * 100}%` }}
                      />
                    </div>
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

                  {/* Action Button */}
                  <Button 
                    variant={level.completed > 0 ? "default" : "hero"}
                    className="w-full"
                  >
                    {level.completed > 0 ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Fortsätt
                      </>
                    ) : (
                      "Börja"
                    )}
                  </Button>
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
