import {
  CheckCircle2,
  FolderOpen,
  UserPlus,
  Clock3,
} from "lucide-react";

const activities = [
  {
    id: 1,
    icon: CheckCircle2,
    title: "Completed Task",
    description: "Finished Dashboard UI",
    time: "10 minutes ago",
    color: "text-green-600 bg-green-100",
  },
  {
    id: 2,
    icon: FolderOpen,
    title: "Created Project",
    description: "TaskFlow Version 2",
    time: "1 hour ago",
    color: "text-blue-600 bg-blue-100",
  },
  {
    id: 3,
    icon: UserPlus,
    title: "Invited Member",
    description: "John joined the workspace",
    time: "Yesterday",
    color: "text-purple-600 bg-purple-100",
  },
  {
    id: 4,
    icon: Clock3,
    title: "Task Updated",
    description: "Authentication module edited",
    time: "2 days ago",
    color: "text-amber-600 bg-amber-100",
  },
];

export default function RecentActivity() {
  return (
     <div className="rounded-2xl border border-stone-200 bg-white shadow-sm p-6 
                    transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ">

      <h2 className="mb-6 text-lg font-semibold text-stone-900">
        Recent Activity
      </h2>

      <div className="space-y-5">

        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.id}
              className="flex items-start gap-4"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full ${activity.color}`}
              >
                <Icon size={20} />
              </div>

              <div className="flex-1">

                <p className="font-semibold text-stone-900">
                  {activity.title}
                </p>

                <p className="text-sm text-stone-500">
                  {activity.description}
                </p>

              </div>

              <span className="text-xs text-stone-400">
                {activity.time}
              </span>

            </div>
          );
        })}

      </div>

    </div>
  );
}