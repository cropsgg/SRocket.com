// Grain Shape Gallery for SRocket Web
// Provides visual examples of different grain shapes

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the gallery
    initGrainShapeGallery();
    
    // Attach listener to grain shape selector
    const grainShapeSelect = document.getElementById('grain-shape');
    if (grainShapeSelect) {
        grainShapeSelect.addEventListener('change', function() {
            updateGrainShapeGallery(this.value);
        });
        
        // Initialize with current value
        updateGrainShapeGallery(grainShapeSelect.value);
    }
    
    // Show grain shape info when clicking on the info button
    const grainInfoBtn = document.getElementById('grain-info-btn');
    if (grainInfoBtn) {
        grainInfoBtn.addEventListener('click', function() {
            toggleGrainGallery();
        });
    }
});

// Initialize the grain shape gallery
function initGrainShapeGallery() {
    // Check if the gallery container exists, if not create it
    let galleryContainer = document.getElementById('grain-shape-gallery');
    if (!galleryContainer) {
        galleryContainer = document.createElement('div');
        galleryContainer.id = 'grain-shape-gallery';
        galleryContainer.className = 'grain-gallery-container';
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'grain-gallery-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', function() {
            galleryContainer.classList.remove('visible');
        });
        galleryContainer.appendChild(closeBtn);
        
        // Create gallery title
        const galleryTitle = document.createElement('h3');
        galleryTitle.textContent = 'Grain Shape Reference';
        galleryContainer.appendChild(galleryTitle);
        
        // Create gallery content
        const galleryContent = document.createElement('div');
        galleryContent.className = 'grain-gallery-content';
        galleryContainer.appendChild(galleryContent);
        
        // Grain types to display
        const grainTypes = [
            {
                id: 'bates',
                name: 'BATES',
                description: 'Cylindrical grain with a central perforation. Provides neutral to slightly progressive burning profile.',
                parameters: ['Outer Diameter', 'Inner Diameter', 'Length', 'Number of Segments']
            },
            {
                id: 'finocyl',
                name: 'Finocyl',
                description: 'Cylindrical grain with central perforation and radial fins. Provides high initial thrust with progressive-regressive profile.',
                parameters: ['Outer Diameter', 'Inner Diameter', 'Fin Count', 'Fin Height', 'Fin Width', 'Length']
            },
            {
                id: 'star',
                name: 'Star',
                description: 'Cylindrical grain with star-shaped central perforation. Provides neutral burning profile.',
                parameters: ['Outer Diameter', 'Number of Points', 'Point Depth', 'Point Angle', 'Length']
            },
            {
                id: 'moonburner',
                name: 'Moon Burner',
                description: 'Cylindrical grain with an offset circular perforation. Provides progressive burning profile.',
                parameters: ['Outer Diameter', 'Core Diameter', 'Core Offset', 'Length']
            },
            {
                id: 'rodandtube',
                name: 'Rod & Tube',
                description: 'Combination of solid rod surrounded by a tube with a gap. Provides regressive then progressive profile.',
                parameters: ['Outer Diameter', 'Inner Diameter', 'Rod Diameter', 'Length']
            },
            {
                id: 'endburner',
                name: 'End Burner',
                description: 'Solid cylinder that burns from one end. Provides very regressive burning profile.',
                parameters: ['Diameter', 'Length']
            },
            {
                id: 'custom',
                name: 'Custom',
                description: 'Custom grain shape defined by DXF file upload.',
                parameters: ['DXF File']
            }
        ];
        
        // Create a section for each grain type
        grainTypes.forEach(grain => {
            const section = document.createElement('div');
            section.className = 'grain-gallery-item';
            section.id = `grain-gallery-${grain.id}`;
            
            // Create header
            const header = document.createElement('h4');
            header.textContent = grain.name;
            section.appendChild(header);
            
            // Create canvas for visualization
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            canvas.id = `grain-gallery-canvas-${grain.id}`;
            section.appendChild(canvas);
            
            // Add description
            const description = document.createElement('p');
            description.textContent = grain.description;
            section.appendChild(description);
            
            // Add parameters
            const paramList = document.createElement('div');
            paramList.className = 'grain-parameters';
            const paramTitle = document.createElement('strong');
            paramTitle.textContent = 'Parameters:';
            paramList.appendChild(paramTitle);
            
            const paramUL = document.createElement('ul');
            grain.parameters.forEach(param => {
                const paramLI = document.createElement('li');
                paramLI.textContent = param;
                paramUL.appendChild(paramLI);
            });
            paramList.appendChild(paramUL);
            section.appendChild(paramList);
            
            // Add button to select this grain type
            const selectBtn = document.createElement('button');
            selectBtn.className = 'grain-select-btn';
            selectBtn.textContent = 'Select This Shape';
            selectBtn.dataset.grainType = grain.id;
            selectBtn.addEventListener('click', function() {
                const grainShapeSelect = document.getElementById('grain-shape');
                if (grainShapeSelect) {
                    grainShapeSelect.value = this.dataset.grainType;
                    // Trigger change event
                    const event = new Event('change');
                    grainShapeSelect.dispatchEvent(event);
                }
                galleryContainer.classList.remove('visible');
            });
            section.appendChild(selectBtn);
            
            galleryContent.appendChild(section);
        });
        
        // Append to the document
        document.body.appendChild(galleryContainer);
        
        // Draw all grain shapes
        drawAllGrainShapes();
    }
}

// Toggle the grain gallery visibility
function toggleGrainGallery() {
    const gallery = document.getElementById('grain-shape-gallery');
    if (gallery) {
        gallery.classList.toggle('visible');
    }
}

// Draw all grain shapes
function drawAllGrainShapes() {
    drawBATESGrain('grain-gallery-canvas-bates');
    drawFinocylGrain('grain-gallery-canvas-finocyl');
    drawStarGrain('grain-gallery-canvas-star');
    drawMoonburnerGrain('grain-gallery-canvas-moonburner');
    drawRodAndTubeGrain('grain-gallery-canvas-rodandtube');
    drawEndburnerGrain('grain-gallery-canvas-endburner');
    drawCustomGrain('grain-gallery-canvas-custom');
}

// Update the grain shape gallery to highlight selected shape
function updateGrainShapeGallery(shapeType) {
    const galleryItems = document.querySelectorAll('.grain-gallery-item');
    galleryItems.forEach(item => {
        item.classList.remove('selected');
    });
    
    const selectedItem = document.getElementById(`grain-gallery-${shapeType}`);
    if (selectedItem) {
        selectedItem.classList.add('selected');
    }
}

// Helper function to draw a BATES grain
function drawBATESGrain(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
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
    
    // Add labels
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('BATES Grain', centerX, height - 10);
}

// Helper function to draw a Finocyl grain
function drawFinocylGrain(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
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
    
    // Add labels
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Finocyl Grain', centerX, height - 10);
}

// Helper function to draw a Star grain
function drawStarGrain(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
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
    
    // Add labels
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Star Grain', centerX, height - 10);
}

// Helper function to draw a Moonburner grain
function drawMoonburnerGrain(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
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
    
    // Add labels
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Moon Burner Grain', centerX, height - 10);
}

// Helper function to draw a Rod and Tube grain
function drawRodAndTubeGrain(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
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
    
    // Add labels
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Rod & Tube Grain', centerX, height - 10);
}

// Helper function to draw an End Burner grain
function drawEndburnerGrain(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw cross-section (longitudinal)
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width * 0.4;
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
    
    // Add labels
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('End Burner Grain', centerX, height - 10);
}

// Helper function to draw a Custom grain
function drawCustomGrain(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
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
    
    // Add labels
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Custom Grain', centerX, height - 10);
} 