export interface Treatments {
    idTreatment: number;
    name: string;
    treatmentScope: {
        idScopeTreatment: number;
        name: string;
    };
    cost: number;
    clinicalHistoryCatalogId: number;
    clinicalHistoryCatalogName: string;
}