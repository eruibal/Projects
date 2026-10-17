# Monthly Expense Tax Information Workflow

This process outlines the steps to extract, clean, and categorize expense invoices from the SAT portal for monthly reporting.

## Period Tracker — Ingresos y Gastos

This is a **repetitive process**: the full workflow below (Phases 1–4) must be run **once per reporting period**. Periods are processed **in chronological order** — each month is closed before starting the next one.

### Per-period quick checklist (Phase 1 summary)

1. **Consultar Facturas Recibidas** — select the report period.
2. Copy and paste the results into a blank Google Sheet.
3. Trim the sheet and keep only the relevant columns.
4. Filter and keep only **Efecto** = **Ingreso**; remove all other types.
   - Records you separate out (e.g., **Nómina**, **Medical** invoices) can be moved to their own tabs.
5. Make sure **Estado del Comprobante** = **Vigente**.
6. Record the expenses in the **Journal** Google Sheet.

## Phase 1 — Egress Data Extraction

### 1. Set Up

1. Access the Portal  
   - Log into the SAT Factura Electrónica portal using your RFC and e.firma or Contraseña.
2. Navigate  
   - Go to **Consultar Facturas Recibidas**.
3. Filter  
   - Select the specific reporting month and year.
4. Copy and paste onto a blank Google Sheet

### 2. Column Filtering

Retain only the relevant columns. Delete all others:

- Folio Fiscal (UUID)
- RFC Emisor
- Nombre o Razón Social del Emisor
- Fecha Emisión
- Total
- Efecto
- Estatus
- Estado del Comprobante

### 3. Record Filtering

- Apply a filter to the **Efecto** column:
  - Keep: **Ingreso**
  - Remove: **Anything else** (e.g., Pago, Egreso, Traslado)  

### 4. Categorization & Sorting

| Category | Identification Logic | Action |
|---|---|---|
| Nómina | Records where the Emisor is the employer or contains payroll-related terms (e.g., "Nómina") | Move to a separate section/sheet |
| Medical | Invoices with specific RFCs or keywords (e.g., hospitals, farmacias, doctors) | Move to a separate section/sheet |
| General Expenses | All remaining **Ingreso** records | Maintain in the primary list |

### 5. Final Review

- Verify **Estado del Comprobante** is **Vigente**.
- Flag or remove **Cancelado** invoices to avoid overstating expenses.

### 6. Record expenses in Journal template

- Update Google Sheets template

[Tax preparation map](https://photos.google.com/share/AF1QipP0N1JYkW5i07xTuT3GWW9Y7HAsD0RFcHQpp0mLXSpvVmIHc3Pz6y0OdqIeN_tftg/photo/AF1QipN7or3_tJRaH1_Tu84AOy1cJyrqDY9-xSchB_Ou?key=N014d0lfZkZmb0dIaTF2dTBYSkpvSFNvMjRnenN3)

```mermaid
%%{
  init: {
    'theme': 'base',
    'flowchart': {
      'useMaxWidth': false,
      'htmlLabels': true
    },
    'themeVariables': {
      'fontSize': '10px',
      'background': '#ffffff',
      'mainBkg': '#e8f1fb',
      'primaryColor': '#e8f1fb',
      'primaryTextColor': '#1f2933',
      'primaryBorderColor': '#4a7fb5',
      'nodeBorder': '#4a7fb5',
      'secondaryColor': '#f3f6f9',
      'tertiaryColor': '#ffffff',
      'lineColor': '#4a7fb5',
      'textColor': '#1f2933',
      'edgeLabelBackground': '#ffffff'
    }
  }
}%%
flowchart LR
    %% Phase 1: Data Extraction
    A1["Log into SAT Portal<br/>(RFC + e.firma)"] --> A2["Navigate to<br/>'Facturas Recibidas'"]
    A2 --> A3["Filter Month & Year"]
    A3 --> A4["Copy & Paste into<br/>Google Sheets"]

    %% Phase 2: Cleaning & Transformation
    B1["Column Filtering<br/>(Keep UUID, RFC, Total, etc.)"] --> B2["Record Filtering<br/>(Keep 'Ingreso' only)"]

    %% Phase 3: Categorization
    C0{"Identify Category"}
    C0 --> C1["Nómina Section<br/>(payroll terms)"]
    C0 --> C2["Medical Section<br/>(medical RFCs / keywords)"]
    C0 --> C3["General Expenses<br/>(remaining records)"]

    %% Phase 4: Final Review
    F1["Verify Status = Vigente"] --> F2["Remove Cancelled"]

    %% Phase 5: Record Expenses
  F2 --> G1["Record Expenses"]

    %% Inter-phase Connections
    A4 --> B1
    B2 --> C0
    C1 --> F1
    C2 --> F1
    C3 --> F1

    %% Styling
  style C0 fill:#fff4d6,stroke:#d4a017,color:#1f2933

    %% Light styling
    style A1 fill:#e8f1fb,stroke:#4a7fb5,color:#1f2933
    style A2 fill:#e8f1fb,stroke:#4a7fb5,color:#1f2933
    style A3 fill:#e8f1fb,stroke:#4a7fb5,color:#1f2933
    style A4 fill:#e8f1fb,stroke:#4a7fb5,color:#1f2933
    style B1 fill:#e8f1fb,stroke:#4a7fb5,color:#1f2933
    style B2 fill:#e8f1fb,stroke:#4a7fb5,color:#1f2933
    style C1 fill:#e8f1fb,stroke:#4a7fb5,color:#1f2933
    style C2 fill:#e8f1fb,stroke:#4a7fb5,color:#1f2933
    style C3 fill:#e8f1fb,stroke:#4a7fb5,color:#1f2933
    style F1 fill:#e8f1fb,stroke:#4a7fb5,color:#1f2933
    style F2 fill:#e8f1fb,stroke:#4a7fb5,color:#1f2933
    style G1 fill:#e8f1fb,stroke:#4a7fb5,color:#1f2933
    linkStyle default stroke:#4a7fb5
```

## Phase 2 — Record ledger with expenses

- Log into ADempiere and create GL Journal entry for the period expenses
- Get 'IVA por Cobrar' Report

```mermaid
%%{
  init: {
    'theme': 'base',
    'flowchart': {
      'useMaxWidth': false,
      'htmlLabels': true
    },
    'themeVariables': {
      'fontSize': '10px',
      'background': '#ffffff',
      'mainBkg': '#e8f1fb',
      'primaryColor': '#e8f1fb',
      'primaryTextColor': '#1f2933',
      'primaryBorderColor': '#4a7fb5',
      'nodeBorder': '#4a7fb5',
      'secondaryColor': '#f3f6f9',
      'tertiaryColor': '#ffffff',
      'lineColor': '#4a7fb5',
      'textColor': '#1f2933',
      'edgeLabelBackground': '#ffffff'
    }
  }
}%%
flowchart LR
    A["Log into ADempiere"] --> B["Create GL Journal Entry<br/>(Period Expenses)"] --> C["Get 'IVA por Cobrar'<br/>Report"]

    %% Light styling
    style A fill:#e8f1fb,stroke:#4a7fb5,color:#1f2933
    style B fill:#e8f1fb,stroke:#4a7fb5,color:#1f2933
    style C fill:#e8f1fb,stroke:#4a7fb5,color:#1f2933
    linkStyle default stroke:#4a7fb5
```

## Phase 3 — Update Expense and Revenue Records in Google Sheets

- Open Google Sheets file
- Update expense and revenue records

```mermaid
%%{
  init: {
    'theme': 'base',
    'flowchart': {
      'useMaxWidth': false,
      'htmlLabels': true
    },
    'themeVariables': {
      'fontSize': '10px',
      'background': '#ffffff',
      'mainBkg': '#e8f1fb',
      'primaryColor': '#e8f1fb',
      'primaryTextColor': '#1f2933',
      'primaryBorderColor': '#4a7fb5',
      'nodeBorder': '#4a7fb5',
      'secondaryColor': '#f3f6f9',
      'tertiaryColor': '#ffffff',
      'lineColor': '#4a7fb5',
      'textColor': '#1f2933',
      'edgeLabelBackground': '#ffffff'
    }
  }
}%%
flowchart LR
    A["Open Google Sheets file"] --> B["Update expense and revenue records"]

    %% Light styling
    style A fill:#e8f1fb,stroke:#4a7fb5,color:#1f2933
    style B fill:#e8f1fb,stroke:#4a7fb5,color:#1f2933
    linkStyle default stroke:#4a7fb5
```

## Phase 4 — Prepare and send Tax Declaration