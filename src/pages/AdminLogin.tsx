import { useState } from 'react';
import { Settings } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import AuthForm from '@/components/AuthForm';

const AdminLogin = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <AuthLayout
      icon={<Settings className="w-10 h-10" />}
      title="Admin Login"
      subtitle="Access the admin dashboard"
      iconBgClass="bg-[#3baff3]/20"
      iconTextClass="text-[#3baff3]"
      showBackButton={!showSuccess}
    >
      <AuthForm
        mode="login"
        role="admin"
        icon={<Settings className="w-10 h-10" />}
        title="Admin Login"
        subtitle="Access the admin dashboard"
        colorClass="bg-[#3baff3] hover:bg-[#3baff3]/90 text-white"
        onSuccessChange={setShowSuccess}
      />
    </AuthLayout>
  );
};

export default AdminLogin;

