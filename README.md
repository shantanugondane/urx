# Shopify Variants Clone

A pixel-perfect clone of Shopify's Variants section built with Next.js 14+ and Tailwind CSS.

## Features

- **Empty State**: Clean initial view with CTA to add options
- **Inline Option Editor**: Add/edit option names and values with validation
- **Option Pills**: Compact display of saved options with edit functionality
- **Variant Table**: Dynamic table that adapts based on number of options
- **Grouping**: Group variants by any option with expand/collapse functionality
- **Search**: Filter variants by name
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- Next.js 14+ (App Router)
- React 18
- Tailwind CSS
- Lucide React (icons)
- DnD Kit (drag and drop)
- Radix UI (dropdowns and popovers)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── layout.js          # Root layout
│   ├── page.js            # Home page
│   └── variants/page.js   # Variants page
├── components/variants/
│   ├── VariantsCard.js    # Main component
│   ├── OptionEditor.js    # Inline option editor
│   ├── OptionPills.js     # Saved option display
│   ├── GroupBySelect.js   # Grouping dropdown
│   ├── VariantTable.js    # Main table component
│   ├── VariantGroupRow.js # Grouped variant rows
│   └── VariantRow.js      # Individual variant rows
├── lib/
│   └── variants.js        # Utility functions
└── public/reference/       # Reference screenshots (dev only)
```

## Reference Images

The `public/reference/` folder contains PNG screenshots for visual parity during development. These images are not shipped to production and are only used as development references.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## UX States

1. **Empty State**: Shows "Add options like size or color" CTA
2. **Single Option**: Flat table with variant rows
3. **Multiple Options**: Grouped table with expand/collapse controls
4. **Grouping**: Group by any option with visual indicators
5. **Search**: Filter variants by name
6. **Inventory Footer**: Always visible total inventory line

## Validation

- Option names must be unique
- Option values must be unique within each option
- At least one value required per option
- Empty values are automatically filtered out
