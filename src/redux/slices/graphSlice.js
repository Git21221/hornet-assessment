import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nodes: [],
  edges: [],
  isDarkMode: false,
};

const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    setNodes(state, action) {
      state.nodes = action.payload;
    },
    setEdges(state, action) {
      state.edges = action.payload;
    },
    addNode(state, action) {
      const newNode = action.payload;
      if (!state.nodes.some(n => n.id === newNode.id)) {
        state.nodes.push(newNode);
      }
    },
    addEdge(state, action) {
      const { source, target } = action.payload;
      if (!state.edges.some(e => e.source === source && e.target === target) &&
          state.nodes.some(n => n.id === source) &&
          state.nodes.some(n => n.id === target)) {
        state.edges.push({
          id: `e${state.edges.length + 1}`,
          source,
          target,
          animated: true,
        });
      }
    },
    toggleDarkMode(state) {
      state.isDarkMode = !state.isDarkMode;
    },
  },
});

export const { setNodes, setEdges, addNode, addEdge, toggleDarkMode } = graphSlice.actions;
export default graphSlice.reducer;