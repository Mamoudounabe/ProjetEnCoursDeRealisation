import { Component,OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
    selector: 'app-geo-page',
    standalone:true,
    imports: [],
    templateUrl: './geo-page.component.html',
    styleUrl: './geo-page.component.css'
})
export class GeoPageComponent implements OnInit{

  private map: any;
  private franceGeoJsonUrl: string = 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/france-regions.geojson';
  private overseasGeoJsonUrl: string = 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/france-overseas.geojson'; // Fichier des DOM-TOM

  public overseasRegions: string[] = [
    'Guadeloupe', 'Martinique', 'Guyane', 'La Réunion', 'Mayotte', 'Saint-Pierre-et-Miquelon', 'Polynésie française', 'Nouvelle-Calédonie'
  ];

  ngOnInit(): void {
    this.initMap();
    this.loadRegionsData();
  }

  private initMap(): void {
    // Création de la carte centrée sur la France
    this.map = L.map('map', {
      center: [46.603354, 1.888334],  // Coordonnées pour centrer la France
      zoom: 6,                       // Niveau de zoom initial
      maxZoom: 10,                   // Limite du zoom maximum
      minZoom: 5,                    // Limite du zoom minimum
    });

    // Utilisation d'OpenStreetMap pour les tuiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private loadRegionsData(): void {
    // Chargement du fichier GeoJSON des régions françaises
    fetch(this.franceGeoJsonUrl)
      .then(res => res.json())
      .then(data => {
        this.addRegionsToMap(data);
      });

    // Chargement des régions d'outre-mer
    fetch(this.overseasGeoJsonUrl)
      .then(res => res.json())
      .then(data => {
        this.addOverseasRegions(data);
      });
  }

  private addRegionsToMap(geoJsonData: any): void {
    L.geoJSON(geoJsonData, {
      style: (feature) => ({
        weight: 2,
        opacity: 1,
        color: 'black',
        fillOpacity: 0.7,
        fillColor: 'gray'
      }),
      onEachFeature: (feature, layer) => {
        layer.on('mouseover', (e) => {
          e.target.setStyle({
            fillColor: 'yellow'
          });
        });

        layer.on('mouseout', (e) => {
          e.target.setStyle({
            fillColor: 'gray'
          });
        });

        layer.on('click', (e) => {
          alert(`Vous avez cliqué sur : ${feature.properties.nom}`);
        });
      }
    }).addTo(this.map);
  }

  private addOverseasRegions(geoJsonData: any): void {
    L.geoJSON(geoJsonData, {
      style: (feature) => ({
        weight: 2,
        opacity: 1,
        color: 'black',
        fillOpacity: 0.7,
        fillColor: 'blue'
      }),
      onEachFeature: (feature, layer) => {
        layer.on('mouseover', (e) => {
          e.target.setStyle({
            fillColor: 'yellow'
          });
        });

        layer.on('mouseout', (e) => {
          e.target.setStyle({
            fillColor: 'blue'
          });
        });

        layer.on('click', (e) => {
          alert(`Vous avez cliqué sur : ${feature.properties.nom}`);
        });
      }
    }).addTo(this.map);
  }

  public zoomToRegion(regionName: string): void {
    // Effectuer un zoom sur une région spécifique en fonction de son nom
    alert(`Zoom sur la région : ${regionName}`);
  }
}

