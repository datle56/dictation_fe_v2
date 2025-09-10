import { Book, Briefcase, MessageSquare, Plane } from 'lucide-react';

const iconMapping: Record<string, React.ComponentType<any>> = {
  'Book': Book,
  'Briefcase': Briefcase,
  'MessageSquare': MessageSquare,
  'Plane': Plane,
};

export const getIconComponent = (iconName: string): React.ComponentType<any> => {
  return iconMapping[iconName] || Book;
};
