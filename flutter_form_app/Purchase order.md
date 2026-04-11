## `PurchaseOrderScreen` — How It's Built & How It Works

### Overall Architecture

`PurchaseOrderScreen` is a **stateless widget** — it holds no mutable state. It renders a static Purchase Order mockup with hardcoded data. The entire UI adapts between desktop and mobile layouts using a single boolean flag.

---

### Entry Point: `build()`

```dart
final isDesktop = MediaQuery.sizeOf(context).width > 768;
```

This is the **single responsive breakpoint**. If the screen width exceeds 768 logical pixels, `isDesktop = true` and a side-by-side layout is used. Otherwise, a stacked (vertical) layout is used. This flag is passed down to every child builder method.

The `Scaffold` has:
- An `AppBar` with a dark slate background (`#1E293B`)
- A `body` wrapped in a `Container` with a `RadialGradient` for a subtle purple glow in the top-right corner

Inside the body is a `SingleChildScrollView` → `Column` with three major sections, separated by dynamic spacing (`24px` on desktop, `16px` on mobile):

```
┌─────────────────────┐
│   _buildHeaderCard  │  ← Vendor info, shipping, PO metadata
├─────────────────────┤
│   _buildDetailsCard │  ← Line items table
├─────────────────────┤
│  _buildSummaryFooter│  ← Subtotal / tax / total
└─────────────────────┘
```

---

### Section 1: `_buildHeaderCard()`

Returns a dark `Card` (`#1E293B`) with:

- **Title row**: "Purchase Order" text + an "APPROVED" badge (green pill with `#10B981` color)
- **Divider**
- **Responsive info block**:
  - **Desktop (`isDesktop = true`)**: Uses a `Row` with three `Expanded` children side-by-side:
    1. Vendor Details column
    2. Shipping Address column
    3. PO metadata (PO number, date, terms, delivery) — right-aligned
  - **Mobile**: Uses a `Column` stacking all three sections vertically, with `_buildInfoRow` labels left-aligned instead of right-aligned

**Helper: `_buildInfoColumn(title, details)`** — renders a grey label above multi-line white text (used for vendor & shipping blocks)

**Helper: `_buildInfoRow(label, value, isBold, isDesktop)`** — renders a key-value pair inline. The `isDesktop` flag switches `MainAxisAlignment` between `end` (right-align on desktop) and `start` (left-align on mobile)

---

### Section 2: `_buildDetailsCard()`

Contains a hardcoded `List<Map<String, String>>` with 3 line items (item code, description, qty, unit price, total).

- **Desktop**: Renders a full **table layout** using nested `Row`s with `Expanded(flex: N)` — each column has a proportional width via flex values `(2, 4, 1, 2, 2)`. A header row with grey bold labels is rendered first, then each item row.
- **Mobile**: Uses a `ListView.separated` (non-scrolling, `shrinkWrap: true`) with a **card-style** layout per item: description + total on top, item code badge + "qty × price" on the bottom row.

The `clipBehavior: Clip.antiAlias` on the card ensures the inner content (table header background) stays clipped to the rounded corners.

---

### Section 3: `_buildSummaryFooter()`

A manually-styled container (not a `Card`) with:
- **Desktop**: `width: 350`, right-aligned via `Align(alignment: Alignment.centerRight)`
- **Mobile**: Full width, centered

Contains four `_buildSummaryRow()` calls: Subtotal, Tax, Shipping, and Total Amount.

**Helper: `_buildSummaryRow(label, value, isTotal)`** — when `isTotal: true`, the row gets larger text (`22px` vs `15px`), bold weight, and the total value is colored indigo (`#4F46E5`). The rows are separated by a manually-placed `Divider` before the total.

---

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| Dark background | `#1E293B` | Cards, AppBar |
| Darkest bg | `#0F172A` | Table header overlay |
| Border/divider | `#334155` | Dividers, mobile badge bg |
| Muted text | `#94A3B8` | Labels, secondary text |
| Body text | `#E2E8F0` | Item descriptions |
| Green (approved) | `#10B981` | Status badge |
| Indigo | `#4F46E5` | Total amount, bg gradient |

---

### Key Design Patterns

- **No `StatefulWidget`** needed — all data is static
- **Responsive layout** is handled entirely through `isDesktop` passed as a parameter to every builder
- **`withValues(alpha: N)`** is used instead of the deprecated `.withOpacity()` throughout
- The table on desktop uses **`Expanded` with `flex`** instead of a real `Table` widget — this gives more styling flexibility but requires manual alignment discipline
- All spacing is conditional on `isDesktop`, keeping mobile layouts tighter