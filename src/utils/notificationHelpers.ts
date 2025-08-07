import { notificationService } from './notificationService';

export const createNotificationHelpers = () => {
  const createNotification = async (
    userId: string,
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) => {
    return await notificationService.createNotification(userId, title, message, type);
  };

  // Common notification scenarios
  const notifyExerciseCompleted = async (userId: string, exerciseName: string) => {
    return await createNotification(
      userId,
      'Exercise Completed',
      `You've successfully completed the '${exerciseName}' exercise`,
      'success'
    );
  };

  const notifyReportReady = async (userId: string, reportName: string) => {
    return await createNotification(
      userId,
      'New Report Available',
      `Your Business Health Score report for '${reportName}' is ready`,
      'info'
    );
  };

  const notifyCreditsAdded = async (userId: string, amount: number) => {
    return await createNotification(
      userId,
      'Credit Purchase Confirmed',
      `${amount} credits have been added to your account`,
      'success'
    );
  };

  const notifyLowCredits = async (userId: string, remaining: number) => {
    return await createNotification(
      userId,
      'Low Credits Warning',
      `You have less than ${remaining} credits remaining`,
      'warning'
    );
  };

  const notifyWelcome = async (userId: string) => {
    return await createNotification(
      userId,
      'Welcome to Prosper With Purpose',
      'Get started by completing your first exercise or generating a business health report',
      'info'
    );
  };

  const notifySystemError = async (userId: string, errorMessage: string) => {
    return await createNotification(
      userId,
      'System Error',
      errorMessage,
      'error'
    );
  };

  const notifyAnalysisStarted = async (userId: string, reportType: string) => {
    return await createNotification(
      userId,
      'Analysis Started',
      `Your ${reportType} analysis has started. You'll be notified when it's complete.`,
      'info'
    );
  };

  const notifyAnalysisComplete = async (userId: string, reportType: string) => {
    return await createNotification(
      userId,
      'Analysis Complete',
      `Your ${reportType} analysis is ready for review.`,
      'success'
    );
  };

  return {
    createNotification,
    notifyExerciseCompleted,
    notifyReportReady,
    notifyCreditsAdded,
    notifyLowCredits,
    notifyWelcome,
    notifySystemError,
    notifyAnalysisStarted,
    notifyAnalysisComplete,
  };
};

export const notifications = createNotificationHelpers();