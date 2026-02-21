// School/University
export interface School {
  id: string
  name: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  email: string
  code: string
  academicYear: string
  createdAt: string
}

// User
export interface User {
  id: string
  schoolId: string
  name: string
  email: string
  role: 'superadmin' | 'admin' | 'principal' | 'accountant' | 'teacher'
  phone: string
  active: boolean
  createdAt: string
}

// Student
export interface Student {
  id: string
  schoolId: string
  admissionNo: string
  name: string
  fatherName: string
  motherName: string
  dob: string
  gender: 'Male' | 'Female' | 'Other'
  class: string
  section: string
  rollNo: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  altPhone: string
  email: string
  bloodGroup: string
  aadhaarNo: string
  fee: number
  concession: number
  status: 'Active' | 'Inactive' | 'Transferred' | 'Left'
  admissionDate: string
  createdAt: string
  updatedAt: string
}

// Fee Payment
export interface Payment {
  id: string
  schoolId: string
  studentId: string
  receiptNo: string
  amount: number
  paymentMode: 'Cash' | 'UPI' | 'Card' | 'Cheque' | 'Bank Transfer'
  transactionId: string
  bankName: string
  chequeNo: string
  chequeDate: string
  remarks: string
  nextDueDate: string
  balance: number
  status: 'Completed' | 'Pending' | 'Cancelled' | 'Refunded'
  collectedBy: string
  createdAt: string
}

// Fee Structure
export interface FeeStructure {
  id: string
  schoolId: string
  class: string
  admissionFee: number
  tuitionFee: number
  developmentFee: number
  otherFee: number
  totalFee: number
  academicYear: string
}

// Class
export interface Class {
  id: string
  schoolId: string
  name: string
  sections: string[]
  fee: number
}

// Expense
export interface Expense {
  id: string
  schoolId: string
  category: string
  description: string
  amount: number
  paymentMode: string
  date: string
  paidTo: string
  billNo: string
  remarks: string
  createdBy: string
  createdAt: string
}

// Attendance
export interface Attendance {
  id: string
  schoolId: string
  studentId: string
  date: string
  status: 'Present' | 'Absent' | 'Late' | 'Half Day'
  remarks: string
  markedBy: string
}

// Report Card
export interface ReportCard {
  id: string
  schoolId: string
  studentId: string
  exam: string
  class: string
  section: string
  subjects: {
    name: string
    maxMarks: number
    obtainedMarks: number
    grade: string
  }[]
  totalMarks: number
  percentage: number
  grade: string
  rank: number
  remarks: string
  createdAt: string
}

// Notification
export interface Notification {
  id: string
  schoolId: string
  title: string
  message: string
  type: 'General' | 'Fee' | 'Event' | 'Holiday' | 'Exam'
  target: 'All' | 'Students' | 'Parents' | 'Staff'
  date: string
  active: boolean
}

// Settings
export interface Settings {
  schoolId: string
  logo: string
  primaryColor: string
  secondaryColor: string
  currency: string
  timezone: string
  dateFormat: string
  receiptPrefix: string
  studentPrefix: string
}

// Dashboard Stats
export interface DashboardStats {
  totalStudents: number
  totalCollected: number
  totalPending: number
  todayCollection: number
  todayReceipts: number
  monthlyCollection: number
  yearlyCollection: number
  defaulters: number
  activeClasses: number
}
