import 'package:intl/intl.dart';

enum PaymentStatus {
  pagado,
  porVencer,
  vencido,
}

extension PaymentStatusLabel on PaymentStatus {
  String get label => switch (this) {
        PaymentStatus.pagado => 'Pagado',
        PaymentStatus.porVencer => 'Por vencer',
        PaymentStatus.vencido => 'Vencido',
      };
}

final _currency = NumberFormat.currency(locale: 'es_MX', symbol: r'$');
final _date = DateFormat('dd/MM/yyyy');

String formatCurrency(double value) => _currency.format(value);
String formatDate(DateTime value) => _date.format(value);

class ReceiptItem {
  final int reciboNumber;
  final DateTime vigenciaDel;
  final DateTime vigenciaAl;
  final double importe;
  final DateTime? fechaPago;
  final String? formaPago;
  final String? uuidComplemento;
  final String? folioComplemento;
  final String? notas;

  const ReceiptItem({
    required this.reciboNumber,
    required this.vigenciaDel,
    required this.vigenciaAl,
    required this.importe,
    this.fechaPago,
    this.formaPago,
    this.uuidComplemento,
    this.folioComplemento,
    this.notas,
  });

  bool get isPaid => fechaPago != null;

  /// Days between the payment and the end of the period it covers.
  int? get diasAntesFinPeriodo => fechaPago == null ? null : vigenciaAl.difference(fechaPago!).inDays;

  /// A receipt is overdue when its period ended before the cut-off date and it is still unpaid.
  PaymentStatus statusOn(DateTime fechaCorte) {
    if (isPaid) return PaymentStatus.pagado;
    return vigenciaAl.isBefore(fechaCorte) ? PaymentStatus.vencido : PaymentStatus.porVencer;
  }

  String get formattedAmount => formatCurrency(importe);
  String get vigenciaDelText => formatDate(vigenciaDel);
  String get vigenciaAlText => formatDate(vigenciaAl);
  String? get fechaPagoText => fechaPago == null ? null : formatDate(fechaPago!);

  ReceiptItem markPaid({required DateTime on, String? formaPago}) => ReceiptItem(
        reciboNumber: reciboNumber,
        vigenciaDel: vigenciaDel,
        vigenciaAl: vigenciaAl,
        importe: importe,
        fechaPago: on,
        formaPago: formaPago,
        notas: notas,
      );
}

class PolicyData {
  final String polizaId;
  final String titular;
  final List<String> asegurados;
  final String formaPago;
  final DateTime fechaCorte;
  final DateTime inicioVigencia;
  final DateTime finVigencia;
  final List<ReceiptItem> recibos;

  const PolicyData({
    required this.polizaId,
    required this.titular,
    required this.asegurados,
    required this.formaPago,
    required this.fechaCorte,
    required this.inicioVigencia,
    required this.finVigencia,
    required this.recibos,
  });

  PaymentStatus statusOf(ReceiptItem r) => r.statusOn(fechaCorte);

  /// Returns a copy with [updated] replacing the receipt that has the same number.
  PolicyData withReceipt(ReceiptItem updated) => PolicyData(
        polizaId: polizaId,
        titular: titular,
        asegurados: asegurados,
        formaPago: formaPago,
        fechaCorte: fechaCorte,
        inicioVigencia: inicioVigencia,
        finVigencia: finVigencia,
        recibos: [for (final r in recibos) r.reciboNumber == updated.reciboNumber ? updated : r],
      );

  double get totalAnualEstimado => recibos.fold(0.0, (sum, r) => sum + r.importe);

  double get totalPagado => recibos.where((r) => r.isPaid).fold(0.0, (sum, r) => sum + r.importe);

  double get saldoPendiente => totalAnualEstimado - totalPagado;

  String get formattedTotalAnual => formatCurrency(totalAnualEstimado);
  String get formattedTotalPagado => formatCurrency(totalPagado);
  String get formattedSaldoPendiente => formatCurrency(saldoPendiente);

  String get fechaCorteText => formatDate(fechaCorte);
  String get inicioVigenciaText => formatDate(inicioVigencia);
  String get finVigenciaText => formatDate(finVigencia);

  int get recibosConPagoCount => recibos.where((r) => r.isPaid).length;

  double get porcentajeAvance => totalAnualEstimado > 0 ? (totalPagado / totalAnualEstimado) : 0.0;
}
