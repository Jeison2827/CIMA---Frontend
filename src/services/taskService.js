import axios from 'axios';

const API_URL = 'http://localhost:3000/developer/tasks';

export const taskService = {
  async createTask(task) {
    const response = await axios.post(API_URL, task);
    return response.data;
  },

  async updateTask(id, task) {
    const response = await axios.put(`${API_URL}/${id}`, task);
    return response.data;
  },

  async getTaskById(id) {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  async deleteTask(id) {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },

  async listTasks(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`${API_URL}?${params}`);
    return response.data;
  }
};