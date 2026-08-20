# Value passing and V8 string sharing

## Question

A historical `d8 --allow-natives-syntax` experiment assigned the literal `"HELLO"` to one
binding, assigned that value to a second binding, and ran `%DebugPrint` for both. Both prints
reported the same address and `INTERNALIZED_ONE_BYTE_STRING_TYPE`.

## What the experiment establishes

For that V8 build and execution, both binding slots contained tagged references to the same
internalized String object. V8 maintains a String Table for internalized strings and may reuse an
existing internalized representation. The pinned project capture independently reports a String
literal as `INTERNALIZED_ONE_BYTE_STRING_TYPE`.

This is implementation evidence. It establishes neither an ECMAScript language type named
`reference` nor pass-by-reference binding semantics. ECMA-262 defines String values as immutable,
and ordinary JavaScript cannot observe the internal object address or whether equal String values
share storage.

## Three layers that must stay separate

1. **ECMA-262:** String is an ECMAScript language type. Its members are primitive values. Assignment
   obtains a language value and supplies it to the destination algorithm.
2. **Observable JavaScript:** rebinding the second name cannot rebind the first; indexed writes do
   not mutate a String value.
3. **Pinned V8:** slots contain tagged values. An internalized String is a heap object that may be
   shared; a Smi is encoded immediately and needs no separate HeapNumber.

The same-address printout is therefore evidence against the rule “primitive value means no heap”,
not evidence for “strings are passed by reference”.

## Sources

- [ECMA-262 §4.4.4 — type](https://tc39.es/ecma262/2026/multipage/overview.html#sec-terms-and-definitions-type)
- [ECMA-262 §4.4.5 — primitive value](https://tc39.es/ecma262/2026/multipage/overview.html#sec-terms-and-definitions-primitive-value)
- [ECMA-262 §6.1.4 — String](https://tc39.es/ecma262/2026/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-string-type)
- [Pinned V8 documentation — Strings in V8](https://chromium.googlesource.com/v8/v8/+/241f63a62a3518ad4110e78e4f61815623c6e95d/docs/objects/strings.md)
- `artifacts/v8/value-representations.json`
