# Reading V8 bytecode without turning it into language semantics

Historical bytecode notes supplied during review contain useful captures of `LdaSmi`, `Star`,
`Ldar`, Context creation, and TDZ guards. Their durable lessons and necessary corrections are
recorded here.

## Durable observations

- Ignition is an accumulator-based register virtual machine.
- `LdaSmi [n]` loads a small-integer tagged value into the accumulator.
- `StarN` stores the accumulator in virtual register `rN`; `Ldar rN` loads it back.
- The virtual registers are slots in an Ignition frame. They must not be described as guaranteed
  hardware CPU registers.
- A local binding that does not escape can remain in frame registers in a particular capture.
- A binding captured by a closure can require `CreateFunctionContext` and
  `StaCurrentContextSlot`; the Context is a V8 heap object.
- `LdaTheHole` and `ThrowReferenceErrorIfHole` are one V8 strategy for preserving lexical
  initialization and TDZ semantics when a read might happen before initialization.

## Corrections to tempting conclusions

- Similar bytecode for a particular `var` and `let` example does not mean the declarations have the
  same ECMAScript semantics. It means their differences are not observable along that captured path.
- A block does not create a new execution context. ECMA-262 may create a new LexicalEnvironment for
  block declarations; V8 may optimize away a material Context when no observable behavior needs it.
- V8 does not “ignore the specification” when it removes such a structure. Implementations must
  preserve observable semantics, not allocate the specification's abstract records literally.
- A TDZ guard does not mean V8 failed to understand the source. It is generated code that enforces a
  case whose initialization state must be checked at runtime.
- Bytecode mnemonics and register allocation are versioned implementation details. Every published
  listing in this project is tied to its V8 version and binary hash.

## Relation to the value-type article

Value representation and binding location are independent axes. A Smi has no separate HeapNumber,
yet its tagged bits can sit in a heap Context slot when captured. A Symbol binding can use that same
kind of Context slot, but the slot contains a tagged pointer to a separately allocated Symbol object.
Neither arrangement changes the ECMAScript language type or the definition of primitive value.

## Sources

- [V8 — Faster JavaScript calls and Ignition frames](https://v8.dev/blog/adaptor-frame)
- [V8 — pointer compression and tagged values](https://v8.dev/blog/pointer-compression)
- [Pinned V8 Smi source](https://chromium.googlesource.com/v8/v8/+/241f63a62a3518ad4110e78e4f61815623c6e95d/src/objects/smi.h)
- `artifacts/v8/value-binding-storage.json`
- `artifacts/v8/const-let-var-tdz.json`
