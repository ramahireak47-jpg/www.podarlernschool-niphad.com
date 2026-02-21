import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Student, Payment, School, User, FeeStructure, Expense, Attendance, Notification, Settings } from '@/types'

// Generate unique IDs
export const genId = () => Date.now().toString(36) + Math.random().toString(36).substr(2)
export const genAdmissionNo = (schoolCode: string, cls: string, count: number) => {
  const classCode = cls === 'Nursery' ? 'NR' : cls === 'LKG' ? 'LK' : cls === 'UKG' ? 'UK' : cls.replace(/[a-z]/g, '')
  return `${schoolCode}${new Date().getFullYear()}${classCode.padStart(2, '0')}${(count + 1).toString().padStart(4, '0')}`
}
export const genReceiptNo = (prefix: string = 'REC') => `${prefix}-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`

// Default school
const defaultSchool: School = {
  id: 'SCH001',
  name: 'Podar Learn School Niphad',
  address: 'Station Road, Niphad',
  city: 'Niphad',
  state: 'Maharashtra',
  pincode: '422303',
  phone: '02556-222333',
  email: 'podarniphad@gmail.com',
  code: 'PLS',
  academicYear: '2026-27',
  createdAt: new Date().toISOString()
}

// Default admin user
const defaultUser: User = {
  id: 'USR001',
  schoolId: 'SCH001',
  name: 'Admin',
  email: 'admin@podar.edu',
  role: 'admin',
  phone: '9876543210',
  active: true,
  createdAt: new Date().toISOString()
}

// Default fee structure
const defaultFeeStructure: FeeStructure[] = [
  { id: '1', schoolId: 'SCH001', class: 'Nursery', admissionFee: 5000, tuitionFee: 28000, developmentFee: 2000, otherFee: 1000, totalFee: 36000, academicYear: '2026-27' },
  { id: '2', schoolId: 'SCH001', class: 'LKG', admissionFee: 5000, tuitionFee: 30000, developmentFee: 2000, otherFee: 1000, totalFee: 38000, academicYear: '2026-27' },
  { id: '3', schoolId: 'SCH001', class: 'UKG', admissionFee: 5000, tuitionFee: 32000, developmentFee: 2000, otherFee: 1000, totalFee: 40000, academicYear: '2026-27' },
  { id: '4', schoolId: 'SCH001', class: '1st', admissionFee: 5000, tuitionFee: 34000, developmentFee: 2000, otherFee: 1000, totalFee: 42000, academicYear: '2026-27' },
  { id: '5', schoolId: 'SCH001', class: '2nd', admissionFee: 5000, tuitionFee: 34000, developmentFee: 2000, otherFee: 1000, totalFee: 42000, academicYear: '2026-27' },
  { id: '6', schoolId: 'SCH001', class: '3rd', admissionFee: 5000, tuitionFee: 37000, developmentFee: 2000, otherFee: 1000, totalFee: 45000, academicYear: '2026-27' },
  { id: '7', schoolId: 'SCH001', class: '4th', admissionFee: 5000, tuitionFee: 37000, developmentFee: 2000, otherFee: 1000, totalFee: 45000, academicYear: '2026-27' },
  { id: '8', schoolId: 'SCH001', class: '5th', admissionFee: 5000, tuitionFee: 40000, developmentFee: 2000, otherFee: 1000, totalFee: 48000, academicYear: '2026-27' },
  { id: '9', schoolId: 'SCH001', class: '6th', admissionFee: 5000, tuitionFee: 40000, developmentFee: 2000, otherFee: 1000, totalFee: 48000, academicYear: '2026-27' },
  { id: '10', schoolId: 'SCH001', class: '7th', admissionFee: 5000, tuitionFee: 44000, developmentFee: 2000, otherFee: 1000, totalFee: 52000, academicYear: '2026-27' },
  { id: '11', schoolId: 'SCH001', class: '8th', admissionFee: 5000, tuitionFee: 44000, developmentFee: 2000, otherFee: 1000, totalFee: 52000, academicYear: '2026-27' },
  { id: '12', schoolId: 'SCH001', class: '9th', admissionFee: 5000, tuitionFee: 48000, developmentFee: 2000, otherFee: 1000, totalFee: 56000, academicYear: '2026-27' },
  { id: '13', schoolId: 'SCH001', class: '10th', admissionFee: 5000, tuitionFee: 48000, developmentFee: 2000, otherFee: 1000, totalFee: 56000, academicYear: '2026-27' },
  { id: '14', schoolId: 'SCH001', class: '11th', admissionFee: 5000, tuitionFee: 52000, developmentFee: 2000, otherFee: 1000, totalFee: 60000, academicYear: '2026-27' },
  { id: '15', schoolId: 'SCH001', class: '12th', admissionFee: 5000, tuitionFee: 52000, developmentFee: 2000, otherFee: 1000, totalFee: 60000, academicYear: '2026-27' },
]

// Default classes
const defaultClasses = [
  'Nursery', 'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'
]
const defaultSections = ['A', 'B', 'C', 'D', 'E', 'F']

interface ERPState {
  // Data
  schools: School[]
  users: User[]
  students: Student[]
  payments: Payment[]
  feeStructure: FeeStructure[]
  expenses: Expense[]
  attendance: Attendance[]
  notifications: Notification[]
  settings: Settings
  
  // UI State
  currentSchool: School | null
  currentUser: User | null
  currentTab: string
  hydrated: boolean
  
  // Actions
  setHydrated: (state: boolean) => void
  setCurrentTab: (tab: string) => void
  login: (email: string, password: string) => boolean
  logout: () => void
  
  // School Actions
  addSchool: (school: Omit<School, 'id' | 'createdAt'>) => void
  updateSchool: (id: string, data: Partial<School>) => void
  
  // Student Actions
  addStudent: (student: Omit<Student, 'id' | 'admissionNo' | 'createdAt' | 'updatedAt'>) => Student
  updateStudent: (id: string, data: Partial<Student>) => void
  deleteStudent: (id: string) => void
  getStudent: (id: string) => Student | undefined
  getStudentBalance: (studentId: string) => number
  
  // Payment Actions
  addPayment: (payment: Omit<Payment, 'id' | 'receiptNo' | 'createdAt' | 'balance'>) => Payment
  cancelPayment: (id: string) => void
  getPayment: (id: string) => Payment | undefined
  
  // Fee Structure Actions
  updateFeeStructure: (classs: string, data: Partial<FeeStructure>) => void
  getFeeByClass: (cls: string) => number
  
  // Expense Actions
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void
  
  // Attendance Actions
  markAttendance: (data: Omit<Attendance, 'id'>) => void
  
  // Stats
  getStats: () => {
    totalStudents: number
    totalCollected: number
    totalPending: number
    todayCollection: number
    todayReceipts: number
    monthlyCollection: number
    defaulters: number
  }
  
  // Backup/Restore
  backupData: () => string
  restoreData: (data: string) => boolean
  clearAllData: () => void
}

export const useERPStore = create<ERPState>()(
  persist(
    (set, get) => ({
      // Initial Data
      schools: [defaultSchool],
      users: [defaultUser],
      students: [],
      payments: [],
      feeStructure: defaultFeeStructure,
      expenses: [],
      attendance: [],
      notifications: [],
      settings: {
        schoolId: 'SCH001',
        logo: '',
        primaryColor: '#1e3a8a',
        secondaryColor: '#f59e0b',
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        dateFormat: 'DD/MM/YYYY',
        receiptPrefix: 'REC',
        studentPrefix: 'PLS'
      },
      
      currentSchool: defaultSchool,
      currentUser: null,
      currentTab: 'dashboard',
      hydrated: false,
      
      // Hydration
      setHydrated: (state) => set({ hydrated: state }),
      
      // UI Actions
      setCurrentTab: (tab) => set({ currentTab: tab }),
      
      login: (email, password) => {
        const user = get().users.find(u => u.email === email && u.active)
        if (user) {
          set({ currentUser: user })
          return true
        }
        // Demo login
        if (email === 'admin' || email === 'accountant') {
          set({ currentUser: { ...defaultUser, name: email === 'admin' ? 'Admin' : 'Accountant', role: email === 'admin' ? 'admin' : 'accountant' } })
          return true
        }
        return false
      },
      
      logout: () => set({ currentUser: null }),
      
      // School Actions
      addSchool: (schoolData) => {
        const school: School = {
          ...schoolData,
          id: genId(),
          createdAt: new Date().toISOString()
        }
        set(state => ({ schools: [...state.schools, school] }))
      },
      
      updateSchool: (id, data) => {
        set(state => ({
          schools: state.schools.map(s => s.id === id ? { ...s, ...data } : s),
          currentSchool: state.currentSchool?.id === id ? { ...state.currentSchool, ...data } : state.currentSchool
        }))
      },
      
      // Student Actions
      addStudent: (studentData) => {
        const state = get()
        const classCount = state.students.filter(s => s.class === studentData.class).length
        const school = state.currentSchool || defaultSchool
        const fee = state.getFeeByClass(studentData.class)
        
        const student: Student = {
          ...studentData,
          id: genId(),
          schoolId: school.id,
          admissionNo: genAdmissionNo(school.code, studentData.class, classCount),
          fee: fee,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        set(state => ({ students: [...state.students, student] }))
        return student
      },
      
      updateStudent: (id, data) => {
        set(state => ({
          students: state.students.map(s => s.id === id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s)
        }))
      },
      
      deleteStudent: (id) => {
        set(state => ({ students: state.students.filter(s => s.id !== id) }))
      },
      
      getStudent: (id) => get().students.find(s => s.id === id),
      
      getStudentBalance: (studentId) => {
        const state = get()
        const student = state.students.find(s => s.id === studentId)
        if (!student) return 0
        const paid = state.payments
          .filter(p => p.studentId === studentId && p.status === 'Completed')
          .reduce((sum, p) => sum + p.amount, 0)
        return student.fee - (student.concession || 0) - paid
      },
      
      // Payment Actions
      addPayment: (paymentData) => {
        const state = get()
        const settings = state.settings
        const balance = state.getStudentBalance(paymentData.studentId) - paymentData.amount
        
        const payment: Payment = {
          ...paymentData,
          id: genId(),
          receiptNo: genReceiptNo(settings.receiptPrefix),
          balance: Math.max(0, balance),
          createdAt: new Date().toISOString()
        }
        
        set(state => ({ payments: [...state.payments, payment] }))
        return payment
      },
      
      cancelPayment: (id) => {
        set(state => ({
          payments: state.payments.map(p => p.id === id ? { ...p, status: 'Cancelled' as const } : p)
        }))
      },
      
      getPayment: (id) => get().payments.find(p => p.id === id),
      
      // Fee Structure Actions
      updateFeeStructure: (cls, data) => {
        set(state => ({
          feeStructure: state.feeStructure.map(f => 
            f.class === cls ? { ...f, ...data, totalFee: (data.admissionFee || f.admissionFee) + (data.tuitionFee || f.tuitionFee) + (data.developmentFee || f.developmentFee) + (data.otherFee || f.otherFee) } : f
          )
        }))
      },
      
      getFeeByClass: (cls) => {
        const fee = get().feeStructure.find(f => f.class === cls)
        return fee?.totalFee || 42000
      },
      
      // Expense Actions
      addExpense: (expenseData) => {
        const expense: Expense = {
          ...expenseData,
          id: genId(),
          createdAt: new Date().toISOString()
        }
        set(state => ({ expenses: [...state.expenses, expense] }))
      },
      
      // Attendance Actions
      markAttendance: (data) => {
        const attendance: Attendance = {
          ...data,
          id: genId()
        }
        set(state => ({ attendance: [...state.attendance, attendance] }))
      },
      
      // Stats
      getStats: () => {
        const state = get()
        const today = new Date().toISOString().split('T')[0]
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        
        const totalStudents = state.students.filter(s => s.status === 'Active').length
        const totalCollected = state.payments
          .filter(p => p.status === 'Completed')
          .reduce((sum, p) => sum + p.amount, 0)
        
        const totalPending = state.students
          .filter(s => s.status === 'Active')
          .reduce((sum, s) => sum + state.getStudentBalance(s.id), 0)
        
        const todayPayments = state.payments.filter(p => 
          p.createdAt.split('T')[0] === today && p.status === 'Completed'
        )
        
        const todayCollection = todayPayments.reduce((sum, p) => sum + p.amount, 0)
        const todayReceipts = todayPayments.length
        
        const monthlyCollection = state.payments
          .filter(p => {
            const date = new Date(p.createdAt)
            return p.status === 'Completed' && date.getMonth() === currentMonth && date.getFullYear() === currentYear
          })
          .reduce((sum, p) => sum + p.amount, 0)
        
        const defaulters = state.students.filter(s => 
          s.status === 'Active' && state.getStudentBalance(s.id) > 0
        ).length
        
        return {
          totalStudents,
          totalCollected,
          totalPending,
          todayCollection,
          todayReceipts,
          monthlyCollection,
          defaulters
        }
      },
      
      // Backup/Restore
      backupData: () => {
        const state = get()
        const data = {
          schools: state.schools,
          users: state.users,
          students: state.students,
          payments: state.payments,
          feeStructure: state.feeStructure,
          expenses: state.expenses,
          attendance: state.attendance,
          notifications: state.notifications,
          settings: state.settings,
          backupDate: new Date().toISOString()
        }
        return JSON.stringify(data, null, 2)
      },
      
      restoreData: (dataStr) => {
        try {
          const data = JSON.parse(dataStr)
          set({
            schools: data.schools || [],
            users: data.users || [],
            students: data.students || [],
            payments: data.payments || [],
            feeStructure: data.feeStructure || defaultFeeStructure,
            expenses: data.expenses || [],
            attendance: data.attendance || [],
            notifications: data.notifications || [],
            settings: data.settings || get().settings
          })
          return true
        } catch {
          return false
        }
      },
      
      clearAllData: () => {
        set({
          students: [],
          payments: [],
          expenses: [],
          attendance: [],
          notifications: []
        })
      }
    }),
    {
      name: 'podar-erp-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        schools: state.schools,
        users: state.users,
        students: state.students,
        payments: state.payments,
        feeStructure: state.feeStructure,
        expenses: state.expenses,
        attendance: state.attendance,
        notifications: state.notifications,
        settings: state.settings,
        currentUser: state.currentUser,
        currentTab: state.currentTab
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      }
    }
  )
)

export { defaultClasses, defaultSections }
