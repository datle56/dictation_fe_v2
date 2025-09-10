import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Language, Category, ApiLesson, Challenge } from '../types/types';

// useLanguages hook has been moved to LanguagesContext
// This hook is now deprecated - use useLanguages from LanguagesContext instead

export const useCategories = (languageId: number | null) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!languageId) {
      setCategories([]);
      return;
    }

    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await apiService.getCategoriesByLanguage(languageId);
        const transformedCategories: Category[] = response.categories.map(category => ({
          id: category.id,
          language_id: category.language_id,
          name: category.name,
          description: category.description,
          icon: category.icon,
          color: category.color,
          is_active: category.is_active,
          lessonCount: 0
        }));
        setCategories(transformedCategories);
      } catch {
        // Fallback data
        setCategories([
          { id: 1, language_id: languageId, name: 'General English', description: 'Basic English dictation exercises', icon: 'Book', color: 'blue', is_active: true, lessonCount: 20 },
          { id: 2, language_id: languageId, name: 'Daily Conversation', description: 'Everyday conversation dictation', icon: 'MessageSquare', color: 'green', is_active: true, lessonCount: 15 },
          { id: 3, language_id: languageId, name: 'Business English', description: 'Professional and business context dictation', icon: 'Briefcase', color: 'purple', is_active: true, lessonCount: 12 },
          { id: 4, language_id: languageId, name: 'Travel English', description: 'Travel-related dictation exercises', icon: 'Plane', color: 'orange', is_active: true, lessonCount: 8 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [languageId]);

  return { categories, loading };
};

export const useLessons = (categoryId: number | null) => {
  const [lessons, setLessons] = useState<ApiLesson[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!categoryId) {
      setLessons([]);
      return;
    }

    const fetchLessons = async () => {
      setLoading(true);
      try {
        const response = await apiService.getLessonsByCategory(categoryId);
        setLessons(response.lessons);
      } catch (error) {
        console.error('Failed to fetch lessons:', error);
        setLessons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [categoryId]);

  return { lessons, loading };
};

export const useChallenges = (lessonId: number | null) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!lessonId) {
      setChallenges([]);
      return;
    }

    const fetchChallenges = async () => {
      setLoading(true);
      try {
        const response = await apiService.getChallengesByLesson(lessonId);
        setChallenges(response.challenges);
      } catch (error) {
        console.error('Failed to fetch challenges:', error);
        setChallenges([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [lessonId]);

  return { challenges, loading };
};

// Helper function has been moved to LanguagesContext
