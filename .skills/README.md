# .skills/ — AI Design Skills for Script

Reference skills loaded into the AI team's context when making UI/UX decisions.
Added by w4rw1ck, 2026-03-12.

## Included

### 1. UI UX Pro Max (`ui-ux-pro-max/`)
Source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- 161 reasoning rules for design decisions
- 67 UI styles with CSS/RN keywords
- Color palettes, typography pairings, chart types, UX best practices
- Searchable CSV data (react-native stack relevant)
- SKILL.md: full usage guide

### 2. Designer Skills Collection (`designer-skills/`)
Source: https://github.com/Owl-Listener/designer-skills
Plugins included (React Native–relevant subset):
- `ui-design/`: color system, dark mode, typography scale, layout grid, spacing system, visual hierarchy, responsive design
- `interaction-design/`: micro-interactions, error handling UX, feedback patterns, gesture patterns, loading states, state machines, animation principles
- `design-systems/`: tokens, components, accessibility, theming

### 3. Paper Search MCP
Source: https://github.com/openags/paper-search-mcp
- MCP server for Claude Desktop to search arXiv, PubMed, bioRxiv
- Install separately if needed for research: `pip install paper-search-mcp`
- Not included as files (Python server, not skill docs)

## How to use

When making a UI/UX decision in Script, reference the relevant SKILL.md files.
Example: dark mode decision → `.skills/designer-skills/ui-design/dark-mode-design/SKILL.md`
