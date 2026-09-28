# Why Hindsight Needed Provenance for Retrieved Facts

The first time an assistant gave me a correct answer for the wrong reason, I stopped treating retrieval as a plumbing detail. The hard problem was not getting a useful fact back from memory; it was making that fact explainable enough to trust.

I built this system to turn an ongoing stream of work—requests, tool results, decisions, corrections, and documents—into durable context for later conversations. A user can ask what happened in an earlier task, why a decision was made, or what changed after a failed attempt. The system should answer from its accumulated memory instead of pretending each new request begins at zero.

That sounds like a conventional retrieval problem until the answer matters. Then “the model found something relevant” is not an acceptable explanation. Engineers want to know which source produced a statement, when it was recorded, what it was associated with, and whether it was an observation or an inference. Those questions are why I made provenance a first-class part of the Hindsight integration rather than an afterthought in the UI.

## The system is a memory pipeline, not a chat transcript

The application has three distinct jobs. First, it captures information produced during work: user intent, execution outcomes, reference material, and explicit corrections. Second, it stores that information in [Hindsight’s agent memory system](https://github.com/vectorize-io/hindsight), where it can be retained and retrieved across interactions. Third, it assembles a response using only the subset of memory relevant to the current question.

Keeping those jobs separate turned out to be important. A chat transcript is ordered text. It is valuable evidence, but it is a poor query interface: old conversations contain abandoned plans, superseded assumptions, and tool output that was useful once but is not a fact forever. A durable memory system needs to preserve the relationship between a claim and the event that established it.

At ingestion time, I write an event with both content and context. The context is intentionally boring: a stable source identifier, event type, task or conversation scope, time, and any available reference to the originating artifact. Boring metadata is exactly what lets us investigate an answer later.

```ts
await hindsight.memories.add({
  content: toolResult.summary,
  metadata: {
    sourceId: toolResult.id,
    sourceType: "tool_result",
    scope: taskId,
    recordedAt: new Date().toISOString(),
    artifact: toolResult.artifactPath,
  },
});
```

The important choice here is that `sourceId` does not describe the memory record itself. It identifies the thing the memory came from. That distinction sounds pedantic until a retrieval result is compressed, re-ranked, or later consolidated. Memory identifiers describe storage; provenance identifies evidence.

Hindsight is useful here because it treats memory as something that can be formed and retrieved over time instead of forcing us to keep passing an ever-growing transcript back to the model. The [Hindsight documentation](https://hindsight.vectorize.io/) was especially useful for framing this as a memory lifecycle: retain events, retrieve the relevant ones, and use them as context for a specific task. But its value in our application depends on the quality of the material we put into that lifecycle.

## The failure mode: relevant retrieval without accountable retrieval

Before provenance was explicit, a question such as “Why did we reject the earlier approach?” could return a concise, plausible answer based on a mix of an old proposal and a later error. It often had the right shape. It might even contain the right words. But it could quietly join two unrelated incidents or report an abandoned hypothesis as the final decision.

That is a dangerous kind of failure because it reads well. Retrieval systems do not fail only by returning nothing. They also fail by returning a statement that looks grounded but has no visible chain back to the work that supports it.

The temptation is to solve that with a larger context window. I think that mostly hides the problem. More context gives a model more opportunities to choose a plausible sentence, but it does not establish which event should be treated as authority. We needed a representation that could carry the evidence through retrieval and response generation.

The retrieval boundary became the place to enforce that rule. We ask Hindsight for relevant memories, then normalize each result into an internal evidence object. The response layer does not receive anonymous strings.

```ts
const matches = await hindsight.memories.retrieve({
  query: question,
  filters: { scope: taskId },
});

const evidence = matches.map((match) => ({
  text: match.content,
  sourceId: match.metadata.sourceId,
  sourceType: match.metadata.sourceType,
  recordedAt: match.metadata.recordedAt,
  artifact: match.metadata.artifact,
}));
```

This did not make the system magically correct. It made incorrectness inspectable. If an answer cites a stale tool result, we can see it. If two memories disagree, we can show that disagreement instead of quietly selecting one. If a retrieved item lacks a source identifier, we can downgrade it from a factual claim to background context.

That last point is the one I care about most. Not all useful memory has the same epistemic status. A user preference, an execution log, an inferred summary, and an approved decision are all helpful; none should be presented with identical confidence.

## Provenance changed how we write memory

Once I knew retrieval had to be accountable, ingestion got stricter. We stopped treating every text fragment as interchangeable. A completed tool invocation is recorded as an observation. A user correction is recorded as a correction. A generated summary is recorded as a derived artifact that points back to the records it summarized.

```ts
function toMemoryEvent(event: WorkEvent) {
  return {
    content: event.text,
    metadata: {
      sourceId: event.id,
      sourceType: event.kind,
      scope: event.scope,
      recordedAt: event.timestamp,
      derivedFrom: event.parentIds ?? [],
    },
  };
}
```

`derivedFrom` earned its keep quickly. Summaries are convenient because they reduce context, but summaries are also where nuance disappears. By retaining their parent event IDs, we can retrieve the summary for speed while retaining a path to the original command output, document, or decision when a user asks “according to what?”

This is also where [agent memory concepts from Vectorize](https://vectorize.io/what-is-agent-memory) helped clarify our design. Memory is not simply storage for prior messages. It is task-relevant state with a lifecycle, and the lifecycle needs rules for correction, scoping, and retrieval. Provenance is the connective tissue that lets those rules survive past the original interaction.

## What a grounded interaction looks like

Consider a user asking, “Why is the deployment configuration using the fallback path?” A useful answer does more than state that the fallback exists. It can explain that the primary route failed during a specific configuration validation, that a later decision recorded the fallback as intentional, and that the answer is scoped to the current service rather than another project with a similar name.

In practice, the response format is simple: a direct answer followed by compact references to its supporting events. A human does not need a database dump. They need enough detail to open the underlying artifact, verify the claim, and decide whether the evidence still applies.

```md
The fallback remains enabled because the primary route failed validation
for the current service configuration.

Evidence:
- configuration validation result, 2026-09-12
- approved routing decision, 2026-09-13
```

The system can still provide a fluent explanation, but it no longer asks the user to take fluency as proof. If the available evidence is incomplete, it should say that. “I found a previous discussion but not the final decision” is a better operational answer than manufactured certainty.

## What I learned

- Retrieve evidence, not just passages. A text match without origin information is a lead, not a fact.
- Preserve source identifiers at ingestion. Trying to reconstruct provenance after summarization is tedious and unreliable.
- Scope memory aggressively. Relevance across a whole organization is not the same as relevance to the task in front of the user.
- Treat summaries as derived data. They are efficient indexes into history, not replacements for the events that created the history.
- Make uncertainty visible in the response contract. It is easier to improve a system that admits what it cannot substantiate.

Hindsight gives us a practical memory layer, but the engineering decision that changed the system was narrower: every retrieved fact needs a trail back to an event we can inspect. Once that trail exists, memory becomes more than a way to make an assistant sound informed. It becomes a record engineers can question, correct, and use.
