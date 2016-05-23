

function xpetacular(params) {

	if (typeof params !== "undefined") {
		if (params.constructor == Array) {
			$(params).each(function(i,e){xpetacular(e);});
			return;
		}
		else if (params.constructor == String) {
			xpetacular($(params));
			return;
		}
		else if (params.constructor == jQuery) {
			this.run(params.filter(".xp-box"));
			return;
		}
		else return;
	}

	var self = this;


	///////////////////////////////////
	// Helper functions
	///////////////////////////////////

	var getValue = function(o) {
		var e = o.constructor != jQuery ? $(o) : o;
		var attr = e.attr('xp-param-value');
		if (attr) return parseExpr(null, attr);
		else if (e.is("input")) return e.val();
		else return e.text();
	};

	var regex = {
		cookieValue : /^cookies\[([a-zA-Z0-9_\.]+)\]$/
	};

	var parseExpr = function(obj, exp) {
		if (exp.indexOf("js:") == 0) {
			return eval(exp.substring(3));	
		}
		else if (exp.indexOf("jp:") == 0) {
			return JSONPath( { path: exp.substring(3).trim(), json: obj } );
		}
		else if (exp.indexOf("xp:") == 0) {
			return xpetacular(exp.substring(3));
		}
		else return exp;
	};


	var headers = {
		"Accept" : "application/json"
	};

	// $("#xp-request-config").find("input[xp-type]").each(function(i,e) {
	// 	switch ($(e).attr('xp-type')) {
	// 		case 'header':
	// 			headers[$(e).attr('name')] = parseExpr(e, $(e).attr('value'));
	// 			break;
	// 	}
	// });


	this.run = function(x) {
		if (typeof x === 'undefined') return;

		if (x.constructor == jQuery) {

			var $box = x;

			var method = $box.attr('xp-request-method').toUpperCase();
			var url = $box.attr('xp-request-url');

			var headers = $.extend({}, headers);
			var requestData = {};

			$box.find("[xp-param-type]").each(function(i,e){
				var type = $(e).attr('xp-param-type');
				var name = $(e).attr('name');
				var value = getValue($(e));
				switch (type) {
					case 'path':
						url = url.replace(name, value);
						break;
					case 'query':
						requestData[name] = value;
						break;
					case 'form':
						if (['PUT', 'POST'].indexOf(method) >= 0)
							requestData[name] = value;
						break;
					case 'header':
						headers[name] = value;
				}
			});


			

			switch (method) {
				case 'GET':
					break;
				case 'POST':
				case 'PUT':
				case 'DELETE':
			}

			parseExpr(null, $box.attr('xp-before-request') || "");

			$.ajax( {
				url : url,
				method : method,
				headers : headers,
				data : requestData
			})
			.done(function(data) {
				
				console.log('ajax result data', data);

				$box.find("[xp-result-value]").each(function(i,e){ 
					var destAttr = $(e).attr('xp-result-attr');
					var value = parseExpr(data, $(e).attr('xp-result-value'));

					if (destAttr)
						$(e).attr(destAttr, value);
					else if ($(e).is('input'))
						$(e).val(value);
					else
						$(e).text(value);
				});

				parseExpr(null, $box.attr('xp-after-request') || "");
			})
			.fail(function() {
				parseExpr(null, $box.attr('xp-after-request-error') || "");
			});
		}
		else this.run($(x));
	};


	// run all allowed boxes at startup
	$(".xp-box:not([xp-action]), .xp-box[xp-action=default]").each(function(i, e) {
		window.setTimeout(function() { self.run(e); }, 1);
	});


	// register send events of all boxes
	$(".xp-box").find("[xp-send-on]").each(function(i,e){
		var eventName = $(e).attr('xp-send-on');
		if (eventName) {
			eventName = eventName + ".xpetacular";
			$(e).off(eventName).on(eventName, function() {
				self.run($(e).closest(".xp-box"));
			});
		}
	});

}


$(function() { xpetacular(); });
