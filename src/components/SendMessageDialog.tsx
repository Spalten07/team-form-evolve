import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SendMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlayers: number[];
  players: Array<{ id: number; name: string }>;
}

export const SendMessageDialog = ({ open, onOpenChange, selectedPlayers, players }: SendMessageDialogProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) {
      toast.error("Skriv ett meddelande");
      return;
    }
    
    toast.success(`Meddelande skickat till ${selectedPlayers.length} spelare!`);
    setMessage("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Skicka meddelande
          </DialogTitle>
          <DialogDescription>
            Skicka meddelande till {selectedPlayers.length} spelare
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Valda spelare</Label>
            <div className="p-3 rounded-lg bg-secondary/50 text-sm">
              {selectedPlayers.map(id => players.find(p => p.id === id)?.name).join(", ")}
            </div>
          </div>

          <div>
            <Label htmlFor="message">Meddelande</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Skriv ditt meddelande här..."
              rows={5}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Avbryt
            </Button>
            <Button onClick={handleSend} className="flex-1">
              Skicka
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
