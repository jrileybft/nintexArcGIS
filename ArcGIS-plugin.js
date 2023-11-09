import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

export class ArcGISGeocoderPlugin extends LitElement {

  static properties = {
    address: { type: String },
    coordinates: { type: Object },
  };

  constructor() {
    super();
    this.address = '';
    this.coordinates = {};
  }

  updated(changedProperties) {
    if (changedProperties.has('address')) {
      this.geocodeAddress();
    }
  }

  geocodeAddress() {
    const address = this.address.trim();
    if (!address) return;

    // Replace 'YOUR_ARCGIS_API_KEY' with your actual ArcGIS API key
    const arcgisApiKey = 'YOUR_ARCGIS_API_KEY';
    const arcgisUrl = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&singleLine=${address}&outFields=Addr_type&apiKey=${arcgisApiKey}`;

    fetch(arcgisUrl)
      .then(response => response.json())
      .then(data => {
        const candidate = data.candidates[0];
        if (candidate) {
          this.coordinates = candidate.location;
        } else {
          this.coordinates = { error: 'Coordinates not available' };
        }
      })
      .catch(error => {
        console.error('Error during geocoding:', error);
        this.coordinates = { error: 'Geocoding error' };
      });
  }

  static getMetaConfig() {
    return {
      controlName: 'ArcGIS Geocoder',
      fallbackDisableSubmit: false,
      version: '1.0',
      properties: {
        address: {
          type: 'string',
          title: 'Address',
          description: 'Enter the address for geocoding',
        },
        coordinates: {
          type: 'object',
          title: 'Coordinates',
          description: 'Retrieved Coordinates from the ArcGIS database',
        },
      },
    };
  }

  render() {
    return html`
      <label for="address">Enter Address:</label>
      <input id="address" type="text" .value=${this.address} @input=${(e) => this.address = e.target.value}>
      <p>
        ${this.coordinates.error
          ? html`<strong>${this.coordinates.error}</strong>`
          : html`Latitude: ${this.coordinates.y}, Longitude: ${this.coordinates.x}`
        }
      </p>
    `;
  }
}

// Registering the web component
const elementName = 'arcgis-geocoder-plugin';
customElements.define(elementName, ArcGISGeocoderPlugin);
