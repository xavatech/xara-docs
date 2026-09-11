# Xara Business API

The Xara Business API lets developers create invoices for a Xara business and
receive webhook notifications when customers make payments.

**Base URL:** `https://graph.usexara.ai/rest/`

---

## Configuration

Get your API token, business ID, and webhook secret from the developer dashboard at
[business.usexara.ai](https://business.usexara.ai).

| Credential     | Purpose                                            |
| -------------- | -------------------------------------------------- |
| API token      | Authorizes requests that manage business resources |
| Business ID    | Identifies the Xara business receiving the payment |
| Webhook secret | Verifies that webhook requests were sent by Xara   |

Send requests as JSON using `Content-Type: application/json`. Authenticated
endpoints require the API token as a Bearer token:

```http
Authorization: Bearer YOUR_API_TOKEN
```

---

## 1. Create a product

`POST https://graph.usexara.ai/rest/CatalogItem/create`

Creates a product in your business catalog. The created product ID can be used
as `product_id` when creating an invoice.

This endpoint requires an `Authorization: Bearer YOUR_API_TOKEN` header.

Request body:

- `name` (required) — product name
- `price` (required) — selling price; must be greater than `0`, except
  `type: "ticket"` which also allows `0` (a free ticket)
- `quantity` (optional) — available stock; defaults to `0`
- `description` (optional) — product description
- `min_stock` (optional) — low-stock threshold
- `cost_price` (optional) — internal cost price; must be `0` or greater
- `picture` (optional) — file name of an image uploaded beforehand
- `parent_id` (optional) — ID of a parent product when creating a variant
- `collection_ids` (optional) — array of collection IDs to assign the product to
- `type` (optional) — `product`, `service`, `ticket`, or `subscription`;
  defaults to `product`
- `subscription_interval_days` (required when `type` is `subscription`)

Example request:

```bash
curl --request POST \
  --url https://graph.usexara.ai/rest/CatalogItem/create \
  --header "Authorization: Bearer YOUR_API_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "name": "Premium package",
    "price": 11000,
    "quantity": 25,
    "description": "Premium product package",
    "min_stock": 5
  }'
```

Success response:

```json
{
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
}
```

Validation errors return status `422`. A missing or invalid API token returns
an authentication error.

### Retrieve products

`GET https://graph.usexara.ai/rest/CatalogItem/getAll?type=product`

Returns the active products in your business catalog, ordered from newest to
oldest. This endpoint requires an `Authorization: Bearer YOUR_API_TOKEN`
header.

The optional `type` query parameter accepts `product`, `service`, `ticket`, or
`subscription`. When omitted, all active catalog items except tickets are
returned.

Example request:

```bash
curl --request GET \
  --url "https://graph.usexara.ai/rest/CatalogItem/getAll?type=product" \
  --header "Authorization: Bearer YOUR_API_TOKEN"
```

Success response:

```json
{
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
}
```

Use the returned `id` as `product_id` when creating an invoice.

### Ticket product vs Ticket

A **ticket product** is a catalog item with `type: "ticket"`. Create it with
`CatalogItem/create` like any other product, then sell it with
`Payment/requestInvoice` using that item's `id` as `product_id`. When the
invoice is paid, Xara issues a scannable ticket and decrements catalog stock.
Omit `parent_id` to create a standalone ticket product.

A **Ticket** is an event (`Ticket/createBusinessTicket` below). It has a venue,
date, public link, and one or more pricing **tiers**. Xara creates a ticket
product for each tier. Use a Ticket when you need event details, multiple
tiers, daily booking limits, or a shareable `/ticket/event/{slug}` page.

Use a ticket product when you only need to sell an admission SKU. Use a
Ticket when you are selling an event.

---

## 2. Create a ticket (event)

`POST https://graph.usexara.ai/rest/Ticket/createBusinessTicket`

Creates an **event** with one or more pricing tiers. This is not the same as
`CatalogItem/create` with `type: "ticket"` — that creates a single ticket
product in the catalog. This endpoint creates the event and then a catalog
item (ticket product) for each tier so customers can purchase with
`product_id`.

This endpoint requires an `Authorization: Bearer YOUR_API_TOKEN` header.

Request body:

- `name` (required) — event name
- `tiers` (required) — non-empty array of ticket tiers
- `description` (optional) — event description
- `venue` (optional) — event venue
- `event_date` (optional) — event date and time
- `cover_image` (optional) — file name or URL of the event cover image
- `slug` (optional) — unique event slug

Each item in `tiers` supports:

- `name` (required) — tier name
- `price` (required) — non-negative ticket price
- `quantity` (required) — non-negative number of tickets available
- `description` (optional) — tier description
- `picture` (optional) — image for the tier
- `daily_booking_limit` (optional) — maximum tickets that may be booked per day
- `slug` (optional) — unique tier slug; Xara generates one when omitted

Example request:

```bash
curl --request POST \
  --url https://graph.usexara.ai/rest/Ticket/createBusinessTicket \
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
  }'
```

Success response:

```json
{
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
}
```

Use a tier's `product_id` with `Payment/requestInvoice` to create an invoice for
that ticket tier.

Tier product IDs are also returned by:

`GET https://graph.usexara.ai/rest/Ticket/getTiers?event_slug=EVENT_SLUG`

The previous `POST Ticket/requestInvoice` endpoint is deprecated. It remains
available for existing integrations, but new integrations should use
`Payment/requestInvoice` with the tier's `product_id`.

Invalid ticket or tier data returns status `400`. A missing or invalid API
token returns an authentication error.

---

## 3. Create an invoice

`POST https://graph.usexara.ai/rest/Payment/requestInvoice`

Creates an invoice against a Xara business for the given items and returns a
reference to track it. This endpoint does not require an API token; the business
is identified by `business_id` in the request body.

Request body:

- `phone` (required) — the paying customer's phone number
- `business_id` (required) — the Xara business receiving the payment
- `items` (required) — JSON string of `[{ product_id, quantity }]`; each
  `product_id` is a catalog item that belongs to that business
- `customer_name` (optional) — derived from the phone if omitted
- `note` (optional) — free-text note stored on the invoice
- `delivery_destination_id` (optional) — a delivery destination of the
  business; its fee is added as a line item

Example request:

```json
{
  "phone": "2348012345678",
  "business_id": "42",
  "customer_name": "Ada Lovelace",
  "items": "[{ \"product_id\": 128, \"quantity\": 1 }]",
  "note": "Order #ORD-1042"
}
```

Success response (`data`):

```json
{
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
}
```

Store the returned `reference` — it is how the payment webhook is matched back
to your record. Non-`200` responses return `{ "message": "…" }` describing the
problem.

External carts (WooCommerce, custom storefronts) should use the authenticated
`Payment/initiateInvoice` endpoint with ad-hoc line items and `includeVat: false`
so the invoice total matches the checkout total. Pass `delivery_address`
(`address`, optional `city` / `state` / `label`) so the customer's checkout
address is stored on the invoice.

---

## 4. Get notified of payment — payment webhook

When the invoice is paid, Xara POSTs a signed JSON body to the business's
registered webhook URL. Two events are relevant:

| Event                      | Fired when                    |
| -------------------------- | ----------------------------- |
| `invoice.payment_received` | A partial payment is received |
| `invoice.paid`             | The invoice is fully paid     |

Every delivery includes these headers:

- `X-Xara-Event` — the event name (e.g. `invoice.paid`)
- `X-Xara-Delivery-Id` — unique delivery identifier
- `X-Xara-Signature` — `HMAC-SHA256(rawBody, secret)` encoded as **base64**,
  present when a signing secret is configured

Failed deliveries (non-`2xx`) are retried at 1 min, 5 min and 30 min.

### Verifying the signature

Compute the HMAC over the **raw request body** using the shared secret and
compare it to `X-Xara-Signature`. Reject the request on mismatch.

```ts
const expected = crypto
  .createHmac("sha256", XARA_WEBHOOK_SECRET)
  .update(rawBody)
  .digest("base64");

if (signature !== expected) {
  // reject: 401
}
```

### `invoice.paid` payload

```json
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
    "items": [{ "name": "Premium package", "quantity": 1 }],
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
}
```

Match `payment.reference` against the invoice reference stored by your
application to reconcile the payment. Process each `X-Xara-Delivery-Id` only
once so webhook retries do not duplicate your business logic. Respond with a
`2xx` status to acknowledge the webhook; any other status triggers a retry.
