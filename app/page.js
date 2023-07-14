"use client"
import styles from './page.module.css'
import { useEffect, useState } from 'react'
import { Map, View, Geolocation, Feature } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { defaults as defaultControls } from 'ol/control';
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { Point } from 'ol/geom'
import { Style, Fill, Circle, Icon } from 'ol/style'

export default function Home() {
  const [qiblahCoordinates] = useState([39.8261831, 21.4225148]);
  const [view] = useState(new View({
    center: qiblahCoordinates,
    zoom: 22,
    projection: "EPSG:4326"
  }));
  const [geolocation] = useState(typeof window !== "undefined" ? new Geolocation({ trackingOptions: { enableHighAccuracy: true }, projection: view.getProjection() }) : null);

  useEffect(() => {
    const image = new Icon({ anchor: [.5, 24.5], anchorXUnits: 'fraction', anchorYUnits: 'pixels', src: 'geolocation_marker_heading.png' });
    const iconStyle = new Style({ image });
    const GPSFeature = new Feature();
    const vectSource = new VectorSource({ features: [GPSFeature] });
    const vectLayer = new VectorLayer({
      source: vectSource,
      style: new Style({
        image: new Circle({
          radius: 7,
          fill: new Fill({
              color: '#0084FF',
          }),
        }),
      })
    });

    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view,
      controls: defaultControls({
        zoom: false,
        rotate: false,
        attribution: false
      }),
    });

    map.addLayer(vectLayer);

    geolocation?.on("change:position", () => {
      const position = geolocation?.getPosition();
      view.setCenter(position);
      GPSFeature.setGeometry(new Point(position));
      GPSFeature.setStyle(iconStyle);
      image.setRotation(Math.atan( qiblahCoordinates[1] - position[1] / qiblahCoordinates[0] - position[0] ));
    })

    return () => map.setTarget('');
  }, [])

  const toggleGPS = () => {
    geolocation?.setTracking(!geolocation?.getTracking());
  }

  return (
    <main className={styles.main}>
      <div id='map' className={styles.map}></div>
      <button type='button' className={styles.toggle} onClick={toggleGPS}>حدد القبلة</button>
    </main>
  )
}
