import fs from 'fs'
import cache from '../cache.json' //relative path
import Hashes from 'jshashes'
import _ from 'lodash'
let SHA1 = new Hashes.SHA1

export default class CacheManager {

	constructor(options) {
		this.filename = "./cache.json" // absolute path
		this.options = _.defaults(options || {}, {
			enabled: true
		})

		this.cache = (this.options.enabled) ? cache || {} : {}
	}

	generateKeyFromSHA1() {
		return SHA1.hex(JSON.stringify(arguments))
	}

	exist(key) {
		return this.cache && this.cache.hasOwnProperty(key)
	}

	get(key) {
		if(this.exist(key))
			return this.cache[key]
		return false
	}

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

	clear() {
		fs.writeFileSync(this.filename, JSON.stringify({}))
	}

}