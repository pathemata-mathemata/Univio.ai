import { redirect } from 'next/navigation';

export default function SchedulePage() {
  // Redirect to progress page since this route was moved
  redirect('/dashboard/progress');
} 