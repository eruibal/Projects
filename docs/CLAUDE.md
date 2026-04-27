# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a documentation-only repository — no build system, no tests, no dependencies. It stores strategic, operational, and technical documents across three client/project areas, all authored in Markdown or HTML.

## Project Structure

Each top-level directory is a client or domain:

- **ER** — Internal role and tax workflow documentation (Tech Lead responsibilities, monthly tax filing procedures)
- **GCP** — Google Cloud Platform reference material (CIDR notation, deployment architecture comparisons)
- **techaus** — Insurance broker (techaus.mx) strategy: 12-month digital marketing plan, insurance product explanations, DataVigía service concept, clickstream action plan

## Document Formats

**Markdown (`.md`)**: Used for narrative docs, technical references, and strategy documents. Documents often include tables for structured data (KPIs, gap analyses, integration catalogs) and ASCII diagrams for system flows.

**HTML (`.html`)**: Used for interactive/visual deliverables — self-contained files with inline CSS/JS. Examples include the CIDR notation reference, insurance product pages, and clickstream analysis pages. These render in a browser without any external dependencies.

## Working in This Repo

- Documents are written for specific audiences: marketers, product owners, operations managers, or engineers. Maintain the same audience framing when expanding a document.
- HTML flow diagrams are standalone files — all styles and scripts are inline. When creating new ones, follow that same self-contained pattern.
- Spanish and English are both used. `techaus` docs are primarily Spanish; `GCP` docs are in English. Match the language of the document being edited.
- Document metadata (author, date, version) appears at the top of strategy docs — keep this pattern when creating new strategic documents.
