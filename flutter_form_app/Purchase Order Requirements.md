# Purchase Order Screen Requirements

## Purpose

Build a static, responsive purchase order screen that presents order status, vendor and shipping details, line items, and a cost summary. The screen uses mock data and does not require mutable state.

## Page Layout

- Implement the screen as a `StatelessWidget` with an app bar titled **Purchase Order Mockup**.
- Use a single vertical scroll view containing three sections: the order header, line items, and totals.
- Use a responsive breakpoint of **768 logical pixels**:
  - Above 768 pixels, use the desktop layout.
  - At 768 pixels or below, stack the content for narrow screens.
- Set page padding to **24 px** on desktop and **16 px** on narrow screens. Space the main sections by **24 px** on desktop and **16 px** on narrow screens.

## Order Header

Show the **Purchase Order** title and an **APPROVED** status badge.

Include vendor details, shipping address, and purchase-order metadata:

| Section | Content |
|---|---|
| Vendor | Tech Supplies Corp., 123 Innovation Drive, Silicon Valley, CA 94025, contact@techsupplies.com |
| Shipping | Headquarters, 456 Main Street, New York, NY 10001, Attn: Receiving Dept. |
| PO number | PO-2023-0892 |
| Date | Oct 24, 2023 |
| Payment terms | Net 30 |
| Expected delivery | Nov 01, 2023 |

On desktop, place vendor details, shipping information, and metadata in three columns. Right-align the metadata. On narrow screens, stack the sections vertically and left-align the metadata. Use a reusable label-and-value layout for metadata and keep the PO number visually emphasized.

## Line Items

Display the line items in a table with columns for item code, description, quantity, unit price, and total.

| Item code | Description | Quantity | Unit price | Total |
|---|---|---:|---:|---:|
| LAP-X1-PRO | X1 Pro Developer Laptop — 16GB RAM, 512GB SSD | 5 | $1,299.00 | $6,495.00 |
| MON-4K-27 | 27" 4K IPS Monitor — USB-C PD | 10 | $349.00 | $3,490.00 |
| MOU-WL-MX | Wireless Productivity Mouse | 10 | $89.00 | $890.00 |

Keep the columns aligned and use a **640 px minimum table width**. Allow horizontal scrolling on narrow screens rather than compressing the table. Use a distinct table header, separators between rows, and rounded card clipping.

## Order Summary

Show the subtotal, tax, shipping, and total amount:

| Label | Amount |
|---|---:|
| Subtotal | $10,875.00 |
| Tax (8.5%) | $924.38 |
| Shipping | $50.00 |
| **Total Amount** | **$11,849.38** |

Separate the total from the preceding rows and emphasize it with larger, bold text. Right-align a **350 px**-wide summary on desktop; use the available width on narrow screens.

## Visual Style

- Use a dark slate palette for the app bar, cards, and summary: `#1E293B`.
- Use `#0F172A` with partial transparency for the line-item header.
- Use `#334155` for dividers and borders.
- Use `#94A3B8` for secondary labels and table headings, and `#E2E8F0` for item details.
- Use green `#10B981` for the approved status and indigo `#4F46E5` for the total amount.
- Add a subtle indigo radial glow behind the page content.
- Use rounded cards with restrained borders and shadows.

## Acceptance Criteria

- The order header, line-item table, and summary appear in one vertically scrollable page.
- The header switches from three columns to stacked sections at the 768 px breakpoint.
- The line-item table remains readable at narrow widths through horizontal scrolling.
- The summary switches from a fixed-width, right-aligned desktop layout to a full-width narrow layout.
- The approved status and total amount are visually distinct.
- All listed mock order details and amounts are displayed.
