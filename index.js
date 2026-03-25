#!/usr/bin/env node

var program = require('commander');
var Path = require('path');
var Mustache = require('mustache');
var YAML = require('js-yaml');

console.log('xservice-arkts tool package at');
console.log(__dirname);



program
    .arguments('<directory>')
    .option('-o , --output <output>', 'A directory to save the output')
    .option('-t , --type <type>', 'input file type support json and yaml default is json')
    .option('-p , --package <package>', 'Java package')
    .option('-a , --arkts', 'generate ArkTS code')
    .action(function (directory) {
        program.directory = directory;
        start(directory);
    }).parse(process.argv);

function toJsonString(rawdata) {
    return YAML.safeLoad(rawdata);
}

function start(input_directory) {
    const fs = require('fs');
    let jsonAll = new Array();

    if (program.type == 'yaml') {
        fs.readdirSync(input_directory).forEach(file => {
            if (file.includes('yaml') || file.includes('yml')) {
                let realPath = Path.join(input_directory, file);
                let rawdata = fs.readFileSync(realPath, 'utf8');
                let jsonService = toJsonString(rawdata);
                jsonAll.push(jsonService);
            }
        });
    } else {
        fs.readdirSync(input_directory).forEach(file => {
            if (file.includes('json')) {
                let realPath = Path.join(input_directory, file);
                let rawdata = fs.readFileSync(realPath, 'utf8');
                let jsonService = JSON.parse(rawdata);
                jsonAll.push(jsonService);
            }
        });
    }

    var serviceNames = [];
    console.log('Start generating...');
    console.log('[input] -> ' + input_directory);
    console.log('[package] -> ' + program.package);
    console.log('---------------------------');
    for (var i = 0; i < jsonAll.length; i++) {
        console.log(jsonAll[i]);
        formate_data(jsonAll[i]);
        gen_java(jsonAll[i]);
        gen_oc(jsonAll[i]);
        gen_dart(jsonAll[i]);
        if (program.arkts) {
            gen_arkts(jsonAll[i]);
        }
        serviceNames.push({
            "name": jsonAll[i].name,
            "service_dart_file_name": dart_file_name(jsonAll[i].name)
        });
        console.log('Generating ' + jsonAll[i].name + " success!");
        console.log('============================= ' + jsonAll[i].name);
    }

    jsonAll.pkg_name = program.package;
    jsonAll.services = serviceNames;

    console.log('Generating loaders');
    gen_loader(jsonAll);
    console.log('Generating Fnished. All success!');
    console.log('!!!Please find the output under directory ' + program.output);
}

function default_dart_value(type) {
    var mapper = {
        "int": "0",
        "double": "0.0",
        "bool": "false",
        "String": '""',
    };

    var mappedType = mapper[type];


    if (mappedType) {
        return mappedType;
    }

    if (type.includes("List")) {
        return "[]";
    }

    if (type.includes("Map")) {
        return "{}";
    }

    return mappedType;
}

function formate_data(jsonService) {
    jsonService.service_name = jsonService.name;
    jsonService.service_dart_file_name = dart_file_name(jsonService.name);

    var nativeMessages = [];
    var flutterMessages = [];
    for (var i = 0; i < jsonService.messages.length; i++) {
        var msg = jsonService.messages[i];
        msg.service_dart_file_name = jsonService.service_dart_file_name;
        msg.msg_dart_file_name = dart_file_name(msg.name);
        msg.return_oc_type = dart_to_oc_type(msg.returnType);
        msg.return_oc_ob_type = dart_to_oc_object_type(msg.returnType);
        msg.return_java_type = dart_to_java_type(msg.returnType);
        msg.return_arkts_type = dart_to_arkts_type(msg.returnType);
        msg.service_name = jsonService.name;
        msg.last = (i == jsonService.messages.length - 1);
        msg.pkg_name = program.package;
        msg.default_return_value = default_dart_value(msg.returnType);
        msg.return_map = msg.returnType === "Map";

        for (var j = 0; j < msg.args.length; j++) {
            var arg = msg.args[j];
            arg.oc_type = dart_to_oc_type(arg.type);
            arg.java_type = dart_to_java_type(arg.type);
            arg.oc_ob_type = dart_to_oc_object_type(arg.type);
            arg.arkts_type = dart_to_arkts_type(arg.type);
            arg.last = (j == msg.args.length - 1);
        }

        if (msg.messageType == "flutter") {
            flutterMessages.push(msg);
        } else {
            nativeMessages.push(msg);
        }
    }

    jsonService.native_msg = nativeMessages;
    jsonService.flutter_msg = flutterMessages;
    jsonService.pkg_name = program.package;
}

function gen_loader(jsonAll) {
    gen_java_loader(jsonAll);
    gen_dart_loader(jsonAll);
    if (program.arkts) {
        gen_arkts_loader(jsonAll);
    }
}

function gen_java_loader(jsonAll) {
    generate("java/loader.java", jsonAll, "java/loader/ServiceLoader.java");
}

function gen_dart_loader(jsonAll) {
    generate("dart/loader.dart", jsonAll, "dart/loader/service_loader.dart");
}

function gen_arkts_loader(jsonAll) {
    const context = {
        pkg_name: jsonAll.pkg_name,
        services: jsonAll.services || []
    };
    generate("arkts/loader.ets", context, "arkts/loader/ServiceLoader.ets");
}

function gen_dart(jsonService) {
    console.log('Generating dart for' + jsonService.name);
    var base = "dart/" + jsonService.name + "/";
    generate("dart/service.dart", jsonService, base + "service/" + jsonService.service_dart_file_name + ".dart");
    generate("dart/service_register.dart", jsonService, base + "service/" + jsonService.service_dart_file_name + "_" + "register" + ".dart");
    for (var i = 0; i < jsonService.native_msg.length; i++) {
        var msg = jsonService.native_msg[i];
        generate("dart/handler.dart", msg, base + "handlers/" + jsonService.service_dart_file_name + "_" + msg.msg_dart_file_name + ".dart");
    }
}

function gen_java(jsonService) {
    console.log('Generating java for' + jsonService.name);
    var base = "java/" + jsonService.name + "/";
    generate("java/service.java", jsonService, base + "service/" + jsonService.name + ".java");
    generate("java/service_register.java", jsonService, base + "service/" + jsonService.name + "Register" + ".java");
    for (var i = 0; i < jsonService.flutter_msg.length; i++) {
        var msg = jsonService.flutter_msg[i];
        generate("java/handler.java", msg, base + "handlers/" + jsonService.name + "_" + msg.name + ".java");
    }
}

function gen_oc(jsonService) {
    console.log('Generating objective c for' + jsonService.name);
    var base = "oc/" + jsonService.name + "/";
    generate("oc/service.h", jsonService, base + "service/Service" + "_" + jsonService.name + ".h");
    generate("oc/service.mm", jsonService, base + "service/Service" + "_" + jsonService.name + ".mm");
    for (var i = 0; i < jsonService.flutter_msg.length; i++) {
        var msg = jsonService.flutter_msg[i];
        generate("oc/handler.h", msg, base + "handlers/" + jsonService.name + "_" + msg.name + ".h");
        generate("oc/handler.mm", msg, base + "handlers/" + jsonService.name + "_" + msg.name + ".mm");
    }
}

function gen_arkts(jsonService) {
    console.log('Generating arkts for ' + jsonService.name);
    var base = "arkts/" + jsonService.name + "/";

    generate("arkts/service.ets", jsonService, base + "service/" + jsonService.name + ".ets");

    generate("arkts/service_register.ets", jsonService, base + "service/" + jsonService.name + "Register.ets");

    for (var i = 0; i < jsonService.flutter_msg.length; i++) {
        var msg = jsonService.flutter_msg[i];
        generate("arkts/handler.ets", msg, base + "handlers/" + jsonService.name + "_" + msg.name + ".ets");
    }
}

function writeFile(path, contents, cb) {
    var mkdirp = require('mkdirp');
    var fs = require('fs');
    var getDirName = require('path').dirname;
    mkdirp(getDirName(path), function (err) {
        if (err) return cb(err);
        fs.writeFile(path, contents, cb);
    });
}

function getAssetData(path) {
    const fs = require('fs');
    var realPath = __dirname + "/" + path;
    return fs.readFileSync(realPath, 'utf8');
}

function generate(template, context, path) {
    const fs = require('fs');
    let templatePath = "templates/" + template;
    //    let templateString = fs.readFileSync(templatePath,'utf8');  
    let templateString = getAssetData(templatePath);
    var rendered = Mustache.render(templateString, context);
    rendered = rendered.replace(/&quot;/g, '"');
    var realPath = Path.join(program.output, path);
    writeFile(realPath, rendered, function () { });
}

//Transform the file names into dart style.
function dart_file_name(name) {
    let tmp = "";
    var r = 0;
    let cps = new Array();

    var A = name;

    while (r < A.length) {
        if (A.charAt(r) >= 'A' && A.charAt(r) <= 'Z') {
            if (tmp.length > 0) {
                cps.push(tmp);
            }
            tmp = "";
            tmp += A.charAt(r++);
        } else tmp += A.charAt(r++);
    }
    if (tmp.length > 0) {
        cps.push(tmp);
    }

    var ans = "";
    for (var i = 0; i < cps.length; i++) {
        var low = cps[i].toLowerCase();
        if (ans == "") {
            ans = low;
        } else {
            ans += "_";
            ans += low;
        }
    }

    return ans;
}


function dart_to_oc_object_type(type) {
    let mapper = {
        "int": "NSNumber *",
        "double": "NSNumber *",
        "bool": "NSNumber *",
        "String": "NSString *",
    };

    var mapped_type = mapper[type];
    if (mapped_type) {
        return mapped_type;
    }

    if (type.includes("List")) {
        return "NSArray *";
    }

    if (type.includes("Map")) {
        return "NSDictionary *";
    }

    return mapped_type;
}

function dart_to_oc_type(type) {
    var mapper = {
        "int": "int64_t",
        "double": "double",
        "bool": "BOOL",
        "String": "NSString *",
    };

    var mappedType = mapper[type];

    if (mappedType) {
        return mappedType;
    }

    if (type.includes("List")) {
        return "NSArray *";
    }

    if (type.includes("Map")) {
        return "NSDictionary *";
    }

    return mappedType;
}

function dart_to_java_type(type) {

    let typeMap = {
        "int": "Integer",
        "double": "Double",
        "bool": "Boolean",
        "String": "String",
    };

    var mapped_type = typeMap[type];
    if (mapped_type) {
        return mapped_type;
    }

    if (type.includes("List")) {
        return "List";
    }

    if (type.includes("Map")) {
        return "Map";
    }

    return mapped_type;
}

function dart_to_arkts_type(type) {
    const typeMap = {
        'int': 'number',
        'double': 'number',
        'bool': 'boolean',
        'String': 'string',
    };
    let mapped = typeMap[type];
    if (mapped) return mapped;
    if (type.includes('List')) {
        return 'Array<Object>';
    }
    if (type.includes('Map')) {
        return 'Object';
    }
    return mapped;
}
