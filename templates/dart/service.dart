import 'dart:async';
import 'package:xservice_kit/ServiceTemplate.dart';
import 'package:xservice_kit/ServiceGateway.dart';

class {{name}} {
	static final ServiceTemplate _service = new ServiceTemplate("{{name}}");

	static ServiceTemplate service(){
		return _service;
	}

	static void regsiter() {
		ServiceGateway.sharedInstance().registerService(_service);
	}

	{{#flutter_msg}}
  static Future<{{returnType}}> {{name}}({{#args}}{{type}} {{name}}{{^last}},{{/last}}{{/args}},[onInvocationException? onException]) {
		 Map<String,dynamic> properties = new Map<String,dynamic>();
		 {{#args}}properties["{{name}}"]= {{name}};
		 {{/args}}return _service.invokeMethod('{{name}}',properties,onException).then<{{returnType}}>((value){
        if(value == null){
	     return {{default_return_value}};
		 }else{
			 return value;
		 }
		 });
	}
  {{/flutter_msg}}

}
