from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch, cm
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# Register fonts
pdfmetrics.registerFont(TTFont('SimHei', '/usr/share/fonts/truetype/chinese/SimHei.ttf'))
registerFontFamily('SimHei', normal='SimHei', bold='SimHei')

# Create document
doc = SimpleDocTemplate(
    "/home/z/my-project/download/Free_ERP_Hosting_Guide.pdf",
    pagesize=A4,
    rightMargin=1.5*cm,
    leftMargin=1.5*cm,
    topMargin=2*cm,
    bottomMargin=2*cm
)

# Styles
title_style = ParagraphStyle(
    name='Title',
    fontName='SimHei',
    fontSize=24,
    leading=32,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#1e3a8a'),
    spaceAfter=15
)

subtitle_style = ParagraphStyle(
    name='Subtitle',
    fontName='SimHei',
    fontSize=14,
    leading=20,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#16a34a'),
    spaceAfter=30
)

heading_style = ParagraphStyle(
    name='Heading',
    fontName='SimHei',
    fontSize=16,
    leading=24,
    alignment=TA_LEFT,
    textColor=colors.HexColor('#1e3a8a'),
    spaceBefore=15,
    spaceAfter=10
)

step_heading = ParagraphStyle(
    name='StepHeading',
    fontName='SimHei',
    fontSize=14,
    leading=20,
    alignment=TA_LEFT,
    textColor=colors.HexColor('#f59e0b'),
    spaceBefore=12,
    spaceAfter=8
)

body_style = ParagraphStyle(
    name='Body',
    fontName='SimHei',
    fontSize=11,
    leading=18,
    alignment=TA_LEFT,
    textColor=colors.black,
    spaceBefore=5,
    spaceAfter=5
)

step_style = ParagraphStyle(
    name='Step',
    fontName='SimHei',
    fontSize=11,
    leading=16,
    alignment=TA_LEFT,
    textColor=colors.HexColor('#1e3a8a'),
    spaceBefore=3,
    spaceAfter=3,
    leftIndent=15
)

note_style = ParagraphStyle(
    name='Note',
    fontName='SimHei',
    fontSize=10,
    leading=14,
    alignment=TA_LEFT,
    textColor=colors.HexColor('#16a34a'),
    spaceBefore=5,
    spaceAfter=5,
    leftIndent=15
)

box_style = ParagraphStyle(
    name='Box',
    fontName='SimHei',
    fontSize=12,
    leading=18,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#1e3a8a'),
    spaceBefore=5,
    spaceAfter=5
)

story = []

# Cover Page
story.append(Spacer(1, 1.5*inch))
story.append(Paragraph("FREE ERP HOSTING GUIDE", title_style))
story.append(Paragraph("100% FREE | Professional | Lifetime", subtitle_style))
story.append(Spacer(1, 0.5*inch))

story.append(Paragraph("PODAR LEARN SCHOOL NIPHAD", ParagraphStyle(
    name='SchoolName',
    fontName='SimHei',
    fontSize=18,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#1e3a8a')
)))
story.append(Spacer(1, 0.3*inch))
story.append(Paragraph("Step by Step Guide for Beginners", ParagraphStyle(
    name='Beginner',
    fontName='SimHei',
    fontSize=12,
    alignment=TA_CENTER,
    textColor=colors.gray
)))

story.append(Spacer(1, 1*inch))

# Info box
info_data = [
    [Paragraph("TOTAL COST", box_style), Paragraph("Rs.0 (ZERO)", box_style)],
    [Paragraph("TIME NEEDED", box_style), Paragraph("15 Minutes", box_style)],
    [Paragraph("COMPUTER KNOWLEDGE", box_style), Paragraph("Not Required", box_style)],
]
info_table = Table(info_data, colWidths=[200, 200])
info_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f0f9ff')),
    ('BOX', (0, 0), (-1, -1), 2, colors.HexColor('#1e3a8a')),
    ('INNERGRID', (0, 0), (-1, -1), 1, colors.HexColor('#1e3a8a')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 10),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
]))
story.append(info_table)

story.append(PageBreak())

# PART 1: GitHub
story.append(Paragraph("PART 1: GITHUB ACCOUNT", heading_style))
story.append(Paragraph("Kya hai GitHub? Code store karne ki FREE website", body_style))
story.append(Spacer(1, 0.2*inch))

story.append(Paragraph("STEP 1: Browser Kholo", step_heading))
story.append(Paragraph("Chrome ya Edge browser kholo", step_style))
story.append(Paragraph("Address bar mein type karo: github.com", step_style))
story.append(Paragraph("Enter press karo", step_style))

story.append(Paragraph("STEP 2: Sign Up Click Karo", step_heading))
story.append(Paragraph("Page ke upar right side mein 'Sign Up' button dikhega", step_style))
story.append(Paragraph("Uspe click karo", step_style))

story.append(Paragraph("STEP 3: Details Bharo", step_heading))
story.append(Paragraph("Email address enter karo (jo use karte ho)", step_style))
story.append(Paragraph("Password banao (yaad rakho!)", step_style))
story.append(Paragraph("Username choose karo (e.g., podarschool)", step_style))
story.append(Paragraph("'Create account' button pe click karo", step_style))

story.append(Paragraph("STEP 4: Email Verify Karo", step_heading))
story.append(Paragraph("GitHub verification email bhejega", step_style))
story.append(Paragraph("Apna email kholo", step_style))
story.append(Paragraph("GitHub ka email kholo", step_style))
story.append(Paragraph("'Verify email address' button pe click karo", step_style))

story.append(Paragraph("STEP 5: Account Ready!", step_heading))
story.append(Paragraph("GitHub account ban gaya! Congratulations!", note_style))
story.append(Paragraph("Apna username yaad rakho (e.g., podarschool)", note_style))

story.append(PageBreak())

# PART 2: Vercel
story.append(Paragraph("PART 2: VERCEL ACCOUNT", heading_style))
story.append(Paragraph("Kya hai Vercel? FREE hosting - 24x7 online rakhega", body_style))
story.append(Spacer(1, 0.2*inch))

story.append(Paragraph("STEP 1: Browser Kholo", step_heading))
story.append(Paragraph("Address bar mein type karo: vercel.com", step_style))
story.append(Paragraph("Enter press karo", step_style))

story.append(Paragraph("STEP 2: Sign Up Click Karo", step_heading))
story.append(Paragraph("'Sign Up' button pe click karo", step_style))

story.append(Paragraph("STEP 3: GitHub Select Karo", step_heading))
story.append(Paragraph("'Continue with GitHub' option dikhega", step_style))
story.append(Paragraph("Uspe click karo", step_style))
story.append(Paragraph("GitHub account se automatically connect ho jayega", step_style))

story.append(Paragraph("STEP 4: Authorize Karo", step_heading))
story.append(Paragraph("'Authorize Vercel' button pe click karo", step_style))

story.append(Paragraph("STEP 5: Account Ready!", step_heading))
story.append(Paragraph("Vercel account ban gaya! FREE!", note_style))

story.append(PageBreak())

# PART 3: What's Next
story.append(Paragraph("PART 3: AB KYA KARNA HAI?", heading_style))
story.append(Spacer(1, 0.2*inch))

story.append(Paragraph("Tumhara Kaam Ho Gaya! Ab Main Karunga:", body_style))
story.append(Spacer(1, 0.1*inch))

next_steps = [
    "Main tumhara code GitHub pe upload karunga",
    "Vercel se connect karunga",
    "Deploy karunga",
    "Tumhe ek LINK mil jayega",
    "Wo link kholo = Tumhara ERP ready!",
]

for i, step in enumerate(next_steps, 1):
    story.append(Paragraph(f"{i}. {step}", step_style))

story.append(Spacer(1, 0.3*inch))

story.append(Paragraph("LINK KAISE DIKHEGA?", step_heading))
story.append(Paragraph("Example: podar-school.vercel.app", body_style))
story.append(Paragraph("Ye link kholne pe ERP chalu ho jayega!", body_style))

story.append(Spacer(1, 0.3*inch))

# What to send
story.append(Paragraph("MUJHE KYA BATAO?", heading_style))

send_data = [
    [Paragraph("Information", box_style), Paragraph("Example", box_style)],
    [Paragraph("GitHub Username", body_style), Paragraph("podarschool", body_style)],
    [Paragraph("GitHub Email", body_style), Paragraph("school@gmail.com", body_style)],
]
send_table = Table(send_data, colWidths=[200, 200])
send_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e3a8a')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f0f9ff')),
    ('BOX', (0, 0), (-1, -1), 2, colors.HexColor('#1e3a8a')),
    ('INNERGRID', (0, 0), (-1, -1), 1, colors.HexColor('#1e3a8a')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
]))
story.append(send_table)

story.append(PageBreak())

# Summary Page
story.append(Paragraph("QUICK SUMMARY", heading_style))
story.append(Spacer(1, 0.2*inch))

summary_data = [
    [Paragraph("Step", box_style), Paragraph("Website", box_style), Paragraph("Kya Karna Hai", box_style)],
    [Paragraph("1", body_style), Paragraph("github.com", body_style), Paragraph("Account banao", body_style)],
    [Paragraph("2", body_style), Paragraph("vercel.com", body_style), Paragraph("GitHub se connect karo", body_style)],
    [Paragraph("3", body_style), Paragraph("-", body_style), Paragraph("Mujhe username batao", body_style)],
    [Paragraph("4", body_style), Paragraph("-", body_style), Paragraph("Main deploy karunga", body_style)],
    [Paragraph("5", body_style), Paragraph("Link", body_style), Paragraph("ERP ready! FREE!", body_style)],
]
summary_table = Table(summary_data, colWidths=[60, 150, 200])
summary_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e3a8a')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, -1), colors.white),
    ('BOX', (0, 0), (-1, -1), 2, colors.HexColor('#1e3a8a')),
    ('INNERGRID', (0, 0), (-1, -1), 1, colors.HexColor('#1e3a8a')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('ALIGN', (0, 0), (0, -1), 'CENTER'),
]))
story.append(summary_table)

story.append(Spacer(1, 0.5*inch))

# Final Note
story.append(Paragraph("IMPORTANT NOTES:", heading_style))
notes = [
    "Sab kuch FREE hai - Koi paisa nahi",
    "Password yaad rakho - kahi likh lo",
    "Email sahi dalo - verify karna padega",
    "Koi problem ho toh mujhe batao",
]
for note in notes:
    story.append(Paragraph("* " + note, note_style))

story.append(Spacer(1, 0.5*inch))

story.append(Paragraph("PODAR LEARN SCHOOL NIPHAD", ParagraphStyle(
    name='Final',
    fontName='SimHei',
    fontSize=14,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#1e3a8a')
)))
story.append(Paragraph("Academic Year 2026-27 | 5,000 Students", ParagraphStyle(
    name='Final2',
    fontName='SimHei',
    fontSize=10,
    alignment=TA_CENTER,
    textColor=colors.gray,
    spaceBefore=5
)))

# Build
doc.build(story)
print("Guide PDF Created Successfully!")
