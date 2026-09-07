import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = params;

  if (id === '01' || id === 'smart-hris') {
    return {
      title: "Smart HRIS | Cloud HR Management System",
      description: "Automate attendance, payroll, leave, and performance management with FIDA Global's cloud-based Smart HRIS — built for SMEs to multinationals.",
      keywords: "cloud HRIS software Sri Lanka, HR management system, employee self service portal, attendance and leave management, Human Resource Information Systems, Human Resource Management, Payroll Systems, Attendance Systems",
    };
  }
  if (id === '02' || id === 'access-control-attendance' || id === 'biometrics') {
    return {
      title: "Biometric Access Control | Attendance & Security System",
      description: "Secure your workplace with FIDA Global's biometric access control and attendance systems — fingerprint and face recognition technology for offices of any size.",
      keywords: "biometric attendance system Sri Lanka, access control system, fingerprint attendance machine, face recognition access control, Access Control System Solutions, Biometric Face Recognition, RFID System Solutions, ZKTeco",
    };
  }
  if (id === '03' || id === 'payroll-services' || id === 'fida-business-consultancy') {
    return {
      title: "Payroll Services | Automated Payroll Processing",
      description: "Simplify salary processing, tax calculations, and compliance with FIDA Global's automated payroll services for businesses of any size.",
      keywords: "payroll services Sri Lanka, payroll software, salary processing system, payroll outsourcing, Payroll Systems",
    };
  }
  if (id === '04' || id === 'task-manager') {
    return {
      title: "FIDA Task Manager | Team Productivity & Workflow Tool",
      description: "Plan, assign, and track tasks in real time with FIDA Task Manager — a simple workflow tool built for teams that need visibility and accountability.",
      keywords: "task management software, workflow automation tool, team productivity software, project tracking system",
    };
  }
  if (id === '05' || id === 'helpdesk') {
    return {
      title: "FIDA Helpdesk | Customer Support Ticketing System",
      description: "Manage support tickets, incidents, and customer inquiries in one place with FIDA Helpdesk — built for ICT, BPO, and service-driven businesses.",
      keywords: "helpdesk ticketing system Sri Lanka, customer support software, IT service desk software, incident management system, BPO",
    };
  }
  if (id === '06' || id === 'crm') {
    return {
      title: "FIDA CRM | Customer Relationship Management Software",
      description: "Track leads, manage relationships, and grow sales pipelines with FIDA CRM — built for Sri Lankan SMEs and enterprises alike.",
      keywords: "CRM software Sri Lanka, customer relationship management system, sales pipeline tool, lead management software",
    };
  }
  if (id === '07' || id === 'fida-ai') {
    return {
      title: "FIDA AI | Intelligent Business Automation Tools",
      description: "Discover FIDA AI, our suite of AI-powered tools designed to automate workflows and boost productivity for growing businesses in Sri Lanka.",
      keywords: "FIDA AI, AI business automation Sri Lanka, artificial intelligence software, intelligent workflow automation, Innovation, IoT",
    };
  }

  // Fallback
  return {
    title: "Solution Details | FIDA Global",
  };
}

export default function SolutionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
