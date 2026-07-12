type StatCardProps = {
  title: string;
  value: number;
  color: string;
};

export default function StatCard({
  title,
  value,
  color,
}: StatCardProps) {
  return (
     <div className="rounded-2xl border border-stone-200 bg-white shadow-sm p-6 
                    transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ">

      <p className="text-sm text-stone-500">
        {title}
      </p>

      <h2
        className={`mt-3 text-4xl font-bold ${color}`}
      >
        {value}
      </h2>

    </div>
  );
}