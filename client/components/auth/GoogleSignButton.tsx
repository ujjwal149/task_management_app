"use client";

type GoogleSignButtonProps = {
  text?: string;  
}

export default function GoogleSignButton({
  text,
}:GoogleSignButtonProps) {
  return (
    <button
      type="button"
      onClick={() => {
        window.location.href =
          `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
      }}
      className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-stone-300 bg-white px-4 py-3 font-medium text-stone-700 transition hover:bg-stone-50"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        className="h-5 w-5"
      />

      {text}
    </button>
  );
}