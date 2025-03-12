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
  { name: "Париж", coords: [2.3522, 48.8566], population: 2148000 },
  { name: "Рим", coords: [12.4964, 41.9028], population: 2873000 },
  { name: "Сидней", coords: [151.2093, -33.8688], population: 5312000 },
  { name: "Пекин", coords: [116.4074, 39.9042], population: 21710000 },
  { name: "Дели", coords: [77.2090, 28.6139], population: 31180000 },
  { name: "Каир", coords: [31.2357, 30.0444], population: 10230000 },
  { name: "Рио-де-Жанейро", coords: [-43.1729, -22.9068], population: 6748000 },
  { name: "Торонто", coords: [-79.3832, 43.6532], population: 2930000 },
  { name: "Сингапур", coords: [103.8198, 1.3521], population: 5704000 },
  { name: "Дубай", coords: [55.2708, 25.2048], population: 3331000 },
  { name: "Сан-Франциско", coords: [-122.4194, 37.7749], population: 883305 },
  { name: "Стамбул", coords: [28.9784, 41.0082], population: 15460000 },
  { name: "Шанхай", coords: [121.4737, 31.2304], population: 24150000 },
  { name: "Мумбаи", coords: [72.8777, 19.0760], population: 20670000 },
  { name: "Лос-Анджелес", coords: [-118.2437, 34.0522], population: 3971000 },
  { name: "Мадрид", coords: [-3.7038, 40.4168], population: 3266000 },
  { name: "Бангкок", coords: [100.5018, 13.7563], population: 10540000 },
  { name: "Сеул", coords: [126.9780, 37.5665], population: 9776000 },
  { name: "Мельбурн", coords: [144.9631, -37.8136], population: 5078000 },
  { name: "Амстердам", coords: [4.8952, 52.3702], population: 821752 },
  { name: "Вена", coords: [16.3738, 48.2082], population: 1897000 },
  { name: "Прага", coords: [14.4378, 50.0755], population: 1309000 },
  { name: "Будапешт", coords: [19.0402, 47.4979], population: 1752000 },
  { name: "Варшава", coords: [21.0122, 52.2297], population: 1794000 },
  { name: "Осло", coords: [10.7522, 59.9139], population: 702543 },
  { name: "Хельсинки", coords: [24.9384, 60.1699], population: 658864 },
  { name: "Копенгаген", coords: [12.5683, 55.6761], population: 805402 },
  { name: "Стокгольм", coords: [18.0686, 59.3293], population: 975551 },
  { name: "Дублин", coords: [-6.2603, 53.3498], population: 1177000 },
  { name: "Эдинбург", coords: [-3.1883, 55.9533], population: 488050 },
  { name: "Лиссабон", coords: [-9.1393, 38.7223], population: 505526 },
  { name: "Афины", coords: [23.7275, 37.9838], population: 664046 },
  { name: "Рига", coords: [24.1052, 56.9496], population: 614618 },
  { name: "Вильнюс", coords: [25.2797, 54.6872], population: 588412 },
  { name: "Таллин", coords: [24.7536, 59.4370], population: 437619 },
  { name: "Рейкьявик", coords: [-21.9426, 64.1466], population: 131136 },
  { name: "Веллингтон", coords: [174.7762, -41.2865], population: 212700 },
  { name: "Окленд", coords: [174.7633, -36.8485], population: 1652000 },
  { name: "Кейптаун", coords: [18.4241, -33.9249], population: 433688 },
  { name: "Найроби", coords: [36.8219, -1.2921], population: 4397000 },
  { name: "Лагос", coords: [3.3792, 6.5244], population: 14800000 },
  { name: "Буэнос-Айрес", coords: [-58.3816, -34.6037], population: 2891000 },
  { name: "Лима", coords: [-77.0428, -12.0464], population: 9752000 },
  { name: "Сантьяго", coords: [-70.6693, -33.4489], population: 7032000 }
];

// Функция для создания точек на карте
const features = cities.map(city => {
  const feature = new Feature({
    geometry: new Point(fromLonLat(city.coords)), // Конвертация координат
    name: city.name
  });

  // Определяем цвет круга в зависимости от населения
  const color = city.population > 20000000 ? 'rgba(220, 20, 60, 0.7)' : // Кричащий красный
              city.population > 10000000 ? 'rgba(255, 140, 0, 0.7)' : // Тёмно-оранжевый
              city.population > 5000000 ? 'rgba(255, 215, 0, 0.7)' : // Золотой
              city.population > 1000000 ? 'rgba(50, 205, 50, 0.7)' : // Лаймовый
              'rgba(70, 130, 180, 0.7)'; // Стальной синий

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
