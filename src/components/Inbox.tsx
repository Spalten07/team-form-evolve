import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, Clock, MapPin, Users, BookOpen, MessageSquare, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface InboxMessage {
  id: string;
  type: "callup" | "message" | "theory";
  title: string;
  from: string;
  date: string;
  read: boolean;
  callupDetails?: {
    activityType: "training" | "match";
    time: string;
    gatherTime?: string;
    location: string;
    opponent?: string;
    division?: string;
    trainingId?: string;
    bringItems?: string;
  };
  messageContent?: string;
  theoryDetails?: {
    quizTitle: string;
    questions: number;
    quizId: string;
  };
}

interface InboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data - ska ersättas med riktig data senare
const mockMessages: InboxMessage[] = [
  {
    id: "1",
    type: "callup",
    title: "Kallelse: Lagträning - Passningar",
    from: "Tränare Anders",
    date: "2025-11-01",
    read: false,
    callupDetails: {
      activityType: "training",
      time: "18:00",
      gatherTime: "17:45",
      location: "Östermalms IP",
      trainingId: "training-123",
      bringItems: "Vattenflaska, extra t-shirt, fotbollsskor"
    }
  },
  {
    id: "2",
    type: "callup",
    title: "Kallelse: Match mot Hammarby IF",
    from: "Tränare Anders",
    date: "2025-11-03",
    read: false,
    callupDetails: {
      activityType: "match",
      time: "15:00",
      gatherTime: "14:30",
      location: "Tele2 Arena",
      opponent: "Hammarby IF",
      division: "Division 3 Norra"
    }
  },
  {
    id: "3",
    type: "message",
    title: "Viktig information",
    from: "Tränare Anders",
    date: "2025-10-30",
    read: true,
    messageContent: "Hej! Glöm inte att ta med er vattenflaska till nästa träning. Vi kommer att ha en intensiv session!"
  },
  {
    id: "4",
    type: "theory",
    title: "Nytt teoripass: Offsideregeln",
    from: "Tränare Anders",
    date: "2025-10-28",
    read: true,
    theoryDetails: {
      quizTitle: "Offsideregeln & Formationer",
      questions: 8,
      quizId: "9-manna-offside"
    }
  }
];

export const Inbox = ({ open, onOpenChange }: InboxProps) => {
  const [messages, setMessages] = useState<InboxMessage[]>(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null);
  const navigate = useNavigate();

  const markAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
  };

  const handleMessageClick = (message: InboxMessage) => {
    setSelectedMessage(message);
    markAsRead(message.id);
  };

  const handleViewTraining = (trainingId?: string) => {
    if (trainingId) {
      navigate(`/saved-trainings`);
      onOpenChange(false);
    }
  };

  const handleViewQuiz = (quizId?: string) => {
    if (quizId) {
      navigate(`/quiz/${quizId}`);
      onOpenChange(false);
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case "callup":
        return <Calendar className="w-5 h-5" />;
      case "theory":
        return <BookOpen className="w-5 h-5" />;
      default:
        return <MessageSquare className="w-5 h-5" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "callup":
        return <Badge className="bg-primary/10 text-primary">Kallelse</Badge>;
      case "theory":
        return <Badge className="bg-accent/10 text-accent">Teoripass</Badge>;
      default:
        return <Badge variant="outline">Meddelande</Badge>;
    }
  };

  return (
    <>
      <Dialog open={open && !selectedMessage} onOpenChange={(isOpen) => {
        if (!isOpen) setSelectedMessage(null);
        onOpenChange(isOpen);
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-6 h-6" />
              Inkorg
            </DialogTitle>
            <DialogDescription>
              {messages.filter(m => !m.read).length} olästa meddelanden
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Inga meddelanden än
              </div>
            ) : (
              messages.map((message) => (
                <Card 
                  key={message.id}
                  className={`cursor-pointer hover:shadow-md transition-all ${!message.read ? 'border-primary border-2' : ''}`}
                  onClick={() => handleMessageClick(message)}
                >
                  <CardHeader className="py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${!message.read ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                          {getMessageIcon(message.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {getTypeBadge(message.type)}
                            {!message.read && (
                              <Badge className="bg-success/10 text-success">Nytt</Badge>
                            )}
                          </div>
                          <CardTitle className="text-base truncate">{message.title}</CardTitle>
                          <CardDescription className="text-xs">
                            {message.from} • {new Date(message.date).toLocaleDateString('sv-SE')}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Message Details Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={(isOpen) => {
        if (!isOpen) setSelectedMessage(null);
      }}>
        <DialogContent className="max-w-lg">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMessage.title}</DialogTitle>
                <DialogDescription>
                  Från {selectedMessage.from} • {new Date(selectedMessage.date).toLocaleDateString('sv-SE')}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {selectedMessage.type === "callup" && selectedMessage.callupDetails && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">
                        {selectedMessage.callupDetails.activityType === "match" ? "Match" : "Träning"}
                      </span>
                    </div>
                    
                    {selectedMessage.callupDetails.opponent && (
                      <>
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Motståndare</div>
                            <div className="text-sm text-muted-foreground">{selectedMessage.callupDetails.opponent}</div>
                          </div>
                        </div>
                        {selectedMessage.callupDetails.division && (
                          <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                            <Badge variant="outline">{selectedMessage.callupDetails.division}</Badge>
                          </div>
                        )}
                      </>
                    )}

                    <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Tid</div>
                        <div className="text-sm text-muted-foreground">
                          Start: {selectedMessage.callupDetails.time}
                          {selectedMessage.callupDetails.gatherTime && ` • Samling: ${selectedMessage.callupDetails.gatherTime}`}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Plats</div>
                        <div className="text-sm text-muted-foreground">{selectedMessage.callupDetails.location}</div>
                      </div>
                    </div>

                    {selectedMessage.callupDetails.bringItems && (
                      <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                        <div className="font-medium mb-1">Medtages</div>
                        <div className="text-sm">{selectedMessage.callupDetails.bringItems}</div>
                      </div>
                    )}

                    {selectedMessage.callupDetails.trainingId && (
                      <Button 
                        variant="outline" 
                        className="w-full gap-2"
                        onClick={() => handleViewTraining(selectedMessage.callupDetails?.trainingId)}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Se träningspass
                      </Button>
                    )}
                  </div>
                )}

                {selectedMessage.type === "message" && selectedMessage.messageContent && (
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <p>{selectedMessage.messageContent}</p>
                  </div>
                )}

                {selectedMessage.type === "theory" && selectedMessage.theoryDetails && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <div className="font-medium mb-1">{selectedMessage.theoryDetails.quizTitle}</div>
                      <div className="text-sm text-muted-foreground">{selectedMessage.theoryDetails.questions} frågor</div>
                    </div>
                    <Button 
                      variant="default" 
                      className="w-full gap-2"
                      onClick={() => handleViewQuiz(selectedMessage.theoryDetails?.quizId)}
                    >
                      <BookOpen className="w-4 h-4" />
                      Starta quiz
                    </Button>
                  </div>
                )}
              </div>

              <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                Stäng
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
