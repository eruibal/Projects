import 'policy_model.dart';

// Demo data only: names, policy number, UUIDs and folios are made up.
// Amounts and dates follow a real monthly schedule so the layout is realistic.

// UTC dates keep day differences exact across DST changes.
DateTime _d(int day, int month, int year) => DateTime.utc(year, month, day);

const _transfer = '03 Transferencia electrónica';
const _card = '04 Tarjeta de crédito';

PolicyData samplePolicyData() => PolicyData(
      polizaId: '00000X00',
      titular: 'Titular de Ejemplo',
      asegurados: const [
        'Titular de Ejemplo',
        'Asegurado de Ejemplo 1',
        'Asegurado de Ejemplo 2',
      ],
      formaPago: 'Mensual',
      fechaCorte: _d(31, 10, 2026),
      inicioVigencia: _d(5, 6, 2026),
      finVigencia: _d(5, 6, 2027),
      recibos: [
        ReceiptItem(reciboNumber: 1, vigenciaDel: _d(5, 6, 2026), vigenciaAl: _d(5, 7, 2026), importe: 14133.23, fechaPago: _d(1, 7, 2026), formaPago: _transfer, uuidComplemento: '00000000-0000-4000-8000-000000000001', folioComplemento: 'DEMO 000001'),
        ReceiptItem(reciboNumber: 2, vigenciaDel: _d(5, 7, 2026), vigenciaAl: _d(5, 8, 2026), importe: 11987.24, fechaPago: _d(4, 8, 2026), formaPago: _transfer, uuidComplemento: '00000000-0000-4000-8000-000000000002', folioComplemento: 'DEMO 000002'),
        ReceiptItem(reciboNumber: 3, vigenciaDel: _d(5, 8, 2026), vigenciaAl: _d(5, 9, 2026), importe: 11987.24, fechaPago: _d(1, 9, 2026), formaPago: _transfer, uuidComplemento: '00000000-0000-4000-8000-000000000003', folioComplemento: 'DEMO 000003'),
        ReceiptItem(reciboNumber: 4, vigenciaDel: _d(5, 9, 2026), vigenciaAl: _d(5, 10, 2026), importe: 11987.24, fechaPago: _d(2, 10, 2026), formaPago: _transfer, uuidComplemento: '00000000-0000-4000-8000-000000000004', folioComplemento: 'DEMO 000004'),
        ReceiptItem(reciboNumber: 5, vigenciaDel: _d(5, 10, 2026), vigenciaAl: _d(5, 11, 2026), importe: 11987.24, fechaPago: _d(30, 10, 2026), formaPago: _card),
        for (var i = 6; i <= 12; i++)
          ReceiptItem(
            reciboNumber: i,
            vigenciaDel: _d(5, (i + 4) % 12 + 1, i <= 7 ? 2026 : 2027),
            vigenciaAl: _d(5, (i + 5) % 12 + 1, i <= 6 ? 2026 : 2027),
            importe: 11987.24,
          ),
      ],
    );
