import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, ListTodo, Bell, LogOut,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store';
import { logout } from '@/store/authSlice';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/tasks', label: 'Tasks', icon: ListTodo },
  { to: '/notifications', label: 'Notifications', icon: Bell },
];

export function AppSidebar() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(s => s.auth.currentUser);
  const notifications = useAppSelector(s => s.notifications.notifications);
  const unreadCount = notifications.filter(n => n.userId === currentUser?.id && !n.read).length;

  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-sidebar-border">
        <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <ListTodo className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-sidebar-accent-foreground tracking-tight">TaskFlow</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => {
          const isActive = location.pathname === item.to;
          return (
            <RouterNavLink
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.label === 'Notifications' && unreadCount > 0 && (
                <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full h-5 min-w-[20px] flex items-center justify-center px-1.5">
                  {unreadCount}
                </span>
              )}
            </RouterNavLink>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border px-3 py-4 space-y-2">
        <div className="flex items-center justify-between px-3">
          <ThemeToggle />
        </div>
        {currentUser && (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-semibold text-sidebar-accent-foreground">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-accent-foreground truncate">{currentUser.name}</p>
              <p className="text-xs text-sidebar-foreground capitalize">{currentUser.role.replace('_', ' ')}</p>
            </div>
            <button onClick={() => dispatch(logout())} className="text-sidebar-foreground hover:text-destructive transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
