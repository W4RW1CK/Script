# Audio Assets — Script App

Este directorio contiene los archivos de audio usados en la app.

## Archivos necesarios

| Archivo | Uso | Estado |
|---|---|---|
| `tone-ambient.mp3` | Tono de fondo para protocolos de rescate (grounding + breathing) | ⏳ Pendiente |
| `tone-grounding-voice.mp3` | Voz guiada para grounding 5-4-3-2-1 (nivel 1 rescate) | ⏳ Pendiente |
| `tone-inhale.mp3` | Tono para fase de inhalación (breathing guide) | ⏳ Pendiente |
| `tone-exhale.mp3` | Tono para fase de exhalación (breathing guide) | ⏳ Pendiente |

## Especificaciones

- Formato: MP3 (compatible con expo-audio)
- Duración: los tonos deben ser cortos (1-3s) y loopables
- La voz guiada puede ser más larga (guía completa del grounding)
- Tono: calmado, no intrusivo, volumen moderado
- Idioma voz: español

## Cómo agregar

1. Coloca los archivos `.mp3` en este directorio
2. Los componentes los importan con `require('../../assets/audio/nombre.mp3')`
3. Se cargan via expo-audio (`useAudioPlayer`)
