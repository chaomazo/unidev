# ScenePilot architecture

ScenePilot is organized around plain files so a production remains portable, inspectable, and easy for an AI coding assistant to operate.

## Core layers

- Pipeline definitions live in pipeline_defs/.
- Tools live in tools/ and perform focused media operations.
- Skills live in skills/ and provide operating guidance and quality bars.
- Productions live in productions/ and hold project inputs, plans, receipts, and renders.

The CLI currently bootstraps this layout and checks the local media toolchain. Future pipelines should build on these stable paths rather than hiding state in a database.

## Design principles

1. Agent-first: the coding assistant is the orchestrator.
2. Local and inspectable: manifests and outputs are ordinary files.
3. Quality-gated: stages should leave receipts and fail clearly when an expected artifact is missing.
4. Provider-neutral: integrations belong behind focused adapters, not inside pipeline logic.
