import { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import AuthForm from '@/components/AuthForm';

const StudentLogin = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <AuthLayout
      icon={<GraduationCap className="w-10 h-10" />}
      title="Student Login"
      subtitle="Access your student notice dashboard"
      iconBgClass="bg-[#3baff3]/20"
      iconTextClass="text-[#3baff3]"
      showBackButton={!showSuccess}
    >
      <AuthForm
        mode="login"
        role="student"
        icon={<GraduationCap className="w-10 h-10" />}
        title="Student Login"
        subtitle="Access your student notice dashboard"
        colorClass="bg-[#3baff3] hover:bg-[#3baff3]/90 text-white"
        onSuccessChange={setShowSuccess}
      />
    </AuthLayout>
  );
};

export default StudentLogin;

