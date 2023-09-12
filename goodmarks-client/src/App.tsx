import { Outlet } from "react-router-dom";
import SidePanel from "./components/sidepanel";
import NotificationProvider from "./contexts/notification-context";
import NotificationManager from "./components/notification-manager";

function App() {
  return (
    <div className="inline-flex border-gray-200 border w-[30rem] h-[30rem]">
      <SidePanel />
      <NotificationProvider>
        <div className="flex overflow-hidden px-10 py-8 flex-grow justify-center">
          <NotificationManager />
          <Outlet />
        </div>
      </NotificationProvider>
    </div>
  );
}

export default App;
