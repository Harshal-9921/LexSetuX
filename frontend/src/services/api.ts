const resolveDefaultBaseUrl = () => {
  if (typeof window === 'undefined') {
    return 'http://127.0.0.1:8000';
  }

  const { protocol, hostname } = window.location;
  const safeHost = hostname === 'localhost' ? '127.0.0.1' : hostname;
  return `${protocol}//${safeHost}:8000`;
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || resolveDefaultBaseUrl();

export interface AuthUser {
  id: number;
  email: string;
  full_name: string;
  role: 'customer' | 'lawyer' | 'admin';
  is_active: boolean;
}

export interface CaseAnalysisRequest {
  description: string;
  category?: string;  // Optional - AI will auto-classify if not provided
  userId?: string | null;
  documents?: string[];
  user_role?: string;
}

export interface CaseAnalysisResponse {
  case_id?: number;
  user_role: string;
  confidence_score: number;
  
  // Customer fields
  case_category?: string;
  simplified_explanation?: string;
  applicable_rights?: string[];
  recommendations?: string[];
  matched_lawyers?: Array<{
    id: number;
    name: string;
    specialization: string[];
    experience_years?: number;
    location?: string;
    rating: number;
    hourly_rate?: number;
    match_score: number;
    match_reasons: string[];
  }>;
  
  // Lawyer fields
  case_classification?: {
    domain: string;
    sub_domain: string;
    confidence: number;
    keywords_identified: number;
    classification_method: string;
  };
  summary?: string;
  past_cases?: Array<{
    case_title: string;
    court: string;
    year: string;
    citation: string;
    outcome: string;
    summary: string;
    key_points?: string[];
    relevance_score: number;
  }>;
  statutes?: Array<{
    section: string;
    title: string;
    description: string;
    relevance: string;
  }>;
  key_arguments?: string[];
  risk_assessment?: string[];
};

class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.token = null;

    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('auth_token');
      if (savedToken) {
        this.token = savedToken;
      }
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        mode: 'cors',
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const error = await response.json();
          errorMessage = error.detail || error.message || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(
          `Cannot connect to backend server at ${this.baseUrl}. ` +
          `Please make sure the FastAPI server is running on port 8000. ` +
          `Error: ${error.message}`
        );
      }
      throw error;
    }
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await this.request<{ access_token: string; token_type: string }>(
      '/api/auth/login/json',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
    this.setToken(response.access_token);
    return response;
  }

  async getCurrentUser(): Promise<AuthUser> {
    return this.request<AuthUser>('/api/auth/me', {
      method: 'GET',
    });
  }

  async register(
    email: string,
    password: string,
    fullName: string,
    role: 'customer' | 'lawyer' | 'admin' = 'customer'
  ) {
    return this.request<{ id: number; email: string; full_name: string; role: string }>(
      '/api/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ email, password, full_name: fullName, role }),
      }
    );
  }

  // Case Analysis
  async analyzeCase(request: CaseAnalysisRequest): Promise<CaseAnalysisResponse> {
    return this.request<CaseAnalysisResponse>('/api/cases/analyze', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getMyCases() {
    return this.request('/api/cases/my-cases', {
      method: 'GET',
    });
  }

  async getCase(caseId: number) {
    return this.request(`/api/cases/${caseId}`, {
      method: 'GET',
    });
  }

  // Lawyers
  async getLawyers(category?: string, location?: string) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (location) params.append('location', location);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/api/lawyers${query}`, {
      method: 'GET',
    });
  }

  async matchLawyers(category: string, description: string, location?: string) {
    const params = new URLSearchParams({ category, description });
    if (location) params.append('location', location);
    return this.request(`/api/lawyers/match?${params.toString()}`, {
      method: 'GET',
    });
  }

  async getLawyerProfile() {
    return this.request('/api/lawyers/me/profile', {
      method: 'GET',
    });
  }

  // Bookings
  async getMyBookings(filter?: string) {
    const query = filter ? `?status=${filter}` : '';
    return this.request(`/api/bookings/my-bookings${query}`, {
      method: 'GET',
    });
  }

  async createBooking(caseId: number, lawyerId: number, message?: string) {
    return this.request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        case_id: caseId,
        lawyer_id: lawyerId,
        message,
      }),
    });
  }

  async updateBookingStatus(
    bookingId: number,
    status: string,
    notes?: string,
    scheduledDate?: string
  ) {
    return this.request(`/api/bookings/${bookingId}`, {
      method: 'PUT',
      body: JSON.stringify({
        status,
        lawyer_notes: notes,
        scheduled_date: scheduledDate,
      }),
    });
  }

  async getBooking(bookingId: number) {
    return this.request(`/api/bookings/${bookingId}`, {
      method: 'GET',
    });
  }

  async deleteBooking(bookingId: number) {
    return this.request(`/api/bookings/${bookingId}`, {
      method: 'DELETE',
    });
  }

  // Contact
  async sendContactMessage(data: { name: string; email: string; subject: string; message: string }) {
    return this.request('/api/contact/send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Precedents
  async searchPrecedents(query: string, limit: number = 100, yearFrom?: number, yearTo?: number): Promise<any[]> {
    const params = new URLSearchParams({ q: query, limit: limit.toString() });
    if (yearFrom) params.append('year_from', yearFrom.toString());
    if (yearTo) params.append('year_to', yearTo.toString());
    return this.request(`/api/precedents/search?${params}`, { method: 'GET' });
  }

  async getPrecedentsByYear(year: number, limit: number = 200): Promise<any[]> {
    return this.request(`/api/precedents/by-year/${year}?limit=${limit}`, { method: 'GET' });
  }

  async getPrecedentsBySection(section: string, limit: number = 100): Promise<any[]> {
    return this.request(`/api/precedents/by-section/${section}?limit=${limit}`, { method: 'GET' });
  }

  async listPrecedents(skip: number = 0, limit: number = 500): Promise<any[]> {
    return this.request(`/api/precedents/list?skip=${skip}&limit=${limit}`, { method: 'GET' });
  }

  async getPrecedentCount(): Promise<{ total: number; status: string }> {
    return this.request('/api/precedents/count', { method: 'GET' });
  }

  async getRandomPrecedents(limit: number = 20): Promise<any[]> {
    return this.request(`/api/precedents/random?limit=${limit}`, { method: 'GET' });
  }

  async getPrecedentStats(): Promise<any> {
    return this.request('/api/precedents/statistics', { method: 'GET' });
  }

  async getPrecedent(id: number): Promise<any> {
    return this.request(`/api/precedents/${id}`, { method: 'GET' });
  }

  async getSimilarPrecedents(caseName: string, limit: number = 10): Promise<any[]> {
    return this.request(`/api/precedents/similar?case_name=${encodeURIComponent(caseName)}&limit=${limit}`, { method: 'GET' });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
