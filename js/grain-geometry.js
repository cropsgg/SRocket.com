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
    
    // Calculate Moon Burner grain geometry
    static calculateMoonBurner(outerDiameter, coreDiameter, coreOffset, length, burnRegression) {
        const outerRadius = outerDiameter / 2;
        const coreRadius = coreDiameter / 2;
        
        // Calculate web thickness (minimum distance from core to outer edge)
        const minWebThickness = outerRadius - coreRadius - coreOffset;
        
        // Check if completely burned
        if (burnRegression >= minWebThickness) {
            return {
                isCompletelyBurned: true,
                burnedRadius: outerRadius,
                webThickness: 0,
                burnArea: 0,
                volume: 0
            };
        }
        
        // Calculate burn surface area
        // This is a simplified calculation - a real moon burner would need
        // more complex math to account for the changing perimeter as burning progresses
        const coreCircumference = 2 * Math.PI * (coreRadius + burnRegression);
        const endFaceArea = Math.PI * Math.pow(outerRadius, 2) - 
                            Math.PI * Math.pow(coreRadius + burnRegression, 2);
        
        const burnArea = coreCircumference * length + 2 * endFaceArea;
        
        // Calculate volume
        const grainVolume = (Math.PI * Math.pow(outerRadius, 2) - 
                             Math.PI * Math.pow(coreRadius + burnRegression, 2)) * length;
        
        return {
            isCompletelyBurned: false,
            burnedRadius: coreRadius + burnRegression,
            webThickness: minWebThickness - burnRegression,
            burnArea,
            volume: grainVolume
        };
    }
    
    // Calculate Rod and Tube grain geometry
    static calculateRodAndTube(outerDiameter, innerDiameter, rodDiameter, length, burnRegression) {
        const outerRadius = outerDiameter / 2;
        const innerRadius = innerDiameter / 2;
        const rodRadius = rodDiameter / 2;
        
        // Calculate web thicknesses
        const tubeWebThickness = outerRadius - innerRadius;
        const gapWebThickness = innerRadius - rodRadius;
        const minWebThickness = Math.min(tubeWebThickness, gapWebThickness);
        
        // Check if completely burned
        if (burnRegression >= minWebThickness) {
            return {
                isCompletelyBurned: true,
                webThickness: 0,
                burnArea: 0,
                volume: 0
            };
        }
        
        // Calculate tube dimensions with burn regression
        const burnedOuterRadius = outerRadius;
        const burnedInnerRadius = innerRadius + burnRegression;
        
        // Calculate rod dimensions with burn regression
        const burnedRodRadius = Math.max(0, rodRadius - burnRegression);
        
        // Calculate burn surface areas
        const tubeInnerSurfaceArea = 2 * Math.PI * burnedInnerRadius * length;
        const tubeEndFaceArea = Math.PI * (Math.pow(burnedOuterRadius, 2) - Math.pow(burnedInnerRadius, 2));
        const rodSurfaceArea = 2 * Math.PI * burnedRodRadius * length;
        const rodEndFaceArea = Math.PI * Math.pow(burnedRodRadius, 2);
        
        const totalBurnArea = tubeInnerSurfaceArea + 2 * tubeEndFaceArea + rodSurfaceArea + 2 * rodEndFaceArea;
        
        // Calculate volume
        const tubeVolume = Math.PI * (Math.pow(burnedOuterRadius, 2) - Math.pow(burnedInnerRadius, 2)) * length;
        const rodVolume = Math.PI * Math.pow(burnedRodRadius, 2) * length;
        const totalVolume = tubeVolume + rodVolume;
        
        return {
            isCompletelyBurned: false,
            webThickness: minWebThickness - burnRegression,
            burnArea: totalBurnArea,
            volume: totalVolume
        };
    }
    
    // Calculate End Burner grain geometry
    static calculateEndBurner(diameter, length, burnRegression) {
        const radius = diameter / 2;
        
        // Check if completely burned
        if (burnRegression >= length) {
            return {
                isCompletelyBurned: true,
                webThickness: 0,
                burnArea: 0,
                volume: 0
            };
        }
        
        // Only the end face burns
        const burnArea = Math.PI * Math.pow(radius, 2);
        
        // Calculate remaining length and volume
        const remainingLength = length - burnRegression;
        const volume = Math.PI * Math.pow(radius, 2) * remainingLength;
        
        return {
            isCompletelyBurned: false,
            webThickness: remainingLength,
            burnArea,
            volume
        };
    }
}

// Export the class
window.GrainGeometry = GrainGeometry; 