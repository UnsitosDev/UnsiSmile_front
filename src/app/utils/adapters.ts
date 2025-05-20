export class Adapter {
    public static adaptDate(dateArray: number[]): string {
        if (!dateArray || dateArray.length < 3) return 'Fecha inválida';
    
        const year = dateArray[0];
        const month = dateArray[1].toString().padStart(2, '0');
        const day = dateArray[2].toString().padStart(2, '0');
    
        return `${day}/${month}/${year}`;
      }
}