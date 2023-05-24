import { readFileSync, writeFileSync } from "fs";
import { exit } from "process";

if (process.argv.length < 2 + 1) {
    console.error(process.argv0, ...process.argv.slice(0, 2), "[dotnet.js PATH]")
    exit(-1);
}

const DOTNET_JS_FILE_PATH = process.argv[2];

let source = readFileSync(DOTNET_JS_FILE_PATH).toString("utf-8");

function insertVariableDefinition(
    source: string,
    methodName: string,
    variableName: string
): string {
    const matched = source.match(new RegExp(`${methodName}:function\\([^)]+\\){`))?.[0];
    if (matched == null) {
        console.error("It couldn't find the ", methodName);
        exit(-1);
    }

    source = source.replace(matched, matched + `var ${variableName};`);
    return source;
}

source = insertVariableDefinition(source, "bind_method", "bodyJs");
source = insertVariableDefinition(source, "_handle_exception_and_produce_result_for_call", "result");
source = source.replace("factory(module.exports, global)", "factory(module.exports, globalThis)");

writeFileSync(DOTNET_JS_FILE_PATH, source);
