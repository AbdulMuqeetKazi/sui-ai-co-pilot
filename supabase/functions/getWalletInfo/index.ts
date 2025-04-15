
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { SuiClient, getFullnodeUrl } from 'npm:@mysten/sui.js@0.47.0/client'

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
    const { walletAddress, network = 'testnet' } = await req.json()
    
    if (!walletAddress) {
      throw new Error('Wallet address is required')
    }

    // Connect to Sui network
    const rpcUrl = getFullnodeUrl(network as any)
    const client = new SuiClient({ url: rpcUrl })

    // Get balance
    const balance = await client.getBalance({
      owner: walletAddress,
    })

    // Get owned objects (limited to first 50)
    const objects = await client.getOwnedObjects({
      owner: walletAddress,
      limit: 50,
    })

    // Get recent transactions
    const transactions = await client.queryTransactionBlocks({
      filter: {
        FromAddress: walletAddress
      },
      limit: 10,
    })

    return new Response(
      JSON.stringify({
        balance,
        objects: objects.data,
        transactions: transactions.data,
        network
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in getWalletInfo function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
