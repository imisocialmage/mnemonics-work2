import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { COMPASS_NODES, getHighlightedPositions } from '../../data/compassData';
import './Compass.css';

const CompassWheel = ({ selectedObjective, onNodeClick, centerFocus, apexPosition }) => {
    // Local state to manage the 1.8s animation sequence
    const [isRotating, setIsRotating] = useState(false);
    const [visibleHighlights, setVisibleHighlights] = useState([]);
    const [visibleApex, setVisibleApex] = useState(null);

    // Effect to handle the sequence when apexPosition changes
    useEffect(() => {
        if (apexPosition) {
            // Start Rotation: Hide dots/highlights immediately
            setIsRotating(true);
            setVisibleHighlights([]);
            setVisibleApex(null);

            // Wait 1.8s (1800ms) for rotation to complete, then show highlights
            const timer = setTimeout(() => {
                setIsRotating(false);
                setVisibleApex(apexPosition);
                // Calculate highlights based on the APEX, not just objective target
                // Original used "getHighlightedPositions(apexPosition)" for ANY click.
                setVisibleHighlights(getHighlightedPositions(apexPosition));
            }, 1800);

            return () => clearTimeout(timer);
        } else {
            // Reset if nothing selected
            setIsRotating(false);
            setVisibleHighlights([]);
            setVisibleApex(null);
        }
    }, [apexPosition]);

    // Determine relevant positions
    const apexPos = apexPosition;

    // Calculate rotation angle
    const positionToAngle = {
        1: 0, 2: 45, 3: 90, 4: 135,
        5: 180, 6: 225, 7: 270, 8: 315
    };

    const rotation = apexPos ? positionToAngle[apexPos] : 0;

    // Helper to get Center Text
    // Helper to get Center Text
    const getCenterText = () => {
        // Center text is controlled by the dropdown "Center Focus"
        return centerFocus ? centerFocus.charAt(0).toUpperCase() + centerFocus.slice(1) + '?' : 'Who?';
    };

    return (
        <div className="compass-container">
            <div className="compass-wheel">
                <div className="outer-ring"></div>

                {/* Decorative Dots - Matches original logic: "Clear previous state - HIDE dots during rotation" */}
                {Object.values(COMPASS_NODES).map((node) => {
                    const isApex = visibleApex === node.position;
                    const isHighlighted = visibleHighlights.includes(node.position);
                    const angle = (node.position - 1) * 45;

                    // Only render or show class if highlighted AND not rotating
                    const showDot = (isHighlighted || isApex) && !isRotating;

                    return (
                        <div
                            key={`dot-${node.id}`}
                            className="dot-positioner"
                            style={{
                                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(calc(-1 * var(--radius))) rotate(-${angle}deg)`
                            }}
                        >
                            {/* Original used #dot1, #dot2 etc. We map them dynamically. */}
                            <div className={`triangle-dot ${showDot ? 'active' : ''} ${isApex && showDot ? 'pulsing' : ''}`} />
                        </div>
                    );
                })}

                {/* Nodes */}
                {Object.values(COMPASS_NODES).map((node) => {
                    const isHighlighted = visibleHighlights.includes(node.position);
                    // Original only pulsed the highlights (green/red pulse).
                    // ".compass-segment.highlighted .compass-node { ... animation: colorPulse ... }"

                    const angle = (node.position - 1) * 45;

                    return (
                        <div
                            key={node.id}
                            className="compass-node-wrapper"
                            style={{
                                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(calc(-1 * var(--radius))) rotate(-${angle}deg)`
                            }}
                            onClick={() => onNodeClick(node)}
                        >
                            {/* Highlight class triggers the colorPulse animation */}
                            <div className={`compass-node ${isHighlighted ? 'highlighted' : ''}`}>
                                {node.label}
                            </div>
                        </div>
                    );
                })}

                {/* Compass Cross Arrows */}
                <div className="compass-cross">
                    <div className="arrow-up"></div>
                    <div className="arrow-down"></div>
                    <div className="arrow-left"></div>
                    <div className="arrow-right"></div>
                </div>

                {/* Center Visuals */}
                <div className="center-square"></div>
                <div className="center-circle">
                    <span className="center-text">{getCenterText()}</span>
                </div>

                {/* Rotating Triangle */}
                <div className="triangle-wrapper">
                    <motion.div
                        className="triangle-rotator"
                        animate={{
                            rotate: rotation,
                        }}
                        transition={{ duration: 1.8, ease: [0.68, -0.55, 0.265, 1.55] }} // Matches cubic-bezier in original CSS
                        style={{ transformOrigin: 'center center' }}
                    >
                        <svg viewBox="0 0 400 400" className="triangle-svg">
                            {/* 
                                Original: 
                                .rotating-triangle.initial .triangle-svg { animation: triangleGlowInitial ... }
                                .rotating-triangle.active .triangle-svg { animation: triangleGlowFinal ... }
                                
                                We can simulate this by checking if we have an apex (active) or not.
                            */}
                            <defs>
                                <filter id="glow-initial">
                                    <feDropShadow dx="0" dy="0" stdDeviation="15" floodColor="rgba(255, 215, 0, 0.8)" />
                                </filter>
                                <filter id="glow-final">
                                    <feDropShadow dx="0" dy="0" stdDeviation="15" floodColor="rgba(255, 92, 87, 0.8)" />
                                </filter>
                            </defs>

                            <path
                                d="M 200 30 L 360 350 L 40 350 Z"
                                fill="none"
                                stroke={apexPos ? "#FF5C57" : "#FFD700"}
                                strokeWidth="8"
                                strokeLinejoin="round"
                                style={{
                                    transition: "stroke 1s ease",
                                    filter: apexPos ? "url(#glow-final)" : "url(#glow-initial)"
                                }}
                            />
                        </svg>
                    </motion.div>
                </div>

            </div>
        </div>
    );
};

export default CompassWheel;
