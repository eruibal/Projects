import 'package:flutter/material.dart';
import '../models/policy_model.dart';
import 'payment_status_chip.dart';

/// Wide-screen receipt list. Styled like the summary card and the mobile
/// cards: same card border, muted small labels, horizontal dividers only and
/// the receipt number in a status-colored circle.
class ReceiptTableWidget extends StatelessWidget {
  final PolicyData policy;
  final void Function(ReceiptItem) onReceiptTap;

  const ReceiptTableWidget({super.key, required this.policy, required this.onReceiptTap});

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final brightness = Theme.of(context).brightness;
    final line = subtleLine(scheme);
    final muted = TextStyle(fontSize: 12, color: scheme.onSurfaceVariant);
    Text orDash(String? value, {TextStyle? style}) =>
        value == null ? Text('-', style: muted) : Text(value, style: style);

    return Card(
      elevation: 0,
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: line),
      ),
      // Fill the card on wide screens; scroll sideways when the columns don't fit.
      child: LayoutBuilder(
        builder: (context, box) => SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: ConstrainedBox(
            constraints: BoxConstraints(minWidth: box.maxWidth),
            // DataTable draws its row dividers with the theme's divider color.
            child: Theme(
              data: Theme.of(context).copyWith(
                dividerColor: line,
                dividerTheme: DividerThemeData(color: line),
              ),
              child: DataTable(
                // Rows are tappable to open the detail sheet; there is nothing to select.
                showCheckboxColumn: false,
                headingRowHeight: 40,
                headingTextStyle: TextStyle(color: scheme.onSurfaceVariant, fontWeight: FontWeight.w600, fontSize: 11),
                dataTextStyle: TextStyle(color: scheme.onSurface, fontSize: 13),
                dataRowMinHeight: 52,
                dataRowMaxHeight: 56,
                columnSpacing: 24,
                dividerThickness: 1,
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
                        DataCell(
                          _ReceiptNumber(number: r.reciboNumber, status: policy.statusOf(r), brightness: brightness),
                        ),
                        DataCell(Text(r.vigenciaDelText)),
                        DataCell(Text(r.vigenciaAlText)),
                        DataCell(Text(r.formattedAmount, style: const TextStyle(fontWeight: FontWeight.bold))),
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
                                    style: muted.copyWith(fontSize: 11, fontFamily: 'monospace'),
                                  ),
                          ),
                        ),
                        DataCell(orDash(r.folioComplemento, style: muted)),
                      ],
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Same status-colored circle the mobile cards use for the receipt number.
class _ReceiptNumber extends StatelessWidget {
  const _ReceiptNumber({required this.number, required this.status, required this.brightness});

  final int number;
  final PaymentStatus status;
  final Brightness brightness;

  @override
  Widget build(BuildContext context) {
    final colors = paymentStatusColors(status, brightness);
    return CircleAvatar(
      radius: 14,
      backgroundColor: colors.bg,
      child: Text(
        '$number',
        style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: colors.fg),
      ),
    );
  }
}
