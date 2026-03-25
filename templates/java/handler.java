package {{pkg_name}}.{{service_name}}.handlers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import fleamarket.taobao.com.xservicekit.handler.MessageHandler;
import fleamarket.taobao.com.xservicekit.handler.MessageResult;
import fleamarket.taobao.com.xservicekit.service.ServiceGateway;

public class {{service_name}}_{{name}} implements MessageHandler<{{return_java_type}}>{
    private Object mContext = null;
    private boolean onCall(MessageResult<{{return_java_type}}> result,{{#args}}{{java_type}} {{name}}{{^last}},{{/last}}{{/args}}){
        //Add your handler code here.
        return true;
    }
    
    //==================Do not edit code blow!==============
    @Override
    public boolean onMethodCall(String name, Map args, MessageResult<{{return_java_type}}> result) {
        this.onCall(result,{{#args}}({{java_type}})args.get("{{name}}"){{^last}},{{/last}}{{/args}});
        return  true;
    }
    @Override
    public List<String> handleMessageNames() {
        List<String> h = new ArrayList<>();
        h.add("{{name}}");
        return h;
    }
    @Override
    public Object getContext() {
        return mContext;
    }
    
    @Override
    public void setContext(Object obj) {
        mContext = obj;
    }
    @Override
    public String service() {
        return "{{service_name}}";
    }
    public static void register(){
        ServiceGateway.sharedInstance().registerHandler(new {{service_name}}_{{name}}());
    }
}
