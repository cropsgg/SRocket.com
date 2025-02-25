// Propellant Database Module for SRocket Web

document.addEventListener('DOMContentLoaded', function() {
    // Initialize propellant database
    initPropellantDatabase();
    
    // Get DOM elements
    const newPropellantButton = document.getElementById('new-propellant');
    const importPropellantButton = document.getElementById('import-propellant');
    const propellantEditorModal = document.getElementById('propellant-editor-modal');
    const closeModalButton = document.querySelector('.close-modal');
    const propellantForm = document.getElementById('propellant-form');
    const cancelPropellantButton = document.getElementById('cancel-propellant');
    const savePropellantButton = document.getElementById('save-propellant');
    const customPropellantsContainer = document.getElementById('custom-propellants');
    
    // Standard propellants data (pre-populated)
    const standardPropellants = {
        'knsb': {
            name: 'KNSB',
            description: 'Potassium Nitrate/Sorbitol (65/35)',
            density: 1.841,
            burnRateCoefficient: 8.26,
            burnRateExponent: 0.319,
            specificHeatRatio: 1.131,
            combustionTemperature: 1720,
            exhaustMolarMass: 23.9,
            characteristicVelocity: 2670,
            minPressure: 0.69, // MPa (100 psi)
            maxPressure: 13.79, // MPa (2000 psi)
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
    
    // Event listeners
    if (newPropellantButton) {
        newPropellantButton.addEventListener('click', openNewPropellantEditor);
    }
    
    if (importPropellantButton) {
        importPropellantButton.addEventListener('click', importPropellant);
    }
    
    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeModal);
    }
    
    if (cancelPropellantButton) {
        cancelPropellantButton.addEventListener('click', closeModal);
    }
    
    if (propellantForm) {
        propellantForm.addEventListener('submit', savePropellant);
    }
    
    // Add event listeners to use propellant buttons
    document.querySelectorAll('.use-propellant').forEach(button => {
        button.addEventListener('click', function() {
            const propellantId = this.closest('.propellant-card').dataset.id;
            usePropellant(propellantId);
        });
    });
    
    // Add event listeners to view details buttons
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function() {
            const propellantId = this.closest('.propellant-card').dataset.id;
            viewPropellantDetails(propellantId);
        });
    });
    
    // Initialize tabs in the propellant editor
    const tabButtons = document.querySelectorAll('.tab-button');
    if (tabButtons) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tab = this.dataset.tab;
                
                // Remove active class from all tabs and contents
                document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                this.classList.add('active');
                document.querySelector(`.tab-content[data-tab="${tab}"]`).classList.add('active');
            });
        });
    }
    
    // Initialize propellant database
    function initPropellantDatabase() {
        // Load custom propellants from localStorage
        loadCustomPropellants();
    }
    
    // Load custom propellants from localStorage
    function loadCustomPropellants() {
        const customPropellants = JSON.parse(localStorage.getItem('customPropellants')) || {};
        
        // Clear existing custom propellants
        if (customPropellantsContainer) {
            customPropellantsContainer.innerHTML = '';
        }
        
        // Check if there are any custom propellants
        if (Object.keys(customPropellants).length === 0) {
            if (customPropellantsContainer) {
                customPropellantsContainer.innerHTML = `
                    <div class="empty-state">
                        <p>No custom propellants yet. Click "New Propellant" to create one.</p>
                    </div>
                `;
            }
            return;
        }
        
        // Add custom propellant cards
        for (const id in customPropellants) {
            const propellant = customPropellants[id];
            addPropellantCard(id, propellant, true);
        }
    }
    
    // Add propellant card to the grid
    function addPropellantCard(id, propellant, isCustom = false) {
        const container = isCustom ? customPropellantsContainer : document.querySelector('.propellant-grid');
        
        if (!container) return;
        
        // Remove empty state if present
        const emptyState = container.querySelector('.empty-state');
        if (emptyState) {
            container.removeChild(emptyState);
        }
        
        const card = document.createElement('div');
        card.className = 'propellant-card';
        card.dataset.id = id;
        
        card.innerHTML = `
            <div class="propellant-header">
                <h3>${propellant.name}</h3>
                <span class="propellant-tag ${propellant.category || 'custom'}">${propellant.category || 'Custom'}</span>
            </div>
            <div class="propellant-details">
                <p class="propellant-description">${propellant.description || 'Custom propellant'}</p>
                <div class="propellant-properties">
                    <div class="property">
                        <span class="property-name">Density:</span>
                        <span class="property-value">${propellant.density} g/cm³</span>
                    </div>
                    <div class="property">
                        <span class="property-name">Burn Rate Coef:</span>
                        <span class="property-value">${propellant.burnRateCoefficient} mm/s at 10 bar</span>
                    </div>
                    <div class="property">
                        <span class="property-name">Burn Rate Exp:</span>
                        <span class="property-value">${propellant.burnRateExponent}</span>
                    </div>
                    <div class="property">
                        <span class="property-name">Specific Heat:</span>
                        <span class="property-value">${propellant.specificHeatRatio}</span>
                    </div>
                </div>
            </div>
            <div class="propellant-actions">
                <button class="use-propellant">Use</button>
                <button class="view-details">Details</button>
                ${isCustom ? '<button class="edit-propellant">Edit</button>' : ''}
            </div>
        `;
        
        container.appendChild(card);
        
        // Add event listeners to the new buttons
        const useButton = card.querySelector('.use-propellant');
        if (useButton) {
            useButton.addEventListener('click', function() {
                usePropellant(id);
            });
        }
        
        const detailsButton = card.querySelector('.view-details');
        if (detailsButton) {
            detailsButton.addEventListener('click', function() {
                viewPropellantDetails(id);
            });
        }
        
        const editButton = card.querySelector('.edit-propellant');
        if (editButton) {
            editButton.addEventListener('click', function() {
                editPropellant(id);
            });
        }
    }
    
    // Open the propellant editor for a new propellant
    function openNewPropellantEditor() {
        // Clear the form
        propellantForm.reset();
        
        // Set default values
        document.getElementById('propellant-density').value = '1.8';
        document.getElementById('burn-rate-coefficient').value = '8.0';
        document.getElementById('burn-rate-exponent').value = '0.3';
        document.getElementById('specific-heat-ratio').value = '1.2';
        document.getElementById('combustion-temperature').value = '1700';
        document.getElementById('exhaust-molar-mass').value = '24.0';
        
        // Set the editor mode to 'new'
        propellantForm.dataset.mode = 'new';
        propellantForm.dataset.id = '';
        
        // Show the modal
        propellantEditorModal.style.display = 'block';
    }
    
    // Edit an existing propellant
    function editPropellant(id) {
        // Get the propellant data
        const customPropellants = JSON.parse(localStorage.getItem('customPropellants')) || {};
        const propellant = customPropellants[id];
        
        if (!propellant) {
            alert('Propellant not found.');
            return;
        }
        
        // Fill the form with the propellant data
        document.getElementById('propellant-name').value = propellant.name;
        document.getElementById('propellant-density').value = propellant.density;
        document.getElementById('burn-rate-coefficient').value = propellant.burnRateCoefficient;
        document.getElementById('burn-rate-exponent').value = propellant.burnRateExponent;
        document.getElementById('reference-pressure').value = propellant.referencePressure || '6.9';
        document.getElementById('specific-heat-ratio').value = propellant.specificHeatRatio;
        document.getElementById('combustion-temperature').value = propellant.combustionTemperature;
        document.getElementById('exhaust-molar-mass').value = propellant.exhaustMolarMass;
        document.getElementById('propellant-composition').value = propellant.composition || '';
        document.getElementById('propellant-notes').value = propellant.notes || '';
        
        // Set pressure ranges if available
        if (propellant.pressureRanges && propellant.pressureRanges.length > 0) {
            const range = propellant.pressureRanges[0];
            document.getElementById('min-pressure-1').value = range.minPressure;
            document.getElementById('max-pressure-1').value = range.maxPressure;
            document.getElementById('burn-rate-coef-1').value = range.burnRateCoef;
            document.getElementById('burn-rate-exp-1').value = range.burnRateExp;
        } else {
            document.getElementById('min-pressure-1').value = propellant.minPressure || '0';
            document.getElementById('max-pressure-1').value = propellant.maxPressure || '10';
            document.getElementById('burn-rate-coef-1').value = propellant.burnRateCoefficient;
            document.getElementById('burn-rate-exp-1').value = propellant.burnRateExponent;
        }
        
        // Set the editor mode to 'edit'
        propellantForm.dataset.mode = 'edit';
        propellantForm.dataset.id = id;
        
        // Show the modal
        propellantEditorModal.style.display = 'block';
    }
    
    // View detailed information about a propellant
    function viewPropellantDetails(id) {
        // Get the propellant data
        let propellant;
        
        if (standardPropellants[id]) {
            propellant = standardPropellants[id];
        } else {
            const customPropellants = JSON.parse(localStorage.getItem('customPropellants')) || {};
            propellant = customPropellants[id];
        }
        
        if (!propellant) {
            alert('Propellant not found.');
            return;
        }
        
        // Create a dialog with detailed information
        const dialog = document.createElement('div');
        dialog.className = 'modal';
        dialog.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${propellant.name} Details</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="propellant-details-view">
                        <div class="detail-section">
                            <h3>Basic Properties</h3>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <span class="detail-label">Description:</span>
                                    <span class="detail-value">${propellant.description || 'Not specified'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Density:</span>
                                    <span class="detail-value">${propellant.density} g/cm³</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Burn Rate Coefficient:</span>
                                    <span class="detail-value">${propellant.burnRateCoefficient} mm/s at ${propellant.referencePressure || 6.9} MPa</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Burn Rate Exponent:</span>
                                    <span class="detail-value">${propellant.burnRateExponent}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Specific Heat Ratio:</span>
                                    <span class="detail-value">${propellant.specificHeatRatio}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>Advanced Properties</h3>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <span class="detail-label">Combustion Temperature:</span>
                                    <span class="detail-value">${propellant.combustionTemperature} K</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Exhaust Molar Mass:</span>
                                    <span class="detail-value">${propellant.exhaustMolarMass} g/mol</span>
                                </div>
                                ${propellant.characteristicVelocity ? `
                                <div class="detail-item">
                                    <span class="detail-label">Characteristic Velocity:</span>
                                    <span class="detail-value">${propellant.characteristicVelocity} m/s</span>
                                </div>` : ''}
                                ${propellant.composition ? `
                                <div class="detail-item">
                                    <span class="detail-label">Composition:</span>
                                    <span class="detail-value">${propellant.composition}</span>
                                </div>` : ''}
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>Pressure Ranges</h3>
                            ${propellant.pressureRanges && propellant.pressureRanges.length > 0 ? `
                            <div class="pressure-ranges-list">
                                ${propellant.pressureRanges.map((range, index) => `
                                <div class="pressure-range-item">
                                    <h4>Range ${index + 1}</h4>
                                    <div class="detail-grid">
                                        <div class="detail-item">
                                            <span class="detail-label">Pressure Range:</span>
                                            <span class="detail-value">${range.minPressure} - ${range.maxPressure} MPa</span>
                                        </div>
                                        <div class="detail-item">
                                            <span class="detail-label">Burn Rate Coefficient:</span>
                                            <span class="detail-value">${range.burnRateCoef} mm/s</span>
                                        </div>
                                        <div class="detail-item">
                                            <span class="detail-label">Burn Rate Exponent:</span>
                                            <span class="detail-value">${range.burnRateExp}</span>
                                        </div>
                                    </div>
                                </div>
                                `).join('')}
                            </div>` : `
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <span class="detail-label">Minimum Pressure:</span>
                                    <span class="detail-value">${propellant.minPressure || 0} MPa</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Maximum Pressure:</span>
                                    <span class="detail-value">${propellant.maxPressure || 10} MPa</span>
                                </div>
                            </div>`}
                        </div>
                        
                        ${propellant.notes ? `
                        <div class="detail-section">
                            <h3>Notes</h3>
                            <p>${propellant.notes}</p>
                        </div>` : ''}
                    </div>
                    <div class="modal-actions">
                        <button class="secondary-button close-details">Close</button>
                        <button class="primary-button use-this-propellant">Use This Propellant</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add the dialog to the page
        document.body.appendChild(dialog);
        
        // Close button event
        const closeButton = dialog.querySelector('.close-modal');
        closeButton.addEventListener('click', function() {
            document.body.removeChild(dialog);
        });
        
        // Close details button event
        const closeDetailsButton = dialog.querySelector('.close-details');
        closeDetailsButton.addEventListener('click', function() {
            document.body.removeChild(dialog);
        });
        
        // Use propellant button event
        const useButton = dialog.querySelector('.use-this-propellant');
        useButton.addEventListener('click', function() {
            usePropellant(id);
            document.body.removeChild(dialog);
        });
        
        // Close when clicking outside the content
        dialog.addEventListener('click', function(e) {
            if (e.target === dialog) {
                document.body.removeChild(dialog);
            }
        });
    }
    
    // Use a propellant in the simulation
    function usePropellant(id) {
        // Get the propellant data
        let propellant;
        
        if (standardPropellants[id]) {
            propellant = standardPropellants[id];
        } else {
            const customPropellants = JSON.parse(localStorage.getItem('customPropellants')) || {};
            propellant = customPropellants[id];
        }
        
        if (!propellant) {
            alert('Propellant not found.');
            return;
        }
        
        // Save the selected propellant to localStorage for use in the simulation
        localStorage.setItem('selectedPropellant', JSON.stringify(propellant));
        
        // Redirect to the simulation page
        window.location.href = 'simulation.html';
    }
    
    // Close the propellant editor modal
    function closeModal() {
        propellantEditorModal.style.display = 'none';
    }
    
    // Save a propellant
    function savePropellant(e) {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('propellant-name').value;
        const density = parseFloat(document.getElementById('propellant-density').value);
        const burnRateCoefficient = parseFloat(document.getElementById('burn-rate-coefficient').value);
        const burnRateExponent = parseFloat(document.getElementById('burn-rate-exponent').value);
        const referencePressure = parseFloat(document.getElementById('reference-pressure').value);
        const specificHeatRatio = parseFloat(document.getElementById('specific-heat-ratio').value);
        const combustionTemperature = parseFloat(document.getElementById('combustion-temperature').value);
        const exhaustMolarMass = parseFloat(document.getElementById('exhaust-molar-mass').value);
        const composition = document.getElementById('propellant-composition').value;
        const notes = document.getElementById('propellant-notes').value;
        
        // Get pressure range data
        const minPressure = parseFloat(document.getElementById('min-pressure-1').value);
        const maxPressure = parseFloat(document.getElementById('max-pressure-1').value);
        const burnRateCoef = parseFloat(document.getElementById('burn-rate-coef-1').value);
        const burnRateExp = parseFloat(document.getElementById('burn-rate-exp-1').value);
        
        // Create pressure range object
        const pressureRange = {
            minPressure,
            maxPressure,
            burnRateCoef,
            burnRateExp
        };
        
        // Create propellant object
        const propellant = {
            name,
            density,
            burnRateCoefficient,
            burnRateExponent,
            referencePressure,
            specificHeatRatio,
            combustionTemperature,
            exhaustMolarMass,
            composition,
            notes,
            pressureRanges: [pressureRange],
            minPressure,
            maxPressure,
            category: 'custom'
        };
        
        // Get existing custom propellants
        const customPropellants = JSON.parse(localStorage.getItem('customPropellants')) || {};
        
        // Check if we're editing or creating a new propellant
        const mode = propellantForm.dataset.mode;
        let id;
        
        if (mode === 'edit') {
            // Use the existing ID
            id = propellantForm.dataset.id;
        } else {
            // Generate a new ID
            id = 'custom-' + Date.now();
        }
        
        // Add or update the propellant
        customPropellants[id] = propellant;
        
        // Save to localStorage
        localStorage.setItem('customPropellants', JSON.stringify(customPropellants));
        
        // Update the UI
        if (mode === 'edit') {
            // Find and update the existing card
            const card = document.querySelector(`.propellant-card[data-id="${id}"]`);
            if (card) {
                card.querySelector('h3').textContent = name;
                card.querySelector('.propellant-description').textContent = composition || 'Custom propellant';
                card.querySelector('.property-value').textContent = `${density} g/cm³`;
                card.querySelectorAll('.property-value')[1].textContent = `${burnRateCoefficient} mm/s at 10 bar`;
                card.querySelectorAll('.property-value')[2].textContent = burnRateExponent;
                card.querySelectorAll('.property-value')[3].textContent = specificHeatRatio;
            }
        } else {
            // Add a new card
            addPropellantCard(id, propellant, true);
        }
        
        // Close the modal
        closeModal();
        
        // Show success message
        alert(`Propellant ${mode === 'edit' ? 'updated' : 'created'} successfully.`);
    }
    
    // Import a propellant from a file
    function importPropellant() {
        // Create file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        
        // Add event listener for file selection
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    try {
                        const propellant = JSON.parse(e.target.result);
                        
                        // Validate the propellant data
                        if (!propellant.name || !propellant.density || !propellant.burnRateCoefficient || !propellant.burnRateExponent) {
                            alert('Invalid propellant data. Missing required fields.');
                            return;
                        }
                        
                        // Generate a new ID
                        const id = 'imported-' + Date.now();
                        
                        // Add category if not present
                        if (!propellant.category) {
                            propellant.category = 'custom';
                        }
                        
                        // Get existing custom propellants
                        const customPropellants = JSON.parse(localStorage.getItem('customPropellants')) || {};
                        
                        // Add the propellant
                        customPropellants[id] = propellant;
                        
                        // Save to localStorage
                        localStorage.setItem('customPropellants', JSON.stringify(customPropellants));
                        
                        // Add a new card
                        addPropellantCard(id, propellant, true);
                        
                        // Show success message
                        alert('Propellant imported successfully.');
                    } catch (error) {
                        console.error('Error importing propellant:', error);
                        alert('Error importing propellant. Invalid file format.');
                    }
                };
                
                reader.readAsText(file);
            }
        });
        
        // Trigger the file input
        fileInput.click();
    }
}); 