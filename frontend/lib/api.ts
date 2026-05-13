import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

async function getHeaders(): Promise<Record<string, string>> {
  const session = await getSession();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (session?.user && (session.user as any).idToken) {
    headers["Authorization"] = `Bearer ${(session.user as any).idToken}`;
  }

  return headers;
}

// Problems API
export const problemsApi = {
  getAll: async () => {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/problems`, {
        method: "GET",
        mode: "cors",
        headers,
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
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/problems/${id}`, {
        method: "GET",
        mode: "cors",
        headers,
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
    link?: string;
    notes?: string;
    listId?: number;
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
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/goals`, {
        method: "GET",
        mode: "cors",
        headers,
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
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/goals/${id}`, {
        method: "GET",
        mode: "cors",
        headers,
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

  updateCompletion: async (id: number, completed: boolean) => {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/goals/${id}/complete`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update goal");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating goal:", error);
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

export const listsApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/lists`, {
        method: 'GET',
        mode: 'cors',
      });

      if (!response.ok) throw new Error('Failed to fetch lists');
      return await response.json();
    } catch (error) {
      console.error('Error fetching lists:', error);
      return [];
    }
  },

  create: async (list: { name: string }) => {
    try {
      const response = await fetch(`${API_URL}/lists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(list),
      });

      if (response.status === 409 || response.ok) {
        return await response.json();
      }

      const error = await response.json();
      throw new Error(error.error || 'Failed to create list');
    } catch (error) {
      console.error('Error creating list:', error);
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
