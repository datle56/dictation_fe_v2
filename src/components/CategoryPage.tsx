import React from 'react';
import { ArrowLeft, Play, ChevronDown, ChevronRight } from 'lucide-react';
import { Category, ApiLesson } from '../types/types';
import { useLessons } from '../hooks/useApi';
import { getIconComponent } from '../utils/iconMapping';

interface CategoryPageProps {
  category: Category;
  onBack: () => void;
  onLessonSelect: (lesson: ApiLesson) => void;
}

export default function CategoryPage({
  category,
  onBack,
  onLessonSelect
}: CategoryPageProps) {
  const [expandedGroups, setExpandedGroups] = React.useState<string[]>([]);
  const { lessons, loading } = useLessons(category.id);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const getDifficultyColor = (vocabLevel: string) => {
    switch (vocabLevel) {
      case 'A1':
      case 'A2': return 'text-green-600 bg-green-100';
      case 'B1':
      case 'B2': return 'text-yellow-600 bg-yellow-100';
      case 'C1':
      case 'C2': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Group lessons into sections of 20
  const groupLessonsIntoSections = (lessons: ApiLesson[] | null) => {
    if (!lessons || lessons.length === 0) {
      return [];
    }
    
    const sections: { id: string; name: string; lessons: ApiLesson[] }[] = [];
    const lessonsPerSection = 20;
    
    for (let i = 0; i < lessons.length; i += lessonsPerSection) {
      const sectionLessons = lessons.slice(i, i + lessonsPerSection);
      const sectionNumber = Math.floor(i / lessonsPerSection) + 1;
      
      sections.push({
        id: `section-${sectionNumber}`,
        name: `Section ${sectionNumber}`,
        lessons: sectionLessons
      });
    }
    
    return sections;
  };

  const lessonSections = groupLessonsIntoSections(lessons);
  const totalLessons = lessons?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-xl bg-${category.color}-100`}>
                {React.createElement(getIconComponent(category.icon), {
                  className: `w-8 h-8 text-${category.color}-600`
                })}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {category.name}
                </h1>
                <p className="text-gray-600">{category.description}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {totalLessons}
              </div>
              <div className="text-gray-600">Total Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {lessonSections.length}
              </div>
              <div className="text-gray-600">Sections</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                0
              </div>
              <div className="text-gray-600">Completed</div>
            </div>
          </div>
        </div>

        {/* Lesson Groups */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Lesson Groups</h2>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading lessons...</span>
            </div>
          ) : lessonSections.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No lessons available for this category.</p>
            </div>
          ) : (
            lessonSections.map(section => (
              <div key={section.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                {/* Section Header */}
                <button
                  onClick={() => toggleGroup(section.id)}
                  className="w-full p-6 text-left hover:bg-gray-50 transition-colors flex items-center justify-between bg-gradient-to-r from-gray-50 to-white"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg bg-${category.color}-100`}>
                      {React.createElement(getIconComponent(category.icon), {
                        className: `w-5 h-5 text-${category.color}-600`
                      })}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{section.name}</h3>
                      <p className="text-gray-600 text-sm">
                        {section.lessons.length} lessons • 0 completed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-800">0%</div>
                      <div className="text-xs text-gray-600">Complete</div>
                    </div>
                    {expandedGroups.includes(section.id) ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Section Lessons */}
                {expandedGroups.includes(section.id) && (
                  <div className="border-t border-gray-100 bg-white">
                    {section.lessons.map(lesson => (
                      <button
                        key={lesson.id}
                        onClick={() => onLessonSelect(lesson)}
                        className="w-full p-4 text-left hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-b-0 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-1">
                              <h4 className="text-base font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                                {lesson.lesson_name}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.vocab_level)}`}>
                                {lesson.vocab_level}
                              </span>
                            </div>
                          </div>
                          
                          <div className="ml-4">
                            <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-500 transition-colors">
                              <Play className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}