import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';

export function Layout() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar />
      <main className="flex-1 overflow-auto bg-background">
        <div className="p-6 lg:p-8 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
