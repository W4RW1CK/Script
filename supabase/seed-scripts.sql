-- =============================================================
-- SCRIPT — Seed de 5 Scripts Sociales Predefinidos
-- Ejecutar DESPUÉS de schema.sql
--
-- Fundamento clínico:
-- • Formato apertura→contexto→acción→salida basado en Gray (1994) Social Stories™
--   y Baker (2003) Social Skills Training para autismo adulto
-- • Opciones múltiples para cada fase: reduce la carga cognitiva de "elegir palabras"
--   (recomendación de Gaus, 2011 — Cognitive-Behavioral Therapy for ASD Adults)
-- • Salida marcada "optional: true" — no forzar cierre formal cuando no aplica
--   (reduce ansiedad anticipatoria, Attwood 2007)
-- • Frases en español neutro LATAM — sin regionalismos que puedan confundir
-- =============================================================

INSERT INTO scripts (title, description, category, is_predefined, blocks, estimated_duration_seconds) VALUES
(
  'Interrumpir una conversación',
  'Para cuando quieres unirte o hacer una pregunta en una conversación grupal',
  'conversacion',
  TRUE,
  '[
    {"type":"contexto","text":"Nota el momento donde hay una pausa natural. Si no hay pausa, espera 3 segundos después de que alguien termine de hablar."},
    {"type":"apertura","options":["Disculpa, ¿puedo agregar algo?","Perdón, ¿un segundo?","¿Puedo hacer una pregunta?"]},
    {"type":"accion","options":["Quería preguntar sobre [tema]...","Necesito aclarar algo sobre [tema]...","Tengo una duda sobre lo que dijiste de [tema]..."]},
    {"type":"salida","optional":true,"options":["Gracias, eso era todo","Ya terminé, disculpen la interrupción","Gracias por escucharme"]}
  ]',
  45
),
(
  'Pedir algo en un lugar público',
  'Restaurante, tienda, transporte — cuando necesitas pedir ayuda o información a un desconocido',
  'lugar_publico',
  TRUE,
  '[
    {"type":"contexto","text":"Busca a una persona con uniforme o que parezca trabajar ahí. Acércate directamente, no hace falta esperar a que te vean."},
    {"type":"apertura","options":["Hola, buenos días","Hola, ¿me puedes ayudar un momento?","Disculpa, ¿tienes un segundo?"]},
    {"type":"accion","options":["Quisiera [lo que necesitas]","¿Tienen [producto o servicio]?","¿Me podrías decir dónde está [lugar]?","¿Cuánto cuesta [lo que buscas]?"]},
    {"type":"salida","optional":true,"options":["Muchas gracias","Gracias, eso es todo","Gracias, ya encontré lo que necesitaba"]}
  ]',
  30
),
(
  'Sobrecarga sensorial en público',
  'Cuando el ambiente es demasiado y necesitas espacio, silencio o salir sin crear alarma',
  'crisis',
  TRUE,
  '[
    {"type":"contexto","text":"Nota la señal temprana: puede ser tensión muscular, irritabilidad, dificultad para escuchar. Es mejor salir antes de llegar al límite."},
    {"type":"apertura","options":["Necesito un momento","Disculpa, me siento un poco abrumado/a","Voy a tomar un descanso breve"]},
    {"type":"accion","options":["¿Puedo salir un momento y regreso?","Voy a tomar aire, regreso en [X] minutos","Necesito un lugar más tranquilo — ¿dónde podría sentarme?"]},
    {"type":"salida","optional":true,"options":["Gracias por entender","Vuelvo en unos minutos","Ya me siento mejor, gracias"]}
  ]',
  30
),
(
  'Primera reunión o entrevista',
  'Para presentarte con calma y navegar el inicio de una reunión de trabajo o entrevista',
  'trabajo_estudio',
  TRUE,
  '[
    {"type":"contexto","text":"Llega 5 minutos antes. Tener un momento de silencio antes de entrar reduce la activación del sistema nervioso (Gaus, 2011)."},
    {"type":"apertura","options":["Hola, mucho gusto. Soy [nombre]","Buenos días/tardes, soy [nombre], llegué para [propósito]"]},
    {"type":"accion","options":["Estoy aquí para hablar sobre [rol o tema]","Me comentaron sobre esta oportunidad y me interesa mucho","¿Por dónde les gustaría que empezáramos?","Preparé algunas preguntas si les parece bien"]},
    {"type":"salida","optional":true,"options":["Quedo atento/a a sus preguntas","¿Qué más les gustaría saber sobre mí?","Gracias por su tiempo"]}
  ]',
  60
),
(
  'Poner un límite con alguien',
  'Cuando necesitas decir que no, rechazar una petición o salir de una situación incómoda sin entrar en conflicto',
  'conversacion',
  TRUE,
  '[
    {"type":"contexto","text":"Poner límites no es agresivo ni descortés. Es comunicar lo que necesitas con claridad. No tienes que dar explicaciones largas."},
    {"type":"apertura","options":["Necesito ser honesto/a contigo","Quiero decirte algo importante","Hay algo que necesito que sepas"]},
    {"type":"accion","options":["Hoy no puedo, pero gracias por pensar en mí","Prefiero no hacer eso, no es algo con lo que me sienta cómodo/a","Necesito más tiempo antes de comprometer una respuesta — ¿puedo avisarte después?","Eso no va a funcionar para mí, pero podríamos hacer [alternativa] si quieres"]},
    {"type":"salida","optional":true,"options":["Gracias por entenderlo","Lo aprecio mucho","Espero que esté bien"]}
  ]',
  45
);
