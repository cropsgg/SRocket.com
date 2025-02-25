// Graphing functionality for OpenMotor Web
// Uses Chart.js for visualization

document.addEventListener('DOMContentLoaded', function() {
    // Chart configuration and setup
    let thrustChart = null;
    let pressureChart = null;
    let grainCanvas = document.getElementById('grain-canvas');
    let grainCtx = grainCanvas ? grainCanvas.getContext('2d') : null;
    
    // Colors for charts (matching our design system)
    const chartColors = {
        primary: '#003366',
        secondary: '#66CCFF',
        grid: '#CCCCCC',
        text: '#333333'
    };
    
    // Dark mode colors
    const darkModeChartColors = {
        primary: '#66CCFF',
        secondary: '#003366',
        grid: '#555555',
        text: '#F0F0F0'
    };
    
    // Initialize charts when the page loads
    initializeCharts();
    
    // Listen for dark mode changes to update chart styles
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            const isDarkMode = document.body.classList.contains('dark-mode');
            updateChartStyles(isDarkMode);
        });
    }
    
    // Initialize empty charts
    function initializeCharts() {
        const thrustCanvas = document.getElementById('thrust-graph');
        const pressureCanvas = document.getElementById('pressure-graph');
        
        if (thrustCanvas) {
            const thrustCtx = thrustCanvas.getContext('2d');
            thrustChart = new Chart(thrustCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Thrust',
                        data: [],
                        borderColor: chartColors.primary,
                        backgroundColor: hexToRgba(chartColors.primary, 0.1),
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: chartColors.secondary,
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: createChartOptions('Thrust vs Time', 'Time (s)', 'Thrust (N)')
            });
        }
        
        if (pressureCanvas) {
            const pressureCtx = pressureCanvas.getContext('2d');
            pressureChart = new Chart(pressureCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Chamber Pressure',
                        data: [],
                        borderColor: chartColors.secondary,
                        backgroundColor: hexToRgba(chartColors.secondary, 0.1),
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: chartColors.primary,
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: createChartOptions('Pressure vs Time', 'Time (s)', 'Pressure (MPa)')
            });
        }
        
        // Initialize grain visualization canvas
        if (grainCanvas) {
            resizeCanvas(grainCanvas);
            drawEmptyGrain();
        }
    }
    
    // Create standard chart options
    function createChartOptions(title, xLabel, yLabel) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 16,
                        family: "'Open Sans', Arial, sans-serif"
                    },
                    color: chartColors.text,
                    padding: 20
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: hexToRgba(chartColors.primary, 0.8),
                    titleFont: {
                        family: "'Open Sans', Arial, sans-serif"
                    },
                    bodyFont: {
                        family: "'Open Sans', Arial, sans-serif"
                    },
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y.toFixed(2);
                                if (context.dataset.label === 'Thrust') {
                                    label += ' N';
                                } else if (context.dataset.label === 'Chamber Pressure') {
                                    label += ' MPa';
                                }
                            }
                            return label;
                        }
                    }
                },
                legend: {
                    display: false
                },
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy',
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy',
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: xLabel,
                        color: chartColors.text,
                        font: {
                            family: "'Open Sans', Arial, sans-serif",
                            size: 14
                        }
                    },
                    grid: {
                        color: chartColors.grid
                    },
                    ticks: {
                        color: chartColors.text,
                        font: {
                            family: "'Open Sans', Arial, sans-serif"
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: yLabel,
                        color: chartColors.text,
                        font: {
                            family: "'Open Sans', Arial, sans-serif",
                            size: 14
                        }
                    },
                    grid: {
                        color: chartColors.grid
                    },
                    ticks: {
                        color: chartColors.text,
                        font: {
                            family: "'Open Sans', Arial, sans-serif"
                        }
                    }
                }
            },
            animation: {
                duration: 1000
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        };
    }
    
    // Update chart data with simulation results
    function updateCharts(data) {
        if (!data || !data.time) return;
        
        // Update thrust chart
        if (thrustChart) {
            thrustChart.data.labels = data.time;
            thrustChart.data.datasets[0].data = data.thrust;
            
            // Update y-axis label based on unit selection
            const unitToggle = document.getElementById('unit-toggle');
            const thrustUnit = unitToggle && unitToggle.checked ? 'lbf' : 'N';
            thrustChart.options.scales.y.title.text = `Thrust (${thrustUnit})`;
            
            thrustChart.update();
        }
        
        // Update pressure chart
        if (pressureChart) {
            pressureChart.data.labels = data.time;
            pressureChart.data.datasets[0].data = data.pressure;
            
            // Update y-axis label based on unit selection
            const unitToggle = document.getElementById('unit-toggle');
            const pressureUnit = unitToggle && unitToggle.checked ? 'psi' : 'MPa';
            pressureChart.options.scales.y.title.text = `Pressure (${pressureUnit})`;
            
            pressureChart.update();
        }
        
        // Setup time slider for grain visualization
        setupTimeSlider(data);
    }
    
    // Clear chart data
    function clearCharts() {
        if (thrustChart) {
            thrustChart.data.labels = [];
            thrustChart.data.datasets[0].data = [];
            thrustChart.update();
        }
        
        if (pressureChart) {
            pressureChart.data.labels = [];
            pressureChart.data.datasets[0].data = [];
            pressureChart.update();
        }
        
        // Reset grain visualization
        if (grainCanvas) {
            drawEmptyGrain();
        }
        
        // Reset time slider
        const timeSlider = document.getElementById('time-slider');
        const timeDisplay = document.getElementById('time-display');
        if (timeSlider) {
            timeSlider.value = 0;
            timeSlider.max = 100;
            timeSlider.disabled = true;
        }
        if (timeDisplay) {
            timeDisplay.textContent = '0.00s';
        }
    }
    
    // Update chart styles for dark mode
    function updateChartStyles(isDarkMode) {
        const colors = isDarkMode ? darkModeChartColors : chartColors;
        
        if (thrustChart) {
            thrustChart.data.datasets[0].borderColor = colors.primary;
            thrustChart.data.datasets[0].backgroundColor = hexToRgba(colors.primary, 0.1);
            thrustChart.data.datasets[0].pointHoverBackgroundColor = colors.secondary;
            
            thrustChart.options.plugins.title.color = colors.text;
            thrustChart.options.plugins.tooltip.backgroundColor = hexToRgba(colors.primary, 0.8);
            
            thrustChart.options.scales.x.grid.color = colors.grid;
            thrustChart.options.scales.y.grid.color = colors.grid;
            thrustChart.options.scales.x.ticks.color = colors.text;
            thrustChart.options.scales.y.ticks.color = colors.text;
            thrustChart.options.scales.x.title.color = colors.text;
            thrustChart.options.scales.y.title.color = colors.text;
            
            thrustChart.update();
        }
        
        if (pressureChart) {
            pressureChart.data.datasets[0].borderColor = colors.secondary;
            pressureChart.data.datasets[0].backgroundColor = hexToRgba(colors.secondary, 0.1);
            pressureChart.data.datasets[0].pointHoverBackgroundColor = colors.primary;
            
            pressureChart.options.plugins.title.color = colors.text;
            pressureChart.options.plugins.tooltip.backgroundColor = hexToRgba(colors.secondary, 0.8);
            
            pressureChart.options.scales.x.grid.color = colors.grid;
            pressureChart.options.scales.y.grid.color = colors.grid;
            pressureChart.options.scales.x.ticks.color = colors.text;
            pressureChart.options.scales.y.ticks.color = colors.text;
            pressureChart.options.scales.x.title.color = colors.text;
            pressureChart.options.scales.y.title.color = colors.text;
            
            pressureChart.update();
        }
        
        // Redraw grain visualization with new colors
        if (grainCanvas) {
            drawGrainAtTime(currentGrainTime);
        }
    }
    
    // Setup time slider for grain visualization
    let currentGrainTime = 0;
    function setupTimeSlider(data) {
        const timeSlider = document.getElementById('time-slider');
        const timeDisplay = document.getElementById('time-display');
        
        if (timeSlider && data && data.time && data.time.length > 0) {
            const maxTime = data.time[data.time.length - 1];
            
            timeSlider.max = data.time.length - 1;
            timeSlider.disabled = false;
            
            timeSlider.addEventListener('input', function() {
                const timeIndex = parseInt(this.value);
                const time = data.time[timeIndex];
                currentGrainTime = time;
                
                if (timeDisplay) {
                    timeDisplay.textContent = time.toFixed(2) + 's';
                }
                
                // Update grain visualization for this time
                drawGrainAtTime(time);
            });
        }
    }
    
    // Grain visualization functions
    function resizeCanvas(canvas) {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientWidth * 0.75; // 4:3 aspect ratio
    }
    
    function drawEmptyGrain() {
        if (!grainCtx) return;
        
        const width = grainCanvas.width;
        const height = grainCanvas.height;
        
        // Clear canvas
        grainCtx.clearRect(0, 0, width, height);
        
        // Draw placeholder text
        grainCtx.fillStyle = document.body.classList.contains('dark-mode') ? 
            darkModeChartColors.text : chartColors.text;
        grainCtx.font = '16px "Open Sans", Arial, sans-serif';
        grainCtx.textAlign = 'center';
        grainCtx.textBaseline = 'middle';
        grainCtx.fillText('Run simulation to view grain regression', width / 2, height / 2);
    }
    
    function drawGrainAtTime(time) {
        if (!grainCtx) return;
        
        const width = grainCanvas.width;
        const height = grainCanvas.height;
        
        // Get grain shape and parameters
        const grainShape = document.getElementById('grain-shape').value;
        
        // Clear canvas
        grainCtx.clearRect(0, 0, width, height);
        
        // Set colors based on theme
        const isDarkMode = document.body.classList.contains('dark-mode');
        const colors = isDarkMode ? darkModeChartColors : chartColors;
        
        // Draw based on grain type
        switch (grainShape) {
            case 'bates':
                drawBatesGrain(time, colors);
                break;
            case 'finocyl':
                drawFinocylGrain(time, colors);
                break;
            case 'star':
                drawStarGrain(time, colors);
                break;
            case 'custom':
                drawCustomGrain(time, colors);
                break;
            default:
                drawEmptyGrain();
        }
    }
    
    function drawBatesGrain(time, colors) {
        if (!grainCtx) return;
        
        const width = grainCanvas.width;
        const height = grainCanvas.height;
        
        // Get BATES parameters
        const outerDiameter = parseFloat(document.getElementById('bates-outer-diameter').value) || 100;
        const innerDiameter = parseFloat(document.getElementById('bates-inner-diameter').value) || 40;
        const grainLength = parseFloat(document.getElementById('bates-length').value) || 150;
        const segments = parseInt(document.getElementById('bates-segments').value) || 1;
        
        // Calculate burn regression (simplified model)
        // In a real simulation, this would come from the actual burn calculation
        const burnRate = 2; // mm/s (example value)
        const burnRegression = time * burnRate;
        
        // Calculate new inner diameter after burn
        const newInnerDiameter = Math.min(outerDiameter, innerDiameter + 2 * burnRegression);
        
        // Calculate new grain length after burn (end faces burn too)
        const newLength = Math.max(0, grainLength - 2 * burnRegression);
        
        // Calculate scale to fit in canvas
        const maxDimension = Math.max(outerDiameter, grainLength * segments);
        const scale = Math.min(width, height) * 0.8 / maxDimension;
        
        // Center position
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Draw grain segments
        const segmentSpacing = 5 * scale; // Space between segments
        const totalSegmentsLength = newLength * segments + segmentSpacing * (segments - 1);
        let startX = centerX - totalSegmentsLength / 2;
        
        for (let i = 0; i < segments; i++) {
            // Draw outer cylinder
            grainCtx.fillStyle = colors.primary;
            grainCtx.beginPath();
            grainCtx.fillRect(
                startX, 
                centerY - (outerDiameter * scale) / 2, 
                newLength * scale, 
                outerDiameter * scale
            );
            
            // Draw inner hole (if not completely burned through)
            if (newInnerDiameter < outerDiameter) {
                grainCtx.fillStyle = document.body.classList.contains('dark-mode') ? 
                    '#222222' : '#FFFFFF';
                grainCtx.beginPath();
                grainCtx.fillRect(
                    startX, 
                    centerY - (newInnerDiameter * scale) / 2, 
                    newLength * scale, 
                    newInnerDiameter * scale
                );
            }
            
            startX += newLength * scale + segmentSpacing;
        }
        
        // Draw legend
        drawGrainLegend(colors, burnRegression);
    }
    
    function drawFinocylGrain(time, colors) {
        if (!grainCtx) return;
        
        // Placeholder for Finocyl grain visualization
        const width = grainCanvas.width;
        const height = grainCanvas.height;
        
        grainCtx.fillStyle = colors.text;
        grainCtx.font = '16px "Open Sans", Arial, sans-serif';
        grainCtx.textAlign = 'center';
        grainCtx.textBaseline = 'middle';
        grainCtx.fillText('Finocyl grain visualization not yet implemented', width / 2, height / 2);
    }
    
    function drawStarGrain(time, colors) {
        if (!grainCtx) return;
        
        // Placeholder for Star grain visualization
        const width = grainCanvas.width;
        const height = grainCanvas.height;
        
        grainCtx.fillStyle = colors.text;
        grainCtx.font = '16px "Open Sans", Arial, sans-serif';
        grainCtx.textAlign = 'center';
        grainCtx.textBaseline = 'middle';
        grainCtx.fillText('Star grain visualization not yet implemented', width / 2, height / 2);
    }
    
    function drawCustomGrain(time, colors) {
        if (!grainCtx) return;
        
        // Placeholder for Custom grain visualization
        const width = grainCanvas.width;
        const height = grainCanvas.height;
        
        grainCtx.fillStyle = colors.text;
        grainCtx.font = '16px "Open Sans", Arial, sans-serif';
        grainCtx.textAlign = 'center';
        grainCtx.textBaseline = 'middle';
        grainCtx.fillText('Custom grain visualization requires DXF upload', width / 2, height / 2);
    }
    
    function drawGrainLegend(colors, burnRegression) {
        if (!grainCtx) return;
        
        const width = grainCanvas.width;
        const height = grainCanvas.height;
        
        // Draw legend in bottom right
        const legendX = width - 150;
        const legendY = height - 80;
        
        grainCtx.fillStyle = document.body.classList.contains('dark-mode') ? 
            'rgba(51, 51, 51, 0.8)' : 'rgba(240, 240, 240, 0.8)';
        grainCtx.fillRect(legendX, legendY, 140, 70);
        grainCtx.strokeStyle = colors.text;
        grainCtx.strokeRect(legendX, legendY, 140, 70);
        
        // Legend title
        grainCtx.fillStyle = colors.text;
        grainCtx.font = 'bold 12px "Open Sans", Arial, sans-serif';
        grainCtx.textAlign = 'left';
        grainCtx.fillText('Burn Progress:', legendX + 10, legendY + 20);
        
        // Burn regression value
        grainCtx.font = '12px "Open Sans", Arial, sans-serif';
        grainCtx.fillText(`Regression: ${burnRegression.toFixed(1)} mm`, legendX + 10, legendY + 40);
        
        // Time value
        grainCtx.fillText(`Time: ${currentGrainTime.toFixed(2)} s`, legendX + 10, legendY + 60);
    }
    
    // Helper function to convert hex color to rgba
    function hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (grainCanvas) {
            resizeCanvas(grainCanvas);
            drawGrainAtTime(currentGrainTime);
        }
    });
    
    // Export functions for use in other modules
    window.graphingModule = {
        updateCharts: updateCharts,
        clearCharts: clearCharts,
        updateChartStyles: updateChartStyles
    };
}); 