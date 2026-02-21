from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak, KeepTogether
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
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')

# Create document
doc = SimpleDocTemplate(
    "/home/z/my-project/download/Podar_ERP_Complete_Visual_Demo_Guide.pdf",
    pagesize=A4,
    rightMargin=1.5*cm,
    leftMargin=1.5*cm,
    topMargin=1.5*cm,
    bottomMargin=1.5*cm
)

styles = getSampleStyleSheet()

# Custom styles
title_style = ParagraphStyle('TitleStyle', fontName='Times New Roman', fontSize=24, 
    textColor=colors.HexColor('#1e3a8a'), alignment=TA_CENTER, spaceAfter=15, spaceBefore=20)

heading_style = ParagraphStyle('HeadingStyle', fontName='Times New Roman', fontSize=14, 
    textColor=colors.HexColor('#1e3a8a'), alignment=TA_LEFT, spaceBefore=15, spaceAfter=8, leading=18)

subheading_style = ParagraphStyle('SubHeadingStyle', fontName='Times New Roman', fontSize=12, 
    textColor=colors.HexColor('#f59e0b'), alignment=TA_LEFT, spaceBefore=10, spaceAfter=6, leading=15)

body_style = ParagraphStyle('BodyStyle', fontName='Times New Roman', fontSize=10, 
    textColor=colors.black, alignment=TA_JUSTIFY, spaceBefore=4, spaceAfter=4, leading=14)

code_style = ParagraphStyle('CodeStyle', fontName='Times New Roman', fontSize=9, 
    textColor=colors.HexColor('#1e3a8a'), alignment=TA_LEFT, spaceBefore=2, spaceAfter=2, 
    leftIndent=10, leading=11, backColor=colors.HexColor('#f5f5f5'))

step_style = ParagraphStyle('StepStyle', fontName='Times New Roman', fontSize=10, 
    textColor=colors.black, alignment=TA_LEFT, spaceBefore=3, spaceAfter=3, leftIndent=15, leading=13)

box_style = ParagraphStyle('BoxStyle', fontName='Times New Roman', fontSize=9, 
    textColor=colors.HexColor('#333333'), alignment=TA_LEFT, spaceBefore=2, spaceAfter=2, 
    leading=11, leftIndent=5, rightIndent=5)

story = []

# ============ COVER PAGE ============
story.append(Spacer(1, 1*cm))

# Add logo if exists
logo_path = "/home/z/my-project/public/podar-logo.png"
if os.path.exists(logo_path):
    logo = Image(logo_path, width=2.5*cm, height=2.5*cm)
    story.append(logo)

story.append(Spacer(1, 0.5*cm))
story.append(Paragraph("<b>PODAR LEARN SCHOOL NIPHAD</b>", title_style))
story.append(Paragraph("<b>ERP Software</b>", ParagraphStyle('SubTitle', fontName='Times New Roman', 
    fontSize=18, textColor=colors.HexColor('#f59e0b'), alignment=TA_CENTER, spaceAfter=15)))
story.append(Paragraph("<b>Complete Visual Demo Guide</b>", ParagraphStyle('DemoTitle', 
    fontName='Times New Roman', fontSize=14, textColor=colors.HexColor('#333333'), 
    alignment=TA_CENTER, spaceAfter=10)))

story.append(Spacer(1, 1*cm))

# Info box
info_text = """
<b>How to Use This Guide:</b><br/>
1. Open software at: <font color="#1e3a8a"><b>http://localhost:3000</b></font><br/>
2. Follow each section step by step<br/>
3. Practice all features before demo<br/>
4. Show this guide during school demo<br/>
<br/>
<b>Academic Year:</b> 2026-27<br/>
<b>Version:</b> 1.0<br/>
<b>Date:</b> February 2025
"""
story.append(Paragraph(info_text, body_style))

story.append(PageBreak())

# ============ SECTION 1: SOFTWARE ACCESS ============
story.append(Paragraph("<b>SECTION 1: How to Open the Software</b>", heading_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Step 1: Open Browser</b>", subheading_style))
story.append(Paragraph("Open any web browser on your computer (Chrome, Firefox, Safari, Edge)", body_style))

story.append(Paragraph("<b>Step 2: Type Address</b>", subheading_style))
story.append(Paragraph("In the address bar, type:", body_style))
story.append(Paragraph("<b>http://localhost:3000</b>", code_style))

story.append(Paragraph("<b>Step 3: Press Enter</b>", subheading_style))
story.append(Paragraph("The software will open automatically. You will see the Dashboard screen.", body_style))

story.append(Spacer(1, 0.5*cm))

# Visual representation
visual1 = """
<b>What You Will See:</b><br/>
┌─────────────────────────────────────────────────────────────────┐<br/>
│ [LOGO] PODAR LEARN SCHOOL NIPHAD                                │<br/>
│        Excellence in Education                                  │<br/>
├─────────────────────────────────────────────────────────────────┤<br/>
│ Dashboard │ Students │ Fees │ Reports │ QR │ AI │ Settings     │<br/>
├─────────────────────────────────────────────────────────────────┤<br/>
│                                                                 │<br/>
│  Good Morning, Accountant!                                      │<br/>
│                                                                 │<br/>
│  [17 Students] [₹3.8L Collected] [₹4.2L Pending] [₹50K Today] │<br/>
│                                                                 │<br/>
└─────────────────────────────────────────────────────────────────┘
"""
story.append(Paragraph(visual1, box_style))

story.append(PageBreak())

# ============ SECTION 2: SIDEBAR NAVIGATION ============
story.append(Paragraph("<b>SECTION 2: Sidebar Navigation (Left Side)</b>", heading_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("The sidebar on the left side helps you navigate between different sections:", body_style))

sidebar_visual = """
<b>Sidebar Layout:</b><br/>
┌─────────────────────┐<br/>
│ [LOGO]              │<br/>
│ Podar Learn School  │<br/>
│ Niphad              │<br/>
├─────────────────────┤<br/>
│ 🏠 Dashboard        │  ← Main overview screen<br/>
│ 👥 Students         │  ← Add/View students<br/>
│ 💰 Fee Collection   │  ← Collect fees<br/>
│ 📊 Reports          │  ← View reports<br/>
│ 📱 QR Lookup        │  ← Verify receipts<br/>
│ 🤖 AI Assistant     │  ← Ask questions<br/>
│ ⚙️ Settings         │  ← School settings<br/>
├─────────────────────┤<br/>
│ [AC] Accountant     │  ← Logged in user<br/>
│ accountant@podar... │<br/>
└─────────────────────┘
"""
story.append(Paragraph(sidebar_visual, box_style))

story.append(Paragraph("<b>How to Navigate:</b>", subheading_style))
story.append(Paragraph("• Click on any menu item to open that section", step_style))
story.append(Paragraph("• The current section is highlighted with gold color", step_style))
story.append(Paragraph("• On mobile, click the hamburger menu (☰) to see sidebar", step_style))

story.append(PageBreak())

# ============ SECTION 3: DASHBOARD ============
story.append(Paragraph("<b>SECTION 3: Dashboard (Main Screen)</b>", heading_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>What is Dashboard?</b>", subheading_style))
story.append(Paragraph("Dashboard is the first screen you see. It shows complete school overview at one place.", body_style))

dashboard_visual = """
<b>Dashboard Layout:</b><br/>
┌───────────────────────────────────────────────────────────────────────────┐<br/>
│ Good Morning, Accountant!                                                 │<br/>
│ Here's your school's financial overview for today.                       │<br/>
│                                                                           │<br/>
│ [ + New Admission ]  [ ₹ Collect Fee ]                                    │<br/>
└───────────────────────────────────────────────────────────────────────────┘<br/>
<br/>
<b>Statistics Cards (4 Cards):</b><br/>
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐<br/>
│ 👥           │  │ 💰           │  │ ⏳           │  │ 📊           │<br/>
│   17         │  │  ₹3,80,000   │  │  ₹4,20,000   │  │   ₹50,000    │<br/>
│  Students    │  │  Collected   │  │  Pending     │  │   Today      │<br/>
│  ▲ Active    │  │  ████ 65%    │  │  ⚠ 5 Due     │  │  📄 3 Rec    │<br/>
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘<br/>
<br/>
<b>What Each Card Shows:</b><br/>
• <b>Total Students:</b> Number of active students in school<br/>
• <b>Fees Collected:</b> Total money collected with percentage bar<br/>
• <b>Pending Fees:</b> Outstanding amount and defaulter count<br/>
• <b>Today's Collection:</b> Today's money and receipt count
"""
story.append(Paragraph(dashboard_visual, box_style))

story.append(Paragraph("<b>Quick Actions (4 Buttons):</b>", subheading_style))
story.append(Paragraph("• <b>New Student:</b> Add a new student", step_style))
story.append(Paragraph("• <b>Collect Fee:</b> Open fee collection screen", step_style))
story.append(Paragraph("• <b>Reports:</b> View all reports", step_style))
story.append(Paragraph("• <b>Scan QR:</b> Open QR scanner", step_style))

story.append(PageBreak())

# ============ SECTION 4: ADD STUDENT ============
story.append(Paragraph("<b>SECTION 4: How to Add New Student</b>", heading_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Method 1: From Dashboard</b>", subheading_style))
story.append(Paragraph("• Click on <b>'New Admission'</b> button on dashboard", step_style))

story.append(Paragraph("<b>Method 2: From Students Section</b>", subheading_style))
story.append(Paragraph("• Click on <b>'Students'</b> in sidebar", step_style))
story.append(Paragraph("• Click on <b>'Add Student'</b> button", step_style))

add_student_visual = """
<b>Add Student Form:</b><br/>
┌───────────────────────────────────────────────────────────────────┐<br/>
│ + Add New Student                                          [X]  │<br/>
├───────────────────────────────────────────────────────────────────┤<br/>
│                                                                   │<br/>
│  Student Name *           Father's Name *                        │<br/>
│  ┌──────────────────┐     ┌──────────────────────────────────┐   │<br/>
│  │ Aarav Sharma     │     │ Rajesh Sharma                    │   │<br/>
│  └──────────────────┘     └──────────────────────────────────┘   │<br/>
│                                                                   │<br/>
│  Mother's Name            Date of Birth                          │<br/>
│  ┌──────────────────┐     ┌──────────────────┐                  │<br/>
│  │ Priya Sharma     │     │ 15/03/2020       │                  │<br/>
│  └──────────────────┘     └──────────────────┘                  │<br/>
│                                                                   │<br/>
│  Class *                  Section *                              │<br/>
│  ┌──────────────────┐     ┌──────────────────┐                  │<br/>
│  │ Nursery       ▼  │     │ A             ▼  │                  │<br/>
│  └──────────────────┘     └──────────────────┘                  │<br/>
│                                                                   │<br/>
│  Contact Number *         Alternate Contact                      │<br/>
│  ┌──────────────────┐     ┌──────────────────┐                  │<br/>
│  │ 9876543210       │     │ 9876543211       │                  │<br/>
│  └──────────────────┘     └──────────────────┘                  │<br/>
│                                                                   │<br/>
│  Address                                                          │<br/>
│  ┌──────────────────────────────────────────────────────────┐   │<br/>
│  │ 123, Sector 15, Noida, UP - 201301                       │   │<br/>
│  └──────────────────────────────────────────────────────────┘   │<br/>
│                                                                   │<br/>
│  Admission Date           Annual Fee (Auto)                      │<br/>
│  ┌──────────────────┐     ┌──────────────────┐                  │<br/>
│  │ 20/02/2026       │     │ ₹36,000          │                  │<br/>
│  └──────────────────┘     └──────────────────┘                  │<br/>
│                                                                   │<br/>
│                    [Cancel]  [Add Student]                        │<br/>
└───────────────────────────────────────────────────────────────────┘
"""
story.append(Paragraph(add_student_visual, box_style))

story.append(Paragraph("<b>Important Points:</b>", subheading_style))
story.append(Paragraph("• Fields marked with * are required", step_style))
story.append(Paragraph("• Annual Fee is automatically set based on class selected", step_style))
story.append(Paragraph("• Fee Structure: Nursery ₹36K, LKG ₹38K, UKG ₹40K, 1st-2nd ₹42K, etc.", step_style))

story.append(PageBreak())

# ============ SECTION 5: FEE COLLECTION ============
story.append(Paragraph("<b>SECTION 5: How to Collect Fee (Most Important)</b>", heading_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Step-by-Step Process:</b>", subheading_style))

fee_visual = """
<b>Fee Collection Screen:</b><br/>
┌───────────────────────────────────────────────────────────────────┐<br/>
│ 💰 Fee Collection                                                 │<br/>
├───────────────────────────────────────────────────────────────────┤<br/>
│                                                                   │<br/>
│  <b>Step 1: Select Student</b>                                        │<br/>
│  ┌─────────────────────────────────────────────────────────────┐ │<br/>
│  │ Aarav Sharma (Nursery-A) - Pending: ₹9,000          ▼    │ │<br/>
│  └─────────────────────────────────────────────────────────────┘ │<br/>
│  <i>↑ This shows student name, class, AND pending balance!</i>       │<br/>
│                                                                   │<br/>
│  <b>Step 2: Enter Amount</b>                                          │<br/>
│  Amount (₹) *                                                    │<br/>
│  ┌─────────────────────────────────────────────────────────────┐ │<br/>
│  │ 5000                                                       │ │<br/>
│  └─────────────────────────────────────────────────────────────┘ │<br/>
│                                                                   │<br/>
│  <b>Step 3: Select Payment Mode</b>                                   │<br/>
│  Payment Mode *                                                  │<br/>
│  ┌─────────────────────────────────────────────────────────────┐ │<br/>
│  │ UPI                                                    ▼   │ │<br/>
│  └─────────────────────────────────────────────────────────────┘ │<br/>
│  Options: UPI | Cash | Card | Cheque | Bank Transfer            │<br/>
│                                                                   │<br/>
│  <b>Step 4: Enter Reference (Optional)</b>                            │<br/>
│  Transaction ID                                                  │<br/>
│  ┌─────────────────────────────────────────────────────────────┐ │<br/>
│  │ UPI123456789                                               │ │<br/>
│  └─────────────────────────────────────────────────────────────┘ │<br/>
│                                                                   │<br/>
│  <b>Step 5: Click Button</b>                                          │<br/>
│              ┌─────────────────────────────────┐                  │<br/>
│              │     💰 COLLECT FEE             │                  │<br/>
│              └─────────────────────────────────┘                  │<br/>
└───────────────────────────────────────────────────────────────────┘
"""
story.append(Paragraph(fee_visual, box_style))

story.append(Paragraph("<b>Payment Mode Options:</b>", subheading_style))

payment_table_data = [
    ['Mode', 'When to Use', 'Extra Field'],
    ['UPI', 'Google Pay, PhonePe, Paytm', 'Transaction ID'],
    ['Cash', 'Cash payment', 'None'],
    ['Card', 'Credit/Debit card', 'Card Reference'],
    ['Cheque', 'Cheque payment', 'Cheque Number'],
    ['Bank Transfer', 'NEFT/RTGS', 'Reference Number'],
]

payment_table = Table(payment_table_data, colWidths=[3*cm, 6*cm, 4*cm])
payment_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e3a8a')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('FONTNAME', (0, 0), (-1, -1), 'Times New Roman'),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
]))
story.append(payment_table)

story.append(PageBreak())

# ============ SECTION 6: RECEIPT ============
story.append(Paragraph("<b>SECTION 6: Receipt (After Fee Collection)</b>", heading_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Receipt Appears Automatically!</b>", subheading_style))
story.append(Paragraph("After clicking 'Collect Fee', the receipt appears immediately on screen.", body_style))

receipt_visual = """
<b>Receipt Design (Compact - 2 per A4 Page):</b><br/>
┌───────────────────────────────────────────────────────┐<br/>
│ ┌─────────┐ PODAR LEARN SCHOOL  ┌─────────────────┐ │<br/>
│ │ [LOGO]  │      Niphad         │   ██████████    │ │<br/>
│ │         │                     │   █ QR CODE █   │ │<br/>
│ └─────────┘                     │   ██████████    │ │<br/>
│                                 └─────────────────┘ │<br/>
├───────────────────────────────────────────────────────┤<br/>
│          💰 FEE RECEIPT | AY: 2026-27                 │<br/>
├───────────────────────────────────────────────────────┤<br/>
│ Receipt: REC-2026-001234    Date: 20 Feb 2026        │<br/>
│                              Time: 10:30 AM          │<br/>
├───────────────────────────────────────────────────────┤<br/>
│ Student: Aarav Sharma         Class: Nursery-A       │<br/>
│ Father:  Rajesh Sharma        ID: PLS2026NR001       │<br/>
├───────────────────────────────────────────────────────┤<br/>
│ Particulars              │ Amount                    │<br/>
│ ────────────────────────────────────────────────────│<br/>
│ Tuition Fee              │ ₹5,000                    │<br/>
├───────────────────────────────────────────────────────┤<br/>
│ Annual Fee: ₹36,000     Prev Paid: ₹22,000          │<br/>
│                                                       │<br/>
│ Balance: ₹9,000          ┌─────────────────┐         │<br/>
│                          │ Paid: ₹5,000   │         │<br/>
│                          └─────────────────┘         │<br/>
├───────────────────────────────────────────────────────┤<br/>
│ Mode: UPI  │  Ref: UPI123456789                       │<br/>
├───────────────────────────────────────────────────────┤<br/>
│ Collector         │ 📱 Scan QR to Verify  │ Parent   │<br/>
│ ____________      │                       │ ________ │<br/>
├───────────────────────────────────────────────────────┤<br/>
│ ✓ Thank you! This is a computer generated receipt.   │<br/>
└───────────────────────────────────────────────────────┘<br/>
<br/>
<b>Buttons at Bottom:</b><br/>
[ Close ]  [ 🖨️ Print ]  [ Share ]
"""
story.append(Paragraph(receipt_visual, box_style))

story.append(Paragraph("<b>Receipt Key Features:</b>", subheading_style))
story.append(Paragraph("• <b>QR Code:</b> Unique for each receipt - scan to verify", step_style))
story.append(Paragraph("• <b>Receipt Number:</b> Auto-generated (REC-2026-XXXXXX)", step_style))
story.append(Paragraph("• <b>Complete Student Info:</b> Name, Class, Father's Name, ID", step_style))
story.append(Paragraph("• <b>Fee Summary:</b> Shows Annual, Previous, Balance, Today's Payment", step_style))
story.append(Paragraph("• <b>Payment Mode:</b> Shows how payment was made", step_style))
story.append(Paragraph("• <b>2 per A4 Page:</b> Saves paper when printing", step_style))

story.append(PageBreak())

# ============ SECTION 7: QR CODE ============
story.append(Paragraph("<b>SECTION 7: QR Code Verification</b>", heading_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>What is QR Verification?</b>", subheading_style))
story.append(Paragraph("Each receipt has a unique QR code. When scanned, it shows the complete receipt details online. This helps prevent fake receipts.", body_style))

story.append(Paragraph("<b>How to Verify Receipt by QR Code:</b>", subheading_style))

qr_steps = """
<b>Method 1: Scan QR Code</b><br/>
┌───────────────────────────────────────────────────────────────┐<br/>
│ Step 1: Open any QR scanner app on your phone                 │<br/>
│         (Google Lens, PhonePe, Paytm, etc.)                   │<br/>
│                                                               │<br/>
│ Step 2: Point camera at the QR code on printed receipt        │<br/>
│                                                               │<br/>
│ Step 3: A URL will open in browser                            │<br/>
│         Example: localhost:3000/?receipt=REC-2026-001234      │<br/>
│                                                               │<br/>
│ Step 4: Complete receipt details appear on screen             │<br/>
│                                                               │<br/>
│ Step 5: Match all details with printed receipt                │<br/>
└───────────────────────────────────────────────────────────────┘<br/>
<br/>
<b>Method 2: Enter Receipt ID Manually</b><br/>
┌───────────────────────────────────────────────────────────────┐<br/>
│ Step 1: Click 'QR Lookup' in sidebar                          │<br/>
│                                                               │<br/>
│ Step 2: Enter Receipt ID (e.g., REC-2026-001234)              │<br/>
│                                                               │<br/>
│ Step 3: Click 'Lookup Receipt' button                         │<br/>
│                                                               │<br/>
│ Step 4: Receipt details appear on screen                      │<br/>
└───────────────────────────────────────────────────────────────┘
"""
story.append(Paragraph(qr_steps, box_style))

story.append(Paragraph("<b>Why QR Code is Important:</b>", subheading_style))
story.append(Paragraph("• Prevents fake receipts", step_style))
story.append(Paragraph("• Parents can verify payments themselves", step_style))
story.append(Paragraph("• No need to visit school office for verification", step_style))
story.append(Paragraph("• Complete audit trail maintained", step_style))

story.append(PageBreak())

# ============ SECTION 8: REPORTS ============
story.append(Paragraph("<b>SECTION 8: Reports Section</b>", heading_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>3 Types of Reports Available:</b>", subheading_style))

reports_visual = """
<b>Report 1: Daily Collection</b><br/>
┌─────────────────────────────────────────────────────────────────┐<br/>
│ Shows all payments collected today or selected date             │<br/>
│                                                                 │<br/>
│ Receipt │ Student       │ Class    │ Amount   │ Mode  │ Time    │<br/>
│ ───────────────────────────────────────────────────────────────│<br/>
│ REC-001 │ Aarav Sharma  │ Nursery │ ₹5,000   │ UPI   │ 10:30 AM│<br/>
│ REC-002 │ Ananya Gupta  │ LKG     │ ₹10,000  │ Cash  │ 11:15 AM│<br/>
│                                                                 │<br/>
│ TOTAL: ₹15,000  │  2 Receipts  │  UPI: ₹5K  │  Cash: ₹10K     │<br/>
└─────────────────────────────────────────────────────────────────┘<br/>
<br/>
<b>Report 2: Class-wise Collection</b><br/>
┌─────────────────────────────────────────────────────────────────┐<br/>
│ Shows how much fee collected from each class                    │<br/>
│                                                                 │<br/>
│ Class    │ Students │ Total Fee │ Collected │ Pending │ %       │<br/>
│ ───────────────────────────────────────────────────────────────│<br/>
│ Nursery  │    1     │  ₹36,000  │  ₹27,000  │ ₹9,000  │ 75%     │<br/>
│ LKG      │    1     │  ₹38,000  │  ₹38,000  │    ₹0   │ 100%    │<br/>
│ UKG      │    1     │  ₹40,000  │  ₹10,000  │ ₹30,000 │ 25%     │<br/>
└─────────────────────────────────────────────────────────────────┘<br/>
<br/>
<b>Report 3: Defaulters List</b><br/>
┌─────────────────────────────────────────────────────────────────┐<br/>
│ Shows students who have NOT paid full fees                      │<br/>
│                                                                 │<br/>
│ Student       │ Class │ Father       │ Total   │ Paid  │ Balance│<br/>
│ ───────────────────────────────────────────────────────────────│<br/>
│ Rahul Kumar   │ UKG   │ Vijay Kumar  │ ₹40,000 │₹10,000│₹30,000 │<br/>
│ Aarav Sharma  │ Nursery│Rajesh Sharma│ ₹36,000 │₹27,000│ ₹9,000 │<br/>
│                                                                 │<br/>
│ <b>TOTAL PENDING: ₹39,000 from 2 students</b>                      │<br/>
└─────────────────────────────────────────────────────────────────┘
"""
story.append(Paragraph(reports_visual, box_style))

story.append(Paragraph("<b>How to View Reports:</b>", subheading_style))
story.append(Paragraph("• Click 'Reports' in sidebar", step_style))
story.append(Paragraph("• Click on tab: Daily Collection / Class-wise / Defaulters", step_style))
story.append(Paragraph("• Use date filter for specific dates", step_style))

story.append(PageBreak())

# ============ SECTION 9: AI ASSISTANT ============
story.append(Paragraph("<b>SECTION 9: AI Assistant (Smart Help)</b>", heading_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>What is AI Assistant?</b>", subheading_style))
story.append(Paragraph("An intelligent chat that answers your questions about school data in simple language.", body_style))

ai_visual = """
<b>AI Assistant Screen:</b><br/>
┌─────────────────────────────────────────────────────────────────┐<br/>
│ 🤖 AI Assistant                                                 │<br/>
├─────────────────────────────────────────────────────────────────┤<br/>
│                                                                 │<br/>
│ 🤖: Hello! I can help you with fee queries, student info,     │<br/>
│     defaulters list, and more. What would you like to know?    │<br/>
│                                                                 │<br/>
│ ───────────────────────────────────────────────────────────────│<br/>
│                                                                 │<br/>
│ 👤 YOU: How much fees are pending?                              │<br/>
│                                                                 │<br/>
│ 🤖: Currently, the total pending fees amount is ₹4,20,000.     │<br/>
│     There are 5 students with pending fees. Would you like     │<br/>
│     me to show the defaulters list?                            │<br/>
│                                                                 │<br/>
│ ───────────────────────────────────────────────────────────────│<br/>
│                                                                 │<br/>
│ 👤 YOU: Who are the top defaulters?                             │<br/>
│                                                                 │<br/>
│ 🤖: Top 5 defaulters:                                           │<br/>
│     1. Rahul Kumar (UKG) - ₹30,000                             │<br/>
│     2. Sneha Reddy (5th) - ₹25,000                             │<br/>
│     3. Aarav Sharma (Nursery) - ₹9,000                         │<br/>
│                                                                 │<br/>
└─────────────────────────────────────────────────────────────────┘<br/>
<br/>
<b>Sample Questions You Can Ask:</b><br/>
• "How much fees are pending?"<br/>
• "What is today's collection?"<br/>
• "Who are the defaulters?"<br/>
• "How many students in Nursery?"<br/>
• "Show me collection statistics"<br/>
• "Total fees collected this month?"
"""
story.append(Paragraph(ai_visual, box_style))

story.append(PageBreak())

# ============ SECTION 10: CLOUD BACKUP ============
story.append(Paragraph("<b>SECTION 10: Cloud Backup (Data Safety)</b>", heading_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Why Cloud Backup is Important?</b>", subheading_style))
story.append(Paragraph("All school data is automatically saved to cloud. If anything happens to your computer, data is safe and can be restored.", body_style))

backup_visual = """
<b>Cloud Backup Screen:</b><br/>
┌─────────────────────────────────────────────────────────────────┐<br/>
│ ☁️ Cloud Storage Backup                                         │<br/>
│                                                                 │<br/>
│ Automatically backup all your data. Never lose records!         │<br/>
├─────────────────────────────────────────────────────────────────┤<br/>
│                                                                 │<br/>
│ ┌─────────────────────────────────────────────────────────────┐│<br/>
│ │                                                             ││<br/>
│ │  ☁️ Backup Complete!                         17 Students    ││<br/>
│ │  Last backup: 20 Feb 2026, 10:30 AM        15 Payments      ││<br/>
│ │                                                             ││<br/>
│ └─────────────────────────────────────────────────────────────┘│<br/>
│                                                                 │<br/>
│ ┌──────────────────────┐  ┌──────────────────────────┐        │<br/>
│ │ ☁️ Backup to Cloud   │  │ 🔄 Restore from Cloud    │        │<br/>
│ └──────────────────────┘  └──────────────────────────┘        │<br/>
│                                                                 │<br/>
│ 🔒 Your data is encrypted and stored securely.                  │<br/>
└─────────────────────────────────────────────────────────────────┘
"""
story.append(Paragraph(backup_visual, box_style))

story.append(Paragraph("<b>How to Backup:</b>", subheading_style))
story.append(Paragraph("• Click 'Settings' in sidebar", step_style))
story.append(Paragraph("• Find 'Cloud Storage Backup' section", step_style))
story.append(Paragraph("• Click 'Backup to Cloud' button", step_style))
story.append(Paragraph("• Wait for 'Backup Complete' message", step_style))

story.append(Paragraph("<b>How to Restore:</b>", subheading_style))
story.append(Paragraph("• Click 'Restore from Cloud' button", step_style))
story.append(Paragraph("• All data will be restored from last backup", step_style))

story.append(PageBreak())

# ============ SECTION 11: PRINTING ============
story.append(Paragraph("<b>SECTION 11: How to Print Receipts</b>", heading_style))
story.append(Spacer(1, 0.3*cm))

print_visual = """
<b>Printing Process:</b><br/>
<br/>
<b>Step 1:</b> After collecting fee, receipt appears on screen<br/>
<br/>
<b>Step 2:</b> Click '🖨️ Print' button at bottom<br/>
<br/>
<b>Step 3:</b> Print dialog opens<br/>
<br/>
<b>Step 4:</b> Select your printer<br/>
<br/>
<b>Step 5:</b> Click Print<br/>
<br/>
<b>Important:</b><br/>
┌───────────────────────────────────────────────────────────────┐<br/>
│ • 2 receipts fit on ONE A4 page (saves paper!)                │<br/>
│ • Each receipt has unique QR code                             │<br/>
│ • Receipt includes all student and payment details            │<br/>
│ • Signature lines for collector and parent                    │<br/>
│ • "Scan QR to Verify" instruction printed                     │<br/>
└───────────────────────────────────────────────────────────────┘
"""
story.append(Paragraph(print_visual, box_style))

story.append(PageBreak())

# ============ SECTION 12: DEMO CHECKLIST ============
story.append(Paragraph("<b>SECTION 12: Demo Checklist for School</b>", heading_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("Use this checklist when giving demo to school:", body_style))

checklist_visual = """
<b>Pre-Demo Preparation:</b><br/>
□ Open software and check it's working<br/>
□ Keep this guide ready for reference<br/>
□ Prepare sample student data<br/>
□ Test printer connection<br/>
<br/>
<b>Demo Flow (Show in this order):</b><br/>
<br/>
□ <b>1. Dashboard</b> (2 minutes)<br/>
     → Show statistics cards<br/>
     → Show charts<br/>
     → Show quick action buttons<br/>
<br/>
□ <b>2. Students</b> (3 minutes)<br/>
     → Show existing students<br/>
     → Add a new student<br/>
     → Show search and filter<br/>
<br/>
□ <b>3. Fee Collection</b> (5 minutes)<br/>
     → Select a student<br/>
     → Enter amount and mode<br/>
     → Generate receipt<br/>
<br/>
□ <b>4. Receipt</b> (3 minutes)<br/>
     → Show QR code<br/>
     → Show all details<br/>
     → Print receipt<br/>
<br/>
□ <b>5. QR Verification</b> (3 minutes)<br/>
     → Scan QR with phone<br/>
     → Show receipt online<br/>
     → Explain security<br/>
<br/>
□ <b>6. Reports</b> (3 minutes)<br/>
     → Show daily report<br/>
     → Show defaulters list<br/>
<br/>
□ <b>7. Cloud Backup</b> (2 minutes)<br/>
     → Show backup feature<br/>
     → Click backup button<br/>
<br/>
□ <b>8. AI Assistant</b> (2 minutes)<br/>
     → Ask some questions<br/>
     → Show instant answers<br/>
<br/>
<b>Total Demo Time: ~20-25 minutes</b>
"""
story.append(Paragraph(checklist_visual, box_style))

story.append(PageBreak())

# ============ SECTION 13: KEY SELLING POINTS ============
story.append(Paragraph("<b>SECTION 13: Key Selling Points for School</b>", heading_style))
story.append(Spacer(1, 0.3*cm))

selling_points = [
    ['Feature', 'Benefit', 'Value'],
    ['QR Code on Receipt', 'Prevents fake receipts', 'Security'],
    ['2 Receipts per A4', 'Saves 50% paper cost', 'Cost Saving'],
    ['Automatic Calculations', 'No manual errors', 'Accuracy'],
    ['Cloud Backup', 'Data never lost', 'Safety'],
    ['Mobile Friendly', 'Use from anywhere', 'Convenience'],
    ['AI Assistant', 'Instant answers', 'Time Saving'],
    ['Multiple Payment Modes', 'UPI, Cash, Card, Cheque', 'Flexibility'],
    ['Real-time Reports', 'Instant analytics', 'Decision Making'],
]

selling_table = Table(selling_points, colWidths=[4*cm, 5*cm, 4*cm])
selling_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e3a8a')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('FONTNAME', (0, 0), (-1, -1), 'Times New Roman'),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
]))
story.append(selling_table)

story.append(Spacer(1, 0.5*cm))

story.append(Paragraph("<b>Frequently Asked Questions:</b>", subheading_style))

faq_text = """
<b>Q: Can I use this on mobile?</b><br/>
A: Yes! Open in any mobile browser. Works on phone and tablet.<br/>
<br/>
<b>Q: What if internet goes down?</b><br/>
A: Software runs on local computer. Works offline too!<br/>
<br/>
<b>Q: Can I add more users?</b><br/>
A: Yes, multiple accountants can use the same system.<br/>
<br/>
<b>Q: How to recover data if computer crashes?</b><br/>
A: Use 'Restore from Cloud' - all data is backed up.<br/>
<br/>
<b>Q: Can parents verify receipts?</b><br/>
A: Yes! They can scan QR code and see receipt online.<br/>
<br/>
<b>Q: Can I print in Hindi?</b><br/>
A: Currently English, but can be customized for Hindi.
"""
story.append(Paragraph(faq_text, body_style))

story.append(Spacer(1, 1*cm))

# Final note
story.append(Paragraph("<b>Software Ready for Demo!</b>", ParagraphStyle('Final', 
    fontName='Times New Roman', fontSize=14, textColor=colors.HexColor('#16a34a'), 
    alignment=TA_CENTER, spaceBefore=20)))

story.append(Paragraph("Open at: <b>http://localhost:3000</b>", ParagraphStyle('URL', 
    fontName='Times New Roman', fontSize=12, textColor=colors.HexColor('#1e3a8a'), 
    alignment=TA_CENTER, spaceBefore=10)))

# Build PDF
doc.build(story)
print("Visual Demo Guide PDF created successfully!")
