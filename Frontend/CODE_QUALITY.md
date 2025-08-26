# Code Quality Guidelines

## 🎯 Project Standards

### TypeScript Configuration

- ✅ Strict mode enabled
- ✅ No unused variables/parameters
- ✅ Consistent file naming
- ✅ Proper path mapping with `@/` aliases

### Component Structure

- ✅ Use functional components with hooks
- ✅ Proper TypeScript interfaces for props
- ✅ Consistent import/export patterns
- ✅ Follow React naming conventions

### State Management

- ✅ Use React Context for global state
- ✅ Custom hooks for reusable logic
- ✅ Proper error handling
- ✅ Loading states management

## 📁 Directory Structure

```
src/
├── components/          # Reusable UI components (lowercase)
│   ├── ui/             # Shadcn components
│   ├── features/       # Feature-specific components
│   ├── layout/         # Layout components
│   └── common/         # Common components
├── hooks/              # Custom React hooks
├── stores/             # State management
├── services/           # API services
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── constants/          # Application constants
├── assets/             # Static assets
└── pages/              # Page components
```

## 🔧 Development Workflow

### Before Committing

1. Run `pnpm type-check` - Check TypeScript errors
2. Run `pnpm lint` - Check ESLint errors
3. Run `pnpm format` - Format code with Prettier
4. Run `pnpm build` - Ensure build succeeds

### Code Review Checklist

- [ ] TypeScript types are properly defined
- [ ] No console.log statements in production code
- [ ] Proper error handling implemented
- [ ] Components are properly memoized if needed
- [ ] No hardcoded values (use constants)
- [ ] Proper accessibility attributes
- [ ] Responsive design considerations

## 🚀 Performance Guidelines

### Bundle Optimization

- Use dynamic imports for code splitting
- Lazy load routes and heavy components
- Optimize images and assets
- Remove unused dependencies

### Component Optimization

- Use React.memo for expensive components
- Implement proper key props for lists
- Avoid inline object/function creation
- Use useCallback and useMemo appropriately

### State Optimization

- Minimize re-renders
- Use proper dependency arrays in hooks
- Avoid unnecessary state updates

## 🛡️ Security Guidelines

### Authentication

- Never store sensitive data in localStorage
- Use secure HTTP-only cookies for tokens
- Implement proper session management
- Validate all user inputs

### Data Handling

- Sanitize user inputs
- Use HTTPS for all API calls
- Implement proper CORS policies
- Validate API responses

## 📊 Monitoring & Analytics

### Performance Monitoring

- Track Core Web Vitals
- Monitor bundle sizes
- Track API response times
- Monitor error rates

### User Analytics

- Track user interactions
- Monitor conversion rates
- Track feature usage
- Monitor accessibility metrics

## 🧪 Testing Guidelines

### Unit Tests

- Test all utility functions
- Test custom hooks
- Test component logic
- Maintain >80% code coverage

### Integration Tests

- Test component interactions
- Test API integrations
- Test user workflows
- Test error scenarios

## 📝 Documentation

### Code Documentation

- JSDoc comments for functions
- README for each major component
- API documentation
- Setup instructions

### Architecture Documentation

- Component hierarchy
- State management flow
- API integration patterns
- Deployment procedures

## 🔄 Maintenance

### Regular Tasks

- Update dependencies monthly
- Review and remove unused code
- Optimize bundle size
- Update security patches
- Review performance metrics

### Code Quality Metrics

- TypeScript strict compliance
- ESLint rule compliance
- Prettier formatting compliance
- Test coverage maintenance
- Performance benchmarks
