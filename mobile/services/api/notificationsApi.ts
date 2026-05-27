/**
 * Notifications API Service
 * Handles REST API calls for notification-related operations
 */

import { ApiResponse } from './groupsApi';
import { Notification } from '../../types/notification';

class NotificationsApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'https://api.esustellar.com/v1';
  }

  /**
   * Get all notifications for a user
   */
  async getUserNotifications(userAddress: string): Promise<ApiResponse<Notification[]>> {
    try {
      console.log(`Fetching notifications for user: ${userAddress}`);

      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockNotifications: Notification[] = [
        {
          id: 'notif_1',
          title: 'Contribution Due',
          message: 'Your monthly contribution to Family Savings Circle is due.',
          read: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'notif_2',
          title: 'Payout Received',
          message: 'You have received a payout of 600 XLM from Investment Club.',
          read: false,
          createdAt: new Date().toISOString(),
        },
      ];

      return {
        success: true,
        data: mockNotifications,
      };
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return {
        success: false,
        error: 'Failed to fetch notifications',
      };
    }
  }
}

export const notificationsApi = new NotificationsApiService();

export default NotificationsApiService;
