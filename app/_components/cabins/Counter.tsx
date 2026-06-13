"use client";
import { useState } from "react";

export default function Counter({ users }: { users: { id: number; name: string; [key: string]: unknown }[] }) {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h3>{users.length} users</h3>
      <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
    </div>
  );
}
