import { writeFileSync, existsSync, mkdirSync, copyFileSync } from "fs";
import * as ts from "typescript";

// Path when building with `yarn build` command.
import dotnet from './Lib9c.Wasm/bin/dotnet';

const file = ts.createSourceFile("source.ts", "", ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS);
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
const importDecl = ts.factory.createImportDeclaration(undefined, ts.factory.createImportClause(false, ts.factory.createIdentifier("dotnet"), undefined), ts.factory.createStringLiteral("./wasm/dotnet"));
const exportModifiers = [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)];

async function main() {
    await dotnet.boot();

    if (!existsSync("./generated")) {
        mkdirSync("./generated");
    }

    generateIndexTsFile();
    generateActionsTsFile();
    generateTxTsFile();

    copyLib9cWasmFiles();
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
        const plainValueType = ts.factory.createTypeReferenceNode(dotnet.Lib9c.Wasm.GetAvailableInputs(typeId));
        return [
            ts.factory.createParameterDeclaration(undefined, undefined, "plainValue", undefined, plainValueType),
        ];
    }

    const returnType = ts.factory.createTypeReferenceNode("Uint8Array");
    const actionsFunctionDecls = dotnet.Lib9c.Wasm.GetAllActionTypes().map(typeId => {
        return ts.factory.createFunctionDeclaration(exportModifiers, undefined, typeId, undefined, generateBuildActionFunctionParameters(typeId), returnType, ts.factory.createBlock([
            ts.factory.createReturnStatement(
                ts.factory.createCallExpression(
                    ts.factory.createIdentifier("dotnet.Lib9c.Wasm.BuildAction"),
                    undefined,
                    [
                        ts.factory.createStringLiteral(typeId),
                        ts.factory.createAsExpression(ts.factory.createIdentifier("plainValue"), ts.factory.createTypeReferenceNode("any"))
                    ]
                )
            )
        ], true));
    });

    const nodeArray = ts.factory.createNodeArray([importDecl, ...actionsFunctionDecls]);
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
        ts.factory.createReturnStatement(ts.factory.createCallExpression(ts.factory.createIdentifier("dotnet.Lib9c.Wasm.BuildRawTransaction"), undefined, [
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
        ts.factory.createReturnStatement(ts.factory.createCallExpression(ts.factory.createIdentifier("dotnet.Lib9c.Wasm.AttachSignature"), undefined, [
            ts.factory.createIdentifier("unsignedTx"),
            ts.factory.createIdentifier("signature"),
        ]))
    ], true));

    const nodeArray = ts.factory.createNodeArray([importDecl, buildUnsignedTransactionFunctionImpl, attachSignatureFunctionImpl]);
    const result = printer.printList(ts.ListFormat.MultiLine, nodeArray, file);

    writeFileSync("./generated/tx.ts", result);
}

function copyLib9cWasmFiles() {
    if (!existsSync("./generated/wasm")) {
        mkdirSync("./generated/wasm");
    }

    copyFileSync("./Lib9c.Wasm/bin/dotnet.js", "generated/wasm/dotnet.js");
    copyFileSync("./Lib9c.Wasm/bin/dotnet.js.map", "generated/wasm/dotnet.js.map");
    copyFileSync("./Lib9c.Wasm/bin/dotnet.d.ts", "generated/wasm/dotnet.d.ts");
}


main().catch(console.error);
