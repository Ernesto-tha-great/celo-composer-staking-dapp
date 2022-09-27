import * as React from "react";
import Meta from "../meta/Meta";
import Footer from "./Footer";
import { Header } from "./Header";

interface Props {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function AppLayout({ title, description, children }: Props) {
  return (
    <div className="flex-1 h-full bg-gray-800">
      <Header />
      <Meta title={title} description={description} />
      {children}
    </div>
  );
}
