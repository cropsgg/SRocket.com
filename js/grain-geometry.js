// Grain Geometry Calculations

class GrainGeometry {
    constructor(parameters) {
        this.parameters = parameters;
    }

    // Calculate BATES grain geometry
    static calculateBATES(outerDiameter, innerDiameter, length, segments, burnRegression) {
        const outerRadius = outerDiameter / 2;
        const innerRadius = innerDiameter / 2;
        const burnedRadius = innerRadius + burnRegression;
        
        // Check if grain is completely burned
        if (burnedRadius >= outerRadius) {
            return {
                isCompletelyBurned: true,
                burnedRadius: outerRadius,
                webThickness: 0,
                burnArea: 0,
                volume: 0
            };
        }

        // Calculate web thickness
        const webThickness = outerRadius - burnedRadius;

        // Calculate burn surface area
        const endFaceArea = Math.PI * (Math.pow(outerRadius, 2) - Math.pow(burnedRadius, 2));
        const innerSurfaceArea = 2 * Math.PI * burnedRadius * length * segments;
        const totalBurnArea = 2 * endFaceArea * segments + innerSurfaceArea;

        // Calculate remaining volume
        const grainVolume = (Math.PI * (Math.pow(outerRadius, 2) - Math.pow(burnedRadius, 2)) * length) * segments;

        return {
            isCompletelyBurned: false,
            burnedRadius,
            webThickness,
            burnArea: totalBurnArea,
            volume: grainVolume
        };
    }

    // Calculate Finocyl grain geometry
    static calculateFinocyl(outerDiameter, innerDiameter, finCount, finWidth, finHeight, length, burnRegression) {
        const outerRadius = outerDiameter / 2;
        const innerRadius = innerDiameter / 2;
        const burnedRadius = innerRadius + burnRegression;
        
        // Base calculations similar to BATES
        const baseGeometry = this.calculateBATES(outerDiameter, innerDiameter, length, 1, burnRegression);
        
        if (baseGeometry.isCompletelyBurned) {
            return baseGeometry;
        }

        // Calculate fin burn area
        const finBurnArea = finCount * (
            2 * finHeight * (length - 2 * burnRegression) + // Fin sides
            2 * finWidth * (finHeight - burnRegression) + // Fin top/bottom
            Math.PI * burnRegression * (finHeight - burnRegression) // Fin rounded edges
        );

        return {
            ...baseGeometry,
            burnArea: baseGeometry.burnArea + finBurnArea
        };
    }

    // Calculate Star grain geometry
    static calculateStar(outerDiameter, pointCount, pointDepth, pointAngle, length, burnRegression) {
        const outerRadius = outerDiameter / 2;
        
        // Complex star grain calculations
        // This is a simplified version - real star grains need more complex math
        const pointRadius = outerRadius - pointDepth;
        const angleStep = (2 * Math.PI) / pointCount;
        
        let burnArea = 0;
        let volume = 0;

        // Calculate burn perimeter and area
        for (let i = 0; i < pointCount; i++) {
            const angle = i * angleStep;
            const nextAngle = (i + 1) * angleStep;
            
            // Add surface area for each point
            burnArea += length * (
                Math.sqrt(
                    Math.pow(outerRadius * Math.cos(angle) - outerRadius * Math.cos(nextAngle), 2) +
                    Math.pow(outerRadius * Math.sin(angle) - outerRadius * Math.sin(nextAngle), 2)
                )
            );
        }

        // Adjust for burn regression
        burnArea = burnArea * (1 - burnRegression / pointDepth);
        volume = Math.PI * Math.pow(outerRadius, 2) * length * (1 - burnRegression / pointDepth);

        return {
            isCompletelyBurned: burnRegression >= pointDepth,
            burnedRadius: outerRadius - burnRegression,
            webThickness: pointDepth - burnRegression,
            burnArea,
            volume
        };
    }
}

// Export the class
window.GrainGeometry = GrainGeometry; 