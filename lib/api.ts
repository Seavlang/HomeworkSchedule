import { Homework, ConflictWarning } from "@/types";

const API_BASE_URL = "/api";

export async function fetchHomeworks(): Promise<Homework[]> {
  const response = await fetch(`${API_BASE_URL}/homeworks`);
  if (!response.ok) {
    let errorMessage = `Failed to fetch homeworks (Status: ${response.status})`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (e) {
      // If JSON parsing fails, use status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

export async function createHomework(homework: Omit<Homework, "id">): Promise<Homework> {
  const response = await fetch(`${API_BASE_URL}/homeworks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(homework),
  });
  
  if (!response.ok) {
    let errorMessage = `Failed to create homework (Status: ${response.status})`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (e) {
      // If JSON parsing fails, use status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  
  return await response.json();
}

export async function updateHomework(id: string, homework: Partial<Homework>): Promise<Homework> {
  const response = await fetch(`${API_BASE_URL}/homeworks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(homework),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update homework");
  }
  return response.json();
}

export async function deleteHomework(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/homeworks/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete homework");
  }
}

export async function checkConflicts(
  homework: Omit<Homework, "id">,
  excludeId?: string
): Promise<ConflictWarning[]> {
  const response = await fetch(`${API_BASE_URL}/homeworks/check-conflicts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...homework, id: excludeId }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to check conflicts");
  }
  return response.json();
}

