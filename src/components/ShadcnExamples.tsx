import React from 'react';
import { 
  Star, 
  Code, 
  Download, 
  Github, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  Trophy,
  Zap,
  Heart,
  ExternalLink,
  User,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ShadcnExamples: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Zap className="text-yellow-400" />
            Shadcn/UI + Lucide Demo
            <Zap className="text-yellow-400" />
          </h1>
          <p className="text-gray-300 text-lg">Exemple moderne de componente React cu design frumos</p>
        </div>

        {/* Buttons Section */}
        <Card className="bg-black/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="text-blue-400" />
              Butoane Interactive
            </CardTitle>
            <CardDescription className="text-gray-400">
              Diferite variante de butoane cu iconuri Lucide
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="default" className="flex items-center gap-2">
                <Github size={16} />
                GitHub
              </Button>
              
              <Button variant="secondary" className="flex items-center gap-2">
                <Download size={16} />
                Download CV
              </Button>
              
              <Button variant="outline" className="flex items-center gap-2">
                <Mail size={16} />
                Contact Me
              </Button>
              
              <Button variant="destructive" className="flex items-center gap-2">
                <XCircle size={16} />
                Delete
              </Button>
              
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ExternalLink size={14} />
                Visit Site
              </Button>
              
              <Button size="lg" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600">
                <Star size={18} />
                Premium
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Contact Card */}
          <Card className="bg-black/50 border-gray-700 hover:border-blue-500 transition-colors">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="text-blue-400" />
                Contact Info
              </CardTitle>
              <CardDescription className="text-gray-400">
                Informații de contact profesionale
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail size={16} className="text-blue-400" />
                <span>beniamindumitriu@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone size={16} className="text-green-400" />
                <span>+40747651829</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin size={16} className="text-red-400" />
                <span>Suceava, România</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                <Mail size={16} className="mr-2" />
                Send Message
              </Button>
            </CardFooter>
          </Card>

          {/* Skills Card */}
          <Card className="bg-black/50 border-gray-700 hover:border-purple-500 transition-colors">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Code className="text-purple-400" />
                Tech Skills
              </CardTitle>
              <CardDescription className="text-gray-400">
                Tehnologii și limbaje de programare
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-blue-600 text-white">React</Badge>
                <Badge variant="secondary" className="bg-yellow-600 text-white">JavaScript</Badge>
                <Badge variant="secondary" className="bg-blue-700 text-white">TypeScript</Badge>
                <Badge variant="secondary" className="bg-green-600 text-white">Node.js</Badge>
                <Badge variant="secondary" className="bg-orange-600 text-white">Python</Badge>
                <Badge variant="secondary" className="bg-red-600 text-white">Java</Badge>
              </div>
              <div className="text-gray-300 text-sm">
                <p>✨ 5+ ani experiență în dezvoltare web</p>
                <p>🚀 Specializat în React și ecosistemul modern JS</p>
              </div>
            </CardContent>
          </Card>

          {/* Achievements Card */}
          <Card className="bg-black/50 border-gray-700 hover:border-yellow-500 transition-colors">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="text-yellow-400" />
                Achievements
              </CardTitle>
              <CardDescription className="text-gray-400">
                Realizări și recunoașteri profesionale
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle size={16} className="text-green-400 mt-1" />
                <div className="text-gray-300">
                  <p className="font-medium">ASSIST Tech Challenge 2023</p>
                  <p className="text-sm text-gray-400">Locul I - Primul premiu</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={16} className="text-green-400 mt-1" />
                <div className="text-gray-300">
                  <p className="font-medium">Senior Developer</p>
                  <p className="text-sm text-gray-400">5+ proiecte majore livrate</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={16} className="text-green-400 mt-1" />
                <div className="text-gray-300">
                  <p className="font-medium">Team Lead</p>
                  <p className="text-sm text-gray-400">Experiență conducere echipă</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Status Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-400" size={20} />
              <div>
                <h3 className="text-green-400 font-medium">Shadcn/UI Configurat cu Succes!</h3>
                <p className="text-green-300/80 text-sm">Toate componentele funcționează perfect</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Info className="text-blue-400" size={20} />
              <div>
                <h3 className="text-blue-400 font-medium">Lucide Icons Activ</h3>
                <p className="text-blue-300/80 text-sm">700+ iconuri moderne disponibile</p>
              </div>
            </div>
          </div>

        </div>

        {/* Interactive Footer */}
        <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                <Heart className="text-red-400" />
                Gata de Utilizare!
              </h3>
              <p className="text-gray-300">
                Acum poți folosi aceste componente moderne în aplicația ta React
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" size="sm">
                  <Github size={16} className="mr-2" />
                  Vezi Codul
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Star size={16} className="mr-2" />
                  Folosește în CV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default ShadcnExamples;