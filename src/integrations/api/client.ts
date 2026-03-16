const API_BASE_URL = 'http://localhost:3001/api';

const getToken = () => localStorage.getItem('token');

const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = getToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  },

  auth: {
    login: (email: string, password: string) =>
      apiClient.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    register: (email: string, password: string, fullName: string, role: string, departmentId?: string | null, batchYear?: number | null) =>
      apiClient.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, fullName, role, departmentId, batchYear }),
      }),

    logout: () =>
      apiClient.request('/auth/logout', {
        method: 'POST',
      }),

    me: () => apiClient.request('/auth/me'),
  },

  profiles: {
    get: (userId: string) => apiClient.request(`/profiles/${userId}`),
    update: (userId: string, data: any) =>
      apiClient.request(`/profiles/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  departments: {
    list: () => apiClient.request('/departments'),
    create: (data: { code: string; name: string }) => apiClient.request('/departments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: { code?: string; name?: string; status?: string }) => apiClient.request(`/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  },

  programs: {
    list: () => apiClient.request('/programs'),
  },
  blocks: {
    list: () => apiClient.request('/blocks'),
  },

  notices: {
    list: (params?: Record<string, string>) => {
      const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
      return apiClient.request(`/notices${query}`);
    },
    get: (id: number) => apiClient.request(`/notices/${id}`),
    create: (data: any) =>
      apiClient.request('/notices', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: any) =>
      apiClient.request(`/notices/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      apiClient.request(`/notices/${id}`, {
        method: 'DELETE',
      }),
  },

  noticeReads: {
    markAsRead: (noticeId: number) =>
      apiClient.request('/notice-reads', {
        method: 'POST',
        body: JSON.stringify({ notice_id: noticeId }),
      }),
    getBulk: (noticeIds: number[]) =>
      apiClient.request(`/notice-reads/bulk?notice_ids=${noticeIds.join(',')}`),
  },

  students: {
    enrollment: (studentId: string) =>
      apiClient.request(`/students/${studentId}/enrollment`),
    enroll: (data: { student_id: string; block_id: number; semester: string; school_year: string }) =>
      apiClient.request('/students/enroll', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  notifications: {
    list: (params?: Record<string, string>) => {
      const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
      return apiClient.request(`/notifications${query}`);
    },
  },

  activityLogs: {
    list: (params?: Record<string, string>) => {
      const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
      return apiClient.request(`/activity-logs${query}`);
    },
  },

  users: {
    list: () => apiClient.request('/users'),
    update: (userId: string, data: any) =>
      apiClient.request(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  stats: {
    get: () => apiClient.request('/stats'),
    analytics: () => apiClient.request('/stats/analytics'),
  },
};

export default apiClient;


