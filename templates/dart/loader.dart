{{#services}}import '../{{name}}/service/{{service_dart_file_name}}_register.dart';
{{/services}}
 
class ServiceLoader{
  static void load(){
    {{#services}}
    {{name}}Register.register();
    {{/services}}
  }
}