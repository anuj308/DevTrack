import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function getHeaders(): Promise<Record<string, string>> {
  const session = await getSession();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (session?.user) {
    // For NextAuth JWT, we'd need to extract the token from the session
    // This is a simplified version - adjust based on your NextAuth setup
    headers["Authorization"] = `Bearer ${session.user.email}`;
  }

  return headers;
}

// Problems API
export const problemsApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/problems`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch problems");
      return await response.json();
    } catch (error) {
      console.error("Error fetching problems:", error);
      return [];
    }
  },

  getOne: async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/problems/${id}`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch problem");
      return await response.json();
    } catch (error) {
      console.error("Error fetching problem:", error);
      return null;
    }
  },

  create: async (problem: {
    title: string;
    difficulty: string;
    topics: string;
  }) => {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/problems`, {
        method: "POST",
        headers,
        body: JSON.stringify(problem),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create problem");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating problem:", error);
      throw error;
    }
  },

  delete: async (id: number) => {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/problems/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete problem");
      }

      return true;
    } catch (error) {
      console.error("Error deleting problem:", error);
      throw error;
    }
  },
};

// Goals API
export const goalsApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/goals`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch goals");
      return await response.json();
    } catch (error) {
      console.error("Error fetching goals:", error);
      return [];
    }
  },

  getOne: async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/goals/${id}`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch goal");
      return await response.json();
    } catch (error) {
      console.error("Error fetching goal:", error);
      return null;
    }
  },

  create: async (goal: { title: string; dueDate: string }) => {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/goals`, {
        method: "POST",
        headers,
        body: JSON.stringify(goal),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create goal");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating goal:", error);
      throw error;
    }
  },

  delete: async (id: number) => {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/goals/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete goal");
      }

      return true;
    } catch (error) {
      console.error("Error deleting goal:", error);
      throw error;
    }
  },
};

// Users API
export const usersApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      if (!response.ok) throw new Error("Failed to fetch users");
      return await response.json();
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  },

  getOne: async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`);
      if (!response.ok) throw new Error("Failed to fetch user");
      return await response.json();
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  },

  create: async (user: { email: string; name: string }) => {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers,
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },
};
