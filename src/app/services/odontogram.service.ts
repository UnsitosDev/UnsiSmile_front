import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { UriConstants } from '../utils/uris.contants';
import { dentalCodeResponse } from './../components/private/students/components/students-general-history/models/dentalCode/dentalCode';
import { ApiService } from './api.service';
import { IStore } from '../models/shared/store';

export const store: IStore = {
  marked: {
    idCondition: 4,
    selecionado: 'white',
    uiTooth: {
      cor: 'white',
      all: '',
    },
  },
  toolbar: {
    opcoes: [
      {
        idCondition: 4,
        name: 'Diente presente',
        uiTooth: {
          cor: '✓',
          icon: '✓',
        },
      },
      {
        idCondition: 4,
        name: 'Diente Obturado',
        uiTooth: {
          cor: 'teal',
        },
      },
      {
        idCondition: 4,
        name: 'Diente con corona',
        uiTooth: {
          cor: 'blue',
        },
      },
      {
        idCondition: 4,
        name: 'Diente Cariado',
        uiTooth: {
          cor: 'red',
        },
      },
      {
        name: 'Diente c/fluorosis',
        idCondition: 4,

        uiTooth: {
          cor: 'F',
          icon: 'F',
        },
      },
      {
        name: 'Diente c/hipoplasia',
        idCondition: 4,

        uiTooth: {
          icon: 'H',
          cor: 'H',
        },
      },
      {
        name: 'Diente en mal posicion',
        idCondition: 4,

        uiTooth: {
          icon: '⤻',
          cor: '⤻',
        },
      },
      {
        name: 'Diente parcialmente erupcionado',
        idCondition: 4,

        uiTooth: {
          icon: '──',
          cor: '──',
        },
      },
      {
        name: 'Espacio c/Corona',
        idCondition: 4,

        uiTooth: {
          cor: 'E/C',
          icon: 'E/C',
        },
      },
      {
        name: 'Espacio c/Banda',
        idCondition: 4,

        uiTooth: {
          icon: 'E/B',
          cor: 'E/B',
        },
      },
      {
        name: 'Puente',
        idCondition: 4,

        uiTooth: {
          icon: '───',
          cor: '───',
        },
      },
      {
        name: 'Prótesis p/removible',
        idCondition: 4,

        uiTooth: {
          icon: '──',
          cor: 'pr',
        },
      },
      {
        name: 'Diente Extraido',
        idCondition: 4,

        uiTooth: {
          icon: '△',
          cor: '△',
        },
      },
      {
        name: 'Borrar',
        idCondition: 4,

        uiTooth: {
          icon: '◻︎',
          cor: '◻︎',
        },
      },
    ],
  },
  arcada: {
    adulto: [
      {
        id: 18,
        name: 'dente18',
        status: true,
        faces: [
          {
            id: '18face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '18face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '18face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '18face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '18face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 17,
        name: 'dente17',
        status: true,
        faces: [
          {
            id: '17face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '17face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '17face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '17face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '17face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 16,
        name: 'dente16',
        status: true,
        faces: [
          {
            id: '16face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '16face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '16face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '16face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '16face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 15,
        name: 'dente15',
        status: true,
        faces: [
          {
            id: '15face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '15face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '15face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '15face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '15face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 14,
        name: 'dente14',
        status: true,
        faces: [
          {
            id: '14face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '14face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '14face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '14face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '14face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 13,
        name: 'dente13',
        status: true,
        faces: [
          {
            id: '13face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '13face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '13face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '13face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '13face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 12,
        name: 'dente12',
        status: true,
        faces: [
          {
            id: '12face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '12face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '12face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '12face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '12face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 11,
        name: 'dente11',
        status: true,
        css: 'spaceRight',
        faces: [
          {
            id: '11face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '11face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '11face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '11face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '11face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 21,
        name: 'dente21',
        status: true,
        faces: [
          {
            id: '21face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '21face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '21face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '21face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '21face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 22,
        name: 'dente22',
        status: true,
        faces: [
          {
            id: '22face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '22face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '22face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '22face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '22face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 23,
        name: 'dente23',
        status: true,
        faces: [
          {
            id: '23face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '23face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '23face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '23face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '23face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 24,
        name: 'dente24',
        status: true,
        faces: [
          {
            id: '24face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '24face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '24face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '24face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '24face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 25,
        name: 'dente25',
        status: true,
        faces: [
          {
            id: '25face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '25face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '25face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '25face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '25face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 26,
        name: 'dente26',
        status: true,
        faces: [
          {
            id: '26face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '26face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '26face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '26face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '26face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 27,
        name: 'dente27',
        status: true,
        faces: [
          {
            id: '27face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '27face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '27face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '27face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '27face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 28,
        name: 'dente11',
        status: true,
        css: 'noMarginRight',
        faces: [
          {
            id: '28face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '28face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '28face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '28face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '28face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 48,
        name: 'dente48',
        status: true,
        css: 'clear',
        faces: [
          {
            id: '48face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '48face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '48face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '48face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '48face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 47,
        name: 'dente47',
        status: true,
        faces: [
          {
            id: '47face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '47face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '47face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '47face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '47face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 46,
        name: 'dente46',
        status: true,
        faces: [
          {
            id: '46face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '46face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '46face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '46face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '46face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 45,
        name: 'dente45',
        status: true,
        faces: [
          {
            id: '45face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '45face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '45face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '45face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '45face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 44,
        name: 'dente44',
        status: true,
        faces: [
          {
            id: '44face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '44face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '44face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '44face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '44face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 43,
        name: 'dente43',
        status: true,
        faces: [
          {
            id: '43face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '43face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '43face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '43face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '43face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 42,
        name: 'dente42',
        status: true,
        faces: [
          {
            id: '42face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '42face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '42face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '42face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '42face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 41,
        name: 'dente41',
        status: true,
        css: 'spaceRight',
        faces: [
          {
            id: '41face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '41face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '41face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '41face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '41face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 31,
        name: 'dente31',
        status: true,
        faces: [
          {
            id: '31face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '31face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '31face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '31face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '31face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 32,
        name: 'dente32',
        status: true,
        faces: [
          {
            id: '32face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '32face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '32face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '32face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '32face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 33,
        name: 'dente35',
        status: true,
        faces: [
          {
            id: '33face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '33face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '33face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '33face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '33face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 34,
        name: 'dente34',
        status: true,
        faces: [
          {
            id: '34face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '34face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '34face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '34face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '34face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 35,
        name: 'dente35',
        status: true,
        faces: [
          {
            id: '35face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '35face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '35face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '35face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '35face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 36,
        name: 'dente36',
        status: true,
        faces: [
          {
            id: '36face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '36face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '36face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '36face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '36face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 37,
        name: 'dente37',
        status: true,
        faces: [
          {
            id: '37face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '37face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '37face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '37face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '37face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 38,
        name: 'dente38',
        status: true,
        css: 'noMarginRight',
        faces: [
          {
            id: '38face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '38face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '38face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '38face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '38face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
    ],
    infantil: [
      {
        id: 55,
        name: 'dente55',
        status: true,
        faces: [
          {
            id: '55face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '55face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '55face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '55face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '55face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 54,
        name: 'dente54',
        status: true,
        faces: [
          {
            id: '54face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '54face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '54face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '54face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '54face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 53,
        name: 'dente53',
        status: true,
        faces: [
          {
            id: '53face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '53face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '53face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '53face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '53face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 52,
        name: 'dente52',
        status: true,
        faces: [
          {
            id: '52face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '52face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '52face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '52face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '52face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 51,
        name: 'dente51',
        status: true,
        css: 'spaceRight',
        faces: [
          {
            id: '51face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '51face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '51face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '51face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '51face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 61,
        name: 'dente61',
        status: true,
        faces: [
          {
            id: '61face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '61face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '61face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '61face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '61face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 62,
        name: 'dente62',
        status: true,
        faces: [
          {
            id: '62face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '62face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '62face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '62face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '62face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 63,
        name: 'dente63',
        status: true,
        faces: [
          {
            id: '63face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '63face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '63face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '63face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '63face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 64,
        name: 'dente64',
        status: true,
        faces: [
          {
            id: '64face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '64face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '64face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '64face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '64face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 65,
        name: 'dente65',
        status: true,
        css: 'noMarginRight',
        faces: [
          {
            id: '65face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '65face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '65face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '65face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '65face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 85,
        name: 'dente85',
        status: true,
        css: 'clear',
        faces: [
          {
            id: '85face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '85face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '85face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '85face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '85face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 84,
        name: 'dente84',
        status: true,
        faces: [
          {
            id: '84face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '84face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '84face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '84face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '84face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 83,
        name: 'dente83',
        status: true,
        faces: [
          {
            id: '83face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '83face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '83face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '83face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '83face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 82,
        name: 'dente82',
        status: true,
        faces: [
          {
            id: '82face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '82face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '82face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '82face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '82face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 81,
        name: 'dente81',
        status: true,
        css: 'spaceRight',
        faces: [
          {
            id: '81face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '81face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '81face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '81face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '81face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 71,
        name: 'dente71',
        status: true,
        faces: [
          {
            id: '71face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '71face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '71face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '71face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '71face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 72,
        name: 'dente72',
        status: true,
        faces: [
          {
            id: '72face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '72face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '72face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '72face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '72face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 73,
        name: 'dente73',
        status: true,
        faces: [
          {
            id: '73face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '73face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '73face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '73face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '73face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 74,
        name: 'dente74',
        status: true,
        faces: [
          {
            id: '74face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '74face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '74face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '74face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '74face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
      {
        id: 75,
        name: 'dente75',
        status: true,
        css: 'noMarginRight',
        faces: [
          {
            id: '75face1',
            name: 'face1',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '75face2',
            name: 'face2',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '75face3',
            name: 'face3',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '75face4',
            name: 'face4',
            estado: 'white',
            idCondition: 4,
          },
          {
            id: '75face5',
            name: 'face5',
            estado: 'white',
            idCondition: 4,
          },
        ],
      },
    ],
  },
};
