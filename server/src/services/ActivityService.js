import { Activity } from '../models/Activity.js';
import { User } from '../models/User.js';

export class ActivityService {
  static async log(userId, { type, title, isPublic = true, referenceId = null, referenceModel = null, metadata = {} }) {
    try {
      const user = await User.findById(userId).select('isPublic');
      const publicFlag = user ? user.isPublic && isPublic : isPublic;

      return await Activity.create({
        userId,
        type,
        title,
        isPublic: publicFlag,
        referenceId,
        referenceModel,
        metadata,
      });
    } catch (error) {
      console.error('[ActivityService] Failed to log activity:', error.message);
      return null;
    }
  }
}
