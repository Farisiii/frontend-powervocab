import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
// Helper function to determine grid column count based on screen width
export const getGridColumns = () => {
  // This is a rough approximation - in a real app you'd use a media query or window.innerWidth
  return {
    'grid-cols-1': true, // Default for xs screens
    'sm:grid-cols-2': true, // Small screens (640px+)
    'md:grid-cols-2': true, // Medium screens (768px+)
    'lg:grid-cols-3': true, // Large screens (1024px+)
    'xl:grid-cols-3': true, // XL screens (1280px+)
    '2xl:grid-cols-3': true, // 2XL screens (1536px+)
  }
}

export const getProgressColor = (progress) => {
  if (progress < 30) return 'bg-error-500'
  if (progress < 70) return 'bg-warning-400'
  return 'bg-success-500'
}
