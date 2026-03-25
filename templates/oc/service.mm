//Generated code. Do not edit!
#import "Service_{{service_name}}.h"
#import "ServiceGateway.h"
#import "FlutterServiceTemplate.h"
 
@implementation Service_{{service_name}}

 + (FlutterServiceTemplate *)service {
     static id _instance = nil;
     static dispatch_once_t onceToken;
     dispatch_once(&onceToken, ^{
         _instance = [[FlutterServiceTemplate alloc] initWithName:@"{{service_name}}"];
     });
     return _instance;
 }
 
 + (void)load{
      [[ServiceGateway sharedInstance] addService:[self service]];
 }

{{#native_msg}}+ (void){{name}}:(void (^)({{return_oc_ob_type}}))resultCallback {{#args}}{{name}}:({{oc_ob_type}}){{name}} {{/args}} {
     NSMutableDictionary *tmp = [NSMutableDictionary dictionary];
     {{#args}}if({{name}}) tmp[@"{{name}}"] = {{name}};
     {{/args}}[self.service invoke:@"{{name}}" args:tmp result:^(id tTesult) {
         if (resultCallback) {
             resultCallback(tTesult);
         }
     }];
 }
 {{/native_msg}}

 @end
