import 'package:flutter/material.dart';
import '../models/policy_model.dart';
import 'payment_status_chip.dart';

class ReceiptMobileCard extends StatelessWidget {
  final ReceiptItem receipt;
  final PaymentStatus status;
  final int totalReceipts;
  final VoidCallback onTap;

  const ReceiptMobileCard({
    super.key,
    required this.receipt,
    required this.status,
    required this.totalReceipts,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final colors = paymentStatusColors(status, Theme.of(context).brightness);
    final label = TextStyle(fontSize: 11, color: scheme.onSurfaceVariant);
    final footer = receipt.isPaid
        ? 'Pagado el ${receipt.fechaPagoText} (${receipt.diasAntesFinPeriodo} ${receipt.diasAntesFinPeriodo == 1 ? 'día' : 'días'} antes)'
        : status == PaymentStatus.vencido
            ? 'Venció el ${receipt.vigenciaAlText}'
            : 'Pagar antes del ${receipt.vigenciaAlText}';

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 14,
                    backgroundColor: colors.bg,
                    child: Text(
                      '${receipt.reciboNumber}',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: colors.fg),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'Recibo ${receipt.reciboNumber} / $totalReceipts',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: scheme.onSurface),
                    ),
                  ),
                  PaymentStatusChip(status: status),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Periodo de vigencia', style: label),
                        const SizedBox(height: 2),
                        Text(
                          '${receipt.vigenciaDelText} - ${receipt.vigenciaAlText}',
                          style: TextStyle(fontSize: 13, color: scheme.onSurface),
                        ),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text('Importe', style: label),
                      const SizedBox(height: 2),
                      Text(
                        receipt.formattedAmount,
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: scheme.onSurface),
                      ),
                    ],
                  ),
                ],
              ),
              Divider(height: 20, color: subtleLine(scheme)),
              Row(
                children: [
                  Expanded(
                    child: Text(
                      footer,
                      style: TextStyle(
                        fontSize: 12,
                        color: status == PaymentStatus.vencido ? colors.fg : scheme.onSurfaceVariant,
                      ),
                    ),
                  ),
                  Icon(Icons.chevron_right, size: 18, color: scheme.onSurfaceVariant),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
