
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured')
    }

    const { prompt, context, model = 'gpt-4o-mini', temperature = 0.7, max_tokens = 1200 } = await req.json()

    // Construct a system prompt with appropriate context
    let systemPrompt = `You are SuiCoPilot, an AI assistant specialized in Sui blockchain and Move programming. 
    Provide clear, concise, and accurate responses about Sui development.
    Always include code examples when relevant and explain technical concepts thoroughly.
    Use markdown formatting for code blocks with proper syntax highlighting.
    
    When providing code examples:
    - Use \`\`\`move for Move code
    - Use \`\`\`typescript for TypeScript code
    - Use \`\`\`shell for command line examples
    
    Today's date: ${new Date().toISOString().split('T')[0]}
    `

    // Add context-specific instructions if available
    if (context) {
      // Add wallet information if available
      if (context.walletInfo) {
        systemPrompt += `
        User's wallet information:
        - Network: ${context.walletInfo.network || 'unknown'}
        - Balance: ${context.walletInfo.balance?.totalBalance || 'unknown'} SUI
        - Objects owned: ${context.walletInfo.objects?.length || 0} objects
        - Recent transactions: ${context.walletInfo.transactions?.length || 0} transactions
        `
      }

      // Add task-specific instructions
      if (context.task === 'code_generation') {
        systemPrompt += `
        Task: Generate code based on user request
        Instructions:
        - Focus on generating well-commented, complete code examples
        - Include explanations of key concepts
        - Follow Sui best practices and conventions
        - If appropriate, include test cases or examples of usage
        - Only use features that are available in the current version of Sui
        `
      } else if (context.task === 'concept_explanation') {
        systemPrompt += `
        Task: Explain Sui concepts
        Instructions:
        - Provide clear, concise explanations of the requested concept
        - Include relevant examples to illustrate the concept
        - Compare with other blockchain concepts if helpful
        - Cite official Sui documentation when possible
        - Use visual explanations (through text) when appropriate
        `
      } else if (context.task === 'debug_assistance') {
        systemPrompt += `
        Task: Help debug code or transactions
        Instructions:
        - Analyze the provided code or transaction details carefully
        - Identify potential issues or bugs
        - Suggest specific fixes with code examples
        - Explain why the issue occurs and how the fix resolves it
        - Recommend best practices to avoid similar issues
        `
      }
    }

    // Track usage and costs (for analytics purposes)
    const startTime = Date.now()

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: max_tokens,
        temperature: temperature,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenAI API error:', errorData)
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    const generatedText = data.choices[0].message.content
    const tokenUsage = data.usage || { 
      prompt_tokens: 0, 
      completion_tokens: 0, 
      total_tokens: 0 
    }
    
    // Calculate approximate cost (very rough estimate)
    // Update these rates based on OpenAI's current pricing
    const modelRates = {
      'gpt-4o-mini': { input: 0.000015, output: 0.000060 },
      'gpt-4o': { input: 0.000010, output: 0.000030 },
      'gpt-3.5-turbo': { input: 0.0000010, output: 0.0000020 }
    }
    
    const rate = modelRates[model] || modelRates['gpt-4o-mini']
    const inputCost = (tokenUsage.prompt_tokens / 1000) * rate.input
    const outputCost = (tokenUsage.completion_tokens / 1000) * rate.output
    const totalCost = inputCost + outputCost
    
    const processingTime = Date.now() - startTime

    return new Response(JSON.stringify({ 
      response: generatedText, 
      tokens: tokenUsage,
      stats: {
        model: model,
        prompt_tokens: tokenUsage.prompt_tokens,
        completion_tokens: tokenUsage.completion_tokens,
        total_tokens: tokenUsage.total_tokens,
        processing_time_ms: processingTime,
        estimated_cost_usd: totalCost.toFixed(6)
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in AI chat function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
