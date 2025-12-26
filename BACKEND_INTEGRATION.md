# Backend Integration Guide

This document explains the changes made to the mock data structure and how to integrate with the real backend API.

## Current Mock Data Structure

### Request Format (POST /server/create-route)

The frontend sends user preferences to create a route:

```typescript
{
  "city": string,
  "name_of_route": string,
  "pace": string, // "moderate" | "intensive"
  "quantity_of_days": number,
  "times": string[], // ["HH:MM - HH:MM", ...]
  "wishes": string[], // User interests
  "format_of_movement": string // "walking" | "taxi" | "mixed"
}
```

Example:
```json
{
  "city": "Казань",
  "name_of_route": "Гастро-тур и история",
  "pace": "интенсивный",
  "quantity_of_days": 2,
  "times": ["10:00 - 20:00", "09:00 - 15:00"],
  "wishes": ["Архитектура", "Рестораны", "Спа-процедуры"],
  "format_of_movement": "такси"
}
```

### Response Format (POST /server/create-route)

The server responds with route creation status and ID:

```typescript
{
  "success": boolean,
  "routeId": number
}
```

Example:
```json
{
  "success": true,
  "routeId": 1
}
```

### Route Data Request (GET /server/route/{id})

After successful creation, the frontend navigates to `/route/{id}` and fetches the detailed route data.

### Response Format (GET /server/route/{id})

The server responds with the complete route data:

```typescript
{
  "id": number,
  "name": string,
  "city": string,
  "pace": string,
  "format_of_movement": string,
  "days": [
    {
      "day_number": number,
      "working_time": string, // "HH:MM - HH:MM"
      "places": [
        {
          "id": number,
          "route_id": number,
          "day_number": number,
          "order": number,
          "name": string,
          "description": string,
          "coordinates": string, // "latitude,longitude"
          "address": string,
          "time": string // "HH:MM - HH:MM"
        }
      ]
    }
  ]
}
```

Example:
```json
{
  "id": 1,
  "name": "Гастро-тур и история",
  "city": "Казань",
  "pace": "интенсивный",
  "format_of_movement": "такси",
  "days": [
    {
      "day_number": 1,
      "working_time": "10:00 - 20:00",
      "places": [
        {
          "id": 1,
          "route_id": 1,
          "day_number": 1,
          "order": 1,
          "name": "Казанский Кремль",
          "description": "Историческое сердце Казани, объект Всемирного наследия ЮНЕСКО.",
          "coordinates": "55.7997, 49.1118",
          "address": "Кремль, Казань",
          "time": "10:00 - 13:00"
        }
      ]
    }
  ]
}
```

## Changes Made

### 1. Type Definitions Updated

**Before:**
```typescript
export interface TravelPreferences {
  city: string;
  name_of_route: string;
  pace_of_route?: string;
  quantity_of_days: number;
  times: string[];
  interests: string[];
  format_of_movement: string;
}

export interface RoutePoint {
  id: string;
  number_day: number;
  route_id: number;
  order: number;
  coordinates: string;
  name: string;
  description: string;
  time: string;
  address: string;
}

export interface RouteData {
  id: number;
  name: string;
  city: string;
  places: RoutePoint[];
}
```

**After:**
```typescript
export interface TravelPreferences {
  city: string;
  name_of_route: string;
  pace?: string; // Changed from pace_of_route
  quantity_of_days: number;
  times: string[];
  wishes: string[]; // Changed from interests
  format_of_movement: string;
}

export interface RoutePoint {
  id: number; // Changed from string to number
  route_id: number;
  day_number: number; // Changed from number_day
  order: number;
  name: string;
  description: string;
  coordinates: string;
  address: string;
  time: string;
}

export interface RouteDay { // New interface
  day_number: number;
  working_time: string;
  places: RoutePoint[];
}

export interface RouteData {
  id: number;
  name: string;
  city: string;
  pace: string; // Added
  format_of_movement: string; // Added
  days: RouteDay[]; // Changed from places to days
}
```

### 2. Mock Data Updated

The mock data in both `App.tsx` and `RoutePage.tsx` has been updated to match the new structure.

### 3. API Integration Points

#### Route Creation Flow

1. **User completes questionnaire** → `handleQuestionnaireComplete()` in `App.tsx`
2. **Frontend sends data to backend** → `POST /server/create-route`
3. **Backend processes data and creates route** → Returns `{ success: true, routeId: number }`
4. **Frontend redirects to route page** → `/route/{routeId}`
5. **RoutePage fetches detailed route data** → `GET /server/route/{routeId}`

#### Current Mock Implementation

The current implementation uses mock data with simulated API calls:

```typescript
// In App.tsx - Simulate route creation
const mockServerResponse = {
  success: true,
  routeId: 1
};

// In RoutePage.tsx - Simulate route data fetch
const mockRouteData: RouteData = {
  id: 1,
  name: "Гастро-тур и история",
  city: "Казань",
  pace: "интенсивный",
  format_of_movement: "такси",
  days: [
    // ... days with places
  ]
};
```

## Backend Integration Steps

### 1. Replace Mock API Calls

Replace the mock API calls with real HTTP requests:

```typescript
// In App.tsx - Replace mock route creation
const response = await fetch('/server/create-route', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    city: prefs.city,
    name_of_route: prefs.name_of_route,
    pace: prefs.pace,
    quantity_of_days: prefs.quantity_of_days,
    times: prefs.times,
    wishes: prefs.wishes,
    format_of_movement: prefs.format_of_movement
  })
});

const serverResponse = await response.json();
if (serverResponse.success) {
  window.location.href = `/route/${serverResponse.routeId}`;
}
```

```typescript
// In RoutePage.tsx - Replace mock route fetch
const response = await fetch(`/server/route/${id}`);
const routeData = await response.json();
const preferences = await fetchPreferencesData(); // You may need to store this separately
```

### 2. Error Handling

Add proper error handling for API failures:

```typescript
try {
  const response = await fetch(`/server/route/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch route data');
  }
  const routeData = await response.json();
  setRouteData(routeData);
} catch (error) {
  setError('Failed to load route. Please try again.');
  console.error('API Error:', error);
}
```

### 3. Loading States

The current loading states are already implemented and can be reused.

### 4. Data Validation

Ensure the backend validates the incoming data and returns appropriate error messages.

## Testing the Integration

1. **Test route creation** - Verify the POST endpoint returns correct route ID
2. **Test route fetching** - Verify the GET endpoint returns complete route data
3. **Test error cases** - Verify error handling works for invalid routes
4. **Test data mapping** - Ensure all fields map correctly between frontend and backend

## Notes

- The current mock data uses Kazan as the example city with a gastronomy and history tour
- The route includes 2 days with multiple places per day
- Coordinates are in "latitude,longitude" format for map display
- All time fields use "HH:MM - HH:MM" format
- The frontend is ready for backend integration - just replace the mock data with real API calls
