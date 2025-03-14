/**
 * Base Repository Interface
 * This class defines the interface for all repositories
 * It should be extended by all concrete repositories
 */
class BaseRepository {
  /**
   * Find a single entity by ID
   * @param {string} id - The entity ID
   * @returns {Promise<Object>} - The entity or null
   */
  async findById(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Find all entities matching a filter
   * @param {Object} filter - The filter criteria
   * @param {Object} options - Additional options (pagination, sorting, etc.)
   * @returns {Promise<Array>} - Array of entities
   */
  async findAll(filter = {}, options = {}) {
    throw new Error('Method not implemented');
  }

  /**
   * Create a new entity
   * @param {Object} data - The entity data
   * @returns {Promise<Object>} - The created entity
   */
  async create(data) {
    throw new Error('Method not implemented');
  }

  /**
   * Update an existing entity
   * @param {string} id - The entity ID
   * @param {Object} data - The updated data
   * @returns {Promise<Object>} - The updated entity
   */
  async update(id, data) {
    throw new Error('Method not implemented');
  }

  /**
   * Delete an entity by ID
   * @param {string} id - The entity ID
   * @returns {Promise<boolean>} - Success status
   */
  async delete(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Check if an entity exists
   * @param {string} id - The entity ID
   * @returns {Promise<boolean>} - True if exists
   */
  async exists(id) {
    throw new Error('Method not implemented');
  }
}

module.exports = BaseRepository;