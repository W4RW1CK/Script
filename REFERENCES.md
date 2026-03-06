# REFERENCES.md — Fuentes y Recursos Externos

## Herramientas de Investigación

### paper-search-mcp
- **Repo:** https://github.com/openags/paper-search-mcp
- **Qué hace:** MCP server para buscar y descargar papers académicos desde arXiv, PubMed, bioRxiv, Semantic Scholar, Google Scholar, IACR
- **Para qué sirve en Script:**
  - Buscar papers sobre intervenciones de comunicación social en TEA adultos
  - Enriquecer prompts del Edge Function `interpret-checkin` con evidencia clínica
  - Investigar para el Diccionario Emocional (Semana 2)
  - Validar el diseño de los scripts sociales con literatura peer-reviewed
- **Cómo instalarlo (en tu máquina local):**
  ```bash
  pip install paper-search-mcp
  ```
  Luego configurar en Claude Desktop como MCP server.
- **Cuándo usarlo:** Semana 3-4 cuando refinemos el motor de IA

---

## Fundamento Clínico — Scripts Sociales

Los 5 scripts predefinidos en `supabase/seed-scripts.sql` están basados en:

| Fuente | Aplicación |
|---|---|
| **Gray, C. (1994). Social Stories™** | Formato de contexto narrativo antes de la acción — explicar la situación antes de dar frases |
| **Baker, J. (2003). Social Skills Training for Children and Adolescents with Asperger Syndrome** | Estructura apertura → acción → salida como secuencia cognitiva explícita |
| **Gaus, V.L. (2011). Cognitive-Behavioral Therapy for Adult Asperger Syndrome** | Opciones múltiples por fase para reducir carga cognitiva; señales tempranas de sobrecarga |
| **Attwood, T. (2007). The Complete Guide to Asperger's Syndrome** | Salida marcada `optional: true` — no forzar cierre formal; anticipa la ansiedad de "despedirse" |
| **Hull et al. (2017). Putting on My Best Normal — CAT-Q** | Camouflaging scripts como estrategia — los scripts reducen el esfuerzo de masking |

## Fundamento Clínico — Tests de Onboarding

| Test | Fuente |
|---|---|
| AQ-10 | Allison et al. (2012). Autism Spectrum Quotient-10. PubMed PMID: 22397989 |
| AQ-Full (50) | Baron-Cohen et al. (2001). The Autism-Spectrum Quotient. Journal of Autism and Developmental Disorders |
| CAT-Q (25) | Hull et al. (2019). Development and Validation of the Camouflaging Autistic Traits Questionnaire. Journal of Autism and Developmental Disorders |
| RAADS-R (80) | Ritvo et al. (2011). The Ritvo Autism Asperger Diagnostic Scale-Revised. Journal of Autism and Developmental Disorders |

---

## Recursos a revisar en Fases Futuras

- **Semana 2 — Diccionario Emocional:** buscar "alexithymia autism emotional vocabulary interventions" en PubMed
- **Semana 3 — Motor IA:** buscar "LLM autism social communication support" en arXiv
- **Semana 4 — Insights:** buscar "ecological momentary assessment autism adults" en PubMed
