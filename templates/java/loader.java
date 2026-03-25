package {{pkg_name}}.loader;

{{#services}}import {{pkg_name}}.{{name}}.service.*;
{{/services}}

public class ServiceLoader {
    public static void load(){
        {{#services}}
        {{name}}Register.register();
        {{/services}}
    }
}
