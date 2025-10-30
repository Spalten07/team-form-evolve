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
        explanation: "Backen ska vara nära eget mål för att försvara och hjälpa målvakten."
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
        explanation: "Forwarden anfaller och försöker göra mål, men hjälper också till i försvar."
      },
      {
        id: 3,
        question: "Hur lång är en halvlek i 5-manna?",
        options: [
          "10 min",
          "15 min",
          "20 min",
          "45 min"
        ],
        correctAnswer: 1,
        explanation: "I 5-manna är varje halvlek 15 minuter lång."
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
        explanation: "När bollen går ut över sidlinjen blir det inkast för motståndarlaget."
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
        explanation: "Inkast görs med båda händer bakom huvudet, och båda fötterna måste vara i marken."
      },
      {
        id: 6,
        question: "Vad är en mittfältares uppgift?",
        options: [
          "Bara försvara",
          "Bara anfalla",
          "Både försvara och anfalla",
          "Stå stilla"
        ],
        correctAnswer: 2,
        explanation: "Mittfältaren både försvarar och anfaller - länkar ihop backar och forwards."
      },
      {
        id: 7,
        question: "Vad ska målvakten göra?",
        options: [
          "Spring runt planen",
          "Stoppa skott och organisera försvar",
          "Göra mål",
          "Bara titta"
        ],
        correctAnswer: 1,
        explanation: "Målvaktens huvuduppgift är att stoppa skott och dirigera försvarsspelet."
      },
      {
        id: 8,
        question: "När får målvakten ta bollen med händerna?",
        options: [
          "Alltid",
          "Aldrig",
          "Bara i straffområdet",
          "När som helst utanför planen"
        ],
        correctAnswer: 2,
        explanation: "Målvakten får ta bollen med händerna endast i eget straffområde."
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
        question: "Vad är inlägg?",
        options: [
          "Studsande boll",
          "Hög boll från kant mot mål",
          "Passning bakåt",
          "Boll på marken"
        ],
        correctAnswer: 1,
        explanation: "Inlägg = hög passning från kant in mot målområdet, ofta från ytterkant."
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
        explanation: "Djupled = spring bakom motståndarnas försvar för att få passning."
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
        explanation: "Bredsida = spela bollen åt sidan för att skapa mer utrymme och få upp bredden."
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
        explanation: "Översteg = kliv över bollen för att lura motståndare att tro du går åt ett håll."
      },
      {
        id: 5,
        question: "Vad är en framspel?",
        options: [
          "Spela bakåt",
          "Spela framåt mot mål",
          "Spela utanför",
          "Inte spela alls"
        ],
        correctAnswer: 1,
        explanation: "Framspel = passning framåt mot motståndarens mål, för att skapa målchanser."
      },
      {
        id: 6,
        question: "Vad betyder att 'vända med bollen'?",
        options: [
          "Springa bakåt",
          "Ta emot boll och vända mot mål",
          "Kasta bollen",
          "Ligga ner"
        ],
        correctAnswer: 1,
        explanation: "Att vända med bollen innebär att ta emot passning och vända sig mot motståndarens mål."
      },
      {
        id: 7,
        question: "Vad är ett lågt inlägg?",
        options: [
          "Inlägg längs marken",
          "Inlägg högt i luften",
          "Inlägg bakåt",
          "Inlägg med huvudet"
        ],
        correctAnswer: 0,
        explanation: "Lågt inlägg är en passning längs marken från kant in mot målområdet."
      },
      {
        id: 8,
        question: "Vad betyder 'möta bollen'?",
        options: [
          "Spring iväg från bollen",
          "Spring mot bollen för att ta emot",
          "Stå still",
          "Hoppa över bollen"
        ],
        correctAnswer: 1,
        explanation: "Att möta bollen innebär att springa mot den när den kommer för att ta emot säkert."
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
        explanation: "England kallas moderland - de moderna fotbollsreglerna skapades där 1863."
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
        explanation: "Zlatan Ibrahimović är Sveriges mest kända spelare genom tiderna."
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
        explanation: "7-manna = 7 spelare per lag på planen, inklusive målvakt."
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
        explanation: "Allsvenskan är Sveriges högsta fotbollsliga för herrar."
      },
      {
        id: 6,
        question: "Vilket år var första fotbolls-VM?",
        options: [
          "1900",
          "1920",
          "1930",
          "1950"
        ],
        correctAnswer: 2,
        explanation: "Första fotbolls-VM hölls 1930 i Uruguay."
      },
      {
        id: 7,
        question: "Vilket svenskt lag har flest svenska mästerskap?",
        options: [
          "AIK",
          "Malmö FF",
          "IFK Göteborg",
          "Djurgården"
        ],
        correctAnswer: 1,
        explanation: "Malmö FF har flest svenska mästerskap i herrfotboll."
      },
      {
        id: 8,
        question: "Vad heter fotbollens internationella förbund?",
        options: [
          "UEFA",
          "FIFA",
          "FIBA",
          "IOC"
        ],
        correctAnswer: 1,
        explanation: "FIFA (Fédération Internationale de Football Association) är fotbollens världsförbund."
      }
    ]
  },
  "7-manna-taktik": {
    id: "7-manna-taktik",
    title: "Taktiska grunder",
    level: "7-manna",
    questions: [
      {
        id: 1,
        question: "Varför är det viktigt att sprida ut sig på planen?",
        options: [
          "För att springa mindre",
          "För att skapa mer utrymme",
          "För att vila",
          "Det är inte viktigt"
        ],
        correctAnswer: 1,
        explanation: "Att sprida ut sig skapar mer utrymme och gör det svårare för motståndare att försvara."
      },
      {
        id: 2,
        question: "Vad ska man göra när laget inte har bollen?",
        options: [
          "Vila",
          "Titta på",
          "Försvara och positionera sig",
          "Gå hem"
        ],
        correctAnswer: 2,
        explanation: "När laget inte har bollen ska alla försvara och positionera sig rätt."
      },
      {
        id: 3,
        question: "Varför ska man kommunicera på planen?",
        options: [
          "För att prata",
          "För att hjälpa lagkamrater se fara och möjligheter",
          "För att domaren ska höra",
          "Det behövs inte"
        ],
        correctAnswer: 1,
        explanation: "Kommunikation hjälper lagkamrater att upptäcka fara och möjligheter de inte ser."
      },
      {
        id: 4,
        question: "Vad betyder att 'erbjuda sig'?",
        options: [
          "Spring iväg",
          "Positionera sig för att ta emot passning",
          "Stå still",
          "Sätta sig ner"
        ],
        correctAnswer: 1,
        explanation: "Att erbjuda sig betyder att positionera sig där lagkamrat kan passa bollen till dig."
      },
      {
        id: 5,
        question: "När ska man passa bakåt?",
        options: [
          "Aldrig",
          "När det inte finns bra alternativ framåt",
          "Alltid",
          "Bara i första halvleken"
        ],
        correctAnswer: 1,
        explanation: "Pass bakåt är smart när inga bra alternativ finns framåt - håller bollinnehav."
      },
      {
        id: 6,
        question: "Varför är det viktigt att ha god första touch?",
        options: [
          "Ser coolt ut",
          "Ger tid och kontroll på bollen",
          "Gör ingenting",
          "Domaren gillar det"
        ],
        correctAnswer: 1,
        explanation: "En god första touch ger dig tid och kontroll för nästa handling."
      },
      {
        id: 7,
        question: "Vad ska backar göra när laget anfaller?",
        options: [
          "Vila",
          "Stanna i försvar men stötta uppåt",
          "Spring framåt till motståndarens mål",
          "Gå av planen"
        ],
        correctAnswer: 1,
        explanation: "Backar ska stanna i försvar men positionera sig för att stötta anfallet."
      },
      {
        id: 8,
        question: "Varför är det viktigt med lagbalans?",
        options: [
          "För att alla ska få spring lika mycket",
          "För att täcka hela planen och inte lämna luckor",
          "Det är inte viktigt",
          "För att domaren kräver det"
        ],
        correctAnswer: 1,
        explanation: "Lagbalans innebär att täcka hela planen utan luckor som motståndare kan utnyttja."
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
        explanation: "Man kan aldrig vara offside på egen planhalva."
      },
      {
        id: 3,
        question: "Kan man vara offside vid inkast?",
        options: [
          "Ja, alltid",
          "Nej, aldrig",
          "Om man springer fort",
          "I första halvleken"
        ],
        correctAnswer: 1,
        explanation: "Offsideregeln gäller inte vid inkast, hörnor eller inkasten."
      },
      {
        id: 4,
        question: "Vad betyder 4-3-3 formationen?",
        options: [
          "4 forwards, 3 mittfält, 3 backar",
          "4 backar, 3 mittfält, 3 forwards",
          "3 backar, 4 mittfält, 3 forwards",
          "Ett telefonnummer"
        ],
        correctAnswer: 1,
        explanation: "4-3-3 = 4 backar, 3 mittfältare, 3 forwards (räknat bakifrån)."
      },
      {
        id: 5,
        question: "Vilket nummer har mittback traditionellt?",
        options: [
          "Nummer 1",
          "Nummer 4 eller 5",
          "Nummer 9",
          "Nummer 11"
        ],
        correctAnswer: 1,
        explanation: "Mittbackar har traditionellt nummer 4 eller 5."
      },
      {
        id: 6,
        question: "Kan man vara offside vid målspark?",
        options: [
          "Ja, alltid",
          "Nej, aldrig",
          "Bara om målvakten sparkar långt",
          "I andra halvleken"
        ],
        correctAnswer: 1,
        explanation: "Man kan inte vara offside direkt från målspark."
      },
      {
        id: 7,
        question: "Vad är 4-4-2 formationen?",
        options: [
          "4 backar, 4 mittfält, 2 forwards",
          "4 forwards, 4 mittfält, 2 backar",
          "2 backar, 4 mittfält, 4 forwards",
          "4 målvakter, 4 backar, 2 forwards"
        ],
        correctAnswer: 0,
        explanation: "4-4-2 = 4 backar, 4 mittfältare och 2 forwards."
      },
      {
        id: 8,
        question: "Vilket nummer har en traditionell målvakt?",
        options: [
          "Nummer 1",
          "Nummer 9",
          "Nummer 10",
          "Nummer 11"
        ],
        correctAnswer: 0,
        explanation: "Målvakten har traditionellt nummer 1."
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
        explanation: "Pressing = aktivt jaga och störa motståndare för att vinna tillbaka bollen."
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
        explanation: "Falsk nia = forward som droppar ner istället för att stå högt, skapar utrymme."
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
        explanation: "Kontra = snabbt anfall direkt efter bollvinst när motståndare är oorganiserade."
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
        explanation: "Zonmarkering = försvara specifika områden, inte enskilda spelare."
      },
      {
        id: 5,
        question: "Vad betyder 'hålla bredden'?",
        options: [
          "Spring brett",
          "Sprida ut sig över hela planens bredd",
          "Ha breda fötter",
          "Gå bredvid"
        ],
        correctAnswer: 1,
        explanation: "Hålla bredden = sprida ut sig över hela planen för att skapa utrymme."
      },
      {
        id: 6,
        question: "Vad är uppbyggnadsspel?",
        options: [
          "Bygga hus",
          "Lugnt spela upp bollen från försvar",
          "Spring snabbt framåt",
          "Sparka långt"
        ],
        correctAnswer: 1,
        explanation: "Uppbyggnadsspel = lugnt och kontrollerat spela bollen från försvar till anfall."
      },
      {
        id: 7,
        question: "Vad betyder 'kompakt försvar'?",
        options: [
          "Hålla ihop försvarslinjerna",
          "Spring långt ifrån varandra",
          "Ligga och vila",
          "Spring framåt"
        ],
        correctAnswer: 0,
        explanation: "Kompakt försvar = hålla ihop försvarslinjerna utan stora luckor emellan."
      },
      {
        id: 8,
        question: "Vad är en offensiv mittfältare?",
        options: [
          "Mittfältare som bara försvarar",
          "Mittfältare som spelar högt och skapar chanser",
          "Mittfältare som är arg",
          "Målvakt"
        ],
        correctAnswer: 1,
        explanation: "Offensiv mittfältare spelar högt upp och fokuserar på att skapa målchanser."
      }
    ]
  },
  "9-manna-avancerat": {
    id: "9-manna-avancerat",
    title: "Avancerade begrepp",
    level: "9-manna",
    questions: [
      {
        id: 1,
        question: "Vad är ett överlappningslöp?",
        options: [
          "Spring förbi lagkamrat på utsidan",
          "Hoppa över bollen",
          "Spring bakåt",
          "Stå still"
        ],
        correctAnswer: 0,
        explanation: "Överlappningslöp = back eller ytter springer förbi lagkamrat utanför för att ge breddalternativ."
      },
      {
        id: 2,
        question: "Vad är en dubbelpassning (ett-två)?",
        options: [
          "Passa två gånger bakåt",
          "Passa, spring förbi, få direkt retur",
          "Passa till två spelare",
          "Sparka bollen två gånger"
        ],
        correctAnswer: 1,
        explanation: "Ett-två = passa till lagkamrat, spring förbi motståndare, få direktretur."
      },
      {
        id: 3,
        question: "Vad betyder att 'spela på djupet'?",
        options: [
          "Spela i djup lera",
          "Passa bakom motståndarnas försvarslinje",
          "Spela långsamt",
          "Spela bakåt"
        ],
        correctAnswer: 1,
        explanation: "Spela på djupet = passa bakom motståndarnas försvarslinje till löpande lagkamrat."
      },
      {
        id: 4,
        question: "Vad är en fyrbackslinje?",
        options: [
          "Fyra backar i en linje tvärs över plan",
          "Fyra forward",
          "Fyra målvakter",
          "Fyra koner"
        ],
        correctAnswer: 0,
        explanation: "Fyrbackslinje = fyra försvarare (ofta 2 yttrar + 2 mittbackar) i linje."
      },
      {
        id: 5,
        question: "Vad är en libbero?",
        options: [
          "En italiensk maträtt",
          "Fri back bakom försvarslinje",
          "Forward",
          "Domare"
        ],
        correctAnswer: 1,
        explanation: "Libbero = fri back som spelar bakom försvarslinje och kan gå fram fritt."
      },
      {
        id: 6,
        question: "Vad betyder 'första stolpen'?",
        options: [
          "Målstolpen närmast inlägget",
          "Första spelaren",
          "Målvaktens stolpe",
          "Hörnflaggan"
        ],
        correctAnswer: 0,
        explanation: "Första stolpen = målstolpen närmast där inlägget kommer ifrån."
      },
      {
        id: 7,
        question: "Vad är en målvaktsutkast?",
        options: [
          "Kasta ut målvakten",
          "Målvakt kastar bollen snabbt för kontra",
          "Målvakt sparkar långt",
          "Målvakt lämnar planen"
        ],
        correctAnswer: 1,
        explanation: "Målvaktsutkast = målvakt kastar ut bollen snabbt för att starta kontraanfall."
      },
      {
        id: 8,
        question: "Vad är en skymmande spelare?",
        options: [
          "Spelare som inte syns",
          "Spelare som skymmer målvaktens sikt",
          "Spelare i dimma",
          "Inbytare"
        ],
        correctAnswer: 1,
        explanation: "Skymmande spelare står framför målvakt för att blockera sikten vid skott."
      }
    ]
  }
};

const Quiz = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const quiz = quizId ? quizData[quizId] : null;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Quiz hittades inte</p>
              <Button onClick={() => navigate("/theory")} className="mt-4 mx-auto block">
                Tillbaka till Teoribank
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowExplanation(true);
    if (selectedAnswer === question.correctAnswer) {
      setCorrectAnswers(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCorrectAnswers(0);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    const percentage = Math.round((correctAnswers / quiz.questions.length) * 100);
    const passed = percentage >= 60;

    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className={`border-2 ${passed ? 'border-success' : 'border-warning'}`}>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Trophy className={`w-16 h-16 ${passed ? 'text-success' : 'text-warning'}`} />
                </div>
                <CardTitle className="text-3xl">
                  {passed ? 'Grattis! 🎉' : 'Bra försök!'}
                </CardTitle>
                <CardDescription className="text-lg">
                  {quiz.title} - {quiz.level}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
                    {correctAnswers}/{quiz.questions.length}
                  </div>
                  <p className="text-muted-foreground">Rätt svar ({percentage}%)</p>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleRestart}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Testa igen
                  </Button>
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => navigate("/theory")}
                  >
                    Tillbaka till Teoribank
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
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
              <Badge variant="outline">{quiz.level}</Badge>
              <span className="text-sm text-muted-foreground">
                Fråga {currentQuestion + 1} av {quiz.questions.length}
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{question.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === question.correctAnswer;
                const showAsCorrect = showExplanation && isCorrect;
                const showAsWrong = showExplanation && isSelected && !isCorrect;

                return (
                  <Button
                    key={index}
                    variant={showAsCorrect ? "default" : showAsWrong ? "destructive" : isSelected ? "secondary" : "outline"}
                    className="w-full justify-start text-left h-auto py-4 px-6"
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showExplanation}
                  >
                    <div className="flex items-center gap-3 w-full">
                      {showExplanation && (
                        <>
                          {isCorrect && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                          {showAsWrong && <XCircle className="w-5 h-5 flex-shrink-0" />}
                        </>
                      )}
                      <span className="flex-1">{option}</span>
                    </div>
                  </Button>
                );
              })}

              {showExplanation && (
                <Card className="bg-secondary/50 border-0 mt-4">
                  <CardContent className="pt-4">
                    <p className="text-sm">
                      <strong className="text-foreground">Förklaring: </strong>
                      <span className="text-muted-foreground">{question.explanation}</span>
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-3 pt-4">
                {!showExplanation ? (
                  <Button
                    className="w-full"
                    onClick={handleCheckAnswer}
                    disabled={selectedAnswer === null}
                  >
                    Kontrollera svar
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={handleNext}
                  >
                    {currentQuestion < quiz.questions.length - 1 ? (
                      <>
                        Nästa fråga
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      'Se resultat'
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Quiz;