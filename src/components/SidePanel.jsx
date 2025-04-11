import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNode } from "../redux/slices/graphSlice";

const SidePanel = ({ inflowData, outflowData }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.graph.nodes) || [];
  const isDarkMode = useSelector((state) => state.graph.isDarkMode);

  const handleAddWallet = () => {
    if (walletAddress && !nodes.some((node) => node.id === walletAddress)) {
      const newNode = {
        id: walletAddress,
        type: "wallet",
        data: { label: walletAddress.slice(0, 8) + "..." },
        position: { x: Math.random() * 500, y: Math.random() * 500 },
      };
      dispatch(addNode(newNode));
      console.log("Dispatched addNode:", newNode);
      setWalletAddress("");
    }
  };

  return (
    <div
      className={`w-64 p-4 h-full ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <h2
        className={`text-lg font-bold mb-4 ${
          isDarkMode ? "text-gray-200" : "text-gray-800"
        }`}
      >
        Controls
      </h2>
      <div className="mb-4">
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="Enter wallet address"
          className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${
            isDarkMode
              ? "bg-gray-800 text-gray-200 border-gray-700 focus:ring-blue-600"
              : "bg-white text-gray-800 border-gray-300 focus:ring-blue-500"
          }`}
        />
        <button
          onClick={handleAddWallet}
          className={`mt-2 w-full p-2 rounded text-white ${
            isDarkMode
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Add Wallet
        </button>
      </div>
      <div className="mt-6 space-y-6">
        {/* Inflow Section */}
        <div>
          <h3
            className={`text-lg font-semibold mb-2 ${
              isDarkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Inflow Addresses
          </h3>
          <ul className="space-y-1 max-h-40 overflow-y-auto rounded-md border p-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
            {inflowData?.data.map((item, index) => (
              <li
                key={`${item.beneficiary_address}-${index}`}
                className={`flex items-center justify-between p-2 rounded-md transition-all text-sm ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="truncate">{item.beneficiary_address}</span>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(item.beneficiary_address)
                  }
                  title="Copy address"
                  className="ml-2 text-xs px-2 py-0.5 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Copy
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Outflow Section */}
        <div>
          <h3
            className={`text-lg font-semibold mb-2 ${
              isDarkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Outflow Addresses
          </h3>
          <ul className="space-y-1 max-h-40 overflow-y-auto rounded-md border p-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
            {outflowData?.data.map((item, index) => (
              <li
                key={`${item.payer_address}-${index}`}
                className={`flex items-center justify-between p-2 rounded-md transition-all text-sm ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="truncate">{item.payer_address}</span>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(item.payer_address)
                  }
                  title="Copy address"
                  className="ml-2 text-xs px-2 py-0.5 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Copy
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
