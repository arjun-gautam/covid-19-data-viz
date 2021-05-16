import { useState, useEffect, useMemo } from 'react';
import { csv } from 'd3';

const covidCsvUrl =
  "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"

const row = d => {
  d.coords = d['Location Coordinates'].split(',').map(d => +d).reverse();
  d['Total Confirmed'] = + d['Total Confirmed'];
  d['Reported Date'] = new Date(d['Reported Date']);
  return d;
};

const transformData = (covidData) => {
  if(covidData) {
    const nestedArray = covidData.map(countryEntry => {
      const coordinates = [parseFloat(countryEntry['Long']), parseFloat(countryEntry['Lat'])]
      return(Object.keys(countryEntry).slice(4).map((item, idx)=>{
        return({
          'Location Coordinates': `${coordinates[1]}, ${coordinates[0]}`,
          'Reported Date': new Date(item),
          'Total Confirmed': (Number(countryEntry[item]) - (idx===0 ? 0 : Number(countryEntry[Object.keys(countryEntry).slice(4)[idx-1]]))) < 0 ? 0 : (Number(countryEntry[item]) - (idx===0 ? 0 : Number(countryEntry[Object.keys(countryEntry).slice(4)[idx-1]]))),
          'coords': coordinates,
      })}))
    }).flat(1)
    return nestedArray
  }
  return
}

export const useData = () => {
  const [covidData, setCovidData] = useState(null);
  const [processedData, setProcessedData] = useState(null);
  if (processedData === null && covidData !== null) {
    setProcessedData(transformData(covidData))
  }
  useEffect(() => {
    csv(covidCsvUrl).then(setCovidData);
  }, []);

  return processedData;
};
