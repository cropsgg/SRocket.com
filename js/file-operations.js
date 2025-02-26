// File Operations Module for OpenMotor Web
// Handles saving and loading simulation configurations and results

document.addEventListener('DOMContentLoaded', function() {
    // Get file operation buttons
    const saveButton = document.getElementById('save-simulation');
    const loadButton = document.getElementById('load-simulation');
    const exportButton = document.getElementById('export-results');
    
    // Add event listeners
    if (saveButton) {
        saveButton.addEventListener('click', saveSimulation);
    }
    
    if (loadButton) {
        loadButton.addEventListener('click', loadSimulation);
    }
    
    if (exportButton) {
        exportButton.addEventListener('click', exportResults);
    }
    
    // Save simulation configuration
    function saveSimulation() {
        // Collect all form data
        const simulationData = collectFormData();
        
        // Convert to JSON
        const jsonData = JSON.stringify(simulationData, null, 2);
        
        // Create blob and download link
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Create filename based on propellant name or default
        const propellantName = document.getElementById('propellant-name').value || 'simulation';
        const filename = `${propellantName.replace(/\s+/g, '_').toLowerCase()}_config.json`;
        
        // Trigger download
        downloadFile(url, filename);
        
        // Show success notification
        showNotification('Simulation configuration saved successfully', 'success');
    }
    
    // Load simulation configuration
    function loadSimulation() {
        // Create file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        
        // Handle file selection
        fileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    try {
                        // Parse JSON data
                        const simulationData = JSON.parse(event.target.result);
                        
                        // Populate form with loaded data
                        populateFormData(simulationData);
                        
                        // Show success notification
                        showNotification('Simulation configuration loaded successfully', 'success');
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                        showNotification('Error loading file: Invalid format', 'error');
                    }
                };
                
                reader.readAsText(file);
            }
        });
        
        // Trigger file selection dialog
        fileInput.click();
    }
    
    // Export simulation results
    function exportResults() {
        // Check if we have simulation results
        if (!window.simulationResults) {
            showNotification('No simulation results to export. Run a simulation first.', 'warning');
            return;
        }
        
        // Create export options dialog
        const dialog = document.createElement('div');
        dialog.className = 'export-dialog';
        dialog.innerHTML = `
            <div class="export-dialog-content">
                <h3>Export Results</h3>
                <p>Choose export format:</p>
                <div class="export-options">
                    <button id="export-csv" class="secondary-button">CSV</button>
                    <button id="export-json" class="secondary-button">JSON</button>
                    <button id="export-image" class="secondary-button">Graph Image</button>
                </div>
                <button id="close-dialog" class="text-button">Cancel</button>
            </div>
        `;
        
        // Add dialog to page
        appendToContainer(dialog);
        
        // Add event listeners to buttons
        document.getElementById('export-csv').addEventListener('click', function() {
            exportAsCSV();
            document.body.removeChild(dialog);
        });
        
        document.getElementById('export-json').addEventListener('click', function() {
            exportAsJSON();
            document.body.removeChild(dialog);
        });
        
        document.getElementById('export-image').addEventListener('click', function() {
            exportAsImage();
            document.body.removeChild(dialog);
        });
        
        document.getElementById('close-dialog').addEventListener('click', function() {
            document.body.removeChild(dialog);
        });
        
        // Close dialog when clicking outside
        dialog.addEventListener('click', function(e) {
            if (e.target === dialog) {
                document.body.removeChild(dialog);
            }
        });
    }
    
    // Export results as CSV
    function exportAsCSV() {
        const results = window.simulationResults;
        
        if (!results || !results.time || !results.thrust || !results.pressure) {
            showNotification('Invalid simulation results', 'error');
            return;
        }
        
        // Create CSV content
        let csvContent = 'Time (s),Thrust (N),Pressure (MPa)\n';
        
        for (let i = 0; i < results.time.length; i++) {
            csvContent += `${results.time[i]},${results.thrust[i]},${results.pressure[i]}\n`;
        }
        
        // Create blob and download link
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        
        // Create filename
        const propellantName = document.getElementById('propellant-name').value || 'simulation';
        const filename = `${propellantName.replace(/\s+/g, '_').toLowerCase()}_results.csv`;
        
        // Trigger download
        downloadFile(url, filename);
        
        showNotification('Results exported as CSV', 'success');
    }
    
    // Export results as JSON
    function exportAsJSON() {
        const results = window.simulationResults;
        
        if (!results) {
            showNotification('Invalid simulation results', 'error');
            return;
        }
        
        // Create JSON content
        const jsonContent = JSON.stringify(results, null, 2);
        
        // Create blob and download link
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Create filename
        const propellantName = document.getElementById('propellant-name').value || 'simulation';
        const filename = `${propellantName.replace(/\s+/g, '_').toLowerCase()}_results.json`;
        
        // Trigger download
        downloadFile(url, filename);
        
        showNotification('Results exported as JSON', 'success');
    }
    
    // Export graphs as images
    function exportAsImage() {
        // Create dialog to choose which graph to export
        const dialog = document.createElement('div');
        dialog.className = 'export-dialog';
        dialog.innerHTML = `
            <div class="export-dialog-content">
                <h3>Export Graph Image</h3>
                <p>Choose which graph to export:</p>
                <div class="export-options">
                    <button id="export-thrust" class="secondary-button">Thrust Graph</button>
                    <button id="export-pressure" class="secondary-button">Pressure Graph</button>
                </div>
                <button id="close-chart-dialog" class="text-button">Cancel</button>
            </div>
        `;
        
        // Add dialog to page
        appendToContainer(dialog);
        
        // Add event listeners
        document.getElementById('export-thrust').addEventListener('click', function() {
            if (window.thrustChart) {
                const url = window.thrustChart.toBase64Image();
                const propellantName = document.getElementById('propellant-name').value || 'simulation';
                const filename = `${propellantName.replace(/\s+/g, '_').toLowerCase()}_thrust.png`;
                
                // For data URLs, we need to create an anchor and click it
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                
                showNotification('Thrust graph exported as image', 'success');
            } else {
                showNotification('Thrust chart not available', 'error');
            }
            document.body.removeChild(dialog);
        });
        
        document.getElementById('export-pressure').addEventListener('click', function() {
            if (window.pressureChart) {
                const url = window.pressureChart.toBase64Image();
                const propellantName = document.getElementById('propellant-name').value || 'simulation';
                const filename = `${propellantName.replace(/\s+/g, '_').toLowerCase()}_pressure.png`;
                
                // For data URLs, we need to create an anchor and click it
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                
                showNotification('Pressure graph exported as image', 'success');
            } else {
                showNotification('Pressure chart not available', 'error');
            }
            document.body.removeChild(dialog);
        });
        
        document.getElementById('close-chart-dialog').addEventListener('click', function() {
            document.body.removeChild(dialog);
        });
        
        // Close dialog when clicking outside
        dialog.addEventListener('click', function(e) {
            if (e.target === dialog) {
                document.body.removeChild(dialog);
            }
        });
    }
    
    // Helper function to collect all form data
    function collectFormData() {
        const data = {
            propellant: {
                name: document.getElementById('propellant-name').value,
                density: parseFloat(document.getElementById('propellant-density').value),
                burnRateCoefficient: parseFloat(document.getElementById('burn-rate-coefficient').value),
                burnRateExponent: parseFloat(document.getElementById('burn-rate-exponent').value),
                specificHeatRatio: parseFloat(document.getElementById('specific-heat-ratio').value)
            },
            nozzle: {
                throatDiameter: parseFloat(document.getElementById('throat-diameter').value),
                exitDiameter: parseFloat(document.getElementById('exit-diameter').value),
                efficiency: parseFloat(document.getElementById('nozzle-efficiency').value)
            },
            grain: {
                type: document.getElementById('grain-shape').value
            },
            units: document.getElementById('unit-toggle').checked ? 'imperial' : 'metric'
        };
        
        // Add grain-specific parameters based on selected type
        switch (data.grain.type) {
            case 'bates':
                data.grain.outerDiameter = parseFloat(document.getElementById('bates-outer-diameter').value);
                data.grain.innerDiameter = parseFloat(document.getElementById('bates-inner-diameter').value);
                data.grain.length = parseFloat(document.getElementById('bates-length').value);
                data.grain.segments = parseInt(document.getElementById('bates-segments').value);
                break;
                
            case 'finocyl':
                // Add Finocyl parameters when implemented
                break;
                
            case 'star':
                // Add Star parameters when implemented
                break;
                
            case 'custom':
                // Custom grain parameters would come from DXF file
                break;
        }
        
        return data;
    }
    
    // Helper function to populate form with loaded data
    function populateFormData(data) {
        // Set units first
        if (data.units) {
            document.getElementById('unit-toggle').checked = data.units === 'imperial';
            // Trigger the change event to update unit labels
            const event = new Event('change');
            document.getElementById('unit-toggle').dispatchEvent(event);
        }
        
        // Populate propellant data
        if (data.propellant) {
            document.getElementById('propellant-name').value = data.propellant.name || '';
            document.getElementById('propellant-density').value = data.propellant.density || '';
            document.getElementById('burn-rate-coefficient').value = data.propellant.burnRateCoefficient || '';
            document.getElementById('burn-rate-exponent').value = data.propellant.burnRateExponent || '';
            document.getElementById('specific-heat-ratio').value = data.propellant.specificHeatRatio || '';
        }
        
        // Populate nozzle data
        if (data.nozzle) {
            document.getElementById('throat-diameter').value = data.nozzle.throatDiameter || '';
            document.getElementById('exit-diameter').value = data.nozzle.exitDiameter || '';
            document.getElementById('nozzle-efficiency').value = data.nozzle.efficiency || '';
            
            // Trigger expansion ratio calculation
            const event = new Event('input');
            document.getElementById('throat-diameter').dispatchEvent(event);
        }
        
        // Set grain type and show appropriate parameters
        if (data.grain && data.grain.type) {
            document.getElementById('grain-shape').value = data.grain.type;
            
            // Trigger change event to show correct grain parameters
            const event = new Event('change');
            document.getElementById('grain-shape').dispatchEvent(event);
            
            // Populate grain-specific parameters
            switch (data.grain.type) {
                case 'bates':
                    document.getElementById('bates-outer-diameter').value = data.grain.outerDiameter || '';
                    document.getElementById('bates-inner-diameter').value = data.grain.innerDiameter || '';
                    document.getElementById('bates-length').value = data.grain.length || '';
                    document.getElementById('bates-segments').value = data.grain.segments || '';
                    break;
                    
                case 'finocyl':
                    // Populate Finocyl parameters when implemented
                    break;
                    
                case 'star':
                    // Populate Star parameters when implemented
                    break;
                    
                case 'custom':
                    // Custom grain parameters would come from DXF file
                    break;
            }
        }
    }
    
    // Helper function to download a file
    function downloadFile(url, filename) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Helper function to show notifications
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add to page
        appendToContainer(notification);
        
        // Add close button functionality
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', function() {
            document.body.removeChild(notification);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(function() {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 5000);
    }

    // Helper function to append elements to the dynamic container
    function appendToContainer(element) {
        const dynamicContainer = document.getElementById('dynamic-content-container');
        if (dynamicContainer) {
            dynamicContainer.appendChild(element);
        } else {
            // Fallback to main
            const mainElement = document.querySelector('main');
            if (mainElement) {
                mainElement.appendChild(element);
            } else {
                // Last resort: append to body but make sure it's positioned properly
                element.style.position = 'fixed';
                element.style.zIndex = '1000';
                element.style.top = '50%';
                element.style.left = '50%';
                element.style.transform = 'translate(-50%, -50%)';
                document.body.appendChild(element);
            }
        }
    }
}); 