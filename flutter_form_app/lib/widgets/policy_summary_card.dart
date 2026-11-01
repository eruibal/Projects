import 'package:flutter/material.dart';
import '../models/policy_model.dart';
import 'payment_status_chip.dart';

class PolicySummaryCard extends StatelessWidget {
  final PolicyData policy;
  final VoidCallback? onEdit;

  const PolicySummaryCard({
    super.key,
    required this.policy,
    this.onEdit,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final brightness = Theme.of(context).brightness;
    final paid = paymentStatusColors(PaymentStatus.pagado, brightness).fg;
    final pending = brightness == Brightness.dark ? const Color(0xFFF3B45A) : const Color(0xFFA15C00);
    final muted = TextStyle(fontSize: 12, color: scheme.onSurfaceVariant);

    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: subtleLine(scheme)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Wrap(
                    spacing: 8,
                    runSpacing: 6,
                    children: [
                      _Pill(
                        text: 'Póliza ${policy.polizaId}',
                        fg: scheme.onPrimaryContainer,
                        bg: scheme.primaryContainer,
                        fontSize: 14,
                        bold: true,
                      ),
                      _Pill(
                        text: policy.formaPago,
                        fg: scheme.onSecondaryContainer,
                        bg: scheme.secondaryContainer,
                        fontSize: 12,
                      ),
                    ],
                  ),
                ),
                if (onEdit != null)
                  TextButton.icon(
                    onPressed: onEdit,
                    icon: const Icon(Icons.edit, size: 14),
                    label: const Text('Editar', style: TextStyle(fontSize: 12)),
                  ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              'Titular: ${policy.titular}',
              style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: scheme.onSurface),
            ),
            if (policy.asegurados.length > 1) ...[
              const SizedBox(height: 4),
              Text('Otros asegurados: ${policy.asegurados.sublist(1).join(', ')}', style: muted),
            ],
            const SizedBox(height: 8),
            Wrap(
              spacing: 16,
              runSpacing: 4,
              children: [
                Text('Vigencia: ${policy.inicioVigenciaText} al ${policy.finVigenciaText}', style: muted),
                Text('Corte: ${policy.fechaCorteText}', style: muted.copyWith(fontWeight: FontWeight.w600)),
              ],
            ),
            Divider(height: 24, color: subtleLine(scheme)),
            Row(
              children: [
                Expanded(child: _Metric('Total Anual', policy.formattedTotalAnual, scheme.onSurface)),
                Expanded(child: _Metric('Total Pagado', policy.formattedTotalPagado, paid)),
                Expanded(child: _Metric('Por Pagar', policy.formattedSaldoPendiente, pending)),
              ],
            ),
            const SizedBox(height: 12),
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: policy.porcentajeAvance,
                backgroundColor: subtleLine(scheme),
                valueColor: AlwaysStoppedAnimation<Color>(paid),
                minHeight: 6,
              ),
            ),
            const SizedBox(height: 6),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    '${policy.recibosConPagoCount} de ${policy.recibos.length} recibos cubiertos',
                    style: muted.copyWith(fontSize: 11),
                  ),
                ),
                Text(
                  '${(policy.porcentajeAvance * 100).toStringAsFixed(1)}%',
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: paid),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _Pill extends StatelessWidget {
  const _Pill({required this.text, required this.fg, required this.bg, required this.fontSize, this.bold = false});

  final String text;
  final Color fg;
  final Color bg;
  final double fontSize;
  final bool bold;

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(6)),
        child: Text(
          text,
          style: TextStyle(color: fg, fontWeight: bold ? FontWeight.bold : FontWeight.w600, fontSize: fontSize),
        ),
      );
}

class _Metric extends StatelessWidget {
  const _Metric(this.label, this.value, this.color);

  final String label;
  final String value;
  final Color color;

  @override
  Widget build(BuildContext context) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: TextStyle(fontSize: 11, color: Theme.of(context).colorScheme.onSurfaceVariant)),
          const SizedBox(height: 2),
          FittedBox(
            fit: BoxFit.scaleDown,
            alignment: Alignment.centerLeft,
            child: Text(value, style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: color)),
          ),
        ],
      );
}
