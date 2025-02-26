// Grain Visualization Module for SRocket Web
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
        
        // Set canvas resolution for better rendering
        const dpr = window.devicePixelRatio || 1;
        const rect = grainCanvas.getBoundingClientRect();
        
        grainCanvas.width = rect.width * dpr;
        grainCanvas.height = rect.height * dpr;
        grainCanvas.style.width = `${rect.width}px`;
        grainCanvas.style.height = `${rect.height}px`;
        
        grainCtx.scale(dpr, dpr);
        
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
        
        const dpr = window.devicePixelRatio || 1;
        const container = grainCanvas.parentElement;
        const containerWidth = container.clientWidth;
        
        grainCanvas.width = containerWidth * dpr;
        grainCanvas.height = (containerWidth * 0.75) * dpr;
        grainCanvas.style.width = `${containerWidth}px`;
        grainCanvas.style.height = `${containerWidth * 0.75}px`;
        
        grainCtx.scale(dpr, dpr);
    }
    
    // Draw empty state when no simulation is running
    function drawEmptyState() {
        if (!grainCtx) return;
        
        const width = grainCanvas.width / (window.devicePixelRatio || 1);
        const height = grainCanvas.height / (window.devicePixelRatio || 1);
        
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
                grainParameters.outerDiameter = parseFloat(document.getElementById('finocyl-outer-diameter').value) || 100;
                grainParameters.innerDiameter = parseFloat(document.getElementById('finocyl-inner-diameter').value) || 40;
                grainParameters.finCount = parseInt(document.getElementById('finocyl-fin-count').value) || 6;
                grainParameters.finWidth = parseFloat(document.getElementById('finocyl-fin-width').value) || 10;
                grainParameters.finHeight = parseFloat(document.getElementById('finocyl-fin-height').value) || 20;
                grainParameters.length = parseFloat(document.getElementById('finocyl-length').value) || 150;
                break;
                
            case 'star':
                grainParameters.outerDiameter = parseFloat(document.getElementById('star-outer-diameter').value) || 100;
                grainParameters.pointCount = parseInt(document.getElementById('star-point-count').value) || 5;
                grainParameters.pointDepth = parseFloat(document.getElementById('star-point-depth').value) || 30;
                grainParameters.pointAngle = parseFloat(document.getElementById('star-point-angle').value) || 60;
                grainParameters.length = parseFloat(document.getElementById('star-length').value) || 150;
                break;
        }
    }
    
    // Update the visualization based on current time and parameters
    function updateVisualization() {
        if (!grainCtx || !grainParameters.shape) return;
        
        const width = grainCanvas.width / (window.devicePixelRatio || 1);
        const height = grainCanvas.height / (window.devicePixelRatio || 1);
        
        // Clear canvas
        grainCtx.clearRect(0, 0, width, height);
        
        // Set colors based on theme
        const isDarkMode = document.body.classList.contains('dark-mode');
        const colors = {
            grain: isDarkMode ? '#66CCFF' : '#003366',
            burned: isDarkMode ? '#444444' : '#EEEEEE',
            text: isDarkMode ? '#F0F0F0' : '#333333',
            dimensions: isDarkMode ? '#88DDFF' : '#0055AA'
        };
        
        // Calculate grain geometry based on type
        let geometry;
        switch (grainParameters.shape) {
            case 'bates':
                geometry = GrainGeometry.calculateBATES(
                    grainParameters.outerDiameter,
                    grainParameters.innerDiameter,
                    grainParameters.length,
                    grainParameters.segments,
                    currentBurnRegression
                );
                break;
                
            case 'finocyl':
                geometry = GrainGeometry.calculateFinocyl(
                    grainParameters.outerDiameter,
                    grainParameters.innerDiameter,
                    grainParameters.finCount,
                    grainParameters.finWidth,
                    grainParameters.finHeight,
                    grainParameters.length,
                    currentBurnRegression
                );
                break;
                
            case 'star':
                geometry = GrainGeometry.calculateStar(
                    grainParameters.outerDiameter,
                    grainParameters.pointCount,
                    grainParameters.pointDepth,
                    grainParameters.pointAngle,
                    grainParameters.length,
                    currentBurnRegression
                );
                break;
        }
        
        // Draw based on grain type and view mode
        if (geometry) {
            const centerX = width / 2;
            const centerY = height / 2;
            const scale = Math.min(width, height) * 0.8 / grainParameters.outerDiameter;
            
            if (viewMode === 'cross-section') {
                drawCrossSection(centerX, centerY, scale, geometry, colors);
            } else {
                drawLongitudinal(centerX, centerY, scale, geometry, colors);
            }
            
            // Draw dimensions and labels
            drawDimensions(centerX, centerY, scale, geometry, colors);
        }
    }
    
    // Draw cross-section view
    function drawCrossSection(centerX, centerY, scale, geometry, colors) {
        const { outerDiameter, innerDiameter } = grainParameters;
        const { burnedRadius } = geometry;
        
        // Draw outer circle (grain boundary)
        grainCtx.beginPath();
        grainCtx.arc(centerX, centerY, (outerDiameter / 2) * scale, 0, Math.PI * 2);
        grainCtx.fillStyle = colors.grain;
        grainCtx.fill();
        
        // Draw burned area
        grainCtx.beginPath();
        grainCtx.arc(centerX, centerY, burnedRadius * scale, 0, Math.PI * 2);
        grainCtx.fillStyle = colors.burned;
        grainCtx.fill();
        
        // Draw grain pattern based on type
        switch (grainParameters.shape) {
            case 'finocyl':
                drawFinocylPattern(centerX, centerY, scale, colors);
                break;
            case 'star':
                drawStarPattern(centerX, centerY, scale, colors);
                break;
        }
    }
    
    // Draw longitudinal view
    function drawLongitudinal(centerX, centerY, scale, geometry, colors) {
        const { length } = grainParameters;
        const scaledLength = length * scale;
        const startX = centerX - scaledLength / 2;
        
        // Draw grain outline
        grainCtx.beginPath();
        grainCtx.rect(startX, centerY - (grainParameters.outerDiameter / 2) * scale,
                     scaledLength, grainParameters.outerDiameter * scale);
        grainCtx.fillStyle = colors.grain;
        grainCtx.fill();
        
        // Draw burned area
        if (geometry.burnedRadius > 0) {
            grainCtx.beginPath();
            grainCtx.rect(startX, centerY - geometry.burnedRadius * scale,
                         scaledLength, geometry.burnedRadius * 2 * scale);
            grainCtx.fillStyle = colors.burned;
            grainCtx.fill();
        }
        
        // Draw segments for BATES grains
        if (grainParameters.shape === 'bates' && grainParameters.segments > 1) {
            const segmentLength = scaledLength / grainParameters.segments;
            for (let i = 1; i < grainParameters.segments; i++) {
                const x = startX + i * segmentLength;
                grainCtx.beginPath();
                grainCtx.moveTo(x, centerY - (grainParameters.outerDiameter / 2) * scale);
                grainCtx.lineTo(x, centerY + (grainParameters.outerDiameter / 2) * scale);
                grainCtx.strokeStyle = colors.text;
                grainCtx.stroke();
            }
        }
    }
    
    // Draw dimensions and labels
    function drawDimensions(centerX, centerY, scale, geometry, colors) {
        const { outerDiameter, innerDiameter } = grainParameters;
        const { burnedRadius, webThickness } = geometry;
        
        grainCtx.strokeStyle = colors.dimensions;
        grainCtx.fillStyle = colors.text;
        grainCtx.font = '12px "Open Sans", Arial, sans-serif';
        
        if (viewMode === 'cross-section') {
            // Draw diameter lines and labels
            drawDimensionLine(centerX - outerDiameter * scale / 2, centerY,
                            centerX + outerDiameter * scale / 2, centerY,
                            `OD: ${outerDiameter.toFixed(1)} mm`);
            
            if (!geometry.isCompletelyBurned) {
                drawDimensionLine(centerX - burnedRadius * scale, centerY - 20,
                                centerX + burnedRadius * scale, centerY - 20,
                                `Burned: ${(burnedRadius * 2).toFixed(1)} mm`);
                
                // Draw web thickness
                const webLabel = `Web: ${webThickness.toFixed(1)} mm`;
                const textWidth = grainCtx.measureText(webLabel).width;
                grainCtx.fillText(webLabel, centerX - textWidth / 2, centerY + outerDiameter * scale / 2 + 30);
            }
        } else {
            // Draw length dimension
            const length = grainParameters.length;
            drawDimensionLine(centerX - length * scale / 2, centerY + outerDiameter * scale / 2 + 20,
                            centerX + length * scale / 2, centerY + outerDiameter * scale / 2 + 20,
                            `Length: ${length.toFixed(1)} mm`);
        }
    }
    
    // Helper function to draw dimension lines
    function drawDimensionLine(x1, y1, x2, y2, label) {
        const arrowSize = 5;
        
        // Draw line
        grainCtx.beginPath();
        grainCtx.moveTo(x1, y1);
        grainCtx.lineTo(x2, y2);
        grainCtx.stroke();
        
        // Draw arrows
        grainCtx.beginPath();
        grainCtx.moveTo(x1, y1);
        grainCtx.lineTo(x1 + arrowSize, y1 - arrowSize);
        grainCtx.moveTo(x1, y1);
        grainCtx.lineTo(x1 + arrowSize, y1 + arrowSize);
        grainCtx.stroke();
        
        grainCtx.beginPath();
        grainCtx.moveTo(x2, y2);
        grainCtx.lineTo(x2 - arrowSize, y2 - arrowSize);
        grainCtx.moveTo(x2, y2);
        grainCtx.lineTo(x2 - arrowSize, y2 + arrowSize);
        grainCtx.stroke();
        
        // Draw label
        const textWidth = grainCtx.measureText(label).width;
        grainCtx.fillText(label, (x1 + x2) / 2 - textWidth / 2, y1 - 10);
    }
    
    // Initialize visualization
    initialize();
    
    // Export functions for external use
    window.grainVisualization = {
        setSimulationData: function(data) {
            simulationData = data;
            updateGrainParameters();
            updateVisualization();
        },
        updateBurnRegression: function(regression) {
            currentBurnRegression = regression;
            updateVisualization();
        },
        reset: function() {
            currentTime = 0;
            currentBurnRegression = 0;
            simulationData = null;
            updateVisualization();
        }
    };
}); 