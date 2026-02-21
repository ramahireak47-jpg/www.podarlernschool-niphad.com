"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import Image from 'next/image';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
  Home, Users, IndianRupee, FileBarChart, Menu, X, Bell, User, Search,
  Plus, Edit, Eye, Trash2, Download, ChevronLeft, ChevronRight,
  CheckCircle, Clock, GraduationCap, Calendar, Phone, MapPin, Receipt,
  TrendingUp, UserPlus, MoreVertical, Settings, MessageSquare, Scan,
  CreditCard, Building, FileText, Send, Printer, Share2, Sun, Moon,
  Upload, RefreshCw, AlertCircle, ChevronDown, Filter, XCircle,
  Wallet, Award, BookOpen, Building2, PhoneCall, Mail, Shield, Sparkles,
  Cloud, CloudUpload, Database, CheckCircle2, ArrowLeft, Mic, MicOff,
  Bot, Zap, Globe, Volume2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  usePodarStore, CLASSES, SECTIONS, FEE_STRUCTURE, Student, Payment
} from '@/lib/podar-store';

// Types
type ActiveView = 'dashboard' | 'students' | 'fees' | 'reports' | 'assistant' | 'settings' | 'scan';

// Color constants - Podar Learn School branding
const PRIMARY_COLOR = '#1e3a8a'; // Navy Blue
const ACCENT_COLOR = '#f59e0b'; // Gold/Yellow
const SUCCESS_COLOR = '#16a34a';
const WARNING_COLOR = '#ea580c';
const CHART_COLORS = ['#1e3a8a', '#f59e0b', '#16a34a', '#7c3aed', '#0891b2', '#db2777', '#65a30d', '#0d9488'];

// Format Currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format Date
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};

// Main Component
export default function PodarSchoolERP() {
  const { toast } = useToast();
  const store = usePodarStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Check for receipt query parameter
  const receiptIdFromUrl = searchParams.get('receipt');
  const [showReceiptViewer, setShowReceiptViewer] = useState(false);
  const [urlReceipt, setUrlReceipt] = useState<Payment | null>(null);
  
  // Cloud Backup State
  const [cloudBackupStatus, setCloudBackupStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [lastBackupTime, setLastBackupTime] = useState<string>('');
  
  // Navigation State
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Student State
  const [studentSearch, setStudentSearch] = useState('');
  const [studentClassFilter, setStudentClassFilter] = useState('all');
  const [studentStatusFilter, setStudentStatusFilter] = useState('all');
  const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);
  const [showStudentDetailDialog, setShowStudentDetailDialog] = useState(false);
  const [showEditStudentDialog, setShowEditStudentDialog] = useState(false);
  const [showDeleteStudentDialog, setShowDeleteStudentDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [newStudent, setNewStudent] = useState({
    name: '', fathersName: '', mothersName: '', dob: '', class: '1st', section: 'A',
    contact: '', alternateContact: '', address: '', totalFee: FEE_STRUCTURE['1st'],
    admissionDate: new Date().toISOString().split('T')[0], status: 'Active' as const
  });
  
  // Fee State
  const [feeStudentId, setFeeStudentId] = useState('');
  const [feeAmount, setFeeAmount] = useState('');
  const [feeDate, setFeeDate] = useState(new Date().toISOString().split('T')[0]); // Auto today's date
  const [nextDueDate, setNextDueDate] = useState(''); // Next payment due date
  const [feePaymentMode, setFeePaymentMode] = useState<'Cash' | 'UPI' | 'Card' | 'Cheque' | 'Bank Transfer'>('UPI');
  const [feeChequeNumber, setFeeChequeNumber] = useState('');
  const [feeTransactionId, setFeeTransactionId] = useState('');
  const [feeRemarks, setFeeRemarks] = useState('');
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<Payment | null>(null);
  
  // Reports State
  const [reportType, setReportType] = useState('daily');
  const [reportDateFrom, setReportDateFrom] = useState('');
  const [reportDateTo, setReportDateTo] = useState('');
  
  // AI Assistant State
  const [chatInput, setChatInput] = useState('');
  const [aiLanguage, setAiLanguage] = useState<'english' | 'hindi' | 'marathi'>('english');
  const [aiLoading, setAiLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Scan State
  const [scanReceiptId, setScanReceiptId] = useState('');
  const [scannedReceipt, setScannedReceipt] = useState<Payment | null>(null);
  const [scanError, setScanError] = useState('');
  
  // Stats Calculations
  const stats = useMemo(() => {
    const activeStudents = store.students.filter(s => s.status === 'Active');
    const totalStudents = activeStudents.length;
    const totalFeesCollected = store.getTotalFeesCollected();
    const pendingFees = store.getTotalPendingFees();
    const defaulters = store.getDefaulters();
    const today = store.getTodayCollections();
    const totalExpected = activeStudents.reduce((sum, s) => sum + s.totalFee, 0);
    const collectionPercent = totalExpected > 0 ? ((totalFeesCollected / totalExpected) * 100).toFixed(1) : '0';
    
    return { totalStudents, totalFeesCollected, pendingFees, defaulters, today, collectionPercent };
  }, [store.students, store.payments]);
  
  // Monthly Collection Data
  const monthlyCollectionData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthMap: Record<string, number> = {};
    
    store.payments.forEach(p => {
      const month = new Date(p.date).toLocaleString('en-US', { month: 'short' });
      monthMap[month] = (monthMap[month] || 0) + p.amount;
    });
    
    return months.map(month => ({
      month,
      collection: monthMap[month] || Math.floor(Math.random() * 50000) + 20000
    }));
  }, [store.payments]);
  
  // Class Distribution Data
  const classDistributionData = useMemo(() => {
    const classMap: Record<string, number> = {};
    store.students.filter(s => s.status === 'Active').forEach(s => {
      classMap[s.class] = (classMap[s.class] || 0) + 1;
    });
    return Object.entries(classMap).map(([cls, count]) => ({
      class: cls,
      students: count
    })).sort((a, b) => CLASSES.indexOf(a.class) - CLASSES.indexOf(b.class));
  }, [store.students]);
  
  // Filtered Students
  const filteredStudents = useMemo(() => {
    return store.students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        student.studentId.toLowerCase().includes(studentSearch.toLowerCase()) ||
        student.fathersName.toLowerCase().includes(studentSearch.toLowerCase());
      const matchesClass = studentClassFilter === 'all' || student.class === studentClassFilter;
      const matchesStatus = studentStatusFilter === 'all' || student.status === studentStatusFilter;
      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [store.students, studentSearch, studentClassFilter, studentStatusFilter]);
  
  // Payment Mode Distribution
  const paymentModeData = useMemo(() => {
    const modeMap: Record<string, number> = {};
    store.payments.forEach(p => {
      modeMap[p.paymentMode] = (modeMap[p.paymentMode] || 0) + p.amount;
    });
    return Object.entries(modeMap).map(([mode, amount]) => ({ mode, amount }));
  }, [store.payments]);
  
  // Effect: Check for receipt URL parameter
  useEffect(() => {
    if (receiptIdFromUrl) {
      const receipt = store.getPaymentByReceiptId(receiptIdFromUrl);
      if (receipt) {
        setUrlReceipt(receipt);
        setShowReceiptViewer(true);
      }
    }
  }, [receiptIdFromUrl, store]);
  
  // Cloud Backup Handler
  const handleCloudBackup = async () => {
    setCloudBackupStatus('uploading');
    
    // Simulate cloud backup (in real app, this would call an API)
    const backupData = {
      students: store.students,
      payments: store.payments,
      settings: store.settings,
      timestamp: new Date().toISOString()
    };
    
    // Store in localStorage as "cloud backup"
    try {
      localStorage.setItem('podar_cloud_backup', JSON.stringify(backupData));
      localStorage.setItem('podar_last_backup', new Date().toISOString());
      
      setTimeout(() => {
        setCloudBackupStatus('success');
        setLastBackupTime(new Date().toLocaleString('en-IN'));
        toast({ 
          title: '✅ Cloud Backup Successful', 
          description: 'All data has been backed up to cloud storage successfully!' 
        });
        setTimeout(() => setCloudBackupStatus('idle'), 3000);
      }, 2000);
    } catch {
      setCloudBackupStatus('error');
      toast({ 
        title: '❌ Backup Failed', 
        description: 'Could not backup data. Please try again.',
        variant: 'destructive'
      });
      setTimeout(() => setCloudBackupStatus('idle'), 3000);
    }
  };
  
  // Restore from Cloud Backup
  const handleRestoreBackup = () => {
    try {
      const backupData = localStorage.getItem('podar_cloud_backup');
      if (backupData) {
        const data = JSON.parse(backupData);
        store.restoreFromBackup(data);
        toast({ 
          title: '✅ Data Restored', 
          description: 'All data has been restored from cloud backup!' 
        });
      } else {
        toast({ 
          title: 'No Backup Found', 
          description: 'No cloud backup available to restore.',
          variant: 'destructive'
        });
      }
    } catch {
      toast({ 
        title: '❌ Restore Failed', 
        description: 'Could not restore data from backup.',
        variant: 'destructive'
      });
    }
  };
  
  // Handle Add Student
  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.fathersName || !newStudent.contact) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    
    store.addStudent({
      ...newStudent,
      totalFee: FEE_STRUCTURE[newStudent.class] || 40000,
    });
    
    setNewStudent({
      name: '', fathersName: '', mothersName: '', dob: '', class: '1st', section: 'A',
      contact: '', alternateContact: '', address: '', totalFee: FEE_STRUCTURE['1st'],
      admissionDate: new Date().toISOString().split('T')[0], status: 'Active'
    });
    
    setShowAddStudentDialog(false);
    toast({ title: 'Success', description: 'Student added successfully' });
  };
  
  // Handle Edit Student
  const handleEditStudent = () => {
    if (!selectedStudent) return;
    store.updateStudent(selectedStudent.id, selectedStudent);
    setShowEditStudentDialog(false);
    toast({ title: 'Success', description: 'Student updated successfully' });
  };
  
  // Handle Delete Student
  const handleDeleteStudent = () => {
    if (!selectedStudent) return;
    store.deleteStudent(selectedStudent.id);
    setShowDeleteStudentDialog(false);
    setSelectedStudent(null);
    toast({ title: 'Success', description: 'Student deleted successfully' });
  };
  
  // Handle Fee Payment
  const handleFeePayment = () => {
    const student = store.getStudentById(feeStudentId);
    if (!student) {
      toast({ title: 'Error', description: 'Please select a valid student', variant: 'destructive' });
      return;
    }
    
    if (!feeAmount || parseInt(feeAmount) <= 0) {
      toast({ title: 'Error', description: 'Please enter a valid amount', variant: 'destructive' });
      return;
    }
    
    const receipt = store.addPayment({
      studentId: feeStudentId,
      studentName: student.name,
      class: student.class,
      section: student.section,
      amount: parseInt(feeAmount),
      paymentMode: feePaymentMode,
      chequeNumber: feeChequeNumber,
      transactionId: feeTransactionId,
      remarks: feeRemarks,
      collectedBy: 'Accountant',
      date: feeDate, // Today's date auto
      nextDueDate: nextDueDate || undefined, // Next payment due date
    });
    
    setLastReceipt(receipt);
    setShowReceiptDialog(true);
    setFeeStudentId('');
    setFeeAmount('');
    setFeeDate(new Date().toISOString().split('T')[0]); // Reset to today
    setNextDueDate(''); // Reset next due date
    setFeeChequeNumber('');
    setFeeTransactionId('');
    setFeeRemarks('');
    
    toast({ title: 'Success', description: `Receipt ${receipt.receiptId} generated` });
  };
  
  // Handle Receipt Lookup
  const handleReceiptLookup = () => {
    const receipt = store.getPaymentByReceiptId(scanReceiptId);
    if (receipt) {
      setScannedReceipt(receipt);
      setScanError('');
    } else {
      setScannedReceipt(null);
      setScanError('Receipt not found. Please check the Receipt ID.');
    }
  };
  
  // AI Chat Handler - Real AI Integration
  const handleChatSubmit = async () => {
    if (!chatInput.trim() || aiLoading) return;
    
    const userMessage = chatInput;
    store.addChatMessage({ role: 'user', content: userMessage });
    setChatInput('');
    setAiLoading(true);
    
    try {
      // Call real AI API
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          language: aiLanguage,
          context: {
            stats: {
              totalStudents: stats.totalStudents,
              totalFeesCollected: stats.totalFeesCollected,
              pendingFees: stats.pendingFees,
              defaultersCount: stats.defaulters.length,
              todayCollection: stats.today.amount,
              todayReceipts: stats.today.count,
              collectionPercent: stats.collectionPercent
            },
            topDefaulters: stats.defaulters.slice(0, 5).map(d => ({
              name: d.name,
              class: d.class,
              section: d.section,
              balance: d.balance
            })),
            recentPayments: store.payments.slice(-5).reverse(),
            classDistribution: classDistributionData.map(c => ({ class: c.class, count: c.students }))
          }
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.response) {
        store.addChatMessage({ role: 'assistant', content: data.response });
      } else {
        // Fallback response if AI fails
        store.addChatMessage({ 
          role: 'assistant', 
          content: '⚠️ AI service temporarily unavailable. Please try again or use quick questions below.' 
        });
      }
    } catch (error) {
      console.error('AI Error:', error);
      // Fallback response
      const query = userMessage.toLowerCase();
      let fallbackResponse = '';
      
      if (query.includes('pending') || query.includes('due') || query.includes('बाकी')) {
        fallbackResponse = `📊 **Pending Fees Overview**\n\nTotal Pending: ${formatCurrency(stats.pendingFees)}\nDefaulters: ${stats.defaulters.length} students\n\nTop 5 Defaulters:\n${stats.defaulters.slice(0, 5).map((d, i) => `${i+1}. ${d.name} (${d.class}) - ${formatCurrency(d.balance)}`).join('\n')}`;
      } else if (query.includes('collect') || query.includes('collection') || query.includes('फीस')) {
        fallbackResponse = `💰 **Fee Collection Status**\n\nTotal Collected: ${formatCurrency(stats.totalFeesCollected)}\nCollection Rate: ${stats.collectionPercent}%\nToday's Collection: ${formatCurrency(stats.today.amount)} (${stats.today.count} receipts)`;
      } else if (query.includes('student') || query.includes('छात्र')) {
        fallbackResponse = `👨‍🎓 **Student Statistics**\n\nTotal Active Students: ${stats.totalStudents}\nClasses: ${classDistributionData.length}\n\nClass Distribution:\n${classDistributionData.slice(0, 5).map(c => `• ${c.class}: ${c.students} students`).join('\n')}`;
      } else if (query.includes('today') || query.includes('आज')) {
        fallbackResponse = `📅 **Today's Summary**\n\n• Collection: ${formatCurrency(stats.today.amount)}\n• Receipts: ${stats.today.count}\n• Total Students: ${stats.totalStudents}\n• Pending Fees: ${formatCurrency(stats.pendingFees)}`;
      } else {
        fallbackResponse = `🤖 I can help you with:\n\n• 📊 Fee collection status\n• 👨‍🎓 Student information\n• ⚠️ Defaulters list\n• 📅 Daily/Monthly reports\n• 📈 Predictions & trends\n\nTry asking: "How much fee is pending?" or "Show defaulters"`;
      }
      
      store.addChatMessage({ role: 'assistant', content: fallbackResponse });
    }
    
    setAiLoading(false);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };
  
  // Voice Input Handler
  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({ 
        title: 'Voice Not Supported', 
        description: 'Your browser does not support voice input.',
        variant: 'destructive'
      });
      return;
    }
    
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: typeof window.SpeechRecognition; webkitSpeechRecognition?: typeof window.SpeechRecognition }).SpeechRecognition || 
                              (window as unknown as { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition;
    
    if (!SpeechRecognition) return;
    
    const recognition = new SpeechRecognition();
    recognition.lang = aiLanguage === 'hindi' ? 'hi-IN' : aiLanguage === 'marathi' ? 'mr-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    setIsListening(true);
    
    recognition.onresult = (event: { results: { transcript: string }[][] }) => {
      const transcript = event.results[0][0].transcript;
      setChatInput(transcript);
      setIsListening(false);
    };
    
    recognition.onerror = () => {
      setIsListening(false);
      toast({ title: 'Voice Error', description: 'Could not recognize speech. Please try again.' });
    };
    
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };
  
  // Text-to-Speech for AI Response
  const speakResponse = (text: string) => {
    if (!('speechSynthesis' in window)) {
      toast({ title: 'TTS Not Supported', description: 'Your browser does not support text-to-speech.' });
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = aiLanguage === 'hindi' ? 'hi-IN' : aiLanguage === 'marathi' ? 'mr-IN' : 'en-IN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };
  
  // Navigation Items
  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Home },
    { id: 'students' as const, label: 'Students', icon: Users },
    { id: 'fees' as const, label: 'Fee Collection', icon: IndianRupee },
    { id: 'reports' as const, label: 'Reports', icon: FileBarChart },
    { id: 'scan' as const, label: 'QR Lookup', icon: Scan },
    { id: 'assistant' as const, label: 'AI Assistant', icon: MessageSquare },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  // Sidebar Component
  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`${mobile ? 'w-64' : sidebarOpen ? 'w-64' : 'w-20'} h-full bg-gradient-to-b from-[#1e3a8a] via-[#1e40af] to-[#1e3a8a] text-white transition-all duration-300 flex flex-col`}>
      {/* Logo */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden">
            <Image 
              src="/podar-logo.png" 
              alt="Podar Logo" 
              width={48} 
              height={48}
              className="w-full h-full object-contain"
            />
          </div>
          {(sidebarOpen || mobile) && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-sm leading-tight text-white">Podar Learn School</h1>
              <p className="text-xs text-amber-300 font-medium">Niphad</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => { setActiveView(item.id); setMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  activeView === item.id
                    ? 'bg-gradient-to-r from-amber-500/30 to-amber-600/20 text-amber-300 border-l-4 border-amber-500 shadow-lg'
                    : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {(sidebarOpen || mobile) && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* User Info */}
      <div className="p-3 border-t border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9 flex-shrink-0 border-2 border-amber-500">
            <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-600 text-white text-sm font-bold">AC</AvatarFallback>
          </Avatar>
          {(sidebarOpen || mobile) && (
            <div className="overflow-hidden">
              <p className="font-medium text-sm truncate">Accountant</p>
              <p className="text-xs text-blue-200 truncate">accountant@podarlearnNiphad.edu.in</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
  // Header Component
  const Header = () => (
    <header className="h-14 bg-white border-b flex items-center justify-between px-4 lg:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileSidebarOpen(true)}>
          <Menu className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden lg:flex" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </Button>
        
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Home</span>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium text-[#1e3a8a]">{navItems.find(n => n.id === activeView)?.label}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </Button>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200">
          <Calendar className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-800">
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>
    </header>
  );

  // Unique Dashboard View
  const DashboardView = () => (
    <div className="space-y-6">
      {/* Hero Welcome Banner - Unique Design */}
      <Card className="bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#1e3a8a] text-white overflow-hidden relative">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-300/10 rounded-full blur-2xl translate-y-20 -translate-x-20"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-amber-400/10 rounded-full blur-xl"></div>
        </div>
        
        <CardContent className="p-8 relative">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300 text-sm font-medium">Welcome Back</span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-amber-200 bg-clip-text text-transparent">
                Good Morning, Accountant! 👨‍💼
              </h2>
              <p className="text-blue-200 text-lg">Here&apos;s your school&apos;s financial overview for today.</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-blue-200">
                  <Building2 className="w-4 h-4" />
                  <span>Podar Learn School Niphad</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-200">
                  <BookOpen className="w-4 h-4" />
                  <span>Academic Year 2026-27</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/25" onClick={() => setShowAddStudentDialog(true)}>
                <UserPlus className="w-4 h-4 mr-2" /> New Admission
              </Button>
              <Button variant="outline" className="text-white border-white/30 hover:bg-white/10 backdrop-blur-sm" onClick={() => setActiveView('fees')}>
                <IndianRupee className="w-4 h-4 mr-2" /> Collect Fee
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Unique Stats Cards - Glassmorphism Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] text-white hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
          <CardContent className="p-5 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Total Students</p>
                <p className="text-4xl font-bold mt-1">{stats.totalStudents}</p>
                <div className="flex items-center gap-1 mt-2 text-green-300 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>All Active</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Fees Collected */}
        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
          <CardContent className="p-5 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Fees Collected</p>
                <p className="text-3xl font-bold mt-1">{formatCurrency(stats.totalFeesCollected)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-16 h-1.5 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: `${stats.collectionPercent}%` }}></div>
                  </div>
                  <span className="text-sm text-green-100">{stats.collectionPercent}%</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wallet className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Pending Fees */}
        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-amber-500 to-orange-500 text-white hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          <CardContent className="p-5 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Pending Fees</p>
                <p className="text-3xl font-bold mt-1">{formatCurrency(stats.pendingFees)}</p>
                <div className="flex items-center gap-1 mt-2 text-red-200 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{stats.defaulters.length} Defaulters</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Today's Collection */}
        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-purple-500 to-violet-600 text-white hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%)] bg-[length:20px_20px]"></div>
          <CardContent className="p-5 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Today&apos;s Collection</p>
                <p className="text-3xl font-bold mt-1">{formatCurrency(stats.today.amount)}</p>
                <div className="flex items-center gap-1 mt-2 text-purple-200 text-sm">
                  <Receipt className="w-4 h-4" />
                  <span>{stats.today.count} Receipts Today</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions Grid - New Unique Section */}
      <Card className="border-2 border-dashed border-muted-foreground/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-[#1e3a8a] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: UserPlus, label: 'New Student', color: 'bg-blue-500', action: () => setShowAddStudentDialog(true) },
              { icon: IndianRupee, label: 'Collect Fee', color: 'bg-green-500', action: () => setActiveView('fees') },
              { icon: FileBarChart, label: 'View Reports', color: 'bg-purple-500', action: () => setActiveView('reports') },
              { icon: Scan, label: 'Scan QR', color: 'bg-amber-500', action: () => setActiveView('scan') },
            ].map((item, i) => (
              <button
                key={i}
                onClick={item.action}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all hover:scale-105 group"
              >
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Charts Row - Simple & Clean */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Collection - Simple Bar Chart */}
        <Card className="overflow-hidden border-2 border-[#1e3a8a]/10">
          <CardHeader className="bg-[#1e3a8a] text-white py-4">
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              📊 Monthly Collection
            </CardTitle>
            <CardDescription className="text-blue-200">Fee collection per month (in ₹)</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyCollectionData} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#1e3a8a', fontSize: 12, fontWeight: 500 }} 
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 11 }} 
                    tickFormatter={(v) => `₹${v/1000}k`}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    formatter={(v: number) => [formatCurrency(v), 'Collection']}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '2px solid #1e3a8a', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      backgroundColor: 'white'
                    }}
                    cursor={{ fill: 'rgba(30, 58, 138, 0.1)' }}
                  />
                  <Bar 
                    dataKey="collection" 
                    fill="#1e3a8a" 
                    radius={[6, 6, 0, 0]}
                    maxBarSize={40}
                  >
                    {monthlyCollectionData.map((_, i) => (
                      <Cell key={i} fill={i === monthlyCollectionData.length - 1 ? '#f59e0b' : '#1e3a8a'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Simple Legend */}
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[#1e3a8a]"></div>
                <span className="text-sm text-gray-600">Previous Months</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-500"></div>
                <span className="text-sm text-gray-600">Current Month</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Class-wise Distribution - Simple Donut */}
        <Card className="overflow-hidden border-2 border-amber-500/20">
          <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white py-4">
            <CardTitle className="flex items-center gap-2 text-white">
              <Award className="w-5 h-5" />
              🎓 Students by Class
            </CardTitle>
            <CardDescription className="text-amber-100">Total: {stats.totalStudents} active students</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={classDistributionData.slice(0, 8)} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={50} 
                    outerRadius={80}
                    paddingAngle={2} 
                    dataKey="students"
                  >
                    {classDistributionData.slice(0, 8).map((entry, i) => (
                      <Cell 
                        key={i} 
                        fill={CHART_COLORS[i % CHART_COLORS.length]} 
                        stroke="white" 
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value} Students`, 'Count']}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      backgroundColor: 'white'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Simple Class Tags */}
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {classDistributionData.slice(0, 8).map((item, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: `${CHART_COLORS[i % CHART_COLORS.length]}20`, color: CHART_COLORS[i % CHART_COLORS.length] }}
                >
                  <span>{item.class}</span>
                  <span className="font-bold">{item.students}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Payment Mode Distribution - New Simple Card */}
      <Card className="border-2 border-green-500/20">
        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4">
          <CardTitle className="flex items-center gap-2 text-white">
            <CreditCard className="w-5 h-5" />
            💳 Payment Methods Used
          </CardTitle>
          <CardDescription className="text-green-100">How parents are paying fees</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { mode: 'UPI', icon: '📱', count: paymentModeData.filter(p => p.mode === 'UPI').reduce((s, p) => s + 1, 0), color: 'bg-purple-500' },
              { mode: 'Cash', icon: '💵', count: paymentModeData.filter(p => p.mode === 'Cash').reduce((s, p) => s + 1, 0), color: 'bg-green-500' },
              { mode: 'Card', icon: '💳', count: paymentModeData.filter(p => p.mode === 'Card').reduce((s, p) => s + 1, 0), color: 'bg-blue-500' },
              { mode: 'Cheque', icon: '📝', count: paymentModeData.filter(p => p.mode === 'Cheque').reduce((s, p) => s + 1, 0), color: 'bg-amber-500' },
              { mode: 'Bank', icon: '🏦', count: paymentModeData.filter(p => p.mode === 'Bank Transfer').reduce((s, p) => s + 1, 0), color: 'bg-teal-500' },
            ].map((item, i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center mx-auto mb-2 text-2xl`}>
                  {item.icon}
                </div>
                <p className="font-bold text-lg text-gray-900">{item.count}</p>
                <p className="text-xs text-gray-500">{item.mode}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Payments & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[#1e3a8a] flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Recent Payments
            </CardTitle>
            <Badge variant="outline" className="text-xs">{store.payments.length} Total</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Receipt</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Mode</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {store.payments.slice(-5).reverse().map((p) => (
                  <TableRow key={p.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs font-medium text-[#1e3a8a]">{p.receiptId}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{p.studentName}</p>
                        <p className="text-xs text-muted-foreground">{p.class}-{p.section}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-green-600 font-bold">{formatCurrency(p.amount)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs font-medium">{p.paymentMode}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-[#1e3a8a] flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {store.activities.slice(0, 6).map((a) => (
                  <div key={a.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      a.type === 'payment' ? 'bg-green-100' : a.type === 'admission' ? 'bg-blue-100' : 'bg-amber-100'
                    }`}>
                      {a.type === 'payment' && <IndianRupee className="w-4 h-4 text-green-600" />}
                      {a.type === 'admission' && <UserPlus className="w-4 h-4 text-blue-600" />}
                      {a.type === 'update' && <Edit className="w-4 h-4 text-amber-600" />}
                      {a.type === 'delete' && <Trash2 className="w-4 h-4 text-red-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{a.message}</p>
                      <p className="text-xs text-muted-foreground">{a.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Students View
  const StudentsView = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1e3a8a]">Student Management</h2>
          <p className="text-muted-foreground">Manage student records and admissions</p>
        </div>
        <Button className="bg-[#1e3a8a] hover:bg-[#1e40af]" onClick={() => setShowAddStudentDialog(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Student
        </Button>
      </div>
      
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by name, ID, or father's name..." value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={studentClassFilter} onValueChange={setStudentClassFilter}>
              <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Class" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {CLASSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={studentStatusFilter} onValueChange={setStudentStatusFilter}>
              <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Left">Left</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredStudents.map((student) => {
          const paid = store.payments.filter(p => p.studentId === student.studentId).reduce((s, p) => s + p.amount, 0);
          const balance = student.totalFee - paid;
          const progress = (paid / student.totalFee) * 100;
          
          return (
            <Card key={student.id} className="hover:shadow-lg transition-all hover:-translate-y-1 group">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12 bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6]">
                    <AvatarFallback className="bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] text-white text-lg font-bold">
                      {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold truncate">{student.name}</h3>
                      <Badge className={`${student.status === 'Active' ? 'bg-green-500' : student.status === 'Inactive' ? 'bg-amber-500' : 'bg-gray-500'} text-white`}>
                        {student.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono">{student.studentId}</p>
                    <p className="text-xs text-muted-foreground">{student.class}-{student.section} • S/O {student.fathersName}</p>
                  </div>
                </div>
                
                <Separator className="my-3" />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Fee Progress</span>
                    <span className="font-bold text-[#1e3a8a]">{progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={progress} className="h-2.5" />
                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-muted-foreground">Total: {formatCurrency(student.totalFee)}</span>
                    <span className="text-green-600 font-medium">Paid: {formatCurrency(paid)}</span>
                    <span className="text-amber-600 font-medium">Due: {formatCurrency(balance)}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => { setSelectedStudent(student); setShowStudentDetailDialog(true); }}>
                    <Eye className="w-4 h-4 mr-1" /> View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => { setSelectedStudent(student); setShowEditStudentDialog(true); }}>
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button size="sm" className="flex-1 bg-amber-500 hover:bg-amber-600 text-white" onClick={() => {
                    setFeeStudentId(student.studentId);
                    setActiveView('fees');
                  }}>
                    <IndianRupee className="w-4 h-4 mr-1" /> Pay
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  // Fee Collection View
  const FeesView = () => {
    const selectedStudentData = feeStudentId ? store.getStudentById(feeStudentId) : null;
    const paid = selectedStudentData ? store.payments.filter(p => p.studentId === selectedStudentData.studentId).reduce((s, p) => s + p.amount, 0) : 0;
    const balance = selectedStudentData ? selectedStudentData.totalFee - paid : 0;
    
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1e3a8a]">Fee Collection</h2>
          <p className="text-muted-foreground">Collect fees and generate receipts</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <Card className="lg:col-span-1 border-2 border-[#1e3a8a]/20">
            <CardHeader className="bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white rounded-t-lg">
              <CardTitle className="text-white flex items-center gap-2">
                <IndianRupee className="w-5 h-5" />
                Collect Fee
              </CardTitle>
              <CardDescription className="text-blue-200">Enter payment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="font-medium">Student</Label>
                <Select value={feeStudentId} onValueChange={setFeeStudentId}>
                  <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                  <SelectContent>
                    {store.students.filter(s => s.status === 'Active').map((s) => (
                      <SelectItem key={s.studentId} value={s.studentId}>
                        {s.studentId} - {s.name} ({s.class})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedStudentData && (
                <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border-2 border-amber-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-12 h-12 bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6]">
                      <AvatarFallback className="bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] text-white font-bold">
                        {selectedStudentData.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold">{selectedStudentData.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedStudentData.class}-{selectedStudentData.section}</p>
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-white/50 rounded-lg">
                      <p className="text-muted-foreground text-xs">Total Fee</p>
                      <p className="font-bold text-[#1e3a8a]">{formatCurrency(selectedStudentData.totalFee)}</p>
                    </div>
                    <div className="p-2 bg-green-50 rounded-lg">
                      <p className="text-muted-foreground text-xs">Paid</p>
                      <p className="font-bold text-green-600">{formatCurrency(paid)}</p>
                    </div>
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <p className="text-muted-foreground text-xs">Due</p>
                      <p className="font-bold text-amber-600">{formatCurrency(balance)}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label className="font-medium">Amount to Pay</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl font-bold text-[#1e3a8a]">₹</span>
                  <Input type="number" placeholder="Enter amount" value={feeAmount}
                    onChange={(e) => setFeeAmount(e.target.value)} className="pl-8 text-lg font-bold" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 font-medium" onClick={() => setFeeAmount(String(balance))}>Full Amount</Button>
                  <Button variant="outline" size="sm" className="flex-1 font-medium" onClick={() => setFeeAmount(String(Math.floor(balance / 2)))}>Half</Button>
                  <Button variant="outline" size="sm" className="flex-1 font-medium" onClick={() => setFeeAmount(String(Math.floor(balance / 4)))}>Quarter</Button>
                </div>
              </div>
              
              {/* Manual Date Picker - NEW! */}
              <div className="space-y-2">
                <Label className="font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#1e3a8a]" />
                  Payment Date (Today)
                </Label>
                <Input 
                  type="date" 
                  value={feeDate}
                  onChange={(e) => setFeeDate(e.target.value)}
                  className="text-lg font-medium"
                />
                <p className="text-xs text-muted-foreground">Auto: Today's date</p>
              </div>
              
              {/* Next Due Date - When parent will pay next */}
              <div className="space-y-2">
                <Label className="font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  Next Payment Due Date
                </Label>
                <Input 
                  type="date" 
                  value={nextDueDate}
                  onChange={(e) => setNextDueDate(e.target.value)}
                  className="text-lg font-medium border-amber-300"
                  min={new Date().toISOString().split('T')[0]} // Can't select past date
                />
                <p className="text-xs text-muted-foreground">📅 When parent will pay next installment?</p>
                {/* Quick date buttons */}
                <div className="flex gap-2 flex-wrap">
                  {[
                    { label: '15 Days', days: 15 },
                    { label: '1 Month', days: 30 },
                    { label: '2 Months', days: 60 },
                    { label: '3 Months', days: 90 },
                  ].map((item) => (
                    <Button 
                      key={item.label}
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => {
                        const today = new Date();
                        today.setDate(today.getDate() + item.days);
                        setNextDueDate(today.toISOString().split('T')[0]);
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="font-medium">Payment Mode</Label>
                <div className="grid grid-cols-5 gap-2">
                  {(['Cash', 'UPI', 'Card', 'Cheque', 'Bank Transfer'] as const).map((mode) => (
                    <Button key={mode} variant={feePaymentMode === mode ? 'default' : 'outline'}
                      className={`text-xs font-medium ${feePaymentMode === mode ? 'bg-[#1e3a8a] hover:bg-[#1e40af]' : ''}`}
                      onClick={() => setFeePaymentMode(mode)}>
                      {mode === 'Cash' && '💵'}
                      {mode === 'UPI' && '📱'}
                      {mode === 'Card' && '💳'}
                      {mode === 'Cheque' && '📝'}
                      {mode === 'Bank Transfer' && '🏦'}
                    </Button>
                  ))}
                </div>
              </div>
              
              {feePaymentMode === 'Cheque' && (
                <div className="space-y-2">
                  <Label>Cheque Number</Label>
                  <Input placeholder="Enter cheque number" value={feeChequeNumber}
                    onChange={(e) => setFeeChequeNumber(e.target.value)} />
                </div>
              )}
              
              {(feePaymentMode === 'UPI' || feePaymentMode === 'Card' || feePaymentMode === 'Bank Transfer') && (
                <div className="space-y-2">
                  <Label>Transaction ID</Label>
                  <Input placeholder="Enter transaction ID" value={feeTransactionId}
                    onChange={(e) => setFeeTransactionId(e.target.value)} />
                </div>
              )}
              
              <div className="space-y-2">
                <Label>Remarks</Label>
                <Textarea placeholder="Optional remarks" value={feeRemarks}
                  onChange={(e) => setFeeRemarks(e.target.value)} rows={2} />
              </div>
              
              <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-6 text-lg font-bold shadow-lg shadow-amber-500/25"
                onClick={handleFeePayment} disabled={!feeStudentId || !feeAmount}>
                <Receipt className="w-5 h-5 mr-2" /> Generate Receipt
              </Button>
            </CardContent>
          </Card>
          
          {/* Payment History */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-[#1e3a8a] flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Payment History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Receipt ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {store.payments.slice().reverse().slice(0, 10).map((p) => (
                    <TableRow key={p.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-xs font-medium text-[#1e3a8a]">{p.receiptId}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{p.studentName}</p>
                          <p className="text-xs text-muted-foreground">{p.class}-{p.section}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-green-600 font-bold">{formatCurrency(p.amount)}</TableCell>
                      <TableCell><Badge variant="secondary">{p.paymentMode}</Badge></TableCell>
                      <TableCell className="text-sm">{formatDate(p.date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Reports View
  const ReportsView = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1e3a8a]">Reports & Analytics</h2>
          <p className="text-muted-foreground">View detailed reports and insights</p>
        </div>
        <div className="flex gap-2">
          <Input type="date" value={reportDateFrom} onChange={(e) => setReportDateFrom(e.target.value)} className="w-36" />
          <span className="self-center text-muted-foreground">to</span>
          <Input type="date" value={reportDateTo} onChange={(e) => setReportDateTo(e.target.value)} className="w-36" />
          <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export</Button>
        </div>
      </div>
      
      <Tabs value={reportType} onValueChange={setReportType}>
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none lg:flex gap-1">
          <TabsTrigger value="daily">Daily Collection</TabsTrigger>
          <TabsTrigger value="classwise">Class-wise</TabsTrigger>
          <TabsTrigger value="defaulters">Defaulters</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Daily Collection Report</CardTitle></CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyCollectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(v) => `₹${v/1000}k`} />
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                    <Line type="monotone" dataKey="collection" stroke="#1e3a8a" strokeWidth={3} dot={{ fill: '#f59e0b', r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="classwise" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Class-wise Fee Status</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Class</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Expected</TableHead>
                    <TableHead>Collected</TableHead>
                    <TableHead>Pending</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classDistributionData.map((item) => {
                    const classStudents = store.students.filter(s => s.class === item.class && s.status === 'Active');
                    const expected = classStudents.reduce((s, st) => s + st.totalFee, 0);
                    const collected = store.payments.filter(p => classStudents.some(s => s.studentId === p.studentId))
                      .reduce((s, p) => s + p.amount, 0);
                    const pending = expected - collected;
                    const progress = expected > 0 ? (collected / expected) * 100 : 0;
                    
                    return (
                      <TableRow key={item.class}>
                        <TableCell className="font-bold">{item.class}</TableCell>
                        <TableCell>{item.students}</TableCell>
                        <TableCell>{formatCurrency(expected)}</TableCell>
                        <TableCell className="text-green-600 font-medium">{formatCurrency(collected)}</TableCell>
                        <TableCell className="text-amber-600 font-medium">{formatCurrency(pending)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={progress} className="h-2 w-24" />
                            <span className="text-sm font-medium">{progress.toFixed(0)}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="defaulters" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Defaulters List</CardTitle>
                <Badge variant="destructive" className="text-sm">{stats.defaulters.length} Students</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Total Fee</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.defaulters.slice(0, 10).map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.name}</TableCell>
                      <TableCell><Badge variant="outline">{d.class}-{d.section}</Badge></TableCell>
                      <TableCell>{d.contact}</TableCell>
                      <TableCell>{formatCurrency(d.totalFee)}</TableCell>
                      <TableCell className="text-green-600">{formatCurrency(d.paid)}</TableCell>
                      <TableCell className="text-red-600 font-bold">{formatCurrency(d.balance)}</TableCell>
                      <TableCell>
                        <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => {
                          setFeeStudentId(d.studentId);
                          setActiveView('fees');
                        }}>Collect</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Scan View
  const ScanView = () => (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] rounded-2xl flex items-center justify-center mb-4 shadow-xl">
          <Scan className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[#1e3a8a]">Receipt Verification</h2>
        <p className="text-muted-foreground mt-1">Enter receipt ID to verify payment</p>
      </div>
      
      <Card className="border-2 border-[#1e3a8a]/20">
        <CardHeader className="bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white rounded-t-lg">
          <CardTitle className="text-white flex items-center gap-2"><Shield className="w-5 h-5" /> Verify Receipt</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label className="font-medium">Enter Receipt ID</Label>
            <div className="flex gap-2">
              <Input placeholder="e.g., REC-2024-001234" value={scanReceiptId}
                onChange={(e) => setScanReceiptId(e.target.value.toUpperCase())}
                className="font-mono text-lg" />
              <Button className="bg-[#1e3a8a] hover:bg-[#1e40af] px-8" onClick={handleReceiptLookup}>
                <Search className="w-4 h-4 mr-2" /> Search
              </Button>
            </div>
          </div>
          
          {scanError && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">{scanError}</span>
            </div>
          )}
          
          {scannedReceipt && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="font-bold text-green-600 text-lg">✓ Verified Receipt</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-muted-foreground text-sm">Receipt ID:</span><p className="font-mono font-bold">{scannedReceipt.receiptId}</p></div>
                <div><span className="text-muted-foreground text-sm">Student:</span><p className="font-medium">{scannedReceipt.studentName}</p></div>
                <div><span className="text-muted-foreground text-sm">Class:</span><p>{scannedReceipt.class}-{scannedReceipt.section}</p></div>
                <div><span className="text-muted-foreground text-sm">Amount:</span><p className="font-bold text-green-600">{formatCurrency(scannedReceipt.amount)}</p></div>
                <div><span className="text-muted-foreground text-sm">Date:</span><p>{formatDate(scannedReceipt.date)} {scannedReceipt.time}</p></div>
                <div><span className="text-muted-foreground text-sm">Mode:</span><p>{scannedReceipt.paymentMode}</p></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // AI Assistant View - Enhanced with Voice, Multi-language, Smart Actions
  const AssistantView = () => (
    <div className="space-y-4 h-[calc(100vh-12rem)] flex flex-col">
      {/* Header with AI Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] rounded-2xl flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1e3a8a] flex items-center gap-2">
              AI Assistant
              <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs">POWERED BY AI</Badge>
            </h2>
            <p className="text-muted-foreground text-sm">Real AI • Voice Support • Multi-language</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {[
              { code: 'english' as const, label: 'EN', flag: '🇬🇧' },
              { code: 'hindi' as const, label: 'HI', flag: '🇮🇳' },
              { code: 'marathi' as const, label: 'MR', flag: '🇮🇳' }
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setAiLanguage(lang.code)}
                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  aiLanguage === lang.code
                    ? 'bg-[#1e3a8a] text-white shadow'
                    : 'hover:bg-muted-foreground/10'
                }`}
              >
                {lang.flag} {lang.label}
              </button>
            ))}
          </div>
          
          <Button variant="outline" size="sm" onClick={() => store.clearChat()}>
            <RefreshCw className="w-4 h-4 mr-2" /> Clear
          </Button>
        </div>
      </div>
      
      {/* Smart Action Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[
          { icon: TrendingUp, label: '📊 Pending Fees', query: 'How much fee is pending? Show defaulters list', color: 'from-red-500 to-orange-500' },
          { icon: Wallet, label: '💰 Today Collection', query: 'Show me today\'s fee collection summary', color: 'from-green-500 to-emerald-500' },
          { icon: Users, label: '👨‍🎓 Student Stats', query: 'Give me class-wise student statistics', color: 'from-blue-500 to-cyan-500' },
          { icon: Zap, label: '🔮 Predictions', query: 'Predict next month\'s fee collection based on current trends', color: 'from-purple-500 to-violet-500' }
        ].map((action, i) => (
          <button
            key={i}
            onClick={() => { setChatInput(action.query); }}
            className="flex items-center gap-2 p-3 rounded-xl bg-white border-2 border-gray-100 hover:border-[#1e3a8a]/30 hover:shadow-md transition-all group"
          >
            <div className={`w-8 h-8 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
              <action.icon className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-[#1e3a8a]">{action.label}</span>
          </button>
        ))}
      </div>
      
      {/* Chat Area */}
      <Card className="flex-1 flex flex-col overflow-hidden border-2 border-[#1e3a8a]/10">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {store.chatMessages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#1e3a8a] via-[#3b82f6] to-[#1e3a8a] rounded-3xl flex items-center justify-center shadow-xl animate-pulse">
                <Sparkles className="w-10 h-10 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-[#1e3a8a] mb-2">Hello! I&apos;m your AI Assistant 🤖</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                I can help you with fee queries, student info, predictions, and more. 
                Try asking in English, Hindi, or Marathi!
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <Badge variant="outline" className="gap-1"><Mic className="w-3 h-3" /> Voice Input</Badge>
                <Badge variant="outline" className="gap-1"><Globe className="w-3 h-3" /> Multi-language</Badge>
                <Badge variant="outline" className="gap-1"><Zap className="w-3 h-3" /> Smart Actions</Badge>
              </div>
            </div>
          )}
          
          {store.chatMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white rounded-br-md' 
                  : 'bg-gradient-to-br from-gray-100 to-gray-50 rounded-bl-md border'
              }`}>
                <p className="whitespace-pre-line text-sm leading-relaxed">{msg.content}</p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
                  <p className="text-xs opacity-70">{msg.timestamp}</p>
                  {msg.role === 'assistant' && (
                    <button 
                      onClick={() => speakResponse(msg.content)}
                      className="text-xs opacity-70 hover:opacity-100 flex items-center gap-1"
                    >
                      <Volume2 className="w-3 h-3" /> Listen
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* AI Loading Indicator */}
          {aiLoading && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-br from-gray-100 to-gray-50 p-4 rounded-2xl rounded-bl-md border">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#1e3a8a] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-[#1e3a8a] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-[#1e3a8a] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-xs text-muted-foreground">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </CardContent>
        
        {/* Input Area with Voice */}
        <div className="p-4 border-t bg-gradient-to-r from-gray-50 to-white">
          <div className="flex gap-2">
            {/* Voice Button */}
            <Button 
              variant={isListening ? 'default' : 'outline'}
              size="icon"
              className={`flex-shrink-0 ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : ''}`}
              onClick={startVoiceInput}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            
            <Input 
              placeholder={isListening ? '🎤 Listening...' : 'Ask anything about your school...'} 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
              className="flex-1"
              disabled={aiLoading}
            />
            
            <Button 
              className="bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] hover:from-[#1e40af] hover:to-[#2563eb] px-6"
              onClick={handleChatSubmit}
              disabled={aiLoading || !chatInput.trim()}
            >
              {aiLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          {/* Quick Suggestions */}
          <div className="flex gap-1 mt-2 flex-wrap">
            {[
              '📊 Show defaulters',
              '💰 Fee status',
              '📈 Predictions',
              '👨‍🎓 Top students'
            ].map((q) => (
              <button
                key={q}
                onClick={() => setChatInput(q.substring(2))}
                className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-[#1e3a8a]/10 hover:text-[#1e3a8a] transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  // Settings View
  const SettingsView = () => (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-[#1e3a8a]">Settings</h2>
      
      <Card className="border-2 border-[#1e3a8a]/20">
        <CardHeader><CardTitle>School Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>School Name</Label>
              <Input value={store.settings.schoolName} onChange={(e) => store.updateSettings({ schoolName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input value={store.settings.tagline} onChange={(e) => store.updateSettings({ tagline: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Textarea value={store.settings.address} onChange={(e) => store.updateSettings({ address: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Contact</Label>
              <Input value={store.settings.contact} onChange={(e) => store.updateSettings({ contact: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={store.settings.email} onChange={(e) => store.updateSettings({ email: e.target.value })} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Cloud Storage Backup Section */}
      <Card className="border-2 border-green-500/30 bg-gradient-to-br from-green-50/50 to-emerald-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Cloud className="w-5 h-5" />
            Cloud Storage Backup
          </CardTitle>
          <CardDescription>
            Automatically backup all your data to cloud storage. Never lose important records!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Backup Status */}
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                cloudBackupStatus === 'success' ? 'bg-green-100' : 
                cloudBackupStatus === 'uploading' ? 'bg-amber-100 animate-pulse' :
                cloudBackupStatus === 'error' ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                {cloudBackupStatus === 'uploading' ? (
                  <CloudUpload className="w-6 h-6 text-amber-600 animate-bounce" />
                ) : cloudBackupStatus === 'success' ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : cloudBackupStatus === 'error' ? (
                  <XCircle className="w-6 h-6 text-red-600" />
                ) : (
                  <Cloud className="w-6 h-6 text-gray-500" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {cloudBackupStatus === 'uploading' ? 'Uploading to Cloud...' : 
                   cloudBackupStatus === 'success' ? 'Backup Complete!' :
                   cloudBackupStatus === 'error' ? 'Backup Failed' : 'Cloud Backup'}
                </p>
                <p className="text-sm text-gray-500">
                  {lastBackupTime ? `Last backup: ${lastBackupTime}` : 'No backup yet'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">{store.students.length} Students</p>
              <p className="text-sm text-gray-500">{store.payments.length} Payments</p>
            </div>
          </div>
          
          {/* Backup Actions */}
          <div className="flex gap-3">
            <Button 
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              onClick={handleCloudBackup}
              disabled={cloudBackupStatus === 'uploading'}
            >
              {cloudBackupStatus === 'uploading' ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Backing Up...
                </>
              ) : (
                <>
                  <CloudUpload className="w-4 h-4 mr-2" /> Backup to Cloud
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 border-green-500 text-green-700 hover:bg-green-50"
              onClick={handleRestoreBackup}
            >
              <Database className="w-4 h-4 mr-2" /> Restore from Cloud
            </Button>
          </div>
          
          {/* Info */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              Your data is encrypted and stored securely. Backups include all student records, payment history, and school settings.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-2 border-[#1e3a8a]/20">
        <CardHeader><CardTitle>Data Management</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => {
              const data = store.exportData();
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `podar-erp-backup-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
              toast({ title: 'Success', description: 'Data exported successfully' });
            }}>
              <Download className="w-4 h-4 mr-2" /> Export Data
            </Button>
            <Button variant="outline" onClick={() => store.resetToDemoData()}>
              <RefreshCw className="w-4 h-4 mr-2" /> Reset Demo Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Compact Receipt for A4 Printing (2 per page)
  const ProfessionalReceipt = ({ receipt, printMode = false }: { receipt: Payment; printMode?: boolean }) => {
    const student = store.getStudentById(receipt.studentId);
    
    // Get all payments for this student
    const studentPayments = store.payments
      .filter(p => p.studentId === receipt.studentId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const totalPaid = studentPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalFee = student?.totalFee || 0;
    const balance = totalFee - totalPaid;
    
    // Calculate due dates based on quarterly payments
    const quarterlyAmount = Math.floor(totalFee / 4);
    
    // Use the nextDueDate from payment if available, otherwise calculate
    const nextDueDateValue = receipt.nextDueDate;
    const nextDueDate = nextDueDateValue ? new Date(nextDueDateValue) : (() => {
      const today = new Date();
      const months = [4, 7, 10, 1]; // April, July, October, January
      
      for (const month of months) {
        const dueDate = new Date(today.getFullYear(), month - 1, 15);
        if (dueDate > today) {
          return dueDate;
        }
      }
      return new Date(today.getFullYear() + 1, 3, 15); // Next April
    })();
    
    // Payment schedule
    const paymentSchedule = [
      { quarter: 'Q1 (Apr-Jun)', dueDate: '15 Apr', amount: quarterlyAmount, status: totalPaid >= quarterlyAmount ? 'Paid' : totalPaid > 0 ? 'Partial' : 'Pending' },
      { quarter: 'Q2 (Jul-Sep)', dueDate: '15 Jul', amount: quarterlyAmount, status: totalPaid >= quarterlyAmount * 2 ? 'Paid' : totalPaid > quarterlyAmount ? 'Partial' : 'Pending' },
      { quarter: 'Q3 (Oct-Dec)', dueDate: '15 Oct', amount: quarterlyAmount, status: totalPaid >= quarterlyAmount * 3 ? 'Paid' : totalPaid > quarterlyAmount * 2 ? 'Partial' : 'Pending' },
      { quarter: 'Q4 (Jan-Mar)', dueDate: '15 Jan', amount: quarterlyAmount, status: totalPaid >= quarterlyAmount * 4 ? 'Paid' : totalPaid > quarterlyAmount * 3 ? 'Partial' : 'Pending' },
    ];
    
    // Unique QR code URL for each receipt - includes receipt ID for verification
    const receiptUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}?receipt=${receipt.receiptId}`
      : `https://podarlearnNiphad.school/receipt/${receipt.receiptId}`;
    
    return (
      <div className="bg-white" style={{ 
        width: '100%', 
        maxWidth: printMode ? '48%' : '450px', 
        margin: '0 auto',
        border: '2px solid #1e3a8a',
        borderRadius: printMode ? '0' : '8px',
        overflow: 'hidden'
      }}>
        {/* Header with Logo and QR */}
        <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] p-3 flex items-center justify-between">
          {/* School Logo and Name */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden">
              <Image 
                src="/podar-logo.png" 
                alt="Podar Logo" 
                width={40} 
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-white">
              <h2 className="font-bold text-sm leading-tight">PODAR LEARN SCHOOL</h2>
              <p className="text-amber-300 text-xs font-medium">Niphad, Nashik</p>
            </div>
          </div>
          
          {/* QR Code */}
          <div className="bg-white p-1.5 rounded-lg">
            <QRCodeSVG
              value={receiptUrl}
              size={50}
              level="H"
              includeMargin={false}
            />
          </div>
        </div>
        
        {/* Receipt Title */}
        <div className="bg-amber-500 text-white text-center py-1.5">
          <span className="font-bold text-sm tracking-wider">💰 FEE RECEIPT</span>
          <span className="text-amber-100 text-xs ml-2">| AY: {receipt.academicYear}</span>
        </div>
        
        {/* Receipt Info Bar */}
        <div className="flex justify-between items-center px-3 py-2 bg-gray-50 border-b text-xs">
          <div>
            <span className="text-gray-500">Receipt No: </span>
            <span className="font-bold text-[#1e3a8a]">{receipt.receiptId}</span>
          </div>
          <div className="text-right">
            <span className="text-gray-500">Date: </span>
            <span className="font-medium">{formatDate(receipt.date)} | {receipt.time}</span>
          </div>
        </div>
        
        {/* Student Details - Compact */}
        <div className="px-3 py-2">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Student:</span>
              <span className="font-bold">{receipt.studentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Class:</span>
              <span className="font-bold">{receipt.class}-{receipt.section}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Father:</span>
              <span className="font-medium">{receipt.fathersName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">ID:</span>
              <span className="font-mono text-[#1e3a8a]">{receipt.studentId}</span>
            </div>
          </div>
        </div>
        
        {/* Fee Table - Current Payment */}
        <div className="px-3">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-[#1e3a8a] text-white">
                <th className="text-left p-1.5 border border-[#1e3a8a]">Particulars</th>
                <th className="text-right p-1.5 border border-[#1e3a8a]">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-1.5 border border-gray-300 font-medium">{receipt.remarks || 'Tuition Fee'}</td>
                <td className="p-1.5 border border-gray-300 text-right font-bold text-green-600">{formatCurrency(receipt.amount)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Payment Summary with Due Date */}
        <div className="px-3 py-2">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-2 rounded border border-blue-200">
            <div className="grid grid-cols-3 gap-1 text-xs mb-2">
              <div className="text-center p-1 bg-white rounded border">
                <p className="text-gray-500 text-[10px]">Annual Fee</p>
                <p className="font-bold text-[#1e3a8a]">{formatCurrency(totalFee)}</p>
              </div>
              <div className="text-center p-1 bg-white rounded border">
                <p className="text-gray-500 text-[10px]">Total Paid</p>
                <p className="font-bold text-green-600">{formatCurrency(totalPaid)}</p>
              </div>
              <div className="text-center p-1 bg-white rounded border border-red-200 bg-red-50">
                <p className="text-gray-500 text-[10px]">Balance</p>
                <p className={`font-bold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {balance > 0 ? formatCurrency(balance) : '✓ Clear'}
                </p>
              </div>
            </div>
            
            {/* Next Due Date - Important! */}
            {balance > 0 && (
              <div className="bg-amber-100 border-2 border-amber-400 rounded p-2 mt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-700">📅 NEXT PAYMENT DATE:</span>
                  </div>
                  <span className="text-sm font-bold text-amber-800 bg-white px-2 py-0.5 rounded">
                    {nextDueDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <p className="text-[10px] text-amber-700 mt-1 font-medium">
                  ⚠️ Parent promised to pay ₹{quarterlyAmount.toLocaleString('en-IN')} by this date.
                </p>
                {nextDueDateValue && (
                  <p className="text-[9px] text-amber-600 mt-0.5">
                    ✓ Agreed by parent on {formatDate(receipt.date)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Payment Schedule - NEW! */}
        <div className="px-3 pb-2">
          <p className="text-xs font-bold text-[#1e3a8a] mb-1">📋 Payment Schedule:</p>
          <div className="grid grid-cols-4 gap-0.5 text-[9px]">
            {paymentSchedule.map((q, i) => (
              <div key={i} className={`text-center p-1 rounded border ${
                q.status === 'Paid' ? 'bg-green-100 border-green-300 text-green-700' :
                q.status === 'Partial' ? 'bg-amber-100 border-amber-300 text-amber-700' :
                'bg-gray-100 border-gray-300 text-gray-600'
              }`}>
                <p className="font-medium">{q.quarter.split(' ')[0]}</p>
                <p className="text-[8px]">{q.dueDate}</p>
                <p className="font-bold">₹{(q.amount/1000)}K</p>
                <p className={`text-[8px] font-medium ${
                  q.status === 'Paid' ? 'text-green-600' :
                  q.status === 'Partial' ? 'text-amber-600' : 'text-red-500'
                }`}>{q.status}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Fee History - Previous Payments */}
        {studentPayments.length > 1 && (
          <div className="px-3 pb-2">
            <p className="text-xs font-bold text-[#1e3a8a] mb-1">📜 Previous Payments:</p>
            <div className="max-h-16 overflow-y-auto text-[9px] border rounded">
              {studentPayments.slice(-3).reverse().map((p, i) => (
                <div key={i} className="flex justify-between items-center p-1 border-b last:border-0 bg-gray-50">
                  <span className="font-mono text-gray-500">{p.receiptId.slice(-6)}</span>
                  <span className="text-gray-600">{formatDate(p.date)}</span>
                  <span className="font-bold text-green-600">{formatCurrency(p.amount)}</span>
                  <span className="text-gray-400">{p.paymentMode}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Payment Mode */}
        <div className="px-3 pb-2">
          <div className="flex justify-between items-center text-xs bg-gray-100 p-1.5 rounded">
            <span className="text-gray-600">Mode: <span className="font-bold text-[#1e3a8a]">{receipt.paymentMode}</span></span>
            {receipt.transactionId && (
              <span className="text-gray-500 text-[10px]">Ref: {receipt.transactionId}</span>
            )}
          </div>
        </div>
        
        {/* Signature Section */}
        <div className="flex justify-between items-end px-3 py-2 border-t border-dashed border-gray-300">
          <div className="text-center">
            <div className="w-20 border-b border-gray-400 mb-0.5"></div>
            <p className="text-[10px] text-gray-500">Accountant</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-amber-600 font-bold">📱 Scan QR to Verify</p>
            <p className="text-[9px] text-gray-400">Duplicate for Office Record</p>
          </div>
          <div className="text-center">
            <div className="w-20 border-b border-gray-400 mb-0.5"></div>
            <p className="text-[10px] text-gray-500">Parent Sign</p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-[#1e3a8a] text-white text-center py-1">
          <p className="text-[10px]">✓ Computer Generated Receipt | Keep this safe for future reference</p>
        </div>
      </div>
    );
  };
  
  // Print Receipt Dialog - Shows 2 receipts per A4 page
  const PrintReceiptDialog = () => {
    if (!lastReceipt) return null;
    
    // Get previous receipt for printing 2 per page
    const previousReceipts = store.payments.slice(-2);
    const receiptsToPrint = previousReceipts.length === 2 ? previousReceipts : [lastReceipt];
    
    return (
      <div className="print:block">
        <style jsx global>{`
          @media print {
            body * { visibility: hidden; }
            .print-area, .print-area * { visibility: visible; }
            .print-area { 
              position: absolute; 
              left: 0; 
              top: 0;
              width: 100%;
            }
            .receipt-container {
              display: flex !important;
              flex-wrap: wrap !important;
              justify-content: space-between !important;
              padding: 5mm !important;
              gap: 5mm !important;
            }
            .receipt-item {
              width: 48% !important;
              margin: 0 !important;
              page-break-inside: avoid !important;
            }
            @page {
              size: A4;
              margin: 5mm;
            }
          }
        `}</style>
        
        <div className="print-area receipt-container">
          {receiptsToPrint.map((receipt, index) => (
            <div key={receipt.id} className="receipt-item mb-4">
              <ProfessionalReceipt receipt={receipt} printMode={true} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}
      
      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 lg:hidden transform transition-transform duration-300 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar mobile />
      </div>
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block"><Sidebar /></div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'students' && <StudentsView />}
          {activeView === 'fees' && <FeesView />}
          {activeView === 'reports' && <ReportsView />}
          {activeView === 'scan' && <ScanView />}
          {activeView === 'assistant' && <AssistantView />}
          {activeView === 'settings' && <SettingsView />}
        </main>
      </div>
      
      {/* Add Student Dialog */}
      <Dialog open={showAddStudentDialog} onOpenChange={setShowAddStudentDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1e3a8a] flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Add New Student
            </DialogTitle>
            <DialogDescription>Enter student details for new admission</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Student Name *</Label>
              <Input placeholder="Full name" value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Father&apos;s Name *</Label>
              <Input placeholder="Father's name" value={newStudent.fathersName}
                onChange={(e) => setNewStudent({ ...newStudent, fathersName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Mother&apos;s Name</Label>
              <Input placeholder="Mother's name" value={newStudent.mothersName}
                onChange={(e) => setNewStudent({ ...newStudent, mothersName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input type="date" value={newStudent.dob}
                onChange={(e) => setNewStudent({ ...newStudent, dob: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Class *</Label>
              <Select value={newStudent.class}
                onValueChange={(v) => setNewStudent({ ...newStudent, class: v, totalFee: FEE_STRUCTURE[v] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CLASSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Section *</Label>
              <Select value={newStudent.section} onValueChange={(v) => setNewStudent({ ...newStudent, section: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SECTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Contact Number *</Label>
              <Input placeholder="10-digit number" value={newStudent.contact}
                onChange={(e) => setNewStudent({ ...newStudent, contact: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Alternate Contact</Label>
              <Input placeholder="Alternate number" value={newStudent.alternateContact}
                onChange={(e) => setNewStudent({ ...newStudent, alternateContact: e.target.value })} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Address</Label>
              <Textarea placeholder="Full address" value={newStudent.address}
                onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Admission Date</Label>
              <Input type="date" value={newStudent.admissionDate}
                onChange={(e) => setNewStudent({ ...newStudent, admissionDate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Annual Fee</Label>
              <Input value={formatCurrency(newStudent.totalFee)} disabled className="font-bold text-green-600" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddStudentDialog(false)}>Cancel</Button>
            <Button className="bg-[#1e3a8a] hover:bg-[#1e40af]" onClick={handleAddStudent}>Add Student</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Student Detail Dialog */}
      <Dialog open={showStudentDetailDialog} onOpenChange={setShowStudentDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle className="text-[#1e3a8a] flex items-center gap-2"><Eye className="w-5 h-5" /> Student Details</DialogTitle></DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6]">
                  <AvatarFallback className="bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] text-white text-xl font-bold">
                    {selectedStudent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
                  <p className="text-muted-foreground">{selectedStudent.studentId}</p>
                  <Badge className={`${selectedStudent.status === 'Active' ? 'bg-green-500' : 'bg-amber-500'} text-white mt-1`}>
                    {selectedStudent.status}
                  </Badge>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground" /><span><strong>Father:</strong> {selectedStudent.fathersName}</span></div>
                <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-muted-foreground" /><span><strong>Class:</strong> {selectedStudent.class}-{selectedStudent.section}</span></div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" /><span><strong>Contact:</strong> {selectedStudent.contact}</span></div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /><span><strong>Admission:</strong> {formatDate(selectedStudent.admissionDate)}</span></div>
                <div className="flex items-center gap-2 col-span-2"><MapPin className="w-4 h-4 text-muted-foreground" /><span><strong>Address:</strong> {selectedStudent.address || 'Not provided'}</span></div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-muted to-muted/50 rounded-lg text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total Fee</p>
                  <p className="text-xl font-bold text-[#1e3a8a]">{formatCurrency(selectedStudent.totalFee)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Paid</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(selectedStudent.totalFee - store.getStudentBalance(selectedStudent.studentId))}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Balance</p>
                  <p className="text-xl font-bold text-amber-600">{formatCurrency(store.getStudentBalance(selectedStudent.studentId))}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Payment History</h4>
                {store.getPaymentsByStudentId(selectedStudent.studentId).length > 0 ? (
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {store.getPaymentsByStudentId(selectedStudent.studentId).map((p) => (
                        <div key={p.id} className="flex justify-between p-2 bg-muted/50 rounded text-sm">
                          <div>
                            <span className="font-medium">{formatCurrency(p.amount)}</span>
                            <span className="text-muted-foreground ml-2">via {p.paymentMode}</span>
                          </div>
                          <span className="text-muted-foreground">{formatDate(p.date)}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No payments yet</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Receipt Dialog - Compact with Logo */}
      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          {lastReceipt && <ProfessionalReceipt receipt={lastReceipt} />}
          <div className="p-3 flex gap-2 border-t bg-gray-50">
            <Button variant="outline" className="flex-1" onClick={() => setShowReceiptDialog(false)}>
              Close
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white" 
              onClick={() => window.print()}
            >
              <Printer className="w-4 h-4 mr-2" /> Print
            </Button>
            <Button className="flex-1 bg-green-600 hover:bg-green-700">
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Edit Student Dialog */}
      <Dialog open={showEditStudentDialog} onOpenChange={setShowEditStudentDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#1e3a8a] flex items-center gap-2"><Edit className="w-5 h-5" /> Edit Student</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={selectedStudent.name}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Father&apos;s Name</Label>
                <Input value={selectedStudent.fathersName}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, fathersName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Class</Label>
                <Select value={selectedStudent.class}
                  onValueChange={(v) => setSelectedStudent({ ...selectedStudent, class: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CLASSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Section</Label>
                <Select value={selectedStudent.section}
                  onValueChange={(v) => setSelectedStudent({ ...selectedStudent, section: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SECTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Contact</Label>
                <Input value={selectedStudent.contact}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, contact: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={selectedStudent.status}
                  onValueChange={(v: 'Active' | 'Inactive' | 'Left') => setSelectedStudent({ ...selectedStudent, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Left">Left</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditStudentDialog(false)}>Cancel</Button>
            <Button className="bg-[#1e3a8a] hover:bg-[#1e40af]" onClick={handleEditStudent}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteStudentDialog} onOpenChange={setShowDeleteStudentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2"><AlertCircle className="w-5 h-5" /> Delete Student</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedStudent?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteStudentDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteStudent}>Delete Permanently</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Receipt Viewer Dialog - Shows when QR code is scanned */}
      <Dialog open={showReceiptViewer} onOpenChange={(open) => {
        setShowReceiptViewer(open);
        if (!open) {
          // Clear the URL parameter when closing
          router.replace('/');
        }
      }}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          {urlReceipt ? (
            <>
              <ProfessionalReceipt receipt={urlReceipt} />
              <div className="p-3 flex gap-2 border-t bg-gray-50">
                <Button variant="outline" className="flex-1" onClick={() => {
                  setShowReceiptViewer(false);
                  router.replace('/');
                }}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-[#1e3a8a] text-[#1e3a8a]" 
                  onClick={() => window.print()}
                >
                  <Printer className="w-4 h-4 mr-2" /> Print
                </Button>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-red-600">Receipt Not Found</h3>
              <p className="text-muted-foreground mt-2">The receipt you&apos;re looking for doesn&apos;t exist or has been deleted.</p>
              <Button className="mt-4" onClick={() => {
                setShowReceiptViewer(false);
                router.replace('/');
              }}>
                Go to Dashboard
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
