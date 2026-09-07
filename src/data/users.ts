import { User } from "@/types";

export const users: User[] = [
  {
    id: "user-1",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "ADVISOR",
  },
  {
    id: "user-2",
    name: "Sarah Mitchell",
    email: "sarah.mitchell@example.com",
    role: "ADVISOR",
  },
  {
    id: "user-3",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    role: "ADVISOR",
  },
  {
    id: "officer-1",
    name: "Dr. Emily Roberts",
    email: "emily.roberts@compliance.com",
    role: "OFFICER",
  },
  {
    id: "officer-2",
    name: "James Wilson",
    email: "james.wilson@compliance.com",
    role: "OFFICER",
  },
];

export const advisors = users.filter((u) => u.role === "ADVISOR");
export const officers = users.filter((u) => u.role === "OFFICER");
