import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _isDarkTheme: boolean = false; 
  constructor() {
    this.loadTheme();
  }

  // Método para cargar el tema guardado en localStorage
  loadTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    this._isDarkTheme = savedTheme === 'dark';
    this.applyTheme();
    this.applyGlobalTheme();
  }

  // Propiedad pública para acceder al estado del tema
  public get isDarkTheme(): boolean {
    return this._isDarkTheme; 
  }

  // Método para alternar el tema
  toggleTheme(): void {
    this._isDarkTheme = !this._isDarkTheme; 
    this.applyTheme();
    this.applyGlobalTheme();
    localStorage.setItem('theme', this._isDarkTheme ? 'dark' : 'light');
  }

  // Aplica el tema de Angular Material
  private applyTheme(): void {
    const themeClass = this._isDarkTheme ? 'dark-theme' : '';
    document.documentElement.className = themeClass;
  }

  // Aplica el tema global
  private applyGlobalTheme(): void {
    const body = document.body;
    body.classList.toggle('dark-theme-material', this._isDarkTheme);
    body.classList.toggle('light-theme-material', !this._isDarkTheme);
  }

  // Método para obtener el estado del tema
  isDark(): boolean {
    return this._isDarkTheme; 
  }

  setLightTheme(): void {
    this._isDarkTheme = false;
    this.applyTheme();
    this.applyGlobalTheme();
    localStorage.setItem('theme', 'light');
  }

  setDarkTheme(): void {
    this._isDarkTheme = true;
    this.applyTheme();
    this.applyGlobalTheme();
    localStorage.setItem('theme', 'dark');
  }
}
