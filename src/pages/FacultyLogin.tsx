import { useState } from 'react';
import { Users } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import AuthForm from '@/components/AuthForm';

const FacultyLogin = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <AuthLayout
      icon={<Users className="w-10 h-10" />}
      title="Faculty Login"
      subtitle="Access your faculty dashboard"
      iconBgClass="bg-[#ff8c42]/20"
      iconTextClass="text-[#ff8c42]"
      showBackButton={!showSuccess}
    >
      <AuthForm
        mode="login"
        role="faculty"
        icon={<Users className="w-10 h-10" />}
        title="Faculty Login"
        subtitle="Access your faculty dashboard"
        colorClass="bg-[#ff8c42] hover:bg-[#ff8c42]/90 text-white"
        onSuccessChange={setShowSuccess}
      />
    </AuthLayout>
  );
};

export default FacultyLogin;

