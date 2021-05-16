import { geoNaturalEarth1, geoPath, geoGraticule, geoEquirectangular, geoOrthographic } from "d3";
import { useMemo, useState } from "react";

const projection = geoEquirectangular();
// const projection = geoOrthographic();
// const projection = geoNaturalEarth1();
const path = geoPath(projection);
const graticule = geoGraticule();
var crg = require('country-reverse-geocoding').country_reverse_geocoding();

export const Marks = ({
  worldAtlas: { land, interiors },
  data,
  sizeScale,
  sizeValue,
  setTooltip
}) => {
  function showTooltip(evt, text, d) {
    var country = crg.get_country(d['coords'][1], d['coords'][0]);
    const confirmedValue = d['Total Confirmed']
    let dataType = d['Total Confirmed']/1000 < 10 ? '' : 'K'
    const confirmedValueWithDataType = ((d['Total Confirmed']/1000) < 10) ? d['Total Confirmed'] : (d['Total Confirmed']/1000)
    const tooltip_value = <small><b>{country ? `${country.name +' : '}` : ''}</b> {confirmedValueWithDataType.toFixed(2) + dataType + ' average confirmed cases per day'}</small>
    let tooltip = document.getElementById("tooltip");
    setTooltip({showing: true, positionX: evt.pageX, positionY: evt.pageY, message:tooltip_value })
  }

  function hideTooltip(d) {
    var tooltip = document.getElementById("tooltip");
    setTooltip({showing: false })
  }
  return(
  <>

  <g className="marks">
    {useMemo(
      () => (
        <>
          <path className="sphere" d={path({ type: "Sphere" })} />
          <path className="graticules" d={path(graticule())} />
          {land.features.map((feature) => (
            <path className="land" d={path(feature)} />
          ))}
          <path className="interiors" d={path(interiors)} />
        </>
      ),
      [path, graticule, land, interiors]
    )}
    {useMemo(
      () =>
        data.map((d) => {
          const [x, y] = projection(d.coords);
          return <circle style={{cursor: 'pointer'}}  cx={x} cy={y} r={sizeScale(sizeValue(d))} onMouseMove={(evt)=>showTooltip(evt, 'This is blue',d)} onMouseOut={()=>hideTooltip(d)}/>;
        }),
      [data]
    )}
  </g>
  </>
)};
