import { t as __commonJSMin } from "../_runtime.mjs";
//#region node_modules/doublearray/doublearray.js
var require_doublearray = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		"use strict";
		var TERM_CHAR = "\0", TERM_CODE = 0, ROOT_ID = 0, NOT_FOUND = -1, BASE_SIGNED = true, CHECK_SIGNED = true, BASE_BYTES = 4, CHECK_BYTES = 4, MEMORY_EXPAND_RATIO = 2;
		var newBC = function(initial_size) {
			if (initial_size == null) initial_size = 1024;
			var initBase = function(_base, start, end) {
				for (var i = start; i < end; i++) _base[i] = -i + 1;
				if (0 < check.array[check.array.length - 1]) {
					var last_used_id = check.array.length - 2;
					while (0 < check.array[last_used_id]) last_used_id--;
					_base[start] = -last_used_id;
				}
			};
			var initCheck = function(_check, start, end) {
				for (var i = start; i < end; i++) _check[i] = -i - 1;
			};
			var realloc = function(min_size) {
				var new_size = min_size * MEMORY_EXPAND_RATIO;
				var base_new_array = newArrayBuffer(base.signed, base.bytes, new_size);
				initBase(base_new_array, base.array.length, new_size);
				base_new_array.set(base.array);
				base.array = null;
				base.array = base_new_array;
				var check_new_array = newArrayBuffer(check.signed, check.bytes, new_size);
				initCheck(check_new_array, check.array.length, new_size);
				check_new_array.set(check.array);
				check.array = null;
				check.array = check_new_array;
			};
			var first_unused_node = 1;
			var base = {
				signed: BASE_SIGNED,
				bytes: BASE_BYTES,
				array: newArrayBuffer(BASE_SIGNED, BASE_BYTES, initial_size)
			};
			var check = {
				signed: CHECK_SIGNED,
				bytes: CHECK_BYTES,
				array: newArrayBuffer(CHECK_SIGNED, CHECK_BYTES, initial_size)
			};
			base.array[ROOT_ID] = 1;
			check.array[ROOT_ID] = ROOT_ID;
			initBase(base.array, 1, base.array.length);
			initCheck(check.array, 1, check.array.length);
			return {
				getBaseBuffer: function() {
					return base.array;
				},
				getCheckBuffer: function() {
					return check.array;
				},
				loadBaseBuffer: function(base_buffer) {
					base.array = base_buffer;
					return this;
				},
				loadCheckBuffer: function(check_buffer) {
					check.array = check_buffer;
					return this;
				},
				size: function() {
					return Math.max(base.array.length, check.array.length);
				},
				getBase: function(index) {
					if (base.array.length - 1 < index) return -index + 1;
					return base.array[index];
				},
				getCheck: function(index) {
					if (check.array.length - 1 < index) return -index - 1;
					return check.array[index];
				},
				setBase: function(index, base_value) {
					if (base.array.length - 1 < index) realloc(index);
					base.array[index] = base_value;
				},
				setCheck: function(index, check_value) {
					if (check.array.length - 1 < index) realloc(index);
					check.array[index] = check_value;
				},
				setFirstUnusedNode: function(index) {
					first_unused_node = index;
				},
				getFirstUnusedNode: function() {
					return first_unused_node;
				},
				shrink: function() {
					var last_index = this.size() - 1;
					while (true) {
						if (0 <= check.array[last_index]) break;
						last_index--;
					}
					base.array = base.array.subarray(0, last_index + 2);
					check.array = check.array.subarray(0, last_index + 2);
				},
				calc: function() {
					var unused_count = 0;
					var size = check.array.length;
					for (var i = 0; i < size; i++) if (check.array[i] < 0) unused_count++;
					return {
						all: size,
						unused: unused_count,
						efficiency: (size - unused_count) / size
					};
				},
				dump: function() {
					var dump_base = "";
					var dump_check = "";
					var i = 0;
					for (; i < base.array.length; i++) dump_base = dump_base + " " + this.getBase(i);
					for (i = 0; i < check.array.length; i++) dump_check = dump_check + " " + this.getCheck(i);
					console.log("base:" + dump_base);
					console.log("chck:" + dump_check);
					return "base:" + dump_base + " chck:" + dump_check;
				}
			};
		};
		/**
		* Factory method of double array
		*/
		function DoubleArrayBuilder(initial_size) {
			this.bc = newBC(initial_size);
			this.keys = [];
		}
		/**
		* Append a key to initialize set
		* (This method should be called by dictionary ordered key)
		*
		* @param {String} key
		* @param {Number} value Integer value from 0 to max signed integer number - 1
		*/
		DoubleArrayBuilder.prototype.append = function(key, record) {
			this.keys.push({
				k: key,
				v: record
			});
			return this;
		};
		/**
		* Build double array for given keys
		*
		* @param {Array} keys Array of keys. A key is a Object which has properties 'k', 'v'.
		* 'k' is a key string, 'v' is a record assigned to that key.
		* @return {DoubleArray} Compiled double array
		*/
		DoubleArrayBuilder.prototype.build = function(keys, sorted) {
			if (keys == null) keys = this.keys;
			if (keys == null) return new DoubleArray(this.bc);
			if (sorted == null) sorted = false;
			var buff_keys = keys.map(function(k) {
				return {
					k: stringToUtf8Bytes(k.k + TERM_CHAR),
					v: k.v
				};
			});
			if (sorted) this.keys = buff_keys;
			else this.keys = buff_keys.sort(function(k1, k2) {
				var b1 = k1.k;
				var b2 = k2.k;
				var min_length = Math.min(b1.length, b2.length);
				for (var pos = 0; pos < min_length; pos++) {
					if (b1[pos] === b2[pos]) continue;
					return b1[pos] - b2[pos];
				}
				return b1.length - b2.length;
			});
			buff_keys = null;
			this._build(ROOT_ID, 0, 0, this.keys.length);
			return new DoubleArray(this.bc);
		};
		/**
		* Append nodes to BASE and CHECK array recursively
		*/
		DoubleArrayBuilder.prototype._build = function(parent_index, position, start, length) {
			var children_info = this.getChildrenInfo(position, start, length);
			var _base = this.findAllocatableBase(children_info);
			this.setBC(parent_index, children_info, _base);
			for (var i = 0; i < children_info.length; i = i + 3) {
				var child_code = children_info[i];
				if (child_code === TERM_CODE) continue;
				var child_start = children_info[i + 1];
				var child_len = children_info[i + 2];
				var child_index = _base + child_code;
				this._build(child_index, position + 1, child_start, child_len);
			}
		};
		DoubleArrayBuilder.prototype.getChildrenInfo = function(position, start, length) {
			var current_char = this.keys[start].k[position];
			var i = 0;
			var children_info = new Int32Array(length * 3);
			children_info[i++] = current_char;
			children_info[i++] = start;
			var next_pos = start;
			var start_pos = start;
			for (; next_pos < start + length; next_pos++) {
				var next_char = this.keys[next_pos].k[position];
				if (current_char !== next_char) {
					children_info[i++] = next_pos - start_pos;
					children_info[i++] = next_char;
					children_info[i++] = next_pos;
					current_char = next_char;
					start_pos = next_pos;
				}
			}
			children_info[i++] = next_pos - start_pos;
			children_info = children_info.subarray(0, i);
			return children_info;
		};
		DoubleArrayBuilder.prototype.setBC = function(parent_id, children_info, _base) {
			var bc = this.bc;
			bc.setBase(parent_id, _base);
			var i = 0;
			for (; i < children_info.length; i = i + 3) {
				var code = children_info[i];
				var child_id = _base + code;
				var prev_unused_id = -bc.getBase(child_id);
				var next_unused_id = -bc.getCheck(child_id);
				if (child_id !== bc.getFirstUnusedNode()) bc.setCheck(prev_unused_id, -next_unused_id);
				else bc.setFirstUnusedNode(next_unused_id);
				bc.setBase(next_unused_id, -prev_unused_id);
				var check = parent_id;
				bc.setCheck(child_id, check);
				if (code === TERM_CODE) {
					var start_pos = children_info[i + 1];
					var value = this.keys[start_pos].v;
					if (value == null) value = 0;
					var base = -value - 1;
					bc.setBase(child_id, base);
				}
			}
		};
		/**
		* Find BASE value that all children are allocatable in double array's region
		*/
		DoubleArrayBuilder.prototype.findAllocatableBase = function(children_info) {
			var bc = this.bc;
			var _base;
			var curr = bc.getFirstUnusedNode();
			while (true) {
				_base = curr - children_info[0];
				if (_base < 0) {
					curr = -bc.getCheck(curr);
					continue;
				}
				var empty_area_found = true;
				for (var i = 0; i < children_info.length; i = i + 3) {
					var code = children_info[i];
					var candidate_id = _base + code;
					if (!this.isUnusedNode(candidate_id)) {
						curr = -bc.getCheck(curr);
						empty_area_found = false;
						break;
					}
				}
				if (empty_area_found) return _base;
			}
		};
		/**
		* Check this double array index is unused or not
		*/
		DoubleArrayBuilder.prototype.isUnusedNode = function(index) {
			var check = this.bc.getCheck(index);
			if (index === ROOT_ID) return false;
			if (check < 0) return true;
			return false;
		};
		/**
		* Factory method of double array
		*/
		function DoubleArray(bc) {
			this.bc = bc;
			this.bc.shrink();
		}
		/**
		* Look up a given key in this trie
		*
		* @param {String} key
		* @return {Boolean} True if this trie contains a given key
		*/
		DoubleArray.prototype.contain = function(key) {
			var bc = this.bc;
			key += TERM_CHAR;
			var buffer = stringToUtf8Bytes(key);
			var parent = ROOT_ID;
			var child = NOT_FOUND;
			for (var i = 0; i < buffer.length; i++) {
				var code = buffer[i];
				child = this.traverse(parent, code);
				if (child === NOT_FOUND) return false;
				if (bc.getBase(child) <= 0) return true;
				else {
					parent = child;
					continue;
				}
			}
			return false;
		};
		/**
		* Look up a given key in this trie
		*
		* @param {String} key
		* @return {Number} Record value assgned to this key, -1 if this key does not contain
		*/
		DoubleArray.prototype.lookup = function(key) {
			key += TERM_CHAR;
			var buffer = stringToUtf8Bytes(key);
			var parent = ROOT_ID;
			var child = NOT_FOUND;
			for (var i = 0; i < buffer.length; i++) {
				var code = buffer[i];
				child = this.traverse(parent, code);
				if (child === NOT_FOUND) return NOT_FOUND;
				parent = child;
			}
			var base = this.bc.getBase(child);
			if (base <= 0) return -base - 1;
			else return NOT_FOUND;
		};
		/**
		* Common prefix search
		*
		* @param {String} key
		* @return {Array} Each result object has 'k' and 'v' (key and record,
		* respectively) properties assigned to matched string
		*/
		DoubleArray.prototype.commonPrefixSearch = function(key) {
			var buffer = stringToUtf8Bytes(key);
			var parent = ROOT_ID;
			var child = NOT_FOUND;
			var result = [];
			for (var i = 0; i < buffer.length; i++) {
				var code = buffer[i];
				child = this.traverse(parent, code);
				if (child !== NOT_FOUND) {
					parent = child;
					var grand_child = this.traverse(child, TERM_CODE);
					if (grand_child !== NOT_FOUND) {
						var base = this.bc.getBase(grand_child);
						var r = {};
						if (base <= 0) r.v = -base - 1;
						r.k = utf8BytesToString(arrayCopy(buffer, 0, i + 1));
						result.push(r);
					}
					continue;
				} else break;
			}
			return result;
		};
		DoubleArray.prototype.traverse = function(parent, code) {
			var child = this.bc.getBase(parent) + code;
			if (this.bc.getCheck(child) === parent) return child;
			else return NOT_FOUND;
		};
		DoubleArray.prototype.size = function() {
			return this.bc.size();
		};
		DoubleArray.prototype.calc = function() {
			return this.bc.calc();
		};
		DoubleArray.prototype.dump = function() {
			return this.bc.dump();
		};
		var newArrayBuffer = function(signed, bytes, size) {
			if (signed) switch (bytes) {
				case 1: return new Int8Array(size);
				case 2: return new Int16Array(size);
				case 4: return new Int32Array(size);
				default: throw new RangeError("Invalid newArray parameter element_bytes:" + bytes);
			}
			else switch (bytes) {
				case 1: return new Uint8Array(size);
				case 2: return new Uint16Array(size);
				case 4: return new Uint32Array(size);
				default: throw new RangeError("Invalid newArray parameter element_bytes:" + bytes);
			}
		};
		var arrayCopy = function(src, src_offset, length) {
			var buffer = new ArrayBuffer(length);
			var dstU8 = new Uint8Array(buffer, 0, length);
			var srcU8 = src.subarray(src_offset, length);
			dstU8.set(srcU8);
			return dstU8;
		};
		/**
		* Convert String (UTF-16) to UTF-8 ArrayBuffer
		*
		* @param {String} str UTF-16 string to convert
		* @return {Uint8Array} Byte sequence encoded by UTF-8
		*/
		var stringToUtf8Bytes = function(str) {
			var bytes = new Uint8Array(/* @__PURE__ */ new ArrayBuffer(str.length * 4));
			var i = 0, j = 0;
			while (i < str.length) {
				var unicode_code;
				var utf16_code = str.charCodeAt(i++);
				if (utf16_code >= 55296 && utf16_code <= 56319) {
					var upper = utf16_code;
					var lower = str.charCodeAt(i++);
					if (lower >= 56320 && lower <= 57343) unicode_code = (upper - 55296) * 1024 + 65536 + (lower - 56320);
					else return null;
				} else unicode_code = utf16_code;
				if (unicode_code < 128) bytes[j++] = unicode_code;
				else if (unicode_code < 2048) {
					bytes[j++] = unicode_code >>> 6 | 192;
					bytes[j++] = unicode_code & 63 | 128;
				} else if (unicode_code < 65536) {
					bytes[j++] = unicode_code >>> 12 | 224;
					bytes[j++] = unicode_code >> 6 & 63 | 128;
					bytes[j++] = unicode_code & 63 | 128;
				} else if (unicode_code < 1 << 21) {
					bytes[j++] = unicode_code >>> 18 | 240;
					bytes[j++] = unicode_code >> 12 & 63 | 128;
					bytes[j++] = unicode_code >> 6 & 63 | 128;
					bytes[j++] = unicode_code & 63 | 128;
				}
			}
			return bytes.subarray(0, j);
		};
		/**
		* Convert UTF-8 ArrayBuffer to String (UTF-16)
		*
		* @param {Uint8Array} bytes UTF-8 byte sequence to convert
		* @return {String} String encoded by UTF-16
		*/
		var utf8BytesToString = function(bytes) {
			var str = "";
			var code, b1, b2, b3, b4, upper, lower;
			var i = 0;
			while (i < bytes.length) {
				b1 = bytes[i++];
				if (b1 < 128) code = b1;
				else if (b1 >> 5 === 6) {
					b2 = bytes[i++];
					code = (b1 & 31) << 6 | b2 & 63;
				} else if (b1 >> 4 === 14) {
					b2 = bytes[i++];
					b3 = bytes[i++];
					code = (b1 & 15) << 12 | (b2 & 63) << 6 | b3 & 63;
				} else {
					b2 = bytes[i++];
					b3 = bytes[i++];
					b4 = bytes[i++];
					code = (b1 & 7) << 18 | (b2 & 63) << 12 | (b3 & 63) << 6 | b4 & 63;
				}
				if (code < 65536) str += String.fromCharCode(code);
				else {
					code -= 65536;
					upper = 55296 | code >> 10;
					lower = 56320 | code & 1023;
					str += String.fromCharCode(upper, lower);
				}
			}
			return str;
		};
		var doublearray = {
			builder: function(initial_size) {
				return new DoubleArrayBuilder(initial_size);
			},
			load: function(base_buffer, check_buffer) {
				var bc = newBC(0);
				bc.loadBaseBuffer(base_buffer);
				bc.loadCheckBuffer(check_buffer);
				return new DoubleArray(bc);
			}
		};
		if ("undefined" === typeof module) window.doublearray = doublearray;
		else module.exports = doublearray;
	})();
}));
//#endregion
export { require_doublearray as t };
