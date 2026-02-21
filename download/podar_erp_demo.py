from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.lib.units import inch, cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
import os

# Register fonts
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
pdfmetrics.registerFont(TTFont('SimHei', '/usr/share/fonts/truetype/chinese/SimHei.ttf'))
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')

# Create document
doc = SimpleDocTemplate(
    "/home/z/my-project/download/Podar_Learn_School_ERP_Demo.pdf",
    pagesize=A4,
    rightMargin=1.5*cm,
    leftMargin=1.5*cm,
    topMargin=1.5*cm,
    bottomMargin=1.5*cm
)

# Styles
styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    'TitleStyle',
    fontName='Times New Roman',
    fontSize=28,
    textColor=colors.HexColor('#1e3a8a'),
    alignment=TA_CENTER,
    spaceAfter=20,
    spaceBefore=30
)

heading_style = ParagraphStyle(
    'HeadingStyle',
    fontName='Times New Roman',
    fontSize=16,
    textColor=colors.HexColor('#1e3a8a'),
    alignment=TA_LEFT,
    spaceBefore=20,
    spaceAfter=10,
    leading=20
)

subheading_style = ParagraphStyle(
    'SubHeadingStyle',
    fontName='Times New Roman',
    fontSize=13,
    textColor=colors.HexColor('#f59e0b'),
    alignment=TA_LEFT,
    spaceBefore=15,
    spaceAfter=8,
    leading=16
)

body_style = ParagraphStyle(
    'BodyStyle',
    fontName='Times New Roman',
    fontSize=11,
    textColor=colors.black,
    alignment=TA_JUSTIFY,
    spaceBefore=6,
    spaceAfter=6,
    leading=16
)

feature_style = ParagraphStyle(
    'FeatureStyle',
    fontName='Times New Roman',
    fontSize=11,
    textColor=colors.HexColor('#1e3a8a'),
    alignment=TA_LEFT,
    spaceBefore=4,
    spaceAfter=4,
    leftIndent=20,
    leading=14
)

story = []

# ============ COVER PAGE ============
story.append(Spacer(1, 2*cm))

# Try to add logo if exists
logo_path = "/home/z/my-project/public/podar-logo.png"
if os.path.exists(logo_path):
    logo = Image(logo_path, width=3*cm, height=3*cm)
    story.append(logo)
    story.append(Spacer(1, 1*cm))

story.append(Paragraph("<b>PODAR LEARN SCHOOL NIPHAD</b>", title_style))
story.append(Paragraph("<b>School ERP System</b>", ParagraphStyle(
    'SubTitle', fontName='Times New Roman', fontSize=22, 
    textColor=colors.HexColor('#f59e0b'), alignment=TA_CENTER, spaceAfter=30
)))

story.append(Paragraph("<b>Complete Demo Guide</b>", ParagraphStyle(
    'DemoTitle', fontName='Times New Roman', fontSize=18, 
    textColor=colors.HexColor('#333333'), alignment=TA_CENTER, spaceAfter=20
)))

story.append(Spacer(1, 2*cm))

# Info box
info_data = [
    ['Academic Year:', '2026-27'],
    ['Document Type:', 'Software Demo Guide'],
    ['Version:', '1.0'],
    ['Date:', 'February 2025'],
]

info_table = Table(info_data, colWidths=[4*cm, 6*cm])
info_table.setStyle(TableStyle([
    ('FONTNAME', (0, 0), (-1, -1), 'Times New Roman'),
    ('FONTSIZE', (0, 0), (-1, -1), 11),
    ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#666666')),
    ('TEXTCOLOR', (1, 0), (1, -1), colors.HexColor('#1e3a8a')),
    ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
    ('ALIGN', (1, 0), (1, -1), 'LEFT'),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
]))
story.append(info_table)

story.append(PageBreak())

# ============ TABLE OF CONTENTS ============
story.append(Paragraph("<b>Table of Contents</b>", heading_style))
story.append(Spacer(1, 0.5*cm))

toc_items = [
    "1. Software Overview",
    "2. Dashboard Features",
    "3. Student Management",
    "4. Fee Collection & Receipts",
    "5. QR Code Verification",
    "6. Cloud Backup System",
    "7. Reports & Analytics",
    "8. AI Assistant",
    "9. How to Use",
    "10. Technical Requirements",
]

for item in toc_items:
    story.append(Paragraph(item, body_style))

story.append(PageBreak())

# ============ SECTION 1: OVERVIEW ============
story.append(Paragraph("<b>1. Software Overview</b>", heading_style))
story.append(Paragraph(
    "Podar Learn School ERP is a complete school management software designed specifically for "
    "Podar Learn School Niphad. This modern, cloud-based system handles all school operations "
    "including student records, fee collection, receipt generation, and comprehensive reporting. "
    "The software features professional receipt design with unique QR codes for verification, "
    "automatic calculations, and secure cloud backup functionality.",
    body_style
))

story.append(Paragraph("<b>Key Highlights:</b>", subheading_style))

highlights = [
    "Complete Student Lifecycle Management from admission to graduation",
    "Professional Fee Receipts with QR code for instant verification",
    "Automatic fee calculations and balance tracking",
    "Cloud backup to protect all school data",
    "Real-time reports and analytics dashboard",
    "AI-powered assistant for quick queries",
    "Works on any device - Computer, Tablet, Mobile",
]

for h in highlights:
    story.append(Paragraph(f"• {h}", feature_style))

story.append(PageBreak())

# ============ SECTION 2: DASHBOARD ============
story.append(Paragraph("<b>2. Dashboard Features</b>", heading_style))
story.append(Paragraph(
    "The main dashboard provides a complete overview of school operations at a glance. "
    "Administrators can see key metrics including total students, fees collected, pending amounts, "
    "and today's collection status. The dashboard uses simple, easy-to-understand charts that show "
    "monthly collection trends and student distribution across classes.",
    body_style
))

story.append(Paragraph("<b>Dashboard Statistics Cards:</b>", subheading_style))

dashboard_data = [
    ['Card', 'Information Displayed'],
    ['Total Students', 'Count of active students in school'],
    ['Fees Collected', 'Total amount collected with percentage'],
    ['Pending Fees', 'Outstanding balance with defaulter count'],
    ['Today Collection', 'Daily collection amount and receipt count'],
]

dash_table = Table(dashboard_data, colWidths=[4*cm, 10*cm])
dash_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e3a8a')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('FONTNAME', (0, 0), (-1, -1), 'Times New Roman'),
    ('FONTSIZE', (0, 0), (-1, -1), 10),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BACKGROUND', (0, 1), (-1, -1), colors.white),
]))
story.append(dash_table)
story.append(Spacer(1, 0.5*cm))

story.append(Paragraph("<b>Visual Charts:</b>", subheading_style))
story.append(Paragraph(
    "• Monthly Collection Bar Chart - Shows fee collection for each month with current month highlighted in gold color<br/>"
    "• Students by Class Donut Chart - Visual representation of student distribution across different classes<br/>"
    "• Payment Methods Icons - Simple display showing UPI, Cash, Card, Cheque, Bank Transfer usage counts",
    body_style
))

story.append(PageBreak())

# ============ SECTION 3: STUDENT MANAGEMENT ============
story.append(Paragraph("<b>3. Student Management</b>", heading_style))
story.append(Paragraph(
    "The Student Management module provides comprehensive tools for managing all student records. "
    "Schools can add new students, update existing records, search and filter students by various criteria, "
    "and track fee payment progress for each student.",
    body_style
))

story.append(Paragraph("<b>Student Information Stored:</b>", subheading_style))

student_fields = [
    "Student Name, Father's Name, Mother's Name",
    "Date of Birth, Class and Section",
    "Contact Number and Alternate Contact",
    "Complete Address",
    "Admission Date and Status (Active/Inactive/Left)",
    "Annual Fee Amount with Payment Progress",
]

for field in student_fields:
    story.append(Paragraph(f"• {field}", feature_style))

story.append(Paragraph("<b>Search & Filter Options:</b>", subheading_style))
story.append(Paragraph(
    "Administrators can search students by name, student ID, or father's name. Additional filters "
    "allow viewing students by specific class or status (Active, Inactive, Left). Each student card "
    "displays a visual progress bar showing fee payment status - how much is paid versus total fee.",
    body_style
))

story.append(PageBreak())

# ============ SECTION 4: FEE COLLECTION ============
story.append(Paragraph("<b>4. Fee Collection & Receipts</b>", heading_style))
story.append(Paragraph(
    "The Fee Collection module streamlines the entire fee payment process. When collecting fees, "
    "the system automatically shows the student's pending balance, allows selection of payment mode, "
    "and generates a professional receipt instantly.",
    body_style
))

story.append(Paragraph("<b>Payment Modes Supported:</b>", subheading_style))

payment_modes = [
    "UPI - With transaction ID field",
    "Cash - Simple cash payment",
    "Card - Credit/Debit card with reference",
    "Cheque - With cheque number field",
    "Bank Transfer - NEFT/RTGS with reference",
]

for mode in payment_modes:
    story.append(Paragraph(f"• {mode}", feature_style))

story.append(Paragraph("<b>Receipt Design (Compact - 2 per A4 page):</b>", subheading_style))

receipt_content = """
Each receipt is designed to fit 2 on one A4 page, saving paper and printing costs. 
The receipt includes:<br/><br/>
• <b>School Logo and Name</b> - Podar Learn School Niphad branding at top<br/>
• <b>Unique QR Code</b> - Scannable code for instant verification<br/>
• <b>Receipt Number</b> - Auto-generated unique ID (REC-2026-XXXXXX)<br/>
• <b>Date and Time</b> - When payment was received<br/>
• <b>Student Details</b> - Name, Class, Section, Father's Name, Student ID<br/>
• <b>Fee Breakdown</b> - Particulars and amount table<br/>
• <b>Payment Summary</b> - Annual Fee, Previously Paid, Balance Due<br/>
• <b>Payment Mode</b> - How the fee was paid<br/>
• <b>Signature Lines</b> - For collector and parent<br/>
• <b>Verification Instructions</b> - "Scan QR to Verify" message
"""
story.append(Paragraph(receipt_content, body_style))

story.append(PageBreak())

# ============ SECTION 5: QR CODE ============
story.append(Paragraph("<b>5. QR Code Verification System</b>", heading_style))
story.append(Paragraph(
    "Every receipt comes with a unique QR code that enables instant verification. This innovative "
    "feature helps prevent fake receipts and allows parents to verify their payment authenticity. "
    "Each QR code is uniquely generated for that specific receipt.",
    body_style
))

story.append(Paragraph("<b>How QR Verification Works:</b>", subheading_style))

qr_steps = [
    "Step 1: Open any QR scanner app on your phone",
    "Step 2: Point the camera at the QR code on the receipt",
    "Step 3: The scanner will open a URL in your browser",
    "Step 4: The complete receipt details appear on screen",
    "Step 5: Verify all information matches the printed receipt",
]

for step in qr_steps:
    story.append(Paragraph(f"• {step}", feature_style))

story.append(Paragraph("<b>Security Benefits:</b>", subheading_style))
story.append(Paragraph(
    "The QR code verification system provides multiple security advantages. It prevents receipt "
    "forgery since each code is unique and stored in the system. Parents can instantly verify "
    "their payments without visiting the school office. The system maintains a complete audit trail "
    "of all receipts with timestamps and payment details.",
    body_style
))

story.append(PageBreak())

# ============ SECTION 6: CLOUD BACKUP ============
story.append(Paragraph("<b>6. Cloud Backup System</b>", heading_style))
story.append(Paragraph(
    "The Cloud Backup feature ensures that all school data is safely stored and can be recovered "
    "in case of any system issues. This automatic backup system protects student records, payment "
    "history, and school settings from being lost.",
    body_style
))

story.append(Paragraph("<b>Backup Features:</b>", subheading_style))

backup_features = [
    "One-click backup to cloud storage",
    "Automatic data encryption for security",
    "Backup includes all students, payments, and settings",
    "Restore data anytime from cloud backup",
    "View last backup timestamp",
    "Progress indicator during backup process",
]

for feature in backup_features:
    story.append(Paragraph(f"• {feature}", feature_style))

story.append(Paragraph("<b>Data Included in Backup:</b>", subheading_style))

backup_data = [
    ['Data Type', 'Contents'],
    ['Students', 'All student records with complete details'],
    ['Payments', 'Complete payment history with receipts'],
    ['Settings', 'School profile, address, contact info'],
    ['Activities', 'Recent system activity log'],
]

backup_table = Table(backup_data, colWidths=[4*cm, 10*cm])
backup_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#16a34a')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('FONTNAME', (0, 0), (-1, -1), 'Times New Roman'),
    ('FONTSIZE', (0, 0), (-1, -1), 10),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
]))
story.append(backup_table)

story.append(PageBreak())

# ============ SECTION 7: REPORTS ============
story.append(Paragraph("<b>7. Reports & Analytics</b>", heading_style))
story.append(Paragraph(
    "The Reports section provides comprehensive analytics and reporting tools for school management. "
    "Administrators can view collection reports, identify defaulters, and analyze class-wise performance.",
    body_style
))

story.append(Paragraph("<b>Report Types Available:</b>", subheading_style))

report_types = [
    ("Daily Collection Report", "Shows all payments collected on a specific date with receipt numbers, student names, amounts, and payment modes."),
    ("Class-wise Collection", "Displays total fees collected from each class, showing which classes have better payment compliance."),
    ("Defaulters List", "Lists all students with pending fees, sorted by highest balance due. Helps in follow-up for fee collection."),
]

for title, desc in report_types:
    story.append(Paragraph(f"<b>{title}:</b>", body_style))
    story.append(Paragraph(desc, body_style))
    story.append(Spacer(1, 0.3*cm))

story.append(PageBreak())

# ============ SECTION 8: AI ASSISTANT ============
story.append(Paragraph("<b>8. AI Assistant</b>", heading_style))
story.append(Paragraph(
    "The built-in AI Assistant provides instant answers to common queries about school operations. "
    "Administrators can ask questions in natural language and get immediate responses about fees, "
    "students, defaulters, and collection statistics.",
    body_style
))

story.append(Paragraph("<b>Sample Questions You Can Ask:</b>", subheading_style))

sample_questions = [
    "How much fees are pending?",
    "What is today's collection?",
    "Who are the top defaulters?",
    "How many students are there?",
    "Show me collection statistics",
    "What is the total fees collected?",
]

for q in sample_questions:
    story.append(Paragraph(f"• \"{q}\"", feature_style))

story.append(Paragraph(
    "The AI Assistant understands natural language and provides relevant, accurate responses "
    "based on the current data in the system. This feature saves time by eliminating the need "
    "to navigate through multiple screens for basic information.",
    body_style
))

story.append(PageBreak())

# ============ SECTION 9: HOW TO USE ============
story.append(Paragraph("<b>9. How to Use the Software</b>", heading_style))

story.append(Paragraph("<b>Adding a New Student:</b>", subheading_style))
story.append(Paragraph(
    "1. Click on 'Students' in the sidebar<br/>"
    "2. Click 'Add Student' button<br/>"
    "3. Fill in all required fields (marked with *)<br/>"
    "4. Annual fee is auto-calculated based on class<br/>"
    "5. Click 'Add Student' to save",
    body_style
))

story.append(Paragraph("<b>Collecting Fee Payment:</b>", subheading_style))
story.append(Paragraph(
    "1. Click on 'Fee Collection' in the sidebar<br/>"
    "2. Select student from dropdown (shows pending balance)<br/>"
    "3. Enter payment amount<br/>"
    "4. Select payment mode (UPI/Cash/Card/Cheque/Bank)<br/>"
    "5. Enter transaction reference if applicable<br/>"
    "6. Click 'Collect Fee' - Receipt generates automatically!",
    body_style
))

story.append(Paragraph("<b>Printing Receipts:</b>", subheading_style))
story.append(Paragraph(
    "1. After payment, receipt appears on screen<br/>"
    "2. Click 'Print' button<br/>"
    "3. 2 receipts fit on one A4 page (paper saving)<br/>"
    "4. Each receipt has unique QR code for verification",
    body_style
))

story.append(Paragraph("<b>Backing Up Data:</b>", subheading_style))
story.append(Paragraph(
    "1. Go to 'Settings' in the sidebar<br/>"
    "2. Find 'Cloud Storage Backup' section<br/>"
    "3. Click 'Backup to Cloud' button<br/>"
    "4. Wait for backup completion message<br/>"
    "5. To restore, click 'Restore from Cloud'",
    body_style
))

story.append(PageBreak())

# ============ SECTION 10: TECHNICAL ============
story.append(Paragraph("<b>10. Technical Requirements</b>", heading_style))

story.append(Paragraph("<b>System Requirements:</b>", subheading_style))
story.append(Paragraph(
    "• Any modern web browser (Chrome, Firefox, Safari, Edge)<br/>"
    "• Internet connection for initial access<br/>"
    "• Printer for receipt printing<br/>"
    "• Works on Windows, Mac, Linux computers<br/>"
    "• Mobile and tablet compatible",
    body_style
))

story.append(Paragraph("<b>Technology Stack:</b>", subheading_style))

tech_data = [
    ['Component', 'Technology'],
    ['Frontend', 'Next.js 15 with React'],
    ['Styling', 'Tailwind CSS with shadcn/ui'],
    ['Charts', 'Recharts for visualizations'],
    ['Database', 'Local storage with cloud backup'],
    ['QR Code', 'qrcode.react library'],
    ['Icons', 'Lucide React icons'],
]

tech_table = Table(tech_data, colWidths=[4*cm, 10*cm])
tech_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e3a8a')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('FONTNAME', (0, 0), (-1, -1), 'Times New Roman'),
    ('FONTSIZE', (0, 0), (-1, -1), 10),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
]))
story.append(tech_table)

story.append(Spacer(1, 1*cm))

# Contact section
story.append(Paragraph("<b>Contact for Demo:</b>", heading_style))
story.append(Paragraph(
    "To schedule a live demo of the Podar Learn School ERP system, please contact the school "
    "administration. The software can be customized further to meet specific requirements of "
    "Podar Learn School Niphad.",
    body_style
))

story.append(Spacer(1, 1*cm))

# Footer
story.append(Paragraph(
    "<i>This document is prepared for Podar Learn School Niphad - Academic Year 2026-27</i>",
    ParagraphStyle('Footer', fontName='Times New Roman', fontSize=10, 
                   textColor=colors.grey, alignment=TA_CENTER)
))

# Build PDF
doc.build(story)
print("PDF created successfully!")
