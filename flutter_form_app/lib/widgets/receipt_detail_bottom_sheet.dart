import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/policy_model.dart';
import 'payment_status_chip.dart';

void showReceiptDetailSheet(
  BuildContext context,
  ReceiptItem receipt, {
  required PaymentStatus status,
  required VoidCallback onPaymentRegistered,
}) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    showDragHandle: true,
    constraints: const BoxConstraints(maxWidth: 560),
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
    ),
    builder: (context) {
      final scheme = Theme.of(context).colorScheme;
      return SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      'Detalle de Recibo #${receipt.reciboNumber}',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: scheme.onSurface),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    tooltip: 'Cerrar',
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              Divider(color: subtleLine(scheme)),
              const SizedBox(height: 12),
              _InfoRow('Importe Total:', receipt.formattedAmount, isBold: true),
              _InfoRow('Vigencia:', '${receipt.vigenciaDelText} al ${receipt.vigenciaAlText}'),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 6),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Estatus:', style: TextStyle(color: scheme.onSurfaceVariant)),
                    PaymentStatusChip(status: status),
                  ],
                ),
              ),
              if (receipt.isPaid) ...[
                _InfoRow('Fecha de Pago:', receipt.fechaPagoText!),
                _InfoRow('Forma de Pago:', receipt.formaPago ?? 'Por confirmar'),
                if (receipt.uuidComplemento != null) ...[
                  const SizedBox(height: 8),
                  Text('UUID Complemento SAT:', style: TextStyle(fontSize: 12, color: scheme.onSurfaceVariant)),
                  Row(
                    children: [
                      Expanded(
                        child: SelectableText(
                          receipt.uuidComplemento!,
                          style: TextStyle(fontFamily: 'monospace', fontSize: 11, color: scheme.onSurface),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.copy, size: 18),
                        tooltip: 'Copiar UUID',
                        onPressed: () {
                          Clipboard.setData(ClipboardData(text: receipt.uuidComplemento!));
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('UUID copiado al portapapeles')),
                          );
                        },
                      ),
                    ],
                  ),
                ] else
                  _InfoRow('Complemento de pago:', 'Pendiente'),
                if (receipt.folioComplemento != null) _InfoRow('Folio Complemento:', receipt.folioComplemento!),
              ],
              const SizedBox(height: 24),
              if (!receipt.isPaid)
                SizedBox(
                  width: double.infinity,
                  child: FilledButton.icon(
                    onPressed: () {
                      Navigator.pop(context);
                      onPaymentRegistered();
                    },
                    icon: const Icon(Icons.check_circle_outline),
                    label: const Text('Registrar Pago de este Recibo'),
                  ),
                ),
            ],
          ),
        ),
      );
    },
  );
}

class _InfoRow extends StatelessWidget {
  const _InfoRow(this.label, this.value, {this.isBold = false});

  final String label;
  final String value;
  final bool isBold;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: TextStyle(color: scheme.onSurfaceVariant)),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              value,
              textAlign: TextAlign.end,
              style: TextStyle(
                fontWeight: isBold ? FontWeight.bold : FontWeight.w500,
                color: scheme.onSurface,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
