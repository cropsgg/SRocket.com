document.addEventListener('DOMContentLoaded', function() {
    // Create dynamic content sections
    createSimulationResultsSection();
    
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
        if (!validateInputs()) return;
        
        // Disable run button and enable pause/reset
        document.getElementById('run-simulation').disabled = true;
        document.getElementById('pause-simulation').disabled = false;
        document.getElementById('reset-simulation').disabled = false;
        
        // Get simulation parameters
        const timeStep = parseFloat(document.getElementById('time-step').value);
        const ambientPressure = parseFloat(document.getElementById('ambient-pressure').value);
        
        // Initialize simulation data
        simulationData = {
            time: [],
            thrust: [],
            pressure: [],
            burnRate: [],
            burnRegression: [],
            burnTime: 0
        };
        
        // Calculate initial burn rate and regression
        const initialPressure = estimatePressure(calculateBurnArea(), 0);
        const initialBurnRate = calculateBurnRate(initialPressure);
        simulationData.burnRate.push(initialBurnRate);
        simulationData.burnRegression.push(0);
        
        // Update grain visualization with initial state
        if (window.grainVisualization) {
            window.grainVisualization.setSimulationData({
                burnRate: initialBurnRate,
                burnTime: 0,
                initialRegression: 0
            });
        }
        
        // Start simulation loop
        let currentTime = 0;
        let burnRegression = 0;
        
        function simulationStep() {
            // Calculate current values
            const burnArea = calculateBurnArea(burnRegression);
            const pressure = estimatePressure(burnArea, currentTime);
            const burnRate = calculateBurnRate(pressure);
            const thrust = estimateThrust(pressure, estimateCf(pressure / ambientPressure));
            
            // Update burn regression
            burnRegression += burnRate * timeStep;
            
            // Store data
            simulationData.time.push(currentTime);
            simulationData.thrust.push(thrust);
            simulationData.pressure.push(pressure);
            simulationData.burnRate.push(burnRate);
            simulationData.burnRegression.push(burnRegression);
            
            // Update visualizations
            updateGraphs(simulationData);
            if (window.grainVisualization) {
                window.grainVisualization.updateBurnRegression(burnRegression);
            }
            
            // Update time slider
            const timeSlider = document.getElementById('time-slider');
            if (timeSlider) {
                timeSlider.value = currentTime;
                document.getElementById('time-display').textContent = currentTime.toFixed(2) + 's';
            }
            
            // Check if grain is completely burned
            if (isGrainBurned(burnRegression)) {
                simulationData.burnTime = currentTime;
                updateSummary(simulationData);
                return;
            }
            
            // Continue simulation
            currentTime += timeStep;
            if (!isPaused) {
                simulationTimeout = setTimeout(simulationStep, timeStep * 1000);
            }
        }
        
        // Start simulation
        isPaused = false;
        simulationStep();
    }
    
    function calculateBurnRate(pressure) {
        const coefficient = parseFloat(document.getElementById('burn-rate-coefficient').value);
        const exponent = parseFloat(document.getElementById('burn-rate-exponent').value);
        return coefficient * Math.pow(pressure, exponent);
    }
    
    function isGrainBurned(burnRegression) {
        const grainType = document.getElementById('grain-shape').value;
        let maxRegression;
        
        switch (grainType) {
            case 'bates':
                const outerDiameter = parseFloat(document.getElementById('bates-outer-diameter').value);
                const innerDiameter = parseFloat(document.getElementById('bates-inner-diameter').value);
                maxRegression = (outerDiameter - innerDiameter) / 2;
                break;
            // Add cases for other grain types
            default:
                maxRegression = 100; // Default value
        }
        
        return burnRegression >= maxRegression;
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
        } else if (formData.grainShape === 'finocyl') {
            formData.grainParams = {
                outerDiameter: document.getElementById('finocyl-outer-diameter').value,
                innerDiameter: document.getElementById('finocyl-inner-diameter').value,
                length: document.getElementById('finocyl-length').value,
                finCount: document.getElementById('finocyl-fin-count').value,
                finHeight: document.getElementById('finocyl-fin-height').value,
                finWidth: document.getElementById('finocyl-fin-width').value
            };
        } else if (formData.grainShape === 'star') {
            formData.grainParams = {
                outerDiameter: document.getElementById('star-outer-diameter').value,
                pointCount: document.getElementById('star-point-count').value,
                pointDepth: document.getElementById('star-point-depth').value,
                pointAngle: document.getElementById('star-point-angle').value,
                length: document.getElementById('star-length').value
            };
        } else if (formData.grainShape === 'moonburner') {
            formData.grainParams = {
                outerDiameter: document.getElementById('moonburner-outer-diameter').value,
                coreDiameter: document.getElementById('moonburner-core-diameter').value,
                coreOffset: document.getElementById('moonburner-core-offset').value,
                length: document.getElementById('moonburner-length').value
            };
        } else if (formData.grainShape === 'rodandtube') {
            formData.grainParams = {
                outerDiameter: document.getElementById('rodandtube-outer-diameter').value,
                innerDiameter: document.getElementById('rodandtube-inner-diameter').value,
                rodDiameter: document.getElementById('rodandtube-rod-diameter').value,
                length: document.getElementById('rodandtube-length').value
            };
        } else if (formData.grainShape === 'endburner') {
            formData.grainParams = {
                diameter: document.getElementById('endburner-diameter').value,
                length: document.getElementById('endburner-length').value
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
                        } else if (formData.grainShape === 'finocyl' && formData.grainParams) {
                            document.getElementById('finocyl-outer-diameter').value = formData.grainParams.outerDiameter || '';
                            document.getElementById('finocyl-inner-diameter').value = formData.grainParams.innerDiameter || '';
                            document.getElementById('finocyl-length').value = formData.grainParams.length || '';
                            document.getElementById('finocyl-fin-count').value = formData.grainParams.finCount || '';
                            document.getElementById('finocyl-fin-height').value = formData.grainParams.finHeight || '';
                            document.getElementById('finocyl-fin-width').value = formData.grainParams.finWidth || '';
                        } else if (formData.grainShape === 'star' && formData.grainParams) {
                            document.getElementById('star-outer-diameter').value = formData.grainParams.outerDiameter || '';
                            document.getElementById('star-point-count').value = formData.grainParams.pointCount || '';
                            document.getElementById('star-point-depth').value = formData.grainParams.pointDepth || '';
                            document.getElementById('star-point-angle').value = formData.grainParams.pointAngle || '';
                            document.getElementById('star-length').value = formData.grainParams.length || '';
                        } else if (formData.grainShape === 'moonburner' && formData.grainParams) {
                            document.getElementById('moonburner-outer-diameter').value = formData.grainParams.outerDiameter || '';
                            document.getElementById('moonburner-core-diameter').value = formData.grainParams.coreDiameter || '';
                            document.getElementById('moonburner-core-offset').value = formData.grainParams.coreOffset || '';
                            document.getElementById('moonburner-length').value = formData.grainParams.length || '';
                        } else if (formData.grainShape === 'rodandtube' && formData.grainParams) {
                            document.getElementById('rodandtube-outer-diameter').value = formData.grainParams.outerDiameter || '';
                            document.getElementById('rodandtube-inner-diameter').value = formData.grainParams.innerDiameter || '';
                            document.getElementById('rodandtube-rod-diameter').value = formData.grainParams.rodDiameter || '';
                            document.getElementById('rodandtube-length').value = formData.grainParams.length || '';
                        } else if (formData.grainShape === 'endburner' && formData.grainParams) {
                            document.getElementById('endburner-diameter').value = formData.grainParams.diameter || '';
                            document.getElementById('endburner-length').value = formData.grainParams.length || '';
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
            burnRate: [],
            burnArea: [],
            portArea: [],
            massFlux: [],
            kn: [],
            summary: {
                maxThrust: 0,
                totalImpulse: 0,
                burnTime: 0,
                maxPressure: 0,
                avgPressure: 0,
                isp: 0,
                propellantMass: 0,
                propellantLength: 0,
                volumeLoading: 0,
                initialKN: 0,
                peakKN: 0,
                idealCf: 0,
                deliveredCf: 0,
                throatPortRatio: 0,
                peakMassFlux: 0
            }
        };
        
        // Get motor parameters from inputs
        const grainShape = document.getElementById('grain-shape').value;
        const throatDiameter = parseFloat(document.getElementById('throat-diameter').value) || 20; // mm
        const throatArea = Math.PI * Math.pow(throatDiameter / 2, 2) / 1000000; // m²
        const exitDiameter = parseFloat(document.getElementById('exit-diameter').value) || 40; // mm
        const exitArea = Math.PI * Math.pow(exitDiameter / 2, 2) / 1000000; // m²
        const expansionRatio = exitArea / throatArea;
        
        // Propellant parameters
        const propellantDensity = parseFloat(document.getElementById('propellant-density').value) || 1800; // kg/m³
        const gamma = parseFloat(document.getElementById('specific-heat-ratio').value) || 1.2;
        
        // Motor case parameters (estimated/placeholder)
        const motorCaseLength = 200; // mm
        const motorCaseVolume = Math.PI * Math.pow(exitDiameter / 2, 2) * motorCaseLength / 1000000; // m³
        
        // Grain geometry parameters
        let grainOuterDiameter, grainInnerDiameter, grainLength, segments;
        let portArea, initialBurnArea, propellantVolume;
        
        // Calculate grain specific parameters based on grain type
        switch(grainShape) {
            case 'bates':
                grainOuterDiameter = parseFloat(document.getElementById('bates-outer-diameter').value) || 70; // mm
                grainInnerDiameter = parseFloat(document.getElementById('bates-inner-diameter').value) || 20; // mm
                grainLength = parseFloat(document.getElementById('bates-length').value) || 100; // mm
                segments = parseInt(document.getElementById('bates-segments').value) || 1;
                
                // Calculate initial port area (m²)
                portArea = Math.PI * Math.pow(grainInnerDiameter / 2000, 2) * segments;
                
                // Calculate initial burn area (m²)
                initialBurnArea = segments * (
                    2 * Math.PI * Math.pow(grainOuterDiameter / 2000, 2) - 
                    2 * Math.PI * Math.pow(grainInnerDiameter / 2000, 2) + 
                    2 * Math.PI * (grainInnerDiameter / 2000) * (grainLength / 1000)
                );
                
                // Calculate propellant volume (m³)
                propellantVolume = segments * Math.PI * ((Math.pow(grainOuterDiameter / 2000, 2) - 
                    Math.pow(grainInnerDiameter / 2000, 2))) * (grainLength / 1000);
                break;
                
            case 'finocyl':
                grainOuterDiameter = parseFloat(document.getElementById('finocyl-outer-diameter').value) || 70; // mm
                grainInnerDiameter = parseFloat(document.getElementById('finocyl-inner-diameter').value) || 20; // mm
                grainLength = parseFloat(document.getElementById('finocyl-length').value) || 100; // mm
                const finCount = parseInt(document.getElementById('finocyl-fin-count').value) || 6;
                const finHeight = parseFloat(document.getElementById('finocyl-fin-height').value) || 20; // mm
                const finWidth = parseFloat(document.getElementById('finocyl-fin-width').value) || 10; // mm
                
                // Calculate initial port area (approximation, m²)
                portArea = Math.PI * Math.pow(grainInnerDiameter / 2000, 2);
                
                // Calculate initial burn area (approximation, m²)
                initialBurnArea = 2 * Math.PI * Math.pow(grainOuterDiameter / 2000, 2) - 
                    2 * Math.PI * Math.pow(grainInnerDiameter / 2000, 2) + 
                    2 * Math.PI * (grainInnerDiameter / 2000) * (grainLength / 1000) +
                    finCount * (
                        2 * (finHeight / 1000) * (grainLength / 1000) + 
                        2 * (finWidth / 1000) * (finHeight / 1000)
                    );
                
                // Calculate propellant volume (approximation, m³)
                propellantVolume = Math.PI * ((Math.pow(grainOuterDiameter / 2000, 2) - 
                    Math.pow(grainInnerDiameter / 2000, 2))) * (grainLength / 1000) +
                    finCount * (finWidth / 1000) * (finHeight / 1000) * (grainLength / 1000);
                break;
                
            case 'star':
                // Add star grain calculations here
                // For simplicity, using approximations
                grainOuterDiameter = 70; // mm
                grainLength = 100; // mm
                portArea = 0.0005; // m²
                initialBurnArea = 0.03; // m²
                propellantVolume = 0.0003; // m³
                break;
                
            default:
                // Default values for unknown grain type
                portArea = 0.0005; // m²
                initialBurnArea = 0.03; // m²
                propellantVolume = 0.0003; // m³
                grainLength = 100; // mm
        }
        
        // Calculate initial parameters
        const initialKN = initialBurnArea / throatArea;
        const propellantMass = propellantDensity * propellantVolume; // kg
        const volumeLoading = (propellantVolume / motorCaseVolume) * 100; // %
        const throatPortRatio = throatArea / portArea;
        
        // Set initial values in summary
        data.summary.propellantMass = propellantMass;
        data.summary.propellantLength = grainLength;
        data.summary.volumeLoading = volumeLoading;
        data.summary.initialKN = initialKN;
        data.summary.throatPortRatio = throatPortRatio;
        
        // Generate time series data
        const duration = 5; // seconds
        const timeStep = 0.05; // seconds
        
        // Estimate chamber pressure based on KN (simplified formula)
        const estimatePressure = (burnArea, time) => {
            // This is a simplification. Real pressure would be calculated based on 
            // burn rate, propellant characteristics, and nozzle parameters
            const kn = burnArea / throatArea;
            return 5 * Math.exp(-Math.pow((time - duration/2.2) / (duration/4.5), 2)) * (kn / initialKN);
        };
        
        // Estimate thrust based on pressure (simplified formula)
        const estimateThrust = (pressure, cf) => {
            return pressure * 1000000 * throatArea * cf; // N
        };
        
        // Estimate thrust coefficient (simplified formula)
        const estimateCf = (pressureRatio) => {
            // Theoretical formula for ideal thrust coefficient
            const term1 = Math.sqrt((2 * Math.pow(gamma, 2)) / (gamma - 1));
            const term2 = Math.pow((2 / (gamma + 1)), ((gamma + 1) / (2 * (gamma - 1))));
            const term3 = Math.sqrt(1 - Math.pow(pressureRatio, ((gamma - 1) / gamma)));
            return term1 * term2 * term3;
        };
        
        // Ambient pressure in MPa
        const ambientPressure = parseFloat(document.getElementById('ambient-pressure').value) || 1.0;
        const ambientPressureMPa = ambientPressure * 0.101325; // Convert atm to MPa
        
        let totalPressure = 0;
        let pressurePoints = 0;
        
        for (let t = 0; t <= duration; t += timeStep) {
            data.time.push(t);
            
            // Simulate burn regression (simplified)
            const burnProgress = t / duration; // 0 to 1
            const currentBurnArea = initialBurnArea * (1 - 0.5 * burnProgress); // Decreases as grain burns
            const currentPortArea = portArea * (1 + burnProgress); // Increases as port grows
            
            // Calculate KN
            const kn = currentBurnArea / throatArea;
            data.kn.push(kn);
            
            // Track peak KN
            data.summary.peakKN = Math.max(data.summary.peakKN, kn);
            
            // Calculate pressure based on KN
            const pressureValue = estimatePressure(currentBurnArea, t);
            data.pressure.push(pressureValue);
            
            // Track for average pressure calculation
            totalPressure += pressureValue;
            pressurePoints++;
            
            // Calculate mass flux (kg/m²s)
            const massFlux = pressureValue * 1000000 * Math.sqrt(gamma / (8314 / 22)) / Math.sqrt(300);
            data.massFlux.push(massFlux);
            
            // Track peak mass flux
            data.summary.peakMassFlux = Math.max(data.summary.peakMassFlux, massFlux);
            
            // Calculate ideal thrust coefficient
            const pressureRatio = ambientPressureMPa / pressureValue;
            const idealCf = estimateCf(pressureRatio);
            
            // Apply efficiency factor for delivered Cf (typically 0.85-0.98)
            const efficiencyFactor = 0.92;
            const deliveredCf = idealCf * efficiencyFactor;
            
            // Calculate thrust
            const thrustValue = estimateThrust(pressureValue, deliveredCf);
            data.thrust.push(thrustValue);
            
            // Store burn area and port area for visualization
            data.burnArea.push(currentBurnArea);
            data.portArea.push(currentPortArea);
            
            // Track maximum values
            data.summary.maxThrust = Math.max(data.summary.maxThrust, thrustValue);
            data.summary.maxPressure = Math.max(data.summary.maxPressure, pressureValue);
            data.summary.idealCf = Math.max(data.summary.idealCf, idealCf);
            data.summary.deliveredCf = deliveredCf; // Use final value
        }
        
        // Calculate summary values
        data.summary.burnTime = duration;
        data.summary.avgPressure = totalPressure / pressurePoints;
        
        // Calculate total impulse (area under thrust curve)
        data.summary.totalImpulse = data.thrust.reduce((sum, thrust, i) => {
            if (i === 0) return sum;
            return sum + (thrust + data.thrust[i-1]) / 2 * timeStep;
        }, 0);
        
        // Calculate specific impulse
        data.summary.isp = data.summary.totalImpulse / (data.summary.propellantMass * 9.81);
        
        return data;
    }
    
    // Update the summary with calculated values
    function updateSummary(data) {
        // Get unit system
        const isImperial = document.getElementById('unit-toggle').checked;
        
        // Unit conversion factors
        const mpaToPs = 145.038;
        const kgToLb = 2.20462;
        const mmToIn = 0.0393701;
        const kgm2sToLbin2s = 0.2048174;
        
        // Update summary values
        document.getElementById('max-thrust').textContent = data.summary.maxThrust.toFixed(1) + ' ' + 
            (isImperial ? 'lbf' : 'N');
        document.getElementById('total-impulse').textContent = data.summary.totalImpulse.toFixed(1) + ' ' + 
            (isImperial ? 'lbf·s' : 'Ns');
        document.getElementById('burn-time').textContent = data.summary.burnTime.toFixed(2) + ' s';
        
        // Update values in the simulation-data tab
        document.getElementById('total-impulse-value').textContent = data.summary.totalImpulse.toFixed(1) + ' ' + 
            (isImperial ? 'lbf·s' : 'Ns');
        document.getElementById('specific-impulse-value').textContent = data.summary.isp.toFixed(1) + ' s';
        document.getElementById('max-thrust-value').textContent = data.summary.maxThrust.toFixed(1) + ' ' + 
            (isImperial ? 'lbf' : 'N');
        document.getElementById('avg-thrust-value').textContent = data.summary.avgThrust.toFixed(1) + ' ' + 
            (isImperial ? 'lbf' : 'N');
        document.getElementById('burn-time-value').textContent = data.summary.burnTime.toFixed(2) + ' s';
            
        // Update design parameters in the simulation-data tab
        document.getElementById('motor-class-value').textContent = data.summary.motorClass || '-';
        const propellantMass = isImperial ? data.summary.propellantMass * kgToLb : data.summary.propellantMass;
        document.getElementById('propellant-mass-value').textContent = propellantMass.toFixed(3) + ' ' + 
            (isImperial ? 'lb' : 'kg');
        document.getElementById('grain-shape-value').textContent = data.inputs.grainType || '-';
        document.getElementById('nozzle-ratio-value').textContent = data.inputs.expansionRatio.toFixed(1);
        
        // Pressure
        const maxPressure = isImperial ? data.summary.maxPressure * mpaToPs : data.summary.maxPressure;
        document.getElementById('max-pressure').textContent = maxPressure.toFixed(2) + ' ' + 
            (isImperial ? 'psi' : 'MPa');
            
        const avgPressure = isImperial ? data.summary.avgPressure * mpaToPs : data.summary.avgPressure;
        document.getElementById('avg-pressure').textContent = avgPressure.toFixed(2) + ' ' + 
            (isImperial ? 'psi' : 'MPa');
            
        // Also update the chamber pressure in the design parameters
        document.getElementById('chamber-pressure-value').textContent = avgPressure.toFixed(2) + ' ' + 
            (isImperial ? 'psi' : 'MPa');
        
        document.getElementById('isp').textContent = data.summary.isp.toFixed(1) + ' s';
        
        // Mass and dimensions
        const propellantLength = isImperial ? data.summary.propellantLength * mmToIn : data.summary.propellantLength;
        document.getElementById('propellant-length').textContent = propellantLength.toFixed(1) + ' ' + 
            (isImperial ? 'in' : 'mm');
        
        // Volume loading
        document.getElementById('volume-loading').textContent = data.summary.volumeLoading.toFixed(1) + ' %';
        
        // KN values
        document.getElementById('initial-kn').textContent = data.summary.initialKN.toFixed(2);
        document.getElementById('peak-kn').textContent = data.summary.peakKN.toFixed(2);
        
        // Thrust coefficients
        document.getElementById('ideal-cf').textContent = data.summary.idealCf.toFixed(3);
        document.getElementById('delivered-cf').textContent = data.summary.deliveredCf.toFixed(3);
        
        // Throat/port ratio
        document.getElementById('throat-port-ratio').textContent = data.summary.throatPortRatio.toFixed(3);
        
        // Mass flux
        const massFlux = isImperial ? data.summary.peakMassFlux * kgm2sToLbin2s : data.summary.peakMassFlux;
        document.getElementById('peak-mass-flux').textContent = massFlux.toFixed(1) + ' ' + 
            (isImperial ? 'lb/in²s' : 'kg/m²s');
    }
    
    function clearSummary() {
        // Get unit system
        const isImperial = document.getElementById('unit-toggle').checked;
        
        // Reset summary values
        document.getElementById('max-thrust').textContent = '-- ' + 
            (isImperial ? 'lbf' : 'N');
        document.getElementById('total-impulse').textContent = '-- ' + 
            (isImperial ? 'lbf·s' : 'Ns');
        document.getElementById('burn-time').textContent = '-- s';
        document.getElementById('max-pressure').textContent = '-- ' + 
            (isImperial ? 'psi' : 'MPa');
        document.getElementById('avg-pressure').textContent = '-- ' + 
            (isImperial ? 'psi' : 'MPa');
        document.getElementById('isp').textContent = '-- s';
        document.getElementById('propellant-mass').textContent = '-- ' + 
            (isImperial ? 'lb' : 'kg');
        document.getElementById('propellant-length').textContent = '-- ' + 
            (isImperial ? 'in' : 'mm');
        document.getElementById('volume-loading').textContent = '-- %';
        document.getElementById('initial-kn').textContent = '--';
        document.getElementById('peak-kn').textContent = '--';
        document.getElementById('ideal-cf').textContent = '--';
        document.getElementById('delivered-cf').textContent = '--';
        document.getElementById('throat-port-ratio').textContent = '--';
        document.getElementById('peak-mass-flux').textContent = '-- ' + 
            (isImperial ? 'lb/in²s' : 'kg/m²s');
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
        
        // Also update the grain display if it exists
        if (typeof updateGrainDisplay === 'function') {
            updateGrainDisplay();
        }
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

    // Function to create and populate simulation results section
    function createSimulationResultsSection() {
        // We'll no longer create a separate container
        // Instead, we'll use the existing tab content structure
        
        // Get the simulation-data tab content
        const simulationDataTab = document.getElementById('simulation-data');
        
        if (!simulationDataTab) {
            console.error('Simulation data tab not found');
            return null;
        }
        
        // Clear any existing content if needed
        // simulationDataTab.innerHTML = '';
        
        // Return the existing tab content
        return simulationDataTab;
    }

    // Update the updateGraphs function to use our container
    function updateGraphs(data) {
        // We no longer need to check for graphs-container
        // Just make sure we have the graphing module
        if (window.graphingModule) {
            window.graphingModule.updateCharts(data);
        }
    }
    
    // Clear all charts
    function clearGraphs() {
        if (window.graphingModule) {
            window.graphingModule.clearCharts();
        }
    }

    // Function to set up tab content
    function createTabContent() {
        // Create tab content container
        const tabContentContainer = document.createElement('div');
        tabContentContainer.className = 'tab-content-container';
        
        // Thrust curve tab content
        const thrustCurveTab = document.createElement('div');
        thrustCurveTab.id = 'thrust-curve';
        thrustCurveTab.className = 'tab-content active';
        thrustCurveTab.innerHTML = '<div class="chart-container"><canvas id="thrust-chart"></canvas></div>';
        tabContentContainer.appendChild(thrustCurveTab);
        
        // Pressure curve tab content
        const pressureCurveTab = document.createElement('div');
        pressureCurveTab.id = 'pressure-curve';
        pressureCurveTab.className = 'tab-content';
        pressureCurveTab.innerHTML = '<div class="chart-container"><canvas id="pressure-chart"></canvas></div>';
        tabContentContainer.appendChild(pressureCurveTab);
        
        // Grain visualization tab content
        const grainVisualizationTab = document.createElement('div');
        grainVisualizationTab.id = 'grain-visualization';
        grainVisualizationTab.className = 'tab-content';
        grainVisualizationTab.innerHTML = '<div id="visualization-wrapper" class="visualization-wrapper"></div>';
        tabContentContainer.appendChild(grainVisualizationTab);
        
        // Simulation data tab content
        const simulationDataTab = document.createElement('div');
        simulationDataTab.id = 'simulation-data';
        simulationDataTab.className = 'tab-content';
        simulationDataTab.innerHTML = `
            <div class="data-summary">
                <div class="data-card">
                    <h4>Performance</h4>
                    <table id="performance-table" class="data-table">
                        <tr><td>Total Impulse:</td><td id="total-impulse">-</td></tr>
                        <tr><td>Specific Impulse:</td><td id="specific-impulse">-</td></tr>
                        <tr><td>Max Thrust:</td><td id="max-thrust">-</td></tr>
                        <tr><td>Average Thrust:</td><td id="avg-thrust">-</td></tr>
                        <tr><td>Burn Time:</td><td id="burn-time">-</td></tr>
                    </table>
                </div>
                <div class="data-card">
                    <h4>Design Parameters</h4>
                    <table id="design-table" class="data-table">
                        <tr><td>Motor Class:</td><td id="motor-class">-</td></tr>
                        <tr><td>Propellant Mass:</td><td id="propellant-mass">-</td></tr>
                        <tr><td>Grain Shape:</td><td id="grain-shape-value">-</td></tr>
                        <tr><td>Nozzle Expansion Ratio:</td><td id="expansion-ratio">-</td></tr>
                        <tr><td>Chamber Pressure (avg):</td><td id="chamber-pressure">-</td></tr>
                    </table>
                </div>
            </div>
            <div class="data-export">
                <button id="export-results-btn" class="button">Export Results</button>
                <button id="export-csv-btn" class="button">Export CSV</button>
            </div>
        `;
        tabContentContainer.appendChild(simulationDataTab);
        
        return tabContentContainer;
    }

    // Initialize unit selection
    function initializeUnitSelection() {
        // Implementation of initializeUnitSelection function
    }

    // Initialize grain selection
    function initializeGrainSelection() {
        // Implementation of initializeGrainSelection function
    }

    // Initialize propellant selection
    function initializePropellantSelection() {
        // Implementation of initializePropellantSelection function
    }

    // Add event listeners for main buttons
    function handleCalculateButtonClick() {
        // Implementation of handleCalculateButtonClick function
    }

    function handleResetButtonClick() {
        // Implementation of handleResetButtonClick function
    }

    // Add event listeners for the export buttons in the simulation data tab
    function exportSimulationResults() {
        // Check if we have simulation data
        if (!simulationData || !simulationData.summary) {
            alert('No simulation data available to export. Please run a simulation first.');
            return;
        }
        
        // Create a formatted text representation of the results
        let resultsText = 'SRocket Simulation Results\n';
        resultsText += '========================\n\n';
        
        // Add performance data
        resultsText += 'Performance:\n';
        resultsText += `- Total Impulse: ${simulationData.summary.totalImpulse.toFixed(1)} ${isImperial ? 'lbf·s' : 'Ns'}\n`;
        resultsText += `- Specific Impulse: ${simulationData.summary.isp.toFixed(1)} s\n`;
        resultsText += `- Max Thrust: ${simulationData.summary.maxThrust.toFixed(1)} ${isImperial ? 'lbf' : 'N'}\n`;
        resultsText += `- Average Thrust: ${simulationData.summary.avgThrust.toFixed(1)} ${isImperial ? 'lbf' : 'N'}\n`;
        resultsText += `- Burn Time: ${simulationData.summary.burnTime.toFixed(2)} s\n\n`;
        
        // Add design parameters
        resultsText += 'Design Parameters:\n';
        resultsText += `- Motor Class: ${simulationData.summary.motorClass || '-'}\n`;
        resultsText += `- Propellant Mass: ${(isImperial ? simulationData.summary.propellantMass * kgToLb : simulationData.summary.propellantMass).toFixed(3)} ${isImperial ? 'lb' : 'kg'}\n`;
        resultsText += `- Grain Shape: ${simulationData.inputs.grainType || '-'}\n`;
        resultsText += `- Nozzle Expansion Ratio: ${simulationData.inputs.expansionRatio.toFixed(1)}\n`;
        resultsText += `- Chamber Pressure (avg): ${(isImperial ? simulationData.summary.avgPressure * mpaToPs : simulationData.summary.avgPressure).toFixed(2)} ${isImperial ? 'psi' : 'MPa'}\n\n`;
        
        // Add timestamp
        resultsText += `Generated: ${new Date().toLocaleString()}\n`;
        
        // Create a blob and download
        const blob = new Blob([resultsText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'srocket_simulation_results.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function exportSimulationCsv() {
        // Check if we have simulation data
        if (!simulationData || !simulationData.timeData.length === 0) {
            alert('No simulation data available to export. Please run a simulation first.');
            return;
        }
        
        // Create CSV header
        let csvContent = 'Time (s),Thrust (';
        csvContent += isImperial ? 'lbf' : 'N';
        csvContent += '),Pressure (';
        csvContent += isImperial ? 'psi' : 'MPa';
        csvContent += '),Burn Area (';
        csvContent += isImperial ? 'in²' : 'mm²';
        csvContent += '),Regression (';
        csvContent += isImperial ? 'in' : 'mm';
        csvContent += ')\n';
        
        // Add data rows
        simulationData.timeData.forEach((time, index) => {
            const thrust = isImperial ? simulationData.thrustData[index] * nToLbf : simulationData.thrustData[index];
            const pressure = isImperial ? simulationData.pressureData[index] * mpaToPs : simulationData.pressureData[index];
            const burnArea = isImperial ? simulationData.burnAreaData[index] * mm2ToIn2 : simulationData.burnAreaData[index];
            const regression = isImperial ? simulationData.regressionData[index] * mmToIn : simulationData.regressionData[index];
            
            csvContent += `${time.toFixed(3)},${thrust.toFixed(2)},${pressure.toFixed(3)},${burnArea.toFixed(2)},${regression.toFixed(3)}\n`;
        });
        
        // Create a blob and download
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'srocket_simulation_data.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Add event listeners for the export buttons
    document.addEventListener('DOMContentLoaded', function() {
        const exportResultsBtn = document.getElementById('export-results-btn');
        if (exportResultsBtn) {
            exportResultsBtn.addEventListener('click', exportSimulationResults);
        }
        
        const exportCsvBtn = document.getElementById('export-csv-btn');
        if (exportCsvBtn) {
            exportCsvBtn.addEventListener('click', exportSimulationCsv);
        }
    });
}); 