import { GraduationCap, Users, Settings } from "lucide-react";
import FloatingBlobsAndParticles from "@/components/FloatingBlobs-and-Particles";
import RoleCard from "@/components/RoleCard";
import IBuLogo from "@/components/iBU-Logo";

const Index: React.FC = () => {
  return (                                                       
    <>
      <FloatingBlobsAndParticles />

      <div className="min-h-screen box-border bg-[#3baff3] overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div
className="relative z-10 w-full max-w-2xl bg-white rounded-4xl p-12 shadow-xl animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="flex flex-col items-center text-center gap-1 mb-8">
              <IBuLogo />
              <div className="mt-4">
                <h1 className="mt-0 text-3xl font-bold text-gray-800">
                  Student Notice System
                </h1>
                <p className="mt-1 text-gray-600 max-w-md">
                  Stay informed with official announcements, updates, and important notices from Bicol University.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <RoleCard
                title="Student"
                description="View notices & updates"
                icon={GraduationCap}
                to="/student/login"
                variant="student"
              />
              <RoleCard
                title="Faculty"
                description="Post & manage notices"
                icon={Users}
                to="/faculty/login"
                variant="faculty"
              />
              <RoleCard
                title="Administrator"
                description="System management"
                icon={Settings}
                to="/admin/login"
                variant="admin"
              />
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                © 2026 Bicol University. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;