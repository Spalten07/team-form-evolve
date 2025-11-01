import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface CreateQuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  teamId: string | null;
  onSuccess: () => void;
}

export const CreateQuizDialog = ({ open, onOpenChange, userId, teamId, onSuccess }: CreateQuizDialogProps) => {
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("5-manna");
  const [questions, setQuestions] = useState<Question[]>([
    { question: "", options: ["", "", "", ""], correctAnswer: 0, explanation: "" }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: 0, explanation: "" }]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Ange en titel");
      return;
    }

    if (questions.some(q => !q.question.trim() || q.options.some(o => !o.trim()) || !q.explanation.trim())) {
      toast.error("Fyll i alla frågor, svar och förklaringar");
      return;
    }

    setIsSubmitting(true);
    try {
      const quizId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const { error } = await supabase
        .from('custom_quizzes')
        .insert({
          quiz_id: quizId,
          title,
          level,
          questions: questions.map((q, idx) => ({ id: idx + 1, ...q })),
          created_by: userId,
          team_id: teamId
        });

      if (error) throw error;

      toast.success("Teoripass skapat!");
      setTitle("");
      setLevel("5-manna");
      setQuestions([{ question: "", options: ["", "", "", ""], correctAnswer: 0, explanation: "" }]);
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error creating quiz:', error);
      toast.error("Kunde inte skapa teoripass");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Skapa eget teoripass</DialogTitle>
          <DialogDescription>
            Skapa ett anpassat quiz för dina spelare
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titel</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="T.ex. Taktik för nybörjare"
              />
            </div>

            <div>
              <Label htmlFor="level">Nivå</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5-manna">5-manna</SelectItem>
                  <SelectItem value="7-manna">7-manna</SelectItem>
                  <SelectItem value="9-manna">9-manna</SelectItem>
                  <SelectItem value="11-manna">11-manna</SelectItem>
                  <SelectItem value="Övrigt">Övrigt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Frågor ({questions.length})</Label>
              <Button onClick={addQuestion} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Lägg till fråga
              </Button>
            </div>

            {questions.map((q, qIdx) => (
              <Card key={qIdx}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <Label className="text-sm font-medium">Fråga {qIdx + 1}</Label>
                    {questions.length > 1 && (
                      <Button
                        onClick={() => removeQuestion(qIdx)}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <Input
                    value={q.question}
                    onChange={(e) => updateQuestion(qIdx, 'question', e.target.value)}
                    placeholder="Skriv din fråga här..."
                  />

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Svarsalternativ</Label>
                    {q.options.map((option, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={q.correctAnswer === oIdx ? "default" : "outline"}
                          className="h-8 w-8 p-0 flex-shrink-0"
                          onClick={() => updateQuestion(qIdx, 'correctAnswer', oIdx)}
                        >
                          {q.correctAnswer === oIdx ? <CheckCircle2 className="w-4 h-4" /> : oIdx + 1}
                        </Button>
                        <Input
                          value={option}
                          onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                          placeholder={`Alternativ ${oIdx + 1}`}
                          className="flex-1"
                        />
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground">
                      Klicka på numret för att markera rätt svar
                    </p>
                  </div>

                  <div>
                    <Label className="text-xs">Förklaring</Label>
                    <Textarea
                      value={q.explanation}
                      onChange={(e) => updateQuestion(qIdx, 'explanation', e.target.value)}
                      placeholder="Förklara varför svaret är rätt..."
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Avbryt
            </Button>
            <Button onClick={handleSubmit} className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Skapar..." : "Skapa teoripass"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
