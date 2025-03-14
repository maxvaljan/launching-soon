const { Client } = require('@googlemaps/google-maps-services-js');
const config = require('../../config');
const { ApiError, logger } = require('../../middleware/errorHandler');

/**
 * Google Maps Service
 * Abstracts Google Maps APIs for geocoding, directions, etc.
 */
class GoogleMapsService {
  constructor() {
    if (GoogleMapsService.instance) {
      return GoogleMapsService.instance;
    }
    
    this.client = new Client({});
    this.apiKey = config.maps.apiKey;
    
    if (!this.apiKey) {
      logger.warn('Google Maps API key not configured');
    }
    
    GoogleMapsService.instance = this;
  }
  
  /**
   * Geocode an address to coordinates
   * @param {string} address - The address to geocode
   * @returns {Promise<{lat: number, lng: number}>} - The coordinates
   */
  async geocode(address) {
    try {
      if (!this.apiKey) {
        throw new ApiError(500, 'Maps API not configured');
      }
      
      const response = await this.client.geocode({
        params: {
          address,
          key: this.apiKey
        }
      });
      
      if (response.data.status !== 'OK' || !response.data.results.length) {
        throw new ApiError(400, `Could not geocode address: ${address}`);
      }
      
      const { lat, lng } = response.data.results[0].geometry.location;
      return { lat, lng };
    } catch (error) {
      logger.error({
        message: 'Geocoding error',
        address,
        error: error.message,
        stack: error.stack
      });
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(500, 'Error geocoding address');
    }
  }
  
  /**
   * Get directions between two points
   * @param {Object} origin - Origin coordinates {lat, lng} or address string
   * @param {Object} destination - Destination coordinates {lat, lng} or address string
   * @param {Array<Object>} waypoints - Optional waypoints [{lat, lng}] or address strings
   * @returns {Promise<Object>} - Route details including distance and duration
   */
  async getDirections(origin, destination, waypoints = []) {
    try {
      if (!this.apiKey) {
        throw new ApiError(500, 'Maps API not configured');
      }
      
      const response = await this.client.directions({
        params: {
          origin: typeof origin === 'string' ? origin : `${origin.lat},${origin.lng}`,
          destination: typeof destination === 'string' ? destination : `${destination.lat},${destination.lng}`,
          waypoints: waypoints.map(wp => typeof wp === 'string' ? wp : `${wp.lat},${wp.lng}`),
          key: this.apiKey
        }
      });
      
      if (response.data.status !== 'OK' || !response.data.routes.length) {
        throw new ApiError(400, 'Could not calculate route');
      }
      
      const route = response.data.routes[0];
      const leg = route.legs[0];
      
      return {
        distance: leg.distance,
        duration: leg.duration,
        steps: leg.steps,
        polyline: route.overview_polyline,
        bounds: route.bounds
      };
    } catch (error) {
      logger.error({
        message: 'Directions error',
        origin,
        destination,
        error: error.message,
        stack: error.stack
      });
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(500, 'Error calculating route');
    }
  }
  
  /**
   * Calculate distance matrix between multiple origins and destinations
   * @param {Array<Object|string>} origins - Array of origin coordinates {lat, lng} or address strings
   * @param {Array<Object|string>} destinations - Array of destination coordinates {lat, lng} or address strings
   * @returns {Promise<Array>} - Matrix of distances and durations
   */
  async getDistanceMatrix(origins, destinations) {
    try {
      if (!this.apiKey) {
        throw new ApiError(500, 'Maps API not configured');
      }
      
      const response = await this.client.distancematrix({
        params: {
          origins: origins.map(o => typeof o === 'string' ? o : `${o.lat},${o.lng}`),
          destinations: destinations.map(d => typeof d === 'string' ? d : `${d.lat},${d.lng}`),
          key: this.apiKey
        }
      });
      
      if (response.data.status !== 'OK') {
        throw new ApiError(400, 'Could not calculate distance matrix');
      }
      
      return {
        originAddresses: response.data.origin_addresses,
        destinationAddresses: response.data.destination_addresses,
        rows: response.data.rows
      };
    } catch (error) {
      logger.error({
        message: 'Distance matrix error',
        error: error.message,
        stack: error.stack
      });
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(500, 'Error calculating distance matrix');
    }
  }
  
  /**
   * Get place details and autocomplete suggestions
   * @param {string} query - The search query
   * @param {Object} options - Search options
   * @returns {Promise<Array>} - Array of place suggestions
   */
  async getPlaceSuggestions(query, options = {}) {
    try {
      if (!this.apiKey) {
        throw new ApiError(500, 'Maps API not configured');
      }
      
      const response = await this.client.placesAutocomplete({
        params: {
          input: query,
          key: this.apiKey,
          components: options.country ? `country:${options.country}` : undefined,
          location: options.location ? `${options.location.lat},${options.location.lng}` : undefined,
          radius: options.radius
        }
      });
      
      if (response.data.status !== 'OK') {
        throw new ApiError(400, 'Could not get place suggestions');
      }
      
      return response.data.predictions.map(place => ({
        placeId: place.place_id,
        description: place.description,
        mainText: place.structured_formatting?.main_text,
        secondaryText: place.structured_formatting?.secondary_text
      }));
    } catch (error) {
      logger.error({
        message: 'Place suggestions error',
        query,
        error: error.message,
        stack: error.stack
      });
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(500, 'Error getting place suggestions');
    }
  }
}

module.exports = new GoogleMapsService();