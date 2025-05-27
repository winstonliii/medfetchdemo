# Medfetch Demo

A modern web application for managing and analyzing medical research data with an intuitive workspace-based interface.

## Features

- **Workspace Management**
  - Create and manage multiple research workspaces
  - Save and load workspace configurations
  - Customizable filters for data analysis

- **Data Grid Interface**
  - Interactive data table with sorting and filtering
  - Support for medical data fields (MRN, Age, Gender, Diagnosis, Treatment, etc.)
  - Real-time data editing and validation
  - Row selection and bulk operations

- **Data Analysis**
  - Filter data by age range, gender, and date ranges
  - Search by diagnosis and treatment codes
  - Export data to Excel and CSV formats
  - Statistical analysis of selected data

- **Data Source Integration**
  - Connect to various data sources
  - Import and manage medical records
  - Support for different data formats

## Technical Stack

- React 19
- TypeScript
- AG Grid for data visualization

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. Build for production:
   ```bash
   pnpm build
   ```

## Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm preview` - Preview production build

## License

Nestor Health - All rights reserved