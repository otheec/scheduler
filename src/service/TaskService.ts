const API_URL = process.env.REACT_APP_API_URL;

export interface Task {
  name: string;
  row: number;
  column: number;
  width: number;
  draggable: boolean;
}

export class TaskService {
  static async getTasks(): Promise<Task[]> {
    try {
        const response = await fetch(`${API_URL}/getScheduledJobs`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }
}
