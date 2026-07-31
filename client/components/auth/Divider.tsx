"use client"

export default function Divider(){
    return(

        <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-stone-200"></div>

            <span className="mx-5 text-sm font-medium text-stone-400">
              or
            </span>

            <div className="flex-1 border-t border-stone-200"></div>
          </div>

    )
}
