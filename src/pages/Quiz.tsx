import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy } from "lucide-react";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizData {
  id: string;
  title: string;
  level: string;
  questions: QuizQuestion[];
}

const quizData: Record<string, QuizData> = {
  "5-manna-positioner": {
    id: "5-manna-positioner",
    title: "Positioner i 5-manna",
    level: "5-manna",
    questions: [
      {
        id: 1,
        question: "Var ska en back placera sig när laget har bollen?",
        options: [
          "Längst fram nära motståndarens mål",
          "I mitten av planen",
          "Bakom bollen för att ge stöd",
          "Utanför planen"
        ],
        correctAnswer: 2,
        explanation: "Backen ska vara bakom bollen för att ge stöd och kunna försvara om laget förlorar bollen."
      },
      {
        id: 2,
        question: "Vad är forwardens huvuduppgift?",
        options: [
          "Stå i mål",
          "Försöka göra mål",
          "Bara försvara",
          "Stå still"
        ],
        correctAnswer: 1,
        explanation: "Forwardens huvuduppgift är att anfalla och försöka göra mål för sitt lag."
      },
      {
        id: 3,
        question: "Hur lång är en halva i 5-manna fotboll?",
        options: [
          "10 minuter",
          "15 minuter",
          "20 minuter",
          "45 minuter"
        ],
        correctAnswer: 1,
        explanation: "I 5-manna fotboll är varje halva 15 minuter lång."
      },
      {
        id: 4,
        question: "Vad händer när bollen går ut över sidlinjen?",
        options: [
          "Man får göra mål direkt",
          "Det blir inkast",
          "Det blir frispark",
          "Matchen startar om"
        ],
        correctAnswer: 1,
        explanation: "När bollen går ut över sidlinjen blir det inkast för motståndarlaget."
      },
      {
        id: 5,
        question: "Hur gör man ett korrekt inkast?",
        options: [
          "Kasta med en hand",
          "Sparka in bollen",
          "Kasta med båda händerna bakom huvudet",
          "Rulla in bollen"
        ],
        correctAnswer: 2,
        explanation: "Ett korrekt inkast görs med båda händerna bakom huvudet och båda fötterna på marken."
      }
    ]
  },
  "7-manna-begrepp": {
    id: "7-manna-begrepp",
    title: "Fotbollsbegrepp",
    level: "7-manna",
    questions: [
      {
        id: 1,
        question: "Vad betyder 'krossboll'?",
        options: [
          "En boll som studsar",
          "En hög boll från sidan mot målet",
          "En boll som går baklänges",
          "En boll på marken"
        ],
        correctAnswer: 1,
        explanation: "En krossboll är en passning, ofta hög, från kanten av planen in mot målet där forwards kan nicka eller skjuta."
      },
      {
        id: 2,
        question: "Vad är en 'djupledslöpning'?",
        options: [
          "Att springa tillbaka mot eget mål",
          "Att springa i sidled",
          "Att springa djupt bakom motståndarnas försvar",
          "Att stå still"
        ],
        correctAnswer: 2,
        explanation: "En djupledslöpning är när en spelare springer bakom motståndarnas försvarslinje för att ta emot en passning."
      },
      {
        id: 3,
        question: "Vad betyder 'bredsida'?",
        options: [
          "Att spela bollen åt sidan",
          "En bred spelare",
          "Ett brett mål",
          "En bred plan"
        ],
        correctAnswer: 0,
        explanation: "Bredsida betyder att man spelar bollen åt sidan, ofta för att skapa mer utrymme och variera spelet."
      },
      {
        id: 4,
        question: "Vad är ett 'överstegsfint'?",
        options: [
          "Att kliva över bollen för att lura motståndare",
          "Att hoppa över bollen",
          "Att sparka bollen högt",
          "Att falla över bollen"
        ],
        correctAnswer: 0,
        explanation: "Ett överstegsfint är en dribblingsteknik där man låtsas gå åt ett håll genom att kliva över bollen, men sedan går åt andra hållet."
      },
      {
        id: 5,
        question: "Vilket år anordnades det första fotbolls-VM?",
        options: [
          "1900",
          "1920",
          "1930",
          "1950"
        ],
        correctAnswer: 2,
        explanation: "Det första fotbolls-VM anordnades 1930 i Uruguay, och Uruguay vann turneringen."
      }
    ]
  },
  "9-manna-offside": {
    id: "9-manna-offside",
    title: "Offsideregeln",
    level: "9-manna",
    questions: [
      {
        id: 1,
        question: "När är en spelare i offside?",
        options: [
          "När spelaren springer för fort",
          "När spelaren är närmare motståndarens mållinje än både bollen och näst sista motståndarspelaren",
          "När spelaren står i eget straffområde",
          "När spelaren har bollen"
        ],
        correctAnswer: 1,
        explanation: "En spelare är i offside när hen är närmare motståndarens mållinje än både bollen och näst sista motståndarspelaren när bollen spelas framåt."
      },
      {
        id: 2,
        question: "Kan man vara offside på egen planhalva?",
        options: [
          "Ja, alltid",
          "Nej, aldrig",
          "Bara ibland",
          "Bara om domaren säger det"
        ],
        correctAnswer: 1,
        explanation: "Man kan aldrig vara offside på egen planhalva. Offsideregeln gäller bara på motståndarens planhalva."
      },
      {
        id: 3,
        question: "Kan man vara offside vid ett inkast?",
        options: [
          "Ja, alltid",
          "Nej, aldrig",
          "Bara om man springer fort",
          "Bara i första halvlek"
        ],
        correctAnswer: 1,
        explanation: "Man kan inte vara offside direkt från ett inkast. Offsideregeln gäller inte vid inkast."
      },
      {
        id: 4,
        question: "Vad betyder formationen 4-3-3?",
        options: [
          "4 forwards, 3 mittfältare, 3 backar",
          "4 backar, 3 mittfältare, 3 forwards",
          "3 backar, 4 mittfältare, 3 forwards",
          "Det är ett telefonnummer"
        ],
        correctAnswer: 1,
        explanation: "4-3-3 betyder 4 backar, 3 mittfältare och 3 forwards. Formationen räknas från försvaret framåt."
      },
      {
        id: 5,
        question: "Vilket nummer har traditionellt en mittback?",
        options: [
          "Nummer 1",
          "Nummer 4 eller 5",
          "Nummer 9",
          "Nummer 11"
        ],
        correctAnswer: 1,
        explanation: "Mittbackar har traditionellt nummer 4 eller 5. Nummer 9 är ofta en forward och nummer 1 är målvakten."
      }
    ]
  },
  "7-manna-historia": {
    id: "7-manna-historia",
    title: "Fotbollshistoria",
    level: "7-manna",
    questions: [
      {
        id: 1,
        question: "Vilket land brukar kallas fotbollens 'moderland'?",
        options: [
          "Brasilien",
          "England",
          "Sverige",
          "Tyskland"
        ],
        correctAnswer: 1,
        explanation: "England kallas ofta fotbollens moderland eftersom de moderna fotbollsreglerna skapades där 1863."
      },
      {
        id: 2,
        question: "Vem är Sveriges mest kända fotbollsspelare genom tiderna?",
        options: [
          "Henrik Larsson",
          "Zlatan Ibrahimović",
          "Gunnar Nordahl",
          "Tomas Brolin"
        ],
        correctAnswer: 1,
        explanation: "Zlatan Ibrahimović är Sveriges mest kända fotbollsspelare med en fantastisk karriär i världens största klubbar."
      },
      {
        id: 3,
        question: "Hur många spelare finns på planen från varje lag i 7-manna?",
        options: [
          "5 spelare",
          "7 spelare",
          "9 spelare",
          "11 spelare"
        ],
        correctAnswer: 1,
        explanation: "I 7-manna fotboll spelar 7 spelare från varje lag samtidigt på planen, inklusive målvakten."
      },
      {
        id: 4,
        question: "Vilket land har vunnit flest VM-guld?",
        options: [
          "Argentina",
          "Tyskland",
          "Brasilien",
          "Italien"
        ],
        correctAnswer: 2,
        explanation: "Brasilien har vunnit flest VM-guld med 5 titlar (1958, 1962, 1970, 1994, 2002)."
      },
      {
        id: 5,
        question: "Vad heter Sveriges högsta fotbollsliga?",
        options: [
          "Premier League",
          "Allsvenskan",
          "Superettan",
          "La Liga"
        ],
        correctAnswer: 1,
        explanation: "Allsvenskan är Sveriges högsta fotbollsliga för herrar. För damer heter den Damallsvenskan."
      }
    ]
  },
  "9-manna-taktik": {
    id: "9-manna-taktik",
    title: "Taktik och Spelidéer",
    level: "9-manna",
    questions: [
      {
        id: 1,
        question: "Vad betyder 'pressing'?",
        options: [
          "Att pressa citroner",
          "Att aktivt jaga och störa motståndaren när de har bollen",
          "Att stå stilla",
          "Att ligga lågt i försvaret"
        ],
        correctAnswer: 1,
        explanation: "Pressing betyder att man aktivt jagar och trycker upp motståndaren för att vinna tillbaka bollen snabbt."
      },
      {
        id: 2,
        question: "Vad är en 'falsk nia'?",
        options: [
          "En spelare som ljuger",
          "En forward som drar djupt för att ta emot boll",
          "Ett fel nummer",
          "En målvakt som springer fram"
        ],
        correctAnswer: 1,
        explanation: "En falsk nia är en forward (traditionellt nummer 9) som ofta drar djupt istället för att stå högt, vilket skapar utrymme."
      },
      {
        id: 3,
        question: "Vad betyder 'kontraanfall'?",
        options: [
          "Att anfalla mot klockan",
          "Ett snabbt anfall direkt efter att ha vunnit bollen",
          "Att anfalla bakåt",
          "Att inte anfalla alls"
        ],
        correctAnswer: 1,
        explanation: "Kontraanfall är när man snabbt anfaller direkt efter att ha vunnit bollen, ofta när motståndaren är oorganiserad."
      },
      {
        id: 4,
        question: "Vad är 'zonmarkering'?",
        options: [
          "Att markera en specifik zon på planen istället för en spelare",
          "Att rita zoner på planen",
          "Att bara springa i en zon",
          "Att sätta upp zoner med koner"
        ],
        correctAnswer: 0,
        explanation: "Zonmarkering betyder att försvaret markerar specifika zoner på planen istället för att följa enskilda motspelare."
      },
      {
        id: 5,
        question: "Vad betyder 'att hålla bredden'?",
        options: [
          "Att stå bred",
          "Att sprida ut sig över hela planens bredd",
          "Att ha breda skor",
          "Att bara spela i mitten"
        ],
        correctAnswer: 1,
        explanation: "Att hålla bredden betyder att laget sprider ut sig över planens bredd för att skapa mer utrymme och fler passningsalternativ."
      }
    ]
  }
};

const Quiz = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);

  const quiz = quizId ? quizData[quizId] : null;

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Quiz hittades inte</h2>
              <Button onClick={() => navigate("/theory")}>Tillbaka till Teoribank</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    if (answeredQuestions[currentQuestion]) return;
    
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === question.correctAnswer;
    
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    }
    
    const newAnswered = [...answeredQuestions];
    newAnswered[currentQuestion] = true;
    setAnsweredQuestions(newAnswered);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectAnswers(0);
    setAnsweredQuestions([]);
  };

  const getScoreColor = () => {
    const percentage = (correctAnswers / quiz.questions.length) * 100;
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-warning";
    return "text-destructive";
  };

  if (showResult) {
    const percentage = Math.round((correctAnswers / quiz.questions.length) * 100);
    
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-accent" />
              <CardTitle className="text-3xl">Quiz Genomfört!</CardTitle>
              <CardDescription>Här är ditt resultat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className={`text-6xl font-bold mb-2 ${getScoreColor()}`}>
                  {percentage}%
                </div>
                <p className="text-muted-foreground text-lg">
                  {correctAnswers} av {quiz.questions.length} rätt
                </p>
              </div>

              <div className="space-y-2">
                {percentage >= 80 && (
                  <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-center">
                    <p className="font-semibold text-success">Utmärkt! Du har riktigt bra koll!</p>
                  </div>
                )}
                {percentage >= 60 && percentage < 80 && (
                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 text-center">
                    <p className="font-semibold text-warning">Bra jobbat! Fortsätt öva så blir det ännu bättre!</p>
                  </div>
                )}
                {percentage < 60 && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
                    <p className="font-semibold text-destructive">Fortsätt träna! Varje quiz gör dig bättre!</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="default" className="flex-1" onClick={handleRestart}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Gör om quiz
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => navigate("/theory")}>
                  Tillbaka
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/theory")}
              className="mb-4"
            >
              ← Tillbaka till Teoribank
            </Button>
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-primary">{quiz.level}</Badge>
              <span className="text-sm text-muted-foreground">
                Fråga {currentQuestion + 1} av {quiz.questions.length}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">{question.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === question.correctAnswer;
                const showAnswer = answeredQuestions[currentQuestion];
                
                let buttonVariant: "outline" | "default" | "destructive" = "outline";
                let buttonClass = "";
                
                if (showAnswer) {
                  if (isCorrect) {
                    buttonVariant = "default";
                    buttonClass = "bg-success hover:bg-success/90 text-primary-foreground border-success";
                  } else if (isSelected && !isCorrect) {
                    buttonVariant = "destructive";
                  }
                }
                
                return (
                  <Button
                    key={index}
                    variant={buttonVariant}
                    className={`w-full justify-start text-left h-auto py-4 px-6 ${buttonClass}`}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={answeredQuestions[currentQuestion]}
                  >
                    <span className="flex items-center gap-3 flex-1">
                      <span className="font-semibold">{String.fromCharCode(65 + index)}.</span>
                      <span>{option}</span>
                      {showAnswer && isCorrect && <CheckCircle2 className="ml-auto w-5 h-5" />}
                      {showAnswer && isSelected && !isCorrect && <XCircle className="ml-auto w-5 h-5" />}
                    </span>
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Explanation */}
          {answeredQuestions[currentQuestion] && (
            <Card className="mb-6 bg-muted/50 border-2">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    selectedAnswer === question.correctAnswer ? "bg-success" : "bg-destructive"
                  }`}>
                    {selectedAnswer === question.correctAnswer ? (
                      <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                    ) : (
                      <XCircle className="w-5 h-5 text-primary-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold mb-2">
                      {selectedAnswer === question.correctAnswer ? "Rätt svar!" : "Fel svar"}
                    </p>
                    <p className="text-muted-foreground">{question.explanation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          {answeredQuestions[currentQuestion] && (
            <Button 
              variant="hero" 
              size="lg" 
              className="w-full"
              onClick={handleNext}
            >
              {currentQuestion < quiz.questions.length - 1 ? (
                <>
                  Nästa fråga
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              ) : (
                <>
                  Se resultat
                  <Trophy className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Quiz;
