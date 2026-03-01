-- =============================================================
-- SCRIPT — Seed de 5 Scripts Sociales Predefinidos
-- Ejecutar DESPUÉS de schema.sql
-- =============================================================

INSERT INTO scripts (title, description, category, is_predefined, blocks, estimated_duration_seconds) VALUES
(
  'Interrumpir una conversación',
  'Para cuando quieres unirte o hacer una pregunta en una conversación grupal',
  'conversacion',
  TRUE,
  '[
    {"type":"apertura","options":["Disculpa, ¿puedo interrumpir un momento?","Perdón, ¿tengo un segundo?"]},
    {"type":"contexto","text":"Estás en una conversación y necesitas intervenir"},
    {"type":"accion","options":["Quería preguntar sobre...","Necesito agregar algo sobre...","¿Podría aclarar...?"]},
    {"type":"salida","optional":true,"options":["Gracias, eso es todo","Ya terminé, disculpen"]}
  ]',
  45
),
(
  'Pedir algo en un lugar público',
  'Restaurante, tienda, transporte — cuando necesitas pedir ayuda o información',
  'lugar_publico',
  TRUE,
  '[
    {"type":"apertura","options":["Hola, buenos días/tardes","Disculpa, ¿me puedes ayudar?"]},
    {"type":"accion","options":["Quisiera [lo que necesitas]","¿Tienen [lo que buscas]?","¿Me podrías decir dónde está...?"]},
    {"type":"salida","optional":true,"options":["Muchas gracias","Gracias, eso es todo lo que necesitaba"]}
  ]',
  30
),
(
  'Sobrecarga sensorial en público',
  'Cuando el ambiente es demasiado y necesitas espacio o salir',
  'crisis',
  TRUE,
  '[
    {"type":"apertura","options":["Necesito un momento","Disculpa, me siento un poco abrumado/a"]},
    {"type":"accion","options":["¿Podría salir un momento?","Voy a tomar un poco de aire","Necesito un lugar más tranquilo"]},
    {"type":"salida","optional":true,"options":["Vuelvo en unos minutos","Gracias por entender"]}
  ]',
  30
),
(
  'Primera reunión o entrevista',
  'Para presentarte y navegar el inicio de una reunión o entrevista de trabajo',
  'trabajo_estudio',
  TRUE,
  '[
    {"type":"apertura","options":["Hola, mucho gusto. Soy [nombre]","Buenos días/tardes, soy [nombre]"]},
    {"type":"contexto","text":"Estás en tu primera reunión o entrevista"},
    {"type":"accion","options":["Estoy aquí para [rol/propósito]","Me contaron sobre esta oportunidad y me interesa mucho","¿Por dónde les gustaría que empezara?"]},
    {"type":"salida","optional":true,"options":["Quedo atento/a a sus preguntas","¿Qué más les gustaría saber?"]}
  ]',
  60
),
(
  'Resolver un malentendido',
  'Cuando hay tensión o confusión con alguien y necesitas aclararlo',
  'conversacion',
  TRUE,
  '[
    {"type":"apertura","options":["Creo que hubo un malentendido","Quisiera aclarar algo si está bien"]},
    {"type":"accion","options":["Lo que quise decir fue...","Entendí que... ¿es correcto?","No era mi intención..."]},
    {"type":"salida","optional":true,"options":["¿Estamos bien?","Gracias por escucharme"]}
  ]',
  60
);
