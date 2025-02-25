# OpenMotor Web Design Specification

## Overview
OpenMotor Web is a simulation tool for rocket motor experimenters that enables users to input parameters and simulate performance with graphical outputs such as chamber pressure and thrust over time. the app should not need internet access and should be able to run without an internet connection.

## tech stack
- html,css,javascript and nodejs 



## Design System

### Color Scheme
- Primary: `#003366` (Dark blue for headers, buttons, and important elements)
- Secondary: `#66CCFF` (Light blue for highlights and active states)
- Background: `#F0F0F0` (Light gray background)
- Content: `#FFFFFF` (White for content areas)

### Typography
- Base Font: Open Sans, Arial, sans-serif
- Body Size: 16px
- Heading Sizes:
  - Hero: 32px
  - Subheading: 20px

### Responsive Design
Fully responsive design supporting:
- Desktop
- Tablet
- Smartphone

## Layout Components

### Header
- Fixed position
- Logo: Stylized rocket/motor icon in dark blue
- Navigation:
  - Home
  - Simulation
  - Documentation
  - About
- Mobile: Hamburger menu with vertical expansion

### Pages

#### Home Page
- Hero section with gradient background
- "Simulate rocket motor performance with precision" headline
- "Start Simulation" call-to-action button
- Overview section explaining key features

#### Simulation Page
##### Layout
- Desktop: Two-column (50/50 split)
- Mobile: Vertical stack with collapsible sections

##### Sections
1. Unit Selection
   - Toggle between Metric/Imperial

2. Propellant Editor
   - Select from pre-defined propellants dropdown (KNSB, KNSU, KNDX, APCP, etc.)
   - "Custom" option to create from scratch
   - Properties (all editable):
     - Name
     - Density (lb/in³)
     - Minimum Pressure (psi)
     - Maximum Pressure (psi)
     - Burn Rate Coefficient (a) (in/s·(psi)^(−n))
     - Burn Rate Exponent (n)
     - Specific Heat Ratio (gamma)
     - Combustion Temperature (°R)
     - Exhaust Molar Mass (lb/lb-mole)
     - Characteristic Velocity (c*, ft/s)
   - "Save Propellant" button to save modifications
   - "Add New Propellant" button to create and save custom propellants
   - "Manage Propellants" option to view/edit/delete saved propellants

3. Grain Geometry
   - Shape options: BATES, Finocyl, Star, Custom
   - Shape-specific parameters
   - DXF upload for custom shapes

4. Nozzle Specifications
   - Throat Diameter
   - Exit Diameter
   - Expansion Ratio (calculated)

5. Simulation Controls
   - Run/Pause/Reset buttons
   - Advanced settings panel

6. Results Display
   - Interactive graphs
   - Summary metrics
   - Grain regression visualization

#### Documentation Page
- Sidebar navigation
- Search functionality
- Structured content with diagrams and equations

#### About Page
- Project credits
- Technology stack
- Contact information

## UX Enhancements
- Contextual tooltips
- Real-time validation
- Progress indicators
- Save/Load functionality
- Undo/Redo support
- Accessibility features:
  - High contrast mode
  - Keyboard navigation
  - ARIA labels

## Technical Implementation
- JavaScript-powered interactivity
- Performance optimization options
- Responsive layouts
- Dark mode support
- User preference storage
- Activity logging

## Footer
- Copyright notice
- Privacy Policy and Terms of Use links

### Motors

### SimulationResults

### UserPreferences

