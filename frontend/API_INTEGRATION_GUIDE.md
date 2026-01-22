# 5e-SRD-API Integration Guide

## Overview
Fabularium project has been successfully refactored to use the **5e-SRD-API** (https://www.dnd5eapi.co/) instead of local JSON data.

## Changes Made

### 1. New API Service Layer
**File:** `frontend/src/services/resourceService.ts`

This service provides methods to fetch D&D 5e data from the public API:
- `getClasses()` - Fetch all classes
- `getRaces()` - Fetch all races
- `getSpells()` - Fetch all spells
- `getBackgrounds()` - Fetch all backgrounds
- `getFeats()` - Fetch all features/feats
- Individual detail fetchers for each resource type
- Generic `getResourceDetail()` method for flexibility

**API Base URL:** `https://www.dnd5eapi.co/api/2014`

### 2. Refactored Resources Component
**File:** `frontend/src/assets/pages/Resources.tsx`

Changes:
- Removed dependency on local `resources.json`
- Implemented `useEffect` hook to fetch data on component mount
- Added loading and error states
- All data now comes from the API in real-time
- Source handling simplified (single "D&D 5e SRD" source instead of multiple books)

### 3. Updated Renderers
The following components now handle both old local format and new API format:

- **ClassRenderer.tsx** - Maps API fields to component expectations
- **RaceRenderer.tsx** - Handles subraces and various field name variations
- **SpellRenderer.tsx** - Parses complex spell metadata from API

### 4. Enhanced Type Definitions
**File:** `frontend/src/types/resources.ts`

Updated types to accommodate API response structure:
- Added optional `index` field (API identifier)
- Added `url` field for API links
- Updated `SpellType` to handle complex nested structures
- Added support for `desc` field (description arrays)
- Made types flexible to handle both old and new formats

### 5. Updated ResourceItem
**File:** `frontend/src/assets/components/Resources/ResourceItem.tsx`

Enhanced metadata extraction to include API-specific fields like `index`.

## How to Use

### Running the Application
```bash
cd frontend
npm install
npm run dev
```

The Resources page will automatically fetch data from the API on load. No local data files are needed.

### API Response Format

#### Classes Response
```json
{
  "index": "barbarian",
  "name": "Barbarian",
  "hit_die": 12,
  // ... additional fields
}
```

#### Races Response
```json
{
  "index": "dwarf",
  "name": "Dwarf",
  "size": "Medium",
  "speed": { "walk": 25 },
  // ... additional fields
}
```

#### Spells Response
```json
{
  "index": "magic-missile",
  "name": "Magic Missile",
  "level": 1,
  "school": { "name": "Evocation", "index": "evocation" },
  // ... additional fields
}
```

## Features

- **Real-time Data** - Data fetches from the API each time the app loads  
- **Comprehensive** - Access to all D&D 5e SRD resources  
- **No Setup Required** - Uses free public API, no API key needed  
- **Responsive Loading** - Shows loading state while fetching data  
- **Error Handling** - Gracefully handles API failures  
- **Type Safe** - Full TypeScript support  

## API Limitations

- The 5e-SRD-API is public and free, but may have rate limits
- Only the 2014 version of D&D 5e SRD is available (via `/api/2014`)
- Some advanced rendering features may require fetching additional detail endpoints

## Future Improvements

1. **Caching** - Implement localStorage caching to reduce API calls
2. **Pagination** - Handle large result sets with pagination
3. **Search** - Add search functionality to filter resources
4. **Offline Support** - Seed initial data and enable offline mode
5. **Detail Fetching** - Fetch full details on demand rather than loading all upfront

## Troubleshooting

### Resources Not Loading
- Check browser console for CORS errors
- Verify API is accessible: https://www.dnd5eapi.co/api/2014
- Check network tab to ensure API calls are being made

### Missing Data
- Some fields may not be available in the API for all resources
- The renderers fallback to showing "—" for missing data
- Reference the API documentation for available fields

### Performance Issues
- If loading is slow, consider implementing pagination
- Cache responses locally to reduce API calls
- Consider using the GraphQL endpoint for more efficient queries

## API Documentation
Official API documentation: https://www.dnd5eapi.co/docs
