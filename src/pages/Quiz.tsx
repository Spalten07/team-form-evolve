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
        question: "Var ska en back placera sig?",
        options: [
          "Framför motståndarens mål",
          "I mitten av planen",
          "Nära eget mål",
          "Utanför planen"
        ],
        correctAnswer: 2,
        explanation: "Backen ska vara nära eget mål för att försvara."
      },
      {
        id: 2,
        question: "Vad är forwardens uppgift?",
        options: [
          "Stå i mål",
          "Göra mål",
          "Bara försvara",
          "Stå still"
        ],
        correctAnswer: 1,
        explanation: "Forwarden anfaller och försöker göra mål."
      },
      {
        id: 3,
        question: "Hur lång är en halva i 5-manna?",
        options: [
          "10 min",
          "15 min",
          "20 min",
          "45 min"
        ],
        correctAnswer: 1,
        explanation: "I 5-manna är varje halva 15 minuter."
      },
      {
        id: 4,
        question: "Vad händer när bollen går ut över sidlinjen?",
        options: [
          "Mål direkt",
          "Inkast",
          "Frispark",
          "Omstart"
        ],
        correctAnswer: 1,
        explanation: "Bollen över sidlinjen = inkast för motståndarlaget."
      },
      {
        id: 5,
        question: "Hur gör man inkast?",
        options: [
          "Med en hand",
          "Sparka bollen",
          "Båda händer bakom huvud",
          "Rulla bollen"
        ],
        correctAnswer: 2,
        explanation: "Inkast: båda händer bakom huvud, båda fötter i mark."
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
        question: "Vad är kryssboll?",
        options: [
          "Studsande boll",
          "Hög boll från kant mot mål",
          "Passning bakåt",
          "Boll på marken"
        ],
        correctAnswer: 1,
        explanation: "Kryssboll = hög passning från kant in mot mål."
      },
      {
        id: 2,
        question: "Vad är djupledslöpning?",
        options: [
          "Spring mot eget mål",
          "Spring i sidled",
          "Spring bakom försvar",
          "Stå still"
        ],
        correctAnswer: 2,
        explanation: "Djupled = spring bakom motståndarnas försvar."
      },
      {
        id: 3,
        question: "Vad betyder bredsida?",
        options: [
          "Spela bollen åt sidan",
          "Bred spelare",
          "Brett mål",
          "Bred plan"
        ],
        correctAnswer: 0,
        explanation: "Bredsida = spela bollen åt sidan för mer utrymme."
      },
      {
        id: 4,
        question: "Vad är överstegsfint?",
        options: [
          "Kliv över boll för att lura",
          "Hoppa över boll",
          "Sparka högt",
          "Falla över boll"
        ],
        correctAnswer: 0,
        explanation: "Översteg = kliv över boll för att lura motståndare."
      },
      {
        id: 5,
        question: "Vilket år var första VM?",
        options: [
          "1900",
          "1920",
          "1930",
          "1950"
        ],
        correctAnswer: 2,
        explanation: "Första VM var 1930 i Uruguay."
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
        question: "När är man offside?",
        options: [
          "Spring för fort",
          "Närmare mål än boll OCH näst sista motspelare",
          "I eget straffområde",
          "Har bollen"
        ],
        correctAnswer: 1,
        explanation: "Offside = närmare mål än boll och näst sista motspelare vid passning."
      },
      {
        id: 2,
        question: "Kan man vara offside på egen halva?",
        options: [
          "Ja, alltid",
          "Nej, aldrig",
          "Bara ibland",
          "Om domaren säger"
        ],
        correctAnswer: 1,
        explanation: "Man kan aldrig vara offside på egen halva."
      },
      {
        id: 3,
        question: "Kan man vara offside vid inkast?",
        options: [
          "Ja, alltid",
          "Nej, aldrig",
          "Om man springer fort",
          "I första halvlek"
        ],
        correctAnswer: 1,
        explanation: "Offsideregeln gäller inte vid inkast."
      },
      {
        id: 4,
        question: "Vad betyder 4-3-3?",
        options: [
          "4 forwards, 3 mittfält, 3 backar",
          "4 backar, 3 mittfält, 3 forwards",
          "3 backar, 4 mittfält, 3 forwards",
          "Ett telefonnummer"
        ],
        correctAnswer: 1,
        explanation: "4-3-3 = 4 backar, 3 mittfält, 3 forwards (bakifrån räknat)."
      },
      {
        id: 5,
        question: "Vilket nummer har mittback?",
        options: [
          "Nummer 1",
          "Nummer 4 eller 5",
          "Nummer 9",
          "Nummer 11"
        ],
        correctAnswer: 1,
        explanation: "Mittbackar har nummer 4 eller 5."
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
        question: "Vilket land är fotbollens 'moderland'?",
        options: [
          "Brasilien",
          "England",
          "Sverige",
          "Tyskland"
        ],
        correctAnswer: 1,
        explanation: "England kallas moderland - reglerna skapades där 1863."
      },
      {
        id: 2,
        question: "Vem är Sveriges mest kända fotbollsspelare?",
        options: [
          "Henrik Larsson",
          "Zlatan Ibrahimović",
          "Gunnar Nordahl",
          "Tomas Brolin"
        ],
        correctAnswer: 1,
        explanation: "Zlatan är Sveriges mest kända spelare genom tiderna."
      },
      {
        id: 3,
        question: "Hur många spelare på planen i 7-manna?",
        options: [
          "5 spelare",
          "7 spelare",
          "9 spelare",
          "11 spelare"
        ],
        correctAnswer: 1,
        explanation: "7-manna = 7 spelare per lag, inklusive målvakt."
      },
      {
        id: 4,
        question: "Vilket land har flest VM-guld?",
        options: [
          "Argentina",
          "Tyskland",
          "Brasilien",
          "Italien"
        ],
        correctAnswer: 2,
        explanation: "Brasilien har 5 VM-guld (1958, 1962, 1970, 1994, 2002)."
      },
      {
        id: 5,
        question: "Vad heter Sveriges högsta liga?",
        options: [
          "Premier League",
          "Allsvenskan",
          "Superettan",
          "La Liga"
        ],
        correctAnswer: 1,
        explanation: "Allsvenskan är Sveriges högsta liga för herrar."
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
        question: "Vad betyder pressing?",
        options: [
          "Pressa citroner",
          "Jaga och störa motståndare",
          "Stå still",
          "Ligga lågt i försvar"
        ],
        correctAnswer: 1,
        explanation: "Pressing = aktivt jaga motståndare för att vinna boll."
      },
      {
        id: 2,
        question: "Vad är falsk nia?",
        options: [
          "En spelare som ljuger",
          "Forward som droppar ner",
          "Ett fel nummer",
          "Målvakt som springer fram"
        ],
        correctAnswer: 1,
        explanation: "Falsk nia = forward som droppar ner istället för att stå högt."
      },
      {
        id: 3,
        question: "Vad är kontraanfall?",
        options: [
          "Anfalla mot klockan",
          "Snabbt anfall efter bollvinst",
          "Anfalla bakåt",
          "Inte anfalla"
        ],
        correctAnswer: 1,
        explanation: "Kontra = snabbt anfall direkt efter bollvinst."
      },
      {
        id: 4,
        question: "Vad är zonmarkering?",
        options: [
          "Markera zon istället för spelare",
          "Rita zoner",
          "Spring i en zon",
          "Sätt upp koner"
        ],
        correctAnswer: 0,
        explanation: "Zonmarkering = försvara specifika zoner, inte enskilda spelare."
      },
      {
        id: 5,
        question: "Vad betyder 'hålla bredden'?",
        options: [
          "Stå bred",
          "Sprida ut sig över planens bredd",
          "Breda skor",
          "Spela i mitten"
        ],
        correctAnswer: 1,
        explanation: "Hålla bredden = sprida ut sig för mer utrymme."
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
