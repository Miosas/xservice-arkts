# xservice-arkts

A tool to generate xservice_kit based flutter plugin with support for ArkTS/OHOS.

## Features

- Generate Flutter plugin code for multiple platforms:
  - Android (Java)
  - iOS (Objective-C)
  - Dart
  - ArkTS/OHOS (HarmonyOS)

## Installation

```bash
npm install -g xservice-arkts
```

## Usage

```bash
xservice-arkts <directory> [options]
```

### Options

- `-o, --output <output>`: A directory to save the output
- `-t, --type <type>`: Input file type support json and yaml default is json
- `-p, --package <package>`: Java package
- `-a, --arkts`: Generate ArkTS code for OHOS

### Example

```bash
xservice-arkts ./services -o ./gen -p com.xservice_kit.demo -t yaml --arkts
```

## Input File Format

The tool supports both JSON and YAML formats for service definitions.

### Example YAML File

```yaml
name: TestService
messages:
  - name: getTestData
    messageType: flutter
    returnType: String
    args:
      - name: userId
        type: String
  - name: updateTestData
    messageType: native
    returnType: bool
    args:
      - name: data
        type: Map
```

## Output

The tool generates the following directory structure:

```
output/
  ├── java/           # Android code
  ├── oc/             # iOS code
  ├── dart/           # Flutter code
  └── arkts/          # ArkTS/OHOS code (if --arkts is specified)
```

## License

ISC
