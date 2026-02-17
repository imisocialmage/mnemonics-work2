import React, { useRef, useState, useEffect } from 'react';
import { X, Check, ZoomIn, ZoomOut, Move } from 'lucide-react';
import './AssetAI.css'; // Re-use styles

const ImageCropper = ({ imageSrc, targetAspect, onCrop, onCancel }) => {
    const canvasRef = useRef(null);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [imageObj, setImageObj] = useState(null);

    // Initialize Image
    useEffect(() => {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            setImageObj(img);
            // Default: center image
            setPosition({ x: 0, y: 0 });
            setScale(1);
        };
    }, [imageSrc]);

    // Draw Canvas Loop
    useEffect(() => {
        if (!imageObj || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const containerWidth = canvas.width;
        const containerHeight = canvas.height;

        // Clear
        ctx.clearRect(0, 0, containerWidth, containerHeight);
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, containerWidth, containerHeight);

        // Calculate aspect ratio box
        // We want the crop box to be as large as possible within the canvas 
        // while maintaining targetAspect
        let cropW, cropH;
        if (targetAspect >= 1) { // Landscape or Square
            cropW = containerWidth * 0.8;
            cropH = cropW / targetAspect;
        } else { // Portrait
            cropH = containerHeight * 0.8;
            cropW = cropH * targetAspect;
        }

        const cropX = (containerWidth - cropW) / 2;
        const cropY = (containerHeight - cropH) / 2;

        // Save context for clipping
        ctx.save();
        ctx.beginPath();
        ctx.rect(cropX, cropY, cropW, cropH);
        ctx.clip(); // Draw only inside crop area

        // Draw Image
        // Calculate image render dimensions
        const renderW = cropW * scale;
        const renderH = (cropW / (imageObj.width / imageObj.height)) * scale;

        // Draw centered + offset
        const drawX = cropX + (cropW - renderW) / 2 + position.x;
        const drawY = cropY + (cropH - renderH) / 2 + position.y;

        ctx.drawImage(imageObj, drawX, drawY, renderW, renderH);

        ctx.restore();

        // Draw Overlay (Darken outside)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.rect(0, 0, containerWidth, containerHeight); // Full screen
        ctx.rect(cropX, cropY, cropW, cropH); // Hole
        ctx.fill('evenodd');

        // Draw Border
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeRect(cropX, cropY, cropW, cropH);

        // Draw Grid (Rule of Thirds)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Verticals
        ctx.moveTo(cropX + cropW / 3, cropY);
        ctx.lineTo(cropX + cropW / 3, cropY + cropH);
        ctx.moveTo(cropX + (cropW * 2) / 3, cropY);
        ctx.lineTo(cropX + (cropW * 2) / 3, cropY + cropH);
        // Horizontals
        ctx.moveTo(cropX, cropY + cropH / 3);
        ctx.lineTo(cropX + cropW, cropY + cropH / 3);
        ctx.moveTo(cropX, cropY + (cropH * 2) / 3);
        ctx.lineTo(cropX + cropW, cropY + (cropH * 2) / 3);
        ctx.stroke();

    }, [imageObj, scale, position, targetAspect]);

    const handleWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY * -0.001;
        setScale(prev => Math.min(Math.max(0.5, prev + delta), 5));
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => setIsDragging(false);

    const performCrop = () => {
        if (!imageObj) return;

        // Create a new temporary canvas to generate the cropped image
        const outputCanvas = document.createElement('canvas');
        // Determine output resolution (e.g. 1080p based)
        const outputW = 1080;
        const outputH = outputW / targetAspect;

        outputCanvas.width = outputW;
        outputCanvas.height = outputH;
        const outCtx = outputCanvas.getContext('2d');

        // We need to map the visible area on the main canvas to the output canvas
        // This math replicates the render logic but scaled to output

        // "cropW" from the main loop logic (relative to the viewport) matches "outputW"
        // renderW = cropW * scale  ->  outputRenderW = outputW * scale

        const outputRenderW = outputW * scale;
        const outputRenderH = (outputW / (imageObj.width / imageObj.height)) * scale;

        const drawX = (outputW - outputRenderW) / 2 + (position.x * (outputW / (canvasRef.current.width * 0.8 / (targetAspect >= 1 ? 1 : targetAspect))));
        // Note: The position mapping depends on the exact ratio of displayed pixels to logic pixels.
        // Simplified Logic: 
        // 1. Calculate the normalized offset of the image center relative to crop center
        // 2. Apply that normalized offset to the output dimensions

        // Re-calculate the visual crop dimensions from the render loop
        let visualCropW, visualCropH;
        const containerWidth = canvasRef.current.width;
        const containerHeight = canvasRef.current.height;
        if (targetAspect >= 1) {
            visualCropW = containerWidth * 0.8;
            visualCropH = visualCropW / targetAspect;
        } else {
            visualCropH = containerHeight * 0.8;
            visualCropW = visualCropH * targetAspect;
        }

        // position.x is in canvas pixels
        // scaling factor = outputW / visualCropW
        const resolutionFactor = outputW / visualCropW;

        const outDrawX = (outputW - outputRenderW) / 2 + (position.x * resolutionFactor);
        const outDrawY = (outputH - outputRenderH) / 2 + (position.y * resolutionFactor);

        outCtx.drawImage(imageObj, outDrawX, outDrawY, outputRenderW, outputRenderH);

        outputCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            onCrop(url);
        }, 'image/jpeg', 0.95);
    };

    return (
        <div className="image-cropper-overlay">
            <div className="image-cropper-container">
                <div className="cropper-header">
                    <h3>Crop & Resize</h3>
                    <div className="cropper-controls">
                        <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))}><ZoomOut size={16} /></button>
                        <span>{(scale * 100).toFixed(0)}%</span>
                        <button onClick={() => setScale(s => Math.min(5, s + 0.1))}><ZoomIn size={16} /></button>
                    </div>
                </div>

                <div className="cropper-canvas-wrapper">
                    <canvas
                        ref={canvasRef}
                        width={600}
                        height={450}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onWheel={handleWheel}
                    />
                    <div className="cropper-hint">
                        <Move size={14} /> Drag to position, Scroll to zoom
                    </div>
                </div>

                <div className="cropper-footer">
                    <button className="btn-outline-sm" onClick={onCancel}>
                        <X size={16} /> Cancel
                    </button>
                    <button className="btn-primary-sm" onClick={performCrop}>
                        <Check size={16} /> Apply Crop
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageCropper;
