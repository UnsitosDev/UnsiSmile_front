import { Component } from "@angular/core";

@Component({
    selector: "app-odontogram-container-base",
    standalone: true,
    template: ""
})

export abstract class OdontogramContainerBaseComponent {
    // This component serves as a base for odontogram containers.
    // It can be extended by other components to implement specific functionality.
    public creatingOdontogram = false;

    changeOdontogramViewStatus() {
        this.creatingOdontogram = !this.creatingOdontogram;
    }
    
      transactionCarriedOut(): void {
        this.changeOdontogramViewStatus();
      }
    
      cancelOdontogramCreation(): void {
        this.changeOdontogramViewStatus();
      }
}