import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, ExternalLink, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EventDetails {
  id: string;
  title: string;
  type: "training" | "match";
  date: string;
  time: string;
  gatherTime?: string;
  location: string;
  opponent?: string;
  division?: string;
  trainingId?: string;
  bringItems?: string;
  materials?: Array<{ name: string; quantity: number }>;
}

interface EventDetailsDialogProps {
  event: EventDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EventDetailsDialog = ({ event, open, onOpenChange }: EventDetailsDialogProps) => {
  const navigate = useNavigate();

  if (!event) return null;

  const handleViewTraining = () => {
    if (event.trainingId) {
      navigate(`/saved-trainings`);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
          <DialogDescription>
            {new Date(event.date).toLocaleDateString('sv-SE', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">
              {event.type === "match" ? "Match" : "Träning"}
            </span>
          </div>
          
          {event.opponent && (
            <>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                <Users className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Motståndare</div>
                  <div className="text-sm text-muted-foreground">{event.opponent}</div>
                </div>
              </div>
              {event.division && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                  <Badge variant="outline">{event.division}</Badge>
                </div>
              )}
            </>
          )}

          <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="font-medium">Tid</div>
              <div className="text-sm text-muted-foreground">
                Start: {event.time}
                {event.gatherTime && ` • Samling: ${event.gatherTime}`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="font-medium">Plats</div>
              <div className="text-sm text-muted-foreground">{event.location}</div>
            </div>
          </div>

          {event.bringItems && (
            <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
              <div className="font-medium mb-1">Medtages</div>
              <div className="text-sm">{event.bringItems}</div>
            </div>
          )}

          {event.materials && event.materials.length > 0 && (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 font-medium mb-2">
                <Package className="w-4 h-4" />
                Material som behövs
              </div>
              <div className="space-y-1">
                {event.materials.map((material, index) => (
                  <div key={index} className="text-sm flex justify-between">
                    <span>{material.name}</span>
                    <span className="font-semibold">{material.quantity} st</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {event.trainingId && (
            <Button 
              variant="outline" 
              className="w-full gap-2"
              onClick={handleViewTraining}
            >
              <ExternalLink className="w-4 h-4" />
              Se träningspass
            </Button>
          )}
        </div>

        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Stäng
        </Button>
      </DialogContent>
    </Dialog>
  );
};
