import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ClearWater Videos | Newman Coding Club",
  description: "Watch performances by Deanne Zoggleman, hosted by Newman Coding Club as part of our campus collaboration initiatives.",
};

export default function ClearWaterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}