"use client";

import DatePicker from "react-datepicker";

type Props = {
  value: Date | null;
  onChange: (date: Date | null) => void;
};

export default function DateTimePicker({
  value,
  onChange,
}: Props) {
  return (
    <DatePicker
      selected={value}
      onChange={onChange}
      showTimeSelect
      timeIntervals={15}
      dateFormat="PPP p"
      placeholderText="Select due date"
      className="w-full rounded-xl border border-stone-300 px-4 py-2 outline-none focus:border-blue-500"
      popperPlacement="bottom-start"
    />
  );
}