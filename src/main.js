import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';

// Данные о городах (название, долгота, широта, население)
const cities = [
  { name: "Москва", coords: [37.6173, 55.7558], population: 12600000 },
  { name: "Нью-Йорк", coords: [-74.006, 40.7128], population: 8419000 },
  { name: "Токио", coords: [139.6917, 35.6895], population: 13960000 },
  { name: "Берлин", coords: [13.405, 52.52], population: 3769000 },
  { name: "Лондон", coords: [-0.1276, 51.5074], population: 8982000 },
  { name: "Бишкек", coords: [74.566, 42.8746], population: 1054000 },
];

// Функция для создания точек на карте
const features = cities.map(city => {
  const feature = new Feature({
    geometry: new Point(fromLonLat(city.coords)), // Конвертация координат
    name: city.name
  });

  // Определяем цвет круга в зависимости от населения
  const color = city.population > 10000000 ? 'rgba(255, 0, 0, 0.5)' :
                city.population > 5000000 ? 'rgba(255, 165, 0, 0.5)' : 
                'rgba(0, 128, 0, 0.5)';

  // Размер круга зависит от населения (корень из населения / 100)
  const radius = Math.sqrt(city.population) / 100;

  feature.setStyle(new Style({
    image: new CircleStyle({
      radius: radius,
      fill: new Fill({ color: color }),
      stroke: new Stroke({ color: 'black', width: 1 })
    })
  }));

  return feature;
});

// Создаём векторный слой для городов
const cityLayer = new VectorLayer({
  source: new VectorSource({
    features: features
  })
});

// Создаём контейнер для карты
document.body.innerHTML = `
  <div id="map" style="width:100vw; height:100vh; position:relative;"></div>
  <div id="legend" style="
    position: absolute; 
    bottom: 20px; 
    left: 20px; 
    background: white; 
    padding: 10px; 
    border-radius: 5px; 
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    font-family: Arial, sans-serif;
  ">
    <strong>Легенда:</strong>
    <div style="display: flex; align-items: center; margin-top: 5px;">
      <div style="width: 15px; height: 15px; background: rgba(255, 0, 0, 0.5); border: 1px solid black; margin-right: 5px;"></div> > 10 млн
    </div>
    <div style="display: flex; align-items: center; margin-top: 5px;">
      <div style="width: 15px; height: 15px; background: rgba(255, 165, 0, 0.5); border: 1px solid black; margin-right: 5px;"></div> 5-10 млн
    </div>
    <div style="display: flex; align-items: center; margin-top: 5px;">
      <div style="width: 15px; height: 15px; background: rgba(0, 128, 0, 0.5); border: 1px solid black; margin-right: 5px;"></div> < 5 млн
    </div>
  </div>
`;

// Создаём карту
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({ source: new OSM() }), // Подложка OpenStreetMap
    cityLayer // Слой с городами
  ],
  view: new View({
    center: fromLonLat([30, 50]), // Центрируем на Европе
    zoom: 3
  })
});
