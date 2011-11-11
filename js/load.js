
var load = {};

;(function () {
	var counter = 0,
		loaded = [],
		loading = [],
		multiQueue = {},
	
	/**
	 * @param {Array.<string>}     dependencies
	 * @param {Function?} *callback
	 * @param {string?} *root_path
	 * @param {T?} *context 
	 */
	var Load = function (dependencies, callback, root, context) {
		this.id = 'load_' + (counter++).toString();
		this.callback = callback || function () {}; 
		this.root = (root) ? root.replace(/\/$/, '') : ''; 
		this.context = context || this;
		this.body = document.getElementsByTagName('body')[0];
		this.queue = [];
		
		var i = 0,
			queue = this.queue,
			file = '',
			fileCount = dependencies.length;

		if (fileCount < 1) {
			throw "No dependencies to be loaded.";
		}

		for (; i < fileCount; i++) {
			
			file = dependencies[i];

			if (!this.arrayContains(loaded, file)) {
				queue.push(file);
			}

			if (!this.arrayContains(loading, file)) {
				loading.push(file);
				this.fetch(file);
			} else {
				this.multiQueue(file);
			}
		}
		
		return i;
	};
	
	/**
	 * @param {Array} dependencies
	 * @param {Function?} callback
	 * @param {string?} root_path
	 * @param {T?} context 
	 * @return {Load}    
	 * 
	 * Creates a new Load without worrying about the constructor 
	 */
	load = function (dependencies, callback, root, context) {
		return new Load(dependencies, callback, root, context);
	};
	
	Load.prototype = {
		
		/**
		 * @param {string} src
		 * @return {void}
		 */
		multiQueue: function (src) {
			var currentEntry = multiQueue[src],
				originalCallBack = {},
				tag = this.getTagBySource(src),
				that = this;
	
			if (!!currentEntry) {
				currentEntry.push({context: this});
			} else {
				multiQueue[src] = [{context: this}];
				originalCallBack = tag.onload;
	
				function multi (event) {
					var i = 0,
						callQueue = multiQueue[src],
						len = callQueue.length,
						event = event || {},
						type = event.type || '';
					
					originalCallBack.call(that, arguments);
					
					if (type === "load") {
						this.onreadystatechange = function () {};
					} else {
						this.onload = function () {};
					}
	
					for (; i < len; i++) {
						that.loaded.call(callQueue[i].context, arguments, src);
					}
				}
				
				tag.onload = multi;
	
				tag.onreadystatechange = multi;
			}
		},

		/**
		 * @param {Object} args
		 * @param {string} path
		 * @return {number}
		 */
		loaded:  function (args, path) {
			var loadQueue = this.queue,
				limit = loadQueue.length,
				current = '';
			
			while (limit--) {
				current = loadQueue.pop();
				if (current !== path) {
					loadQueue.unshift(current);
				} else if (!this.arrayContains(loaded, current)) {
					loaded.push(current);
					break;
				} else {
					break;
				}
			}
	
			// IE seems to not be popping the array elements properly, so make sure
			// they're not empties
			if (loadQueue.length === 0 && current !== '') {
				this.callback.call(this.context);
			}
			
			return loadQueue.length;
		},
	
		/**
		 * @param {string} path
		 * @return {number}   
		 */
		fetch: function (path) {
			var script = this.make('script'),
				that = this;
	
			script.setAttribute('src', this.toPath(path));
			
			// Trap the path of the current script
			script.onload = function single () {
				that.loaded.call(that, arguments, path);
			};
	
			// For those unfortunate IE users
			script.onreadystatechange = function single () {
				that.loaded.call(that, arguments, path);
			};
			
			this.append(script);
			
			return 0;
		},
	
		/**
		 * @param {string} pathStub
		 * @return {string}
		 */
		toPath: function (pathStub) {
			return this.root + '/' + pathStub.replace(/^\//, '');
		},
	
		/**
		 * @param {string} tagName
		 * @return {DOMNode}
		 */
		make: function (tagName) {
			return window.document.createElement(tagName);
		},
		
		/**
		 * @param {DOMNode} tag
		 * @return {DOMNode}
		 */
		append: function (tag) {
			return this.body.appendChild(tag);
		},
		
		/**
		 * 
		 * @param {string} src
		 * @return {DOMNode}
		 */
		getTagBySource: function (src) {
			var tags = this.body.childNodes,
				tag = {},
				limit = tags.length,
			pathEndsWith = function (path, chars) {
				return (new RegExp(chars.replace(/^\.{0,2}/, '') + '$', 'i')).test(path);
			};
			while (limit--) {
				tag = tags[limit];
				if (tag.src && pathEndsWith(tag.src, src) ||
					tag.href && pathEndsWith(tag.href, src)) {
					return tag;
				}
			}
			return -1;
		},
	
		/**
		 * @param {Array} array
		 * @param {*} item
		 * @return {boolean}
		 */
		arrayContains: function (array, item) {
			var i = 0,
				limit = array.length;
	
			if (typeof [].indexOf === "function") {
				return array.indexOf(item) > -1;
			} else {
				for (; i < limit; i++) {
					if (array[i] === item) {
						return true;
					}
				}
			}
			return false;
		}
	};

})();
