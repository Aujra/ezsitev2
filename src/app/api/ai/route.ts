import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize the Google AI model
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

const EXAMPLE_ROTATION = `{"actions":[{"id":"m5rdpelp4ig0kswi1i9","target":"Target","weight":1,"priority":0,"spellName":"test","conditions":{"type":"Composite","groups":[{"operator":"AND","conditions":[{"type":"HP","value":22,"operator":">"}]}]},"interruptible":false},{"id":"m5snthh7acmslx8n5ri","target":"Target","weight":1,"priority":0,"spellName":"test spell","conditions":{"type":"Composite","groups":[{"operator":"AND","conditions":[{"type":"Aura","value":0,"stacks":{"count":0,"operator":">"},"target":"Self","auraName":"test aura","auraType":"Buff","duration":{"operator":">","remaining":0},"operator":">","checkType":"presence","isPresent":true}]}]},"interruptible":false}]}`;

const cleanAndValidateJSON = (text: string): string => {
  // Remove any markdown formatting if present
  let cleanText = text.replace(/```json\n?|\n?```/g, '');
  
  // Remove any comments or explanations outside the JSON
  const jsonStart = cleanText.indexOf('{');
  const jsonEnd = cleanText.lastIndexOf('}') + 1;
  if (jsonStart >= 0 && jsonEnd > 0) {
    cleanText = cleanText.slice(jsonStart, jsonEnd);
  }

  // Validate the JSON
  try {
    const parsed = JSON.parse(cleanText);
    return JSON.stringify(parsed);
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(`Invalid JSON: ${e.message}`);
    }
    throw new Error('Invalid JSON: Unknown parsing error');
  }
};

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Create a formatted prompt with context
    const formattedPrompt = `
      You are a World of Warcraft rotation builder assistant. Using the following example format as a reference:
      ${EXAMPLE_ROTATION}

      Create a new rotation based on this request: "${prompt}"

      Rules:
      1. Each action needs a unique ID (use format similar to example)
      2. Include proper conditions based on the class/spec requirements
      3. Set appropriate weights and priorities
      4. Return ONLY valid JSON that matches the example format
      5. Consider buff/debuff tracking, resource management, and cooldown priorities
      6. For spell names, use actual World of Warcraft spell names
      7. Ensure all conditions are properly nested in groups with AND/OR operators
      8. Set realistic values for HP percentages, resource costs, and cooldown checks
      9. DO NOT include any explanatory text or comments - ONLY the JSON object

      Return ONLY a valid JSON object with no additional text or formatting.
    `;

    const result = await model.generateContent(formattedPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean and validate the JSON
    const cleanedJSON = cleanAndValidateJSON(text);

    return NextResponse.json({ response: cleanedJSON });
  } catch (error) {
    console.error('AI API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate valid rotation JSON' },
      { status: 500 }
    );
  }
}
