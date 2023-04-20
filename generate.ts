import { writeFileSync, existsSync, mkdirSync, copyFileSync } from "fs";
import ts from "typescript";
import { dotnet } from "@microsoft/dotnet-runtime";

const file = ts.createSourceFile(
  "source.ts",
  "",
  ts.ScriptTarget.ESNext,
  false,
  ts.ScriptKind.TS
);
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
const importDecl = ts.factory.createImportDeclaration(
  undefined,
  ts.factory.createImportClause(
    false,
    ts.factory.createIdentifier("dotnet"),
    undefined
  ),
  ts.factory.createStringLiteral("./dotnet")
);
const exportModifiers = [
  ts.factory.createModifier(ts.SyntaxKind.ExportKeyword),
];
const { setModuleImports, getAssemblyExports, getConfig } =
  await dotnet.create();
const config = getConfig();
const Lib9c = await getAssemblyExports(config.mainAssemblyName!);

async function main() {
  if (!existsSync("./generated")) {
    mkdirSync("./generated");
  }

  generateIndexTsFile();
  generateActionsTsFile();
  //generateTxTsFile();
  //generateStatesTsFile();

  copyUtilsTs();
}

function generateIndexTsFile() {
  const bootFunctionImpl = ts.factory.createFunctionDeclaration(
    exportModifiers,
    undefined,
    "create",
    undefined,
    [],
    ts.factory.createTypeReferenceNode("Promise<void>"),
    ts.factory.createBlock(
      [
        ts.factory.createReturnStatement(
          ts.factory.createCallExpression(
            ts.factory.createIdentifier("dotnet.create"),
            undefined,
            undefined
          )
        ),
      ],
      true
    )
  );

  const nodeArray = ts.factory.createNodeArray([importDecl, bootFunctionImpl]);
  const result = printer.printList(ts.ListFormat.MultiLine, nodeArray, file);

  writeFileSync("./generated/index.ts", result);
}

function generateActionsTsFile() {
  function generateBuildActionFunctionParameters(
    typeId: string
  ): readonly ts.ParameterDeclaration[] {
    const plainValueType = ts.factory.createTypeReferenceNode(
      Lib9c.Lib9c.Wasm.Program.GetAvailableInputs(typeId)
    );
    return [
      ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        "plainValue",
        undefined,
        plainValueType
      ),
    ];
  }

  const typesImportDecl = ts.factory.createImportDeclaration(
    undefined,
    ts.factory.createImportClause(
      false,
      undefined,
      ts.factory.createNamedImports([
        ts.factory.createImportSpecifier(
          false,
          undefined,
          ts.factory.createIdentifier("Address")
        ),
        ts.factory.createImportSpecifier(
          false,
          undefined,
          ts.factory.createIdentifier("Guid")
        ),
        ts.factory.createImportSpecifier(
          false,
          undefined,
          ts.factory.createIdentifier("Currency")
        ),
        ts.factory.createImportSpecifier(
          false,
          undefined,
          ts.factory.createIdentifier("serializeObjectAsDotnet")
        ),
      ])
    ),
    ts.factory.createStringLiteral("./utils")
  );

  const returnType = ts.factory.createTypeReferenceNode("Uint8Array");
  const buildActionWrapperImplDecl = ts.factory.createFunctionDeclaration(
    undefined,
    undefined,
    "buildActionWrapper",
    undefined,
    [
      ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        "typeId",
        undefined,
        ts.factory.createTypeReferenceNode("string")
      ),
      ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        "plainValue",
        undefined,
        ts.factory.createTypeReferenceNode("object")
      ),
    ],
    returnType,
    ts.factory.createBlock(
      [
        ts.factory.createReturnStatement(
          ts.factory.createCallExpression(
            ts.factory.createIdentifier("Lib9c.Lib9c.Wasm.Program.BuildAction"),
            undefined,
            [
              ts.factory.createIdentifier("typeId"),
              ts.factory.createAsExpression(
                ts.factory.createCallExpression(
                  ts.factory.createIdentifier("serializeObjectAsDotnet"),
                  [],
                  [ts.factory.createIdentifier("plainValue")]
                ),
                ts.factory.createTypeReferenceNode("any")
              ),
            ]
          )
        ),
      ],
      true
    )
  );

  const actionsFunctionDecls = Lib9c.Lib9c.Wasm.Program.GetAllActionTypes().map(
    (typeId: string) => {
      return ts.factory.createFunctionDeclaration(
        exportModifiers,
        undefined,
        typeId,
        undefined,
        generateBuildActionFunctionParameters(typeId),
        returnType,
        ts.factory.createBlock(
          [
            ts.factory.createReturnStatement(
              ts.factory.createCallExpression(
                ts.factory.createIdentifier("buildActionWrapper"),
                undefined,
                [
                  ts.factory.createStringLiteral(typeId),
                  ts.factory.createAsExpression(
                    ts.factory.createIdentifier("plainValue"),
                    ts.factory.createTypeReferenceNode("any")
                  ),
                ]
              )
            ),
          ],
          true
        )
      );
    }
  );

  const nodeArray = ts.factory.createNodeArray([
    importDecl,
    typesImportDecl,
    buildActionWrapperImplDecl,
    ...actionsFunctionDecls,
  ]);
  const result = printer.printList(ts.ListFormat.MultiLine, nodeArray, file);

  writeFileSync("./generated/actions.ts", result);
}

function generateTxTsFile() {
  const buildUnsignedTransactionFunctionImpl =
    ts.factory.createFunctionDeclaration(
      exportModifiers,
      undefined,
      "buildUnsignedTransaction",
      undefined,
      [
        ts.factory.createParameterDeclaration(
          undefined,
          undefined,
          "nonce",
          undefined,
          ts.factory.createTypeReferenceNode("number")
        ),
        ts.factory.createParameterDeclaration(
          undefined,
          undefined,
          "publicKey",
          undefined,
          ts.factory.createTypeReferenceNode("Uint8Array")
        ),
        ts.factory.createParameterDeclaration(
          undefined,
          undefined,
          "signer",
          undefined,
          ts.factory.createTypeReferenceNode("Uint8Array")
        ),
        ts.factory.createParameterDeclaration(
          undefined,
          undefined,
          "genesisHash",
          undefined,
          ts.factory.createTypeReferenceNode("Uint8Array")
        ),
        ts.factory.createParameterDeclaration(
          undefined,
          undefined,
          "action",
          undefined,
          ts.factory.createTypeReferenceNode("Uint8Array")
        ),
      ],
      ts.factory.createTypeReferenceNode("Uint8Array"),
      ts.factory.createBlock(
        [
          ts.factory.createReturnStatement(
            ts.factory.createCallExpression(
              ts.factory.createIdentifier(
                "Lib9c.Lib9c.Wasm.Program.BuildRawTransaction"
              ),
              undefined,
              [
                ts.factory.createIdentifier("nonce"),
                ts.factory.createIdentifier("publicKey"),
                ts.factory.createIdentifier("signer"),
                ts.factory.createIdentifier("genesisHash"),
                ts.factory.createIdentifier("action"),
              ]
            )
          ),
        ],
        true
      )
    );

  const attachSignatureFunctionImpl = ts.factory.createFunctionDeclaration(
    exportModifiers,
    undefined,
    "attachSignature",
    undefined,
    [
      ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        "unsignedTx",
        undefined,
        ts.factory.createTypeReferenceNode("Uint8Array")
      ),
      ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        "signature",
        undefined,
        ts.factory.createTypeReferenceNode("Uint8Array")
      ),
    ],
    ts.factory.createTypeReferenceNode("Uint8Array"),
    ts.factory.createBlock(
      [
        ts.factory.createReturnStatement(
          ts.factory.createCallExpression(
            ts.factory.createIdentifier(
              "Lib9c.Lib9c.Wasm.Program.AttachSignature"
            ),
            undefined,
            [
              ts.factory.createIdentifier("unsignedTx"),
              ts.factory.createIdentifier("signature"),
            ]
          )
        ),
      ],
      true
    )
  );

  const nodeArray = ts.factory.createNodeArray([
    importDecl,
    buildUnsignedTransactionFunctionImpl,
    attachSignatureFunctionImpl,
  ]);
  const result = printer.printList(ts.ListFormat.MultiLine, nodeArray, file);

  writeFileSync("./generated/tx.ts", result);
}

function generateStatesTsFile() {
  const typesImportDecl = ts.factory.createImportDeclaration(
    undefined,
    ts.factory.createImportClause(
      false,
      undefined,
      ts.factory.createNamedImports([
        ts.factory.createImportSpecifier(
          false,
          undefined,
          ts.factory.createIdentifier("Address")
        ),
        ts.factory.createImportSpecifier(
          false,
          undefined,
          ts.factory.createIdentifier("Guid")
        ),
        ts.factory.createImportSpecifier(
          false,
          undefined,
          ts.factory.createIdentifier("Currency")
        ),
      ])
    ),
    ts.factory.createStringLiteral("./utils")
  );

  const allStateTypes = Lib9c.Lib9c.Wasm.Program.listAllStates();
  const aliasDecls: ts.TypeAliasDeclaration[] = [];
  const deserializeFunctionDecls: ts.FunctionDeclaration[] = [];
  for (const stateType of allStateTypes) {
    const className = stateType
      .replace(/^Nekoyume.Model./, "")
      .replace(/^State./, "")
      .replace("+", "")
      .split(".")
      .map((value: string) => value[0].toUpperCase() + value.substring(1))
      .join("");
    const aliasDecl = ts.factory.createTypeAliasDeclaration(
      exportModifiers,
      className,
      undefined,
      ts.factory.createTypeReferenceNode(
        Lib9c.Lib9c.Wasm.Program.GetStateJSType(stateType)
      )
    );
    aliasDecls.push(aliasDecl);

    const uint8ArrayType = ts.factory.createTypeReferenceNode("Uint8Array");
    const deserializeStateDecl = ts.factory.createFunctionDeclaration(
      exportModifiers,
      undefined,
      "deserialize" + className,
      undefined,
      [
        ts.factory.createParameterDeclaration(
          undefined,
          undefined,
          "bytes",
          undefined,
          uint8ArrayType
        ),
      ],
      ts.factory.createTypeReferenceNode(className),
      ts.factory.createBlock(
        [
          ts.factory.createReturnStatement(
            ts.factory.createCallExpression(
              ts.factory.createIdentifier(
                "Lib9c.Lib9c.Wasm.Program.DeserializeState"
              ),
              undefined,
              [
                ts.factory.createStringLiteral(stateType),
                ts.factory.createIdentifier("bytes"),
              ]
            )
          ),
        ],
        true
      )
    );
    deserializeFunctionDecls.push(deserializeStateDecl);
  }

  const nodeArray = ts.factory.createNodeArray([
    typesImportDecl,
    importDecl,
    ...aliasDecls,
    ...deserializeFunctionDecls,
  ]);
  const result = printer.printList(ts.ListFormat.MultiLine, nodeArray, file);

  writeFileSync("./generated/states.ts", result);
}

function copyLib9cWasmFiles() {

  // TODO : Actually copying whole build lib9c-wasm
  // Binary wrapping method is different after DotNetJs
  copyFileSync("./Lib9c.Wasm/bin/dotnet.js", "generated/dotnet.js");
  copyFileSync("./Lib9c.Wasm/bin/dotnet.js.map", "generated/dotnet.js.map");
  copyFileSync("./Lib9c.Wasm/bin/dotnet.d.ts", "generated/dotnet.d.ts");
}

function copyUtilsTs() {
  copyFileSync("./utils.ts", "generated/utils.ts");
}

main().catch(console.error);
