# BACKEND PROJECT RULES

# Node.js/Express/TypeScript API guidelines

## PROJECT CONTEXT

- Runtime: Node.js with TypeScript
- Framework: Express.js with middleware patterns
- Database: PostgreSQL with Prisma ORM
- Authentication: JWT with refresh tokens
- Validation: Zod schemas
- Testing: Jest with Supertest
- Deployment: Docker containers

## API ARCHITECTURE PATTERNS

- RESTful API design with proper HTTP methods
- Express Router for modular route organization
- Middleware-first approach for cross-cutting concerns
- Controller → Service → Repository pattern
- Centralized error handling middleware
- Request/response validation with Zod schemas

## SECURITY IMPLEMENTATION

- Input validation and sanitization for all endpoints
- Parameterized queries exclusively (no string concatenation)
- JWT tokens with proper expiration and refresh mechanism
- Rate limiting on all public endpoints
- CORS configuration with specific origins
- Security headers (HSTS, CSP, X-Frame-Options)
- Never log sensitive data (passwords, tokens, PII)

## DATABASE PATTERNS

- Use Prisma for type-safe database operations
- Implement connection pooling for performance
- Database transactions for data consistency
- Proper indexing for query performance
- Audit trails for sensitive operations
- Backup and recovery procedures

## ERROR HANDLING STANDARDS

- Structured error responses with consistent format
- HTTP status codes following REST conventions
- Error logging with correlation IDs
- No sensitive information in error messages
- Graceful degradation for external service failures

## PERFORMANCE REQUIREMENTS

- Response times: < 100ms for simple queries, < 500ms for complex
- Implement response caching where appropriate
- Database query optimization with proper indexing
- Connection pooling and resource management
- Monitoring and alerting for performance metrics

## CODE GENERATION RULES

When generating backend code:

1. Always include comprehensive input validation
2. Implement proper error handling and logging
3. Use parameterized queries for database operations
4. Add authentication and authorization checks
5. Include rate limiting for public endpoints
6. Add comprehensive integration tests
7. Follow security best practices (OWASP Top 10)
8. Include proper API documentation
