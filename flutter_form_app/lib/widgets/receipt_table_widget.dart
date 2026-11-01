import 'package:flutter/material.dart';
import '../models/policy_model.dart';
import 'payment_status_chip.dart';

class ReceiptTableWidget extends StatelessWidget {
  final PolicyData policy;
  final void Function(ReceiptItem) onReceiptTap;

  const ReceiptTableWidget({
    super.key,
    required this.policy,
    required this.onReceiptTap,
  });

  @override
  Widget build(BuildContext context) {
    const navyHeader = Color(0xFF1B365D);
    final scheme = Theme.of(context).colorScheme;
    final muted = TextStyle(color: scheme.onSurfaceVariant);
    Text orDash(String? value, {TextStyle? style}) =>
        value == null ? Text('-', style: muted) : Text(value, style: style);

    return Card(
      clipBehavior: Clip.antiAlias,
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: DataTable(
          // Rows are tappable to open the detail sheet; there is nothing to select.
          showCheckboxColumn: false,
          headingRowColor: WidgetStateProperty.all(navyHeader),
          headingTextStyle: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 12,
          ),
          dataTextStyle: TextStyle(color: scheme.onSurface, fontSize: 14),
          dataRowMinHeight: 44,
          dataRowMaxHeight: 52,
          columnSpacing: 20,
          border: TableBorder.all(color: subtleLine(scheme), width: 0.5),
          columns: const [
            DataColumn(label: Text('Recibo')),
            DataColumn(label: Text('Vigencia del')),
            DataColumn(label: Text('Vigencia al')),
            DataColumn(label: Text('Importe (MXN)'), numeric: true),
            DataColumn(label: Text('Fecha de pago')),
            DataColumn(label: Text('Días antes'), numeric: true),
            DataColumn(label: Text('Estatus')),
            DataColumn(label: Text('Forma de pago')),
            DataColumn(label: Text('UUID complemento')),
            DataColumn(label: Text('Folio complemento')),
          ],
          rows: [
            for (final r in policy.recibos)
              DataRow(
                onSelectChanged: (_) => onReceiptTap(r),
                cells: [
                  DataCell(Text('${r.reciboNumber}', style: const TextStyle(fontWeight: FontWeight.bold))),
                  DataCell(Text(r.vigenciaDelText)),
                  DataCell(Text(r.vigenciaAlText)),
                  DataCell(Text(r.formattedAmount, style: const TextStyle(fontWeight: FontWeight.w600))),
                  DataCell(orDash(r.fechaPagoText)),
                  DataCell(orDash(r.diasAntesFinPeriodo?.toString())),
                  DataCell(PaymentStatusChip(status: policy.statusOf(r))),
                  DataCell(orDash(r.formaPago)),
                  DataCell(
                    SizedBox(
                      width: 140,
                      child: r.uuidComplemento == null
                          ? Text('-', style: muted)
                          : Text(
                              r.uuidComplemento!,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(fontSize: 11, fontFamily: 'monospace'),
                            ),
                    ),
                  ),
                  DataCell(orDash(r.folioComplemento, style: const TextStyle(fontSize: 12))),
                ],
              ),
          ],
        ),
      ),
    );
  }
}
