"use client";

import { useEffect, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import CalendarSkeleton from "@/components/loading/CalendarSkeleton";


import { useUIStore } from "@/store/ui.store";

import "react-big-calendar/lib/css/react-big-calendar.css";

import { useTaskStore } from "@/store/task.store";

const localizer = momentLocalizer(moment);

export default function CalendarView() {

    const { openEditTaskModal } = useUIStore();
  const { tasks, fetchTasks, loading } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const events = useMemo(() => {
    return tasks
      .filter((task) => task.dueDate)
      .map((task) => ({
        id: task.id,
        title: task.title,
        start: new Date(task.dueDate!),
        end: new Date(task.dueDate!),
        resource: task,
      }));
  }, [tasks]);

  if (loading) {
    return <CalendarSkeleton />;
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6">
      <h1 className="text-3xl font-bold text-stone-900">
        Calendar
      </h1>

      <p className="mt-1 text-stone-500">
        View all scheduled tasks by due date.
      </p>
    </div>

    <div className="overflow-x-auto">
    <div className="min-w-[900px] h-[750px]">
    <Calendar
    onSelectEvent={(event:any) => {
      openEditTaskModal(event.resource);
    }}
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      views={["month", "week", "day"]}
      defaultView="month"
      popup
      eventPropGetter={(event:any) => {
        const task = event.resource;

        let background = "#2563EB";

        switch (task.priority) {
          case "HIGH":
            background = "#DC2626";
            break;
        
          case "MEDIUM":
            background = "#D97706";
            break;
        
              case "LOW":
                background = "#16A34A";
                break;
            }
    
        return {
          style: {
            backgroundColor: background,
            border: "none",
            borderRadius: "8px",
            color: "#fff",
            padding: "2px 6px",
          },
        };
      }}
    />
      </div>
      </div>
    </div>
  );
}