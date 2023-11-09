import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

export class ArcGISGeocoderPlugin extends LitElement {

  static properties = {
    address: { type: String },
    pin: { type: String },
  };

  constructor() {
    super();
    this.address = '';
    this.pin = '';
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
    const arcgisUrl = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&singleLine=${address}&outFields=pin&apiKey=${arcgisApiKey}`;

    fetch(arcgisUrl)
      .then(response => response.json())
      .then(data => {
        const candidate = data.candidates[0];
        if (candidate) {
          this.pin = candidate.attributes.pin;
        } else {
          this.pin = 'Not available';
        }
      })
      .catch(error => {
        console.error('Error during geocoding:', error);
        this.pin = 'Geocoding error';
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
        pin: {
          type: 'string',
          title: 'Pin',
          description: 'Retrieved Pin from the ArcGIS database',
        },
      },
    };
  }

  render() {
    return html`
      <label for="address">Enter Address:</label>
      <input id="address" type="text" .value=${this.address} @input=${(e) => this.address = e.target.value}>
      <p>
        Pin: ${this.pin}
      </p>
    `;
  }
}

// Registering the web component
const elementName = 'arcgis-geocoder-plugin';
customElements.define(elementName, ArcGISGeocoderPlugin);
