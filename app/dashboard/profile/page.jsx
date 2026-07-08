import React from "react";
import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="p-10 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-8 self-start">Profile settings</h2>
      <UserProfile routing="hash" />
    </div>
  );
}