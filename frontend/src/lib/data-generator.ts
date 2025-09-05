import { adminDb, FieldValue } from './firebase-admin';

// Production-ready data generation utilities
export interface GeneratedUser {
  id: string;
  type: 'guest' | 'registered' | 'premium';
  email?: string;
  profile: {
    name: string;
    preferences: {
      language: string;
      timezone: string;
      notifications: boolean;
      theme: 'light' | 'dark' | 'auto';
    };
    studyProfile: {
      targetExams: string[];
      currentLevel: 'beginner' | 'intermediate' | 'advanced';
      studyGoals: string[];
      studySchedule: {
        dailyHours: number;
        preferredTime: string;
        weekendStudy: boolean;
      };
    };
  };
  subscription: {
    plan: 'free' | 'basic' | 'premium' | 'enterprise';
    status: 'active' | 'expired' | 'cancelled';
    startDate: Date;
    endDate: Date;
    features: string[];
  };
  analytics: {
    totalSessions: number;
    totalMessages: number;
    totalStudyTime: number;
    lastActive: Date;
    streak: number;
    achievements: string[];
  };
  metadata: {
    source: string;
    deviceInfo: {
      platform: 'web' | 'mobile' | 'desktop';
      browser: string;
      os: string;
    };
  };
}

export interface GeneratedChat {
  id: string;
  userId: string;
  title: string;
  type: 'study' | 'practice' | 'doubt_clearing' | 'exam_prep';
  subject: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'active' | 'completed' | 'archived';
  session: {
    startTime: Date;
    endTime: Date;
    duration: number;
    messageCount: number;
    aiResponseTime: number;
    userSatisfaction: number;
  };
  performance: {
    accuracy: number;
    comprehension: number;
    engagement: number;
    learningOutcome: 'good' | 'excellent' | 'needs_improvement';
  };
  context: {
    previousChats: string[];
    relatedTopics: string[];
    studyMaterials: string[];
  };
  metadata: {
    device: string;
    location: string;
    studyMode: string;
  };
}

export interface GeneratedMessage {
  id: string;
  chatId: string;
  userId: string;
  role: 'user' | 'ai' | 'system';
  content: {
    text: string;
    type: 'question' | 'answer' | 'clarification' | 'feedback';
    format: 'text' | 'markdown' | 'code' | 'image';
    language: string;
  };
  ai: {
    model: string;
    version: string;
    temperature: number;
    maxTokens: number;
    responseTime: number;
    confidence: number;
    sources: string[];
  };
  interaction: {
    feedback: 'thumbs_up' | 'thumbs_down' | 'neutral' | null;
    rating: number | null;
    helpful: boolean;
    copied: boolean;
    shared: boolean;
    bookmarked: boolean;
  };
  analytics: {
    readTime: number;
    reactions: string[];
    followUpQuestions: number;
    comprehensionLevel: 'high' | 'medium' | 'low';
  };
}

// Sample data for generation
const SAMPLE_NAMES = [
  'Aarav Sharma',
  'Priya Patel',
  'Rajesh Kumar',
  'Sneha Singh',
  'Vikram Gupta',
  'Ananya Reddy',
  'Karthik Nair',
  'Divya Iyer',
  'Rohit Joshi',
  'Kavya Rao',
];

const SAMPLE_EMAILS = [
  'aarav.sharma@email.com',
  'priya.patel@email.com',
  'rajesh.kumar@email.com',
  'sneha.singh@email.com',
  'vikram.gupta@email.com',
  'ananya.reddy@email.com',
  'karthik.nair@email.com',
  'divya.iyer@email.com',
  'rohit.joshi@email.com',
  'kavya.rao@email.com',
];

const TARGET_EXAMS = ['UGC_NET', 'CSIR_NET', 'SSC', 'CTET', 'GATE'];
const STUDY_TOPICS = [
  'teaching_aptitude',
  'research_methods',
  'quantitative_aptitude',
  'reasoning',
  'communication',
  'mathematics',
  'physics',
  'chemistry',
  'biology',
  'computer_science',
  'english',
  'general_knowledge',
];

const SAMPLE_QUESTIONS = [
  'What is teaching aptitude and why is it important?',
  'Explain the concept of learning theories in education',
  'How do I improve my quantitative aptitude skills?',
  'What are the key principles of effective teaching?',
  'Can you help me understand research methodology?',
  'What is the difference between formative and summative assessment?',
  'How do I prepare for UGC NET Paper 1?',
  'Explain the concept of educational psychology',
  'What are the types of reasoning questions in competitive exams?',
  'How do I improve my communication skills for teaching?',
];

const SAMPLE_ANSWERS = [
  'Teaching aptitude refers to the natural ability and potential of an individual to become an effective teacher. It encompasses various skills including communication, patience, creativity, and the ability to understand and connect with students.',
  'Learning theories in education provide frameworks for understanding how people learn. Key theories include behaviorism, cognitivism, and constructivism, each offering different perspectives on the learning process.',
  'To improve quantitative aptitude, practice regularly with different types of problems, understand the underlying concepts, and develop mental calculation techniques. Focus on areas like arithmetic, algebra, geometry, and data interpretation.',
  'Effective teaching principles include clear communication, student engagement, differentiated instruction, continuous assessment, and creating a positive learning environment that encourages critical thinking.',
  'Research methodology involves systematic procedures for conducting research, including problem identification, literature review, hypothesis formulation, data collection, analysis, and interpretation of results.',
  'Formative assessment is ongoing evaluation during learning to provide feedback, while summative assessment evaluates learning at the end of a unit or course to determine achievement levels.',
  'UGC NET Paper 1 preparation requires understanding of teaching aptitude, research aptitude, comprehension, communication, mathematical reasoning, logical reasoning, data interpretation, and information technology.',
  'Educational psychology studies how people learn in educational settings, focusing on cognitive development, motivation, individual differences, and the application of psychological principles to improve teaching and learning.',
  'Reasoning questions test logical thinking and include analogies, series completion, classification, coding-decoding, blood relations, direction sense, and logical puzzles.',
  'Improve communication skills by practicing clear articulation, active listening, using appropriate vocabulary, maintaining eye contact, and adapting communication style to different audiences.',
];

// Generate realistic user data
export function generateUser(
  overrides: Partial<GeneratedUser> = {}
): GeneratedUser {
  const randomName =
    SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)];
  const randomEmail =
    SAMPLE_EMAILS[Math.floor(Math.random() * SAMPLE_EMAILS.length)];
  const randomExam =
    TARGET_EXAMS[Math.floor(Math.random() * TARGET_EXAMS.length)];
  const randomTopic =
    STUDY_TOPICS[Math.floor(Math.random() * STUDY_TOPICS.length)];

  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date();
  const subscriptionStart = new Date(
    now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000
  );
  const subscriptionEnd = new Date(
    subscriptionStart.getTime() + 365 * 24 * 60 * 60 * 1000
  );

  return {
    id: userId,
    type: 'guest',
    email: randomEmail,
    profile: {
      name: randomName,
      preferences: {
        language: 'en',
        timezone: 'Asia/Kolkata',
        notifications: true,
        theme: 'light',
      },
      studyProfile: {
        targetExams: [randomExam],
        currentLevel: 'intermediate',
        studyGoals: [randomTopic],
        studySchedule: {
          dailyHours: Math.floor(Math.random() * 4) + 1,
          preferredTime: 'evening',
          weekendStudy: Math.random() > 0.5,
        },
      },
    },
    subscription: {
      plan: 'free',
      status: 'active',
      startDate: subscriptionStart,
      endDate: subscriptionEnd,
      features: ['unlimited_chats', 'basic_support'],
    },
    analytics: {
      totalSessions: Math.floor(Math.random() * 50) + 1,
      totalMessages: Math.floor(Math.random() * 200) + 10,
      totalStudyTime: Math.floor(Math.random() * 1200) + 60,
      lastActive: new Date(
        now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ),
      streak: Math.floor(Math.random() * 10) + 1,
      achievements: ['first_chat', 'week_streak'],
    },
    metadata: {
      source: 'organic',
      deviceInfo: {
        platform: 'web',
        browser: 'chrome',
        os: 'windows',
      },
    },
    ...overrides,
  };
}

// Generate realistic chat data
export function generateChat(
  userId: string,
  overrides: Partial<GeneratedChat> = {}
): GeneratedChat {
  const chatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date();
  const startTime = new Date(now.getTime() - Math.random() * 60 * 60 * 1000);
  const endTime = new Date(
    startTime.getTime() + Math.random() * 60 * 60 * 1000
  );
  const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

  const randomSubject =
    TARGET_EXAMS[Math.floor(Math.random() * TARGET_EXAMS.length)];
  const randomTopic =
    STUDY_TOPICS[Math.floor(Math.random() * STUDY_TOPICS.length)];
  const randomType = ['study', 'practice', 'doubt_clearing', 'exam_prep'][
    Math.floor(Math.random() * 4)
  ];

  return {
    id: chatId,
    userId,
    title: `Chat about ${randomTopic}`,
    type: randomType as any,
    subject: randomSubject,
    topic: randomTopic,
    difficulty: 'intermediate',
    status: 'completed',
    session: {
      startTime,
      endTime,
      duration,
      messageCount: Math.floor(Math.random() * 20) + 2,
      aiResponseTime: Math.random() * 3 + 1,
      userSatisfaction: Math.random() * 2 + 3,
    },
    performance: {
      accuracy: Math.random() * 0.3 + 0.7,
      comprehension: Math.random() * 0.3 + 0.7,
      engagement: Math.random() * 0.3 + 0.7,
      learningOutcome: 'good',
    },
    context: {
      previousChats: [],
      relatedTopics: [randomTopic],
      studyMaterials: [`material_${randomTopic}`],
    },
    metadata: {
      device: 'web',
      location: 'home',
      studyMode: 'focused',
    },
    ...overrides,
  };
}

// Generate realistic message data
export function generateMessage(
  chatId: string,
  userId: string,
  role: 'user' | 'ai',
  overrides: Partial<GeneratedMessage> = {}
): GeneratedMessage {
  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  // const now = new Date(); // Unused for now

  const isUser = role === 'user';
  const randomQuestion =
    SAMPLE_QUESTIONS[Math.floor(Math.random() * SAMPLE_QUESTIONS.length)];
  const randomAnswer =
    SAMPLE_ANSWERS[Math.floor(Math.random() * SAMPLE_ANSWERS.length)];

  return {
    id: messageId,
    chatId,
    userId,
    role,
    content: {
      text: isUser ? randomQuestion : randomAnswer,
      type: isUser ? 'question' : 'answer',
      format: 'text',
      language: 'en',
    },
    ai: {
      model: 'gpt-4-turbo',
      version: '2024-01-15',
      temperature: 0.7,
      maxTokens: 1000,
      responseTime: Math.random() * 3 + 1,
      confidence: Math.random() * 0.3 + 0.7,
      sources: ['textbook_page_45', 'research_paper_2023'],
    },
    interaction: {
      feedback: null,
      rating: null,
      helpful: false,
      copied: false,
      shared: false,
      bookmarked: false,
    },
    analytics: {
      readTime: Math.floor(Math.random() * 60) + 10,
      reactions: [],
      followUpQuestions: 0,
      comprehensionLevel: 'medium',
    },
    ...overrides,
  };
}

// Generate and save sample data
export async function generateSampleData(count: number = 10) {
  const users: GeneratedUser[] = [];
  const chats: GeneratedChat[] = [];
  const messages: GeneratedMessage[] = [];

  // Generate users
  for (let i = 0; i < count; i++) {
    const user = generateUser();
    users.push(user);

    // Generate 2-5 chats per user
    const chatCount = Math.floor(Math.random() * 4) + 2;
    for (let j = 0; j < chatCount; j++) {
      const chat = generateChat(user.id);
      chats.push(chat);

      // Generate 3-10 messages per chat
      const messageCount = Math.floor(Math.random() * 8) + 3;
      for (let k = 0; k < messageCount; k++) {
        const isUser = k % 2 === 0;
        const message = generateMessage(
          chat.id,
          user.id,
          isUser ? 'user' : 'ai'
        );
        messages.push(message);
      }
    }
  }

  // Save to database
  const batch = adminDb.batch();

  // Save users
  users.forEach(user => {
    const userRef = adminDb.collection('users').doc(user.id);
    batch.set(userRef, {
      ...user,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  });

  // Save chats
  chats.forEach(chat => {
    const chatRef = adminDb.collection('chats').doc(chat.id);
    batch.set(chatRef, {
      ...chat,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  });

  // Save messages
  messages.forEach(message => {
    const messageRef = adminDb.collection('messages').doc(message.id);
    batch.set(messageRef, {
      ...message,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();

  return {
    users: users.length,
    chats: chats.length,
    messages: messages.length,
  };
}

// Generate realistic analytics data
export async function generateAnalyticsData(days: number = 30) {
  const analyticsData = [];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const dailyData = {
      date: date.toISOString().split('T')[0],
      metrics: {
        users: {
          total: Math.floor(Math.random() * 1000) + 500,
          new: Math.floor(Math.random() * 100) + 20,
          active: Math.floor(Math.random() * 800) + 400,
          returning: Math.floor(Math.random() * 600) + 300,
        },
        engagement: {
          totalChats: Math.floor(Math.random() * 2000) + 1000,
          totalMessages: Math.floor(Math.random() * 15000) + 8000,
          avgSessionDuration: Math.floor(Math.random() * 1800) + 900,
          avgMessagesPerChat: Math.random() * 3 + 5,
          completionRate: Math.random() * 0.3 + 0.7,
        },
        performance: {
          avgResponseTime: Math.random() * 2 + 1.5,
          accuracy: Math.random() * 0.2 + 0.8,
          userSatisfaction: Math.random() * 1 + 3.5,
          errorRate: Math.random() * 0.05 + 0.01,
        },
      },
      generatedAt: FieldValue.serverTimestamp(),
    };

    const analyticsRef = adminDb
      .collection('daily_analytics')
      .doc(dailyData.date);
    await analyticsRef.set(dailyData);

    analyticsData.push(dailyData);
  }

  return analyticsData;
}

// Generate performance insights for a user
export async function generateUserPerformanceInsights(userId: string) {
  const userRef = adminDb.collection('users').doc(userId);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    throw new Error('User not found');
  }

  const userData = userSnap.data();
  const analytics = userData?.analytics || {};

  // Generate realistic performance data
  const performanceData = {
    userId,
    overall: {
      score: Math.random() * 30 + 70,
      level:
        analytics.totalStudyTime > 600
          ? 'advanced'
          : analytics.totalStudyTime > 300
            ? 'intermediate'
            : 'beginner',
      progress: Math.min(analytics.totalStudyTime / 1800, 1),
      streak: analytics.streak || 0,
      totalStudyTime: analytics.totalStudyTime || 0,
    },
    bySubject: {
      UGC_NET: {
        score: Math.random() * 30 + 70,
        progress: Math.random() * 0.4 + 0.6,
        weakAreas: ['research_methods', 'communication'],
        strongAreas: ['teaching_aptitude', 'reasoning'],
      },
      CSIR_NET: {
        score: Math.random() * 30 + 65,
        progress: Math.random() * 0.4 + 0.5,
        weakAreas: ['physical_sciences'],
        strongAreas: ['chemical_sciences'],
      },
    },
    improvements: {
      daily: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        score: Math.random() * 20 + 70,
        topics: [STUDY_TOPICS[Math.floor(Math.random() * STUDY_TOPICS.length)]],
      })),
      weekly: Array.from({ length: 4 }, (_, i) => ({
        week: `2024-W${String(i + 1).padStart(2, '0')}`,
        score: Math.random() * 20 + 70,
        improvement: Math.random() * 10 - 5,
      })),
      monthly: Array.from({ length: 3 }, (_, i) => ({
        month: `2024-${String(i + 1).padStart(2, '0')}`,
        score: Math.random() * 20 + 70,
        improvement: Math.random() * 15 - 5,
      })),
    },
    goals: {
      targetScore: 85.0,
      targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      studyPlan: 'intensive',
      focusAreas: ['research_methods', 'communication'],
    },
    updatedAt: FieldValue.serverTimestamp(),
  };

  const performanceRef = adminDb.collection('user_performance').doc(userId);
  await performanceRef.set(performanceData);

  return performanceData;
}

// Generate system health metrics
export async function generateSystemHealthMetrics() {
  const now = new Date();
  // const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000); // Unused for now

  // Generate realistic system metrics
  const healthData = {
    timestamp: now,
    activeUsers: Math.floor(Math.random() * 500) + 200,
    totalMessages: Math.floor(Math.random() * 5000) + 2000,
    errorRate: Math.random() * 0.05 + 0.01,
    avgResponseTime: Math.random() * 2 + 1.5,
    systemHealth: 'healthy',
    metrics: {
      cpu: Math.random() * 30 + 40,
      memory: Math.random() * 20 + 60,
      disk: Math.random() * 10 + 70,
      network: Math.random() * 15 + 80,
    },
  };

  const healthRef = adminDb.collection('system_health').doc();
  await healthRef.set(healthData);

  return healthData;
}

// Initialize database with sample data
export async function initializeDatabaseWithSampleData() {
  console.log('🚀 Initializing database with sample data...');

  try {
    // Generate sample data
    const sampleData = await generateSampleData(20);
    console.log(
      `✅ Generated ${sampleData.users} users, ${sampleData.chats} chats, ${sampleData.messages} messages`
    );

    // Generate analytics data
    const analyticsData = await generateAnalyticsData(30);
    console.log(`✅ Generated ${analyticsData.length} days of analytics data`);

    // Generate system health metrics
    await generateSystemHealthMetrics();
    console.log(`✅ Generated system health metrics`);

    console.log('🎉 Database initialization completed successfully!');

    return {
      success: true,
      data: {
        users: sampleData.users,
        chats: sampleData.chats,
        messages: sampleData.messages,
        analyticsDays: analyticsData.length,
      },
    };
  } catch (error: any) {
    console.error('❌ Error initializing database:', error);
    return {
      success: false,
      error: error?.message || 'Unknown error',
    };
  }
}
