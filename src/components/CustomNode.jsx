import React from 'react';
import { Handle, Position } from '@xyflow/react';

const CustomNode = ({ id, data }) => {
  // Assign colors based on entity (simplified mapping)
  const getNodeColor = () => {
    switch (data.entity) {
      case 'Whitebit':
        return 'bg-orange-400';
      case 'Changenow':
        return 'bg-green-400';
      case 'Square':
        return 'bg-yellow-400';
      default:
        return 'bg-purple-400';
    }
  };

  return (
    <div className={`px-4 py-2 shadow-md rounded-full ${getNodeColor()} border-2 border-gray-300 flex items-center justify-center relative`}>
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ background: '#fff', left: '-8px', top: '50%', transform: 'translateY(-50%)' }} 
      />
      <div className="text-white font-bold text-center">{data.label}</div>
      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ background: '#fff', right: '-8px', top: '50%', transform: 'translateY(-50%)' }} 
      />
    </div>
  );
};

export default CustomNode;