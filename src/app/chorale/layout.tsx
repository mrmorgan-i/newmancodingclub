import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newman University Chorale Videos | Newman Coding Club",
  description: "Watch performances by Deanne Zoggleman, hosted by Newman Coding Club as part of our campus collaboration initiatives.",
};

export default function ChoraleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}