import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
} from "@xyflow/react";
import { useSelector, useDispatch } from "react-redux";
import CustomNode from "./CustomNode";
import {
  setNodes as setReduxNodes,
  setEdges as setReduxEdges,
  addEdge,
} from "../redux/slices/graphSlice";
import "@xyflow/react/dist/style.css";
import * as htmlToImage from 'html-to-image';

const GraphContent = ({
  isDarkMode,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
}) => {
  const reactFlowWrapper = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const reactFlowInstance = useRef(null); // Ref to store ReactFlow instance

  const exportImage = useCallback(() => {
    const reactFlowElement = reactFlowWrapper.current?.querySelector('.react-flow');
  
    if (!reactFlowElement) {
      console.error("React Flow canvas not found.");
      return;
    }
  
    htmlToImage.toPng(reactFlowElement, {
      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
      filter: (node) => {
        // Filter out minimap, controls, etc.
        if (
          node?.classList?.contains('react-flow__controls') ||
          node?.classList?.contains('react-flow__minimap')
        ) {
          return false;
        }
        return true;
      },
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'wallet-graph.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('PNG export failed:', err);
      });
  }, [isDarkMode]);
  
  
  
  
  const getTooltipPosition = (node) => {
    const wrapper = reactFlowWrapper.current;
    if (!wrapper) return { x: 0, y: 0 };

    const nodeElement = wrapper.querySelector(`[data-id="${node.id}"]`);
    if (!nodeElement) return { x: 0, y: 0 };

    const nodeRect = nodeElement.getBoundingClientRect();

    const tooltipWidth = 200;
    const offsetLeft = 215; // change the value to get more left
    const x =
      nodeRect.left + nodeRect.width / 2 - tooltipWidth / 2 - offsetLeft;
    const y = nodeRect.bottom + 8;

    return { x, y };
  };

  return (
    <div ref={reactFlowWrapper} id="reactflow-canvas" className="h-full w-full relative" style={{height: '100vh'}}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={{ wallet: CustomNode }}
        fitView
        minZoom={0.1}
        maxZoom={4}
        defaultViewport={{ x: 0, y: 300, zoom: 1 }}
        colorMode={isDarkMode ? "dark" : "light"}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={false}
        panOnDrag={true}
        panOnScroll={false}
        onInit={(instance) => {
          console.log("ReactFlow initialized:", instance);
          reactFlowInstance.current = instance; // Store the instance
        }}
        onClick={() => console.log("ReactFlow canvas clicked")}
        onNodeMouseEnter={(event, node) => setHoveredNode(node)}
        onNodeMouseLeave={() => setHoveredNode(null)}
        onPaneDrag={() => hoveredNode && setHoveredNode({ ...hoveredNode })} // Re-trigger tooltip on pan
        onMove={() => hoveredNode && setHoveredNode({ ...hoveredNode })} // Re-trigger on zoom/move
        edgeTypes={{
          default: ({ sourceX, sourceY, targetX, targetY, data }) => {
            const label = data?.label || "N/A";
            const textLength = label.length * 8;
            const edgeColor = isDarkMode ? "#fff" : "#4B5563";
            const backgroundColor = "#FDDAFF";

            return (
              <svg>
                <path
                  d={`M ${sourceX} ${sourceY} C ${sourceX + 50} ${sourceY} ${
                    targetX - 50
                  } ${targetY} ${targetX} ${targetY}`}
                  stroke={edgeColor}
                  strokeWidth={2}
                  fill="none"
                />
                <rect
                  x={(sourceX + targetX) / 2 - textLength / 2 - 4}
                  y={(sourceY + targetY) / 2 - 10}
                  width={textLength + 8}
                  height={20}
                  fill={backgroundColor}
                  rx={4}
                />
                <text
                  x={(sourceX + targetX) / 2}
                  y={(sourceY + targetY) / 2}
                  fill="#000"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: 12,
                  }}
                >
                  {label}
                </text>
              </svg>
            );
          },
        }}
      >
        <Background color={isDarkMode ? "#9CA3AF" : "#E5E7EB"} gap={16} />
        <Controls showZoom={true} showFitView={true} showInteractive={true} />
        <MiniMap
          zoomable
          pannable
          className={`border rounded ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-gray-200 border-gray-300"
          }`}
          nodeColor={(node) => (isDarkMode ? "#4B5563" : "#6B7280")}
          style={{ height: 120, width: 200 }}
        />
        <button
          onClick={exportImage}
          className={`absolute top-4 left-2 p-2 rounded text-white z-10 ${
            isDarkMode
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Export SVG
        </button>
        {hoveredNode && (
          <div
            className={`absolute p-2 border rounded shadow-lg z-10 ${
              isDarkMode
                ? "bg-gray-800 text-white border-gray-600"
                : "bg-white text-black border-gray-300"
            }`}
            style={{
              left: getTooltipPosition(hoveredNode).x,
              top: getTooltipPosition(hoveredNode).y,
              // maxWidth: "200px",
              fontSize: "12px",
            }}
          >
            <p>
              <strong>Address:</strong>{" "}
              {hoveredNode.data.realAddress || hoveredNode.id}
            </p>

            <p>
              <strong>Entity:</strong> {hoveredNode.data.entity || "Unknown"}
            </p>
            <p>
              <strong>Amount:</strong> {hoveredNode.data.amount || "N/A"}
            </p>
            <p>
              <strong>Token Type:</strong> {hoveredNode.data.tokenType || "BTC"}
            </p>
            <p>
              <strong>Transaction Type:</strong>{" "}
              {hoveredNode.data.transactionType || "Normal Tx"}
            </p>
            <p>
              <strong>Date:</strong> {hoveredNode.data.date || "N/A"}
            </p>
          </div>
        )}
      </ReactFlow>
    </div>
  );
};

const WalletGraph = ({ inflowData, outflowData, initialAddress }) => {
  const dispatch = useDispatch();
  const reduxNodes = useSelector((state) => state.graph.nodes) || [];
  const reduxEdges = useSelector((state) => state.graph.edges) || [];
  const isDarkMode = useSelector((state) => state.graph.isDarkMode);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Log props to debug
  useEffect(() => {
    console.log("WalletGraph props:", {
      inflowData,
      outflowData,
      initialAddress,
    });
  }, [inflowData, outflowData, initialAddress]);

  // Initialize graph with left-to-right layout and edge labels
  useEffect(() => {
    if (!inflowData || !outflowData || !initialAddress || isInitialized) return;

    const newNodes = new Map();
    const edgeLabels = new Map();

    // Central node (initialAddress) at x=400 with fallback
    newNodes.set(initialAddress || "default_wallet", {
      id: initialAddress || "default_wallet",
      type: "wallet",
      data: {
        label: (initialAddress || "default_wallet").slice(0, 8) + "...",
        entity: "Unknown",
        amount: 0,
        tokenType: "BTC",
        transactionType: "Normal Tx",
        date: "N/A",
      },
      position: { x: 400, y: 300 },
    });

    // Outflow (senders/payers) on the left
    outflowData.data.forEach((tx, index) => {
      const payer = tx.beneficiary_address;
      if (!newNodes.has(payer)) {
        newNodes.set(payer, {
          id: payer,
          type: "wallet",
          data: {
            label:
              tx.entity_name && tx.entity_name !== "Unknown"
                ? tx.entity_name
                : payer.slice(0, 8) + "...",
            realAddress: payer,
            entity: tx.entity_name || "Unknown",
            amount: tx.amount || 0,
            tokenType: tx.tokenType || tx.token_type || "BTC",
            transactionType:
              tx.transactionType || tx.transaction_type || "Normal Tx",
            date: tx.date || tx.date_time || "N/A",
          },
          position: {
            x: 100 + ((index * 200) % 800),
            y: 300 - 100 + Math.floor(index / 4) * 200,
          },
        });
      }
      edgeLabels.set(
        `${payer}-${initialAddress || "default_wallet"}`,
        `${tx.amount} / ${tx.date || tx.date_time || "N/A"}`
      );
    });

    // Inflow (receivers/beneficiaries) on the right
    inflowData.data.forEach((tx, index) => {
      const beneficiary = tx.payer_address;
      if (!newNodes.has(beneficiary)) {
        newNodes.set(beneficiary, {
          id: beneficiary,
          type: "wallet",
          data: {
            label:
              tx.entity_name && tx.entity_name !== "Unknown"
                ? tx.entity_name
                : beneficiary.slice(0, 8) + "...",
            realAddress: beneficiary,
            entity: tx.entity_name || "Unknown",
            amount: tx.amount || 0,
            tokenType: tx.tokenType || tx.token_type || "BTC",
            transactionType:
              tx.transactionType || tx.transaction_type || "Normal Tx",
            date: tx.date || tx.date_time || "N/A",
          },
          position: {
            x: 700 + ((index * 200) % 800),
            y: 300 - 100 + Math.floor(index / 4) * 200,
          },
        });
      }
      edgeLabels.set(
        `${initialAddress || "default_wallet"}-${beneficiary}`,
        `${tx.amount} | ${tx.date || tx.date_time || "N/A"}`
      );
    });

    const nodesArray = Array.from(newNodes.values());
    const edgesArray = Array.from(new Set([...edgeLabels.keys()])).map(
      (edgeId, idx) => ({
        id: `e${idx}`,
        source: edgeId.split("-")[0],
        target: edgeId.split("-")[1],
        animated: true,
        data: { label: edgeLabels.get(edgeId) },
      })
    );

    setNodes(nodesArray);
    setEdges(edgesArray);
    dispatch(setReduxNodes(nodesArray));
    dispatch(setReduxEdges(edgesArray));
    setIsInitialized(true);
    console.log("Initial graph set:", { nodes: nodesArray, edges: edgesArray });
  }, [
    inflowData,
    outflowData,
    initialAddress,
    setNodes,
    setEdges,
    dispatch,
    isInitialized,
  ]);

  // Sync with Redux
  useEffect(() => {
    if (!isInitialized) return;

    const nodesToUpdate = reduxNodes.filter(
      (rn) =>
        !nodes.some(
          (n) =>
            n.id === rn.id &&
            n.position.x === rn.position.x &&
            n.position.y === rn.position.y
        )
    );
    const edgesToUpdate = reduxEdges.filter(
      (re) =>
        !edges.some(
          (e) =>
            e.id === re.id && e.source === re.source && e.target === re.target
        )
    );

    if (nodesToUpdate.length > 0 || edgesToUpdate.length > 0) {
      setNodes(reduxNodes);
      setEdges(reduxEdges);
      console.log("Synced from Redux:", {
        nodes: reduxNodes,
        edges: reduxEdges,
      });
    }
  }, [reduxNodes, reduxEdges, nodes, edges, setNodes, setEdges, isInitialized]);

  // Handle node dragging
  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      const updatedNodes = nodes.map((node) => {
        const change = changes.find((c) => c.id === node.id);
        if (change && change.type === "position" && change.position) {
          return { ...node, position: change.position };
        }
        return node;
      });
      dispatch(setReduxNodes(updatedNodes));
      console.log("Nodes updated after drag:", updatedNodes);
    },
    [nodes, onNodesChange, dispatch]
  );

  // Handle manual edge connection
  const handleConnect = useCallback(
    (params) => {
      const { source, target } = params;
      const label = "Manual / N/A";
      dispatch(addEdge({ source, target, data: { label } }));
      console.log("Edge connected:", { source, target, label });
    },
    [dispatch]
  );

  useEffect(() => {
    console.log("WalletGraph isDarkMode:", isDarkMode);
  }, [isDarkMode]);

  return (
    <ReactFlowProvider>
      <GraphContent
        isDarkMode={isDarkMode}
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
      />
    </ReactFlowProvider>
  );
};

export default WalletGraph;
