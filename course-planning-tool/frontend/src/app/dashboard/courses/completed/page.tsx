import { redirect } from 'next/navigation';

export default function CompletedCoursesPage() {
  // Redirect to main courses page since this route was moved
  redirect('/dashboard/courses');
} 