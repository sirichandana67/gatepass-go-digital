
import React from 'react';

// This is a simple placeholder for a QR code component
// In a real app, you would use a library like react-qr-code
const QRCode = ({ value }) => {
  // Generate a pattern based on the value for visual difference
  const pattern = Array.from(value).map(char => char.charCodeAt(0) % 2 === 0 ? '1' : '0').join('');
  
  return (
    <div className="qr-container">
      <div style={{ width: '150px', height: '150px', display: 'flex', flexDirection: 'column' }}>
        {/* This creates a simple visual representation */}
        {Array.from({ length: 10 }).map((_, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', flex: 1 }}>
            {Array.from({ length: 10 }).map((_, colIndex) => {
              const index = rowIndex * 10 + colIndex;
              const isDark = pattern[index % pattern.length] === '1';
              
              // Add fixed patterns for QR code corners
              const isCorner = (rowIndex < 3 && colIndex < 3) || 
                              (rowIndex < 3 && colIndex > 6) || 
                              (rowIndex > 6 && colIndex < 3);
              
              return (
                <div 
                  key={colIndex} 
                  style={{ 
                    flex: 1, 
                    backgroundColor: isCorner ? '#333' : isDark ? '#333' : '#fff',
                    border: '1px solid #ddd' 
                  }} 
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="text-center mt-10" style={{ fontSize: '12px' }}>
        ID: {value}
      </div>
    </div>
  );
};

export default QRCode;
