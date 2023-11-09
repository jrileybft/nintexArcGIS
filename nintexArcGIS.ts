import { LitElement, html, css } from 'https://unpkg.com/lit@2.0.0/lit-element.js';

    class ArcGISGeocoder extends LitElement {

      static styles = css`
        :host {
          display: block;
          max-width: 400px;
          margin: 20px auto;
        }
      `;

      static properties = {
        address: { type: String },
        coordinates: { type: Object }
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
        const arcgisApiKey = 'AAPK38135e42cb394450ade05666216ca9edrCUQVoZnfHHpWbfWQj0zjdqi5izHrYGuF5M7HbFpsMnopXQBWA9xgK79kWT3hCjx';
        const arcgisUrl = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&singleLine=${address}&outFields=Addr_type&apiKey=${arcgisApiKey}`;

        fetch(arcgisUrl)
          .then(response => response.json())
          .then(data => {
            const candidate = data.candidates[0];
            if (candidate) {
              this.coordinates = candidate.location;
            } else {
              this.coordinates = { error: 'Address not found' };
            }
          })
          .catch(error => {
            console.error('Error during geocoding:', error);
            this.coordinates = { error: 'Geocoding error' };
          });
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

    customElements.define('arcgis-geocoder', ArcGISGeocoder);
