// Grain Display Module for SRocket Web
// Displays the selected grain shape beneath simulation results

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the display container
    const displayContainer = initGrainDisplay();
    
    // Get grain shape selector
    const grainShapeSelect = document.getElementById('grain-shape');
    if (grainShapeSelect) {
        // Update display when grain shape changes
        grainShapeSelect.addEventListener('change', function() {
            updateGrainDisplay();
        });
        
        // Initial update with current selection
        setTimeout(updateGrainDisplay, 100); // Small delay to ensure DOM is ready
    }
    
    // Get tab buttons for handling visibility
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // If visualization tab is selected, animate transition to visualization window
            if (this.dataset.tab === 'grain-visualization') {
                animateToVisualization();
            }
            
            // Hide grain display when in results or visualization views
            if (this.dataset.tab === 'simulation-results' || this.dataset.tab === 'grain-visualization') {
                const displayContainer = document.getElementById('grain-display-container');
                if (displayContainer) {
                    displayContainer.classList.add('hidden');
                    displayContainer.style.display = 'none';
                }
            } else {
                // Show grain display for input views
                updateGrainDisplay();
            }
        });
    });
    
    // Export the updateGrainDisplay function for use in other modules
    window.updateGrainDisplay = updateGrainDisplay;
});

// Initialize the grain display
function initGrainDisplay() {
    // Check if display container exists, if not create it
    let displayContainer = document.getElementById('grain-display-container');
    if (!displayContainer) {
        displayContainer = document.createElement('div');
        displayContainer.id = 'grain-display-container';
        displayContainer.className = 'grain-display-container';
        
        // Create display title
        const displayTitle = document.createElement('h3');
        displayTitle.textContent = 'Grain Shape Preview';
        displayContainer.appendChild(displayTitle);
        
        // Create canvas container
        const canvasContainer = document.createElement('div');
        canvasContainer.className = 'grain-canvas-container';
        displayContainer.appendChild(canvasContainer);
        
        // Create canvas for grain display
        const canvas = document.createElement('canvas');
        canvas.id = 'grain-display-canvas';
        canvas.width = 300;
        canvas.height = 300;
        canvasContainer.appendChild(canvas);
        
        // Create grain description
        const grainDesc = document.createElement('p');
        grainDesc.id = 'grain-display-description';
        grainDesc.className = 'grain-description';
        grainDesc.textContent = 'No grain shape selected';
        displayContainer.appendChild(grainDesc);
        
        // Position the container below the simulation results
        const resultsColumn = document.querySelector('.results-column');
        if (resultsColumn) {
            // Add to results column, after the simulation results section
            const resultsDisplay = resultsColumn.querySelector('.results-display');
            if (resultsDisplay) {
                resultsColumn.insertBefore(displayContainer, resultsDisplay.nextSibling);
            } else {
                resultsColumn.appendChild(displayContainer);
            }
        } else {
            // Fallback to dynamic content container
            const dynamicContainer = document.getElementById('dynamic-content-container');
            if (dynamicContainer) {
                dynamicContainer.appendChild(displayContainer);
            } else {
                // Last resort: append to main
                const mainElement = document.querySelector('main');
                if (mainElement) {
                    mainElement.appendChild(displayContainer);
                }
            }
        }
        
        // Set appropriate styling
        displayContainer.style.marginTop = '20px';
        displayContainer.style.padding = '15px';
        displayContainer.style.backgroundColor = '#f5f5f5';
        displayContainer.style.borderRadius = '8px';
        displayContainer.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    }
    
    return displayContainer;
}

// Function to animate grain display to visualization window
function animateToVisualization() {
    const displayCanvas = document.getElementById('grain-display-canvas');
    const visualizationCanvas = document.getElementById('grain-canvas');
    const visualizationContainer = document.querySelector('.visualization-container');
    const timeSlider = document.getElementById('time-slider');
    
    if (!displayCanvas || !visualizationCanvas) return;
    
    // Get positions and dimensions
    const displayRect = displayCanvas.getBoundingClientRect();
    const visualRect = visualizationCanvas.getBoundingClientRect();
    
    // Create a clone of the display canvas for animation
    const clone = displayCanvas.cloneNode(true);
    clone.id = 'grain-display-clone';
    clone.className = 'grain-display-animate';
    document.body.appendChild(clone);
    
    // Position clone absolutely
    clone.style.left = displayRect.left + 'px';
    clone.style.top = displayRect.top + 'px';
    clone.style.width = displayRect.width + 'px';
    clone.style.height = displayRect.height + 'px';
    
    // Hide original canvas and add inactive class to container
    displayCanvas.style.opacity = '0';
    visualizationContainer?.classList.add('inactive');
    
    // Force reflow
    clone.getBoundingClientRect();
    
    // Animate to visualization canvas position
    requestAnimationFrame(() => {
        clone.style.transform = `
            translate(${visualRect.left - displayRect.left}px, ${visualRect.top - displayRect.top}px)
            scale(${visualRect.width / displayRect.width})
        `;
        clone.style.opacity = '0';
        
        // Add active class to visualization container
        visualizationContainer?.classList.remove('inactive');
        visualizationContainer?.classList.add('active');
    });
    
    // Remove clone and start visualization
    setTimeout(() => {
        clone.remove();
        displayCanvas.style.opacity = '1';
        
        // Show the visualization tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById('grain-visualization').classList.add('active');
        
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === 'grain-visualization') {
                btn.classList.add('active');
            }
        });
        
        // Start the burning animation in the visualization
        if (window.grainVisualization) {
            // Reset visualization state
            window.grainVisualization.reset();
            
            // Get current simulation data
            const simulationData = {
                burnTime: parseFloat(timeSlider?.value || 0),
                initialRegression: 0,
                burnRate: calculateInitialBurnRate()
            };
            
            // Update visualization with current data
            window.grainVisualization.setSimulationData(simulationData);
            
            // Start burning animation with a slight delay for better transition
            setTimeout(() => {
                window.grainVisualization.updateBurnRegression(calculateBurnRegression(simulationData.burnTime));
                visualizationCanvas.classList.add('burning', 'active');
            }, 100);
        }
    }, 750);
}

// Helper function to calculate initial burn rate
function calculateInitialBurnRate() {
    const coefficient = parseFloat(document.getElementById('burn-rate-coefficient').value) || 0;
    const exponent = parseFloat(document.getElementById('burn-rate-exponent').value) || 0;
    const initialPressure = 50; // Default initial pressure in PSI
    return coefficient * Math.pow(initialPressure, exponent);
}

// Helper function to calculate burn regression
function calculateBurnRegression(time) {
    const burnRate = calculateInitialBurnRate();
    return burnRate * time;
}

// Function to update grain display
function updateGrainDisplay() {
    const grainShapeSelect = document.getElementById('grain-shape');
    if (!grainShapeSelect) return;
    
    const selectedShape = grainShapeSelect.value;
    const canvas = document.getElementById('grain-display-canvas');
    const ctx = canvas?.getContext('2d');
    const description = document.getElementById('grain-display-description');
    
    if (!canvas || !ctx || !description) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Get display container and ensure it's visible ONLY when needed
    const displayContainer = document.getElementById('grain-display-container');
    if (displayContainer) {
        // Only show if we're in the main input section, not in the simulation results
        const isInResultsView = document.querySelector('.tab-content.active#simulation-results') !== null;
        
        if (isInResultsView) {
            // Hide the display if we're in the results view
            displayContainer.classList.add('hidden');
            displayContainer.style.display = 'none';
            return; // Exit early - don't draw when hidden
        } else {
            // Show only when in input view
            displayContainer.classList.remove('hidden');
            displayContainer.style.display = 'block';
        }
    }
    
    // Draw selected grain shape
    switch (selectedShape) {
        case 'bates':
            drawBATESGrain(canvas);
            description.textContent = 'BATES: Cylindrical grain with a central perforation. Provides neutral to slightly progressive burning profile.';
            break;
        case 'finocyl':
            drawFinocylGrain(canvas);
            description.textContent = 'Finocyl: Cylindrical grain with central perforation and radial fins. Provides high initial thrust with progressive-regressive profile.';
            break;
        case 'star':
            drawStarGrain(canvas);
            description.textContent = 'Star: Cylindrical grain with star-shaped central perforation. Provides neutral burning profile.';
            break;
        case 'moonburner':
            drawMoonburnerGrain(canvas);
            description.textContent = 'Moon Burner: Cylindrical grain with an offset circular perforation. Provides progressive burning profile.';
            break;
        case 'rodandtube':
            drawRodAndTubeGrain(canvas);
            description.textContent = 'Rod & Tube: Combination of solid rod surrounded by a tube with a gap. Provides regressive then progressive profile.';
            break;
        case 'endburner':
            drawEndburnerGrain(canvas);
            description.textContent = 'End Burner: Solid cylinder that burns from one end. Provides very regressive burning profile.';
            break;
        case 'custom':
            drawCustomGrain(canvas);
            description.textContent = 'Custom: Custom grain shape defined by DXF file upload.';
            break;
    }
}

// Drawing functions for each grain type
function drawBATESGrain(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Draw cross-section
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = width * 0.4;
    const innerRadius = width * 0.15;
    
    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#66CCFF';
    ctx.fill();
    
    // Draw inner circle (perforation)
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
}

function drawFinocylGrain(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Draw cross-section
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = width * 0.4;
    const innerRadius = width * 0.15;
    const finCount = 6;
    const finHeight = width * 0.15;
    const finWidth = width * 0.05;
    
    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#66CCFF';
    ctx.fill();
    
    // Draw inner circle (perforation)
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    
    // Draw fins
    for (let i = 0; i < finCount; i++) {
        const angle = (i * 2 * Math.PI) / finCount;
        const finX = centerX + innerRadius * Math.cos(angle);
        const finY = centerY + innerRadius * Math.sin(angle);
        
        ctx.save();
        ctx.translate(finX, finY);
        ctx.rotate(angle);
        
        // Draw fin
        ctx.beginPath();
        ctx.rect(-finWidth/2, 0, finWidth, finHeight);
        ctx.fillStyle = '#66CCFF';
        ctx.fill();
        
        ctx.restore();
    }
}

function drawStarGrain(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Draw cross-section
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = width * 0.4;
    const pointCount = 5;
    const innerRadius = width * 0.15;
    const pointDepth = width * 0.15;
    
    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#66CCFF';
    ctx.fill();
    
    // Draw star perforation
    ctx.beginPath();
    ctx.moveTo(centerX + innerRadius, centerY);
    
    for (let i = 0; i < pointCount; i++) {
        const angle1 = (i * 2 * Math.PI) / pointCount;
        const angle2 = ((i + 0.5) * 2 * Math.PI) / pointCount;
        const nextAngle = ((i + 1) * 2 * Math.PI) / pointCount;
        
        const x1 = centerX + innerRadius * Math.cos(angle1);
        const y1 = centerY + innerRadius * Math.sin(angle1);
        
        const x2 = centerX + (innerRadius - pointDepth) * Math.cos(angle2);
        const y2 = centerY + (innerRadius - pointDepth) * Math.sin(angle2);
        
        const x3 = centerX + innerRadius * Math.cos(nextAngle);
        const y3 = centerY + innerRadius * Math.sin(nextAngle);
        
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
    }
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
}

function drawMoonburnerGrain(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Draw cross-section
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = width * 0.4;
    const innerRadius = width * 0.15;
    const offset = width * 0.15;
    
    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#66CCFF';
    ctx.fill();
    
    // Draw inner circle (offset perforation)
    ctx.beginPath();
    ctx.arc(centerX + offset, centerY, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
}

function drawRodAndTubeGrain(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Draw cross-section
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = width * 0.4;
    const innerRadius = width * 0.25;
    const rodRadius = width * 0.1;
    
    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#66CCFF';
    ctx.fill();
    
    // Draw inner circle (tube perforation)
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    
    // Draw rod in center
    ctx.beginPath();
    ctx.arc(centerX, centerY, rodRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#66CCFF';
    ctx.fill();
}

function drawEndburnerGrain(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Draw longitudinal view for end burner
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width * 0.3;
    const length = height * 0.6;
    
    // Draw cylinder
    ctx.beginPath();
    ctx.rect(centerX - radius, centerY - length/2, radius * 2, length);
    ctx.fillStyle = '#66CCFF';
    ctx.fill();
    
    // Draw burning end
    ctx.beginPath();
    ctx.rect(centerX - radius, centerY + length/2 - 10, radius * 2, 10);
    ctx.fillStyle = '#FF6666';
    ctx.fill();
}

function drawCustomGrain(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Draw placeholder for custom grain
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Draw outer circle with dashed line
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.arc(centerX, centerY, width * 0.4, 0, Math.PI * 2);
    ctx.strokeStyle = '#66CCFF';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw custom shape icon
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.moveTo(centerX - 30, centerY - 30);
    ctx.lineTo(centerX + 30, centerY - 10);
    ctx.lineTo(centerX, centerY + 30);
    ctx.lineTo(centerX - 30, centerY - 30);
    ctx.fillStyle = '#66CCFF';
    ctx.fill();
    
    // Add DXF text
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('DXF Import', centerX, centerY - 40);
} 