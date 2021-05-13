import { useState, useEffect, useMemo } from 'react';
import { csv } from 'd3';

const covidCsvUrl =
  "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"

const row = d => {
  d.coords = d['Location Coordinates'].split(',').map(d => +d).reverse();
  d['Total Dead and Missing'] = + d['Total Dead and Missing'];
  d['Reported Date'] = new Date(d['Reported Date']);
  return d;
};

const transformData = (covidData) => {
  if(covidData) {
    const nestedArray = covidData.map(countryEntry => {
      const coordinates = [+countryEntry['Long'], +countryEntry['Lat']]
      return(Object.keys(countryEntry).slice(4).map((date, idx)=>{
        return({
          'Location Coordinates': `${coordinates[1]}, ${coordinates[0]}`,
          'Reported Date': new Date(date),
          'Total Dead and Missing': (+countryEntry[date] - (idx===0 ? 0 : +countryEntry[Object.keys(countryEntry).slice(4)[idx-1]])) < 0 ? 0 : (+countryEntry[date] - (idx===0 ? 0 : +countryEntry[Object.keys(countryEntry).slice(4)[idx-1]])),
          'coords': coordinates,
      })}))
    }).flat(1)
    return nestedArray
  }
  return
}

export const useData = () => {
  const [covidData, setCovidData] = useState(null);
  const transformedData = useMemo(()=>transformData(covidData), [covidData])

  useEffect(() => {
    csv(covidCsvUrl).then(setCovidData);
  }, []);

  return transformedData;
};
