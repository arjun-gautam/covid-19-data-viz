import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { useWorldAtlas } from './useWorldAtlas';
import { useData } from './useData';
import { BubbleMap } from './BubbleMap/index.js';
import { DateHistogram } from './DateHistogram/index.js';
import MainApp from './Main'

const width = 960;
const height = 630;
const dateHistogramSize = 0.2;

const xValue = d => d['Reported Date'];

const formatDate = (d) => {
  let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
  let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
  return `${mo} ${da}, ${ye}`
}

const summedUpTotal = (arr) => {
  const values = arr.map(val=>val['Total Confirmed'])
  return values.reduce((a, b) => a + b, 0)
}

const findSmallestDate = (data) => {
  let recordedSmall
  data.forEach((item, i) => {
    if (recordedSmall === undefined) {
      recordedSmall = item['Reported Date']
    } else if (item['Reported Date']<recordedSmall) {
      recordedSmall = item['Reported Date']
    }
  });
  return recordedSmall
}
const findHighestDate = (data) => {
  let recordedHigh
  data.forEach((item, i) => {
    if (recordedHigh === undefined) {
      recordedHigh = item['Reported Date']
    } else if (item['Reported Date']>recordedHigh) {
      recordedHigh = item['Reported Date']
    }
  });
  return recordedHigh
}

const getChunkCount = (smallestDate, highestDate, interval) => {
  const days = (highestDate - smallestDate)/86400000
  const counts = [Math.ceil(days/7), Math.ceil(days/30), Math.ceil(days/360)]
  if (interval==='w') {
    return counts[0]
  } else if (interval==='m') {
    return counts[1]
  } else if (interval === 'y'){
    return counts[2]
  }
}

const getUniqueLocations = (data) => {
  const uniqueLocations = data.map(item=>item['Location Coordinates'])
  return [...new Set(uniqueLocations)]
}

const compressChunk = (filteredChunk) => {
  const uniqueLocations = getUniqueLocations(filteredChunk)
  const chunkData = []
  filteredChunk.forEach((item, i) => {
    if (chunkData[uniqueLocations.indexOf(item['Location Coordinates'])]) {
      chunkData[uniqueLocations.indexOf(item['Location Coordinates'])]['Total Confirmed'] += item['Total Confirmed']
    } else {
      chunkData[uniqueLocations.indexOf(item['Location Coordinates'])] = item
    }
  });
  return chunkData
}

const getProcessedSingleChunk = (data, smallestDate, highestDate, i, interval) => {
  let days
  if (interval==='w') {
    days = 7
  } else if (interval==='m') {
    days = 30
  } else if (interval === 'y'){
    days = 360
  }

  const fromDate = new Date(smallestDate - (i * -1 * days * 24 * 60 * 60 * 1000))
  let toDate = new Date(smallestDate - ((i+1) * -1 * days * 24 * 60 * 60 * 1000))
  toDate = toDate > highestDate ? highestDate : toDate

  const filteredChunk = data.filter(item=>{
    // console.log(typeof item['Reported Date']);
    return true
  })

  // const filteredChunk = data.filter((item)=>(fromDate <= (item['Reported Date']) < toDate))
  const compressedChunk = compressChunk(filteredChunk)
  return compressedChunk
}

const getChunks = (data, smallestDate, highestDate, interval) => {
  const chunkCount = getChunkCount(smallestDate, highestDate, interval)
  const chunks = []
  Array(chunkCount).fill(undefined).forEach((item, i) => {
    const chunk_unit = getProcessedSingleChunk(data, smallestDate, highestDate, i, interval)
    chunks.push(chunk_unit)
  });

  return chunks.flat(1)
}

const simplifyAndStoreData = (data) => {
  const smallestDate = findSmallestDate(data)
  const highestDate = findHighestDate(data)
  const monthChunks = getChunks(data, smallestDate, highestDate, 'm')
  const weekChunks = getChunks(data, smallestDate, highestDate, 'w')
  const yearChunks = getChunks(data, smallestDate, highestDate, 'y')
  localStorage.setItem("month", JSON.stringify(monthChunks));
  localStorage.setItem("week", JSON.stringify(weekChunks));
  localStorage.setItem("year", JSON.stringify(yearChunks));

  return 'completed'
}

const ToolTip = ({tooltip}) => {
  const width = 300
  return(
    <div
      style={{
        position: 'absolute',
        left: -width/2,
        top: tooltip.positionY-60,
        backgroundColor: 'white',
        marginLeft: tooltip.positionX,
        border: '1px solid #ccc',
        padding: 5,
        width,
      }}>
        {tooltip.message}
    </div>
  )
}

const getTypedValue = (totalConfirmedCases, type) => {
  let dataTypeConfirmCases = totalConfirmedCases/1000 < 10 ? '' : 'K'
  let confirmedValueWithDataType = totalConfirmedCases
  dataTypeConfirmCases = totalConfirmedCases/1000000 < 10 ? dataTypeConfirmCases : 'M'
  dataTypeConfirmCases = totalConfirmedCases/1000000000 < 10 ? dataTypeConfirmCases : 'B'
  if (dataTypeConfirmCases === 'B') {
    confirmedValueWithDataType = (totalConfirmedCases / 1000000000).toFixed(2)
  } else if (dataTypeConfirmCases === 'M') {
    confirmedValueWithDataType = (totalConfirmedCases / 1000000).toFixed(2)
  } else if (dataTypeConfirmCases === 'K') {
    confirmedValueWithDataType = (totalConfirmedCases / 1000).toFixed(2)
  } else {
    confirmedValueWithDataType = type === 'average' ? totalConfirmedCases.toFixed(2):Math.round(totalConfirmedCases)
  }
  return (`${confirmedValueWithDataType} ${dataTypeConfirmCases}`)
}

const App = () => {
  const worldAtlas = useWorldAtlas();
  let data = useData();
  const [brushExtent, setBrushExtent] = useState();
  const [tooltip, setTooltip] = useState({showing:false, positionX: 0, positionY:0, message: ''});

  if (!worldAtlas || !data) {
    return <pre>Loading...</pre>;
  }

  return <MainApp {...{tooltip, setTooltip, brushExtent, setBrushExtent, data, worldAtlas,
    width,height,dateHistogramSize,xValue,formatDate,
    summedUpTotal,findSmallestDate,findHighestDate,getChunkCount,compressChunk,
    getProcessedSingleChunk,getChunks,simplifyAndStoreData,ToolTip,getTypedValue,
    BubbleMap, DateHistogram
  }} />

};

export default App;
