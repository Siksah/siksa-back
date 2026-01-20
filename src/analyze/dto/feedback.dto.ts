// analyze/dto/feedback.dto.ts
export class CreateFeedbackDto {
  sessionId!: string;
  menuName!: string;     
  rank!: number;
  feedback!: 'like' | 'dislike';
  thinkingBudget!: number;
  deviceInfo!: {
    os: string;
    browser: string;
    isMobile: boolean;
    screenSize: string;
  };
  retryCount!: number;
}