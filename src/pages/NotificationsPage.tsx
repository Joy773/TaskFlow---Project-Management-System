import { useAppSelector, useAppDispatch } from '@/store';
import { markAsRead, markAllAsRead } from '@/store/notificationsSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCheck, Circle } from 'lucide-react';

export default function NotificationsPage() {
  const currentUser = useAppSelector(s => s.auth.currentUser);
  const notifications = useAppSelector(s => s.notifications.notifications);
  const dispatch = useAppDispatch();

  const myNotifications = notifications.filter(n => n.userId === currentUser?.id);
  const unreadCount = myNotifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={() => dispatch(markAllAsRead(currentUser!.id))}>
            <CheckCheck className="h-4 w-4 mr-2" />Mark all read
          </Button>
        )}
      </div>

      {myNotifications.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>No notifications yet</p>
        </div>
      )}

      <div className="space-y-2">
        {myNotifications.map(n => (
          <Card
            key={n.id}
            className={n.read ? 'opacity-60' : ''}
          >
            <CardContent className="p-4 flex items-center gap-3">
              {!n.read && <Circle className="h-2 w-2 fill-primary text-primary shrink-0" />}
              {n.read && <div className="w-2" />}
              <div className="flex-1">
                <p className="text-sm">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString()}
                </p>
              </div>
              {!n.read && (
                <Button variant="ghost" size="sm" onClick={() => dispatch(markAsRead(n.id))}>
                  Mark read
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
