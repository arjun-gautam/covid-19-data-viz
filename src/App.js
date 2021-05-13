import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useWorldAtlas } from './useWorldAtlas';
import { useData } from './useData';
import { BubbleMap } from './BubbleMap/index.js';
import { DateHistogram } from './DateHistogram/index.js';

const width = 960;
const height = 550;
const dateHistogramSize = 0.2;

const xValue = d => d['Reported Date'];

const formatDate = (d) => {
  let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
  let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
  return `${da}-${mo}-${ye}`
}

const summedUpTotal = (arr) => {
  const values = arr.map(val=>val['Total Confirmed'])
  return values.reduce((a, b) => a + b, 0)
}

const App = () => {
  const worldAtlas = useWorldAtlas();
  const data = useData();
  const [brushExtent, setBrushExtent] = useState();

  if (!worldAtlas || !data) {
    return <pre>Loading...</pre>;
  }

  const filteredData = brushExtent
    ? data.filter(d => {
        const date = xValue(d);
        return date > brushExtent[0] && date < brushExtent[1];
      })
    : data;

  return (
    <>
      <svg width={width} height={height}>
        <BubbleMap
          data={data}
          filteredData={filteredData}
          worldAtlas={worldAtlas}
        />
        <g transform={`translate(0, ${height - dateHistogramSize * height})`}>
          <DateHistogram
            data={data}
            width={width}
            height={dateHistogramSize * height}
            setBrushExtent={setBrushExtent}
            xValue={xValue}
          />
        </g>
      </svg>
      <div style={{ textAlign: 'center', width }}>
        <small>
          Select small intervals for good performance
        </small>
        <br/>
        {brushExtent ? `${formatDate(brushExtent[0])} to ${formatDate(brushExtent[1])}` : 'Select the time frame'}
        <br/>
        Total Confirmed cases: {summedUpTotal(filteredData)/1000000}M
      </div>
    </>
  );
};

export default App;
