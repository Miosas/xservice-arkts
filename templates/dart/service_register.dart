
 import '{{service_dart_file_name}}.dart';
 {{#native_msg}}import '../handlers/{{service_dart_file_name}}_{{msg_dart_file_name}}.dart'; 
 {{/native_msg}}
 
 class {{service_name}}Register{
 
  static void register(){
      {{service_name}}.regsiter();
      {{#native_msg}}
      {{service_name}}{{name}}.regsiter();
      {{/native_msg}}
   }
 
 }