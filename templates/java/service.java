package {{pkg_name}}.{{service_name}}.service;

import java.util.HashMap;
import java.util.Map;

import fleamarket.taobao.com.xservicekit.service.ServiceTemplate;
import fleamarket.taobao.com.xservicekit.service.ServiceGateway;
import io.flutter.plugin.common.MethodChannel;
import fleamarket.taobao.com.xservicekit.handler.MessageResult;

public class {{service_name}} {
    private static final ServiceTemplate mService  = new ServiceTemplate("{{service_name}}");
    public static ServiceTemplate getService(){
        return mService;
    }
    public static void register(){
        ServiceGateway.sharedInstance().addService(mService);
    }
    {{#native_msg}}
    public static void {{name}}(final MessageResult<{{return_java_type}}> result, {{#args}}{{java_type}} {{name}}{{^last}},{{/last}}{{/args}}){
        Map<String,Object> args = new HashMap<>();
        {{#args}}args.put("{{name}}",{{name}});
        {{/args}}mService.invoke("{{name}}", args, mService.methodChannelName(), new MethodChannel.Result() {
            @Override
            public void success(Object o) {
                if (o instanceof  {{return_java_type}}){
                    result.success(({{return_java_type}})o);
                }else{
                    result.error("return type error code dart code","","");
                }
            }
            
            @Override
            public void error(String s, String s1, Object o) {
                if (result != null){
                    result.error(s,s1,o);
                }
            }
            
            @Override
            public void notImplemented() {
                if (result != null){
                    result.notImplemented();
                }
            }
        });
    }{{/native_msg}}
}
