/**
 * Database Services Index - Exports all database operations
 */

// Export all database services
export { analyticsDatabaseService as analyticsService } from './analyticsDatabase';
export { studySessionDatabaseService as studySessionService } from './studySessionDatabase';
export { userDatabaseService as userService } from './userDatabase';

// Export base service for custom operations
export { DatabaseService as databaseService } from './baseDatabase';
