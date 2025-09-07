# FULL-STACK PROJECT RULES

# Monorepo with shared patterns and types

## PROJECT STRUCTURE

apps/
├── web/ # Next.js frontend
├── api/ # Express.js backend
├── mobile/ # React Native (optional)
packages/
├── ui/ # Shared UI components
├── types/ # Shared TypeScript types
├── utils/ # Shared utilities
├── config/ # Shared configuration
└── database/ # Database schema and migrations

## SHARED PATTERNS

- Use shared TypeScript types between frontend and backend
- Implement consistent error handling across all layers
- Use shared validation schemas (Zod) for API contracts
- Shared utilities and helper functions
- Consistent naming conventions across all applications

## API INTEGRATION

- Type-safe API communication with shared interfaces
- Consistent error handling between client and server
- Optimistic updates on frontend with proper rollback
- Real-time updates with WebSockets or Server-Sent Events
- Proper loading and error states on frontend

## TESTING STRATEGY

- Unit tests for individual functions and components
- Integration tests for API endpoints and database operations
- E2E tests for critical user journeys across the stack
- Contract testing between frontend and backend
- Shared test utilities and mocks

## DEPLOYMENT & CI/CD

- Docker containers for all applications
- Shared CI/CD pipeline with proper staging
- Environment-specific configuration management
- Database migrations and seeding
- Monitoring and logging across all services

## CODE GENERATION RULES

When generating full-stack code:

1. Ensure type safety between frontend and backend
2. Implement consistent error handling across layers
3. Use shared validation schemas for API contracts
4. Add comprehensive testing at all levels
5. Include proper monitoring and logging
6. Follow security best practices throughout the stack
7. Implement proper caching strategies
8. Include deployment and infrastructure considerations
