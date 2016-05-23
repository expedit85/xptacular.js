# xptacular.js

A Javascript library for Ajax requests and content updating.


## How to see the sample

**NOTE: you must install [node.js](http://nodejs.org) before!**

	git clone https://github.com/expedit85/xptacular.js.git
	cd xptacular.js/sample
	npm install
	node index.js

Browse to [http://localhost:3000/](http://localhost:3000/).



## How to include in your web page

~~~html
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js"></script>
	<script src="https://cdn.rawgit.com/s3u/JSONPath/master/lib/jsonpath.js"></script>
	<script src="https://cdn.rawgit.com/expedit85/xptacular.js/master/xptacular.js"></script>
~~~



## Short example

Consider a REST HTTP request for updating an user data, which returns his/her current data:

+ PUT /api/1.0/user/:uid
+ Headers:
	+ *Access-Token* - stored in an global variable `jwt`.
+ Path params:
	+ *:uid* - the user's identifier. Store in a global variable `jwtdata.uid`.
+ Query params:
	+ *origin* - the origin of the request (constant: "website").
+ Form data:
	+ *name* - the user's name;
	+ *email* - the user's email;
	+ *image_url* - the URL of the user's picture.
+ Result:
	+ `{ id : Number, name : String, email : String, image_url : String }`


This would make the request and fill in the fields with the result, just after the "Send" button is clicked:

~~~html
	<div class="xp-box" id="user_info"
		 xp-request-url="/api/1.0/user/:uid"
		 xp-request-method="PUT"
		 xp-action="none">

		<input type="hidden" name="Access-Token"
		       xp-param-type="header" xp-param-value="js:jwt" />
		<input type="hidden" name=":uid"
		       xp-param-type="path"   xp-param-value="js:jwtdata.uid" />
		<input type="hidden" name="origin"
		       xp-param-type="query"  value="website" />

		<img src="#"
		     xp-param-type="form" name="image_url"
		     xp-result-value="jp:image_url" xp-result-attr="src" />

		<br/>Name:
		<input type="text" name="name"
		       xp-param-type="form"
		       xp-result-value="jp:name">
		
		<br/>E-mail:
		<input type="text" name="email"
		       xp-param-type="form"
		       xp-result-value="jp:email">
	
		<br/>
		<input type="button" name="send" value="Submit" xp-send-on="click" />
	</div>
~~~



## Documentation

xptacular.js is a Javascript library for make Ajax requests and content update easily. This allows serving of purely static html files, for instance, by CDNs or Amazon S3, in conjunction with a public API.

After inclusion of jquery, jsonpath and xptacular scripts, is necessary to tell xptacular which HTML elements must be handled. It is made by adding the class `xp-box` to any HTML element you want to be updated by Ajax requests:

~~~html
`<div class="xp-box" ...> ... </div>`
~~~

~~~html
`<form class="xp-box" ...> ... </form>`
~~~

~~~html
`<section class="xp-box" ...> ... </section>`
~~~

and, so on...


The remaining configuration is made by adding attributes to the `xp-box`'es and its children elements.



### Attributes for `xp-box`'ed elements:

* **xp-request-url="*{url, absolute or path}*"** *[required]* - The URL or path to be requested when the box is triggered. Path params are allowed by using `xp-param-type` attributes (see [below](#xp-param-type)). We recomend use `:param_name` to be similar to express and sails, but any string is accepted. Example: `xp-request-url="/api/1.0/user/:uid"`.

* **xp-request-method="*GET|POST|PUT|DELETE*"** *[required]* - The HTTP method of the request.

* **xp-before-request="*{action expression}*"** *[optional]* - An action expression to be evaluated before the request starts. See [expressions](#expressions-section) section.

* **xp-after-request="*{action expression}*"** *[optional]* - An action expression to be evaluated after the request succeeds. See [expressions](#expressions-section) section.

* **xp-after-request-error="*{action expression}*"** *[optional]* - An action expression to be evaluated after the request fails. See [expressions](#expressions-section) section.

* **xp-action="*none|default*"** *[optional]* - The action to be performed at page loading. *none* means no action, *default* means make the request as soon as the page has loaded.


### Attributes for xp-box's children elements:

<a name="xp-param-type"></a>

* **xp-param-type="*path|query|header|form*"** *[required]* - The parameter type, i.e. the place on the request where the parameter will be put. If path parameter is used, be sure the value of `xp-param-name` attribute is identical to the name in the `xp-request-url`. For instance, for `xp-request-url="/api/1.0/user/:uid`, use `xp-param-type="path"` and `xp-param-name=":uid"`.

* **xp-param-name="*{string}*" or name="*string*"** *[required] - The parameter name. Both are identical in meaning, but `xp-param-name` is used if both are present.

* **xp-param-value="*{value expression}*"** *[optional]* - The value expression for the value of the parameter. If not given, the value will be the one in the `value` attribute for `<input>`s or innnerText (jQuery#text()) for the other tags. See [expressions section](#expressions-section).

* **xp-send-on="*{event name}*"** - Tells on which event of this child element the request shall be triggered. *event name* may be click, mouseenter, click.myscope, etc. Important: `xp-send-on` runs the request of the closest `xp-box` (jQuery#closest()).

* **xp-result-value="*{value expression}*"** - The value expression for the content of this HTML element after the request. The place on the element where the result value will be put is the `value` attribute for `<input>`s, innnerText (jQuery#text()) for the other tags, or an attribute specified by `xp-result-attr` attribute. See [expressions section](#expressions-section).

* **xp-result-attr="*{string}*"** - The attribute name in this HTML element where to put the result value.



<a name="expressions-section"></a>

### Expressions: ###

Expressions are a simple way to run small logics without the need of write full javascript code. They may be value-expression, action-expressions, or both.

#### Javascript:

A javascript expression is prefixed by "js:" and executed via eval() function. It may be any javascript code and is a value-expression when result in some value or action-expression when just run some code without a result. For instance: `"js: alert('Hello world');"`, `"js: document.title=$('#message').text();"`.

#### Xptacular:

A xptacular expression is prefixed by "xp:" and runs a request of the xp-box of the given selector (jQuery selectors). For instance, `"xp:#user_info"` is equivalent to `"js:xptacular('#user_info');"`.

#### JSON path:

A JSON path expression is prefixed by "jp:" and evaluate a JSON path in the context of the request body. For instance: `"jp:friends[0].name"` would return the name of the first friend of the user, just if the response body matches `{ friends : [ { name : "...", ... }, ...], ...}`.

#### Constants:

A constant literal value.


** TODO: add context to the expressions **


.


