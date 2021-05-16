import React, { useMemo } from 'react';
import { scaleSqrt, max } from 'd3';
import { Marks } from './Marks';

const sizeValue = d => d['Total Confirmed'];
const maxRadius = 32;

export const BubbleMap = ({ data, filteredData, worldAtlas, setTooltip, processedData }) => {
  const sizeScale = useMemo(
    () =>
      scaleSqrt()
        .domain([1, max(data, sizeValue)])
        .range([1, maxRadius]),
    [data, sizeValue, maxRadius]
  );

  return (
    <Marks
      worldAtlas={worldAtlas}
      // data={filteredData}
      setTooltip={setTooltip}
      data={processedData}
      sizeScale={sizeScale}
      sizeValue={sizeValue}
    />
  );
};
