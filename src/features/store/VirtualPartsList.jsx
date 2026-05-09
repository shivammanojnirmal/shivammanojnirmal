import React from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { PartCard } from './PartCard';

/**
 * Optimized virtualized list for thousands of parts.
 * Note: Uses FixedSizeGrid for simplicity.
 */
export const VirtualPartsList = ({ items, width, height }) => {
    const columnCount = width > 1024 ? 4 : width > 768 ? 3 : width > 640 ? 2 : 1;
    const rowCount = Math.ceil(items.length / columnCount);
    
    const columnWidth = width / columnCount;
    const rowHeight = 480; // Fixed height for PartCard

    const Cell = ({ columnIndex, rowIndex, style }) => {
        const index = rowIndex * columnCount + columnIndex;
        const item = items[index];

        if (!item) return null;

        return (
            <div style={{
                ...style,
                padding: '12px'
            }}>
                <PartCard part={item} />
            </div>
        );
    };

    return (
        <Grid
            columnCount={columnCount}
            columnWidth={columnWidth}
            height={height}
            rowCount={rowCount}
            rowHeight={rowHeight}
            width={width}
            style={{ overflowX: 'hidden' }}
        >
            {Cell}
        </Grid>
    );
};