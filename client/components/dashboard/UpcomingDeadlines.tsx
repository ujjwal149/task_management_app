import { CalendarClock } from "lucide-react";

type Deadline = {
  id: number;
  title: string;
  date: string;
};

const deadlines: Deadline[] = [
  {
    id: 1,
    title: "Submit Project Proposal",
    date: "Tomorrow",
  },
  {
    id: 2,
    title: "Sprint Review Meeting",
    date: "18 Jul",
  },
  {
    id: 3,
    title: "Deploy Version 1.0",
    date: "24 Jul",
  },
];

export default function UpcomingDeadlines() {
  return (
     <div className="rounded-2xl border border-stone-200 bg-white shadow-sm p-6 
                    transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ">

      <div className="mb-5 flex items-center gap-2">

        <CalendarClock
          size={20}
          className="text-blue-600"
        />

        <h2 className="text-lg font-semibold text-stone-900">
          Upcoming Deadlines
        </h2>

      </div>

      <div className="space-y-4">

        {deadlines.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-stone-100 p-4"
          >

            <p className="font-medium text-stone-800">
              {item.title}
            </p>

            <p className="mt-2 text-sm text-stone-500">
              {item.date}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}