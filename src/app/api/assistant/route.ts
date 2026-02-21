import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

interface Student {
  id: string;
  studentId: string;
  name: string;
  fathersName: string;
  class: string;
  section: string;
  totalFee: number;
  paid: number;
  balance: number;
  status: string;
  contact: string;
}

interface Payment {
  id: string;
  receiptId: string;
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  amount: number;
  paymentMode: string;
  date: string;
  time: string;
}

export async function POST(request: NextRequest) {
  try {
    const { message, language, context } = await request.json();
    
    const zai = await ZAI.create();
    
    // Build context for AI
    const systemPrompt = `You are an intelligent AI Assistant for Podar Learn School Niphad's ERP System.
You help the school accountant with fee management, student queries, and administrative tasks.

School Information:
- Name: Podar Learn School Niphad
- Location: Niphad, Nashik, Maharashtra
- Academic Year: 2026-27
- Colors: Navy Blue (#1e3a8a) and Gold (#f59e0b)

Current School Statistics:
- Total Active Students: ${context?.stats?.totalStudents || 0}
- Total Fees Collected: ₹${context?.stats?.totalFeesCollected?.toLocaleString('en-IN') || 0}
- Pending Fees: ₹${context?.stats?.pendingFees?.toLocaleString('en-IN') || 0}
- Defaulters Count: ${context?.stats?.defaultersCount || 0}
- Today's Collection: ₹${context?.stats?.todayCollection?.toLocaleString('en-IN') || 0}
- Today's Receipts: ${context?.stats?.todayReceipts || 0}
- Collection Percentage: ${context?.stats?.collectionPercent || 0}%

${context?.topDefaulters ? `Top 5 Defaulters:
${context.topDefaulters.map((d: Student, i: number) => `${i + 1}. ${d.name} (${d.class}-${d.section}) - Pending: ₹${d.balance?.toLocaleString('en-IN')}`).join('\n')}` : ''}

${context?.recentPayments ? `Recent Payments:
${context.recentPayments.map((p: Payment) => `• ${p.receiptId}: ${p.studentName} - ₹${p.amount?.toLocaleString('en-IN')} (${p.paymentMode})`).join('\n')}` : ''}

${context?.classDistribution ? `Class-wise Student Distribution:
${context.classDistribution.map((c: {class: string, count: number}) => `• ${c.class}: ${c.count} students`).join('\n')}` : ''}

Instructions:
1. Be helpful, friendly, and professional
2. Respond in ${language === 'hindi' ? 'Hindi (using Devanagari script)' : language === 'marathi' ? 'Marathi' : 'English'}
3. For fee-related queries, provide specific amounts in Indian Rupees format (₹)
4. For student queries, mention class and section
5. Suggest actions when appropriate (like "Would you like to collect fee for this student?")
6. Be concise but informative
7. Use emojis occasionally to make responses friendly
8. If asked about predictions, give intelligent estimates based on data patterns

You can help with:
- Fee collection status and pending amounts
- Student information and details
- Defaulters list and follow-ups
- Daily/Monthly reports
- Class-wise statistics
- Predictions and trends
- Generating report suggestions
- Payment mode analysis`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not process your request.';

    return NextResponse.json({ 
      success: true, 
      response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Assistant Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get AI response. Please try again.' },
      { status: 500 }
    );
  }
}
