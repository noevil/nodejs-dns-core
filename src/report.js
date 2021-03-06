var config = require('../config');
var DB = require('./db');
var nullcb = function() {};

var Report = function() {
	var self = this;

	this.switch_view = false;
	this.funcs = [];
	this.db = new DB('REPORT', function() {
		self.funcs.forEach(function(func) {
			func();
		});
	});

	this.init();
	return this;
};

Report.prototype.init = function() {
	this.dns_req_count = 0;
	this.dns_res_count = 0;
	this.dns_ask_count = 0;
	this.dns_err_count = 0;
	this.dns_ign_count = 0;
	this.dns_dbr_count = 0;
	this.dns_dbw_count = 0;
	return this;
};

Report.prototype.ready = function(func) {
	this.funcs.push(func);
};

Report.prototype.view = function(secend) {
	var self = this;

	this.switch_view = true;

	setInterval(function() {
		console.log(
			'REQ', self.fixlen(self.dns_req_count), 
			', RES', self.fixlen(self.dns_res_count),
			', ASK', self.fixlen(self.dns_ask_count),
			', IGN', self.fixlen(self.dns_ign_count),
			', DBR', self.fixlen(self.dns_dbr_count),
			', DBW', self.fixlen(self.dns_dbw_count),
			', ERR', self.fixlen(self.dns_err_count)
		);
		self.init();
	}, 1000);
};

Report.prototype.log = function(type, content, spot) {
	if (!this.switch_view)
		return;

	var uuid = this.db.uid();
	var data = {
		_id: uuid,
		type: type,
		content: content,
		spot: spot,
		read: 0,
		date: Date.now()
	};

	this.db.collection('main').set({_id: uuid}, data, nullcb);
};

Report.prototype.fixlen = function(str) {
	return '       '.substr(('' + str).length) + str;
};

module.exports = Report;