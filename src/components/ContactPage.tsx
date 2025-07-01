import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { sendContactEmails } from '../services/emailService';
import toast, { Toaster } from 'react-hot-toast';
import { Mail, Phone, User, MessageSquare, Send, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Form validation schema
const contactSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // 1. Save to database
      console.log('💾 Saving contact data to database...');
      
      const { error: dbError } = await supabase
        .from('contacts')
        .insert([{
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            phone: data.phone || null,
            message: data.message || null,
            status: 'new',
        }]);

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }
      
      console.log('✅ Contact saved to database successfully!');

      // 2. Send automated emails
      toast.loading('📧 Sending confirmation email...', { id: 'email-loading' });
      
      const emailResults = await sendContactEmails({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        message: data.message,
      });

      toast.dismiss('email-loading');

      // Show success messages based on email results
      if (emailResults.confirmationSent && emailResults.notificationSent) {
        toast.success('🎉 Mesajul a fost trimis cu succes! Vei primi un email de confirmare.');
      } else if (emailResults.confirmationSent) {
        toast.success('🎉 Mesajul a fost trimis! Vei primi un email de confirmare.');
        toast.error('⚠️ Nu am putut trimite notificarea către admin.');
      } else if (emailResults.notificationSent) {
        toast.success('🎉 Mesajul a fost trimis cu succes!');
        toast.error('⚠️ Nu am putut trimite email-ul de confirmare.');
      } else {
        toast.success('🎉 Mesajul a fost salvat! Te voi contacta în curând.');
        toast.error('⚠️ Nu am putut trimite email-urile automate.');
      }

      reset();
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      toast.error('Ceva nu a mers bine. Te rog încearcă din nou.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link 
                to="/" 
                className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
              >
                BD
              </Link>
              <Link
                to="/"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <ArrowLeft size={16} />
                <span>Back to Portfolio</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
                Let's Collaborate
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                If you want to collaborate, have a project in mind, or just want to say hello, 
                I'd love to hear from you! Fill out the form below and I'll get back to you as soon as possible.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8"
              >
                <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                  <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                    Get in Touch
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <Mail className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Email</p>
                        <p className="text-white font-medium">beniamindumitriu@gmail.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                        <Phone className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Phone</p>
                        <p className="text-white font-medium">+40 747 651 829</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-500/10 p-8 rounded-2xl border border-purple-500/20">
                  <h3 className="text-xl font-bold mb-4 text-purple-400">
                    🚀 What I'm Looking For
                  </h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>Frontend development projects</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Full-stack web applications</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Long-term collaborations</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span>Innovative tech challenges</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white/5 p-8 rounded-2xl border border-white/10 space-y-6">
                  <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
                    Send Me a Message
                  </h2>

                  {/* Name Fields */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <User className="inline w-4 h-4 mr-2" />
                        First Name *
                      </label>
                      <input
                        {...register('firstName')}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Your first name"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-400">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Last Name *
                      </label>
                      <input
                        {...register('lastName')}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Your last name"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-400">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Mail className="inline w-4 h-4 mr-2" />
                      Email Address *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Phone className="inline w-4 h-4 mr-2" />
                      Phone Number (Optional)
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="+40 123 456 789"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <MessageSquare className="inline w-4 h-4 mr-2" />
                      Message (Optional)
                    </label>
                    <textarea
                      {...register('message')}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Tell me about your project or just say hello!"
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage; 