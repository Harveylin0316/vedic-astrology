// Netlify Function: Anthropic API proxy
// Expects ANTHROPIC_API_KEY environment variable in Netlify dashboard
// Accessed via /api/chat (rewritten by netlify.toml)

import Anthropic from '@anthropic-ai/sdk'

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6'

export const handler = async (event) => {
  const baseHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: baseHeaders, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: baseHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: baseHeaders,
      body: JSON.stringify({
        error: 'ANTHROPIC_API_KEY not configured on server'
      })
    }
  }

  try {
    const payload = JSON.parse(event.body || '{}')
    const { messages = [], system = '' } = payload

    if (!Array.isArray(messages) || messages.length === 0) {
      return {
        statusCode: 400,
        headers: baseHeaders,
        body: JSON.stringify({ error: 'messages array required' })
      }
    }

    const normalized = messages
      .filter((m) => m && typeof m.content === 'string' && m.content.trim())
      .map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }))

    const client = new Anthropic({ apiKey })

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: system || undefined,
      messages: normalized
    })

    const text =
      response.content
        ?.filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('\n') || ''

    return {
      statusCode: 200,
      headers: baseHeaders,
      body: JSON.stringify({
        content: text,
        model: response.model,
        stop_reason: response.stop_reason,
        usage: response.usage
      })
    }
  } catch (err) {
    console.error('Anthropic proxy error:', err)
    const status = err?.status || 500
    return {
      statusCode: status,
      headers: baseHeaders,
      body: JSON.stringify({
        error: err?.message || 'Unknown error',
        type: err?.type
      })
    }
  }
}
