import { Subject } from "../types";

export const MOCK_SUBJECTS: Subject[] = [
    {
        id: 1,
        name: "Introduction to Computer Science",
        code: "CS101",
        department: "CS",
        description: "An introductory course on computer science concepts and programming.",
        createdAt: new Date().toISOString(),
    },
    {
        id: 2,
        name: "Calculus I",
        code: "MATH101",
        department: "Math",
        description: "A first course in calculus, covering limits, derivatives, and integrals.",
        createdAt: new Date().toISOString(),
    },
    {
        id: 3,
        name: "English Literature",
        code: "ENG101",
        department: "English",
        description: "A study of major works of English literature from various periods.",
        createdAt: new Date().toISOString(),
    }
];
