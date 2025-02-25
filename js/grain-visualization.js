// Grain Visualization Module for OpenMotor Web
// Provides detailed visualization of different grain geometries

document.addEventListener('DOMContentLoaded', function() {
    // Get canvas and context
    const grainCanvas = document.getElementById('grain-canvas');
    let grainCtx = grainCanvas ? grainCanvas.getContext('2d') : null;
    
    // Current visualization state
    let currentTime = 0;
    let currentBurnRegression = 0;
    let simulationData = null;
    let grainParameters = {};
    let viewMode = 'cross-section'; // 'cross-section' or 'longitudinal'
    
    // Initialize the visualization
    function initialize() {
        if (!grainCanvas) return;
        
        // Resize canvas to fit container
        resizeCanvas();
        
        // Draw empty state
        drawEmptyState();
        
        // Add view mode toggle if it exists
        const viewToggle = document.getElementById('grain-view-toggle');
        if (viewToggle) {
            viewToggle.addEventListener('change', function() {
                viewMode = this.checked ? 'longitudinal' : 'cross-section';
                updateVisualization();
            });
        }
        
        // Add window resize listener
        window.addEventListener('resize', function() {
            resizeCanvas();
            updateVisualization();
        });
    }
    
    // Resize canvas to fit container
    function resizeCanvas() {
        if (!grainCanvas) return;
        
        const container = grainCanvas.parentElement;
        const containerWidth = container.clientWidth;
        
        grainCanvas.width = containerWidth;
        grainCanvas.height = containerWidth * 0.75; // 4:3 aspect ratio
    }
    
    // Draw empty state when no simulation is running
    function drawEmptyState() {
        if (!grainCtx) return;
        
        const width = grainCanvas.width;
        const height = grainCanvas.height;
        
        // Clear canvas
        grainCtx.clearRect(0, 0, width, height);
        
        // Set colors based on theme
        const isDarkMode = document.body.classList.contains('dark-mode');
        const textColor = isDarkMode ? '#F0F0F0' : '#333333';
        
        // Draw placeholder text
        grainCtx.fillStyle = textColor;
        grainCtx.font = '16px "Open Sans", Arial, sans-serif';
        grainCtx.textAlign = 'center';
        grainCtx.textBaseline = 'middle';
        grainCtx.fillText('Run simulation to view grain regression', width / 2, height / 2);
        
        // Draw hint text
        grainCtx.font = '14px "Open Sans", Arial, sans-serif';
        grainCtx.fillText('Configure grain parameters in the input section', width / 2, height / 2 + 30);
    }
    
    // Set simulation data for visualization
    function setSimulationData(data) {
        simulationData = data;
        
        // Get current grain parameters
        updateGrainParameters();
        
        // Setup time slider
        setupTimeSlider();
        
        // Initial visualization
        currentTime = 0;
        currentBurnRegression = 0;
        updateVisualization();
    }
    
    // Update grain parameters from form inputs
    function updateGrainParameters() {
        const grainShape = document.getElementById('grain-shape').value;
        
        grainParameters = {
            shape: grainShape
        };
        
        // Get shape-specific parameters
        switch (grainShape) {
            case 'bates':
                grainParameters.outerDiameter = parseFloat(document.getElementById('bates-outer-diameter').value) || 100;
                grainParameters.innerDiameter = parseFloat(document.getElementById('bates-inner-diameter').value) || 40;
                grainParameters.length = parseFloat(document.getElementById('bates-length').value) || 150;
                grainParameters.segments = parseInt(document.getElementById('bates-segments').value) || 1;
                break;
                
            case 'finocyl':
                // Add Finocyl specific parameters when implemented
                break;
                
            case 'star':
                // Add Star specific parameters when implemented
                break;
                
            case 'custom':
                // Custom grain parameters would come from DXF file
                break;
        }
    }
    
    // Setup time slider for visualization
    function setupTimeSlider() {
        const timeSlider = document.getElementById('time-slider');
        const timeDisplay = document.getElementById('time-display');
        
        if (!timeSlider || !simulationData || !simulationData.time || simulationData.time.length === 0) return;
        
        // Set slider range
        timeSlider.min = 0;
        timeSlider.max = simulationData.time.length - 1;
        timeSlider.value = 0;
        timeSlider.disabled = false;
        
        // Update time display
        if (timeDisplay) {
            timeDisplay.textContent = '0.00s';
        }
        
        // Add slider event listener
        timeSlider.addEventListener('input', function() {
            const timeIndex = parseInt(this.value);
            currentTime = simulationData.time[timeIndex];
            
            // Calculate burn regression based on time
            // In a real simulation, this would come from actual burn calculations
            // For now, we'll use a simplified model
            const burnRate = 2; // mm/s (example value)
            currentBurnRegression = currentTime * burnRate;
            
            // Update time display
            if (timeDisplay) {
                timeDisplay.textContent = currentTime.toFixed(2) + 's';
            }
            
            // Update visualization
            updateVisualization();
        });
    }
    
    // Update the visualization based on current time and parameters
    function updateVisualization() {
        if (!grainCtx || !grainParameters.shape) return;
        
        const width = grainCanvas.width;
        const height = grainCanvas.height;
        
        // Clear canvas
        grainCtx.clearRect(0, 0, width, height);
        
        // Set colors based on theme
        const isDarkMode = document.body.classList.contains('dark-mode');
        const colors = {
            primary: isDarkMode ? '#66CCFF' : '#003366',
            secondary: isDarkMode ? '#003366' : '#66CCFF',
            background: isDarkMode ? '#222222' : '#FFFFFF',
            text: isDarkMode ? '#F0F0F0' : '#333333',
            burned: isDarkMode ? '#444444' : '#EEEEEE'
        };
        
        // Draw based on grain type and view mode
        switch (grainParameters.shape) {
            case 'bates':
                if (viewMode === 'cross-section') {
                    drawBatesCrossSection(colors);
                } else {
                    drawBatesLongitudinal(colors);
                }
                break;
                
            case 'finocyl':
                if (viewMode === 'cross-section') {
                    drawFinocylCrossSection(colors);
                } else {
                    drawFinocylLongitudinal(colors);
                }
                break;
                
            case 'star':
                if (viewMode === 'cross-section') {
                    drawStarCrossSection(colors);
                } else {
                    drawStarLongitudinal(colors);
                }
                break;
                
            case 'custom':
                drawCustomGrain(colors);
                break;
                
            default:
                drawEmptyState();
        }
        
        // Draw legend
        drawLegend(colors);
    }
    
    // Draw BATES grain cross-section
    function drawBatesCrossSection(colors) {
        if (!grainCtx) return;
        
        const width = grainCanvas.width;
        const height = grainCanvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Get parameters
        const outerDiameter = grainParameters.outerDiameter;
        const innerDiameter = grainParameters.innerDiameter;
        
        // Calculate new inner diameter after burn
        const newInnerDiameter = Math.min(outerDiameter, innerDiameter + 2 * currentBurnRegression);
        
        // Calculate scale to fit in canvas
        const scale = Math.min(width, height) * 0.8 / outerDiameter;
        
        // Draw outer circle
        grainCtx.beginPath();
        grainCtx.arc(centerX, centerY, outerDiameter * scale / 2, 0, Math.PI * 2);
        grainCtx.fillStyle = colors.primary;
        grainCtx.fill();
        
        // Draw inner circle (if not completely burned through)
        if (newInnerDiameter < outerDiameter) {
            grainCtx.beginPath();
            grainCtx.arc(centerX, centerY, newInnerDiameter * scale / 2, 0, Math.PI * 2);
            grainCtx.fillStyle = colors.background;
            grainCtx.fill();
        }
        
        // Draw original inner circle as dashed line
        grainCtx.beginPath();
        grainCtx.arc(centerX, centerY, innerDiameter * scale / 2, 0, Math.PI * 2);
        grainCtx.strokeStyle = colors.secondary;
        grainCtx.setLineDash([5, 5]);
        grainCtx.stroke();
        grainCtx.setLineDash([]);
        
        // Draw dimension lines
        drawDimensionLines(centerX, centerY, innerDiameter * scale / 2, newInnerDiameter * scale / 2, 
                          outerDiameter * scale / 2, colors);
    }
    
    // Draw BATES grain longitudinal view
    function drawBatesLongitudinal(colors) {
        if (!grainCtx) return;
        
        const width = grainCanvas.width;
        const height = grainCanvas.height;
        const centerY = height / 2;
        
        // Get parameters
        const outerDiameter = grainParameters.outerDiameter;
        const innerDiameter = grainParameters.innerDiameter;
        const grainLength = grainParameters.length;
        const segments = grainParameters.segments;
        
        // Calculate new inner diameter after burn
        const newInnerDiameter = Math.min(outerDiameter, innerDiameter + 2 * currentBurnRegression);
        
        // Calculate new grain length after burn (end faces burn too)
        const newLength = Math.max(0, grainLength - 2 * currentBurnRegression);
        
        // Calculate scale to fit in canvas
        const maxDimension = Math.max(outerDiameter, grainLength * segments);
        const scale = Math.min(width, height) * 0.8 / maxDimension;
        
        // Center position
        const totalLength = grainLength * segments;
        const startX = (width - totalLength * scale) / 2;
        
        // Draw segments
        const segmentSpacing = 5 * scale; // Space between segments
        let currentX = startX;
        
        for (let i = 0; i < segments; i++) {
            // Draw outer rectangle
            grainCtx.fillStyle = colors.primary;
            grainCtx.fillRect(
                currentX, 
                centerY - (outerDiameter * scale) / 2, 
                grainLength * scale, 
                outerDiameter * scale
            );
            
            // Draw inner hole (original)
            grainCtx.fillStyle = colors.burned;
            grainCtx.fillRect(
                currentX, 
                centerY - (innerDiameter * scale) / 2, 
                grainLength * scale, 
                innerDiameter * scale
            );
            
            // Draw inner hole (after burn)
            grainCtx.fillStyle = colors.background;
            grainCtx.fillRect(
                currentX + currentBurnRegression * scale, 
                centerY - (newInnerDiameter * scale) / 2, 
                newLength * scale, 
                newInnerDiameter * scale
            );
            
            // Draw original inner rectangle as dashed line
            grainCtx.strokeStyle = colors.secondary;
            grainCtx.setLineDash([5, 5]);
            grainCtx.strokeRect(
                currentX, 
                centerY - (innerDiameter * scale) / 2, 
                grainLength * scale, 
                innerDiameter * scale
            );
            grainCtx.setLineDash([]);
            
            currentX += grainLength * scale + segmentSpacing;
        }
    }
    
    // Draw Finocyl grain cross-section
    function drawFinocylCrossSection(colors) {
        if (!grainCtx) return;
        
        const width = grainCanvas.width;
        const height = grainCanvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Get parameters
        const outerDiameter = grainParameters.outerDiameter;
        const innerDiameter = grainParameters.innerDiameter;
        const finCount = grainParameters.finCount || 6;
        const finHeight = grainParameters.finHeight || (outerDiameter - innerDiameter) / 2 * 0.7;
        const finWidth = grainParameters.finWidth || (Math.PI * innerDiameter / finCount) * 0.4;
        
        // Calculate new inner diameter after burn
        const newInnerDiameter = Math.min(outerDiameter, innerDiameter + 2 * currentBurnRegression);
        
        // Calculate new fin dimensions after burn
        const newFinHeight = Math.max(0, finHeight - currentBurnRegression);
        const newFinWidth = Math.max(0, finWidth - 2 * currentBurnRegression);
        
        // Calculate scale to fit in canvas
        const scale = Math.min(width, height) * 0.8 / outerDiameter;
        
        // Draw outer circle
        grainCtx.beginPath();
        grainCtx.arc(centerX, centerY, outerDiameter * scale / 2, 0, Math.PI * 2);
        grainCtx.fillStyle = colors.primary;
        grainCtx.fill();
        
        // Draw inner circle (if not completely burned through)
        if (newInnerDiameter < outerDiameter) {
            grainCtx.beginPath();
            grainCtx.arc(centerX, centerY, newInnerDiameter * scale / 2, 0, Math.PI * 2);
            grainCtx.fillStyle = colors.background;
            grainCtx.fill();
            
            // Draw fins if they still exist
            if (newFinHeight > 0 && newFinWidth > 0) {
                for (let i = 0; i < finCount; i++) {
                    const angle = (i / finCount) * 2 * Math.PI;
                    
                    // Calculate fin points
                    const innerRadius = newInnerDiameter * scale / 2;
                    const outerRadius = innerRadius + newFinHeight * scale;
                    const halfWidth = newFinWidth * scale / 2;
                    
                    // Draw fin
                    grainCtx.beginPath();
                    grainCtx.moveTo(
                        centerX + innerRadius * Math.cos(angle - halfWidth / innerRadius),
                        centerY + innerRadius * Math.sin(angle - halfWidth / innerRadius)
                    );
                    grainCtx.lineTo(
                        centerX + outerRadius * Math.cos(angle),
                        centerY + outerRadius * Math.sin(angle)
                    );
                    grainCtx.lineTo(
                        centerX + innerRadius * Math.cos(angle + halfWidth / innerRadius),
                        centerY + innerRadius * Math.sin(angle + halfWidth / innerRadius)
                    );
                    grainCtx.closePath();
                    grainCtx.fillStyle = colors.primary;
                    grainCtx.fill();
                }
            }
        }
        
        // Draw dimension lines
        const outerRadius = outerDiameter * scale / 2;
        const innerRadius = innerDiameter * scale / 2;
        const burnedRadius = newInnerDiameter * scale / 2;
        
        drawDimensionLines(centerX, centerY, innerRadius, burnedRadius, outerRadius, colors);
        
        // Draw fin dimension if fins exist
        if (newFinHeight > 0) {
            // Draw fin height dimension
            const angle = 0; // Use first fin for dimension
            const innerR = newInnerDiameter * scale / 2;
            const outerR = innerR + newFinHeight * scale;
            
            grainCtx.beginPath();
            grainCtx.moveTo(centerX + innerR, centerY);
            grainCtx.lineTo(centerX + outerR, centerY);
            grainCtx.strokeStyle = colors.secondary;
            grainCtx.stroke();
            
            // Fin height label
            grainCtx.fillStyle = colors.text;
            grainCtx.font = '12px "Open Sans", Arial, sans-serif';
            grainCtx.textAlign = 'center';
            grainCtx.textBaseline = 'bottom';
            grainCtx.fillText(
                `Fin: ${newFinHeight.toFixed(1)}mm`, 
                centerX + (innerR + outerR) / 2, 
                centerY - 5
            );
        }
    }
    
    // Draw Finocyl grain longitudinal view
    function drawFinocylLongitudinal(colors) {
        if (!grainCtx) return;
        
        const width = grainCanvas.width;
        const height = grainCanvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Get parameters
        const outerDiameter = grainParameters.outerDiameter;
        const innerDiameter = grainParameters.innerDiameter;
        const grainLength = grainParameters.length;
        
        // Calculate burn regression
        const newInnerDiameter = Math.min(outerDiameter, innerDiameter + 2 * currentBurnRegression);
        const newLength = Math.max(0, grainLength - 2 * currentBurnRegression);
        
        // Calculate scale to fit in canvas
        const maxDimension = Math.max(outerDiameter, grainLength);
        const scale = Math.min(width, height) * 0.8 / maxDimension;
        
        // Draw outer rectangle (grain)
        const grainWidth = outerDiameter * scale;
        const grainHeight = newLength * scale;
        
        grainCtx.fillStyle = colors.primary;
        grainCtx.fillRect(
            centerX - grainWidth / 2,
            centerY - grainHeight / 2,
            grainWidth,
            grainHeight
        );
        
        // Draw inner hole (if not completely burned through)
        if (newInnerDiameter < outerDiameter) {
            const holeWidth = newInnerDiameter * scale;
            
            grainCtx.fillStyle = colors.background;
            grainCtx.fillRect(
                centerX - holeWidth / 2,
                centerY - grainHeight / 2,
                holeWidth,
                grainHeight
            );
        }
        
        // Draw dimension lines
        // Outer diameter
        grainCtx.beginPath();
        grainCtx.moveTo(centerX - grainWidth / 2, centerY + grainHeight / 2 + 20);
        grainCtx.lineTo(centerX + grainWidth / 2, centerY + grainHeight / 2 + 20);
        grainCtx.strokeStyle = colors.secondary;
        grainCtx.stroke();
        
        // Inner diameter
        if (newInnerDiameter < outerDiameter) {
            const holeWidth = newInnerDiameter * scale;
            
            grainCtx.beginPath();
            grainCtx.moveTo(centerX - holeWidth / 2, centerY + grainHeight / 2 + 40);
            grainCtx.lineTo(centerX + holeWidth / 2, centerY + grainHeight / 2 + 40);
            grainCtx.strokeStyle = colors.secondary;
            grainCtx.stroke();
        }
        
        // Length
        grainCtx.beginPath();
        grainCtx.moveTo(centerX + grainWidth / 2 + 20, centerY - grainHeight / 2);
        grainCtx.lineTo(centerX + grainWidth / 2 + 20, centerY + grainHeight / 2);
        grainCtx.strokeStyle = colors.secondary;
        grainCtx.stroke();
        
        // Labels
        grainCtx.fillStyle = colors.text;
        grainCtx.font = '12px "Open Sans", Arial, sans-serif';
        grainCtx.textAlign = 'center';
        
        // Outer diameter label
        grainCtx.textBaseline = 'top';
        grainCtx.fillText(
            `OD: ${outerDiameter.toFixed(1)}mm`,
            centerX,
            centerY + grainHeight / 2 + 25
        );
        
        // Inner diameter label
        if (newInnerDiameter < outerDiameter) {
            grainCtx.fillText(
                `ID: ${newInnerDiameter.toFixed(1)}mm`,
                centerX,
                centerY + grainHeight / 2 + 45
            );
        }
        
        // Length label
        grainCtx.textBaseline = 'middle';
        grainCtx.textAlign = 'left';
        grainCtx.fillText(
            `Length: ${newLength.toFixed(1)}mm`,
            centerX + grainWidth / 2 + 25,
            centerY
        );
    }
    
    // Draw Star grain cross-section (placeholder)
    function drawStarCrossSection(colors) {
        if (!grainCtx) return;
        
        const width = grainCanvas.width;
        const height = grainCanvas.height;
        
        // Placeholder message
        grainCtx.fillStyle = colors.text;
        grainCtx.font = '16px "Open Sans", Arial, sans-serif';
        grainCtx.textAlign = 'center';
        grainCtx.textBaseline = 'middle';
        grainCtx.fillText('Star grain visualization coming soon', width / 2, height / 2);
    }
    
    // Draw Star grain longitudinal view (placeholder)
    function drawStarLongitudinal(colors) {
        if (!grainCtx) return;
        
        const width = grainCanvas.width;
        const height = grainCanvas.height;
        
        // Placeholder message
        grainCtx.fillStyle = colors.text;
        grainCtx.font = '16px "Open Sans", Arial, sans-serif';
        grainCtx.textAlign = 'center';
        grainCtx.textBaseline = 'middle';
        grainCtx.fillText('Star longitudinal view coming soon', width / 2, height / 2);
    }
    
    // Draw Custom grain (placeholder)
    function drawCustomGrain(colors) {
        if (!grainCtx) return;
        
        const width = grainCanvas.width;
        const height = grainCanvas.height;
        
        // Placeholder message
        grainCtx.fillStyle = colors.text;
        grainCtx.font = '16px "Open Sans", Arial, sans-serif';
        grainCtx.textAlign = 'center';
        grainCtx.textBaseline = 'middle';
        grainCtx.fillText('Custom grain visualization requires DXF upload', width / 2, height / 2);
    }
    
    // Draw dimension lines for cross-section view
    function drawDimensionLines(centerX, centerY, innerRadius, burnedRadius, outerRadius, colors) {
        if (!grainCtx) return;
        
        // Draw dimension line from center to inner radius
        grainCtx.beginPath();
        grainCtx.moveTo(centerX, centerY);
        grainCtx.lineTo(centerX + innerRadius, centerY);
        grainCtx.strokeStyle = colors.secondary;
        grainCtx.stroke();
        
        // Draw dimension line from inner radius to burned radius
        if (burnedRadius > innerRadius) {
            grainCtx.beginPath();
            grainCtx.moveTo(centerX + innerRadius, centerY);
            grainCtx.lineTo(centerX + burnedRadius, centerY);
            grainCtx.strokeStyle = colors.burned;
            grainCtx.stroke();
        }
        
        // Draw dimension line from burned radius to outer radius
        grainCtx.beginPath();
        grainCtx.moveTo(centerX + burnedRadius, centerY);
        grainCtx.lineTo(centerX + outerRadius, centerY);
        grainCtx.strokeStyle = colors.primary;
        grainCtx.stroke();
        
        // Draw dimension labels
        grainCtx.fillStyle = colors.text;
        grainCtx.font = '12px "Open Sans", Arial, sans-serif';
        grainCtx.textAlign = 'center';
        grainCtx.textBaseline = 'bottom';
        
        // Inner diameter label
        grainCtx.fillText(
            `ID: ${grainParameters.innerDiameter.toFixed(1)}mm`, 
            centerX + innerRadius / 2, 
            centerY - 5
        );
        
        // Burned diameter label
        if (burnedRadius > innerRadius) {
            grainCtx.fillText(
                `Burned: ${(burnedRadius * 2 / outerRadius * grainParameters.outerDiameter).toFixed(1)}mm`, 
                centerX + (innerRadius + burnedRadius) / 2, 
                centerY - 5
            );
        }
        
        // Outer diameter label
        grainCtx.fillText(
            `OD: ${grainParameters.outerDiameter.toFixed(1)}mm`, 
            centerX + (burnedRadius + outerRadius) / 2, 
            centerY - 5
        );
    }
    
    // Draw legend with burn information
    function drawLegend(colors) {
        if (!grainCtx) return;
        
        const width = grainCanvas.width;
        const height = grainCanvas.height;
        
        // Draw legend in bottom right
        const legendX = width - 160;
        const legendY = height - 100;
        const legendWidth = 150;
        const legendHeight = 90;
        
        // Legend background
        grainCtx.fillStyle = colors.background;
        grainCtx.globalAlpha = 0.8;
        grainCtx.fillRect(legendX, legendY, legendWidth, legendHeight);
        grainCtx.globalAlpha = 1.0;
        
        // Legend border
        grainCtx.strokeStyle = colors.text;
        grainCtx.lineWidth = 1;
        grainCtx.strokeRect(legendX, legendY, legendWidth, legendHeight);
        
        // Legend title
        grainCtx.fillStyle = colors.text;
        grainCtx.font = 'bold 12px "Open Sans", Arial, sans-serif';
        grainCtx.textAlign = 'left';
        grainCtx.fillText('Burn Progress:', legendX + 10, legendY + 20);
        
        // Burn regression value
        grainCtx.font = '12px "Open Sans", Arial, sans-serif';
        grainCtx.fillText(`Regression: ${currentBurnRegression.toFixed(1)} mm`, legendX + 10, legendY + 40);
        
        // Time value
        grainCtx.fillText(`Time: ${currentTime.toFixed(2)} s`, legendX + 10, legendY + 60);
        
        // View mode
        grainCtx.fillText(`View: ${viewMode === 'cross-section' ? 'Cross-section' : 'Longitudinal'}`, legendX + 10, legendY + 80);
    }
    
    // Reset visualization
    function reset() {
        currentTime = 0;
        currentBurnRegression = 0;
        simulationData = null;
        
        // Reset time slider
        const timeSlider = document.getElementById('time-slider');
        const timeDisplay = document.getElementById('time-display');
        
        if (timeSlider) {
            timeSlider.value = 0;
            timeSlider.disabled = true;
        }
        
        if (timeDisplay) {
            timeDisplay.textContent = '0.00s';
        }
        
        // Draw empty state
        drawEmptyState();
    }
    
    // Initialize on load
    initialize();
    
    // Export functions for use in other modules
    window.grainVisualization = {
        setSimulationData: setSimulationData,
        updateVisualization: updateVisualization,
        reset: reset
    };
}); 