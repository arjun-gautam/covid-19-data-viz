import { useMemo, useState } from "react";


const getHighestAverage = (data, count) => {
  const arr = data.map((entry, i)=>({index:i, number:entry['Total Confirmed']}));
  arr.sort((a, b)=>(a.number - b.number))
  const topCountriesIndex = arr.slice(arr.length-count).reverse()
  const topCountries = topCountriesIndex.map(entry => data[entry.index])
  return topCountries
}

const getDayDiff = (endtime, starttime)=>{
  if (endtime && starttime) {
    const ms = endtime.getTime()-starttime.getTime()
    return (ms /(60*60*24*1000)) + 1
  }
  return 0
}

const getUniqueLocations = (data) => {
  const uniqueLocations = data.map(item=>item['Location Coordinates'])
  return [...new Set(uniqueLocations)]
}

const compressChunk = (filteredData, brushedDate) => {
  const uniqueLocations = getUniqueLocations(filteredData)
  const chunkData = Array(uniqueLocations.length).fill(undefined)
  const totalDays = getDayDiff(brushedDate.end, brushedDate.start)

  filteredData.forEach((item, i) => {
    if (chunkData[uniqueLocations.indexOf(item['Location Coordinates'])]) {
      chunkData[uniqueLocations.indexOf(item['Location Coordinates'])]['Total Confirmed'] += item['Total Confirmed']
    } else {
      chunkData[uniqueLocations.indexOf(item['Location Coordinates'])] = item
    }
  });

  chunkData.forEach((item, i) => {
    chunkData[i]['Total Confirmed'] /= totalDays
  });


  return chunkData
}


const App = ({
  tooltip,
  setTooltip,
  brushExtent,
  setBrushExtent,
  data,
  worldAtlas,
  width,
  height,
  dateHistogramSize,
  xValue,
  formatDate,
  summedUpTotal,
  findSmallestDate,
  findHighestDate,
  getChunkCount,
  getProcessedSingleChunk,
  getChunks,
  simplifyAndStoreData,
  ToolTip,
  getTypedValue,
  BubbleMap,
  DateHistogram,
}) => {
  let filteredData = brushExtent
    ? data.filter((d) => {
        const date = xValue(d);
        return date > brushExtent[0] && date < brushExtent[1];
      })
    : data;

  const totalConfirmedCases = useMemo(() => summedUpTotal(filteredData), [
    filteredData,
  ]);
  const startDate = useMemo(() => findSmallestDate(filteredData), [
    filteredData,
  ]);
  const endDate = useMemo(() => findHighestDate(filteredData), [filteredData]);
  const daysCount = useMemo(() => getDayDiff(endDate, startDate), [
    endDate,
    startDate,
  ]);

  const typedTotalCases = useMemo(() => getTypedValue(totalConfirmedCases, 'total'), [
    totalConfirmedCases,
  ]);
  const averageCasesPerDay = useMemo(
    () => daysCount === 0 ? 0: getTypedValue(totalConfirmedCases / daysCount, 'average'),
    [totalConfirmedCases, daysCount]
  );

  const processedData = compressChunk(filteredData, { start: startDate, end: endDate })
  const countriesHighestAverage = getHighestAverage(processedData, 10)
  var crg = require('country-reverse-geocoding').country_reverse_geocoding();
  const countriesList = countriesHighestAverage.map(d => crg.get_country(d['coords'][1], d['coords'][0]) && crg.get_country(d['coords'][1], d['coords'][0]).name)

  return (
    <>
      <div
        style={{
          height: height - 40,
          width: "content-fit",
          right: 10,
          backgroundColor: "white",
          top: "10px",
          float: "right",
          width: 270,
          border: "1px solid #ccc",
          borderRadius: 20,
          padding: 20,
          margin: "auto",
          position: 'absolute'
        }}
      >
        <h2 className="title">[DATA VIZ] COVID-19 CONFIRMED CASES</h2>
        <b>
            {`${formatDate(startDate)} - ${formatDate(endDate)}`}
        </b>
        <br />
        <br />
        <span style={{ backgroundColor: "grey", color: "white", padding: 3 }}>
          Total Confirmed cases
        </span>
        <br />
        <div className="count" style={{ fontSize: 32, fontWeight: "bold" }}>
          {typedTotalCases}
        </div>
        <br />
        <span style={{ backgroundColor: "grey", color: "white", padding: 3 }}>
          Average Confirmed cases per day
        </span>
        <br />
        <div className="count" style={{ fontSize: 32, fontWeight: "bold" }}>
          {averageCasesPerDay}
        </div>
        <br/>
        <span style={{ backgroundColor: "grey", color: "white", padding: 3 }}>
          Ten countries with highest `average confirmed cases` in order
        </span>
        <br />
        <br />
        {countriesList.map((entry, idx)=>(
          <div style={{color: '#333', paddingBottom:5, fontSize: 14}}>
            {idx+1}. {entry}
          </div>
        ))}
        <br/>
        <div style={{color: '#666'}}>Data Source: <a href="https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series">
        CSSEGISandData/COVID-19</a></div>

      </div>
      {tooltip.showing && <ToolTip tooltip={tooltip} />}
      <div style={{ width: "fit-content" }}>
        <svg
          width={width}
          height={height}
          style={{ border: "1px solid #ccc", borderRadius: 20, margin: 10 }}
        >
          <BubbleMap
            data={data}
            filteredData={filteredData}
            worldAtlas={worldAtlas}
            setTooltip={setTooltip}
            processedData={processedData}
          />
          <g transform={`translate(0, ${height - dateHistogramSize * height})`}>
            <text fontSize="smaller" y={-5} x={20}>Select small intervals for relatively good performance</text>
            <DateHistogram
              data={data}
              width={width}
              height={dateHistogramSize * height}
              setBrushExtent={setBrushExtent}
              xValue={xValue}
            />
          </g>
        </svg>
      </div>
    </>
  );
};

export default App;
