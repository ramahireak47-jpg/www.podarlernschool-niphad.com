// School ERP Data Layer - Realistic Indian School Data

export interface Student {
  id: string;
  studentId: string;
  name: string;
  fathersName: string;
  class: string;
  section: string;
  dob: string;
  contact: string;
  address: string;
  admissionDate: string;
  totalFee: number;
  status: 'Active' | 'Left';
}

export interface Payment {
  id: string;
  receiptId: string;
  studentId: string;
  studentName: string;
  amount: number;
  paymentMode: 'Cash' | 'UPI' | 'Cheque' | 'Card';
  date: string;
  month: string;
  remarks: string;
}

export interface Activity {
  id: string;
  type: 'payment' | 'admission' | 'update' | 'delete';
  message: string;
  timestamp: string;
}

// Indian school classes
export const CLASSES = [
  'Nursery', 'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', 
  '6th', '7th', '8th', '9th', '10th', '11th', '12th'
];

export const SECTIONS = ['A', 'B', 'C', 'D'];

// Fee structure by class (in INR)
export const FEE_STRUCTURE: Record<string, number> = {
  'Nursery': 24000,
  'LKG': 26000,
  'UKG': 28000,
  '1st': 30000,
  '2nd': 30000,
  '3rd': 32000,
  '4th': 32000,
  '5th': 34000,
  '6th': 36000,
  '7th': 36000,
  '8th': 38000,
  '9th': 40000,
  '10th': 42000,
  '11th': 45000,
  '12th': 48000,
};

// Generate unique IDs
export const generateStudentId = (classNum: string, index: number): string => {
  const year = new Date().getFullYear();
  const classCode = classNum === 'Nursery' ? 'NR' : 
                   classNum === 'LKG' ? 'LK' : 
                   classNum === 'UKG' ? 'UK' : 
                   classNum.replace('th', '').replace('st', '').replace('nd', '').replace('rd', '');
  return `STU${year}${classCode.padStart(2, '0')}${String(index).padStart(3, '0')}`;
};

export const generateReceiptId = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RCP${timestamp}${random}`;
};

// Initial Students Data - 25 realistic Indian students
export const initialStudents: Student[] = [
  {
    id: '1',
    studentId: 'STU2024NR001',
    name: 'Aarav Sharma',
    fathersName: 'Rajesh Sharma',
    class: 'Nursery',
    section: 'A',
    dob: '2021-03-15',
    contact: '9876543210',
    address: '123, Sector 15, Noida, UP',
    admissionDate: '2024-04-01',
    totalFee: 24000,
    status: 'Active'
  },
  {
    id: '2',
    studentId: 'STU2024LK001',
    name: 'Priya Gupta',
    fathersName: 'Sunil Gupta',
    class: 'LKG',
    section: 'A',
    dob: '2020-06-22',
    contact: '9876543211',
    address: '45, Rajouri Garden, New Delhi',
    admissionDate: '2023-04-01',
    totalFee: 26000,
    status: 'Active'
  },
  {
    id: '3',
    studentId: 'STU2024UK001',
    name: 'Rahul Kumar',
    fathersName: 'Vijay Kumar',
    class: 'UKG',
    section: 'B',
    dob: '2019-11-08',
    contact: '9876543212',
    address: '78, Lajpat Nagar, New Delhi',
    admissionDate: '2022-04-01',
    totalFee: 28000,
    status: 'Active'
  },
  {
    id: '4',
    studentId: 'STU202401001',
    name: 'Ananya Singh',
    fathersName: 'Deepak Singh',
    class: '1st',
    section: 'A',
    dob: '2018-04-12',
    contact: '9876543213',
    address: '56, Vasundhara, Ghaziabad',
    admissionDate: '2021-04-01',
    totalFee: 30000,
    status: 'Active'
  },
  {
    id: '5',
    studentId: 'STU202402001',
    name: 'Aditya Verma',
    fathersName: 'Amit Verma',
    class: '2nd',
    section: 'B',
    dob: '2017-09-25',
    contact: '9876543214',
    address: '89, Indirapuram, Ghaziabad',
    admissionDate: '2020-04-01',
    totalFee: 30000,
    status: 'Active'
  },
  {
    id: '6',
    studentId: 'STU202403001',
    name: 'Ishita Patel',
    fathersName: 'Harsh Patel',
    class: '3rd',
    section: 'A',
    dob: '2016-01-30',
    contact: '9876543215',
    address: '34, Vaishali, Ghaziabad',
    admissionDate: '2019-04-01',
    totalFee: 32000,
    status: 'Active'
  },
  {
    id: '7',
    studentId: 'STU202404001',
    name: 'Krishna Yadav',
    fathersName: 'Suresh Yadav',
    class: '4th',
    section: 'C',
    dob: '2015-07-18',
    contact: '9876543216',
    address: '67, Kaushambi, Ghaziabad',
    admissionDate: '2018-04-01',
    totalFee: 32000,
    status: 'Active'
  },
  {
    id: '8',
    studentId: 'STU202405001',
    name: 'Sneha Reddy',
    fathersName: 'Ramesh Reddy',
    class: '5th',
    section: 'A',
    dob: '2014-02-14',
    contact: '9876543217',
    address: '12, South Extension, New Delhi',
    admissionDate: '2017-04-01',
    totalFee: 34000,
    status: 'Active'
  },
  {
    id: '9',
    studentId: 'STU202406001',
    name: 'Arjun Mehta',
    fathersName: 'Nitin Mehta',
    class: '6th',
    section: 'B',
    dob: '2013-10-05',
    contact: '9876543218',
    address: '90, Model Town, Delhi',
    admissionDate: '2016-04-01',
    totalFee: 36000,
    status: 'Active'
  },
  {
    id: '10',
    studentId: 'STU202407001',
    name: 'Divya Nair',
    fathersName: 'Krishnan Nair',
    class: '7th',
    section: 'A',
    dob: '2012-05-20',
    contact: '9876543219',
    address: '23, RK Puram, New Delhi',
    admissionDate: '2015-04-01',
    totalFee: 36000,
    status: 'Active'
  },
  {
    id: '11',
    studentId: 'STU202408001',
    name: 'Rohan Joshi',
    fathersName: 'Sanjay Joshi',
    class: '8th',
    section: 'C',
    dob: '2011-08-12',
    contact: '9876543220',
    address: '45, Dwarka Sec 7, New Delhi',
    admissionDate: '2014-04-01',
    totalFee: 38000,
    status: 'Active'
  },
  {
    id: '12',
    studentId: 'STU202409001',
    name: 'Tanvi Mishra',
    fathersName: 'Pankaj Mishra',
    class: '9th',
    section: 'A',
    dob: '2010-12-28',
    contact: '9876543221',
    address: '78, Rohini Sec 15, Delhi',
    admissionDate: '2013-04-01',
    totalFee: 40000,
    status: 'Active'
  },
  {
    id: '13',
    studentId: 'STU202410001',
    name: 'Vikram Thakur',
    fathersName: 'Ravinder Thakur',
    class: '10th',
    section: 'B',
    dob: '2009-03-10',
    contact: '9876543222',
    address: '56, Pitampura, Delhi',
    admissionDate: '2012-04-01',
    totalFee: 42000,
    status: 'Active'
  },
  {
    id: '14',
    studentId: 'STU202411001',
    name: 'Kavya Iyer',
    fathersName: 'Sundaram Iyer',
    class: '11th',
    section: 'A',
    dob: '2008-06-18',
    contact: '9876543223',
    address: '34, Vasant Kunj, New Delhi',
    admissionDate: '2011-04-01',
    totalFee: 45000,
    status: 'Active'
  },
  {
    id: '15',
    studentId: 'STU202412001',
    name: 'Yash Choudhary',
    fathersName: 'Mahesh Choudhary',
    class: '12th',
    section: 'C',
    dob: '2007-09-22',
    contact: '9876543224',
    address: '89, Janakpuri, New Delhi',
    admissionDate: '2010-04-01',
    totalFee: 48000,
    status: 'Active'
  },
  {
    id: '16',
    studentId: 'STU202401002',
    name: 'Meera Kapoor',
    fathersName: 'Anil Kapoor',
    class: '1st',
    section: 'B',
    dob: '2018-01-05',
    contact: '9876543225',
    address: '12, Greater Kailash, New Delhi',
    admissionDate: '2021-04-01',
    totalFee: 30000,
    status: 'Active'
  },
  {
    id: '17',
    studentId: 'STU202402002',
    name: 'Karan Malhotra',
    fathersName: 'Rohit Malhotra',
    class: '2nd',
    section: 'A',
    dob: '2017-04-15',
    contact: '9876543226',
    address: '45, Paschim Vihar, Delhi',
    admissionDate: '2020-04-01',
    totalFee: 30000,
    status: 'Active'
  },
  {
    id: '18',
    studentId: 'STU202403002',
    name: 'Riya Bansal',
    fathersName: 'Vikas Bansal',
    class: '3rd',
    section: 'B',
    dob: '2016-08-30',
    contact: '9876543227',
    address: '78, Punjabi Bagh, Delhi',
    admissionDate: '2019-04-01',
    totalFee: 32000,
    status: 'Left'
  },
  {
    id: '19',
    studentId: 'STU202405002',
    name: 'Aryan Saxena',
    fathersName: 'Pramod Saxena',
    class: '5th',
    section: 'B',
    dob: '2014-11-12',
    contact: '9876543228',
    address: '34, Mayur Vihar, Delhi',
    admissionDate: '2017-04-01',
    totalFee: 34000,
    status: 'Active'
  },
  {
    id: '20',
    studentId: 'STU202407002',
    name: 'Nisha Agarwal',
    fathersName: 'Rakesh Agarwal',
    class: '7th',
    section: 'C',
    dob: '2012-02-25',
    contact: '9876543229',
    address: '67, Laxmi Nagar, Delhi',
    admissionDate: '2015-04-01',
    totalFee: 36000,
    status: 'Active'
  },
  {
    id: '21',
    studentId: 'STU202408002',
    name: 'Dhruv Mittal',
    fathersName: 'Saurabh Mittal',
    class: '8th',
    section: 'A',
    dob: '2011-05-08',
    contact: '9876543230',
    address: '90, Preet Vihar, Delhi',
    admissionDate: '2014-04-01',
    totalFee: 38000,
    status: 'Active'
  },
  {
    id: '22',
    studentId: 'STU202410002',
    name: 'Pooja Rathore',
    fathersName: 'Manoj Rathore',
    class: '10th',
    section: 'A',
    dob: '2009-07-20',
    contact: '9876543231',
    address: '23, Shahdara, Delhi',
    admissionDate: '2012-04-01',
    totalFee: 42000,
    status: 'Active'
  },
  {
    id: '23',
    studentId: 'STU202411002',
    name: 'Siddharth Rao',
    fathersName: 'Ganesh Rao',
    class: '11th',
    section: 'B',
    dob: '2008-10-15',
    contact: '9876543232',
    address: '56, Karol Bagh, Delhi',
    admissionDate: '2011-04-01',
    totalFee: 45000,
    status: 'Active'
  },
  {
    id: '24',
    studentId: 'STU202412002',
    name: 'Anjali Sharma',
    fathersName: 'Mohan Sharma',
    class: '12th',
    section: 'A',
    dob: '2007-12-03',
    contact: '9876543233',
    address: '89, Kamla Nagar, Delhi',
    admissionDate: '2010-04-01',
    totalFee: 48000,
    status: 'Active'
  },
  {
    id: '25',
    studentId: 'STU202404002',
    name: 'Harsh Vardhan',
    fathersName: 'Dinesh Vardhan',
    class: '4th',
    section: 'B',
    dob: '2015-04-02',
    contact: '9876543234',
    address: '12, Shalimar Bagh, Delhi',
    admissionDate: '2018-04-01',
    totalFee: 32000,
    status: 'Left'
  }
];

// Initial Payments Data
export const initialPayments: Payment[] = [
  {
    id: '1',
    receiptId: 'RCP202401A1B2',
    studentId: 'STU202401001',
    studentName: 'Ananya Singh',
    amount: 7500,
    paymentMode: 'UPI',
    date: '2024-01-05',
    month: 'January',
    remarks: 'First installment'
  },
  {
    id: '2',
    receiptId: 'RCP202401C3D4',
    studentId: 'STU202402001',
    studentName: 'Aditya Verma',
    amount: 10000,
    paymentMode: 'Cash',
    date: '2024-01-08',
    month: 'January',
    remarks: 'Full payment'
  },
  {
    id: '3',
    receiptId: 'RCP202401E5F6',
    studentId: 'STU202403001',
    studentName: 'Ishita Patel',
    amount: 8000,
    paymentMode: 'Cheque',
    date: '2024-01-10',
    month: 'January',
    remarks: 'First installment'
  },
  {
    id: '4',
    receiptId: 'RCP202401G7H8',
    studentId: 'STU202406001',
    studentName: 'Arjun Mehta',
    amount: 12000,
    paymentMode: 'UPI',
    date: '2024-01-12',
    month: 'January',
    remarks: 'Advance payment'
  },
  {
    id: '5',
    receiptId: 'RCP202401I9J0',
    studentId: 'STU202408001',
    studentName: 'Rohan Joshi',
    amount: 9500,
    paymentMode: 'Card',
    date: '2024-01-15',
    month: 'January',
    remarks: 'Quarterly fee'
  },
  {
    id: '6',
    receiptId: 'RCP202402K1L2',
    studentId: 'STU202410001',
    studentName: 'Vikram Thakur',
    amount: 15000,
    paymentMode: 'UPI',
    date: '2024-02-02',
    month: 'February',
    remarks: 'Half yearly'
  },
  {
    id: '7',
    receiptId: 'RCP202402M3N4',
    studentId: 'STU202412001',
    studentName: 'Yash Choudhary',
    amount: 24000,
    paymentMode: 'Cheque',
    date: '2024-02-05',
    month: 'February',
    remarks: 'Full annual fee'
  },
  {
    id: '8',
    receiptId: 'RCP202402O5P6',
    studentId: 'STU202401001',
    studentName: 'Ananya Singh',
    amount: 7500,
    paymentMode: 'Cash',
    date: '2024-02-08',
    month: 'February',
    remarks: 'Second installment'
  },
  {
    id: '9',
    receiptId: 'RCP202403Q7R8',
    studentId: 'STU202404001',
    studentName: 'Krishna Yadav',
    amount: 8000,
    paymentMode: 'UPI',
    date: '2024-03-01',
    month: 'March',
    remarks: 'March fee'
  },
  {
    id: '10',
    receiptId: 'RCP202403S9T0',
    studentId: 'STU202407001',
    studentName: 'Divya Nair',
    amount: 9000,
    paymentMode: 'Cash',
    date: '2024-03-05',
    month: 'March',
    remarks: 'Quarterly fee'
  },
  {
    id: '11',
    receiptId: 'RCP202403U1V2',
    studentId: 'STU202409001',
    studentName: 'Tanvi Mishra',
    amount: 10000,
    paymentMode: 'Card',
    date: '2024-03-10',
    month: 'March',
    remarks: 'First installment'
  },
  {
    id: '12',
    receiptId: 'RCP202403W3X4',
    studentId: 'STU202411001',
    studentName: 'Kavya Iyer',
    amount: 11250,
    paymentMode: 'UPI',
    date: '2024-03-12',
    month: 'March',
    remarks: 'Quarterly payment'
  },
  {
    id: '13',
    receiptId: 'RCP202404Y5Z6',
    studentId: 'STU202405001',
    studentName: 'Sneha Reddy',
    amount: 8500,
    paymentMode: 'Cash',
    date: '2024-04-02',
    month: 'April',
    remarks: 'New session fee'
  },
  {
    id: '14',
    receiptId: 'RCP202405A7B8',
    studentId: 'STU2024NR001',
    studentName: 'Aarav Sharma',
    amount: 6000,
    paymentMode: 'UPI',
    date: '2024-05-15',
    month: 'May',
    remarks: 'Admission fee + May'
  },
  {
    id: '15',
    receiptId: 'RCP202405C9D0',
    studentId: 'STU2024LK001',
    studentName: 'Priya Gupta',
    amount: 6500,
    paymentMode: 'Cheque',
    date: '2024-05-18',
    month: 'May',
    remarks: 'Quarterly payment'
  }
];

// Initial Activities
export const initialActivities: Activity[] = [
  {
    id: '1',
    type: 'payment',
    message: 'Payment of ₹6,500 received from Priya Gupta (LKG)',
    timestamp: '2024-05-18 10:30 AM'
  },
  {
    id: '2',
    type: 'payment',
    message: 'Payment of ₹6,000 received from Aarav Sharma (Nursery)',
    timestamp: '2024-05-15 02:45 PM'
  },
  {
    id: '3',
    type: 'admission',
    message: 'New student Aarav Sharma admitted to Nursery',
    timestamp: '2024-04-01 09:00 AM'
  },
  {
    id: '4',
    type: 'payment',
    message: 'Payment of ₹8,500 received from Sneha Reddy (5th)',
    timestamp: '2024-04-02 11:20 AM'
  },
  {
    id: '5',
    type: 'update',
    message: 'Student Riya Bansal (3rd) status changed to Left',
    timestamp: '2024-03-25 04:00 PM'
  },
  {
    id: '6',
    type: 'payment',
    message: 'Payment of ₹11,250 received from Kavya Iyer (11th)',
    timestamp: '2024-03-12 03:15 PM'
  },
  {
    id: '7',
    type: 'payment',
    message: 'Payment of ₹10,000 received from Tanvi Mishra (9th)',
    timestamp: '2024-03-10 10:00 AM'
  },
  {
    id: '8',
    type: 'delete',
    message: 'Student Harsh Vardhan (4th) left the school',
    timestamp: '2024-03-05 05:30 PM'
  }
];

// Calculate statistics
export const calculateStats = (students: Student[], payments: Payment[]) => {
  const totalStudents = students.filter(s => s.status === 'Active').length;
  const totalFeesCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpectedFees = students
    .filter(s => s.status === 'Active')
    .reduce((sum, s) => sum + s.totalFee, 0);
  const pendingFees = totalExpectedFees - totalFeesCollected;
  
  // Calculate today's collections (simulating today as May 18, 2024)
  const todayPayments = payments.filter(p => p.date === '2024-05-18');
  const todayCollections = todayPayments.reduce((sum, p) => sum + p.amount, 0);
  
  return {
    totalStudents,
    totalFeesCollected,
    pendingFees,
    todayCollections
  };
};

// Monthly collection data for charts
export const getMonthlyCollectionData = (payments: Payment[]) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthMap: Record<string, number> = {};
  
  payments.forEach(p => {
    if (monthMap[p.month]) {
      monthMap[p.month] += p.amount;
    } else {
      monthMap[p.month] = p.amount;
    }
  });
  
  return months.map(month => ({
    month: month.substring(0, 3),
    collection: monthMap[month] || 0
  }));
};

// Class-wise student distribution
export const getClassWiseData = (students: Student[]) => {
  const classMap: Record<string, number> = {};
  
  students.filter(s => s.status === 'Active').forEach(s => {
    if (classMap[s.class]) {
      classMap[s.class]++;
    } else {
      classMap[s.class] = 1;
    }
  });
  
  return Object.entries(classMap).map(([cls, count]) => ({
    class: cls,
    students: count
  })).sort((a, b) => {
    const order = CLASSES.indexOf(a.class) - CLASSES.indexOf(b.class);
    return order;
  });
};

// Class-wise fee status
export const getClassWiseFeeStatus = (students: Student[], payments: Payment[]) => {
  const classData: Record<string, { expected: number; collected: number; students: number }> = {};
  
  students.filter(s => s.status === 'Active').forEach(s => {
    if (!classData[s.class]) {
      classData[s.class] = { expected: 0, collected: 0, students: 0 };
    }
    classData[s.class].expected += s.totalFee;
    classData[s.class].students++;
  });
  
  payments.forEach(p => {
    const student = students.find(s => s.studentId === p.studentId);
    if (student && classData[student.class]) {
      classData[student.class].collected += p.amount;
    }
  });
  
  return Object.entries(classData).map(([cls, data]) => ({
    class: cls,
    expected: data.expected,
    collected: data.collected,
    pending: data.expected - data.collected,
    students: data.students
  })).sort((a, b) => CLASSES.indexOf(a.class) - CLASSES.indexOf(b.class));
};

// Defaulters list
export const getDefaultersList = (students: Student[], payments: Payment[]) => {
  const paymentMap: Record<string, number> = {};
  
  payments.forEach(p => {
    if (paymentMap[p.studentId]) {
      paymentMap[p.studentId] += p.amount;
    } else {
      paymentMap[p.studentId] = p.amount;
    }
  });
  
  return students
    .filter(s => s.status === 'Active')
    .map(s => ({
      ...s,
      paid: paymentMap[s.studentId] || 0,
      balance: s.totalFee - (paymentMap[s.studentId] || 0)
    }))
    .filter(s => s.balance > 0)
    .sort((a, b) => b.balance - a.balance);
};
