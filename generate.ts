import { writeFileSync, existsSync, mkdirSync, copyFileSync } from "fs";
import * as ts from "typescript";

// Path when building with `yarn build` command.
import dotnet from './Lib9c.Wasm/bin/dotnet';

const file = ts.createSourceFile("source.ts", "", ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS);
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
const importDecl = ts.factory.createImportDeclaration(undefined, ts.factory.createImportClause(false, ts.factory.createIdentifier("dotnet"), undefined), ts.factory.createStringLiteral("./dotnet"));
const exportModifiers = [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)];

async function main() {
    await dotnet.boot();

    if (!existsSync("./generated")) {
        mkdirSync("./generated");
    }

    generateIndexTsFile();
    generateActionsTsFile();
    generateTxTsFile();
    generateStatesTsFile();

    copyLib9cWasmFiles();
    copyUtilsTs();
}

function generateIndexTsFile() {
    const bootFunctionImpl = ts.factory.createFunctionDeclaration(exportModifiers, undefined, "boot", undefined, [], ts.factory.createTypeReferenceNode("Promise<void>"), ts.factory.createBlock([
        ts.factory.createReturnStatement(ts.factory.createCallExpression(ts.factory.createIdentifier("dotnet.boot"), undefined, undefined))
    ], true));

    const nodeArray = ts.factory.createNodeArray([importDecl, bootFunctionImpl]);
    const result = printer.printList(ts.ListFormat.MultiLine, nodeArray, file);

    writeFileSync("./generated/index.ts", result);
}

function generateActionsTsFile() {
    function generateBuildActionFunctionParameters(typeId: string): readonly ts.ParameterDeclaration[] {
        const plainValueType = ts.factory.createTypeReferenceNode(dotnet.Lib9c.Wasm.getAvailableInputs(typeId));
        return [
            ts.factory.createParameterDeclaration(undefined, undefined, "plainValue", undefined, plainValueType),
        ];
    }

    const typesImportDecl = ts.factory.createImportDeclaration(undefined, ts.factory.createImportClause(false, undefined, ts.factory.createNamedImports([
        ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier("Address")),
        ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier("Guid")),
        ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier("Currency")),
        ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier("serializeObjectAsDotnet")),
    ])), ts.factory.createStringLiteral("./utils"));

    const returnType = ts.factory.createTypeReferenceNode("Uint8Array");
    const buildActionWrapperImplDecl = ts.factory.createFunctionDeclaration(undefined, undefined, "buildActionWrapper", undefined, [
        ts.factory.createParameterDeclaration(undefined, undefined, "typeId", undefined, ts.factory.createTypeReferenceNode("string")),
        ts.factory.createParameterDeclaration(undefined, undefined, "plainValue", undefined, ts.factory.createTypeReferenceNode("object")),
    ], returnType, ts.factory.createBlock([
        ts.factory.createReturnStatement(
            ts.factory.createCallExpression(
                ts.factory.createIdentifier("dotnet.Lib9c.Wasm.buildAction"),
                undefined,
                [
                    ts.factory.createIdentifier("typeId"),
                    ts.factory.createAsExpression(
                        ts.factory.createCallExpression(ts.factory.createIdentifier("serializeObjectAsDotnet"), [], [ts.factory.createIdentifier("plainValue")]),
                        ts.factory.createTypeReferenceNode("any"))
                ]
            )
        )
    ], true));

    const actionsFunctionDecls = dotnet.Lib9c.Wasm.getAllActionTypes().map(typeId => {
        return ts.factory.createFunctionDeclaration(exportModifiers, undefined, typeId, undefined, generateBuildActionFunctionParameters(typeId), returnType, ts.factory.createBlock([
            ts.factory.createReturnStatement(
                ts.factory.createCallExpression(
                    ts.factory.createIdentifier("buildActionWrapper"),
                    undefined,
                    [
                        ts.factory.createStringLiteral(typeId),
                        ts.factory.createAsExpression(ts.factory.createIdentifier("plainValue"), ts.factory.createTypeReferenceNode("any"))
                    ]
                )
            )
        ], true));
    });

    const nodeArray = ts.factory.createNodeArray([importDecl, typesImportDecl, buildActionWrapperImplDecl, ...actionsFunctionDecls]);
    const result = printer.printList(ts.ListFormat.MultiLine, nodeArray, file);

    writeFileSync("./generated/actions.ts", result);
}

function generateTxTsFile() {
    const buildUnsignedTransactionFunctionImpl = ts.factory.createFunctionDeclaration(exportModifiers, undefined, "buildUnsignedTransaction", undefined, [
        ts.factory.createParameterDeclaration(undefined, undefined, "nonce", undefined, ts.factory.createTypeReferenceNode("number")),
        ts.factory.createParameterDeclaration(undefined, undefined, "publicKey", undefined, ts.factory.createTypeReferenceNode("Uint8Array")),
        ts.factory.createParameterDeclaration(undefined, undefined, "signer", undefined, ts.factory.createTypeReferenceNode("Uint8Array")),
        ts.factory.createParameterDeclaration(undefined, undefined, "genesisHash", undefined, ts.factory.createTypeReferenceNode("Uint8Array")),
        ts.factory.createParameterDeclaration(undefined, undefined, "action", undefined, ts.factory.createTypeReferenceNode("Uint8Array")),
    ], ts.factory.createTypeReferenceNode("Uint8Array"), ts.factory.createBlock([
        ts.factory.createReturnStatement(ts.factory.createCallExpression(ts.factory.createIdentifier("dotnet.Lib9c.Wasm.buildRawTransaction"), undefined, [
            ts.factory.createIdentifier("nonce"),
            ts.factory.createIdentifier("publicKey"),
            ts.factory.createIdentifier("signer"),
            ts.factory.createIdentifier("genesisHash"),
            ts.factory.createIdentifier("action"),
        ]))
    ], true));

    const attachSignatureFunctionImpl = ts.factory.createFunctionDeclaration(exportModifiers, undefined, "attachSignature", undefined, [
        ts.factory.createParameterDeclaration(undefined, undefined, "unsignedTx", undefined, ts.factory.createTypeReferenceNode("Uint8Array")),
        ts.factory.createParameterDeclaration(undefined, undefined, "signature", undefined, ts.factory.createTypeReferenceNode("Uint8Array")),
    ], ts.factory.createTypeReferenceNode("Uint8Array"), ts.factory.createBlock([
        ts.factory.createReturnStatement(ts.factory.createCallExpression(ts.factory.createIdentifier("dotnet.Lib9c.Wasm.attachSignature"), undefined, [
            ts.factory.createIdentifier("unsignedTx"),
            ts.factory.createIdentifier("signature"),
        ]))
    ], true));

    const nodeArray = ts.factory.createNodeArray([importDecl, buildUnsignedTransactionFunctionImpl, attachSignatureFunctionImpl]);
    const result = printer.printList(ts.ListFormat.MultiLine, nodeArray, file);

    writeFileSync("./generated/tx.ts", result);
}

function generateStatesTsFile() {
    const typesImportDecl = ts.factory.createImportDeclaration(undefined, ts.factory.createImportClause(false, undefined, ts.factory.createNamedImports([
        ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier("Address")),
        ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier("Guid")),
        ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier("Currency")),
    ])), ts.factory.createStringLiteral("./utils"));

    const allStateTypes = dotnet.Lib9c.Wasm.listAllStates();
    const aliasDecls: ts.TypeAliasDeclaration[] = [];
    const deseiralizeFunctionDecls: ts.FunctionDeclaration[] = [];
    for (const stateType of allStateTypes) {
        const className = stateType.replace(/^Nekoyume.Model./, "").replace(/^State./, "").replace("+", "").split(".").map(value => value[0].toUpperCase() + value.substring(1)).join("");
        const aliasDecl = ts.factory.createTypeAliasDeclaration(exportModifiers, className, undefined, ts.factory.createTypeReferenceNode(dotnet.Lib9c.Wasm.getStateJSType(stateType)));
        aliasDecls.push(aliasDecl);

        const uint8ArrayType = ts.factory.createTypeReferenceNode("Uint8Array");
        const deserializeStateDecl = ts.factory.createFunctionDeclaration(exportModifiers, undefined, "deserialize" + className, undefined, [
            ts.factory.createParameterDeclaration(undefined, undefined, "bytes", undefined, uint8ArrayType),
        ], ts.factory.createTypeReferenceNode(className), ts.factory.createBlock([
            ts.factory.createReturnStatement(
                ts.factory.createCallExpression(
                    ts.factory.createIdentifier("dotnet.Lib9c.Wasm.deserializeState"),
                    undefined,
                    [
                        ts.factory.createStringLiteral(stateType),
                        ts.factory.createIdentifier("bytes"),
                    ]
                )
            )
        ], true));
        deseiralizeFunctionDecls.push(deserializeStateDecl);
    }

    const nodeArray = ts.factory.createNodeArray([typesImportDecl, importDecl, ...aliasDecls, ...deseiralizeFunctionDecls]);
    const result = printer.printList(ts.ListFormat.MultiLine, nodeArray, file);

    writeFileSync("./generated/states.ts", result);
}

function copyLib9cWasmFiles() {
    copyFileSync("./Lib9c.Wasm/bin/dotnet.js", "generated/dotnet.js");
    copyFileSync("./Lib9c.Wasm/bin/dotnet.js.map", "generated/dotnet.js.map");
    copyFileSync("./Lib9c.Wasm/bin/dotnet.d.ts", "generated/dotnet.d.ts");
}

function copyUtilsTs() {
    copyFileSync("./utils.ts", "generated/utils.ts");
}


main().catch(console.error);
