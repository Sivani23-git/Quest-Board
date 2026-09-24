import { Notification } from '../models/Notification.js';

export class NotificationService {
  static async create(userId, { type, title, message, referenceId = null, referenceModel = null }) {
    try {
      return await Notification.create({
        userId,
        type,
        title,
        message,
        referenceId,
        referenceModel,
      });
    } catch (error) {
      console.error('[NotificationService] Failed to create notification:', error.message);
      return null;
    }
  }
}
