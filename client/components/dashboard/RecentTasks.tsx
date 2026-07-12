type Task = {
  id: number;
  title: string;
  status: "Completed" | "Pending" | "In Progress";
};

const tasks: Task[] = [
  {
    id: 1,
    title: "Design Dashboard UI",
    status: "Completed",
  },
  {
    id: 2,
    title: "Build Authentication",
    status: "In Progress",
  },
  {
    id: 3,
    title: "Setup Prisma",
    status: "Pending",
  },
];

export default function RecentTasks() {
  return (
     <div className="rounded-2xl border border-stone-200 bg-white shadow-sm p-6 
                    transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ">

      <h2 className="mb-5 text-lg font-semibold text-stone-900">
        Recent Tasks
      </h2>

      <div className="space-y-4">

        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between rounded-xl border border-stone-100 p-4"
          >
            <span className="font-medium text-stone-700">
              {task.title}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold
              ${
                task.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : task.status === "Pending"
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {task.status}
            </span>
          </div>
        ))}

      </div>

    </div>
  );
}