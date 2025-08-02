import { Injectable } from '@angular/core';
import { 
  faHourglass as farHourglass,
  faCheckCircle,
  faTimesCircle,
  faSpinner,
  faUserCheck,
  faCommentAlt,
  faEdit,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { faHourglass as fasHourglass } from '@fortawesome/free-regular-svg-icons';

type Status = 
  | 'IN_REVIEW' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'IN_PROGRESS' 
  | 'FINISHED' 
  | 'CANCELLED' 
  | 'AWAITING_APPROVAL' 
  | 'NOT_APPROVED';

type StatusConfig = {
  label: string;
  color: string;
  icon: any; // Cambiado a any para aceptar el tipo de ícono de FontAwesome
};

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  // Íconos de FontAwesome
  private icons = {
    inReview: farHourglass, // far fa-hourglass
    approved: faCheckCircle, // fas fa-check-circle
    rejected: faTimesCircle, // fas fa-times-circle
    inProgress: faSpinner, // fas fa-spinner
    finished: faUserCheck, // fas fa-user-check
    cancelled: faTimesCircle, // fas fa-times-circle
    notApproved: faTimesCircle, // fas fa-times-circle
    awaitingApproval: faSpinner, // fas fa-spinner
    comment: faCommentAlt, // fas fa-comment-alt
    edit: faEdit, // fas fa-edit
    eye: faEye // fas fa-eye
  };

  private statusMap: Record<Status, StatusConfig> = {
    IN_REVIEW: {
      label: 'En Revisión',
      color: 'var(--status-in-review)',
      icon: this.icons.inReview
    },
    APPROVED: {
      label: 'Aprobado',
      color: 'var(--status-approved)',
      icon: this.icons.approved
    },
    REJECTED: {
      label: 'Rechazado',
      color: 'var(--status-rejected)',
      icon: this.icons.rejected
    },
    IN_PROGRESS: {
      label: 'En Progreso',
      color: 'var(--status-in-progress)',
      icon: this.icons.inProgress
    },
    FINISHED: {
      label: 'Finalizado',
      color: 'var(--status-finished)',
      icon: this.icons.finished
    },
    CANCELLED: {
      label: 'Cancelado',
      color: 'var(--status-rejected)',
      icon: this.icons.cancelled
    },
    AWAITING_APPROVAL: {
      label: 'Pendiente de Aprobación',
      color: 'var(--status-in-review)',
      icon: this.icons.awaitingApproval
    },
    NOT_APPROVED: {
      label: 'No Aprobado',
      color: 'var(--status-rejected)',
      icon: this.icons.notApproved
    }
  };

  getStatusConfig(status: string): StatusConfig {
    // Si el estado no existe en el mapa, devolvemos un valor por defecto
    if (!status || !this.statusMap[status as Status]) {
      return {
        label: status || 'Desconocido',
        color: 'basic',
        icon: 'help_outline'
      };
    }
    
    return this.statusMap[status as Status];
  }

  getStatusLabel(status: string): string {
    return this.getStatusConfig(status).label;
  }

  getStatusColor(status: string): string {
    return this.getStatusConfig(status).color;
  }

  getStatusIcon(status: string): any {
    return this.getStatusConfig(status).icon;
  }

  getCommentIcon(): any {
    return this.icons.comment;
  }

  getEditIcon(): any {
    return this.icons.edit;
  }

  getEyeIcon(): any {
    return this.icons.eye;
  }
}

export { Status };
