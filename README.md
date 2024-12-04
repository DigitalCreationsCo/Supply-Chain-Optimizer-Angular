# Supply Chain Route Emissions Calculator

This Angular application helps track and analyze costs and emissions for supply chain routes. It allows users to calculate total emissions based on geographic data, transportation segments, and more. The app integrates map views for visualization, IndexedDB for data storage, and various other features to enhance supply chain sustainability.

---

## Features

### 1. **Route Emissions Calculation**
- Calculate total emissions for a trip between an **origin** and a **destination**.
- Emissions per km are inputted by the user and used in the emissions calculation.
- Break the trip into **segments** with different emissions rates, accommodating varied transportation methods (e.g., train, truck, ship, etc.).

### 2. **Interactive Map View**
- Display geographic distribution of routes using **Leaflet.js** and **OpenStreetMap**.
- Visualize the origin and destination of each route, along with intermediate stops.
- Markers for the origin, destination, and segments on a zoomable map.

### 3. **Dynamic Route Management**
- Dynamically add, update, and delete routes in the application.
- Each route allows for input of essential data such as **origin**, **destination**, **segment details**, and **emissions rates**.

### 4. **Geographic Data Integration**
- Input precise **latitude and longitude** for both origin and destination locations.
- Calculate distances using geographic coordinates to ensure accurate emissions estimates.

### 5. **Data Persistence with IndexedDB**
- Use **IndexedDB** for local storage of route and emissions data.
- Ensures persistent data across sessions, even when offline.
- Efficient data retrieval and manipulation, with RxJS observables to manage updates.

### 6. **Responsive Design**
- Fully responsive interface with layouts optimized for both desktop and mobile devices.
- Adaptive UI ensures data is displayed efficiently across screen sizes.

### 7. **Real-Time Form Validation**
- Built-in Angular form validation to ensure correct data entry.
- Real-time error messages for missing or invalid fields.

### 8. **Emission Calculation Breakdown**
- Provide detailed emissions breakdown:
  - Emissions per segment (based on specific rates).
  - Total route emissions.
  - Average emissions for all segments.

### 9. **Advanced Data Visualization**
- Use **Leaflet.js** and a node graph system to visualize routes and their relationships.
- Show data relevance and emissions correlations graphically.
- Create a **graph-based UI** for an intuitive view of route connections.

### 10. **Data Analysis Tools**
- Analyze emissions data from multiple routes:
  - Filter by origin, destination, or emissions value.
  - Export data to CSV for further analysis.
- Visualize emissions trends to identify high-emission hotspots and optimize routes.

### 11. **Performance Optimizations**
- Leverages Angular's **Change Detection Strategy** for efficient DOM updates.
- Observables and Subjects ensure the UI updates dynamically when data changes.

### 12. **Loading States and Dynamic UI Updates**
- Handles asynchronous data fetching with **loading indicators**.
- Displays placeholders while data loads.
- Automatically updates the DOM when route data is modified or added.

### 13. **Customizable UI**
- Allows users to customize the view by toggling between map, table, and graph visualizations.
- Grid layouts for detailed emissions data, segmented by transport mode or geographic location.

---

## Technologies Used

- **Angular 19**: Frontend framework.
- **Leaflet.js**: Library for map integration and geographic visualization.
- **OpenStreetMap**: Tile service for rendering interactive maps.
- **IndexedDB**: Local client-side database for persistent data storage.
- **RxJS**: Reactive programming for state management.
- **Angular Material**: Modern UI components for responsive design.
- **TypeScript**: Strongly typed JavaScript superset for maintainable and scalable code.
- **GeoJSON**: Data format for geographic data processing.
- **Node.js**: Runtime environment for development tasks.

---

## Additional Features Under Development

- **AI-Powered Route Optimization**:
  - Use machine learning to recommend more sustainable routes based on emissions patterns.
  - Predict bottlenecks and suggest alternatives in real time.
- **API Integration**:
  - Incorporate third-party APIs for real-time transportation data.
  - Connect with carbon credit platforms for tracking emissions offsets.

---

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
│   │   ├── kpi-cards/         
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
Contributions are welcome!

1. Fork this repository.
2. Clone your forked repository.
3. Create a new branch for your feature or fix.
4. Implement your changes and commit them.
5. Push the changes to your fork.
6. Open a pull request to the main branch of the original repository.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact and Support
For questions, feedback, or feature requests, please create an issue in the GitHub repository.
