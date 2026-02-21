'use client'

import { useState, useRef } from 'react'
import { useERPStore, defaultClasses, defaultSections } from '@/lib/store'
import { QRCodeSVG } from 'qrcode.react'

// Format currency
const fm = (n: number) => '₹' + n.toLocaleString('en-IN')

// Format date
const fd = (d: string) => d ? new Date(d).toLocaleDateString('en-IN') : '-'

export default function ERPPage() {
  const hydrated = useERPStore((state) => state.hydrated)
  const currentUser = useERPStore((state) => state.currentUser)
  
  // Wait for hydration
  if (!hydrated) {
    return <LoadingScreen />
  }
  
  // Check login
  if (!currentUser) {
    return <LoginScreen />
  }
  
  return <MainApp />
}

// Loading Screen
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-xl font-bold">Podar Learn School ERP</div>
        <div className="text-blue-300">Loading...</div>
      </div>
    </div>
  )
}

// Login Screen
function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const store = useERPStore()
  
  const handleLogin = () => {
    if (store.login(email, password)) {
      setError('')
    } else {
      setError('Invalid credentials')
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl font-bold">P</span>
          </div>
          <h1 className="text-2xl font-bold text-blue-900">Podar Learn School</h1>
          <p className="text-gray-500">Niphad, Nashik</p>
          <p className="text-amber-500 font-medium mt-1">Academic Year: 2026-27</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter username"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter password"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          
          <button
            onClick={handleLogin}
            className="w-full bg-blue-900 text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition"
          >
            Login
          </button>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Demo: Use "admin" or "accountant" as username</p>
        </div>
      </div>
    </div>
  )
}

// Main App
function MainApp() {
  const store = useERPStore()
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'students', label: 'Students', icon: '👨‍🎓' },
    { id: 'fees', label: 'Fee Collection', icon: '💰' },
    { id: 'reports', label: 'Reports', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ]
  
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white flex flex-col min-h-screen fixed left-0 top-0 z-40">
        <div className="p-4 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <span className="text-blue-900 text-xl font-bold">P</span>
            </div>
            <div>
              <div className="font-bold">{store.currentSchool?.name || 'Podar Learn School'}</div>
              <div className="text-amber-400 text-sm">Niphad, Nashik</div>
              <div className="text-blue-300 text-xs">Year: {store.currentSchool?.academicYear || '2026-27'}</div>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => store.setCurrentTab(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg mb-1 flex items-center gap-3 transition ${
                store.currentTab === item.id
                  ? 'bg-amber-500 text-white'
                  : 'hover:bg-blue-800 text-blue-100'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-blue-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">
                {store.currentUser?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div>
              <div className="font-medium">{store.currentUser?.name || 'Accountant'}</div>
              <div className="text-blue-300 text-sm capitalize">{store.currentUser?.role || 'Admin'}</div>
            </div>
          </div>
          <button
            onClick={() => store.logout()}
            className="w-full bg-blue-800 hover:bg-blue-700 text-white py-2 rounded-lg text-sm transition"
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 ml-64 p-6">
        {store.currentTab === 'dashboard' && <Dashboard />}
        {store.currentTab === 'students' && <StudentManagement />}
        {store.currentTab === 'fees' && <FeeCollection />}
        {store.currentTab === 'reports' && <Reports />}
        {store.currentTab === 'settings' && <Settings />}
      </div>
    </div>
  )
}

// Dashboard
function Dashboard() {
  const store = useERPStore()
  const stats = store.getStats()
  
  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }
  
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-6 text-white">
        <div className="text-2xl font-bold">{greeting()}, {store.currentUser?.name || 'Accountant'}! 👨‍💼</div>
        <div className="text-blue-200 mt-1">Welcome to {store.currentSchool?.name || 'Podar Learn School Niphad'}</div>
        <div className="text-amber-300 font-medium">Academic Year: {store.currentSchool?.academicYear || '2026-27'}</div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => store.setCurrentTab('students')}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            + New Admission
          </button>
          <button
            onClick={() => store.setCurrentTab('fees')}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            Collect Fee
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents.toString()}
          color="blue"
          subtitle="Active admissions"
        />
        <StatCard
          title="Total Collected"
          value={fm(stats.totalCollected)}
          color="green"
          subtitle={`${store.payments.filter(p => p.status === 'Completed').length} receipts`}
        />
        <StatCard
          title="Total Pending"
          value={fm(stats.totalPending)}
          color="amber"
          subtitle={`${stats.defaulters} defaulters`}
        />
        <StatCard
          title="Today"
          value={fm(stats.todayCollection)}
          color="purple"
          subtitle={`${stats.todayReceipts} receipts`}
        />
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Monthly Collection */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Monthly Collection</h3>
          <div className="text-3xl font-bold text-green-600">{fm(stats.monthlyCollection)}</div>
          <div className="text-gray-500 text-sm">This month's total collection</div>
        </div>
        
        {/* Class Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Students by Class</h3>
          <div className="space-y-2">
            {defaultClasses.slice(0, 5).map((cls) => {
              const count = store.students.filter(s => s.class === cls && s.status === 'Active').length
              const percentage = stats.totalStudents > 0 ? (count / stats.totalStudents) * 100 : 0
              return (
                <div key={cls} className="flex items-center gap-3">
                  <div className="w-12 text-sm text-gray-600">{cls}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 rounded-full h-3"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-8 text-sm text-gray-600">{count}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Recent Payments */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4">Recent Payments</h3>
        {store.payments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">💰</div>
            <div>No payments yet</div>
            <div className="text-sm">Start collecting fees to see transactions here</div>
          </div>
        ) : (
          <div className="space-y-2">
            {store.payments.slice(-5).reverse().map((payment) => {
              const student = store.getStudent(payment.studentId)
              return (
                <div key={payment.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <div>
                    <div className="font-medium">{student?.name || payment.studentId}</div>
                    <div className="text-sm text-gray-500">
                      {student?.class}-{student?.section} | {payment.paymentMode} | {payment.receiptNo}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">{fm(payment.amount)}</div>
                    <div className="text-xs text-gray-400">{fd(payment.createdAt)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ title, value, color, subtitle }: { title: string; value: string; color: string; subtitle: string }) {
  const colors = {
    blue: 'bg-blue-900',
    green: 'bg-green-600',
    amber: 'bg-amber-500',
    purple: 'bg-purple-600'
  }
  
  return (
    <div className={`${colors[color]} text-white rounded-xl p-5`}>
      <div className="text-sm opacity-80">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      <div className="text-xs opacity-70 mt-1">{subtitle}</div>
    </div>
  )
}

// Student Management
function StudentManagement() {
  const store = useERPStore()
  const [showAdd, setShowAdd] = useState(false)
  const [showView, setShowView] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterClass, setFilterClass] = useState('')
  const [filterStatus, setFilterStatus] = useState('Active')
  
  const filteredStudents = store.students.filter((s) => {
    const matchesSearch = 
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(search.toLowerCase()) ||
      s.fatherName.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search)
    const matchesClass = !filterClass || s.class === filterClass
    const matchesStatus = s.status === filterStatus
    return matchesSearch && matchesClass && matchesStatus
  })
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-900">Student Management</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition flex items-center gap-2"
        >
          <span>+ New Admission</span>
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, ID, father name, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">All Classes</option>
            {defaultClasses.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Transferred">Transferred</option>
            <option value="Left">Left</option>
          </select>
        </div>
      </div>
      
      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👨‍🎓</div>
            <div className="text-xl font-medium text-gray-600">No students found</div>
            <div className="text-gray-500 mt-1">Add your first student to get started</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Admission No</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Student Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Class</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Father Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Phone</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Fee</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Balance</th>
                  <th className="px-4 py-3 text-center text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, i) => {
                  const balance = store.getStudentBalance(student.id)
                  return (
                    <tr key={student.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-sm font-mono">{student.admissionNo}</td>
                      <td className="px-4 py-3 font-medium">{student.name}</td>
                      <td className="px-4 py-3">{student.class}-{student.section}</td>
                      <td className="px-4 py-3 text-gray-600">{student.fatherName}</td>
                      <td className="px-4 py-3 text-gray-600">{student.phone}</td>
                      <td className="px-4 py-3 text-right">{fm(student.fee)}</td>
                      <td className={`px-4 py-3 text-right font-bold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {fm(balance)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => setShowView(student.id)}
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200"
                          >
                            View
                          </button>
                          <button
                            onClick={() => store.setCurrentTab('fees')}
                            className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200"
                          >
                            Pay
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 py-3 bg-gray-50 border-t text-center text-gray-600">
          Total: {filteredStudents.length} students
        </div>
      </div>
      
      {/* Add Student Modal */}
      {showAdd && <AddStudentModal onClose={() => setShowAdd(false)} />}
      
      {/* View Student Modal */}
      {showView && <ViewStudentModal studentId={showView} onClose={() => setShowView(null)} />}
    </div>
  )
}

// Add Student Modal
function AddStudentModal({ onClose }: { onClose: () => void }) {
  const store = useERPStore()
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    motherName: '',
    dob: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    class: '1st',
    section: 'A',
    rollNo: '',
    address: '',
    city: 'Niphad',
    state: 'Maharashtra',
    pincode: '422303',
    phone: '',
    altPhone: '',
    email: '',
    bloodGroup: '',
    aadhaarNo: '',
    concession: 0,
    admissionDate: new Date().toISOString().split('T')[0]
  })
  
  const fee = store.getFeeByClass(formData.class)
  
  const handleSubmit = () => {
    if (!formData.name || !formData.fatherName || !formData.phone) {
      alert('Please fill required fields: Name, Father Name, Phone')
      return
    }
    
    const student = store.addStudent({
      ...formData,
      status: 'Active'
    })
    
    alert(`Student Added Successfully!\nAdmission No: ${student.admissionNo}`)
    onClose()
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-3xl my-8">
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white rounded-t-xl">
          <h2 className="text-xl font-bold">New Admission</h2>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {/* Personal Details */}
            <div className="col-span-2">
              <h3 className="font-bold text-blue-900 mb-3">Personal Details</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Student Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter student name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Father Name *</label>
              <input
                type="text"
                value={formData.fatherName}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter father name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Mother Name</label>
              <input
                type="text"
                value={formData.motherName}
                onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            {/* Class Details */}
            <div className="col-span-2 mt-4">
              <h3 className="font-bold text-blue-900 mb-3">Class Details</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Class *</label>
              <select
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              >
                {defaultClasses.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Section</label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              >
                {defaultSections.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Roll Number</label>
              <input
                type="text"
                value={formData.rollNo}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Admission Date</label>
              <input
                type="date"
                value={formData.admissionDate}
                onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            
            {/* Contact Details */}
            <div className="col-span-2 mt-4">
              <h3 className="font-bold text-blue-900 mb-3">Contact Details</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Phone *</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Primary contact number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Alternate Phone</label>
              <input
                type="text"
                value={formData.altPhone}
                onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            
            {/* Fee Details */}
            <div className="col-span-2 mt-4">
              <h3 className="font-bold text-blue-900 mb-3">Fee Details</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Annual Fee</label>
              <div className="bg-blue-50 border rounded-lg px-3 py-2 font-bold text-blue-900">
                {fm(fee)}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Concession</label>
              <input
                type="number"
                value={formData.concession}
                onChange={(e) => setFormData({ ...formData, concession: Number(e.target.value) })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t flex gap-3">
          <button onClick={onClose} className="flex-1 border py-2 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} className="flex-1 bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800">
            Add Student
          </button>
        </div>
      </div>
    </div>
  )
}

// View Student Modal
function ViewStudentModal({ studentId, onClose }: { studentId: string; onClose: () => void }) {
  const store = useERPStore()
  const student = store.getStudent(studentId)
  const balance = store.getStudentBalance(studentId)
  const payments = store.payments.filter(p => p.studentId === studentId)
  
  if (!student) return null
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Student Details</h2>
          <button onClick={onClose} className="text-2xl text-gray-400">&times;</button>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Admission No</div>
              <div className="font-bold">{student.admissionNo}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Name</div>
              <div className="font-bold">{student.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Class</div>
              <div>{student.class}-{student.section}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Father Name</div>
              <div>{student.fatherName}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Phone</div>
              <div>{student.phone}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Fee</div>
              <div>{fm(student.fee)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Balance</div>
              <div className={`font-bold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {fm(balance)}
              </div>
            </div>
          </div>
          
          {/* Payment History */}
          <div className="mt-6">
            <h3 className="font-bold mb-3">Payment History</h3>
            {payments.length === 0 ? (
              <div className="text-gray-500 text-center py-4">No payments yet</div>
            ) : (
              <div className="space-y-2">
                {payments.map((p) => (
                  <div key={p.id} className="bg-gray-50 p-3 rounded flex justify-between">
                    <div>
                      <div className="font-medium">{p.receiptNo}</div>
                      <div className="text-sm text-gray-500">{fd(p.createdAt)} | {p.paymentMode}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{fm(p.amount)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t flex gap-3">
          <button onClick={onClose} className="flex-1 border py-2 rounded-lg">Close</button>
          <button
            onClick={() => { onClose(); store.setCurrentTab('fees') }}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg"
          >
            Collect Fee
          </button>
        </div>
      </div>
    </div>
  )
}

// Fee Collection
function FeeCollection() {
  const store = useERPStore()
  const [studentId, setStudentId] = useState('')
  const [amount, setAmount] = useState('')
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Card' | 'Cheque' | 'Bank Transfer'>('UPI')
  const [transactionId, setTransactionId] = useState('')
  const [nextDueDate, setNextDueDate] = useState('')
  const [remarks, setRemarks] = useState('')
  const [showReceipt, setShowReceipt] = useState<string | null>(null)
  
  const balance = studentId ? store.getStudentBalance(studentId) : 0
  const student = studentId ? store.getStudent(studentId) : null
  
  const handlePayment = () => {
    if (!studentId || !amount || Number(amount) <= 0) {
      alert('Please select student and enter valid amount')
      return
    }
    
    if (Number(amount) > balance) {
      alert('Amount cannot exceed balance')
      return
    }
    
    const payment = store.addPayment({
      schoolId: store.currentSchool?.id || 'SCH001',
      studentId,
      amount: Number(amount),
      paymentMode,
      transactionId,
      bankName: '',
      chequeNo: '',
      chequeDate: '',
      remarks,
      nextDueDate,
      status: 'Completed',
      collectedBy: store.currentUser?.name || 'Accountant'
    })
    
    setShowReceipt(payment.id)
    setStudentId('')
    setAmount('')
    setTransactionId('')
    setNextDueDate('')
    setRemarks('')
  }
  
  const activeStudents = store.students.filter(s => s.status === 'Active')
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-blue-900">Fee Collection</h1>
      
      <div className="grid grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-bold mb-4">Collect Fee</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select Student *</label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">-- Select Student --</option>
                {activeStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.class}-{s.section}) - Balance: {fm(store.getStudentBalance(s.id))}
                  </option>
                ))}
              </select>
            </div>
            
            {student && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Student Name</div>
                    <div className="font-bold">{student.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Class</div>
                    <div className="font-bold">{student.class}-{student.section}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Father Name</div>
                    <div className="font-bold">{student.fatherName}</div>
                  </div>
                </div>
              </div>
            )}
            
            {studentId && (
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-amber-700">Current Balance</div>
                    <div className="text-2xl font-bold text-amber-600">{fm(balance)}</div>
                  </div>
                  <button
                    onClick={() => setAmount(balance.toString())}
                    className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Pay Full
                  </button>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Amount *</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Enter amount"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Payment Mode</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as any)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
            </div>
            
            {paymentMode === 'UPI' && (
              <div>
                <label className="block text-sm font-medium mb-1">Transaction ID</label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="UPI Transaction ID"
                />
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Next Due Date</label>
                <input
                  type="date"
                  value={nextDueDate}
                  onChange={(e) => setNextDueDate(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Remarks</label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>
            
            <button
              onClick={handlePayment}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Generate Receipt
            </button>
          </div>
        </div>
        
        {/* Recent Payments */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-bold mb-4">Recent Payments</h2>
          
          {store.payments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">💰</div>
              <div>No payments yet</div>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {store.payments.slice(-10).reverse().map((p) => {
                const s = store.getStudent(p.studentId)
                return (
                  <div
                    key={p.id}
                    className="bg-gray-50 p-3 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => setShowReceipt(p.id)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">{s?.name || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">{p.receiptNo}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{fm(p.amount)}</div>
                        <div className="text-xs text-gray-400">{p.paymentMode}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Receipt Modal */}
      {showReceipt && <ReceiptModal paymentId={showReceipt} onClose={() => setShowReceipt(null)} />}
    </div>
  )
}

// Receipt Modal
function ReceiptModal({ paymentId, onClose }: { paymentId: string; onClose: () => void }) {
  const store = useERPStore()
  const payment = store.getPayment(paymentId)
  const student = payment ? store.getStudent(payment.studentId) : null
  
  if (!payment || !student) return null
  
  const receiptUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}?receipt=${payment.receiptNo}`
    : ''
  
  const handlePrint = () => {
    window.print()
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 print:bg-white print:p-0">
      <div className="bg-white rounded-lg shadow-xl print:shadow-none" style={{ width: '300px' }}>
        {/* Header */}
        <div className="bg-blue-900 text-white p-3 text-center rounded-t-lg">
          <div className="font-bold">{store.currentSchool?.name || 'Podar Learn School'}</div>
          <div className="text-xs text-blue-200">{store.currentSchool?.address}, {store.currentSchool?.city}</div>
          <div className="text-xs text-amber-300">Academic Year: {store.currentSchool?.academicYear}</div>
        </div>
        
        {/* QR Code */}
        <div className="flex justify-center py-3 bg-gray-50">
          <QRCodeSVG value={receiptUrl} size={80} />
        </div>
        
        {/* Receipt Details */}
        <div className="p-3 text-sm">
          <div className="flex justify-between border-b pb-2 mb-2">
            <span className="text-gray-500">Receipt No:</span>
            <span className="font-bold">{payment.receiptNo}</span>
          </div>
          
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Date:</span>
            <span>{fd(payment.createdAt)}</span>
          </div>
          
          <div className="flex justify-between mb-1">
            <span className="text-gray-500">Student:</span>
            <span className="font-medium">{student.name}</span>
          </div>
          
          <div className="flex justify-between mb-1">
            <span className="text-gray-500">Class:</span>
            <span>{student.class}-{student.section}</span>
          </div>
          
          <div className="flex justify-between mb-1">
            <span className="text-gray-500">Father:</span>
            <span>{student.fatherName}</span>
          </div>
          
          <div className="flex justify-between mb-1">
            <span className="text-gray-500">Admission No:</span>
            <span className="font-mono text-xs">{student.admissionNo}</span>
          </div>
          
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Amount Paid:</span>
              <span className="font-bold text-green-600 text-lg">{fm(payment.amount)}</span>
            </div>
            
            <div className="flex justify-between mt-1">
              <span className="text-gray-500">Balance:</span>
              <span className={`font-bold ${payment.balance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                {fm(payment.balance)}
              </span>
            </div>
          </div>
          
          {payment.nextDueDate && (
            <div className="mt-2 bg-amber-50 p-2 rounded text-xs">
              <span className="text-amber-700">Next Due: </span>
              <span className="font-bold text-amber-700">{fd(payment.nextDueDate)}</span>
            </div>
          )}
          
          <div className="flex justify-between mt-2 text-xs">
            <span className="text-gray-500">Payment Mode:</span>
            <span>{payment.paymentMode}</span>
          </div>
          
          {payment.transactionId && (
            <div className="text-xs text-gray-500 mt-1">
              Txn ID: {payment.transactionId}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-3 border-t text-center text-xs text-gray-500">
          <div>Thank you for your payment!</div>
          <div className="mt-1">Scan QR to verify receipt</div>
        </div>
        
        {/* Buttons */}
        <div className="p-3 border-t flex gap-2 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 bg-blue-900 text-white py-2 rounded font-medium"
          >
            Print
          </button>
          <button
            onClick={onClose}
            className="flex-1 border py-2 rounded font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// Reports
function Reports() {
  const store = useERPStore()
  const stats = store.getStats()
  
  const defaulters = store.students
    .filter(s => s.status === 'Active' && store.getStudentBalance(s.id) > 0)
    .map(s => ({ ...s, balance: store.getStudentBalance(s.id) }))
    .sort((a, b) => b.balance - a.balance)
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-blue-900">Reports</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl">
          <div className="text-sm text-blue-600">Total Collection</div>
          <div className="text-2xl font-bold text-blue-900">{fm(stats.totalCollected)}</div>
          <div className="text-xs text-blue-500">{store.payments.filter(p => p.status === 'Completed').length} receipts</div>
        </div>
        
        <div className="bg-amber-50 p-4 rounded-xl">
          <div className="text-sm text-amber-600">Total Pending</div>
          <div className="text-2xl font-bold text-amber-900">{fm(stats.totalPending)}</div>
          <div className="text-xs text-amber-500">{stats.defaulters} defaulters</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-xl">
          <div className="text-sm text-green-600">Today</div>
          <div className="text-2xl font-bold text-green-900">{fm(stats.todayCollection)}</div>
          <div className="text-xs text-green-500">{stats.todayReceipts} receipts</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-xl">
          <div className="text-sm text-purple-600">This Month</div>
          <div className="text-2xl font-bold text-purple-900">{fm(stats.monthlyCollection)}</div>
          <div className="text-xs text-purple-500">{new Date().toLocaleString('en-IN', { month: 'long' })}</div>
        </div>
      </div>
      
      {/* Defaulters List */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg">Defaulters List</h2>
          <p className="text-gray-500 text-sm">Students with pending fees</p>
        </div>
        
        {defaulters.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <div className="text-xl font-medium text-green-600">No Defaulters!</div>
            <div className="text-gray-500">All fees collected</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-red-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-red-900">Admission No</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-red-900">Student Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-red-900">Class</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-red-900">Father Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-red-900">Phone</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-red-900">Pending Amount</th>
                </tr>
              </thead>
              <tbody>
                {defaulters.slice(0, 50).map((s, i) => (
                  <tr key={s.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-sm font-mono">{s.admissionNo}</td>
                    <td className="px-4 py-3 font-medium">{s.name}</td>
                    <td className="px-4 py-3">{s.class}-{s.section}</td>
                    <td className="px-4 py-3 text-gray-600">{s.fatherName}</td>
                    <td className="px-4 py-3 text-gray-600">{s.phone}</td>
                    <td className="px-4 py-3 text-right font-bold text-red-600">{fm(s.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="p-4 bg-gray-50 border-t text-center text-gray-600">
          Total Defaulters: {defaulters.length} | Total Pending: {fm(defaulters.reduce((sum, s) => sum + s.balance, 0))}
        </div>
      </div>
    </div>
  )
}

// Settings
function Settings() {
  const store = useERPStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleBackup = () => {
    const data = store.backupData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `podar-erp-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
  
  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      const data = event.target?.result as string
      if (store.restoreData(data)) {
        alert('Data restored successfully!')
      } else {
        alert('Failed to restore data. Invalid file format.')
      }
    }
    reader.readAsText(file)
  }
  
  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete ALL data? This cannot be undone!')) {
      store.clearAllData()
      alert('All data cleared!')
    }
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-blue-900">Settings</h1>
      
      {/* School Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="font-bold text-lg mb-4">School Information</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">School Name</div>
            <div className="font-medium">{store.currentSchool?.name}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Address</div>
            <div className="font-medium">{store.currentSchool?.address}, {store.currentSchool?.city}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">State</div>
            <div className="font-medium">{store.currentSchool?.state} - {store.currentSchool?.pincode}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Academic Year</div>
            <div className="font-medium">{store.currentSchool?.academicYear}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Phone</div>
            <div className="font-medium">{store.currentSchool?.phone}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Email</div>
            <div className="font-medium">{store.currentSchool?.email}</div>
          </div>
        </div>
      </div>
      
      {/* Data Management */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="font-bold text-lg mb-4">Data Management</h2>
        
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={handleBackup}
            className="bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
          >
            ↓ Backup Data
          </button>
          
          <label className="bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer text-center">
            ↑ Restore Data
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleRestore}
              className="hidden"
            />
          </label>
          
          <button
            onClick={handleClearAll}
            className="bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition"
          >
            🗑️ Clear All Data
          </button>
        </div>
        
        <div className="mt-4 p-4 bg-amber-50 rounded-lg">
          <div className="font-medium text-amber-800">⚠️ Important Notes:</div>
          <ul className="text-sm text-amber-700 mt-2 space-y-1">
            <li>• Backup saves all students, payments, and settings to a JSON file</li>
            <li>• Restore replaces ALL current data with the backup file</li>
            <li>• Clear All permanently deletes all data</li>
            <li>• Data is stored in browser localStorage</li>
          </ul>
        </div>
      </div>
      
      {/* Statistics */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="font-bold text-lg mb-4">Data Statistics</h2>
        
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-900">{store.students.length}</div>
            <div className="text-sm text-blue-600">Students</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-900">{store.payments.length}</div>
            <div className="text-sm text-green-600">Payments</div>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-amber-900">{store.feeStructure.length}</div>
            <div className="text-sm text-amber-600">Fee Classes</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-900">{store.schools.length}</div>
            <div className="text-sm text-purple-600">Schools</div>
          </div>
        </div>
      </div>
    </div>
  )
}
