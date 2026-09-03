const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching health status:', error);
    throw error;
  }
};

export const getDisputes = async () => {
  const response = await fetch(`${API_BASE_URL}/api/disputes`);
  if (!response.ok) throw new Error('Failed to fetch disputes');
  return await response.json();
};

export const getDashboardData = async () => {
  const response = await fetch(`${API_BASE_URL}/api/worker/dashboard`);
  if (!response.ok) throw new Error('Failed to fetch dashboard data');
  return await response.json();
};

export const getDispute = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/api/disputes/${id}`);
  if (!response.ok) throw new Error('Failed to fetch dispute');
  return await response.json();
};

export const createDispute = async (data: any) => {
  const response = await fetch(`${API_BASE_URL}/api/disputes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create dispute');
  return await response.json();
};

export const verifyDispute = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/api/disputes/${id}/verify`, {
    method: 'POST'
  });
  if (!response.ok) throw new Error('Failed to verify dispute');
  return await response.json();
};

export const resolveDispute = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/api/disputes/${id}/resolve`, {
    method: 'POST'
  });
  if (!response.ok) throw new Error('Failed to resolve dispute');
  return await response.json();
};
