import '../poliza/data.dart' as demo;
import 'policy_model.dart';

/// The same mock policy the Policy Payments screen uses, so both screens show
/// identical (made-up) data with real dates and payment details.
PolicyData samplePolicyData() {
  final p = demo.samplePolicy;
  return PolicyData(
    polizaId: p.number,
    titular: p.people.first,
    asegurados: p.people,
    formaPago: p.paymentFrequency,
    fechaCorte: p.cutoff,
    inicioVigencia: p.start,
    finVigencia: p.end,
    recibos: [
      for (final r in p.receipts)
        ReceiptItem(
          reciboNumber: r.number,
          vigenciaDel: r.from,
          vigenciaAl: r.to,
          importe: r.amount,
          fechaPago: r.paidOn,
          formaPago: r.paymentMethod,
          uuidComplemento: r.uuid,
          folioComplemento: r.folio,
        ),
    ],
  );
}
