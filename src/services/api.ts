const API_BASE_URL = 'http://localhost:8080/api/v1';

interface LanguagesResponse {
  languages: Array<{
    id: number;
    code: string;
    name: string;
    native_name: string;
    is_active: boolean;
  }>;
}

interface CategoriesResponse {
  categories: Array<{
    id: number;
    language_id: number;
    name: string;
    description: string;
    icon: string;
    color: string;
    is_active: boolean;
  }>;
}

interface LessonsResponse {
  lessons: Array<{
    id: number;
    category_id: number;
    lesson_name: string;
    vocab_level: string;
    speech_to_text_lang_code: string;
    lesson_type: string;
    audio_src: string;
    youtube_url: string | null;
    youtube_embed_url: string | null;
    video_id: string | null;
    video_title: string | null;
    is_active: boolean;
  }>;
}

interface ChallengesResponse {
  challenges: Array<{
    id: number;
    lesson_id: number;
    position: number;
    content: string;
    default_input: string;
    json_content: (string | string[])[];
    solution: string[][];
    audio_src: string;
    time_start: number;
    time_end: number;
    hint: string | null;
    hints: string[];
    explanation: string | null;
    always_show_explanation: boolean;
    nb_comments: number;
  }>;
}

interface GuestRegisterRequest {
  full_name: string;
  learning_language_id: number;
}

interface GuestRegisterResponse {
  user: {
    id: number;
    email: string | null;
    full_name: string;
    learning_language_id: number;
    user_type: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  token: string;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  }

  async getLanguages(): Promise<LanguagesResponse> {
    return this.request<LanguagesResponse>('/languages');
  }

  async getCategoriesByLanguage(languageId: number): Promise<CategoriesResponse> {
    return this.request<CategoriesResponse>(`/categories/language/${languageId}`);
  }

  async getLessonsByCategory(categoryId: number): Promise<LessonsResponse> {
    return this.request<LessonsResponse>(`/lessons/category/${categoryId}`);
  }

  async getChallengesByLesson(lessonId: number): Promise<ChallengesResponse> {
    return this.request<ChallengesResponse>(`/challenges/lesson/${lessonId}`);
  }

  async registerGuest(data: GuestRegisterRequest): Promise<GuestRegisterResponse> {
    return this.request<GuestRegisterResponse>('/auth/register-guest', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

}

export const apiService = new ApiService();
