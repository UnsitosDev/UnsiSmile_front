import { EventEmitter, Output, Component } from "@angular/core";

export interface TabsHandler {
  nextMatTab: EventEmitter<void>; // Evento para ir al siguiente tab
  previousMatTab: EventEmitter<void>; // Evento para ir al tab anterior
}
