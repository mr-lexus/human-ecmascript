# Vertical slice: Reference to `this`

The first topic follows `obj.method()` through `MemberExpression`, Reference Record, `GetValue`,
`[[Get]]`, `GetThisValue`, `EvaluateCall`, and `Call`. This slice was chosen because it joins syntax,
specification records, internal methods, evaluation order, calls, and observable behavior without
requiring the much broader machinery of closures, iterators, or jobs.

## Required reader outcomes

- Explain why a method does not permanently own a receiver.
- Distinguish the property Reference from the extracted function value.
- Predict `this` for method, detached, comma-expression, and getter-returned calls.
- Predict computed-key, proxy/getter, argument, and body order.
- Keep normative semantics separate from V8's representation.

## Published examples

`method-call`, `detached-call`, `comma-call`, `getter-call`, `computed-key`, `proxy-order`, and
`non-callable` each have a standalone source file, expected output, claim links, citations, and a
browser timeout. All seven V8 baselines are executed and checked against pinned Linux Node 24.18.1
and V8 13.6.233.17-node.50. SpiderMonkey and JavaScriptCore are deliberately shown as pending until
exact shells are installed and hashed; pending evidence never renders as verified.

## Acceptance

EN/RU semantic parity passes, no ready claim is uncertain, all citations use the stable ES2026
snapshot, the browser runner uses an opaque-origin iframe and disposable Worker, and a user can move
from the human model to normative trace, examples, graph, and provenance without losing the topic.
