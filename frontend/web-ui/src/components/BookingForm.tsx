'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Calendar, Clock, Plus, Trash2 } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isBefore, startOfToday, isToday } from "date-fns";
import { cn } from "@/lib/utils";

interface Stop {
  address: string;
  type: 'pickup' | 'dropoff' | 'stop';
  coordinates?: [number, number];
}

interface Suggestion {
  place_name: string;
  center: [number, number];
}

interface BookingFormProps {
  stops: Stop[];
  setStops: (stops: Stop[]) => void;
  suggestions: Suggestion[];
  activeInput: number | null;
  suggestionsRef: React.RefObject<HTMLDivElement>;
  onAddressChange: (value: string, index: number) => void;
  onSuggestionSelect: (suggestion: Suggestion, index: number) => void;
  onAddStop: () => void;
  onRemoveStop: (index: number) => void;
}

const BookingForm = ({
  stops,
  setStops,
  suggestions,
  activeInput,
  suggestionsRef,
  onAddressChange,
  onSuggestionSelect,
  onAddStop,
  onRemoveStop
}: BookingFormProps) => {
  const [date, setDate] = useState<Date>(startOfToday());
  
  const now = new Date();
  const minutes = now.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 30) * 30;
  now.setMinutes(roundedMinutes === 60 ? 0 : roundedMinutes);
  now.setHours(roundedMinutes === 60 ? now.getHours() + 1 : now.getHours());
  now.setSeconds(0);
  now.setMilliseconds(0);
  
  const defaultTime = format(now, 'HH:mm');
  const [selectedTime, setSelectedTime] = useState<string>(defaultTime);

  const generateTimeSlots = () => {
    const slots = [];
    const currentDate = new Date();
    const currentMinute = currentDate.getMinutes();
    const roundedMinute = Math.ceil(currentMinute / 30) * 30;
    const adjustedHour = roundedMinute === 60 ? currentDate.getHours() + 1 : currentDate.getHours();
    const adjustedMinute = roundedMinute === 60 ? 0 : roundedMinute;

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (isToday(date)) {
          if (hour < adjustedHour || (hour === adjustedHour && minute < adjustedMinute)) {
            continue;
          }
        }
        
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate || isBefore(newDate, startOfToday())) {
      return;
    }
    setDate(newDate);
    
    if (isToday(newDate)) {
      const currentDate = new Date();
      const currentMinute = currentDate.getMinutes();
      const roundedMinute = Math.ceil(currentMinute / 30) * 30;
      const adjustedHour = roundedMinute === 60 ? currentDate.getHours() + 1 : currentDate.getHours();
      const adjustedMinute = roundedMinute === 60 ? 0 : roundedMinute;
      const currentTime = `${adjustedHour.toString().padStart(2, '0')}:${adjustedMinute.toString().padStart(2, '0')}`;
      
      if (selectedTime < currentTime) {
        setSelectedTime(currentTime);
      }
    }
  };

  const getDateDisplayText = () => {
    if (!date) return "Select date";
    return isToday(date) ? "Today" : format(date, "dd.MM.yyyy");
  };

  const getTimeDisplayText = () => {
    if (!selectedTime) return "Select time";
    
    const closestTime = getClosestAvailableTime();
    return selectedTime === closestTime && isToday(date) ? "Now" : selectedTime;
  };

  const getClosestAvailableTime = () => {
    const currentDate = new Date();
    const currentMinute = currentDate.getMinutes();
    const roundedMinute = Math.ceil(currentMinute / 30) * 30;
    const adjustedHour = roundedMinute === 60 ? currentDate.getHours() + 1 : currentDate.getHours();
    const adjustedMinute = roundedMinute === 60 ? 0 : roundedMinute;
    return `${adjustedHour.toString().padStart(2, '0')}:${adjustedMinute.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 bg-transparent">
      <div className="space-y-4">
        {stops.map((stop, index) => (
          <div key={index} className="relative">
            <div className="flex gap-2">
              <Input
                placeholder={stop.type === 'pickup' ? "Pickup location" : stop.type === 'dropoff' ? "Dropoff location" : "Stop location"}
                value={stop.address}
                onChange={(e) => onAddressChange(e.target.value, index)}
                className="pl-10 bg-white border-0 shadow-md focus-visible:ring-1 focus-visible:ring-maxmove-600"
              />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maxmove-600" />
              {index > 0 && index < stops.length - 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveStop(index)}
                  className="flex-shrink-0 hover:bg-maxmove-100"
                >
                  <Trash2 className="h-4 w-4 text-maxmove-800" />
                </Button>
              )}
            </div>
            {activeInput === index && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-md border-0"
              >
                {suggestions.map((suggestion, i) => (
                  <div
                    key={i}
                    className="px-4 py-2 hover:bg-maxmove-50 cursor-pointer"
                    onClick={() => onSuggestionSelect(suggestion, index)}
                  >
                    {suggestion.place_name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {stops.length < 5 && (
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 border-0 bg-white shadow-md hover:bg-maxmove-50 text-maxmove-800"
            onClick={onAddStop}
          >
            <Plus className="h-4 w-4" />
            Add stop
          </Button>
        )}

        <div className="grid grid-cols-2 gap-2 z-50 relative">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal border-0 bg-white shadow-md hover:bg-maxmove-50",
                  !date && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4 text-maxmove-600" />
                {getDateDisplayText()}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0 shadow-lg border border-maxmove-100 z-50">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                disabled={(date) => isBefore(date, startOfToday())}
                className="rounded-md border-none"
                locale={{
                  localize: {
                    day: n => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][n],
                    month: n => ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][n],
                    ordinalNumber: n => `${n}`,
                    era: n => ["BC", "AD"][n],
                    quarter: n => ["Q1", "Q2", "Q3", "Q4"][n],
                    dayPeriod: n => n? "PM" : "AM",
                  },
                  formatLong: {
                    date: () => "MM/dd/yyyy",
                    time: () => "HH:mm",
                    dateTime: () => "MM/dd/yyyy HH:mm",
                  },
                  match: {
                    ordinalNumber: () => ({ value: 0, rest: "" }),
                    era: () => ({ value: 0, rest: "" }),
                    quarter: () => ({ value: 0, rest: "" }),
                    month: () => ({ value: 0, rest: "" }),
                    day: () => ({ value: 0, rest: "" }),
                    dayPeriod: () => ({ value: 0, rest: "" }),
                  },
                  options: {
                    weekStartsOn: 1,
                    firstWeekContainsDate: 4,
                  }
                }}
                classNames={{
                  day_selected: "bg-maxmove-600 text-white hover:bg-maxmove-700 focus:bg-maxmove-700",
                  day_today: "bg-maxmove-100 text-maxmove-900",
                  day_range_middle: "bg-maxmove-50",
                  day_range_end: "bg-maxmove-600 text-white hover:bg-maxmove-700 focus:bg-maxmove-700",
                  day_range_start: "bg-maxmove-600 text-white hover:bg-maxmove-700 focus:bg-maxmove-700",
                  head_cell: "text-maxmove-700 font-medium text-xs",
                  cell: "text-center p-0 relative [&:has([aria-selected])]:bg-maxmove-50",
                  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                  caption: "flex justify-center pt-1 pb-2 relative items-center",
                  caption_label: "text-maxmove-900 font-medium text-sm",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-maxmove-100",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                }}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal border-0 bg-white shadow-md hover:bg-maxmove-50",
                  !selectedTime && "text-muted-foreground"
                )}
              >
                <Clock className="mr-2 h-4 w-4 text-maxmove-600" />
                {getTimeDisplayText()}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" side="top" className="w-48 shadow-lg border border-maxmove-100 max-h-[240px] overflow-y-auto z-50">
              <div className="py-1">
                {generateTimeSlots().map((time) => (
                  <div
                    key={time}
                    className={cn(
                      "px-4 py-2 hover:bg-maxmove-50 cursor-pointer",
                      selectedTime === time && "bg-maxmove-600 text-white hover:bg-maxmove-700"
                    )}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;