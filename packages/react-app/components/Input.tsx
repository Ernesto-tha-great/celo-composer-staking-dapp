import React from "react";

interface InputProps {
  placeholder: string;
  name: string;
  type: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
}

export const Input = ({
  placeholder,
  name,
  type,
  handleChange,
}: InputProps) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-lg bg-transparent -mx-1 border-2 text-xl text-bold  py-2  text-white"
  />
);
