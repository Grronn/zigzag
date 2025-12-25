# Yandex Maps Integration Instructions

## Setup

The travel route application now uses Yandex Maps instead of Leaflet. Here's how to set it up:

### 1. Get a Yandex Maps API Key

1. Go to [Yandex Developer Console](https://developer.tech.yandex.ru/)
2. Create a new project or select an existing one
3. Enable the "JavaScript API and HTTP Geocoder" service
4. Generate an API key for your project

### 2. Update the API Key

In the file `components/TravelMap.tsx`, replace `YOUR_API_KEY` with your actual Yandex Maps API key:

```typescript
script.src = 'https://api-maps.yandex.ru/2.1/?apikey=YOUR_API_KEY&lang=ru_RU';
```

### 3. Features Implemented

The Yandex Maps implementation includes:

- **Interactive Map**: Full Yandex Maps functionality with zoom controls
- **Route Points**: Markers showing each stop on the route with numbered icons
- **Route Lines**: Visual path connecting all route points
- **Info Cards**: Popup cards showing details when hovering or clicking on points
- **Responsive Design**: Works on both mobile and desktop devices
- **Legend**: Map legend explaining the route elements

### 4. Technical Details

- **Type Safety**: Custom TypeScript declarations for Yandex Maps API
- **Performance**: Efficient cleanup and re-initialization when route changes
- **Error Handling**: Graceful fallback when no route points are available
- **Localization**: Russian language support

### 5. Testing

To test the implementation:

1. Run the development server: `npm run dev`
2. Complete the questionnaire to generate route points
3. Switch to the map view to see the Yandex Map with your route
4. Hover over points to see details
5. Click on points to keep the info card visible

### 6. Troubleshooting

If the map doesn't load:

- Check your internet connection
- Verify your API key is correct
- Check browser console for errors
- Ensure you're not exceeding API quotas
- Try clearing browser cache

### 7. API Documentation

For more information about Yandex Maps API:
- [Official Documentation](https://tech.yandex.ru/maps/doc/jsapi/2.1/)
- [API Reference](https://tech.yandex.ru/maps/jsbox/)
- [Examples](https://tech.yandex.ru/maps/jsbox/)
