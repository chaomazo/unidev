# UNIDEV architecture

This repository currently has two deliberate layers:

1. **The public experience** in site/, which establishes the product narrative and visual system without a framework or external runtime dependency.
2. **The retained Python foundation** in scenepilot/, kept intact so the repository rename does not erase the earlier file-based workspace tooling while the platform layer is being built.

## Product surfaces

### Showcase

A persistent project record should hold the current build, project intent, engine and performance metadata, changelog, contributors, and review history. The page is the durable object; each build is a versioned moment inside it.

### Playtest

A playtest needs a clear entry point, build version, expected session length, known issues, and a lightweight way to capture what happened. Browser builds and downloadable builds should share the same metadata contract.

### Critique

Reviews should capture a moment, an observation, and its context. The useful unit is not a score by itself; it is a specific signal a creator can test in the next slice.

### UNICON

UNICON is an exhibition mode over the same showcase and review primitives. It adds a cohort, a judging rubric, deadlines, and an archive rather than creating a separate content system.

## Near-term implementation direction

- Add a small typed data model for creators, projects, builds, reviews, and exhibitions.
- Keep build metadata provider-neutral so Unreal, Unity, WebGPU, and custom engines can participate.
- Store review context as structured fields plus a human note; never reduce critique to a single rating.
- Keep the first publish flow fast and reversible: draft, preview, publish, revise.
- Treat performance data and input feel as first-class showcase content.

## Development principle

The platform should make the next build easier to understand. Every feature must either reduce the distance between a creator and a playable build or increase the quality of the conversation around it.
