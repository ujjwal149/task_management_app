export default function CalendarSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">

        {/* Header */}
 

        <div>
          {/* Calendar title */}
          <div className="h-8 w-32 rounded-md bg-slate-200" />

          {/* Subtitle */}
          <div className="mt-2 h-4 w-64 rounded bg-slate-100" />
        </div>


        
        {/* Calendar Controls */}


        <div className="mt-6 flex items-center justify-between">

          {/* Today / Back / Next */}
          <div className="flex">

            <div className="h-8 w-16 rounded-l border border-slate-200 bg-slate-100" />

            <div className="h-8 w-14 border-y border-r border-slate-200 bg-slate-100" />

            <div className="h-8 w-14 rounded-r border-y border-r border-slate-200 bg-slate-100" />

          </div>


          {/* Month / Week / Day */}
          <div className="flex">

            <div className="h-8 w-16 rounded-l border border-slate-200 bg-slate-100" />

            <div className="h-8 w-16 border-y border-r border-slate-200 bg-slate-100" />

            <div className="h-8 w-14 rounded-r border-y border-r border-slate-200 bg-slate-100" />

          </div>

        </div>


        {/* Month Title */}


        <div className="mt-5 flex justify-center">
          <div className="h-5 w-28 rounded bg-slate-200" />
        </div>


        {/* Calendar */}


        <div className="mt-4 overflow-hidden border border-slate-200">

          {/* Weekday Header */}
          <div className="grid grid-cols-7">

            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="
                  flex
                  h-10
                  items-center
                  justify-center
                  border-b
                  border-r
                  border-slate-200
                  bg-slate-50
                  last:border-r-0
                "
              >
                <div className="h-3 w-8 rounded bg-slate-200" />
              </div>
            ))}

          </div>


          {/* Calendar Days */}
          <div className="grid grid-cols-7">

            {Array.from({ length: 42 }).map((_, index) => (
              <CalendarDaySkeleton
                key={index}
                index={index}
              />
            ))}

          </div>

        </div>

      </div>
    </div>
  );
}



/* Calendar Day */


function CalendarDaySkeleton({
  index,
}: {
  index: number;
}) {

  const isOutsideMonth =
    index < 6 || index >= 37;

  return (
    <div
      className={`
        relative
        min-h-[100px]
        border-b
        border-r
        border-slate-200
        p-2
        ${isOutsideMonth ? "bg-slate-50" : "bg-white"}
      `}
    >

      {/* Date number */}
      <div className="flex justify-end">
        <div
          className={`
            h-3
            w-5
            rounded
            ${
              isOutsideMonth
                ? "bg-slate-100"
                : "bg-slate-200"
            }
          `}
        />
      </div>


      {/* Event placeholders */}

      {index === 25 && (
        <div className="mt-8 space-y-1">
          <div className="h-6 w-full rounded-md bg-slate-100" />
          <div className="h-6 w-4/5 rounded-md bg-slate-100" />
        </div>
      )}

      {index === 26 && (
        <div className="mt-8">
          <div className="h-6 w-full rounded-md bg-slate-100" />
        </div>
      )}

      {index === 33 && (
        <div className="mt-8">
          <div className="h-6 w-3/4 rounded-md bg-slate-100" />
        </div>
      )}

    </div>
  );
}