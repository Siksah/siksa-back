import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Session, SessionDocument } from './schemas/session.schema';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

  /**
   * 익명 세션을 생성하고 MongoDB에 저장합니다.
   */
  async createSession(initialData: Record<string, any>): Promise<string> {
    const sessionId = uuidv4();

    const newSession = new this.sessionModel({
      sessionId: sessionId,
      data: initialData,
      // createdAt은 스키마의 default로 자동 설정됩니다.
    });

    await newSession.save();
    return sessionId;
  }

  /**
   * 세션 ID로 세션 정보를 조회합니다.
   * TTL이 지나면 MongoDB에서 자동 삭제되므로, 조회 시 없으면 만료된 것입니다.
   */
  async findSession(sessionId: string): Promise<SessionDocument | null> {
    return this.sessionModel.findOne({ sessionId }).exec();
  }

}