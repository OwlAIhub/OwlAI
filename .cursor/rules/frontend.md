# FRONTEND PROJECT RULES

# React/Next.js/TypeScript specific guidelines

## PROJECT CONTEXT

- Framework: Next.js 15 with App Router
- Styling: Tailwind CSS + shadcn/ui
- State Management: Zustand + TanStack Query
- Forms: React Hook Form + Zod validation
- Testing: Jest + React Testing Library + Playwright

## COMPONENT PATTERNS

- Use functional components with TypeScript interfaces
- Implement Server Components by default, 'use client' only when necessary
- Create compound component patterns for complex UI
- Use React.forwardRef for components needing DOM access
- Implement proper error boundaries for component trees

## RESPONSIVE DESIGN REQUIREMENTS

- Mobile-first approach with Tailwind breakpoints
- Test on: Mobile (375px), Tablet (768px), Desktop (1024px+)
- Use CSS Grid and Flexbox for layouts
- Implement proper touch targets (44px minimum)
- Ensure text remains readable at 200% zoom

## ACCESSIBILITY STANDARDS

- WCAG 2.1 AA compliance mandatory
- Semantic HTML structure with proper heading hierarchy
- ARIA labels for interactive elements
- Keyboard navigation support for all functionality
- Color contrast ratios meeting 4.5:1 minimum
- Screen reader announcements for dynamic content

## STATE MANAGEMENT PATTERNS

- Local state: useState, useReducer
- Global state: Zustand stores
- Server state: TanStack Query
- Form state: React Hook Form
- URL state: Next.js searchParams

## PERFORMANCE REQUIREMENTS

- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- Bundle size: < 250KB gzipped for initial load
- Implement lazy loading for non-critical components
- Use Next.js Image optimization
- Code splitting with dynamic imports

## CODE GENERATION RULES

When generating frontend code:

1. Always include TypeScript types and interfaces
2. Implement responsive design with Tailwind classes
3. Add proper accessibility attributes (ARIA, semantic HTML)
4. Include error handling and loading states
5. Use React.memo and useCallback for performance
6. Add comprehensive unit and accessibility tests
7. Follow established component patterns
8. Include proper SEO metadata for pages
