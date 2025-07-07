import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { supabase, Contact } from '../lib/supabase';
import toast, { Toaster } from 'react-hot-toast';
import {
  Users,
  MessageSquare,
  Eye,
  Trash2,
  CheckCircle,
  AlertCircle,
  LogOut,
  Search,
  Filter,
  User,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error: any) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (id: string, status: Contact['status']) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setContacts(contacts.map(contact => 
        contact.id === id ? { ...contact, status } : contact
      ));

      toast.success('Contact status updated');
    } catch (error: any) {
      console.error('Error updating contact:', error);
      toast.error('Failed to update contact');
    }
  };

  const deleteContact = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;

    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setContacts(contacts.filter(contact => contact.id !== id));
      toast.success('Contact deleted');
    } catch (error: any) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      toast.success('Signed out successfully');
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const analytics = {
    total: contacts.length,
    new: contacts.filter(c => c.status === 'new').length,
    read: contacts.filter(c => c.status === 'read').length,
    replied: contacts.filter(c => c.status === 'replied').length,
  };

  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'read': return 'bg-yellow-500';
      case 'replied': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: Contact['status']) => {
    switch (status) {
      case 'new': return <AlertCircle className="w-4 h-4" />;
      case 'read': return <Eye className="w-4 h-4" />;
      case 'replied': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-slate-900 text-white">
        {/* Navigation Header */}
        <motion.nav 
          className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50 backdrop-blur-sm"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link 
                  to="/" 
                  className="font-bold text-2xl text-blue-400 hover:text-blue-300 transition-colors"
                >
                  BD
                </Link>
                <span className="text-slate-400">•</span>
                <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-400">
                  Welcome, {user?.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </motion.nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <motion.p 
                    className="text-slate-400 text-sm mb-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Total Contacts
                  </motion.p>
                  <motion.p 
                    className="text-3xl font-bold text-blue-400"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
                  >
                    {analytics.total}
                  </motion.p>
                </div>
                <motion.div 
                  className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30"
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                >
                  <Users className="w-6 h-6 text-blue-400" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.2,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-yellow-500 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/20 group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <motion.p 
                    className="text-slate-400 text-sm mb-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    New Messages
                  </motion.p>
                  <motion.p 
                    className="text-3xl font-bold text-yellow-400"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
                  >
                    {analytics.new}
                  </motion.p>
                </div>
                <motion.div 
                  className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/30"
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                >
                  <AlertCircle className="w-6 h-6 text-yellow-400" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.3,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-orange-500 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/20 group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <motion.p 
                    className="text-slate-400 text-sm mb-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Read
                  </motion.p>
                  <motion.p 
                    className="text-3xl font-bold text-orange-400"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 150 }}
                  >
                    {analytics.read}
                  </motion.p>
                </div>
                <motion.div 
                  className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30"
                  whileHover={{ scale: 1.2 }}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    transition: { duration: 2, repeat: Infinity }
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Eye className="w-6 h-6 text-orange-400" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.4,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-green-500 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20 group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <motion.p 
                    className="text-slate-400 text-sm mb-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    Replied
                  </motion.p>
                  <motion.p 
                    className="text-3xl font-bold text-green-400"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.7, type: "spring", stiffness: 150 }}
                  >
                    {analytics.replied}
                  </motion.p>
                </div>
                <motion.div 
                  className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30"
                  whileHover={{ 
                    scale: 1.2,
                    rotate: [0, 360]
                  }}
                  transition={{ duration: 0.8 }}
                >
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ 
              duration: 0.7, 
              delay: 0.8,
              type: "spring",
              stiffness: 120
            }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
            }}
            className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-6"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Filter className="text-slate-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Contacts Table */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: 1.0,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{
              scale: 1.01,
              transition: { duration: 0.3 }
            }}
            className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-700 bg-slate-800">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                </div>
                <span>Contact Messages ({filteredContacts.length})</span>
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredContacts.map((contact, index) => (
                    <motion.tr
                      key={contact.id}
                      initial={{ opacity: 0, x: -50, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: 1.2 + (index * 0.1),
                        type: "spring",
                        stiffness: 120
                      }}
                      whileHover={{
                        scale: 1.02,
                        x: 5,
                        backgroundColor: "rgb(51, 65, 85)",
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="hover:bg-slate-700 transition-all duration-200 cursor-pointer border-l-2 border-transparent hover:border-blue-500"
                      onClick={() => setSelectedContact(contact)}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-medium">
                            {contact.first_name} {contact.last_name}
                          </p>
                          {contact.message && (
                            <p className="text-slate-400 text-sm truncate max-w-xs">
                              {contact.message}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{contact.email}</td>
                      <td className="px-6 py-4 text-slate-300">{contact.phone || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(contact.status)}`}>
                          {getStatusIcon(contact.status)}
                          <span className="capitalize">{contact.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {new Date(contact.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={contact.status}
                            onChange={(e) => {
                              e.stopPropagation();
                              updateContactStatus(contact.id, e.target.value as Contact['status']);
                            }}
                            className="bg-slate-600 border border-slate-500 rounded px-2 py-1 text-xs text-white focus:outline-none hover:bg-slate-500 transition-colors"
                          >
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                          </select>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteContact(contact.id);
                            }}
                            className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {filteredContacts.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-300 text-lg">No contacts found</p>
                  <p className="text-slate-500 text-sm">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filters' 
                      : 'Contacts will appear here when people reach out'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Contact Detail Modal */}
        {selectedContact && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedContact(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50, rotateX: -15 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ 
                opacity: 0, 
                scale: 0.8, 
                y: 50,
                transition: { duration: 0.2 }
              }}
              transition={{ 
                duration: 0.5,
                type: "spring",
                stiffness: 100
              }}
              whileInView={{
                boxShadow: [
                  "0 0 0 rgba(59, 130, 246, 0)",
                  "0 0 20px rgba(59, 130, 246, 0.3)",
                  "0 0 0 rgba(59, 130, 246, 0)"
                ],
                transition: { duration: 2, repeat: Infinity }
              }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-700 bg-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-400" />
                    </div>
                    <span>Contact Details</span>
                  </h3>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-all duration-200"
                  >
                    <span className="text-xl">✕</span>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Name Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
                    <label className="block text-sm font-medium text-blue-400 mb-2 flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      First Name
                    </label>
                    <p className="text-white font-medium text-lg">{selectedContact.first_name}</p>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
                    <label className="block text-sm font-medium text-purple-400 mb-2 flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                      Last Name
                    </label>
                    <p className="text-white font-medium text-lg">{selectedContact.last_name}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
                  <label className="block text-sm font-medium text-green-400 mb-2 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </label>
                  <p className="text-white font-medium text-lg break-all">{selectedContact.email}</p>
                </div>

                {/* Phone */}
                {selectedContact.phone && (
                  <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
                    <label className="block text-sm font-medium text-yellow-400 mb-2 flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      Phone
                    </label>
                    <p className="text-white font-medium text-lg">{selectedContact.phone}</p>
                  </div>
                )}

                {/* Message */}
                {selectedContact.message && (
                  <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
                    <label className="block text-sm font-medium text-indigo-400 mb-3 flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </label>
                    <div className="bg-slate-600 p-4 rounded-lg border border-slate-500">
                      <p className="text-white leading-relaxed whitespace-pre-wrap">
                      {selectedContact.message}
                    </p>
                    </div>
                  </div>
                )}

                {/* Status and Date Row */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Status</label>
                    <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(selectedContact.status)}`}>
                      {getStatusIcon(selectedContact.status)}
                      <span className="capitalize">{selectedContact.status}</span>
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Received
                    </label>
                    <p className="text-white">{new Date(selectedContact.created_at).toLocaleString()}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <motion.div 
                  className="flex space-x-3 pt-4 border-t border-slate-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.button
                    onClick={() => updateContactStatus(selectedContact.id, 'read')}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg flex items-center justify-center space-x-2"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 10px 30px rgba(234, 88, 12, 0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Eye className="w-4 h-4" />
                    <span>Mark as Read</span>
                  </motion.button>
                  <motion.button
                    onClick={() => updateContactStatus(selectedContact.id, 'replied')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg flex items-center justify-center space-x-2"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 10px 30px rgba(34, 197, 94, 0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark as Replied</span>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard; 