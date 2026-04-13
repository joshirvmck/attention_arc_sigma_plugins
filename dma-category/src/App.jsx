import * as React from 'react';
import {
  client,
  useConfig,
  useElementData,
} from "@sigmacomputing/plugin";

import './App.css';
import Map from './components/Map';

// Initialize the editor panel inside of the sigma editor
// This allows the user to select columns via native sigma tools to populate graph. 
// Think of it like Sigma is serving the backend for the graph based on the user's selection. 
client.config.configureEditorPanel([
  { name: "source", type: "element" },
  { name: "dma_id", type: "column", source: "source", allowMultiple: false, allowedTypes: ['number', 'integer', 'string'] },
  { name: "numeric_value", type: "column", source: "source", allowMultiple: false, allowedTypes: ['number', 'integer'] },
  { name: "category", type: "column", source: "source", allowMultiple: false, allowedTypes: ['text'] }
]);

// This is the main app component that renders the map and traffics data to the map from the sigma data.
function App() {
  // Helper to get URL param

  const config = useConfig();
  console.log("Config from Sigma:", config);
  const sigmaData = useElementData(config.source);
  console.log("sigmaData:", sigmaData);
  const sigmaKeys = Object.keys(sigmaData || {});
  console.log("sigmaKeys:", sigmaKeys);

  const numericIdCol = sigmaKeys.length === 2 ? sigmaKeys[1] : sigmaKeys.length === 3 ? sigmaKeys[1] : null;
  const categoryIdCol = sigmaKeys.length === 3 ? sigmaKeys[2] : sigmaKeys[1];

  const data_length = sigmaData && sigmaData[categoryIdCol] ? sigmaData[categoryIdCol].length : null;
  const dmaIdCol = config.dma_id;
  console.log("dmaIdCol:", dmaIdCol);
  // Error state for missing config/data
  let errorMsg = '';
  if (!sigmaData) {
    errorMsg = 'No Sigma data received.';
  } else if (!categoryIdCol || !sigmaData[categoryIdCol]) {
    errorMsg = 'No category column found in Sigma data.';
  } else if (!config.dma_id) {
    errorMsg = 'No DMA ID column selected. Please re-select columns in the Sigma plugin configuration panel.';
  }

  // Build sigmaData array for the map: [{ uid, numeric_value }]
  const data = React.useMemo(() => {
    const _data = [];
    if (!dmaIdCol || !sigmaData) return [];
    for (let i = 0; i < data_length; i++) {
      const row = { uid: sigmaData[dmaIdCol][i] };
      if (categoryIdCol && sigmaData[categoryIdCol]) {
        row[categoryIdCol] = sigmaData[categoryIdCol][i];
      }
      if (numericIdCol && sigmaData[numericIdCol]) {
        row[numericIdCol] = sigmaData[numericIdCol][i];
      }
      _data.push(row)
    }
    return _data;
  }, [dmaIdCol, sigmaData, categoryIdCol, numericIdCol, data_length]);

  console.log('Processed map data:', data);
  return (
    <div className="App">
      <Map sigmaData={data} categoryKey={categoryIdCol} numericIdCol={numericIdCol} uidType="dma_id" />
    </div>
  );
}

export default App;