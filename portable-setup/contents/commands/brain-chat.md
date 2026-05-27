---
name: brain-chat
description: Brainstorm with AIDEN Brain in freeform creative conversation for strategy, positioning, audience insights, and campaign ideation. Use when you need to explore a creative direction, pressure-test a brand positioning, or develop campaign concepts through iterative dialogue.
arguments:
  - name: topic
    description: What you want to brainstorm about
    required: true
---

# AIDEN Brain Chat

You are starting a brainstorming conversation with AIDEN Brain V2.

## Input
Topic: `$ARGUMENTS`

## How to Connect

Use Bash with curl to call the Brain API (it is a POST endpoint, WebFetch will not work):

```bash
curl -s -X POST https://aiden-brain-v2-production.up.railway.app/api/aiden/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "<MESSAGE>", "userId": "claude-code-user", "campaignId": "claude-code-session"}' \
  --max-time 60
```

For follow-up messages, include `conversation_id` from the previous response:

```bash
curl -s -X POST https://aiden-brain-v2-production.up.railway.app/api/aiden/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "<FOLLOW-UP>", "conversation_id": "<ID>", "userId": "claude-code-user", "campaignId": "claude-code-session"}' \
  --max-time 60
```

Set Bash timeout to 120000 for these calls (Brain can take up to 60s).

## Parsing the Response

The Brain returns JSON with:
- `content`: the Brain's reply text (display this to the user)
- `metadata.phantoms_activated`: array of phantom objects with `shorthand`, `influence`, `score`, `fired`
- `conversation_id`: pass this in subsequent calls to maintain context

Extract and store `conversation_id` from each response for the next call.

Show the user:
1. The Brain's `content` response, formatted clearly
2. A brief note of which phantoms fired (only those with `fired: true` and `score > 0`)

## Guidelines

- This is a freeform creative conversation. No rigid pipeline.
- AIDEN Brain excels at: creative strategy, brand positioning, audience insights, campaign ideation, territory exploration, messaging frameworks
- If the conversation leads to a concrete brief, suggest running `/creative-strategy`
- If the user wants to develop copy, suggest `/full-campaign`
- Keep the conversation flowing naturally
- If the API is unreachable, tell the user the Brain V2 Railway service may be down

## Starting the Conversation

1. Take the topic from `$ARGUMENTS`
2. Call the Brain API with curl via Bash
3. Parse the JSON response
4. Display the Brain's reply and active phantoms
5. Wait for the user's follow-up
6. Continue calling the API with each follow-up + conversation_id
