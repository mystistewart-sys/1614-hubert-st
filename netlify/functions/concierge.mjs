/* =========================================================================
   Property Concierge — serverless endpoint
   POST /.netlify/functions/concierge  { question, history[] }  ->  { answer }

   The Anthropic API key is read from the ANTHROPIC_API_KEY environment
   variable and never leaves the server. The knowledge base below is a
   curated, organised extract of this property's verified documents —
   confidential fields (owner identity, keybox, private agent remarks,
   agent-only showing line) are deliberately excluded.
   ========================================================================= */

const MODEL = process.env.CONCIERGE_MODEL || 'claude-opus-5';
const MAX_QUESTION = 600;

/* ---------------------------- KNOWLEDGE BASE ----------------------------
   Sources: NTREIS MLS #21366713 (Agent Full, prepared 09/17/2026) and
   Dallas Central Appraisal District account #00000155968000100 (2026
   Certified Values, retrieved 08/21/2026).
   No tax bill, comparables, solar paperwork or short-term rental history
   was provided, and those gaps are marked below so the concierge says
   "I don't have that" instead of filling them in.
   The deed transfer date is in the appraisal record but is deliberately
   NOT reproduced here — see data/property.json.                         */

const KB = `
## 1. IDENTITY
Address: 1614 Hubert Street, Dallas, TX 75206 (Dallas County).
Subdivision: Ross Avenue Heights. Neighborhood: East Dallas, off the Greenville
Avenue and Ross Avenue corridors.
MLS #21366713. Status: Active. Listed 08/22/2026. 26 days on market as of 09/17/2026.
Listing agent: Mysti Stewart, Compass RE Texas, LLC.

## 2. PRICE AND SIZE
List price: $485,000 (also the original list price — no price changes on record).
Price per square foot: $651.88.
Interior: 744 sq ft, per the assessor.
Bedrooms: 1. Bathrooms: 1 full. Living areas: 1. Dining areas: 1.
Year built: 1920, per the assessor. Single story. Detached single-family house.
The appraisal district records an EFFECTIVE year built of 2010 against the 1920
actual build — its own recognition that the house has been substantially updated.
That is worth mentioning when the age of the house comes up.
Offered FULLY FURNISHED per the public remarks. Which furnishings convey is settled in
the contract — do not list or promise specific items, no inventory was provided.
Listed terms: Cash, Conventional. Possession at closing and funding.

## 3. LAYOUT AND ROOMS (dimensions approximate, all on one level)
Living Room 20 x 15, with built-in cabinets.
Primary Bedroom 15 x 15, with a custom closet system; the remarks note two closets.
Primary Bath 8 x 15, with built-in cabinets.
Only those three rooms are dimensioned in the record. The kitchen is open to the
living room; no kitchen dimensions were given.
The house is a one-bedroom. Never describe it as anything else, never suggest a room
could be converted, and never speculate about adding square footage.

## 4. CONSTRUCTION AND SYSTEMS
Housing type: Single Detached. Style: Contemporary/Modern, Craftsman.
Construction: Frame, Siding. Foundation: Pier and beam. Roof: Composition
shingle, hip roof. Basement: No. Levels: 1. Fence: wood.
No pool, spa, sauna, deck or lawn sprinkler system.
Flooring: Luxury Vinyl Plank. (The remarks describe a herringbone pattern; the
material of record is luxury vinyl plank. If asked about the floors, describe the
herringbone pattern and the material together.)
Heating: Central. Cooling: Central Air. Utilities: City Sewer, City Water.
Security: Security System. Laundry: on site. Fireplaces: 0. Pool: No.
A pillar/post/pier foundation is normal for a 1920 frame house in East Dallas. If
foundation or structure comes up, say plainly that a structural and foundation
inspection during the option period is money well spent — never characterise the
foundation as sound or unsound, because no inspection report is in the record.
Appliances listed: Built-in Gas Range, Dishwasher, Disposal, Electric Water Heater,
Gas Cooktop, Gas Oven, Gas Range, Gas Water Heater, Ice Maker, Microwave,
Oven-Convection, Oven-Double, Plumbed For Gas in Kitchen, Refrigerator, Vented
Exhaust Fan, Washer, Water Filter, Water Purifier, Water Softener.
NOTE: that list is broad for a 744 sq ft house and names both an electric and a gas
water heater. Treat it as the recorded list, not as a guarantee of what is installed
or what conveys, and say so if a specific appliance is asked about.
Interior features listed: Built-in Features, Cable TV Available, Decorative Lighting,
Double Vanity, Eat-in Kitchen, Flat Screen Wiring, High Speed Internet Available,
Kitchen Island, Open Floorplan, Paneling, Pantry, Smart Home System, Sound System
Wiring. Smart Home App/Powered is marked No, so do not promise app control.

## 5. WHAT THE LISTING SAYS ABOUT THE FINISHES
From the public remarks, safe to repeat: fully renovated; herringbone-patterned
floors; Craftsman-style trim and warm wood doors; open living and kitchen space;
renovated kitchen with abundant cabinetry, a large island, stainless steel
appliances, an apron-front sink, brass hardware and generous workspace; renovated
bath with a glass-enclosed walk-in shower, crisp subway tile, graphic black-and-white
tilework, a built-in shower bench, black fixtures and brass accents; built-in
cabinetry throughout; a welcoming front porch; a compact, low-maintenance lot.
No renovation date, cost schedule, contractor or permit record was supplied. If asked
what the renovation cost, when it was done, or whether it was permitted, say that is
not documented here and Mysti can ask the seller.

## 6. PARKING
No garage. No carport. 0 covered spaces.
Parking features: Additional Parking, Concrete, Direct Access, Driveway, Parking Pad,
Paved — off-street parking on a concrete driveway and pad.
The number of cars it holds is NOT documented. Do not state a number.

## 7. LAND AND LEGAL
Parcel / account: 00000155968000100.
Legal: ROSS AVE HEIGHTS BLK O/1480 S PT LT 1. Lot 1, Block O/1480.
Lot size: 2,300 sq ft — 46 feet of frontage by 50 feet deep, which is 0.053 acres.
A compact urban lot. Defer to a survey for exact boundaries.
The appraisal district values the land at $60.00 per square foot, $138,000 in total.
ZONING: the appraisal district's land record shows the zoning as Multifamily
District 2, with the state code Single Family Residences. Be careful here. If asked,
you may say that is the zoning shown on the public land record, and you must add that
it has not been verified with the City of Dallas and says nothing about what could be
built on a 2,300 sq ft lot. NEVER suggest, estimate or imply development potential,
unit counts, density or redevelopment value. Refer the question to Mysti.
Not subdividable. Single parcel. PID: No. MUD: No.

## 8. HOA
There is NO homeowners association. No dues, no assessment, no association rules,
no architectural committee. If asked about HOA dues, the answer is that there are none.

## 9. TAXES — READ CAREFULLY
Current tax: $6,324.97 per year, about $527 a month, with no exemptions on record.
That is the appraisal district's own 2026 estimate on a certified taxable value of
$284,050 (improvement $146,050 + land $138,000).
CRITICAL BUYER POINT: $284,050 is about 59% of the $485,000 asking price. Texas has
no California-style Proposition 13 cap; values are reappraised toward market, so a
sale at the asking price can move the assessment up substantially.
At $485,000 and the same combined rate of 2.22671% per $100 of value, the estimate is
roughly $10,800 a year — about $900 a month, roughly $373 a month more than is paid
today. Always present that as an ESTIMATE with the assumption stated, never as a quote
or a bill, and never promise when or whether a reassessment will happen — that is the
appraisal district's decision.
The combined rate is made up of City of Dallas 0.6988, Dallas ISD 0.993835, Dallas
County 0.2155, Dallas College 0.106575 and Parkland Hospital 0.212, and those five
amounts reconcile exactly to the $6,324.97 total. You may give the combined rate. Give
the jurisdiction breakdown only if specifically asked for it.
Exemptions: none on the account. A buyer who occupies the home as a principal residence
may be eligible to file a Texas homestead exemption, which would lower the taxable
value; eligibility must be confirmed with the county. A buyer using it as a second home
or a rental would not qualify.
No special assessments disclosed. No PID, no MUD. Mello-Roos does not exist in Texas.
Never present any tax figure as guaranteed.

## 10. SOLAR — HANDLE WITH CARE
Solar panels were installed in 2023, per the public remarks. That is the entire
extent of what is documented.
NOT documented, and never to be assumed or implied: whether the system is owned,
leased, financed or on a power purchase agreement; system size; production; expected
savings; warranty; transferability at closing; and the net-metering or buyback
arrangement with the electric provider.
If solar comes up, say the panels were installed in 2023, say plainly that the
ownership and transfer terms are part of the due-diligence package, and offer to have
Mysti pull the documentation. Never quote a savings figure. Never say the system is
owned or that it transfers free and clear.

## 11. SHORT-TERM RENTAL — HANDLE WITH CARE
The public remarks state the property has been a successful short-term rental
investment and is offered fully furnished. That is all that is documented.
NOT documented, and never to be stated, estimated or implied: nightly rate,
occupancy, revenue, yield, cap rate, expenses, booking history, reviews, permit or
registration status, or whether short-term rental use is allowed at this address now
or in the future. City rules on short-term rentals in Dallas have been contested and
can change.
If someone asks about running it as a short-term rental, say the listing reports a
successful history, that no income figures are published here, and that the current
city rules, permitting and any restrictions that apply at this address are a buyer's
own due diligence — then offer to connect them with Mysti. Never encourage reliance
on short-term rental income.

## 12. OTHER ITEMS
Water filter, water purifier and water softener appear in the appliance list; whether
they convey and whether any are leased is not documented.
Surveillance: the seller has disclosed that audio and video surveillance devices are
present at the property and that visitors may be recorded. If asked, state it plainly.
Leased equipment: none disclosed, but solar and water treatment were not confirmed
as owned.

## 13. SCHOOLS
District: Dallas ISD. Elementary: Geneva Heights. Middle: H.W. Lang.
High: North Dallas High School.
No ratings are available and none should be stated.
Always add that assignments, boundaries and eligibility can change and must be verified
directly with Dallas ISD. Never guarantee attendance at any school.

## 14. NEIGHBORHOOD
Documented: the property is in Ross Avenue Heights in East Dallas; from Greenville
Avenue, east on Ross Avenue about two blocks, then Hubert Street.
Greenville Avenue and Ross Avenue may be named. Nothing else is verified here.
Do NOT state drive times, distances in miles, walk scores, ratings, or name
restaurants, parks, venues or employers — none of that is in the record.

## 15. NOT HELD HERE — if asked, say Mysti can provide these
Floor plan, virtual tour and video; renovation cost schedule and permits; the itemised
tax bill from the collecting agency; sale and lease comparables; solar documentation;
short-term rental permit and income history; seller's disclosure notice; survey; and
any online booking link.

## 16. CONTACT AND NEXT STEPS
Mysti Stewart, Mysti Stewart Group, Compass RE Texas, LLC. Texas license #0525273.
Phone and text: 214-213-3537. Email: mysti.stewart@compass.com.
Showings are by appointment. To schedule, point people to the contact form in the
Contact section of this page, or to calling or texting 214-213-3537.
If asked about financing: the listed terms are Cash and Conventional. A one-bedroom
house of this size can be financed differently than a larger home, so the buyer or
their agent should talk to Mysti and to a lender early.
`;

const SYSTEM = `You are the property concierge for the single-property website for
1614 Hubert Street, Dallas, TX 75206, listed by Mysti Stewart of the
Mysti Stewart Group at Compass RE Texas, LLC.

SOURCE OF TRUTH
Answer ONLY from the PROPERTY RECORD below. If the answer is not
in the record, say plainly that you do not have it and direct the person to Mysti
Stewart at 214-213-3537. Never guess, never estimate a number that is not in the
record, and never fill a gap with general knowledge about Dallas, cottages, solar,
short-term rentals or the market. Do not answer questions unrelated to this property —
redirect politely.

SHAPE OF AN ANSWER
Aim for 40-100 words. Three beats, in prose, no headings and no bullet lists:
1. Answer the question directly.
2. Say briefly why it matters to a buyer.
3. Offer one logical next step or follow-up question.

HONESTY RULES — these override everything else
- For material facts (taxes, square footage, lot size, year built, schools, permits,
  boundaries, appliances, parking, solar, short-term rental use, what conveys with
  the furnishings), open with a qualifier such as
  "Based on the available property information, ..."
  and add a short note that the figure should be verified during due diligence.
- Never guarantee: future appreciation, rental income, occupancy or rentability,
  short-term rental permitting, school attendance, tax amounts, solar savings, or
  that any piece of equipment is owned or transfers.
- This is a 744 sq ft, one-bedroom, one-bath house on a 0.053-acre lot. Never inflate
  it, never imply more space or more rooms than the record shows, and never suggest
  what could be added or converted.
- Never name the systems the information came from. Do not say "the MLS", "NTREIS",
  "DCAD", "the appraisal district", "the tax record" or "the listing" in an answer.
  Say "the property information", "the property details", or simply state the fact.
- Where the record is thin or internally inconsistent, give the figure most useful to
  a buyer and say plainly that it is worth confirming during due diligence. Do not
  narrate the discrepancy between sources.
- Present estimates as estimates and show the assumption behind them.

FAIR HOUSING
Never describe or characterise the people, demographics, religion, national origin,
family makeup, or "type of buyer" of the neighborhood or building, and never steer
anyone toward or away from an area on those grounds. Describe the property and
verifiable locations only. Do not describe who a one-bedroom house would "suit" in
terms of household make-up, and do not assign rooms to particular kinds of occupants.

PRIVACY
Never reveal or speculate about the owner or occupant, showing instructions, lockbox
or access details, the seller's motivation, or any negotiation position. You do not
have this information and must not invent it.

TONE
Warm, precise, unhurried. Plain sentences. You are a knowledgeable assistant to a
serious buyer, not a hype machine. No exclamation marks, no "stunning" or "must see".
Never mention internal notes, missing paperwork, or how this page was assembled. If
something is not available here, simply say Mysti can get it for them.

PROPERTY RECORD
${KB}`;

/* ------------------------------- handler -------------------------------- */
const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff'
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });

/* Every failure used to return the same opaque message, which made a missing
   API key indistinguishable from an undeployed function. Each failure now
   carries a `code` the widget can act on and a human can read directly. */
const fail = (code, message, status) => json({ error: message, code }, status);

/* Best-effort throttle, per warm instance. */
const hits = new Map();
function throttled(ip) {
  const now = Date.now();
  const win = 60000, cap = 12;
  const list = (hits.get(ip) || []).filter((t) => now - t < win);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 500) hits.clear();
  return list.length > cap;
}

/* The most common cause of a rejected key is a paste artefact, not a wrong key:
   a trailing newline from a copy, or quotes typed around the value in the
   Netlify UI. Both are safe to strip. Anything still malformed is reported
   precisely rather than sent to the API to fail. */
function readKey() {
  const raw = process.env.ANTHROPIC_API_KEY;
  if (!raw) return { present: false };

  let key = String(raw).trim();
  const hadWhitespace = key !== String(raw);
  const hadQuotes = /^(['"]).*\1$/s.test(key);
  if (hadQuotes) key = key.slice(1, -1).trim();

  return {
    present: true,
    key,
    hadWhitespace,
    hadQuotes,
    // Format check only — no part of the secret is ever returned or logged.
    looksValid: /^sk-ant-/.test(key),
    length: key.length
  };
}

export default async (req) => {
  const k = readKey();
  const key = k.key;

  /* GET is a health check: open /.netlify/functions/concierge in a browser to
     see whether the function deployed and whether the key is configured.
     It reports only configuration status and never the key itself. */
  if (req.method === 'GET') {
    let hint;
    if (!k.present) {
      hint = 'Set ANTHROPIC_API_KEY in Netlify: Site configuration -> Environment variables, then redeploy.';
    } else if (!k.looksValid) {
      hint = 'The value does not start with "sk-ant-", so it is probably not an Anthropic API key. ' +
             'Create one at console.anthropic.com -> Settings -> API keys. Note that a Claude Pro or Max ' +
             'subscription does NOT include API access; the API is billed separately.';
    } else if (k.hadQuotes || k.hadWhitespace) {
      hint = 'The key had surrounding quotes or whitespace; they were stripped. ' +
             'Remove them in Netlify so the stored value is the bare key.';
    } else {
      hint = 'Function is deployed and the key is well-formed. If chat still fails, ' +
             'POST a question and read the returned code.';
    }
    return json({
      ok: Boolean(k.present && k.looksValid),
      function: 'deployed',
      model: MODEL,
      apiKeyConfigured: Boolean(k.present),
      apiKeyLooksValid: Boolean(k.present && k.looksValid),
      apiKeyLength: k.present ? k.length : 0,
      apiKeyHadQuotesOrWhitespace: Boolean(k.hadQuotes || k.hadWhitespace),
      hint
    }, k.present && k.looksValid ? 200 : 503);
  }

  if (req.method !== 'POST') return fail('method_not_allowed', 'Method not allowed', 405);

  if (!k.present) {
    console.error('ANTHROPIC_API_KEY is not set on this deploy.');
    return fail('not_configured',
      'The concierge is not configured on this deploy: ANTHROPIC_API_KEY is missing.', 503);
  }

  if (!k.looksValid) {
    console.error('ANTHROPIC_API_KEY does not look like an Anthropic key (length %d).', k.length);
    return fail('malformed_key',
      'The configured ANTHROPIC_API_KEY does not start with "sk-ant-", so it is probably not an ' +
      'Anthropic API key. A Claude Pro/Max subscription does not include API access.', 503);
  }

  if (k.hadQuotes || k.hadWhitespace) {
    console.warn('ANTHROPIC_API_KEY had surrounding quotes or whitespace; stripped before use.');
  }

  const ip = req.headers.get('x-nf-client-connection-ip') || 'unknown';
  if (throttled(ip)) return fail('rate_limited', 'Too many questions, please slow down', 429);

  let payload;
  try { payload = await req.json(); }
  catch { return fail('bad_request', 'Invalid request', 400); }

  const question = String(payload?.question ?? '').trim().slice(0, MAX_QUESTION);
  if (!question) return fail('bad_request', 'Ask a question', 400);

  const history = Array.isArray(payload?.history)
    ? payload.history
        .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
        .slice(-8)
        .map((m) => ({ role: m.role, content: String(m.content).slice(0, 2000) }))
    : [];

  /* A trailing assistant turn is invalid as the last message; history is
     always followed by the new user turn, so just append. */
  const messages = [...history, { role: 'user', content: question }];

  try {
    /* Request shape notes for the Claude 5 family:
       - `temperature` / `top_p` / `top_k` were REMOVED and return a 400. Sending
         temperature is what broke every request on the first deploy.
       - Thinking is adaptive and ON by default, and thinking tokens count toward
         max_tokens, so 700 is not enough headroom for a reliable answer.
       - `output_config.effort` is GA (no beta header); "low" suits short factual
         answers drawn from a small knowledge base. */
    const callApi = (body) => fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    });

    const baseBody = { model: MODEL, max_tokens: 4000, system: SYSTEM, messages };
    let res = await callApi({ ...baseBody, output_config: { effort: 'low' } });

    /* Safety net: if this model or account rejects an optional parameter, retry
       once with the minimal valid body rather than failing the visitor. A
       degraded answer beats no answer, and the cause is logged either way. */
    if (res.status === 400) {
      const first = await res.clone().text().catch(() => '');
      console.error('Anthropic 400 with output_config; retrying minimal body.', first.slice(0, 300));
      res = await callApi(baseBody);
      if (res.ok) console.warn('Minimal-body retry succeeded — output_config is not accepted here.');
    }

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('Anthropic API error', res.status, detail.slice(0, 500));

      let upstreamType = '';
      try { upstreamType = JSON.parse(detail)?.error?.type || ''; } catch { /* not JSON */ }

      if (res.status === 401) {
        return fail('bad_api_key',
          'Anthropic rejected the API key as invalid. Confirm the key is active at ' +
          'console.anthropic.com and that it was pasted in full.', 502);
      }
      if (res.status === 403) {
        return fail('key_forbidden',
          'The key is recognised but not permitted to make this call — often no credit balance, ' +
          `or the workspace has no access to "${MODEL}". Check Plans & Billing in the Anthropic Console.`, 502);
      }
      if (upstreamType === 'billing_error' || /credit balance/i.test(detail)) {
        return fail('no_credit',
          'The Anthropic account has no credit balance. Add credits under Plans & Billing.', 502);
      }
      if (res.status === 404 || upstreamType === 'not_found_error') {
        return fail('model_unavailable',
          `This account cannot reach the model "${MODEL}". Set CONCIERGE_MODEL to one it can use.`, 502);
      }
      if (res.status === 429) {
        return fail('upstream_rate_limited', 'The Anthropic API is rate limiting this key.', 502);
      }
      if (res.status === 400) {
        let msg = '';
        try { msg = JSON.parse(detail)?.error?.message || ''; } catch { /* not JSON */ }
        return fail('bad_request_upstream',
          `The Anthropic API rejected the request: ${msg || 'invalid request'}`, 502);
      }
      return fail('upstream_error', `Anthropic API returned ${res.status}.`, 502);
    }

    const data = await res.json();

    /* Claude 5 models can decline a request (HTTP 200 + stop_reason "refusal"),
       so check stop_reason before reading content. */
    if (data?.stop_reason === 'refusal') {
      console.warn('Model refused', JSON.stringify(data?.stop_details || {}));
      return fail('refusal', 'The assistant declined to answer that one.', 502);
    }

    /* Thinking blocks are filtered out; only text reaches the visitor. */
    const answer = (data?.content ?? [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();

    if (!answer) {
      const why = data?.stop_reason === 'max_tokens'
        ? 'The reply hit the token limit before any text was produced.'
        : 'The model returned no text.';
      console.error('Empty answer; stop_reason =', data?.stop_reason);
      return fail('empty_response', why, 502);
    }
    return json({ answer });
  } catch (err) {
    console.error('Concierge failure', err);
    return fail('network_error', `Could not reach the Anthropic API: ${err?.message || 'unknown error'}`, 502);
  }
};
