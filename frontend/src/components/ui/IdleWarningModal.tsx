'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface IdleWarningModalProps {
  open: boolean;
  remainingSeconds: number;
  onContinue: () => void;
  onLogout: () => void;
}

export function IdleWarningModal({
  open,
  remainingSeconds,
  onContinue,
  onLogout,
}: IdleWarningModalProps) {
  return (
    <Dialog open={open} modal>
      <DialogContent showCloseButton={false} className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Sesión por expirar</DialogTitle>
          <DialogDescription>
            Tu sesión se cerrará automáticamente por inactividad en{' '}
            <span className="font-bold text-destructive">{remainingSeconds} segundos</span>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onLogout}>
            Cerrar sesión
          </Button>
          <Button onClick={onContinue}>Continuar sesión</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
