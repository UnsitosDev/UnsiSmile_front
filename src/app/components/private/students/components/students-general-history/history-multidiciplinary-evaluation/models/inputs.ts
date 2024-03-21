export interface InputField {
    label: string;
    type: string;
    placeholder: string;
    value: string;
  }
  
  // Examen clinico
  export const inputs: InputField[] = [
    { label: 'Paladar', type: 'text', placeholder: '', value: '' },
    { label: 'Istmo de las fauces', type: 'text', placeholder: '', value: '' },
    { label: 'Mucosa yugal', type: 'text', placeholder: '', value: '' },
    { label: 'Nódulos linfáticos', type: 'text', placeholder: '', value: '' },
    { label: 'Lengua', type: 'text', placeholder: '', value: '' },
    { label: 'Piso de boca', type: 'text', placeholder: '', value: '' },
    { label: 'Labios', type: 'text', placeholder: '', value: '' },
    { label: 'Glándulas salivales', type: 'text', placeholder: '', value: '' },
    { label: 'Encía', type: 'text', placeholder: '', value: '' },
    { label: 'Frenillos', type: 'text', placeholder: '', value: '' },
    { label: 'Saliva', type: 'text', placeholder: '', value: '' },
    { label: 'Otras señas particulares', type: 'text', placeholder: '', value: '' }
  ];

  // Analisis funcional
  export const funcionalAnalysis: InputField[]= [
    { label: 'Deglución', type: 'text', placeholder: '', value: '' },
    { label: 'Fonación masticación', type: 'text', placeholder: '', value: '' },
    { label: 'Respiración', type: 'text', placeholder: '', value: '' },
    { label: 'Observaciones', type: 'text', placeholder: '', value: '' },
  ];

  // Postura del paciente

  export const patientPosture: InputField[]= [
    { label: 'ATM – Palpación', type: 'text', placeholder: '', value: '' },
  ];

  // Analisis Radiografico
  export const bucalExam: InputField[]= [
    { label: 'Periapical', type: 'text', placeholder: '', value: '' },
    { label: 'Cefálica lateral', type: 'text', placeholder: '', value: '' },
    { label: 'Panorámica', type: 'text', placeholder: '', value: '' },

  ];

    // Modelos de estudio y fotografias
    export const studyModels: InputField[]= [
      { label: 'Modelos de estudio', type: 'text', placeholder: '', value: '' },
      { label: 'Tipo de arcada', type: 'text', placeholder: '', value: '' },
      { label: 'Fotografías', type: 'text', placeholder: '', value: '' },
  
    ];

    // Estudio de laboratorio
    export const studyLab: InputField[]= [
      { label: 'Tipo de estudio de laboratorio', type: 'text', placeholder: '', value: '' },
      { label: 'Tipo de biopsia', type: 'text', placeholder: '', value: '' },
      { label: 'Región donde se realizó biopsia', type: 'text', placeholder: '', value: '' },
      { label: 'Laboratorio donde se envía el estudio', type: 'text', placeholder: '', value: '' },
    ];

     // Interconsulta medica
     export const medicalConsultation: InputField[]= [
      { label: 'Nombre de medico', type: 'text', placeholder: '', value: '' },
      { label: 'Razón de interconsulta', type: 'text', placeholder: '', value: '' },
      { label: 'Motivo de diagnostico presuntivo', type: 'text', placeholder: '', value: '' },
      { label: 'Motivo de envio y servicio al que se envia', type: 'text', placeholder: '', value: '' },
    ];

    // Analisis Radiografico
    export const radiographicAnalisys: InputField[]= [
      { label: 'Periapical', type: 'text', placeholder: '', value: '' },
      { label: 'Cefálica lateral', type: 'text', placeholder: '', value: '' },
      { label: 'Panorámica', type: 'text', placeholder: '', value: '' },
    ];