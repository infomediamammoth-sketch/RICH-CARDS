const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('richcards_token');
  }

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}/${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  // Auth API
  async login(email: string, password: string) {
    const data = await request<any>('auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem('richcards_token', data.accessToken);
      localStorage.setItem('richcards_refresh_token', data.refreshToken);
      localStorage.setItem('richcards_user', JSON.stringify(data.user));
    }
    return data;
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('richcards_token');
      localStorage.removeItem('richcards_refresh_token');
      localStorage.removeItem('richcards_user');
    }
  },

  getCurrentUser() {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('richcards_user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  // Templates API
  async getTemplates(query: {
    category?: string;
    format?: string;
    tag?: string;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
  } = {}) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        params.append(key, String(val));
      }
    });
    return request<any>(`templates?${params.toString()}`);
  },

  async getTemplate(idOrSlug: string) {
    return request<any>(`templates/${idOrSlug}`);
  },

  async getRelatedTemplates(id: string, limit = 4) {
    return request<any>(`templates/${id}/related?limit=${limit}`);
  },

  async createTemplate(data: any) {
    return request<any>('templates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateTemplate(id: string, data: any) {
    return request<any>(`templates/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteTemplate(id: string) {
    return request<any>(`templates/${id}`, {
      method: 'DELETE',
    });
  },

  // Categories API
  async getCategories() {
    return request<any[]>('categories');
  },

  async getCategory(idOrSlug: string) {
    return request<any>(`categories/${idOrSlug}`);
  },

  async createCategory(data: any) {
    return request<any>('categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCategory(id: string, data: any) {
    return request<any>(`categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteCategory(id: string) {
    return request<any>(`categories/${id}`, {
      method: 'DELETE',
    });
  },

  // Tags API
  async getTags() {
    return request<any[]>('tags');
  },

  async createTag(data: any) {
    return request<any>('tags', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteTag(id: string) {
    return request<any>(`tags/${id}`, {
      method: 'DELETE',
    });
  },

  // Leads CRM API
  async createLead(data: {
    name: string;
    phone: string;
    email?: string;
    templateId?: string;
    source?: string;
    notes?: string;
  }) {
    return request<any>('leads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getLeads(status?: string) {
    const param = status ? `?status=${status}` : '';
    return request<any[]>(`leads${param}`);
  },

  async updateLeadStatus(id: string, status?: string, notes?: string) {
    return request<any>(`leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  },

  async deleteLead(id: string) {
    return request<any>(`leads/${id}`, {
      method: 'DELETE',
    });
  },

  // Testimonials API
  async getTestimonials() {
    return request<any[]>('testimonials');
  },

  async getFeaturedTestimonials() {
    return request<any[]>('testimonials/featured');
  },

  async getAdminTestimonials() {
    return request<any[]>('testimonials/admin');
  },

  async submitTestimonial(data: any) {
    return request<any>('testimonials', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateTestimonial(id: string, data: any) {
    return request<any>(`testimonials/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async approveTestimonial(id: string) {
    return request<any>(`testimonials/${id}/approve`, {
      method: 'PATCH',
    });
  },

  async deleteTestimonial(id: string) {
    return request<any>(`testimonials/${id}`, {
      method: 'DELETE',
    });
  },

  // Hero Banners API
  async getBanners() {
    return request<any[]>('banners');
  },

  async getAdminBanners() {
    return request<any[]>('banners/admin');
  },

  async createBanner(data: any) {
    return request<any>('banners', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateBanner(id: string, data: any) {
    return request<any>(`banners/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteBanner(id: string) {
    return request<any>(`banners/${id}`, {
      method: 'DELETE',
    });
  },

  // Watermarks API
  async getWatermarks() {
    return request<any[]>('watermarks');
  },

  async createWatermark(data: any) {
    return request<any>('watermarks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateWatermark(id: string, data: any) {
    return request<any>(`watermarks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteWatermark(id: string) {
    return request<any>(`watermarks/${id}`, {
      method: 'DELETE',
    });
  },

  // Media upload API
  async uploadMedia(file: File, folder = 'general', applyWatermark = false, watermarkId?: string) {
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('richcards_token') || '';
    }

    const formData = new FormData();
    formData.append('file', file);

    const query = new URLSearchParams({ folder });
    if (applyWatermark) query.append('watermark', 'true');
    if (watermarkId) query.append('watermarkId', watermarkId);

    const response = await fetch(`${API_URL}/media/upload?${query.toString()}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Media upload failed`);
    }

    return response.json();
  },

  async getMedia(folder?: string) {
    const param = folder ? `?folder=${folder}` : '';
    return request<any[]>(`media${param}`);
  },

  async deleteMedia(id: string) {
    return request<any>(`media/${id}`, {
      method: 'DELETE',
    });
  },

  // Settings API
  async getSettings() {
    return request<any[]>('settings');
  },

  async updateSettingsBulk(settings: Record<string, string>) {
    return request<any>('settings/bulk', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
  },

  // Analytics API
  async getDashboardAnalytics() {
    return request<any>('analytics/dashboard');
  },

  async trackPageView(url: string) {
    return fetch(`${API_URL}/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    }).catch(() => {}); // Silent catch to prevent blockages on analytic errors
  },

  // Blogs API
  async getBlogs(categoryId?: string) {
    const param = categoryId ? `?categoryId=${categoryId}` : '';
    return request<any[]>(`blogs${param}`);
  },

  async getBlog(idOrSlug: string) {
    return request<any>(`blogs/${idOrSlug}`);
  },

  async createBlog(data: any) {
    return request<any>('blogs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateBlog(id: string, data: any) {
    return request<any>(`blogs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteBlog(id: string) {
    return request<any>(`blogs/${id}`, {
      method: 'DELETE',
    });
  },

  // Blog Categories API
  async getBlogCategories() {
    return request<any[]>('blog-categories');
  },

  async createBlogCategory(data: any) {
    return request<any>('blog-categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteBlogCategory(id: string) {
    return request<any>(`blog-categories/${id}`, {
      method: 'DELETE',
    });
  },
};
