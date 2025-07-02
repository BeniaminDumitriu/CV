import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Home, 
  User, 
  Code, 
  FolderOpen, 
  Gamepad2, 
  Mail, 
  Phone,
  ArrowLeft,
  MousePointer,
  Sparkles
} from 'lucide-react';
import LoadingScreen from './LoadingScreen';
import HeroSection from './HeroSection';
import { useNavigate } from 'react-router-dom';

const MainPortfolio: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Add custom CSS for 3D effects
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .perspective-1000 {
        perspective: 1000px;
      }
      .preserve-3d {
        transform-style: preserve-3d;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Cleanup code is now handled in GamePage component

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleEnterGame = () => {
    navigate('/game');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactClick = () => {
    navigate('/contact');
  };

  return (
    <div className="App bg-black text-white overflow-x-hidden">
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen 
            key="loading" 
            onLoadingComplete={handleLoadingComplete} 
          />
        )}
      </AnimatePresence>

      {!isLoading && (
        <div className="min-h-screen">
          {/* Navigation */}
          <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  BD
                </div>
                <div className="hidden md:flex space-x-8">
                  <button onClick={() => scrollToSection('hero')} className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
                    <Home size={16} />
                    <span>Home</span>
                  </button>
                  <button onClick={() => scrollToSection('about')} className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
                    <User size={16} />
                    <span>About</span>
                  </button>
                  <button onClick={() => scrollToSection('skills')} className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
                    <Code size={16} />
                    <span>Skills</span>
                  </button>
                  <button onClick={() => scrollToSection('projects')} className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
                    <FolderOpen size={16} />
                    <span>Projects</span>
                  </button>
                  <button onClick={handleEnterGame} className="flex items-center space-x-2 hover:text-purple-400 transition-colors">
                    <Gamepad2 size={16} />
                    <span>Game Mode</span>
                  </button>
                  <button onClick={handleContactClick} className="flex items-center space-x-2 hover:text-green-400 transition-colors bg-green-600/20 px-3 py-1 rounded-lg">
                    <Mail size={16} />
                    <span>Contact Me</span>
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* Hero Section */}
          <HeroSection />
          
          {/* About Section */}
          <section id="about" className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center py-20">
            <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  About Me
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Hello! I'm <span className="text-blue-400 font-semibold">Beniamin Dumitriu</span>, 
                  a web developer passionate about robotics and programming.
                </p>
                <p className="text-lg text-gray-400 leading-relaxed">
                  With a <span className="text-purple-400">Computer Science degree from Stefan cel Mare University</span> (2020-2024),
                  I've developed a passion for modern technologies. I adapt easily to new people and enjoy being engaged in constructive discussions.
                  My hobbies include traveling, cycling, and playing volleyball.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <h3 className="text-blue-400 font-semibold mb-2 flex items-center space-x-2">
                      <Mail size={16} />
                      <span>Contact</span>
                    </h3>
                    <p className="text-sm text-gray-300">beniamindumitriu@gmail.com</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <h3 className="text-purple-400 font-semibold mb-2 flex items-center space-x-2">
                      <Phone size={16} />
                      <span>Phone</span>
                    </h3>
                    <p className="text-sm text-gray-300">+40747651829</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="bg-blue-500/20 p-8 rounded-2xl border border-white/10">
                  <h3 className="text-2xl font-bold mb-6 text-center">Journey Highlights</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-300">🎓 Computer Science Degree - Stefan cel Mare (2020-2024)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-300">💼 Junior Web Developer - Navitech Systems (2024-Present)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-300">🏆 ASSIST Tech Challenge 2023 - First Place</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-300">🚀 Passionate about robotics and new technologies</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Skills Section */}
          <section id="skills" className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center py-20">
            <div className="max-w-7xl flex flex-col mx-auto px-4">
              <motion.h2 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500"
              >
                Technical Arsenal
              </motion.h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {/* Languages */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="bg-blue-500/10 p-6 md:pr-32 rounded-xl border border-white/10"
                >
                  <h3 className="text-2xl font-bold mb-6 text-blue-400">💻 Languages</h3>
                  <div className="space-y-3">
                    {['C/C++', 'Python', 'Java', 'JavaScript', 'TypeScript', 'Kotlin', 'C#'].map((skill, i) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-gray-300">{skill}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Frameworks */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="bg-green-500/10 p-6 rounded-xl border border-white/10"
                >
                  <h3 className="text-2xl font-bold mb-6 text-green-400">🚀 Frameworks</h3>
                  <div className="space-y-3">
                    {['React', 'Svelte', 'NestJs', 'Tailwind CSS', 'HTML', 'CSS'].map((skill, i) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-gray-300">{skill}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Tools */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="bg-purple-500/10 p-6 rounded-xl border border-white/10"
                >
                  <h3 className="text-2xl font-bold mb-6 text-purple-400">🔧 Tools & Tech</h3>
                  <div className="space-y-3">
                    {['GitHub', 'BitBucket', 'Eclipse', 'SQL', 'Android Studio', 'OOP', 'JSON', 'XAML'].map((skill, i) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-gray-300">{skill}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section id="projects" className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center py-20">
            <div className="max-w-6xl mx-auto px-4">
              <motion.h2 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500"
              >
                Projects
              </motion.h2>
              
              {/* Featured Project - Second.vet - GOD LEVEL ANIMATIONS 🔥✨ */}
              <motion.div
                initial={{ opacity: 0, y: 100, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  duration: 1.2, 
                  ease: [0.25, 0.1, 0.25, 1],
                  staggerChildren: 0.1
                }}
                className="mb-12 perspective-1000"
              >
                <motion.div
                  onClick={() => window.open('https://second.vet/', '_blank')}
                  className="relative cursor-pointer group overflow-hidden"
                  whileHover="hover"
                  initial="initial"
                  variants={{
                    initial: { 
                      scale: 1,
                      rotateY: 0,
                      z: 0
                    },
                    hover: { 
                      scale: 1.03,
                      rotateY: 2,
                      z: 50,
                      transition: {
                        duration: 0.3,
                        ease: "easeOut"
                      }
                    }
                  }}
                >
                  {/* Animated Background Gradient - ROTATING CONIC */}
                  <motion.div 
                    className="absolute inset-0 rounded-xl opacity-75"
                    style={{
                      background: `conic-gradient(from 0deg, 
                        #8b5cf6, #a855f7, #c084fc, #d8b4fe, 
                        #e879f9, #f0abfc, #fbbf24, #f59e0b,
                        #8b5cf6)`
                    }}
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  {/* Pulsing Glow Effect */}
                  <motion.div 
                    className="absolute -inset-2 rounded-xl blur-xl opacity-50"
                    style={{
                      background: `radial-gradient(circle, 
                        rgba(139, 92, 246, 0.6) 0%, 
                        rgba(168, 85, 247, 0.4) 35%, 
                        transparent 70%)`
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Lightning Border Effect */}
                  <motion.div 
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: `linear-gradient(45deg, transparent 30%, rgba(139, 92, 246, 0.8) 50%, transparent 70%)`
                    }}
                    animate={{
                      backgroundPosition: ["0% 0%", "200% 200%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  {/* Main Card Content */}
                  <motion.div
                    className="relative z-10 bg-gradient-to-br from-purple-900/95 via-violet-800/95 to-indigo-900/95 p-8 rounded-xl border border-purple-400/40 backdrop-blur-xl"
                    variants={{
                      initial: { backgroundPosition: "0% 50%" },
                      hover: { 
                        backgroundPosition: "100% 50%",
                        transition: { duration: 0.5 }
                      }
                    }}
                  >
                    {/* Floating Particles - OPTIMIZED */}
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full opacity-60"
                        style={{
                          width: `${2 + (i % 3)}px`,
                          height: `${2 + (i % 3)}px`,
                          background: i % 3 === 0 ? '#c084fc' : i % 3 === 1 ? '#a855f7' : '#8b5cf6',
                          left: `${10 + (i * 8) % 80}%`,
                          top: `${5 + (i * 7) % 90}%`,
                        }}
                        animate={{
                          y: [-15, -35, -15],
                          x: [-8, 8, -8],
                          opacity: [0.2, 0.8, 0.2],
                          scale: [1, 1.5, 1],
                        }}
                        transition={{
                          duration: 4 + (i * 0.3),
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                    
                    {/* Content with Advanced Animations */}
                    <motion.div
                      variants={{
                        initial: { y: 0 },
                        hover: { y: -5 }
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <motion.div 
                            className="flex items-center space-x-3 mb-2"
                            variants={{
                              initial: { scale: 1 },
                              hover: { scale: 1.05 }
                            }}
                          >
                            <motion.span 
                              className="text-3xl"
                              animate={{ 
                                rotate: [0, 5, -5, 0],
                                scale: [1, 1.1, 1]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              🩺
                            </motion.span>
                            <motion.h3 
                              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-purple-600"
                              style={{
                                backgroundSize: "200% 100%"
                              }}
                              animate={{
                                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear"
                              }}
                            >
                              Second.vet
                            </motion.h3>
                            <motion.span 
                              className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm font-bold text-purple-400"
                              animate={{
                                boxShadow: [
                                  "0 0 5px rgba(139, 92, 246, 0.3)",
                                  "0 0 20px rgba(139, 92, 246, 0.6)",
                                  "0 0 5px rgba(139, 92, 246, 0.3)"
                                ]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              ✨ LATEST
                            </motion.span>
                          </motion.div>
                          
                          <motion.p 
                            className="text-xl text-gray-300 mb-4 leading-relaxed"
                            variants={{
                              initial: { opacity: 0.8 },
                              hover: { opacity: 1 }
                            }}
                          >
                            Expert X-ray interpretation platform for pets - Connect with certified veterinarians for fast and reliable insights into your pet's health through our easy-to-use platform.
                          </motion.p>
                          
                          <div className="grid md:grid-cols-3 gap-4 mb-6">
                            {[
                              { icon: "⚡", text: "24/7 Available", color: "purple" },
                              { icon: "👨‍⚕️", text: "Certified Vets", color: "violet" },
                              { icon: "🚀", text: "Fast Results", color: "indigo" }
                            ].map((item, i) => (
                              <motion.div 
                                key={item.text}
                                className="flex items-center space-x-2"
                                variants={{
                                  initial: { x: -10, opacity: 0 },
                                  hover: { x: 0, opacity: 1 }
                                }}
                                transition={{ delay: i * 0.1 }}
                              >
                                <motion.div 
                                  className={`w-3 h-3 bg-${item.color}-500 rounded-full`}
                                  animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.7, 1, 0.7]
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.3
                                  }}
                                />
                                <span className={`text-${item.color}-400 font-semibold`}>
                                  {item.icon} {item.text}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <motion.div 
                        className="flex flex-wrap gap-2"
                        variants={{
                          initial: { opacity: 0.8 },
                          hover: { opacity: 1 }
                        }}
                      >
                        {["Veterinary Tech", "X-ray Analysis", "Pet Health", "Telemedicine", "Professional Platform"].map((tech, i) => (
                          <motion.span 
                            key={tech} 
                            className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-mono"
                            whileHover={{ 
                              scale: 1.05,
                              backgroundColor: "rgba(139, 92, 246, 0.2)",
                              borderColor: "rgba(139, 92, 246, 0.4)"
                            }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </motion.div>
                      
                      <motion.div 
                        className="mt-6 flex items-center justify-between"
                        variants={{
                          initial: { opacity: 0.7 },
                          hover: { opacity: 1 }
                        }}
                      >
                        <div className="flex items-center space-x-2 text-gray-400">
                          <span className="text-sm">Visit live platform</span>
                          <motion.svg 
                            className="w-4 h-4" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            animate={{
                              x: [0, 3, 0],
                              y: [0, -2, 0]
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </motion.svg>
                        </div>
                        <div className="text-sm text-gray-500 font-mono">second.vet</div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "VinylLaz",
                    description: "Vinyl records marketplace",
                    tech: ["TypeScript", "Svelte", "Tailwind"],
                    color: "from-purple-500 to-pink-500",
                    url: "https://vinyllaz.com/"
                  },
                  {
                    title: "Nodart", 
                    description: "Macrame shop",
                    tech: ["TypeScript", "Svelte", "Tailwind"],
                    color: "from-green-500 to-teal-500",
                    url: "https://nodart.ro/"
                  },
                  {
                    title: "Anthem",
                    description: "Modern real estate website",
                    tech: ["TypeScript", "Svelte", "Tailwind"],
                    color: "from-orange-500 to-red-500",
                    url: "https://anthem.ro/"
                  },
                  {
                    title: "Eventuary",
                    description: "Event management website",
                    tech: ["TypeScript", "Svelte", "Tailwind"],
                    color: "from-blue-500 to-purple-500",
                    url: "https://eventuary.ro/"
                  },
                  {
                    title: "Patternest",
                    description: "Pattern design website",
                    tech: ["TypeScript", "Svelte", "Tailwind"],
                    color: "from-pink-500 to-red-500",
                    url: "https://patternest.com/"
                  },
                  {
                    title: "Town Guardian",
                    description: "Incident reporting application",
                    tech: ["Java"],
                    color: "from-yellow-500 to-orange-500"
                  },
                  {
                    title: "Weather App EFM32",
                    description: "Weather application on 32-bit microcontroller",
                    tech: ["C", "Eclipse"],
                    color: "from-cyan-500 to-blue-500"
                  }
                ].map((project, i) => (
                  <motion.div
                    key={project.title}
                    initial={{ opacity: 0, y: 50 }}
                    onClick={() => project.url && window.open(project.url, '_blank')}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 * i }}
                    whileHover={{ scale: 1.05 }}
                    className={`bg-gradient-to-br ${project.color}/10 p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all ${project.url ? 'cursor-pointer' : ''}`}
                  >
                    <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
                    <p className="text-gray-300 mb-4 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-white/10 rounded-full text-sm font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Game Section - The Surprise! */}
          <section id="game-section" className="min-h-screen bg-black flex items-center justify-center py-20">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="space-y-8"
              >
                <div className="relative flex items-center justify-center mb-8">
                  {/* Elegant geometric accent */}
                  <motion.div
                    className="absolute left-1/2 transform -translate-x-1/2 -top-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <svg width="120" height="8" viewBox="0 0 120 8" className="opacity-60">
                      <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="transparent" />
                          <stop offset="20%" stopColor="#a855f7" />
                          <stop offset="50%" stopColor="#ec4899" />
                          <stop offset="80%" stopColor="#ef4444" />
                          <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                      </defs>
                      <motion.line
                        x1="0" y1="4" x2="120" y2="4"
                        stroke="url(#lineGradient)"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        transition={{ duration: 1.2, delay: 0.3 }}
                      />
                      {/* Subtle dots */}
                      <motion.circle cx="30" cy="4" r="1.5" fill="#a855f7" opacity="0.8"
                        initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 1.2 }} />
                      <motion.circle cx="60" cy="4" r="2" fill="#ec4899"
                        initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 1.4 }} />
                      <motion.circle cx="90" cy="4" r="1.5" fill="#ef4444" opacity="0.8"
                        initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 1.6 }} />
                    </svg>
                  </motion.div>

                  <motion.h2 
                    className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    SURPRISE!
                    
                    {/* Subtle floating particles */}
                    <motion.div className="absolute inset-0 pointer-events-none">
                      {[1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-60"
                          style={{
                            left: `${20 + i * 25}%`,
                            top: `${10 + i * 5}%`,
                          }}
                          animate={{
                            y: [-10, 10, -10],
                            opacity: [0.6, 0.2, 0.6],
                          }}
                          transition={{
                            duration: 3 + i * 0.5,
                            repeat: Infinity,
                            delay: i * 0.5,
                          }}
                        />
                      ))}
                    </motion.div>
                  </motion.h2>

                  {/* Elegant bottom accent */}
                  <motion.div
                    className="absolute left-1/2 transform -translate-x-1/2 -bottom-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <svg width="80" height="4" viewBox="0 0 80 4" className="opacity-40">
                      <motion.rect
                        x="0" y="1" width="80" height="2" rx="1"
                        fill="url(#lineGradient)"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                      />
                    </svg>
                  </motion.div>
                </div>
                <p className="text-2xl text-gray-300 mb-8">
                  Ready for something completely different?
                </p>
                <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                  Explore my CV in a completely immersive 3D world! Walk around, interact with objects, 
                  and discover my professional journey in the most unique way possible.
                </p>
                
                <motion.button
                  onClick={handleEnterGame}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center place-self-center space-x-3 px-12 py-6 text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 rounded-full
                           hover:from-purple-700 hover:to-pink-700 transition-all duration-300 
                           shadow-lg hover:shadow-purple-500/25 border border-purple-500/30"
                >
                  <Sparkles size={28} />
                  <span>Enter the 3D CV World</span>
                </motion.button>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                    <h3 className="text-purple-400 font-bold mb-2 flex items-center space-x-2">
                      <Home size={20} />
                      <span>Explore</span>
                    </h3>
                    <p className="text-sm text-gray-300">Walk through a virtual house containing my entire CV</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                    <h3 className="text-pink-400 font-bold mb-2 flex items-center space-x-2">
                      <MousePointer size={20} />
                      <span>Interact</span>
                    </h3>
                    <p className="text-sm text-gray-300">Press 'F' on objects to discover my skills and projects</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                    <h3 className="text-red-400 font-bold mb-2 flex items-center space-x-2">
                      <Sparkles size={20} />
                      <span>Enjoy</span>
                    </h3>
                    <p className="text-sm text-gray-300">Experience CV exploration like never before!</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default MainPortfolio; 