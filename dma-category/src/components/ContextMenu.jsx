import React from 'react';
import copyToClipboard from 'copy-to-clipboard';

function handleCopy(info, kpiLabel = 'Value') {
  const objects = info.objects ? info.objects : [info.object];
  // Only one of the dma_name should be in the data
  const headers = ['DMA', kpiLabel, categoryLabel];
  const contents = objects.map(data => {
    const dma = data.properties?.dma_name ?? data.dma_name ?? data.dma ?? '';
    const category = data.category ?? 'N/A';
    return [dma, category].join(',');
  });

  const text = [headers.join(','), ...contents].join('\n');
  copyToClipboard(text);
}

export function renderContextMenu(info, categoryLabel = 'Category') {
  if (!info) return null;
  const { x, y, object } = info;
  const dmaName = object?.properties?.dma_name ?? object?.dma_name ?? object?.dma ?? '';
  const categoryValue = object?.category ?? 'N/A';

  return (
    <ul className="contextMenu" style={{ position: 'fixed', left: x, top: y }}>
      <li style={{ pointerEvents: 'none', fontWeight: 'bold' }}>DMA: {dmaName}</li>
      <li style={{ pointerEvents: 'none' }}>Category: {categoryValue}</li>
      <li onClick={() => handleCopy(info, kpiLabel)}>Copy data</li>
    </ul>
  )
}