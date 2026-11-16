# Rule evaluation — 2026-11-16

ScamShield is a local educational heuristic, not a validated fraud detector. Its score is neither a probability nor evidence that a sender is trustworthy.

## Reproduce

```bash
npm ci
npm run evaluate:rules
# Optional report destination:
npm run evaluate:rules -- /tmp/scamshield-evaluation.json
```

The command evaluates all 30 entries in `tests/evaluation-cases.json`, writes their labels, messages, scores and observed bands, and checks the 26 targeted regression cases. Four explicitly labeled limitations are included in the report and mismatch count; they are not claimed as passing acceptance cases. Standard unit CI also runs the 26 targeted cases.

This is a **hand-written synthetic development set**, designed around audit findings and used to develop the fix. It contains Polish/English warnings, direct credential requests, mixed warning/request messages, benign messages and other scam patterns. Labels describe the intended caution band for these examples; they were not independently annotated. It has no real-world sampling, held-out split, sender verification, obfuscation coverage or statistical confidence interval. Do not report its match count as detection accuracy.

## Before and after

Baseline: unchanged analyzer from main `60cd25a8a7712358291e21eb9adec60f1e583abf`, before the credential-context changes. The feature merge of PR12 changes toolchain/security files only. Same 30 messages and labels in both reports:

- [Raw baseline](evaluation-baseline-2026-11-16.json): 11/30 expected bands; 16 of 26 targeted regressions failed.
- [After the fix](evaluation-after-2026-11-16.json): 26/30 expected bands; all 26 targeted regressions pass; four mismatches remain.

| Intended band | Before: low / medium / high | After: low / medium / high |
| --- | --- | --- |
| Low (12 examples) | 6 / 4 / 2 | 10 / 1 / 1 |
| High (18 examples) | 10 / 3 / 5 | 2 / 0 / 16 |

`Bank nigdy nie poprosi o PIN ani kod BLIK.` changes from 78/high to 18/low for SMS (28/low with bank context). `Wyślij mi hasło.` changes from 26/low to 91/high. A direct request adds 65 points independently of the existing keyword signals. Those weights are an explicit caution policy, not learned/calibrated probabilities.

Credential signals are reduced only when the **entire message** consists of narrowly recognized safety instructions and punctuation. If any other text remains, the original message is used: it may introduce an exception or refer back to the secret (such as `send it to me`), even in a later sentence. Bank wording, URLs, threats and formatting always count. Additional regressions preserve baseline signals for pronoun-based requests and exceptions; this does not claim that all such requests reach the high band. A postal/discount code request is no longer treated as a BLIK request solely because it contains `podaj kod`.

## Remaining errors and tradeoffs

- **False negatives:** spaced-out `W y ś l i j m i h a s ł o.` and indirect `Potrzebuję twojego hasła, by naprawić dostęp.` still score low. Narrow imperative matching does not recognize arbitrary obfuscation or intent.
- **False positive introduced by stronger request detection:** the educational quote `Przykład oszustwa z lekcji: „Podaj PIN”.` now scores high. Quotation marks alone cannot safely suppress a request; attackers can quote their own instructions.
- **Existing false positive:** `Kurier dostarczy paczkę jutro.` scores medium in delivery context. The older delivery keyword/context rules remain conservative.
- A warning followed by benign explanatory prose may still score high: retaining signals whenever any unrecognized text remains trades false positives for avoiding an attacker-controlled safety bypass.
- Other negations, inflections, multi-clause instructions, languages and misleading URLs remain unvalidated. A common protective sentence cannot certify the surrounding message.

A next evaluation should use an independently labeled, consented/anonymized dataset with a frozen test split, error categories, and separate false-positive/false-negative analysis before making any effectiveness claim. Users should verify unexpected requests through an independently found official channel regardless of score.
