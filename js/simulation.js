document.addEventListener('DOMContentLoaded', function() {
    // Unit toggle functionality
    const unitToggle = document.getElementById('unit-toggle');
    const unitLabels = document.querySelectorAll('.unit-label');
    
    if (unitToggle) {
        unitToggle.addEventListener('change', function() {
            const isImperial = this.checked;
            
            // Update unit labels based on selection
            unitLabels.forEach(label => {
                const metricUnit = label.getAttribute('data-metric') || '';
                const imperialUnit = label.getAttribute('data-imperial') || '';
                
                if (metricUnit && imperialUnit) {
                    label.textContent = isImperial ? imperialUnit : metricUnit;
                }
            });
            
            // Convert input values
            convertUnits(isImperial);
        });
        
        // Set initial unit labels
        unitLabels.forEach(label => {
            const text = label.textContent;
            label.setAttribute('data-metric', text);
            
            // Set imperial equivalents
            switch (text) {
                case 'mm':
                    label.setAttribute('data-imperial', 'in');
                    break;
                case 'kg/m³':
                    label.setAttribute('data-imperial', 'lb/in³');
                    break;
                case 'MPa':
                    label.setAttribute('data-imperial', 'psi');
                    break;
                case 'N':
                    label.setAttribute('data-imperial', 'lbf');
                    break;
                case 'Ns':
                    label.setAttribute('data-imperial', 'lbf·s');
                    break;
                case 'kg':
                    label.setAttribute('data-imperial', 'lb');
                    break;
                default:
                    label.setAttribute('data-imperial', text);
            }
        });
    }
    
    // Grain shape selection
    const grainShapeSelect = document.getElementById('grain-shape');
    const shapeParams = document.querySelectorAll('.shape-params');
    
    if (grainShapeSelect) {
        grainShapeSelect.addEventListener('change', function() {
            const selectedShape = this.value;
            
            // Hide all shape parameter sections
            shapeParams.forEach(section => {
                section.classList.add('hidden');
            });
            
            // Show the selected shape parameters
            const selectedParams = document.getElementById(`${selectedShape}-params`);
            if (selectedParams) {
                selectedParams.classList.remove('hidden');
            }
        });
    }
    
    // Calculate expansion ratio
    const throatDiameter = document.getElementById('throat-diameter');
    const exitDiameter = document.getElementById('exit-diameter');
    const expansionRatio = document.getElementById('expansion-ratio');
    
    function updateExpansionRatio() {
        if (throatDiameter.value && exitDiameter.value) {
            const throatArea = Math.PI * Math.pow(throatDiameter.value / 2, 2);
            const exitArea = Math.PI * Math.pow(exitDiameter.value / 2, 2);
            expansionRatio.value = (exitArea / throatArea).toFixed(2);
        }
    }
    
    if (throatDiameter && exitDiameter) {
        throatDiameter.addEventListener('input', updateExpansionRatio);
        exitDiameter.addEventListener('input', updateExpansionRatio);
    }
    
    // Unit conversion functions
    function convertUnits(toImperial) {
        // Get all inputs with unit conversion
        const lengthInputs = document.querySelectorAll('input[data-unit="length"]');
        const densityInputs = document.querySelectorAll('input[data-unit="density"]');
        const pressureInputs = document.querySelectorAll('input[data-unit="pressure"]');
        const forceInputs = document.querySelectorAll('input[data-unit="force"]');
        const impulseInputs = document.querySelectorAll('input[data-unit="impulse"]');
        const massInputs = document.querySelectorAll('input[data-unit="mass"]');
        
        // Conversion factors
        const mmToIn = 0.0393701;
        const kgm3ToLbin3 = 3.61273e-5;
        const mpaToPs = 145.038;
        const nToLbf = 0.224809;
        const nsToLbfs = 0.224809;
        const kgToLb = 2.20462;
        
        // Convert length (mm <-> in)
        lengthInputs.forEach(input => {
            if (input.value) {
                if (toImperial) {
                    input.value = (parseFloat(input.value) * mmToIn).toFixed(3);
                } else {
                    input.value = (parseFloat(input.value) / mmToIn).toFixed(1);
                }
            }
        });
        
        // Convert density (kg/m³ <-> lb/in³)
        densityInputs.forEach(input => {
            if (input.value) {
                if (toImperial) {
                    input.value = (parseFloat(input.value) * kgm3ToLbin3).toFixed(5);
                } else {
                    input.value = (parseFloat(input.value) / kgm3ToLbin3).toFixed(1);
                }
            }
        });
        
        // Convert pressure (MPa <-> psi)
        pressureInputs.forEach(input => {
            if (input.value) {
                if (toImperial) {
                    input.value = (parseFloat(input.value) * mpaToPs).toFixed(1);
                } else {
                    input.value = (parseFloat(input.value) / mpaToPs).toFixed(3);
                }
            }
        });
        
        // Convert force (N <-> lbf)
        forceInputs.forEach(input => {
            if (input.value) {
                if (toImperial) {
                    input.value = (parseFloat(input.value) * nToLbf).toFixed(2);
                } else {
                    input.value = (parseFloat(input.value) / nToLbf).toFixed(1);
                }
            }
        });
        
        // Convert impulse (Ns <-> lbf·s)
        impulseInputs.forEach(input => {
            if (input.value) {
                if (toImperial) {
                    input.value = (parseFloat(input.value) * nsToLbfs).toFixed(2);
                } else {
                    input.value = (parseFloat(input.value) / nsToLbfs).toFixed(1);
                }
            }
        });
        
        // Convert mass (kg <-> lb)
        massInputs.forEach(input => {
            if (input.value) {
                if (toImperial) {
                    input.value = (parseFloat(input.value) * kgToLb).toFixed(2);
                } else {
                    input.value = (parseFloat(input.value) / kgToLb).toFixed(3);
                }
            }
        });
        
        // Add propellant unit conversions
        convertPropellantUnits(toImperial);
    }
    
    // Simulation controls
    const runSimulationBtn = document.getElementById('run-simulation');
    const pauseSimulationBtn = document.getElementById('pause-simulation');
    const resetSimulationBtn = document.getElementById('reset-simulation');
    const exportResultsBtn = document.getElementById('export-results');
    
    if (runSimulationBtn) {
        runSimulationBtn.addEventListener('click', function() {
            // Validate inputs before running
            if (validateInputs()) {
                // Run simulation
                runSimulation();
                
                // Update button states
                this.disabled = true;
                pauseSimulationBtn.disabled = false;
                resetSimulationBtn.disabled = false;
                exportResultsBtn.disabled = false;
            }
        });
    }
    
    if (pauseSimulationBtn) {
        pauseSimulationBtn.addEventListener('click', function() {
            // Pause simulation
            pauseSimulation();
            
            // Update button text and functionality
            if (this.textContent === 'Pause') {
                this.textContent = 'Resume';
            } else {
                this.textContent = 'Pause';
                resumeSimulation();
            }
        });
    }
    
    if (resetSimulationBtn) {
        resetSimulationBtn.addEventListener('click', function() {
            // Reset simulation
            resetSimulation();
            
            // Update button states
            runSimulationBtn.disabled = false;
            pauseSimulationBtn.disabled = true;
            pauseSimulationBtn.textContent = 'Pause';
            this.disabled = true;
            exportResultsBtn.disabled = true;
        });
    }
    
    // Save and load functionality
    const saveSimulationBtn = document.getElementById('save-simulation');
    const loadSimulationBtn = document.getElementById('load-simulation');
    
    if (saveSimulationBtn) {
        saveSimulationBtn.addEventListener('click', function() {
            saveSimulationData();
        });
    }
    
    if (loadSimulationBtn) {
        loadSimulationBtn.addEventListener('click', function() {
            loadSimulationData();
        });
    }
    
    // Placeholder functions for simulation logic
    function validateInputs() {
        // Basic validation - check if required fields are filled
        const requiredInputs = document.querySelectorAll('input[required]');
        let isValid = true;
        
        requiredInputs.forEach(input => {
            if (!input.value) {
                input.classList.add('error');
                isValid = false;
            } else {
                input.classList.remove('error');
            }
        });
        
        if (!isValid) {
            alert('Please fill in all required fields.');
        }
        
        return isValid;
    }
    
    function runSimulation() {
        console.log('Running simulation...');
        // This would be replaced with actual simulation logic
        
        // For demo purposes, let's generate some random data
        const simulationData = generateDemoData();
        
        // Update graphs and summary with the data
        updateGraphs(simulationData);
        updateSummary(simulationData);
        
        // Update grain visualization
        if (window.grainVisualization) {
            window.grainVisualization.setSimulationData(simulationData);
        }
    }
    
    function pauseSimulation() {
        console.log('Simulation paused');
        // Placeholder for pause functionality
    }
    
    function resumeSimulation() {
        console.log('Simulation resumed');
        // Placeholder for resume functionality
    }
    
    function resetSimulation() {
        console.log('Simulation reset');
        // Clear graphs and summary
        clearGraphs();
        clearSummary();
        
        // Reset grain visualization
        if (window.grainVisualization) {
            window.grainVisualization.reset();
        }
    }
    
    function saveSimulationData() {
        // Get all input values
        const formData = {};
        
        // Propellant data - add all required fields
        formData.propellant = {
            name: document.getElementById('propellant-name').value,
            density: document.getElementById('propellant-density').value,
            burnRateCoefficient: document.getElementById('burn-rate-coefficient').value,
            burnRateExponent: document.getElementById('burn-rate-exponent').value,
            specificHeatRatio: document.getElementById('specific-heat-ratio').value
        };
        
        // Add additional propellant properties if they exist in the form
        if (document.getElementById('min-pressure')) {
            formData.propellant.minPressure = document.getElementById('min-pressure').value;
        }
        if (document.getElementById('max-pressure')) {
            formData.propellant.maxPressure = document.getElementById('max-pressure').value;
        }
        if (document.getElementById('combustion-temperature')) {
            formData.propellant.combustionTemperature = document.getElementById('combustion-temperature').value;
        }
        if (document.getElementById('exhaust-molar-mass')) {
            formData.propellant.exhaustMolarMass = document.getElementById('exhaust-molar-mass').value;
        }
        if (document.getElementById('characteristic-velocity')) {
            formData.propellant.characteristicVelocity = document.getElementById('characteristic-velocity').value;
        }
        
        // Add propellant selection ID if available
        if (propellantSelector && propellantSelector.value) {
            formData.propellantId = propellantSelector.value;
        }
        
        // Grain geometry
        formData.grainShape = document.getElementById('grain-shape').value;
        
        // Shape-specific parameters
        if (formData.grainShape === 'bates') {
            formData.grainParams = {
                outerDiameter: document.getElementById('bates-outer-diameter').value,
                innerDiameter: document.getElementById('bates-inner-diameter').value,
                length: document.getElementById('bates-length').value,
                segments: document.getElementById('bates-segments').value
            };
        }
        
        // Nozzle data
        formData.nozzle = {
            throatDiameter: document.getElementById('throat-diameter').value,
            exitDiameter: document.getElementById('exit-diameter').value,
            expansionRatio: document.getElementById('expansion-ratio').value
        };
        
        // Advanced settings
        formData.advancedSettings = {
            timeStep: document.getElementById('time-step').value,
            ambientPressure: document.getElementById('ambient-pressure').value
        };
        
        // Convert to JSON and save
        const jsonData = JSON.stringify(formData);
        
        // Create a download link
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formData.propellant.name || 'simulation'}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    function loadSimulationData() {
        // Create a file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        
        fileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    try {
                        const formData = JSON.parse(e.target.result);
                        
                        // Populate form fields with loaded data
                        // Propellant data
                        document.getElementById('propellant-name').value = formData.propellant.name || '';
                        document.getElementById('propellant-density').value = formData.propellant.density || '';
                        document.getElementById('burn-rate-coefficient').value = formData.propellant.burnRateCoefficient || '';
                        document.getElementById('burn-rate-exponent').value = formData.propellant.burnRateExponent || '';
                        document.getElementById('specific-heat-ratio').value = formData.propellant.specificHeatRatio || '';
                        
                        // If propellant ID is available, select it in the dropdown
                        if (formData.propellantId && propellantSelector) {
                            // Check if the option exists
                            let optionExists = false;
                            for (let i = 0; i < propellantSelector.options.length; i++) {
                                if (propellantSelector.options[i].value === formData.propellantId) {
                                    optionExists = true;
                                    break;
                                }
                            }
                            
                            if (optionExists) {
                                propellantSelector.value = formData.propellantId;
                            } else {
                                propellantSelector.value = 'custom';
                            }
                        } else {
                            // Set to custom if no ID is available
                            if (propellantSelector) {
                                propellantSelector.value = 'custom';
                            }
                        }
                        
                        // Grain shape
                        const grainShapeSelect = document.getElementById('grain-shape');
                        grainShapeSelect.value = formData.grainShape || 'bates';
                        
                        // Trigger change event to show correct shape parameters
                        const event = new Event('change');
                        grainShapeSelect.dispatchEvent(event);
                        
                        // Shape-specific parameters
                        if (formData.grainShape === 'bates' && formData.grainParams) {
                            document.getElementById('bates-outer-diameter').value = formData.grainParams.outerDiameter || '';
                            document.getElementById('bates-inner-diameter').value = formData.grainParams.innerDiameter || '';
                            document.getElementById('bates-length').value = formData.grainParams.length || '';
                            document.getElementById('bates-segments').value = formData.grainParams.segments || '';
                        }
                        
                        // Nozzle data
                        document.getElementById('throat-diameter').value = formData.nozzle.throatDiameter || '';
                        document.getElementById('exit-diameter').value = formData.nozzle.exitDiameter || '';
                        document.getElementById('expansion-ratio').value = formData.nozzle.expansionRatio || '';
                        
                        // Advanced settings
                        if (formData.advancedSettings) {
                            document.getElementById('time-step').value = formData.advancedSettings.timeStep || '0.01';
                            document.getElementById('ambient-pressure').value = formData.advancedSettings.ambientPressure || '1.0';
                        }
                        
                        alert('Simulation data loaded successfully.');
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                        alert('Error loading simulation data. Invalid file format.');
                    }
                };
                
                reader.readAsText(file);
            }
        });
        
        fileInput.click();
    }
    
    // Demo data generation for testing
    function generateDemoData() {
        const data = {
            time: [],
            thrust: [],
            pressure: [],
            summary: {
                maxThrust: 0,
                totalImpulse: 0,
                burnTime: 0,
                maxPressure: 0,
                isp: 0,
                propellantMass: 0
            }
        };
        
        // Generate time series data
        const duration = 5; // seconds
        const timeStep = 0.05; // seconds
        
        for (let t = 0; t <= duration; t += timeStep) {
            data.time.push(t);
            
            // Generate thrust curve (simplified bell curve)
            const thrustValue = 1000 * Math.exp(-Math.pow((t - duration/2) / (duration/4), 2));
            data.thrust.push(thrustValue);
            
            // Generate pressure curve (similar to thrust but with different peak)
            const pressureValue = 5 * Math.exp(-Math.pow((t - duration/2.2) / (duration/4.5), 2));
            data.pressure.push(pressureValue);
            
            // Track maximum values
            data.summary.maxThrust = Math.max(data.summary.maxThrust, thrustValue);
            data.summary.maxPressure = Math.max(data.summary.maxPressure, pressureValue);
        }
        
        // Calculate summary values
        data.summary.burnTime = duration;
        
        // Calculate total impulse (area under thrust curve)
        data.summary.totalImpulse = data.thrust.reduce((sum, thrust, i) => {
            if (i === 0) return sum;
            return sum + (thrust + data.thrust[i-1]) / 2 * timeStep;
        }, 0);
        
        // Set other summary values
        data.summary.propellantMass = 0.5; // kg
        data.summary.isp = data.summary.totalImpulse / (data.summary.propellantMass * 9.81);
        
        return data;
    }
    
    // Placeholder functions for updating UI
    function updateGraphs(data) {
        if (window.graphingModule) {
            window.graphingModule.updateCharts(data);
        }
    }
    
    function updateSummary(data) {
        // Update summary values
        document.getElementById('max-thrust').textContent = data.summary.maxThrust.toFixed(1) + ' ' + 
            (unitToggle.checked ? 'lbf' : 'N');
        document.getElementById('total-impulse').textContent = data.summary.totalImpulse.toFixed(1) + ' ' + 
            (unitToggle.checked ? 'lbf·s' : 'Ns');
        document.getElementById('burn-time').textContent = data.summary.burnTime.toFixed(2) + ' s';
        document.getElementById('max-pressure').textContent = data.summary.maxPressure.toFixed(2) + ' ' + 
            (unitToggle.checked ? 'psi' : 'MPa');
        document.getElementById('isp').textContent = data.summary.isp.toFixed(1) + ' s';
        document.getElementById('propellant-mass').textContent = data.summary.propellantMass.toFixed(3) + ' ' + 
            (unitToggle.checked ? 'lb' : 'kg');
    }
    
    function clearGraphs() {
        if (window.graphingModule) {
            window.graphingModule.clearCharts();
        }
    }
    
    function clearSummary() {
        // Reset summary values
        document.getElementById('max-thrust').textContent = '-- ' + 
            (unitToggle.checked ? 'lbf' : 'N');
        document.getElementById('total-impulse').textContent = '-- ' + 
            (unitToggle.checked ? 'lbf·s' : 'Ns');
        document.getElementById('burn-time').textContent = '-- s';
        document.getElementById('max-pressure').textContent = '-- ' + 
            (unitToggle.checked ? 'psi' : 'MPa');
        document.getElementById('isp').textContent = '-- s';
        document.getElementById('propellant-mass').textContent = '-- ' + 
            (unitToggle.checked ? 'lb' : 'kg');
    }

    function showGrainParameters() {
        const grainType = document.getElementById('grain-shape').value;
        
        // Hide all parameter groups
        const parameterGroups = document.querySelectorAll('.grain-parameter-group');
        parameterGroups.forEach(group => {
            group.style.display = 'none';
        });
        
        // Show selected grain type parameters
        const selectedGroup = document.getElementById(`${grainType}-parameters`);
        if (selectedGroup) {
            selectedGroup.style.display = 'block';
        }
        
        // Update grain visualization if available
        updateGrainVisualization();
    }

    function updateGrainVisualization() {
        if (!window.grainVisualization) return;
        
        const grainType = document.getElementById('grain-shape').value;
        let grainParameters = {};
        
        switch (grainType) {
            case 'bates':
                grainParameters = {
                    outerDiameter: parseFloat(document.getElementById('bates-outer-diameter').value),
                    innerDiameter: parseFloat(document.getElementById('bates-inner-diameter').value),
                    length: parseFloat(document.getElementById('bates-length').value),
                    segments: parseInt(document.getElementById('bates-segments').value)
                };
                break;
                
            case 'finocyl':
                grainParameters = {
                    outerDiameter: parseFloat(document.getElementById('finocyl-outer-diameter').value),
                    innerDiameter: parseFloat(document.getElementById('finocyl-inner-diameter').value),
                    length: parseFloat(document.getElementById('finocyl-length').value),
                    finCount: parseInt(document.getElementById('finocyl-fin-count').value),
                    finHeight: parseFloat(document.getElementById('finocyl-fin-height').value),
                    finWidth: parseFloat(document.getElementById('finocyl-fin-width').value)
                };
                break;
                
            // Other grain types...
        }
        
        window.grainVisualization.updateGrainParameters(grainType, grainParameters);
    }

    // Help panel toggle
    const helpToggle = document.querySelector('.help-toggle');
    const helpPanel = document.querySelector('.help-panel');

    if (helpToggle && helpPanel) {
        helpToggle.addEventListener('click', function() {
            helpPanel.classList.toggle('active');
        });
        
        // Close help panel when clicking outside
        document.addEventListener('click', function(event) {
            if (!helpPanel.contains(event.target) && helpPanel.classList.contains('active')) {
                helpPanel.classList.remove('active');
            }
        });
    }

    // Propellant selector functionality
    const propellantSelector = document.getElementById('propellant-selector');
    const editPropellantButton = document.getElementById('edit-propellant');
    const managePropellantsButton = document.getElementById('manage-propellants');

    if (propellantSelector) {
        // Load custom propellants into dropdown
        loadCustomPropellantOptions();
        
        // Set selected propellant if available in localStorage
        const selectedPropellant = JSON.parse(localStorage.getItem('selectedPropellant'));
        if (selectedPropellant) {
            document.getElementById('propellant-name').value = selectedPropellant.name;
            document.getElementById('propellant-density').value = selectedPropellant.density;
            document.getElementById('burn-rate-coefficient').value = selectedPropellant.burnRateCoefficient;
            document.getElementById('burn-rate-exponent').value = selectedPropellant.burnRateExponent;
            document.getElementById('specific-heat-ratio').value = selectedPropellant.specificHeatRatio;
        }
        
        // Add change event to the propellant selector
        propellantSelector.addEventListener('change', function() {
            const selectedValue = this.value;
            
            if (selectedValue === 'custom') {
                // Clear fields for custom input
                document.getElementById('propellant-name').value = '';
                document.getElementById('propellant-density').value = '';
                document.getElementById('burn-rate-coefficient').value = '';
                document.getElementById('burn-rate-exponent').value = '';
                document.getElementById('specific-heat-ratio').value = '';
                
                // Enable input fields
                enablePropellantInputs(true);
                return;
            }
            
            if (selectedValue) {
                // Get propellant data
                let propellant;
                
                if (selectedValue.startsWith('custom-')) {
                    // Get custom propellant from localStorage
                    const customPropellants = JSON.parse(localStorage.getItem('customPropellants')) || {};
                    propellant = customPropellants[selectedValue];
                } else {
                    // Get standard propellant
                    propellant = standardPropellants[selectedValue];
                }
                
                if (propellant) {
                    // Populate form fields
                    document.getElementById('propellant-name').value = propellant.name;
                    document.getElementById('propellant-density').value = propellant.density;
                    document.getElementById('burn-rate-coefficient').value = propellant.burnRateCoefficient;
                    document.getElementById('burn-rate-exponent').value = propellant.burnRateExponent;
                    document.getElementById('specific-heat-ratio').value = propellant.specificHeatRatio;
                    
                    // Disable input fields for standard propellants to prevent accidental changes
                    // Enable for custom propellants to allow quick adjustments
                    enablePropellantInputs(selectedValue.startsWith('custom-'));
                }
            }
        });
    }

    if (editPropellantButton) {
        editPropellantButton.addEventListener('click', function() {
            const selectedValue = propellantSelector.value;
            
            if (!selectedValue || selectedValue === 'custom') {
                // Cannot edit unsaved propellant
                alert('Please select a saved propellant to edit.');
                return;
            }
            
            // Get propellant data
            let propellant;
            let isCustom = false;
            
            if (selectedValue.startsWith('custom-')) {
                // Get custom propellant from localStorage
                const customPropellants = JSON.parse(localStorage.getItem('customPropellants')) || {};
                propellant = customPropellants[selectedValue];
                isCustom = true;
            } else {
                // Get standard propellant
                propellant = standardPropellants[selectedValue];
            }
            
            if (!propellant) {
                alert('Propellant not found.');
                return;
            }
            
            if (!isCustom) {
                // Create a copy of the standard propellant
                const newPropellant = { ...propellant };
                newPropellant.name = propellant.name + ' (Custom)';
                newPropellant.category = 'custom';
                
                // Generate a new ID
                const id = 'custom-' + Date.now();
                
                // Get existing custom propellants
                const customPropellants = JSON.parse(localStorage.getItem('customPropellants')) || {};
                
                // Add the propellant
                customPropellants[id] = newPropellant;
                
                // Save to localStorage
                localStorage.setItem('customPropellants', JSON.stringify(customPropellants));
                
                // Add to dropdown
                addCustomPropellantOption(id, newPropellant);
                
                // Select the new propellant
                propellantSelector.value = id;
                
                // Update fields
                document.getElementById('propellant-name').value = newPropellant.name;
                
                // Enable input fields
                enablePropellantInputs(true);
                
                alert('Created a custom copy of the standard propellant that you can edit.');
            } else {
                // Enable input fields for custom propellant
                enablePropellantInputs(true);
                
                // Allow editing the name for custom propellants
                document.getElementById('propellant-name').disabled = false;
                
                alert('You can now edit this custom propellant.');
            }
        });
    }

    if (managePropellantsButton) {
        managePropellantsButton.addEventListener('click', function() {
            // Navigate to propellant database page
            window.location.href = 'propellant-database.html';
        });
    }

    // Function to load custom propellants into dropdown
    function loadCustomPropellantOptions() {
        const customOptions = document.getElementById('custom-propellant-options');
        if (!customOptions) return;
        
        // Clear existing options
        customOptions.innerHTML = '';
        
        // Get custom propellants from localStorage
        const customPropellants = JSON.parse(localStorage.getItem('customPropellants')) || {};
        
        // Check if there are any custom propellants
        if (Object.keys(customPropellants).length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.disabled = true;
            option.textContent = 'No custom propellants';
            customOptions.appendChild(option);
            return;
        }
        
        // Add options for each custom propellant
        for (const id in customPropellants) {
            addCustomPropellantOption(id, customPropellants[id]);
        }
    }

    // Function to add a custom propellant option to the dropdown
    function addCustomPropellantOption(id, propellant) {
        const customOptions = document.getElementById('custom-propellant-options');
        if (!customOptions) return;
        
        const option = document.createElement('option');
        option.value = id;
        option.textContent = propellant.name;
        customOptions.appendChild(option);
    }

    // Function to enable/disable propellant input fields - update to handle all fields
    function enablePropellantInputs(enable) {
        // Propellant name should be editable only for custom propellants
        document.getElementById('propellant-name').disabled = !enable;
        
        // Always allow editing other properties regardless of propellant type
        // This lets the user make small adjustments without creating a new propellant
        document.getElementById('propellant-density').disabled = false;
        document.getElementById('burn-rate-coefficient').disabled = false;
        document.getElementById('burn-rate-exponent').disabled = false;
        document.getElementById('specific-heat-ratio').disabled = false;
        
        // Add these additional fields that are in the context requirements
        if (document.getElementById('min-pressure')) {
            document.getElementById('min-pressure').disabled = false;
        }
        if (document.getElementById('max-pressure')) {
            document.getElementById('max-pressure').disabled = false;
        }
        if (document.getElementById('combustion-temperature')) {
            document.getElementById('combustion-temperature').disabled = false;
        }
        if (document.getElementById('exhaust-molar-mass')) {
            document.getElementById('exhaust-molar-mass').disabled = false;
        }
        if (document.getElementById('characteristic-velocity')) {
            document.getElementById('characteristic-velocity').disabled = false;
        }
    }

    // Add a new function to handle unit conversions for propellant properties
    function convertPropellantUnits(toImperial) {
        // Get current values
        const density = document.getElementById('propellant-density');
        const minPressure = document.getElementById('min-pressure');
        const maxPressure = document.getElementById('max-pressure');
        const burnRateCoef = document.getElementById('burn-rate-coefficient');
        const combustionTemp = document.getElementById('combustion-temperature');
        const exhaustMass = document.getElementById('exhaust-molar-mass');
        const characteristicVel = document.getElementById('characteristic-velocity');
        
        // Conversion factors
        const kgm3ToLbin3 = 3.61273e-5;  // kg/m³ to lb/in³
        const mpaToPs = 145.038;         // MPa to psi
        const mmsToPsi = 0.0015;         // conversion factor for burn rate coef
        const kToR = 1.8;                // Kelvin to Rankine
        const gMolToLbMol = 0.0022046;   // g/mol to lb/lb-mol
        const msToFts = 3.28084;         // m/s to ft/s
        
        if (density && density.value) {
            if (toImperial) {
                density.value = (parseFloat(density.value) * kgm3ToLbin3).toFixed(5);
            } else {
                density.value = (parseFloat(density.value) / kgm3ToLbin3).toFixed(1);
            }
        }
        
        if (minPressure && minPressure.value) {
            if (toImperial) {
                minPressure.value = (parseFloat(minPressure.value) * mpaToPs).toFixed(1);
            } else {
                minPressure.value = (parseFloat(minPressure.value) / mpaToPs).toFixed(2);
            }
        }
        
        if (maxPressure && maxPressure.value) {
            if (toImperial) {
                maxPressure.value = (parseFloat(maxPressure.value) * mpaToPs).toFixed(1);
            } else {
                maxPressure.value = (parseFloat(maxPressure.value) / mpaToPs).toFixed(2);
            }
        }
        
        if (burnRateCoef && burnRateCoef.value) {
            // This conversion is more complex and may need refinement
            // Just a placeholder for now
            if (toImperial) {
                burnRateCoef.value = (parseFloat(burnRateCoef.value) * mmsToPsi).toFixed(4);
            } else {
                burnRateCoef.value = (parseFloat(burnRateCoef.value) / mmsToPsi).toFixed(2);
            }
        }
        
        if (combustionTemp && combustionTemp.value) {
            if (toImperial) {
                combustionTemp.value = (parseFloat(combustionTemp.value) * kToR).toFixed(1);
            } else {
                combustionTemp.value = (parseFloat(combustionTemp.value) / kToR).toFixed(1);
            }
        }
        
        if (exhaustMass && exhaustMass.value) {
            if (toImperial) {
                exhaustMass.value = (parseFloat(exhaustMass.value) * gMolToLbMol).toFixed(5);
            } else {
                exhaustMass.value = (parseFloat(exhaustMass.value) / gMolToLbMol).toFixed(1);
            }
        }
        
        if (characteristicVel && characteristicVel.value) {
            if (toImperial) {
                characteristicVel.value = (parseFloat(characteristicVel.value) * msToFts).toFixed(1);
            } else {
                characteristicVel.value = (parseFloat(characteristicVel.value) / msToFts).toFixed(1);
            }
        }
    }

    // Standard propellants data (same as in propellant-database.js)
    const standardPropellants = {
        'knsb': {
            name: 'KNSB',
            description: 'Potassium Nitrate/Sorbitol (65/35)',
            density: 1.841,
            burnRateCoefficient: 8.26,
            burnRateExponent: 0.319,
            specificHeatRatio: 1.131,
            combustionTemperature: 1720, // in K, convert to °R for imperial units
            exhaustMolarMass: 23.9,      // in g/mol, convert for imperial
            characteristicVelocity: 2670, // in ft/s
            minPressure: 0.69,           // MPa (100 psi)
            maxPressure: 13.79,          // MPa (2000 psi)
            category: 'amateur'
        },
        'knsu': {
            name: 'KNSU',
            description: 'Potassium Nitrate/Sucrose (65/35)',
            density: 1.889,
            burnRateCoefficient: 8.13,
            burnRateExponent: 0.351,
            specificHeatRatio: 1.133,
            combustionTemperature: 1750,
            exhaustMolarMass: 24.1,
            characteristicVelocity: 2650,
            minPressure: 0.69,
            maxPressure: 13.79,
            category: 'amateur'
        },
        'kndx': {
            name: 'KNDX',
            description: 'Potassium Nitrate/Dextrose (65/35)',
            density: 1.879,
            burnRateCoefficient: 8.85,
            burnRateExponent: 0.322,
            specificHeatRatio: 1.130,
            combustionTemperature: 1720,
            exhaustMolarMass: 24.0,
            characteristicVelocity: 2630,
            minPressure: 0.69,
            maxPressure: 13.79,
            category: 'amateur'
        },
        'mit-ocean': {
            name: 'MIT - Ocean Water',
            description: 'AP/HTPB/Al (68/20/12)',
            density: 1.72,
            burnRateCoefficient: 4.83,
            burnRateExponent: 0.36,
            specificHeatRatio: 1.20,
            combustionTemperature: 3200,
            exhaustMolarMass: 21.5,
            characteristicVelocity: 3200,
            minPressure: 1.38,
            maxPressure: 20.68,
            category: 'advanced'
        },
        'rcs-white': {
            name: 'RCS - White Lightning',
            description: 'AP/HTPB/Al (70/15/15)',
            density: 1.76,
            burnRateCoefficient: 5.13,
            burnRateExponent: 0.32,
            specificHeatRatio: 1.21,
            combustionTemperature: 3350,
            exhaustMolarMass: 21.2,
            characteristicVelocity: 3300,
            minPressure: 1.38,
            maxPressure: 20.68,
            category: 'commercial'
        },
        'rcs-blue': {
            name: 'RCS - Blue Thunder',
            description: 'AP/HTPB/Al/Cu compounds (68/14/16/2)',
            density: 1.78,
            burnRateCoefficient: 7.40,
            burnRateExponent: 0.38,
            specificHeatRatio: 1.22,
            combustionTemperature: 3400,
            exhaustMolarMass: 21.0,
            characteristicVelocity: 3350,
            minPressure: 1.38,
            maxPressure: 20.68,
            category: 'commercial'
        }
    };
}); 