from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch, cm
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
import os

# Register fonts
pdfmetrics.registerFont(TTFont('SimHei', '/usr/share/fonts/truetype/chinese/SimHei.ttf'))
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
registerFontFamily('SimHei', normal='SimHei', bold='SimHei')
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')

# Create document
doc = SimpleDocTemplate(
    "/home/z/my-project/download/Podar_ERP_Complete_Guide_Hindi.pdf",
    pagesize=A4,
    rightMargin=1.5*cm,
    leftMargin=1.5*cm,
    topMargin=2*cm,
    bottomMargin=2*cm
)

# Styles
styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    name='HindiTitle',
    fontName='SimHei',
    fontSize=28,
    leading=36,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#1e3a8a'),
    spaceAfter=20
)

subtitle_style = ParagraphStyle(
    name='HindiSubtitle',
    fontName='SimHei',
    fontSize=16,
    leading=24,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#f59e0b'),
    spaceAfter=30
)

heading_style = ParagraphStyle(
    name='HindiHeading',
    fontName='SimHei',
    fontSize=18,
    leading=26,
    alignment=TA_LEFT,
    textColor=colors.HexColor('#1e3a8a'),
    spaceBefore=20,
    spaceAfter=10,
    borderPadding=5
)

subheading_style = ParagraphStyle(
    name='HindiSubheading',
    fontName='SimHei',
    fontSize=14,
    leading=20,
    alignment=TA_LEFT,
    textColor=colors.HexColor('#f59e0b'),
    spaceBefore=15,
    spaceAfter=8
)

body_style = ParagraphStyle(
    name='HindiBody',
    fontName='SimHei',
    fontSize=11,
    leading=18,
    alignment=TA_LEFT,
    textColor=colors.black,
    spaceBefore=5,
    spaceAfter=8,
    wordWrap='CJK'
)

step_style = ParagraphStyle(
    name='StepStyle',
    fontName='SimHei',
    fontSize=12,
    leading=18,
    alignment=TA_LEFT,
    textColor=colors.HexColor('#1e3a8a'),
    spaceBefore=8,
    spaceAfter=5,
    leftIndent=20,
    wordWrap='CJK'
)

note_style = ParagraphStyle(
    name='NoteStyle',
    fontName='SimHei',
    fontSize=10,
    leading=16,
    alignment=TA_LEFT,
    textColor=colors.HexColor('#16a34a'),
    spaceBefore=5,
    spaceAfter=5,
    leftIndent=20,
    wordWrap='CJK'
)

story = []

# Cover Page
story.append(Spacer(1, 2*inch))
story.append(Paragraph("PODAR LEARN SCHOOL NIPHAD", title_style))
story.append(Spacer(1, 0.3*inch))
story.append(Paragraph("School ERP Software", subtitle_style))
story.append(Paragraph("Complete User Guide - Hindi", subtitle_style))
story.append(Spacer(1, 1*inch))
story.append(Paragraph("Step by Step Guide", ParagraphStyle(
    name='CenterText',
    fontName='SimHei',
    fontSize=14,
    alignment=TA_CENTER,
    textColor=colors.gray
)))
story.append(Paragraph("5,000 Students | Fee Collection | Receipts | AI Assistant", ParagraphStyle(
    name='CenterText2',
    fontName='SimHei',
    fontSize=12,
    alignment=TA_CENTER,
    textColor=colors.gray,
    spaceBefore=10
)))
story.append(Spacer(1, 1*inch))
story.append(Paragraph("Academic Year 2026-27", ParagraphStyle(
    name='YearText',
    fontName='SimHei',
    fontSize=12,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#f59e0b')
)))

story.append(PageBreak())

# Table of Contents
story.append(Paragraph("Contents", heading_style))
story.append(Spacer(1, 0.2*inch))

toc_items = [
    "1. Software Kya Hai?",
    "2. Software Kaise Chalaye?",
    "3. Dashboard - Main Screen",
    "4. Student Management",
    "5. Fee Collection",
    "6. Receipt Print karna",
    "7. AI Assistant",
    "8. Reports",
    "9. Settings & Backup",
]

for item in toc_items:
    story.append(Paragraph(item, body_style))

story.append(PageBreak())

# Section 1
story.append(Paragraph("1. Software Kya Hai?", heading_style))
story.append(Spacer(1, 0.1*inch))

story.append(Paragraph("Yeh software Podar Learn School Niphad ke liye banaya gaya hai.", body_style))
story.append(Spacer(1, 0.1*inch))

story.append(Paragraph("Features:", subheading_style))
features = [
    "5,000 Students ka complete record",
    "Fee Collection aur Receipts",
    "QR Code Verification",
    "AI Assistant (Voice Support)",
    "Cloud Backup",
    "Reports aur Analytics",
]
for f in features:
    story.append(Paragraph("• " + f, body_style))

story.append(PageBreak())

# Section 2
story.append(Paragraph("2. Software Kaise Chalaye?", heading_style))

story.append(Paragraph("Step 1: Browser Kholo", subheading_style))
story.append(Paragraph("Computer mein Chrome ya Edge browser kholo.", body_style))

story.append(Paragraph("Step 2: Address Type Karo", subheading_style))
story.append(Paragraph("Address bar mein likho: localhost:3000", body_style))

story.append(Paragraph("Step 3: Enter Press Karo", subheading_style))
story.append(Paragraph("Software khul jayega!", body_style))

story.append(Spacer(1, 0.2*inch))
story.append(Paragraph("Note: Agar software nahi khul raha, toh developer se contact karo.", note_style))

story.append(PageBreak())

# Section 3
story.append(Paragraph("3. Dashboard - Main Screen", heading_style))

story.append(Paragraph("Dashboard software ka main page hai. Yahan sab important information dikhti hai.", body_style))

story.append(Paragraph("Dashboard Mein Kya Dikhta Hai?", subheading_style))

dashboard_items = [
    "Total Students: 5,000",
    "Fees Collected: Rs.16 Crore (70%)",
    "Pending Fees: Rs.7 Crore",
    "Today Collection: Rs.4.5 Lakh",
]

for item in dashboard_items:
    story.append(Paragraph("• " + item, body_style))

story.append(Paragraph("Quick Actions:", subheading_style))
story.append(Paragraph("• New Admission button - Naya student add karo", body_style))
story.append(Paragraph("• Collect Fee button - Fees collect karo", body_style))

story.append(PageBreak())

# Section 4
story.append(Paragraph("4. Student Management", heading_style))

story.append(Paragraph("Students section mein saare 5,000 students ki list hai.", body_style))

story.append(Paragraph("Student Kaise Dhundho?", subheading_style))
story.append(Paragraph("Step 1: Left side mein Students pe click karo", step_style))
story.append(Paragraph("Step 2: Search box mein naam ya ID type karo", step_style))
story.append(Paragraph("Step 3: Student list mein dikhega", step_style))

story.append(Paragraph("Naya Student Kaise Add Karo?", subheading_style))
story.append(Paragraph("Step 1: Add Student button pe click karo", step_style))
story.append(Paragraph("Step 2: Form bharo - Naam, Father name, Class, Section, etc.", step_style))
story.append(Paragraph("Step 3: Save button pe click karo", step_style))

story.append(PageBreak())

# Section 5
story.append(Paragraph("5. Fee Collection", heading_style))

story.append(Paragraph("Yeh section sabse important hai. Yahan fees collect karte hain.", body_style))

story.append(Paragraph("Fee Collect Karne Ke Steps:", subheading_style))
story.append(Paragraph("Step 1: Left side mein Fee Collection pe click karo", step_style))
story.append(Paragraph("Step 2: Student select karo dropdown se", step_style))
story.append(Paragraph("Step 3: Amount enter karo (Full, Half, ya Quarter)", step_style))
story.append(Paragraph("Step 4: Payment Date - Aaj ki date auto aati hai", step_style))
story.append(Paragraph("Step 5: Next Due Date - Jab parent next payment karenge", step_style))
story.append(Paragraph("Step 6: Payment Mode select karo (UPI, Cash, Card, etc.)", step_style))
story.append(Paragraph("Step 7: Generate Receipt button pe click karo", step_style))

story.append(Spacer(1, 0.1*inch))
story.append(Paragraph("Important: Next Due Date zaroor enter karo! Parent se poocho ki next kab pay karenge.", note_style))

story.append(PageBreak())

# Section 6
story.append(Paragraph("6. Receipt Print Karna", heading_style))

story.append(Paragraph("Receipt mein ye sab information hoti hai:", body_style))

receipt_items = [
    "School Name aur Logo",
    "Receipt Number",
    "Date aur Time",
    "Student Name, Class, Section",
    "Amount Paid",
    "Balance Remaining",
    "NEXT PAYMENT DATE - Parent ki promised date",
    "Payment Schedule (Q1, Q2, Q3, Q4)",
    "QR Code (Scan karke verify karo)",
]

for item in receipt_items:
    story.append(Paragraph("• " + item, body_style))

story.append(Paragraph("Print Kaise Karo?", subheading_style))
story.append(Paragraph("Step 1: Receipt generate hone ke baad Print button pe click karo", step_style))
story.append(Paragraph("Step 2: Printer select karo", step_style))
story.append(Paragraph("Step 3: Print button pe click karo", step_style))

story.append(Spacer(1, 0.1*inch))
story.append(Paragraph("Note: Ek A4 page pe 2 receipts aate hain - paper bachta hai!", note_style))

story.append(PageBreak())

# Section 7
story.append(Paragraph("7. AI Assistant", heading_style))

story.append(Paragraph("AI Assistant tumhara helper hai. Tum isse Hindi, English, ya Marathi mein baat kar sakte ho.", body_style))

story.append(Paragraph("AI Se Kya Puchh Sakte Ho?", subheading_style))
ai_questions = [
    "Pending fees kitni hai?",
    "Defaulters kaun hain?",
    "Today collection kitna hua?",
    "Student count kitna hai?",
    "Next month prediction kya hai?",
]
for q in ai_questions:
    story.append(Paragraph("• " + q, body_style))

story.append(Paragraph("Voice Input Kaise Use Karo?", subheading_style))
story.append(Paragraph("Step 1: Mic button (microphone icon) pe click karo", step_style))
story.append(Paragraph("Step 2: Apna sawaal bolo", step_style))
story.append(Paragraph("Step 3: AI jawab dega", step_style))

story.append(PageBreak())

# Section 8
story.append(Paragraph("8. Reports", heading_style))

story.append(Paragraph("Reports section mein different types ki reports milti hain.", body_style))

story.append(Paragraph("Report Types:", subheading_style))
report_types = [
    "Daily Report - Aaj ki collection",
    "Monthly Report - Mahine ka summary",
    "Class-wise Report - Class wise students",
    "Defaulters List - Jinke fees pending hai",
]
for r in report_types:
    story.append(Paragraph("• " + r, body_style))

story.append(Paragraph("Report Export Kaise Karo?", subheading_style))
story.append(Paragraph("Export PDF ya Export Excel button pe click karo.", step_style))

story.append(PageBreak())

# Section 9
story.append(Paragraph("9. Settings & Backup", heading_style))

story.append(Paragraph("Cloud Backup - Bahut Important!", subheading_style))
story.append(Paragraph("Cloud Backup se tumhara data safe rahega. Computer kharab ho jaye toh bhi data milega.", body_style))

story.append(Paragraph("Backup Kaise Karo?", subheading_style))
story.append(Paragraph("Step 1: Settings pe click karo", step_style))
story.append(Paragraph("Step 2: Backup to Cloud button pe click karo", step_style))
story.append(Paragraph("Step 3: Wait karo jab tak Backup Complete na dikhe", step_style))

story.append(Paragraph("Data Restore Kaise Karo?", subheading_style))
story.append(Paragraph("Restore from Cloud button pe click karo.", step_style))

story.append(Spacer(1, 0.3*inch))
story.append(Paragraph("Important Tips:", heading_style))
tips = [
    "Rozana backup karo",
    "Receipt print karke parent ko do",
    "Next due date zaroor enter karo",
    "QR code scan karke verify karo",
]
for tip in tips:
    story.append(Paragraph("• " + tip, body_style))

story.append(PageBreak())

# Contact Page
story.append(Spacer(1, 1*inch))
story.append(Paragraph("Need Help?", heading_style))
story.append(Spacer(1, 0.3*inch))
story.append(Paragraph("Agar koi problem ho toh developer se contact karo.", body_style))
story.append(Spacer(1, 0.5*inch))
story.append(Paragraph("Software Developed for", ParagraphStyle(
    name='Footer1',
    fontName='SimHei',
    fontSize=12,
    alignment=TA_CENTER,
    textColor=colors.gray
)))
story.append(Paragraph("PODAR LEARN SCHOOL NIPHAD", ParagraphStyle(
    name='Footer2',
    fontName='SimHei',
    fontSize=16,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#1e3a8a'),
    spaceBefore=10
)))
story.append(Paragraph("Nashik, Maharashtra", ParagraphStyle(
    name='Footer3',
    fontName='SimHei',
    fontSize=12,
    alignment=TA_CENTER,
    textColor=colors.gray,
    spaceBefore=5
)))
story.append(Paragraph("Academic Year 2026-27", ParagraphStyle(
    name='Footer4',
    fontName='SimHei',
    fontSize=12,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#f59e0b'),
    spaceBefore=10
)))

# Build PDF
doc.build(story)
print("PDF Guide Created Successfully!")
