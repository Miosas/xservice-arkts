import 'dart:async';

import 'package:flutter/services.dart';
import 'package:xservice_kit/ServiceCallHandler.dart';
import 'package:xservice_kit/ServiceGateway.dart';

class {{service_name}}{{name}} extends ServiceCallHandler {

  static void regsiter() {
    ServiceGateway.sharedInstance().registerHandler(new {{service_name}}{{name}}());
  }

  @override
  String name() {
    return "{{name}}";
  }

  @override
  String service() {
    return "{{service_name}}";
  }

  @override
  Future<{{returnType}}> onMethodCall(MethodCall call) {
    return onCall({{#args}}call.arguments["{{name}}"]{{^last}},{{/last}}{{/args}});
  }

//==============================================Do not edit code above!
  Future<{{returnType}}> onCall({{#args}}{{type}} {{name}}{{^last}},{{/last}}{{/args}}) async{
    //TODO:Add you handler code here.
    {{#return_map}}
    return {};
    {{/return_map}}
    {{^return_map}}
    return null;
    {{/return_map}}
  }
}
