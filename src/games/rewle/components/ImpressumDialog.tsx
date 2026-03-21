import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImpressumDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ImpressumDialog({ open, onClose }: ImpressumDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Impressum: Angaben gemäß § 5 TMG</DialogTitle>
          <DialogDescription className="text-left">
            Kontakt- und Anbieterinformationen zu diesem Projekt.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Simon Fischer
            <br />
            Alte Murnauer Straße 4, 82439 Großweil
            <br />
            Deutschland
            <br />
            simon.rewle@gmx.de
          </p>

          <p className="text-muted-foreground">
            Diese Website ist ein inoffizielles, nicht kommerzielles Projekt. Sie steht in keiner
            Verbindung zur REWE Markt GmbH oder anderen Unternehmen der REWE Group. Alle genannten
            Marken, Produktnamen und Logos sind Eigentum der jeweiligen Rechteinhaber und werden
            ausschließlich zu beschreibenden bzw. spielerischen Zwecken verwendet.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
