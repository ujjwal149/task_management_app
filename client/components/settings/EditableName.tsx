"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type Props = {
  name: string;
};

export default function EditableName({
  name,
}: Props) {

  const [editing, setEditing] = useState(false);

  const [value, setValue] = useState(name);

  return (

    <div>

      <div className="flex items-center justify-between">

        <p className="text-sm font-medium text-stone-500">
          Name
        </p>

        {!editing && (

          <button
            onClick={() => setEditing(true)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Edit
          </button>

        )}

      </div>

      {!editing ? (

        <p className="mt-2 text-lg text-stone-900">
          {value}
        </p>

      ) : (

        <div className="mt-4 space-y-4">

          <Input
            value={value}
            onChange={(e) =>
              setValue(e.target.value)
            }
          />

          <div className="flex gap-3">

            <Button
              variant="secondary"
              onClick={() => {

                setValue(name);

                setEditing(false);

              }}
            >
              Cancel
            </Button>

            <Button>
              Save
            </Button>

          </div>

        </div>

      )}

    </div>
  );
}