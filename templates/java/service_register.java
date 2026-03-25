package {{pkg_name}}.{{service_name}}.service;

import {{pkg_name}}.{{service_name}}.handlers.*;

public class {{service_name}}Register {
    public static void register(){
        {{service_name}}.register();
        {{#flutter_msg}}
        {{service_name}}_{{name}}.register();
        {{/flutter_msg}}
    }
}
