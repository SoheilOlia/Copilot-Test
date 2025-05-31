import { Project } from "./projects";
import { Automation } from "./automations";
import { projects } from "./projects";

export interface User {
  id: string;
  name: string;
  email: string;
  projects?: Project[];
  automations?: Automation[];
}

// Helper function to generate random email
const generateEmail = (name: string) => {
  const [firstName, lastName] = name.toLowerCase().split(" ");
  return `${firstName}.${lastName}@example.com`;
};

// Helper function to generate random project assignments
const assignProjects = (userId: string): Project[] => {
  const userProjects: Project[] = [];
  const projectIds = ["proj_1", "proj_2", "proj_3", "proj_4"];

  // Randomly assign 0-3 projects to each user
  const numProjects = Math.floor(Math.random() * 4);
  if (numProjects === 0) return [];

  const shuffledProjects = [...projectIds].sort(() => Math.random() - 0.5);
  for (let i = 0; i < numProjects; i++) {
    const project = projects.find((p) => p.id === shuffledProjects[i]);
    if (project) userProjects.push(project);
  }

  return userProjects;
};

export const users: User[] = [
  {
    id: "user_1",
    name: "Aisha Patel",
    email: generateEmail("Aisha Patel"),
    projects: assignProjects("user_1"),
  },
  {
    id: "user_2",
    name: "Carlos Rodriguez",
    email: generateEmail("Carlos Rodriguez"),
    projects: assignProjects("user_2"),
  },
  {
    id: "user_3",
    name: "Yuki Tanaka",
    email: generateEmail("Yuki Tanaka"),
    projects: assignProjects("user_3"),
  },
  {
    id: "user_4",
    name: "Fatima Al-Mansouri",
    email: generateEmail("Fatima Al-Mansouri"),
    projects: assignProjects("user_4"),
  },
  {
    id: "user_5",
    name: "Kwame Osei",
    email: generateEmail("Kwame Osei"),
    projects: assignProjects("user_5"),
  },
  {
    id: "user_6",
    name: "Sofia Kowalski",
    email: generateEmail("Sofia Kowalski"),
    projects: assignProjects("user_6"),
  },
  {
    id: "user_7",
    name: "Rajiv Sharma",
    email: generateEmail("Rajiv Sharma"),
    projects: assignProjects("user_7"),
  },
  {
    id: "user_8",
    name: "Mei Lin",
    email: generateEmail("Mei Lin"),
    projects: assignProjects("user_8"),
  },
  {
    id: "user_9",
    name: "Omar Hassan",
    email: generateEmail("Omar Hassan"),
    projects: assignProjects("user_9"),
  },
  {
    id: "user_10",
    name: "Elena Popov",
    email: generateEmail("Elena Popov"),
    projects: assignProjects("user_10"),
  },
  {
    id: "user_11",
    name: "Javier Morales",
    email: generateEmail("Javier Morales"),
    projects: assignProjects("user_11"),
  },
  {
    id: "user_12",
    name: "Priya Gupta",
    email: generateEmail("Priya Gupta"),
    projects: assignProjects("user_12"),
  },
  {
    id: "user_13",
    name: "Hiroshi Yamamoto",
    email: generateEmail("Hiroshi Yamamoto"),
    projects: assignProjects("user_13"),
  },
  {
    id: "user_14",
    name: "Zara Khan",
    email: generateEmail("Zara Khan"),
    projects: assignProjects("user_14"),
  },
  {
    id: "user_15",
    name: "Marcus Johnson",
    email: generateEmail("Marcus Johnson"),
    projects: assignProjects("user_15"),
  },
  {
    id: "user_16",
    name: "Anastasia Petrov",
    email: generateEmail("Anastasia Petrov"),
    projects: assignProjects("user_16"),
  },
  {
    id: "user_17",
    name: "Lucas Silva",
    email: generateEmail("Lucas Silva"),
    projects: assignProjects("user_17"),
  },
  {
    id: "user_18",
    name: "Nia Williams",
    email: generateEmail("Nia Williams"),
    projects: assignProjects("user_18"),
  },
  {
    id: "user_19",
    name: "Ahmed El-Sayed",
    email: generateEmail("Ahmed El-Sayed"),
    projects: assignProjects("user_19"),
  },
  {
    id: "user_20",
    name: "Isabella Santos",
    email: generateEmail("Isabella Santos"),
    projects: assignProjects("user_20"),
  },
  {
    id: "user_21",
    name: "Wei Chen",
    email: generateEmail("Wei Chen"),
    projects: assignProjects("user_21"),
  },
  {
    id: "user_22",
    name: "Amina Diallo",
    email: generateEmail("Amina Diallo"),
    projects: assignProjects("user_22"),
  },
  {
    id: "user_23",
    name: "Gabriel Martinez",
    email: generateEmail("Gabriel Martinez"),
    projects: assignProjects("user_23"),
  },
  {
    id: "user_24",
    name: "Sakura Nakamura",
    email: generateEmail("Sakura Nakamura"),
    projects: assignProjects("user_24"),
  },
  {
    id: "user_25",
    name: "Malik Thompson",
    email: generateEmail("Malik Thompson"),
    projects: assignProjects("user_25"),
  },
];
