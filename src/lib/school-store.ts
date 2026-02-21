import { create } from 'zustand';
import { 
  Student, 
  Payment, 
  Activity,
  initialStudents, 
  initialPayments, 
  initialActivities,
  generateStudentId,
  generateReceiptId,
  CLASSES,
  SECTIONS,
  FEE_STRUCTURE
} from './school-data';

interface SchoolStore {
  // State
  students: Student[];
  payments: Payment[];
  activities: Activity[];
  
  // Actions
  addStudent: (student: Omit<Student, 'id' | 'studentId'>) => Student;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  getStudentById: (studentId: string) => Student | undefined;
  
  addPayment: (payment: Omit<Payment, 'id' | 'receiptId'>) => Payment;
  
  addActivity: (activity: Omit<Activity, 'id'>) => void;
}

export const useSchoolStore = create<SchoolStore>((set, get) => ({
  students: initialStudents,
  payments: initialPayments,
  activities: initialActivities,
  
  addStudent: (studentData) => {
    const students = get().students;
    const classStudents = students.filter(s => s.class === studentData.class);
    const index = classStudents.length + 1;
    const studentId = generateStudentId(studentData.class, index);
    
    const newStudent: Student = {
      ...studentData,
      id: String(Date.now()),
      studentId,
    };
    
    set((state) => ({
      students: [...state.students, newStudent]
    }));
    
    // Add activity
    get().addActivity({
      type: 'admission',
      message: `New student ${newStudent.name} admitted to ${newStudent.class}`,
      timestamp: new Date().toLocaleString('en-IN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    });
    
    return newStudent;
  },
  
  updateStudent: (id, updates) => {
    set((state) => ({
      students: state.students.map(s => 
        s.id === id ? { ...s, ...updates } : s
      )
    }));
    
    const student = get().students.find(s => s.id === id);
    if (student) {
      get().addActivity({
        type: 'update',
        message: `Student ${student.name} (${student.class}) details updated`,
        timestamp: new Date().toLocaleString('en-IN', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
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
        message: `Student ${student.name} (${student.class}) removed from records`,
        timestamp: new Date().toLocaleString('en-IN', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      });
    }
  },
  
  getStudentById: (studentId) => {
    return get().students.find(s => s.studentId === studentId);
  },
  
  addPayment: (paymentData) => {
    const receiptId = generateReceiptId();
    
    const newPayment: Payment = {
      ...paymentData,
      id: String(Date.now()),
      receiptId,
    };
    
    set((state) => ({
      payments: [...state.payments, newPayment]
    }));
    
    // Add activity
    get().addActivity({
      type: 'payment',
      message: `Payment of ₹${newPayment.amount.toLocaleString('en-IN')} received from ${newPayment.studentName}`,
      timestamp: new Date().toLocaleString('en-IN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    });
    
    return newPayment;
  },
  
  addActivity: (activityData) => {
    const newActivity: Activity = {
      ...activityData,
      id: String(Date.now()),
    };
    
    set((state) => ({
      activities: [newActivity, ...state.activities].slice(0, 50)
    }));
  }
}));

// Export constants for use in components
export { CLASSES, SECTIONS, FEE_STRUCTURE };
