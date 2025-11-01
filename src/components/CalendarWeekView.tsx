import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface CalendarEvent {
  id: string;
  title: string;
  type: "training" | "match";
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  opponent?: string;
  division?: string;
  gatherTime?: string;
  trainingId?: string;
}

interface CalendarWeekViewProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
}

export const CalendarWeekView = ({ events, onEventClick }: CalendarWeekViewProps) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  const hours = Array.from({ length: 13 }, (_, i) => i + 10); // 10:00 - 22:00
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(currentWeekStart);
    day.setDate(currentWeekStart.getDate() + i);
    return day;
  });

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const getEventPosition = (startTime: string, endTime: string) => {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    const dayStartMinutes = 10 * 60; // 10:00
    
    const topPercent = ((startMinutes - dayStartMinutes) / (12 * 60)) * 100;
    const heightPercent = ((endMinutes - startMinutes) / (12 * 60)) * 100;
    
    return { top: `${topPercent}%`, height: `${heightPercent}%` };
  };

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Föregående
        </Button>
        <h3 className="font-semibold">
          Vecka {new Date(currentWeekStart).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })} - {new Date(weekDays[6]).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short', year: 'numeric' })}
        </h3>
        <Button variant="outline" size="sm" onClick={goToNextWeek}>
          Nästa
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <Card className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header with days */}
          <div className="grid grid-cols-8 border-b sticky top-0 bg-background z-10">
            <div className="p-2 border-r text-xs font-medium">Tid</div>
            {weekDays.map((day, i) => (
              <div key={i} className="p-2 border-r text-center">
                <div className="text-xs font-medium">
                  {day.toLocaleDateString('sv-SE', { weekday: 'short' })}
                </div>
                <div className="text-sm font-bold">
                  {day.getDate()}/{day.getMonth() + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Time slots */}
          <div className="relative">
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-8 border-b" style={{ height: '60px' }}>
                <div className="p-1 border-r text-xs text-muted-foreground text-center">
                  {hour}:00
                </div>
                {weekDays.map((day, dayIndex) => (
                  <div key={`${hour}-${dayIndex}`} className="border-r relative">
                    {/* 10-minute intervals */}
                    <div className="absolute top-1/6 left-0 right-0 border-t border-dashed border-border/50" />
                    <div className="absolute top-2/6 left-0 right-0 border-t border-dashed border-border/50" />
                    <div className="absolute top-3/6 left-0 right-0 border-t border-dashed border-border/50" />
                    <div className="absolute top-4/6 left-0 right-0 border-t border-dashed border-border/50" />
                    <div className="absolute top-5/6 left-0 right-0 border-t border-dashed border-border/50" />
                  </div>
                ))}
              </div>
            ))}

            {/* Events overlay */}
            {weekDays.map((day, dayIndex) => {
              const dayEvents = getEventsForDay(day);
              return dayEvents.map((event) => {
                const position = getEventPosition(event.startTime, event.endTime);
                const left = `${(100 / 7) * dayIndex}%`;
                const width = `${100 / 7}%`;
                
                return (
                  <div
                    key={event.id}
                    className={`absolute p-1 rounded cursor-pointer overflow-hidden text-xs ${
                      event.type === "match" 
                        ? "bg-accent/90 text-accent-foreground hover:bg-accent" 
                        : "bg-primary/90 text-primary-foreground hover:bg-primary"
                    }`}
                    style={{
                      top: position.top,
                      height: position.height,
                      left: `calc(${left} + 12.5%)`,
                      width: `calc(${width} - 2px)`,
                    }}
                    onClick={() => onEventClick?.(event)}
                  >
                    <div className="font-semibold truncate">{event.title}</div>
                    <div className="text-[10px] truncate">{event.location}</div>
                    <div className="text-[10px]">{event.startTime}</div>
                  </div>
                );
              });
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};
