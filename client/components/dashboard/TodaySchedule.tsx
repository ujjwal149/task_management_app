import { Clock3 } from "lucide-react";

const schedule = [
  {
    id: 1,
    time: "09:00 AM",
    title: "Daily Standup",
    type: "Meeting",
  },
  {
    id: 2,
    time: "11:30 AM",
    title: "Dashboard UI Review",
    type: "Task",
  },
  {
    id: 3,
    time: "03:00 PM",
    title: "Sprint Planning",
    type: "Meeting",
  },
  {
    id: 4,
    time: "05:30 PM",
    title: "Deploy API",
    type: "Deadline",
  },
];

export default function TodaySchedule() {
  return (
     <div className="rounded-2xl border border-stone-200 bg-white shadow-sm p-6 
                    transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ">

      <h2 className="mb-6 text-lg font-semibold text-stone-900">
        Today's Schedule
      </h2>

      <div className="space-y-5">

        {schedule.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-4"
          >
            <div className="rounded-full bg-blue-100 p-3">
              <Clock3
                size={18}
                className="text-blue-600"
              />
            </div>

            <div className="flex-1">

              <p className="font-semibold text-stone-900">
                {item.title}
              </p>

              <p className="text-sm text-stone-500">
                {item.type}
              </p>

            </div>

            <span className="text-sm font-medium text-stone-500">
              {item.time}
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}