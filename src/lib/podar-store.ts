import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface Student {
  id: string;
  studentId: string;
  admissionNo: string;
  name: string;
  fathersName: string;
  mothersName: string;
  dob: string;
  class: string;
  section: string;
  contact: string;
  alternateContact: string;
  address: string;
  totalFee: number;
  admissionDate: string;
  status: 'Active' | 'Inactive' | 'Left';
  photo?: string;
}

export interface Payment {
  id: string;
  receiptId: string;
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  fathersName: string;
  amount: number;
  paymentMode: 'Cash' | 'UPI' | 'Card' | 'Cheque' | 'Bank Transfer';
  chequeNumber?: string;
  transactionId?: string;
  remarks: string;
  collectedBy: string;
  date: string;
  time: string;
  academicYear: string;
  balanceAfter: number;
  nextDueDate?: string; // Next payment due date - when parent will pay next
}

export interface Activity {
  id: string;
  type: 'payment' | 'admission' | 'update' | 'delete' | 'system';
  message: string;
  timestamp: string;
  icon?: string;
}

export interface SchoolSettings {
  schoolName: string;
  tagline: string;
  address: string;
  contact: string;
  email: string;
  website: string;
  academicYear: string;
  logo?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Constants
export const CLASSES = [
  'Nursery', 'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th',
  '6th', '7th', '8th', '9th', '10th', '11th', '12th'
];

export const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F'];

export const FEE_STRUCTURE: Record<string, number> = {
  'Nursery': 36000,
  'LKG': 38000,
  'UKG': 40000,
  '1st': 42000,
  '2nd': 42000,
  '3rd': 45000,
  '4th': 45000,
  '5th': 48000,
  '6th': 48000,
  '7th': 52000,
  '8th': 52000,
  '9th': 56000,
  '10th': 56000,
  '11th': 60000,
  '12th': 60000,
};

// Helper Functions
const generateStudentId = (classNum: string, index: number): string => {
  const year = new Date().getFullYear();
  const classCode = classNum === 'Nursery' ? 'NR' : 
                   classNum === 'LKG' ? 'LK' : 
                   classNum === 'UKG' ? 'UK' : 
                   classNum.replace('th', '').replace('st', '').replace('nd', '').replace('rd', '');
  return `PLS${year}${classCode.padStart(2, '0')}${String(index).padStart(3, '0')}`;
};

const generateAdmissionNo = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `ADM${year}${random}`;
};

const generateReceiptId = (): string => {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  return `REC-${year}-${timestamp}`;
};

// Indian Names Database
const INDIAN_FIRST_NAMES_MALE = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Reyansh', 'Krishna', 'Ishaan', 'Ananya', 'Dhruv',
  'Rohan', 'Karthik', 'Aryan', 'Yash', 'Rahul', 'Ajay', 'Vikram', 'Pranav', 'Nikhil', 'Varun',
  'Karan', 'Manish', 'Suresh', 'Rajesh', 'Amit', 'Sunil', 'Anil', 'Ravi', 'Sanjay', 'Vijay',
  'Prakash', 'Ramesh', 'Deepak', 'Mohan', 'Ashok', 'Nitin', 'Pankaj', 'Sachin', 'Rohit', 'Arun',
  'Raj', 'Kumar', 'Siddharth', 'Adwait', 'Sai', 'Om', 'Rudra', 'Shiv', 'Ved', 'Arush',
  'Advik', 'Kiaan', 'Ayaan', 'Darsh', 'Parth', 'Veer', 'Shaurya', 'Abhiram', 'Madhav', 'Ganesh'
];

const INDIAN_FIRST_NAMES_FEMALE = [
  'Aaradhya', 'Ananya', 'Ishita', 'Diya', 'Pooja', 'Aditi', 'Kavya', 'Shreya', 'Anika', 'Myra',
  'Aanya', 'Avni', 'Aarya', 'Prisha', 'Saanvi', 'Aishwarya', 'Divya', 'Isha', 'Riya', 'Tanvi',
  'Sneha', 'Neha', 'Priya', 'Pooja', 'Sunita', 'Geeta', 'Rekha', 'Kavita', 'Anjali', 'Smita',
  'Meera', 'Lakshmi', 'Padma', 'Sandhya', 'Nisha', 'Deepa', 'Komal', 'Simran', 'Lata', 'Smita',
  'Bhavna', 'Madhuri', 'Sarita', 'Usha', 'Rekha', 'Manisha', 'Kanchan', 'Vandana', 'Jyoti', 'Asha',
  'Gauri', 'Parvati', 'Sita', 'Radha', 'Mira', 'Tara', 'Nandini', 'Bhavana', 'Chitra', 'Harini'
];

const INDIAN_LAST_NAMES = [
  'Sharma', 'Gupta', 'Kumar', 'Verma', 'Patel', 'Yadav', 'Singh', 'Joshi', 'Mehta', 'Nair',
  'Reddy', 'Iyer', 'Thakur', 'Choudhary', 'Kapoor', 'Malhotra', 'Rathore', 'Saxena', 'Mishra', 'Devi',
  'Kaur', 'Chauhan', 'Pawar', 'Jadhav', 'More', 'Gaikwad', 'Deshmukh', 'Kulkarni', 'Deshpande', 'Bhosale',
  'Mahajan', 'Joshi', 'Kadam', 'Shinde', 'Patil', 'Lande', 'Bhalerao', 'Kulkarni', 'Hire', 'Salunke',
  'Shah', 'Jain', 'Agarwal', 'Bansal', 'Mittal', 'Garg', 'Goel', 'Bhatia', 'Malik', 'Chopra'
];

const FATHER_NAMES = [
  'Rajesh', 'Sunil', 'Amit', 'Vijay', 'Ramesh', 'Suresh', 'Anil', 'Sanjay', 'Mohan', 'Ashok',
  'Prakash', 'Nitin', 'Pankaj', 'Sachin', 'Rohit', 'Arun', 'Deepak', 'Manish', 'Ravi', 'Harish',
  'Mahesh', 'Ravinder', 'Krishnan', 'Sundaram', 'Nitin', 'Rohit', 'Vikram', 'Ajay', 'Rahul', 'Karthik'
];

const MOTHER_NAMES = [
  'Priya', 'Meera', 'Sunita', 'Geeta', 'Neha', 'Kavita', 'Pooja', 'Anjali', 'Smita', 'Rekha',
  'Lakshmi', 'Padma', 'Sandhya', 'Komal', 'Simran', 'Lata', 'Deepa', 'Nisha', 'Madhuri', 'Sarita'
];

const NIPHAD_ADDRESSES = [
  'Shivaji Nagar, Niphad', 'Ganesh Colony, Niphad', 'Krushnanagar, Niphad', 'Maliwada, Niphad',
  'Station Road, Niphad', 'Market Area, Niphad', 'Old Niphad, Nashik Road', 'New Colony, Niphad',
  'Budhwar Peth, Niphad', 'Raviwar Peth, Niphad', 'Khadakwasla Road, Niphad', 'Industrial Area, Niphad',
  'Agricultural Market, Niphad', 'Taluka Office Area, Niphad', 'Bus Stand Road, Niphad'
];

// Generate random date of birth based on class
const generateDOB = (studentClass: string): string => {
  const currentYear = new Date().getFullYear();
  let birthYear: number;
  
  switch(studentClass) {
    case 'Nursery': birthYear = currentYear - 4; break;
    case 'LKG': birthYear = currentYear - 5; break;
    case 'UKG': birthYear = currentYear - 6; break;
    case '1st': birthYear = currentYear - 7; break;
    case '2nd': birthYear = currentYear - 8; break;
    case '3rd': birthYear = currentYear - 9; break;
    case '4th': birthYear = currentYear - 10; break;
    case '5th': birthYear = currentYear - 11; break;
    case '6th': birthYear = currentYear - 12; break;
    case '7th': birthYear = currentYear - 13; break;
    case '8th': birthYear = currentYear - 14; break;
    case '9th': birthYear = currentYear - 15; break;
    case '10th': birthYear = currentYear - 16; break;
    case '11th': birthYear = currentYear - 17; break;
    case '12th': birthYear = currentYear - 18; break;
    default: birthYear = currentYear - 7;
  }
  
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  return `${birthYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

// Generate random admission date
const generateAdmissionDate = (studentClass: string): string => {
  const currentYear = new Date().getFullYear();
  const yearOffset = CLASSES.indexOf(studentClass);
  const admissionYear = currentYear - yearOffset;
  const month = Math.floor(Math.random() * 3) + 4; // April to June
  const day = Math.floor(Math.random() * 28) + 1;
  return `${admissionYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

// Generate random phone number
const generatePhone = (): string => {
  const prefixes = ['98', '97', '96', '95', '94', '93', '92', '91', '90', '89', '88', '87', '86', '85', '84', '83', '82', '81', '80', '79', '78', '77', '76', '75', '74', '73', '72', '71', '70'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  let number = prefix;
  for (let i = 0; i < 8; i++) {
    number += Math.floor(Math.random() * 10);
  }
  return number;
};

// Generate 5000 students for a large school
const generateStudents = (): Student[] => {
  const students: Student[] = [];
  const TOTAL_STUDENTS = 5000;
  
  // Distribution: approximately equal across classes with slight variations
  // 15 classes × ~333 students per class
  const classDistribution: Record<string, number> = {
    'Nursery': 340, 'LKG': 335, 'UKG': 330,
    '1st': 340, '2nd': 335, '3rd': 330, '4th': 335,
    '5th': 340, '6th': 335, '7th': 330, '8th': 335,
    '9th': 340, '10th': 335, '11th': 280, '12th': 270
  };
  
  let studentCounter = 0;
  
  CLASSES.forEach((cls) => {
    const classCount = classDistribution[cls] || 333;
    
    for (let i = 0; i < classCount; i++) {
      studentCounter++;
      const sectionIndex = i % 6; // 6 sections now
      const section = SECTIONS[sectionIndex];
      const isMale = Math.random() > 0.48; // Slightly more boys
      const firstName = isMale 
        ? INDIAN_FIRST_NAMES_MALE[Math.floor(Math.random() * INDIAN_FIRST_NAMES_MALE.length)]
        : INDIAN_FIRST_NAMES_FEMALE[Math.floor(Math.random() * INDIAN_FIRST_NAMES_FEMALE.length)];
      const lastName = INDIAN_LAST_NAMES[Math.floor(Math.random() * INDIAN_LAST_NAMES.length)];
      const fatherName = FATHER_NAMES[Math.floor(Math.random() * FATHER_NAMES.length)];
      const motherName = MOTHER_NAMES[Math.floor(Math.random() * MOTHER_NAMES.length)];
      
      const student: Student = {
        id: String(studentCounter),
        studentId: generateStudentId(cls, i + 1),
        admissionNo: `ADM${new Date().getFullYear()}${String(Math.floor(Math.random() * 90000) + 10000)}`,
        name: `${firstName} ${lastName}`,
        fathersName: `${fatherName} ${lastName}`,
        mothersName: `${motherName} ${lastName}`,
        dob: generateDOB(cls),
        class: cls,
        section: section,
        contact: generatePhone(),
        alternateContact: Math.random() > 0.6 ? generatePhone() : '',
        address: `${NIPHAD_ADDRESSES[Math.floor(Math.random() * NIPHAD_ADDRESSES.length)]}, Nashik - 422303`,
        totalFee: FEE_STRUCTURE[cls] || 40000,
        admissionDate: generateAdmissionDate(cls),
        status: Math.random() > 0.02 ? 'Active' : (Math.random() > 0.5 ? 'Inactive' : 'Left')
      };
      
      students.push(student);
    }
  });
  
  return students;
};

// Sample Students Data - Now with 2450 students
export const sampleStudents: Student[] = generateStudents();

// Sample Payments Data - Generate payments for students
const generateSamplePayments = (): Payment[] => {
  const payments: Payment[] = [];
  const paymentModes: ('Cash' | 'UPI' | 'Card' | 'Cheque' | 'Bank Transfer')[] = ['UPI', 'Cash', 'Card', 'Cheque', 'Bank Transfer'];
  const remarks = ['First Quarter Fee', 'Second Quarter Fee', 'Third Quarter Fee', 'Annual Fee', 'Half Yearly Fee', 'Term Fee'];
  
  // Generate payments for approximately 70% of active students
  const activeStudents = sampleStudents.filter(s => s.status === 'Active');
  const studentsWithPayments = activeStudents.slice(0, Math.floor(activeStudents.length * 0.7));
  
  let paymentId = 1;
  const today = new Date();
  
  studentsWithPayments.forEach((student) => {
    // Each student makes 1-3 payments
    const numPayments = Math.floor(Math.random() * 3) + 1;
    let remainingFee = student.totalFee;
    
    for (let p = 0; p < numPayments && remainingFee > 0; p++) {
      // Random payment amount (quarterly, half, or full)
      let amount: number;
      const paymentType = Math.random();
      
      if (paymentType < 0.2) {
        // Full payment
        amount = remainingFee;
      } else if (paymentType < 0.5) {
        // Half yearly
        amount = Math.floor(student.totalFee / 2);
      } else {
        // Quarterly
        amount = Math.floor(student.totalFee / 4);
      }
      
      amount = Math.min(amount, remainingFee);
      remainingFee -= amount;
      
      // Random date in current academic year
      const daysAgo = Math.floor(Math.random() * 180); // Within last 6 months
      const paymentDate = new Date(today);
      paymentDate.setDate(paymentDate.getDate() - daysAgo);
      
      const hours = Math.floor(Math.random() * 8) + 9; // 9 AM to 5 PM
      const minutes = Math.floor(Math.random() * 60);
      const timeStr = new Date(0, 0, 0, hours, minutes).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      
      const paymentMode = paymentModes[Math.floor(Math.random() * paymentModes.length)];
      const year = paymentDate.getFullYear();
      const timestamp = (Date.now() + paymentId).toString().slice(-6);
      
      const payment: Payment = {
        id: String(paymentId),
        receiptId: `REC-${year}-${timestamp}`,
        studentId: student.studentId,
        studentName: student.name,
        class: student.class,
        section: student.section,
        fathersName: student.fathersName,
        amount: amount,
        paymentMode: paymentMode,
        chequeNumber: paymentMode === 'Cheque' ? `CHK${Math.floor(Math.random() * 900000) + 100000}` : undefined,
        transactionId: paymentMode === 'UPI' || paymentMode === 'Card' || paymentMode === 'Bank Transfer' 
          ? `${paymentMode === 'UPI' ? 'UPI' : paymentMode === 'Card' ? 'CARD' : 'NEFT'}${Math.floor(Math.random() * 900000000) + 100000000}` 
          : undefined,
        remarks: remarks[Math.floor(Math.random() * remarks.length)],
        collectedBy: 'Accountant',
        date: paymentDate.toISOString().split('T')[0],
        time: timeStr,
        academicYear: '2026-27',
        balanceAfter: remainingFee
      };
      
      payments.push(payment);
      paymentId++;
    }
  });
  
  // Sort by date (newest first)
  payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return payments;
};

// Sample Activities - Simple static activities
export const sampleActivities: Activity[] = [
  { id: '1', type: 'payment', message: 'Fee collection for Academic Year 2026-27 started', timestamp: '2026-04-01 09:00 AM' },
  { id: '2', type: 'system', message: '5,000 students enrolled for new academic session', timestamp: '2026-04-01 10:00 AM' },
  { id: '3', type: 'admission', message: 'New admissions open for Nursery to 12th', timestamp: '2026-03-15 11:00 AM' },
  { id: '4', type: 'system', message: 'Cloud backup system activated', timestamp: '2026-04-02 09:00 AM' },
  { id: '5', type: 'update', message: 'Fee structure updated for new academic year', timestamp: '2026-03-20 02:00 PM' },
];

// School Settings
export const defaultSettings: SchoolSettings = {
  schoolName: 'Podar Learn School Niphad',
  tagline: 'Excellence in Education',
  address: 'Niphad, District Nashik, Maharashtra - 422303',
  contact: '+91 XXX XXX XXXX',
  email: 'info@podarlearnNiphad.edu.in',
  website: 'www.podarlearnNiphad.edu.in',
  academicYear: '2026-27',
};

// Store Interface
interface PodarStore {
  students: Student[];
  payments: Payment[];
  activities: Activity[];
  settings: SchoolSettings;
  chatMessages: ChatMessage[];
  
  // Actions
  addStudent: (student: Omit<Student, 'id' | 'studentId' | 'admissionNo'>) => Student;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  getStudentById: (studentId: string) => Student | undefined;
  
  addPayment: (payment: Omit<Payment, 'id' | 'receiptId' | 'time' | 'academicYear' | 'balanceAfter'>) => Payment;
  getPaymentByReceiptId: (receiptId: string) => Payment | undefined;
  getPaymentsByStudentId: (studentId: string) => Payment[];
  
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  
  updateSettings: (settings: Partial<SchoolSettings>) => void;
  
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
  
  getStudentBalance: (studentId: string) => number;
  getTotalFeesCollected: () => number;
  getTotalPendingFees: () => number;
  getTodayCollections: () => { amount: number; count: number };
  getDefaulters: () => (Student & { paid: number; balance: number })[];
  
  resetToDemoData: () => void;
  exportData: () => string;
  importData: (data: string) => boolean;
  restoreFromBackup: (backupData: { students: Student[]; payments: Payment[]; settings: SchoolSettings }) => void;
}

// Create Store
export const usePodarStore = create<PodarStore>()(
  persist(
    (set, get) => ({
      students: sampleStudents,
      payments: generateSamplePayments(),
      activities: sampleActivities,
      settings: defaultSettings,
      chatMessages: [],
      
      addStudent: (studentData) => {
        const students = get().students;
        const classStudents = students.filter(s => s.class === studentData.class);
        const index = classStudents.length + 1;
        const studentId = generateStudentId(studentData.class, index);
        const admissionNo = generateAdmissionNo();
        
        const newStudent: Student = {
          ...studentData,
          id: String(Date.now()),
          studentId,
          admissionNo,
        };
        
        set((state) => ({
          students: [...state.students, newStudent]
        }));
        
        get().addActivity({
          type: 'admission',
          message: `New admission: ${newStudent.name} enrolled in ${newStudent.class}-${newStudent.section}`,
        });
        
        return newStudent;
      },
      
      updateStudent: (id, updates) => {
        set((state) => ({
          students: state.students.map(s => s.id === id ? { ...s, ...updates } : s)
        }));
        
        const student = get().students.find(s => s.id === id);
        if (student) {
          get().addActivity({
            type: 'update',
            message: `Student ${student.name} details updated`,
          });
        }
      },
      
      deleteStudent: (id) => {
        const student = get().students.find(s => s.id === id);
        set((state) => ({
          students: state.students.filter(s => s.id !== id)
        }));
        
        if (student) {
          get().addActivity({
            type: 'delete',
            message: `Student ${student.name} removed from records`,
          });
        }
      },
      
      getStudentById: (studentId) => {
        return get().students.find(s => s.studentId === studentId);
      },
      
      addPayment: (paymentData) => {
        const receiptId = generateReceiptId();
        const now = new Date();
        const time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        const academicYear = get().settings.academicYear;
        const student = get().getStudentById(paymentData.studentId);
        
        // Calculate balance after payment
        const currentBalance = get().getStudentBalance(paymentData.studentId);
        const balanceAfter = currentBalance - paymentData.amount;
        
        const newPayment: Payment = {
          ...paymentData,
          id: String(Date.now()),
          receiptId,
          time,
          academicYear,
          balanceAfter,
          fathersName: student?.fathersName || '',
        };
        
        set((state) => ({
          payments: [...state.payments, newPayment]
        }));
        
        get().addActivity({
          type: 'payment',
          message: `Payment of ₹${newPayment.amount.toLocaleString()} received from ${newPayment.studentName} (${newPayment.class})`,
        });
        
        return newPayment;
      },
      
      getPaymentByReceiptId: (receiptId) => {
        return get().payments.find(p => p.receiptId === receiptId);
      },
      
      getPaymentsByStudentId: (studentId) => {
        return get().payments.filter(p => p.studentId === studentId);
      },
      
      addActivity: (activityData) => {
        const newActivity: Activity = {
          ...activityData,
          id: String(Date.now()),
        };
        
        set((state) => ({
          activities: [newActivity, ...state.activities].slice(0, 50)
        }));
      },
      
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },
      
      addChatMessage: (message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: String(Date.now()),
          timestamp: new Date().toLocaleString('en-IN'),
        };
        
        set((state) => ({
          chatMessages: [...state.chatMessages, newMessage]
        }));
      },
      
      clearChat: () => {
        set({ chatMessages: [] });
      },
      
      getStudentBalance: (studentId) => {
        const student = get().students.find(s => s.studentId === studentId);
        if (!student) return 0;
        
        const paid = get().payments
          .filter(p => p.studentId === studentId)
          .reduce((sum, p) => sum + p.amount, 0);
        
        return student.totalFee - paid;
      },
      
      getTotalFeesCollected: () => {
        return get().payments.reduce((sum, p) => sum + p.amount, 0);
      },
      
      getTotalPendingFees: () => {
        const students = get().students.filter(s => s.status === 'Active');
        let total = 0;
        students.forEach(s => {
          const paid = get().payments
            .filter(p => p.studentId === s.studentId)
            .reduce((sum, p) => sum + p.amount, 0);
          total += s.totalFee - paid;
        });
        return total;
      },
      
      getTodayCollections: () => {
        const today = new Date().toISOString().split('T')[0];
        const todayPayments = get().payments.filter(p => p.date === today);
        return {
          amount: todayPayments.reduce((sum, p) => sum + p.amount, 0),
          count: todayPayments.length
        };
      },
      
      getDefaulters: () => {
        const students = get().students.filter(s => s.status === 'Active');
        return students.map(s => {
          const paid = get().payments
            .filter(p => p.studentId === s.studentId)
            .reduce((sum, p) => sum + p.amount, 0);
          return {
            ...s,
            paid,
            balance: s.totalFee - paid
          };
        }).filter(s => s.balance > 0).sort((a, b) => b.balance - a.balance);
      },
      
      resetToDemoData: () => {
        set({
          students: sampleStudents,
          payments: generateSamplePayments(),
          activities: sampleActivities,
          settings: defaultSettings,
          chatMessages: [],
        });
      },
      
      exportData: () => {
        const data = {
          students: get().students,
          payments: get().payments,
          activities: get().activities,
          settings: get().settings,
          exportDate: new Date().toISOString(),
        };
        return JSON.stringify(data, null, 2);
      },
      
      importData: (jsonString) => {
        try {
          const data = JSON.parse(jsonString);
          if (data.students && data.payments) {
            set({
              students: data.students,
              payments: data.payments,
              activities: data.activities || [],
              settings: data.settings || defaultSettings,
            });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },
      
      restoreFromBackup: (backupData) => {
        set({
          students: backupData.students || sampleStudents,
          payments: backupData.payments || generateSamplePayments(),
          settings: backupData.settings || defaultSettings,
          activities: sampleActivities,
        });
        
        get().addActivity({
          type: 'system',
          message: 'Data restored from cloud backup successfully',
        });
      },
    }),
    {
      name: 'podar-erp-storage',
    }
  )
);
