# Supply Chain Route Emissions Calculator

This Angular application helps track and analyze emissions for supply chain routes. It allows users to calculate total emissions based on geographic data, transportation segments, and more. The app integrates map views for visualization, IndexedDB for data storage, and various other features to enhance supply chain sustainability.

## Features

### 1. **Route Emissions Calculation**
   - Calculate total emissions for a trip between an **origin** and a **destination**.
   - Emissions per km are inputted by the user and used in the emissions calculation.
   - Ability to break the trip into **segments** with different emissions rates (e.g., different modes of transportation like train, truck, etc.).

### 2. **Interactive Map View**
   - Display geographic distribution of routes using **Leaflet.js** and **OpenStreetMap**.
   - Users can view the origin and destination of each route visually on the map.
   - Zoomable map with markers for the origin and destination points.

### 3. **Dynamic Route Management**
   - Users can dynamically add new supply chain routes to the application.
   - For each route, users can input information such as origin, destination, emissions per km, and trip segments.

### 4. **Geographic Data Integration**
   - Supports **latitude and longitude** input for both origin and destination locations.
   - Option to input **emissions per km** for the entire route or for each segment.

### 5. **Data Persistence**
   - The application uses **IndexedDB** for local storage of routes and emissions data.
   - Data persists across sessions for better user experience.

### 6. **Responsive Design**
   - Mobile-friendly interface with proper layout adjustments for smaller screens.
   - Adaptive UI to display all relevant information efficiently across devices.

### 7. **Form Validation**
   - Built-in form validation to ensure that all required fields are provided and valid before submission.
   - Real-time error messages when incorrect data is inputted.

### 8. **Emission Calculation Breakdown**
   - Provides detailed breakdowns of total emissions, including emissions for each segment and the total for the entire route.

### 9. **Data Analysis**
   - Analyze the emissions data from multiple routes.
   - Filter and display emissions data in tables, sorted by origin, destination, or emissions value.
   - Option to export the data for further analysis or reporting.

### 10. **Server-Side and Client-Side Platform Detection**
   - Ensures that certain browser-specific features (like IndexedDB) only run in the browser environment, using Angular's **PLATFORM_ID**.

## Technologies Used
- **Angular 19**: Frontend framework for building the application.
- **Leaflet.js**: Library for embedding interactive maps and markers.
- **OpenStreetMap**: Tile service used for map visualization.
- **IndexedDB**: Local storage system for saving route data on the client side.
- **Angular Material**: UI components for modern design (e.g., cards, tables, buttons).
- **RxJS**: Reactive programming library for managing asynchronous data flows.
- **TypeScript**: Typed superset of JavaScript for better maintainability and type safety.

## Requirements

- Node.js >= 14.x
- Angular CLI >= 15.x

## Getting Started

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/supply-chain-emissions.git

2. Navigate to the project directory:

    ```bash
    cd supply-chain-emissions

3. Install dependencies:

    ```bash
    npm install

4. Run the application:

    ```bash
    ng serve

5. Open your browser and navigate to http://localhost:4200 to view the app.

## Folder Structure

src/
├── app/
│   ├── components/
│   │   ├── map-view/
│   │   ├── route-form/
│   │   └── hotspots-table/
│   ├── models/
│   │   └── route.model.ts
│   ├── services/
│   │   └── database.service.ts
│   ├── app.component.ts
│   └── app.module.ts
├── assets/
│   └── map/
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
└── index.html

## Contributing
We welcome contributions! Please fork this repository, make your changes, and submit a pull request.

Steps for Contributing:
Fork the repository.
Clone your forked repository.
Create a new branch for your feature or fix.
Implement your changes and commit them.
Push the changes to your fork.
Open a pull request to the main branch of the original repository.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

For any questions or feedback, please feel free to reach out or open an issue on the GitHub repository.

### Key Sections:
- **Features**: A detailed list of what the application can do.
- **Technologies Used**: A rundown of the libraries and frameworks used.
- **Getting Started**: Instructions on how to set up the project locally.
- **Folder Structure**: A brief overview of how the project is organized.
- **Contributing**: A section to encourage open-source contributions.
- **License**: Your license type (MIT is a common choice).