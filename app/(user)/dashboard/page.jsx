import DashboardStats from "@/app/components/Dashboard/DashboardStats";
import DashboardContacts from "@/app/components/Dashboard/DashboardContacts";
import DashboardTeamMembers from "@/app/components/Dashboard/DashboardTeamMembers";
import DashboardConversation from "@/app/components/Dashboard/DashboardConversation"; 

export default function page() {
  return (
    <div className="px-4">
      
      <div className="mb-4">
        <DashboardStats />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 mb-5">
        
        <div>
          <DashboardContacts />
        </div>

        <div>
          <DashboardTeamMembers />
        </div>
      
      </div>
      
      <DashboardConversation />
      

    </div>
  );
}