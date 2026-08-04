"use client"

import {Plus} from "lucide-react";
import { useUIStore } from "@/store/ui.store";

export default function FloatingActionButton(){
    const { openCreateTaskModal }  = useUIStore();


    return(
        <button
            onClick={openCreateTaskModal}
            className=" fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center 
                rounded-full bg-blue-600 text-white shadow-xl transition hover:bg-blue-700 md:hidden "
        >
            <Plus size={26} />
        </button>
    )
}