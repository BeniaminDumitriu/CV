import React from 'react';
import {
  // Navigation & UI
  Home,
  User,
  Code,
  FolderOpen,
  Settings,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  ArrowRight,
  
  // Communication
  Mail,
  Phone,
  MessageCircle,
  Send,
  
  // Technology
  Gamepad2,
  Monitor,
  Smartphone,
  Laptop,
  Server,
  Database,
  Globe,
  Wifi,
  
  // Actions
  Download,
  Upload,
  Search,
  Plus,
  Minus,
  Edit,
  Trash2,
  Save,
  
  // Media
  Play,
  Pause,
  Volume2,
  Image,
  Video,
  Music,
  
  // Social & External
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  
  // Decorative
  Star,
  Heart,
  Award,
  Trophy,
  Sparkles,
  Zap,
  
  // Interface Elements
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Calendar,
  Clock,
  MapPin,
  
  // Status
  Check,
  AlertTriangle,
  Info,
  HelpCircle,
  
  // Controls
  MousePointer,
  Keyboard,
  Volume1,
  VolumeX
} from 'lucide-react';

const LucideIconsDemo: React.FC = () => {
  const iconSections = [
    {
      title: "Navigation & UI",
      icons: [
        { Icon: Home, name: "Home" },
        { Icon: User, name: "User" },
        { Icon: Code, name: "Code" },
        { Icon: FolderOpen, name: "FolderOpen" },
        { Icon: Settings, name: "Settings" },
        { Icon: Menu, name: "Menu" },
        { Icon: X, name: "X" },
        { Icon: ArrowLeft, name: "ArrowLeft" },
        { Icon: ArrowRight, name: "ArrowRight" }
      ]
    },
    {
      title: "Communication",
      icons: [
        { Icon: Mail, name: "Mail" },
        { Icon: Phone, name: "Phone" },
        { Icon: MessageCircle, name: "MessageCircle" },
        { Icon: Send, name: "Send" }
      ]
    },
    {
      title: "Technology",
      icons: [
        { Icon: Gamepad2, name: "Gamepad2" },
        { Icon: Monitor, name: "Monitor" },
        { Icon: Smartphone, name: "Smartphone" },
        { Icon: Laptop, name: "Laptop" },
        { Icon: Server, name: "Server" },
        { Icon: Database, name: "Database" },
        { Icon: Globe, name: "Globe" },
        { Icon: Wifi, name: "Wifi" }
      ]
    },
    {
      title: "Actions",
      icons: [
        { Icon: Download, name: "Download" },
        { Icon: Upload, name: "Upload" },
        { Icon: Search, name: "Search" },
        { Icon: Plus, name: "Plus" },
        { Icon: Minus, name: "Minus" },
        { Icon: Edit, name: "Edit" },
        { Icon: Trash2, name: "Trash2" },
        { Icon: Save, name: "Save" }
      ]
    },
    {
      title: "Decorative",
      icons: [
        { Icon: Star, name: "Star" },
        { Icon: Heart, name: "Heart" },
        { Icon: Award, name: "Award" },
        { Icon: Trophy, name: "Trophy" },
        { Icon: Sparkles, name: "Sparkles" },
        { Icon: Zap, name: "Zap" }
      ]
    },
    {
      title: "Social",
      icons: [
        { Icon: Github, name: "Github" },
        { Icon: Linkedin, name: "Linkedin" },
        { Icon: Twitter, name: "Twitter" },
        { Icon: ExternalLink, name: "ExternalLink" }
      ]
    }
  ];

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Lucide Icons Demo</h1>
      
      {iconSections.map((section) => (
        <div key={section.title} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">{section.title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {section.icons.map(({ Icon, name }) => (
              <div key={name} className="bg-white/5 p-4 rounded-lg border border-white/10 hover:border-white/20 transition-all">
                <div className="flex flex-col items-center space-y-2">
                  <Icon size={24} className="text-blue-400" />
                  <span className="text-sm text-gray-300 text-center">{name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <div className="mt-12 p-6 bg-white/5 rounded-lg border border-white/10">
        <h3 className="text-xl font-semibold mb-4 text-green-400">Cum să folosești iconurile:</h3>
        <div className="space-y-2 text-sm font-mono bg-black/30 p-4 rounded">
          <div className="text-gray-300">// 1. Importă iconurile de care ai nevoie:</div>
          <div className="text-blue-300">import {`{ Home, User, Mail, Star }`} from 'lucide-react';</div>
          <div className="text-gray-300 mt-2">// 2. Folosește-le în componentele tale:</div>
          <div className="text-green-300">&lt;Home size={`{20}`} className="text-blue-400" /&gt;</div>
          <div className="text-green-300">&lt;Mail size={`{16}`} /&gt;</div>
          <div className="text-green-300">&lt;Star size={`{24}`} className="text-yellow-400" /&gt;</div>
        </div>
      </div>
    </div>
  );
};

export default LucideIconsDemo; 