# Dynamic Portfolio Dashboard

A dynamic portfolio dashboard built with Next.js, React, TypeScript and Tailwind CSS.

The portfolio holdings are based on the Excel sheet provided for the assignment.

## Features

- Portfolio table with stock holdings and calculations
- Live CMP data from Yahoo Finance
- P/E Ratio and Latest Earnings from Google Finance
- Automatic data refresh every 15 seconds
- Sector-wise portfolio grouping and summaries
- Green/red indicators for Gain/Loss
- Basic caching and error handling for external data

## Data Sources

- Yahoo Finance is used for Current Market Price (CMP).
- Google Finance is used for P/E Ratio and Latest Earnings.

Both sources are accessed using unofficial methods, since they do not provide a simple official public API for these requirements.

## Getting Started

Install the dependencies:

```bash
npm install