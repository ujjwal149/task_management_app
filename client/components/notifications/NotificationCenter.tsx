"use client";

import {useState} from "react";

import NotificationBell from "./NotificationBell";
import NotificationDropdown from "./NotificationDropdown";
import { div } from "framer-motion/client";

export default function NotificationCenter(){

    const [open, setOpen] = 
        useState(false);


    return(
        <div className="relative">
            <NotificationBell
                onClick={() => 
                    setOpen((previous) => !previous)
                }
            />

            {open && (
                <NotificationDropdown />
            )}

        </div>
    )
}