import fs from 'fs'
import cache from '../cache.json' //relative path
import Hashes from 'jshashes'
import _ from 'lodash'
let SHA1 = new Hashes.SHA1

/**
 * Handle caching of minimax scores
 */
export default class CacheManager {
	/**
	 * Constructor
	 * @param  {Object} options Options
	 */
	constructor(options) {
		this.filename = "./cache.json" // absolute path
		this.options = _.defaults(options || {}, {
			enabled: true
		})

		this.cache = (this.options.enabled) ? cache || {} : {}
	}

	/**
	 * Generate SHA1 key from the arguments passed to this function
	 * @return {String} 
	 */
	generateKeyFromSHA1() {
		return SHA1.hex(JSON.stringify(arguments))
	}

	/**
	 * Checks if a key exists in the cache
	 * @param  {String} key The key to check the existance
	 * @return {Boolean}     Whether the key exists in the cache or not
	 */
	exist(key) {
		return this.cache && this.cache.hasOwnProperty(key)
	}

	/**
	 * Returns the value for the given key
	 * @param  {String} key The key to check
	 * @return {String|Boolean}     Returns the value of the key passed or false if the key doesn't exist.
	 */
	get(key) {
		if(this.exist(key))
			return this.cache[key]
		return false
	}

	/**
	 * Sets the value for the key given in the cache
	 * @param {String} key   The key to save the value in
	 * @param {*} value Save any type of value
	 * @return {*} Returns the value
	 */
	set(key, value) {

		if(!this.exist(key)) {
			this.cache[key] = value

			if(process.browser || !this.options.enabled)
				return value

			fs.writeFile(this.filename, JSON.stringify(this.cache), (err) => {})
			return value
		}

		return value
	}

	/**
	 * Clear to cache
	 */
	clear() {
		fs.writeFileSync(this.filename, JSON.stringify({}))
	}

}