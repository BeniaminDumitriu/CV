import React from 'react';
import { 
  Github, 
  Mail, 
  Phone, 
  Code, 
  Gamepad2, 
  Star, 
  MapPin, 
  Calendar,
  ExternalLink,
  Download,
  User,
  Settings,
  Trophy,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ModernComponents: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Zap className="text-yellow-400" size={40} />
            Shadcn/UI + Lucide Icons Demo
            <Star className="text-yellow-400" size={40} />
          </h1>
          <p className="text-gray-300 text-lg">
            Componente moderne și iconuri frumoase pentru aplicația ta React
          </p>
        </div>

        {/* Buttons Section */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings size={24} />
              Butoane Interactive
            </CardTitle>
            <CardDescription className="text-gray-300">
              Diferite stiluri de butoane cu iconuri Lucide
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button className="flex items-center gap-2">
                <Github size={16} />
                GitHub
              </Button>
              
              <Button variant="outline" className="flex items-center gap-2 border-white/20 text-white hover:bg-white/10">
                <Mail size={16} />
                Contact
              </Button>
              
              <Button variant="secondary" className="flex items-center gap-2">
                <Download size={16} />
                Download CV
              </Button>
              
              <Button variant="destructive" className="flex items-center gap-2">
                <Phone size={16} />
                Call Me
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Profile Card */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User size={20} />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin size={16} />
                <span>București, România</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar size={16} />
                <span>Disponibil acum</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">React</Badge>
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="secondary">Three.js</Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full border-white/20 text-white hover:bg-white/10">
                <ExternalLink size={14} className="mr-2" />
                View Profile
              </Button>
            </CardFooter>
          </Card>

          {/* Skills Card */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Code size={20} />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>React</span>
                  <span>90%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '90%'}}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>TypeScript</span>
                  <span>85%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Projects Card */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Gamepad2 size={20} />
                Latest Project
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <h3 className="text-lg font-semibold text-white">3D CV Interactive</h3>
              <p className="text-gray-300 text-sm">
                O aplicație React cu Three.js care prezintă CV-ul într-un mediu 3D interactiv.
              </p>
              <div className="flex items-center gap-2 text-yellow-400">
                <Trophy size={16} />
                <span className="text-sm">Featured Project</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="sm" className="w-full">
                <ExternalLink size={14} className="mr-2" />
                Explore
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Icon Grid */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Iconuri Lucide Disponibile</CardTitle>
            <CardDescription className="text-gray-300">
              Câteva dintre cele mai folosite iconuri din biblioteca Lucide
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-8 md:grid-cols-12 gap-4">
              {[
                Github, Mail, Phone, Code, User, Settings, Calendar, MapPin,
                Download, ExternalLink, Star, Trophy, Zap, Gamepad2
              ].map((Icon, index) => (
                <div key={index} className="flex items-center justify-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group">
                  <Icon size={24} className="text-gray-300 group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default ModernComponents; 