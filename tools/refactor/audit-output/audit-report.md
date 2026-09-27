# Refactor audit

Generated 2026-09-27 20:06 UTC.

## Headline

**Code quality score 89.8%.** **0 of 274 source files are over the 100-line limit (0.0%)**; the worst file is 0 lines.

## Code quality score

| Element | Reading | Score | Weight | 0% at |
| --- | --- | --- | --- | --- |
| **Standard baseline checks** | | **93.4%** | **52** | |
| Files over the line limit | 0 in 274 files | 100.0% | 10 | 50% of files |
| Worst file, in limits over | 0 | 100.0% | 5 | 9 |
| Functions over the line limit | 0 in 305 functions | 100.0% | 8 | 25% of functions |
| Else blocks | 1 in 404 branches | 99.5% | 5 | 50% of branches |
| Duplication % | not measured | not measured | — | 20 |
| Explanatory comment lines | 25 in 8.62 thousand lines | 94.2% | 4 | 50 per thousand lines |
| Inline magic values | 24 in 8.62 thousand lines | 86.1% | 4 | 20 per thousand lines |
| Orphan components and functions | 0 in 361 components and functions | 100.0% | 4 | 10% of components and functions |
| Long member chain lines | 148 in 8.62 thousand lines | 42.8% | 4 | 30 per thousand lines |
| Deeply indented lines | 21 in 8.62 thousand lines | 91.9% | 4 | 30 per thousand lines |
| Overlong function names | 0 in 305 functions | 100.0% | 4 | 10% of functions |
| **Design pattern file count** | | **100.0%** | **10** | |
| Files the patterns predict but are missing | 0 in 31 predicted files | 100.0% | 10 | 50% of predicted files |
| Entities outside their expected file count | not measured | not measured | — | 50% of entities |
| **Prose** | | **82.1%** | **20** | |
| Conditions with calls tangled inside calls | 19 in 404 branches | 81.2% | 8 | 25% of branches |
| Conditions compared to a raw literal | 25 in 404 branches | 75.2% | 6 | 25% of branches |
| Accessor names that want to be a property | 3 in 305 functions | 90.2% | 6 | 10% of functions |
| **Widget adoption** | | **not measured** | **0** | |
| Markup written by hand where a widget should be | not measured | not measured | — | 50% of widget slots |
| **Input validation** | | **72.4%** | **8** | |
| Doors that write without checking their input against the columns | 4 in 29 write doors | 72.4% | 8 | 50% of write doors |

Each element scores 100% with no offenders and falls in a straight line to 0% when its offenders, measured against the size of the codebase, reach the figure in the last column. The score is the weighted average of the elements that could be measured; an element that could not be measured lends its weight to the rest. Weights and zero points are set in `tools/refactor/rules.json` under `score.elements`. The offenders behind every reading are in `tools/refactor/audit-output/audit.json`.

## The repository by area

| Area | Files | Of which audited source | Source lines |
| --- | --- | --- | --- |
| tooling | 80 | 0 | 0 |
| docs | 13 | 0 | 0 |
| infrastructure | 2 | 0 | 0 |
| **whole repository** | **95** | **0** | **0** |

## Summary

| Check | Key figures |
| --- | --- |
| fileLength | limit: 100, filesOverLimit: 0, totalFiles: 274, totalLines: 8618, worstFileLines: 0, worstFileTimesOverLimit: 0.0 |
| functionShape | limit: 30, functionsOverLimit: 0, totalFunctions: 305, elseBlocks: 1, ifBlocks: 404, measurementIsHeuristic: True |
| functionNames | overlongFunctionNames: 0, maxWords: 5, maxLength: 40 |
| accessorNames | gluedAccessorNames: 3, measurementIsHeuristic: True |
| duplication | skipped: jscpd is not installed (npm install -g jscpd), carriedFromBaseline: True |
| naming | bannedAbbreviationHits: 0, unprefixedBooleans: 1 |
| comments | explanatoryCommentLines: 25, filesWithComments: 9, taskMarkers: 0 |
| magicValues | inlineHexColours: 4, inlineStyleAttributes: 1, repeatedStringLiterals: 19 |
| prose | longMemberChainLines: 148, deeplyIndentedLines: 21, overlongLines: 60, measurementIsHeuristic: True |
| conditions | tangledConditionLines: 19, literalComparisonLines: 25, measurementIsHeuristic: True |
| orphans | orphanFunctions: 0, functionsExamined: 305 |
| designPatterns | roleFamilies: 14, predictedFiles: 31, predictedFilesMissing: 0, entities: 0, entitiesOutOfRange: 0, measurementIsHeuristic: True |
| inventory | pages: 17, components: 56, orphanComponents: 0, averagePageLines: 33 |
| siteDefinition | skipped: no siteDefinition catalogue in rules.json |
| inputValidation | schemaTables: 14, limitedColumns: 0, writeDoors: 29, unvalidatedDoors: 4, looserLimits: 0 |
| fileAreas | totalFiles: 95, tooling: 80, docs: 13, infrastructure: 2 |

## Against the baseline

| Ratcheted figure | Baseline | Now | Verdict |
| --- | --- | --- | --- |
| code quality score | 100.0% | 89.8% | — |
| fileLength.filesOverLimit | 0 | 0 | held |
| fileLength.worstFileLines | 0 | 0 | held |
| functionShape.functionsOverLimit | 0 | 0 | held |
| functionShape.elseBlocks | 0 | 1 | worse |
| duplication.duplicatedPercentage | None | None | — |
| comments.explanatoryCommentLines | 0 | 25 | worse |
| magicValues.inlineHexColours | 0 | 4 | worse |
| inventory.orphanComponents | 0 | 0 | held |
| orphans.orphanFunctions | 0 | 0 | held |
| prose.longMemberChainLines | 0 | 148 | worse |
| prose.deeplyIndentedLines | 0 | 21 | worse |
| functionNames.overlongFunctionNames | 0 | 0 | held |
| accessorNames.gluedAccessorNames | 0 | 3 | worse |
| conditions.tangledConditionLines | 0 | 19 | worse |
| conditions.literalComparisonLines | 0 | 25 | worse |
| designPatterns.predictedFilesMissing | 0 | 0 | held |
| siteDefinition.handRolledElements | None | None | — |
| inputValidation.unvalidatedDoors | 0 | 4 | worse |
| inputValidation.looserLimits | 0 | 0 | held |

## Worst files by length

All files are within the limit.

Full detail, including every offender list, is in `audit.json`.
