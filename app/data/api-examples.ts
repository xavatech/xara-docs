export type ApiLanguage = {
  label: string
  language: string
  code: string
}

export type ApiResponse = {
  label: string
  status: string
  code: string
}

export type ApiExample = {
  eyebrow?: string
  method: 'GET' | 'POST' | 'WEBHOOK'
  path: string
  summary: string
  requests: ApiLanguage[]
  responses: ApiResponse[]
}

const baseUrl = 'https://graph.usexara.ai/rest'

export const apiExamples: Record<string, ApiExample> = {
  '/getting-started/quickstart': {
    eyebrow: 'Step 2 · Request payment',
    method: 'POST',
    path: '/Payment/requestInvoice',
    summary: 'Create an invoice for a product in your Xara business.',
    requests: [
      {
        label: 'cURL',
        language: 'bash',
        code: String.raw`curl --request POST \
  --url ${baseUrl}/Payment/requestInvoice \
  --header "Content-Type: application/json" \
  --data '{
    "phone": "2348012345678",
    "business_id": "42",
    "items": "[{\"product_id\":128,\"quantity\":1}]"
  }'`,
      },
      {
        label: 'JavaScript',
        language: 'javascript',
        code: `const response = await fetch(
  '${baseUrl}/Payment/requestInvoice',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: '2348012345678',
      business_id: '42',
      items: JSON.stringify([
        { product_id: 128, quantity: 1 }
      ])
    })
  }
)

const invoice = await response.json()`,
      },
    ],
    responses: [
      {
        label: 'Success data',
        status: 'Success response',
        code: `{
  "reference": "INV-…",
  "amount": 12345,
  "subtotal": 11000,
  "vat": 825,
  "vat_percentage": 7.5,
  "delivery_fee": 0,
  "delivery_destination": null
}`,
      },
    ],
  },
  '/getting-started/authentication': {
    eyebrow: 'Authenticated request',
    method: 'GET',
    path: '/CatalogItem/getAll?type=product',
    summary: 'Pass your API token in the Authorization header.',
    requests: [
      {
        label: 'cURL',
        language: 'bash',
        code: String.raw`curl --request GET \
  --url "${baseUrl}/CatalogItem/getAll?type=product" \
  --header "Authorization: Bearer YOUR_API_TOKEN"`,
      },
      {
        label: 'JavaScript',
        language: 'javascript',
        code: `const response = await fetch(
  '${baseUrl}/CatalogItem/getAll?type=product',
  {
    headers: {
      Authorization: 'Bearer YOUR_API_TOKEN'
    }
  }
)

const products = await response.json()`,
      },
      {
        label: 'PHP',
        language: 'php',
        code: `$client = new GuzzleHttp\\Client();

$response = $client->get(
  '${baseUrl}/CatalogItem/getAll',
  [
    'query' => ['type' => 'product'],
    'headers' => [
      'Authorization' => 'Bearer YOUR_API_TOKEN'
    ]
  ]
);`,
      },
    ],
    responses: [
      {
        label: 'Success',
        status: 'Success response',
        code: `{
  "msg": "Catalog items",
  "data": [
    {
      "id": 128,
      "name": "Premium package",
      "type": "product",
      "price": 11000,
      "old_price": null,
      "picture": "premium-package.jpg"
    }
  ]
}`,
      },
    ],
  },
  '/api-reference/products': {
    eyebrow: 'Products',
    method: 'POST',
    path: '/CatalogItem/create',
    summary: 'Create a product in the authenticated business catalog.',
    requests: [
      {
        label: 'cURL',
        language: 'bash',
        code: String.raw`curl --request POST \
  --url ${baseUrl}/CatalogItem/create \
  --header "Authorization: Bearer YOUR_API_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "name": "Premium package",
    "price": 11000,
    "quantity": 25,
    "description": "Premium product package",
    "min_stock": 5
  }'`,
      },
      {
        label: 'JavaScript',
        language: 'javascript',
        code: `const response = await fetch(
  '${baseUrl}/CatalogItem/create',
  {
    method: 'POST',
    headers: {
      Authorization: 'Bearer YOUR_API_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Premium package',
      price: 11000,
      quantity: 25,
      min_stock: 5
    })
  }
)`,
      },
    ],
    responses: [
      {
        label: 'Success',
        status: 'Success response',
        code: `{
  "msg": "Catalog item created",
  "data": {
    "id": 128,
    "name": "Premium package",
    "type": "product",
    "price": 11000,
    "quantity": 25,
    "description": "Premium product package",
    "min_stock": 5,
    "parent_id": null,
    "is_active": true
  }
}`,
      },
      {
        label: '422',
        status: '422 Unprocessable Entity',
        code: `HTTP/1.1 422 Unprocessable Entity`,
      },
    ],
  },
  '/api-reference/tickets': {
    eyebrow: 'Tickets',
    method: 'POST',
    path: '/Ticket/createBusinessTicket',
    summary: 'Create an event with one or more ticket tiers.',
    requests: [
      {
        label: 'cURL',
        language: 'bash',
        code: String.raw`curl --request POST \
  --url ${baseUrl}/Ticket/createBusinessTicket \
  --header "Authorization: Bearer YOUR_API_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "name": "Xara Tech Conference 2026",
    "description": "A conference for founders and software developers",
    "venue": "Landmark Centre, Lagos",
    "event_date": "2026-11-14T09:00:00+01:00",
    "cover_image": "xara-tech-conference.jpg",
    "slug": "xara-tech-conference-2026",
    "tiers": [
      {
        "name": "Regular",
        "price": 10000,
        "quantity": 500,
        "description": "General admission"
      },
      {
        "name": "VIP",
        "price": 30000,
        "quantity": 100,
        "description": "Priority seating and VIP access",
        "daily_booking_limit": 20
      }
    ]
  }'`,
      },
      {
        label: 'JavaScript',
        language: 'javascript',
        code: `const response = await fetch(
  '${baseUrl}/Ticket/createBusinessTicket',
  {
    method: 'POST',
    headers: {
      Authorization: 'Bearer YOUR_API_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Xara Tech Conference 2026',
      description: 'A conference for founders and software developers',
      venue: 'Landmark Centre, Lagos',
      event_date: '2026-11-14T09:00:00+01:00',
      cover_image: 'xara-tech-conference.jpg',
      slug: 'xara-tech-conference-2026',
      tiers: [
        {
          name: 'Regular',
          price: 10000,
          quantity: 500,
          description: 'General admission'
        },
        {
          name: 'VIP',
          price: 30000,
          quantity: 100,
          description: 'Priority seating and VIP access',
          daily_booking_limit: 20
        }
      ]
    })
  }
)`,
      },
    ],
    responses: [
      {
        label: 'Success',
        status: 'Success response',
        code: `{
  "msg": "Ticket created",
  "data": {
    "id": 54,
    "name": "Xara Tech Conference 2026",
    "description": "A conference for founders and software developers",
    "venue": "Landmark Centre, Lagos",
    "event_date": "2026-11-14T08:00:00.000Z",
    "cover_image": "xara-tech-conference.jpg",
    "status": "active",
    "reference": "tk-…",
    "slug": "xara-tech-conference-2026",
    "tiers": [
      {
        "name": "Regular",
        "price": 10000,
        "quantity": 500,
        "sold_count": 0,
        "description": "General admission",
        "slug": "regular-…",
        "product_id": 129,
        "picture": null,
        "daily_booking_limit": null
      },
      {
        "name": "VIP",
        "price": 30000,
        "quantity": 100,
        "sold_count": 0,
        "description": "Priority seating and VIP access",
        "slug": "vip-…",
        "product_id": 130,
        "picture": null,
        "daily_booking_limit": 20
      }
    ]
  }
}`,
      },
      {
        label: '400',
        status: '400 Bad Request',
        code: `HTTP/1.1 400 Bad Request`,
      },
    ],
  },
  '/api-reference/invoices': {
    eyebrow: 'Invoices',
    method: 'POST',
    path: '/Payment/requestInvoice',
    summary: 'Create an invoice and store its reference so you can match the payment.',
    requests: [
      {
        label: 'cURL',
        language: 'bash',
        code: String.raw`curl --request POST \
  --url ${baseUrl}/Payment/requestInvoice \
  --header "Content-Type: application/json" \
  --data '{
    "phone": "2348012345678",
    "business_id": "42",
    "customer_name": "Ada Lovelace",
    "items": "[{\"product_id\":128,\"quantity\":1}]",
    "note": "Order #ORD-1042"
  }'`,
      },
      {
        label: 'JavaScript',
        language: 'javascript',
        code: `const response = await fetch(
  '${baseUrl}/Payment/requestInvoice',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: '2348012345678',
      business_id: '42',
      customer_name: 'Ada Lovelace',
      items: JSON.stringify([
        { product_id: 128, quantity: 1 }
      ]),
      note: 'Order #ORD-1042'
    })
  }
)`,
      },
      {
        label: 'PHP',
        language: 'php',
        code: `$client = new GuzzleHttp\\Client();

$response = $client->post(
  '${baseUrl}/Payment/requestInvoice',
  ['json' => [
    'phone' => '2348012345678',
    'business_id' => '42',
    'items' => json_encode([
      ['product_id' => 128, 'quantity' => 1]
    ])
  ]]
);`,
      },
    ],
    responses: [
      {
        label: 'Success data',
        status: '200 OK',
        code: `{
  "reference": "INV-…",
  "amount": 12345,
  "subtotal": 11000,
  "vat": 825,
  "vat_percentage": 7.5,
  "delivery_fee": 0,
  "delivery_destination": null,
  "items": [
    {
      "name": "Premium package",
      "quantity": 1,
      "unit_price": 11000,
      "total": 11000
    }
  ]
}`,
      },
      {
        label: 'Error',
        status: 'Non-200 response',
        code: `{
  "message": "…"
}`,
      },
    ],
  },
  '/webhooks/payment-webhooks': {
    eyebrow: 'Incoming webhook',
    method: 'WEBHOOK',
    path: 'invoice.paid',
    summary: 'Xara sends this signed payload when an invoice is fully paid.',
    requests: [
      {
        label: 'Payload',
        language: 'json',
        code: `POST /your-xara-webhook
X-Xara-Event: invoice.paid
X-Xara-Delivery-Id: delivery_…
X-Xara-Signature: BASE64_SIGNATURE

{
  "event": "invoice.paid",
  "amount_received": 12345,
  "payment": {
    "id": 987,
    "reference": "INV-…",
    "status": "paid",
    "intent": "invoice",
    "gateway": "…",
    "payment_method": "…",
    "amount": 12345,
    "amount_paid": 12345,
    "amount_remaining": 0,
    "amount_without_vat": 11000,
    "vat": 825,
    "vat_percentage": 7.5,
    "fee": 0,
    "created_at": "…"
  },
  "invoice": {
    "reference": "INV-…",
    "note": "Order #ORD-1042",
    "items": [
      {
        "name": "Premium package",
        "quantity": 1
      }
    ],
    "customer_name": "Ada Lovelace",
    "customer_phone_number": "2348012345678",
    "discount": 0,
    "discount_percentage": 0,
    "min_upfront_amount": null,
    "delivery_eta": null
  },
  "business": {
    "id": 42,
    "name": "Xara",
    "phone": "…"
  }
}`,
      },
      {
        label: 'Verify · Node',
        language: 'javascript',
        code: `const expected = crypto
  .createHmac('sha256', XARA_WEBHOOK_SECRET)
  .update(rawBody)
  .digest('base64')

if (signature !== expected) {
  return new Response('Invalid signature', {
    status: 401
  })
}

// Process every delivery ID only once.
return new Response('ok', { status: 200 })`,
      },
    ],
    responses: [
      {
        label: 'Acknowledge',
        status: '200 OK',
        code: `HTTP/1.1 200 OK`,
      },
      {
        label: 'Retry',
        status: 'Non-2xx response',
        code: `Xara retries unsuccessful deliveries after:

• 1 minute
• 5 minutes
• 30 minutes`,
      },
    ],
  },
}

export function getApiExample(path: string) {
  return apiExamples[path]
}
