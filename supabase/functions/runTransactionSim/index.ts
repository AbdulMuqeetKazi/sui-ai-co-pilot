
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { SuiClient, getFullnodeUrl } from 'npm:@mysten/sui.js@0.47.0/client'
import { TransactionBlock } from 'npm:@mysten/sui.js@0.47.0/transactions'

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
    const { txb, sender, network = 'testnet' } = await req.json()
    
    if (!txb || !sender) {
      throw new Error('Transaction block data and sender address are required')
    }

    // Connect to Sui network
    const rpcUrl = getFullnodeUrl(network as any)
    const client = new SuiClient({ url: rpcUrl })

    // Deserialize the transaction block
    const transactionBlock = TransactionBlock.from(txb)
    
    // Set the sender address
    transactionBlock.setSender(sender)

    // Dry run the transaction to get gas estimation
    const dryRunResult = await client.dryRunTransactionBlock({
      transactionBlock,
    })

    return new Response(
      JSON.stringify({
        result: dryRunResult,
        success: !dryRunResult.errors || dryRunResult.errors.length === 0,
        gasEstimation: dryRunResult.effects?.gasUsed,
        effects: dryRunResult.effects,
        network
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in runTransactionSim function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
