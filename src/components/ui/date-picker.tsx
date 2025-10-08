"use client"

import * as React from "react"
import { es } from "date-fns/locale"
import { format, parse } from "date-fns"
import { CalendarIcon } from 'lucide-react'
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export type DatePickerProps = {
    selected?: string | null
    onSelect?: (date: string | undefined) => void
    placeholder?: string
}

export function DatePicker({ selected, onSelect, placeholder = "Seleccionar fecha" }: DatePickerProps) {
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
        selected ? parse(selected, 'yyyy-MM-dd', new Date()) : undefined
    );

    const handleSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        if (onSelect) {
            if (date) {
                const formattedDate = format(date, 'yyyy-MM-dd');
                onSelect(formattedDate);
            } else {
                onSelect(undefined);
            }
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !selected && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP", { locale: es }) : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleSelect}
                    initialFocus
                    locale={es}
                    classNames={{
                        caption: "flex justify-center pt-1 relative items-center",
                        caption_label: "text-sm font-medium",
                        nav: "space-x-1 flex items-center",
                        nav_button: cn(
                            Button.defaultProps?.className,
                            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                        ),
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                        row: "flex w-full mt-2",
                        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: cn(
                            Button.defaultProps?.className,
                            "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
                        ),
                        day_selected:
                            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                        day_today: "bg-accent text-accent-foreground",
                        day_outside: "text-muted-foreground opacity-50",
                        day_disabled: "text-muted-foreground opacity-50",
                        day_range_middle:
                            "aria-selected:bg-accent aria-selected:text-accent-foreground",
                        day_hidden: "invisible",
                    }}
                    formatters={{
                        formatWeekdayName: (weekday) => {
                            const date = new Date(2023, 0, weekday.getDay())
                            return format(date, 'EEEEEE', { locale: es })
                        },
                        formatCaption: (date) => format(date, "LLLL yyyy", { locale: es }),
                    }}
                />
            </PopoverContent>
        </Popover>
    )
}